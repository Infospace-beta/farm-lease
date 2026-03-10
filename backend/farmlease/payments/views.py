"""Views for the payments app."""
import logging
import uuid

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models import Sum, Q
from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal

from .models import Transaction, EscrowAccount
from .serializers import TransactionSerializer, EscrowAccountSerializer
from contracts.models import LeaseAgreement

logger = logging.getLogger(__name__)


# ========== OWNER ENDPOINTS ==========

class OwnerTransactionListView(generics.ListAPIView):
    """List all transactions for the authenticated owner."""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get all agreements where the user is the owner
        owner_agreements = LeaseAgreement.objects.filter(owner=self.request.user)
        
        # Get transactions related to these agreements
        queryset = Transaction.objects.filter(
            Q(agreement__in=owner_agreements) | Q(user=self.request.user)
        )

        # Filter by period if provided
        period = self.request.query_params.get('period')
        if period and period != 'all':
            # Filter based on period (implement as needed)
            pass

        # Filter by type if provided
        transaction_type = self.request.query_params.get('type')
        if transaction_type:
            queryset = queryset.filter(transaction_type=transaction_type)

        # Filter by status if provided
        transaction_status = self.request.query_params.get('status')
        if transaction_status:
            queryset = queryset.filter(status=transaction_status)

        return queryset


class OwnerTransactionDetailView(generics.RetrieveAPIView):
    """Retrieve details of a specific transaction."""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        owner_agreements = LeaseAgreement.objects.filter(owner=self.request.user)
        return Transaction.objects.filter(
            Q(agreement__in=owner_agreements) | Q(user=self.request.user)
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def owner_revenue_summary(request):
    """Get revenue summary for the owner."""
    # Get all agreements where the user is the owner
    owner_agreements = LeaseAgreement.objects.filter(owner=request.user)
    
    # Calculate total revenue (completed transactions)
    completed_transactions = Transaction.objects.filter(
        agreement__in=owner_agreements,
        status='completed',
        transaction_type='rent_payment'
    )
    
    # Year-to-date revenue
    year_start = datetime(timezone.now().year, 1, 1)
    ytd_revenue = completed_transactions.filter(
        created_at__gte=year_start
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
    
    # Monthly revenue (last 30 days)
    month_start = timezone.now() - timedelta(days=30)
    monthly_revenue = completed_transactions.filter(
        created_at__gte=month_start
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
    
    # Escrow balance
    escrow_balance = EscrowAccount.objects.filter(
        agreement__in=owner_agreements,
        status='active'
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
    
    # Calculate changes (for now, just return dummy percentages)
    ytd_change_percent = 15.2  # TODO: Calculate actual change
    monthly_change_percent = 8.5  # TODO: Calculate actual change
    
    return Response({
        'total_revenue_ytd': float(ytd_revenue),
        'monthly_revenue': float(monthly_revenue),
        'in_escrow': float(escrow_balance),
        'ytd_change_percent': ytd_change_percent,
        'monthly_change_percent': monthly_change_percent,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def owner_revenue_chart(request):
    """Get revenue chart data for the owner."""
    # Get period from query params (default to 7 months)
    period = request.query_params.get('period', '7months')
    
    # For now, return dummy data
    # TODO: Calculate actual revenue data per month
    dummy_data = {
        'labels': ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
        'values': [125000, 180000, 215000, 190000, 245000, 280000, 320000]
    }
    
    return Response(dummy_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def request_withdrawal(request):
    """Request a withdrawal of funds."""
    amount = request.data.get('amount')
    phone = request.data.get('phone')
    
    if not amount or not phone:
        return Response(
            {'detail': 'Amount and phone number are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Create a withdrawal transaction
    transaction = Transaction.objects.create(
        transaction_id=f"WD-{timezone.now().timestamp()}",
        user=request.user,
        amount=amount,
        transaction_type='withdrawal',
        status='pending',
        description=f"Withdrawal request to {phone}",
        phone_number=phone
    )
    
    return Response(
        {
            'detail': 'Withdrawal request submitted successfully.',
            'transaction_id': transaction.transaction_id
        },
        status=status.HTTP_201_CREATED
    )


# ========== ESCROW ENDPOINTS ==========

class OwnerEscrowListView(generics.ListAPIView):
    """List all escrow accounts for the owner."""
    serializer_class = EscrowAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        owner_agreements = LeaseAgreement.objects.filter(owner=self.request.user)
        queryset = EscrowAccount.objects.filter(agreement__in=owner_agreements)
        
        # Filter by status if provided
        escrow_status = self.request.query_params.get('status')
        if escrow_status:
            queryset = queryset.filter(status=escrow_status)
        
        return queryset


class OwnerEscrowDetailView(generics.RetrieveAPIView):
    """Retrieve details of a specific escrow account."""
    serializer_class = EscrowAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        owner_agreements = LeaseAgreement.objects.filter(owner=self.request.user)
        return EscrowAccount.objects.filter(agreement__in=owner_agreements)


# ========== LESSEE ENDPOINTS ==========

class LesseePaymentListView(generics.ListAPIView):
    """List all transactions for the authenticated lessee."""
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        transaction_status = self.request.query_params.get('status')
        if transaction_status:
            queryset = queryset.filter(status=transaction_status)
        return queryset


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def initiate_payment(request):
    """
    Initiate an escrow payment for a lease agreement.

    Body:
        lease   (int)    – LeaseAgreement pk
        amount  (number) – Amount in KES
        method  (str)    – 'escrow' (only supported method)
    """
    lease_id = request.data.get('lease')
    amount = request.data.get('amount')
    method = request.data.get('method', 'escrow')

    if not lease_id or not amount:
        return Response(
            {'detail': 'lease and amount are required.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        amount = int(Decimal(str(amount)))
    except Exception:
        return Response({'detail': 'Invalid amount.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        agreement = LeaseAgreement.objects.get(pk=lease_id, lessee=request.user)
    except LeaseAgreement.DoesNotExist:
        return Response({'detail': 'Lease agreement not found.'}, status=status.HTTP_404_NOT_FOUND)

    if method == 'escrow':
        txn_id = f"ESC-{uuid.uuid4().hex[:12].upper()}"
        Transaction.objects.create(
            transaction_id=txn_id,
            user=request.user,
            agreement=agreement,
            amount=amount,
            transaction_type='rent_payment',
            status='in_escrow',
            payment_method='escrow',
            description=f"Escrow payment for lease #{lease_id}",
        )
        EscrowAccount.objects.get_or_create(
            agreement=agreement,
            defaults={'amount': Decimal(amount), 'status': 'active'},
        )
        return Response(
            {'detail': 'Payment held in escrow.', 'transaction_id': txn_id},
            status=status.HTTP_201_CREATED,
        )

    return Response({'detail': 'Unsupported payment method.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transaction_status(request, transaction_id: str):
    """Return the current status of a single transaction owned by the requesting user."""
    try:
        txn = Transaction.objects.get(transaction_id=transaction_id, user=request.user)
    except Transaction.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
    return Response({
        'transaction_id': txn.transaction_id,
        'status': txn.status,
        'mpesa_receipt': txn.mpesa_receipt,
        'amount': float(txn.amount),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lessee_escrow_balance(request):
    """Return the authenticated lessee's total escrow balance."""
    agreements = LeaseAgreement.objects.filter(lessee=request.user)
    balance = EscrowAccount.objects.filter(
        agreement__in=agreements, status='active'
    ).aggregate(total=Sum('amount'))['total'] or Decimal('0')
    return Response({'balance': float(balance)})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def release_escrow(request, payment_id: int):
    """Release an escrow payment to the owner (lessee-initiated)."""
    try:
        transaction = Transaction.objects.get(pk=payment_id, user=request.user, status='in_escrow')
    except Transaction.DoesNotExist:
        return Response({'detail': 'Escrow transaction not found.'}, status=status.HTTP_404_NOT_FOUND)

    transaction.status = 'completed'
    transaction.save(update_fields=['status', 'updated_at'])
    return Response({'detail': 'Escrow released.'})


