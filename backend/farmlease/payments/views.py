"""Views for the payments app."""

from __future__ import annotations

import csv
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from uuid import uuid4

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Sum
from django.db.models import Q
from rest_framework import generics, serializers, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from contracts.models import LeaseAgreement
from .escrow_utils import ensure_escrow_for_agreement, hold_payment_in_escrow, try_release_escrow
from .models import EscrowAccount, Transaction
from .mpesa_utils import MpesaClient
from .serializers import EscrowAccountSerializer, TransactionSerializer


def _normalize_phone(phone_number: str) -> str | None:
	"""Normalize Kenya phone numbers to 2547XXXXXXXX format."""
	digits = "".join(ch for ch in str(phone_number) if ch.isdigit())
	if digits.startswith("0") and len(digits) == 10:
		return f"254{digits[1:]}"
	if digits.startswith("7") and len(digits) == 9:
		return f"254{digits}"
	if digits.startswith("254") and len(digits) == 12:
		return digits
	return None


class InitiateMpesaPaymentSerializer(serializers.Serializer):
	"""Input serializer for STK push initiation."""

	lease_agreement_id = serializers.IntegerField()
	phone_number = serializers.CharField(max_length=20)
	amount = serializers.DecimalField(max_digits=12, decimal_places=2)


class MyPaymentsView(generics.ListAPIView):
	"""List payments for the logged-in user."""

	permission_classes = [IsAuthenticated]
	serializer_class = TransactionSerializer

	def get_queryset(self):
		return Transaction.objects.filter(
			user=self.request.user,
			transaction_type__in=['rent_payment', 'escrow_hold', 'escrow_release'],
		).select_related('agreement', 'agreement__land').order_by('-created_at')


class MpesaInitiateView(APIView):
	"""Initiate M-Pesa STK push for a lease agreement."""

	permission_classes = [IsAuthenticated]

	def post(self, request):
		serializer = InitiateMpesaPaymentSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		agreement = get_object_or_404(
			LeaseAgreement,
			id=serializer.validated_data['lease_agreement_id'],
			lessee=request.user,
		)

		normalized_phone = _normalize_phone(serializer.validated_data['phone_number'])
		if not normalized_phone:
			return Response(
				{'error': 'Enter a valid Kenyan M-Pesa number (e.g. 07XXXXXXXX).'},
				status=status.HTTP_400_BAD_REQUEST,
			)

		try:
			amount = Decimal(serializer.validated_data['amount'])
		except (InvalidOperation, TypeError, ValueError):
			return Response({'error': 'Invalid amount.'}, status=status.HTTP_400_BAD_REQUEST)

		if amount <= 0:
			return Response({'error': 'Amount must be greater than 0.'}, status=status.HTTP_400_BAD_REQUEST)

		mpesa = MpesaClient()
		if not mpesa.is_configured():
			issues = mpesa.config_issues()
			return Response(
				{
					'error': (
						'M-Pesa is not configured on the server. '
						'Set MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, '
						'MPESA_SHORTCODE, MPESA_PASSKEY, and MPESA_CALLBACK_URL in backend/.env.'
					),
					'details': issues,
				},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)

		transaction = Transaction.objects.create(
			transaction_id=f"TXN-{uuid4().hex[:16].upper()}",
			user=request.user,
			agreement=agreement,
			amount=amount,
			transaction_type='rent_payment',
			status='pending',
			payment_method='mpesa',
			phone_number=normalized_phone,
			description=f"phone={normalized_phone}",
		)
		ensure_escrow_for_agreement(agreement)

		callback_url = mpesa.callback_url or request.build_absolute_uri('/api/payments/mpesa/callback/')
		amount_for_stk = int(amount.to_integral_value(rounding=ROUND_HALF_UP))

		ok, payload = mpesa.initiate_stk_push(
			amount=amount_for_stk,
			phone_number=normalized_phone,
			account_reference=f"LEASE-{agreement.id}",
			transaction_desc=f"Lease payment for agreement {agreement.id}",
			callback_url=callback_url,
		)

		if not ok:
			raw = payload.get('raw', {}) if isinstance(payload, dict) else {}
			error_code = raw.get('errorCode') if isinstance(raw, dict) else None
			error_message = payload.get('error', 'M-Pesa initiation failed')
			if error_code == '500.001.1001':
				error_message = (
					'M-Pesa rejected credentials for STK push (error 500.001.1001). '
					'Use matching credentials from the same Daraja app: '
					'MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, and MPESA_PASSKEY.'
				)
			transaction.status = 'failed'
			transaction.description = f"{transaction.description};error={error_message}"
			transaction.save(update_fields=['status', 'description', 'updated_at'])
			return Response(
				{'error': error_message, 'error_code': error_code},
				status=status.HTTP_400_BAD_REQUEST,
			)

		checkout_request_id = payload.get('CheckoutRequestID')
		merchant_request_id = payload.get('MerchantRequestID')
		transaction.checkout_request_id = checkout_request_id
		transaction.status = 'stk_initiated'
		transaction.description = (
			f"phone={normalized_phone};checkout={checkout_request_id};merchant={merchant_request_id}"
		)
		transaction.save(update_fields=['checkout_request_id', 'status', 'description', 'updated_at'])

		return Response(
			{
				'success': True,
				'message': payload.get('CustomerMessage', 'STK push sent. Check your phone to complete payment.'),
				'transaction_id': transaction.transaction_id,
				'checkout_request_id': checkout_request_id,
				'status': transaction.status,
				'escrow': 'Funds will be held in escrow until both lessee and owner have signed the agreement.',
			},
			status=status.HTTP_200_OK,
		)


class MpesaCallbackView(APIView):
	"""Receive M-Pesa STK callback updates."""

	permission_classes = [AllowAny]

	def post(self, request):
		callback = request.data.get('Body', {}).get('stkCallback', {})
		checkout_request_id = callback.get('CheckoutRequestID')
		result_code = callback.get('ResultCode')
		result_desc = callback.get('ResultDesc', '')

		if not checkout_request_id:
			return Response({'detail': 'Missing CheckoutRequestID'}, status=status.HTTP_400_BAD_REQUEST)

		transaction = Transaction.objects.filter(
			checkout_request_id=checkout_request_id
		).select_related('agreement').first()

		if not transaction:
			return Response({'detail': 'Transaction not found'}, status=status.HTTP_200_OK)

		if str(result_code) == '0':
			receipt_number = None
			callback_metadata = callback.get('CallbackMetadata', {}).get('Item', [])
			for item in callback_metadata:
				if item.get('Name') == 'MpesaReceiptNumber':
					receipt_number = item.get('Value')
					break

			transaction.status = 'completed'
			transaction.mpesa_result_code = '0'
			transaction.mpesa_result_desc = result_desc
			transaction.mpesa_receipt = receipt_number
			extra = f";result=success"
			if receipt_number:
				extra += f";receipt={receipt_number}"
			transaction.description = f"{transaction.description}{extra}"
			transaction.save(
				update_fields=['status', 'mpesa_result_code', 'mpesa_result_desc', 'mpesa_receipt', 'description', 'updated_at']
			)

			if transaction.agreement:
				hold_payment_in_escrow(transaction)
				try_release_escrow(transaction.agreement)
		else:
			transaction.status = 'failed'
			transaction.mpesa_result_code = str(result_code)
			transaction.mpesa_result_desc = result_desc
			transaction.description = f"{transaction.description};result=failed;reason={result_desc}"
			transaction.save(
				update_fields=['status', 'mpesa_result_code', 'mpesa_result_desc', 'description', 'updated_at']
			)

		return Response({'ResultCode': 0, 'ResultDesc': 'Accepted'}, status=status.HTTP_200_OK)


class PaymentStatusView(APIView):
	"""Return status for a specific transaction ID."""

	permission_classes = [IsAuthenticated]

	def get(self, request, transaction_id: str):
		transaction = get_object_or_404(
			Transaction,
			transaction_id=transaction_id,
			user=request.user,
		)
		return Response(TransactionSerializer(transaction).data, status=status.HTTP_200_OK)


class LesseeEscrowBalanceView(APIView):
	"""Return escrow totals for the authenticated lessee."""

	permission_classes = [IsAuthenticated]

	def get(self, request):
		escrows = EscrowAccount.objects.filter(agreement__lessee=request.user)
		held = sum((e.held_amount for e in escrows), 0)
		released = sum((e.released_amount for e in escrows), 0)
		return Response(
			{
				'held_amount': held,
				'released_amount': released,
				'accounts': EscrowAccountSerializer(escrows, many=True).data,
			},
			status=status.HTTP_200_OK,
		)


class ReleaseEscrowView(APIView):
	"""Manual escrow release endpoint for owner/admin fallback."""

	permission_classes = [IsAuthenticated]

	def post(self, request, payment_id: int):
		escrow = get_object_or_404(EscrowAccount, id=payment_id)
		if request.user != escrow.agreement.owner and not request.user.is_superuser:
			return Response({'error': 'You are not allowed to release this escrow.'}, status=status.HTTP_403_FORBIDDEN)

		released = try_release_escrow(escrow.agreement)
		if not released:
			return Response(
				{'error': 'Escrow cannot be released yet. Both lessee and owner must sign, and payment must be received.'},
				status=status.HTTP_400_BAD_REQUEST,
			)
		return Response({'success': True, 'message': 'Escrow released to land owner.'}, status=status.HTTP_200_OK)


class OwnerEscrowListView(APIView):
	"""Owner escrow overview with summary + list for UI display."""

	permission_classes = [IsAuthenticated]

	def get(self, request):
		escrows = EscrowAccount.objects.filter(
			agreement__owner=request.user
		).select_related('agreement', 'agreement__land', 'agreement__lessee').order_by('-created_at')

		status_filter = request.query_params.get('status')
		if status_filter in {'released', 'holding', 'pending'}:
			if status_filter == 'released':
				escrows = escrows.filter(status='released')
			elif status_filter == 'holding':
				escrows = escrows.exclude(status__in=['released', 'refunded'])
			elif status_filter == 'pending':
				escrows = escrows.filter(amount_received=False)

		now = timezone.now()
		released_this_month = Decimal('0')
		total_in_escrow = Decimal('0')
		pending_deposit = Decimal('0')

		rows = []
		for escrow in escrows:
			total_in_escrow += escrow.held_amount
			if escrow.released_at and escrow.released_at.year == now.year and escrow.released_at.month == now.month:
				released_this_month += escrow.released_amount
			if not escrow.amount_received:
				pending_deposit += escrow.amount

			if escrow.status == 'released':
				uistatus = 'released'
			elif not escrow.amount_received:
				uistatus = 'pending'
			else:
				uistatus = 'holding'

			stages = [
				{
					'label': 'Deposit',
					'done': bool(escrow.amount_received),
					'date': escrow.amount_received_at.isoformat() if escrow.amount_received_at else 'Pending',
				},
				{
					'label': 'Lessee Signed',
					'done': bool(escrow.lessee_agreed),
					'date': escrow.lessee_signed_at.isoformat() if escrow.lessee_signed_at else 'Pending',
				},
				{
					'label': 'Owner Signed',
					'done': bool(escrow.owner_signed),
					'date': escrow.owner_signed_at.isoformat() if escrow.owner_signed_at else 'Pending',
				},
				{
					'label': 'Released',
					'done': escrow.status == 'released',
					'date': escrow.released_at.isoformat() if escrow.released_at else 'Pending',
				},
			]

			rows.append({
				'id': escrow.id,
				'agreement_id': escrow.agreement_id,
				'land_title': escrow.agreement.land.title,
				'lessee_name': f"{escrow.agreement.lessee.first_name} {escrow.agreement.lessee.last_name}".strip() or escrow.agreement.lessee.email,
				'amount': escrow.amount,
				'held_amount': escrow.held_amount,
				'released_amount': escrow.released_amount,
				'deposited_date': escrow.amount_received_at,
				'release_date': escrow.released_at,
				'status': uistatus,
				'stages': stages,
			})

		return Response(
			{
				'summary': {
					'total_in_escrow': total_in_escrow,
					'released_this_month': released_this_month,
					'pending_deposit': pending_deposit,
				},
				'escrows': rows,
			},
			status=status.HTTP_200_OK,
		)


class OwnerEscrowDetailView(APIView):
	"""Detailed escrow account for an owner."""

	permission_classes = [IsAuthenticated]

	def get(self, request, pk: int):
		escrow = get_object_or_404(
			EscrowAccount.objects.select_related('agreement', 'agreement__land', 'agreement__lessee'),
			id=pk,
			agreement__owner=request.user,
		)
		return Response(EscrowAccountSerializer(escrow).data, status=status.HTTP_200_OK)


class OwnerTransactionListView(APIView):
	"""List owner-facing transactions for financials UI."""

	permission_classes = [IsAuthenticated]

	def get(self, request):
		queryset = Transaction.objects.filter(
			Q(agreement__owner=request.user, transaction_type__in=['escrow_hold', 'escrow_release', 'rent_payment'])
			| Q(user=request.user, transaction_type='withdrawal')
		).select_related('agreement', 'agreement__land', 'agreement__lessee').order_by('-created_at')

		rows = []
		for t in queryset:
			if t.transaction_type == 'withdrawal':
				type_value = 'pending' if t.status == 'pending' else 'credit'
				status_value = 'Pending' if t.status == 'pending' else 'Completed'
			elif t.transaction_type == 'escrow_release' or t.status == 'completed':
				type_value = 'credit'
				status_value = 'Completed'
			elif t.status in {'in_escrow', 'stk_initiated', 'pending'}:
				type_value = 'escrow'
				status_value = 'In Escrow'
			else:
				type_value = 'pending'
				status_value = 'Pending'

			rows.append(
				{
					'id': t.transaction_id,
					'land_title': (
						t.agreement.land.title if t.agreement and t.agreement.land
						else ('Withdrawal' if t.transaction_type == 'withdrawal' else 'N/A')
					),
					'lessee_name': (
						f"{t.agreement.lessee.first_name} {t.agreement.lessee.last_name}".strip()
						if t.agreement and t.agreement.lessee else request.user.email
					),
					'amount': t.amount,
					'type': type_value,
					'date': t.created_at,
					'status': status_value,
				}
			)

		return Response({'results': rows}, status=status.HTTP_200_OK)


class OwnerTransactionDetailView(APIView):
	"""Transaction detail for owner."""

	permission_classes = [IsAuthenticated]

	def get(self, request, id: str):
		transaction = get_object_or_404(
			Transaction.objects.select_related('agreement', 'agreement__land', 'agreement__lessee'),
			transaction_id=id,
			agreement__owner=request.user,
		)
		return Response(TransactionSerializer(transaction).data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def owner_revenue_summary(request):
	"""Owner revenue summary used by owner financial dashboard."""
	escrows = EscrowAccount.objects.filter(agreement__owner=request.user)
	transactions = Transaction.objects.filter(agreement__owner=request.user)

	total_revenue_ytd = transactions.filter(
		transaction_type='escrow_release',
		status='completed',
		created_at__year=timezone.now().year,
	).aggregate(total=Sum('amount'))['total'] or Decimal('0')

	monthly_revenue = transactions.filter(
		transaction_type='escrow_release',
		status='completed',
		created_at__year=timezone.now().year,
		created_at__month=timezone.now().month,
	).aggregate(total=Sum('amount'))['total'] or Decimal('0')

	in_escrow = sum((e.held_amount for e in escrows), Decimal('0'))
	pending_withdrawals = Transaction.objects.filter(
		user=request.user,
		transaction_type='withdrawal',
		status='pending',
	).aggregate(total=Sum('amount'))['total'] or Decimal('0')
	available_for_withdrawal = monthly_revenue + (total_revenue_ytd - monthly_revenue)
	available_for_withdrawal = max(Decimal('0'), available_for_withdrawal - pending_withdrawals)

	return Response(
		{
			'total_revenue_ytd': total_revenue_ytd,
			'monthly_revenue': monthly_revenue,
			'in_escrow': in_escrow,
			'pending_withdrawals': pending_withdrawals,
			'available_for_withdrawal': available_for_withdrawal,
			'ytd_change_percent': 0.0,
			'monthly_change_percent': 0.0,
		},
		status=status.HTTP_200_OK,
	)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def owner_revenue_chart(request):
	"""Return a simple 7-month revenue chart for owner dashboard."""
	now = timezone.now()
	labels = []
	values = []

	for i in range(6, -1, -1):
		target_month = (now.month - i - 1) % 12 + 1
		target_year = now.year - (1 if now.month - i <= 0 else 0)
		labels.append(timezone.datetime(target_year, target_month, 1).strftime('%b'))
		month_total = Transaction.objects.filter(
			agreement__owner=request.user,
			transaction_type='escrow_release',
			status='completed',
			created_at__year=target_year,
			created_at__month=target_month,
		).aggregate(total=Sum('amount'))['total'] or Decimal('0')
		values.append(float(month_total))

	return Response({'labels': labels, 'values': values}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_withdrawal(request):
	"""Create owner withdrawal request from released escrow earnings."""
	if getattr(request.user, 'role', None) not in {'landowner', 'admin'}:
		return Response({'detail': 'Only land owners can request withdrawals.'}, status=status.HTTP_403_FORBIDDEN)

	amount = request.data.get('amount')
	phone = request.data.get('phone')
	if not amount or not phone:
		return Response({'detail': 'amount and phone are required'}, status=status.HTTP_400_BAD_REQUEST)

	try:
		amount = Decimal(str(amount))
	except Exception:
		return Response({'detail': 'Invalid amount.'}, status=status.HTTP_400_BAD_REQUEST)

	if amount <= 0:
		return Response({'detail': 'Amount must be greater than zero.'}, status=status.HTTP_400_BAD_REQUEST)

	normalized_phone = _normalize_phone(str(phone))
	if not normalized_phone:
		return Response({'detail': 'Enter a valid Kenyan phone number (07XXXXXXXX).'}, status=status.HTTP_400_BAD_REQUEST)

	released_total = Transaction.objects.filter(
		agreement__owner=request.user,
		transaction_type='escrow_release',
		status='completed',
	).aggregate(total=Sum('amount'))['total'] or Decimal('0')

	reserved_total = Transaction.objects.filter(
		user=request.user,
		transaction_type='withdrawal',
		status__in=['pending', 'completed'],
	).aggregate(total=Sum('amount'))['total'] or Decimal('0')

	available_balance = released_total - reserved_total
	if amount > available_balance:
		return Response(
			{
				'detail': 'Insufficient available balance for withdrawal.',
				'available_balance': available_balance,
			},
			status=status.HTTP_400_BAD_REQUEST,
		)

	transaction = Transaction.objects.create(
		transaction_id=f"WDR-{uuid4().hex[:12].upper()}",
		user=request.user,
		agreement=None,
		amount=amount,
		transaction_type='withdrawal',
		status='pending',
		payment_method='mpesa',
		phone_number=normalized_phone,
		description=f'Owner withdrawal request to {normalized_phone}',
	)
	return Response(
		{
			'detail': 'Withdrawal request created',
			'transaction_id': transaction.transaction_id,
			'status': transaction.status,
			'available_balance': max(Decimal('0'), available_balance - amount),
		},
		status=status.HTTP_201_CREATED,
	)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def owner_download_statement(request):
	"""Download owner financial statement as CSV."""
	period = (request.query_params.get('period') or 'all').lower()
	now = timezone.now()

	transactions = Transaction.objects.filter(
		Q(agreement__owner=request.user, transaction_type__in=['escrow_hold', 'escrow_release', 'rent_payment'])
		| Q(user=request.user, transaction_type='withdrawal')
	).select_related('agreement', 'agreement__land', 'agreement__lessee').order_by('-created_at')

	if period == 'ytd':
		transactions = transactions.filter(created_at__year=now.year)
	elif period == 'month':
		transactions = transactions.filter(created_at__year=now.year, created_at__month=now.month)

	total_released = transactions.filter(
		transaction_type='escrow_release',
		status='completed',
	).aggregate(total=Sum('amount'))['total'] or Decimal('0')

	total_withdrawn = transactions.filter(
		transaction_type='withdrawal',
		status__in=['pending', 'completed'],
	).aggregate(total=Sum('amount'))['total'] or Decimal('0')

	response = HttpResponse(content_type='text/csv')
	filename = f"owner_statement_{request.user.id}_{now.strftime('%Y%m%d_%H%M%S')}.csv"
	response['Content-Disposition'] = f'attachment; filename="{filename}"'

	writer = csv.writer(response)
	writer.writerow(['FarmLease Owner Statement'])
	writer.writerow(['Generated At', now.isoformat()])
	writer.writerow(['Owner Email', request.user.email])
	writer.writerow(['Period', period])
	writer.writerow(['Total Released (KES)', str(total_released)])
	writer.writerow(['Total Withdrawn/Reserved (KES)', str(total_withdrawn)])
	writer.writerow(['Available Balance (KES)', str(max(Decimal('0'), total_released - total_withdrawn))])
	writer.writerow([])
	writer.writerow([
		'Transaction ID', 'Date', 'Type', 'Status', 'Amount (KES)',
		'Land Title', 'Lessee', 'Phone', 'Description'
	])

	for t in transactions:
		land_title = t.agreement.land.title if t.agreement and t.agreement.land else ''
		lessee_name = ''
		if t.agreement and t.agreement.lessee:
			lessee_name = f"{t.agreement.lessee.first_name} {t.agreement.lessee.last_name}".strip() or t.agreement.lessee.email
		writer.writerow([
			t.transaction_id,
			t.created_at.isoformat() if t.created_at else '',
			t.transaction_type,
			t.status,
			str(t.amount),
			land_title,
			lessee_name,
			t.phone_number or '',
			t.description or '',
		])

	return response
