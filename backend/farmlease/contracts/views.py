"""Views for the contracts app."""
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q

from .models import LeaseRequest, LeaseAgreement
from .serializers import (
    LeaseRequestSerializer,
    LeaseRequestCreateSerializer,
    LeaseRequestApproveSerializer,
    LeaseRequestRejectSerializer,
    LeaseAgreementSerializer,
    LeaseAgreementSubmitSerializer,
    WitnessSignSerializer,
)
from landmanagement.models import LandListing


# ========== OWNER ENDPOINTS ==========

class OwnerLeaseRequestListView(generics.ListAPIView):
    """List all lease requests for the authenticated owner's lands."""
    serializer_class = LeaseRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get all lease requests for lands owned by this user
        owner_lands = LandListing.objects.filter(owner=self.request.user)
        queryset = LeaseRequest.objects.filter(land__in=owner_lands)

        # Filter by status if provided
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        # Filter by specific land if provided
        land_filter = self.request.query_params.get('land')
        if land_filter:
            queryset = queryset.filter(land_id=land_filter)

        return queryset


class OwnerLeaseRequestDetailView(generics.RetrieveAPIView):
    """Retrieve details of a specific lease request."""
    serializer_class = LeaseRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure the request is for a land owned by this user
        owner_lands = LandListing.objects.filter(owner=self.request.user)
        return LeaseRequest.objects.filter(land__in=owner_lands)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def approve_lease_request(request, pk):
    """Approve a lease request and create an agreement."""
    # Get the lease request
    owner_lands = LandListing.objects.filter(owner=request.user)
    lease_request = get_object_or_404(
        LeaseRequest,
        pk=pk,
        land__in=owner_lands
    )

    # Check if already processed
    if lease_request.status != 'pending':
        return Response(
            {'detail': 'This lease request has already been processed.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Update the lease request status
    lease_request.status = 'accepted'
    lease_request.save()

    # Create a lease agreement
    agreement = LeaseAgreement.objects.create(
        lease_request=lease_request,
        land=lease_request.land,
        owner=lease_request.land.owner,
        lessee=lease_request.lessee,
        start_date=lease_request.proposed_start_date,
        end_date=lease_request.proposed_end_date,
        monthly_rent=lease_request.proposed_rent or lease_request.land.price_per_month
    )

    # Update land status
    lease_request.land.status = 'Pending_Payment'
    lease_request.land.save()

    # Notify lessee
    try:
        from accounts.models import create_notification
        land_title = lease_request.land.title
        create_notification(
            user=lease_request.lessee,
            title='Lease request approved',
            body=f'Your request for "{land_title}" was approved. Please open the agreement to fill in your details and sign.',
            notif_type='success',
            icon='check_circle',
            related_id=agreement.id,
        )
    except Exception:
        pass

    return Response(
        {
            'detail': 'Lease request approved successfully.',
            'agreement_id': agreement.id
        },
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_lease_request(request, pk):
    """Reject a lease request with a reason."""
    # Get the lease request
    owner_lands = LandListing.objects.filter(owner=request.user)
    lease_request = get_object_or_404(
        LeaseRequest,
        pk=pk,
        land__in=owner_lands
    )

    # Check if already processed
    if lease_request.status != 'pending':
        return Response(
            {'detail': 'This lease request has already been processed.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate the rejection reason
    serializer = LeaseRequestRejectSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Update the lease request
    lease_request.status = 'rejected'
    lease_request.rejection_reason = serializer.validated_data['reason']
    lease_request.save()

    # Notify lessee
    try:
        from accounts.models import create_notification
        land_title = lease_request.land.title
        reason_text = serializer.validated_data['reason']
        create_notification(
            user=lease_request.lessee,
            title='Lease request declined',
            body=f'Your request for "{land_title}" was declined. Reason: {reason_text}',
            notif_type='error',
            icon='cancel',
            related_id=lease_request.id,
        )
    except Exception:
        pass

    return Response(
        {'detail': 'Lease request rejected successfully.'},
        status=status.HTTP_200_OK
    )


# ========== LESSEE ENDPOINTS ==========

class LesseeLeaseRequestListCreateView(generics.ListCreateAPIView):
    """List all lease requests for the authenticated lessee or create a new one."""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return LeaseRequestCreateSerializer
        return LeaseRequestSerializer

    def get_queryset(self):
        # Get all lease requests made by this user
        return LeaseRequest.objects.filter(lessee=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the lessee to the authenticated user
        serializer.save(lessee=self.request.user)


class LesseeLeaseRequestDetailView(generics.RetrieveAPIView):
    """Retrieve details of a specific lease request made by the lessee."""
    serializer_class = LeaseRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LeaseRequest.objects.filter(lessee=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_lease_request(request, pk):
    """Cancel a pending lease request."""
    lease_request = get_object_or_404(
        LeaseRequest,
        pk=pk,
        lessee=request.user
    )

    # Can only cancel pending requests
    if lease_request.status != 'pending':
        return Response(
            {'detail': 'Only pending lease requests can be cancelled.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    lease_request.delete()

    return Response(
        {'detail': 'Lease request cancelled successfully.'},
        status=status.HTTP_200_OK
    )


# ========== AGREEMENTS ==========

class OwnerAgreementListView(generics.ListAPIView):
    """List all agreements for the authenticated owner's lands."""
    serializer_class = LeaseAgreementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = LeaseAgreement.objects.filter(owner=self.request.user)

        # Filter by status if provided
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        return queryset


class OwnerAgreementDetailView(generics.RetrieveAPIView):
    """Retrieve details of a specific agreement."""
    serializer_class = LeaseAgreementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LeaseAgreement.objects.filter(owner=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sign_agreement_owner(request, pk):
    """Owner signs a lease agreement."""
    agreement = get_object_or_404(
        LeaseAgreement,
        pk=pk,
        owner=request.user
    )

    if agreement.owner_signed:
        return Response(
            {'detail': 'You have already signed this agreement.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not agreement.lessee_submitted:
        return Response(
            {'detail': 'Lessee has not yet submitted the agreement for signing.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    owner_signature = request.data.get('owner_signature', '').strip()
    if not owner_signature:
        return Response(
            {'detail': 'Your full name (signature) is required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Sign the agreement
    agreement.owner_signed = True
    agreement.owner_signed_at = timezone.now()
    agreement.owner_signature = owner_signature

    # Notify lessee
    try:
        from accounts.models import create_notification
        land_title = agreement.land.title if agreement.land else 'the land'
        create_notification(
            user=agreement.lessee,
            title='Owner has signed your agreement',
            body=f'The owner has signed the lease agreement for "{land_title}". The lease is now active.' if (agreement.lessee_signed and agreement.witness_signature) else f'The owner has signed the lease agreement for "{land_title}".',
            notif_type='success',
            icon='verified',
            related_id=agreement.id,
        )
    except Exception:
        pass

    # If lessee already signed too, check witness then activate
    if agreement.lessee_signed and agreement.witness_signature:
        agreement.status = 'active'
        agreement.land.status = 'Leased'
        agreement.land.current_lessee = agreement.lessee
        # Partial lease: track how many acres are leased
        req_area = getattr(agreement.lease_request, 'requested_area', None)
        if req_area:
            current = float(agreement.land.leased_area or 0)
            agreement.land.leased_area = current + float(req_area)
        else:
            agreement.land.leased_area = float(agreement.land.total_area)
        agreement.land.save()

    agreement.save()

    return Response(
        {'detail': 'Agreement signed successfully.'},
        status=status.HTTP_200_OK
    )


# ========== LESSEE AGREEMENT ENDPOINTS ==========

class LesseeAgreementListView(generics.ListAPIView):
    """List all lease agreements for the authenticated lessee."""
    serializer_class = LeaseAgreementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = LeaseAgreement.objects.filter(lessee=self.request.user)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset


class LesseeAgreementDetailView(generics.RetrieveAPIView):
    """Retrieve a specific lease agreement for the lessee."""
    serializer_class = LeaseAgreementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LeaseAgreement.objects.filter(lessee=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_agreement_lessee(request, pk):
    """
    Lessee fills in the agreement terms, provides their typed signature,
    and enters witness details. This locks the form and sends it to the owner.
    """
    agreement = get_object_or_404(LeaseAgreement, pk=pk, lessee=request.user)

    if agreement.lessee_submitted:
        return Response(
            {'detail': 'Agreement has already been submitted.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = LeaseAgreementSubmitSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    data = serializer.validated_data
    agreement.intended_use = data['intended_use']
    agreement.special_conditions = data.get('special_conditions', '')
    agreement.lessee_signature = data['lessee_signature']
    agreement.lessee_signed = True
    agreement.lessee_signed_at = timezone.now()
    agreement.witness_name = data['witness_name']
    agreement.witness_id_number = data['witness_id_number']
    agreement.witness_phone = data['witness_phone']
    # Apply lessee-confirmed lease terms if provided
    if data.get('agreed_start_date'):
        agreement.start_date = data['agreed_start_date']
    if data.get('agreed_end_date'):
        agreement.end_date = data['agreed_end_date']
    if data.get('agreed_monthly_rent') is not None:
        agreement.monthly_rent = data['agreed_monthly_rent']
    witness_sig = data.get('witness_signature', '').strip()
    if witness_sig:
        agreement.witness_signature = witness_sig
        agreement.witness_signed_at = timezone.now()
    agreement.lessee_submitted = True
    agreement.lessee_submitted_at = timezone.now()
    agreement.save()

    # Notify owner
    try:
        from accounts.models import create_notification
        land_title = agreement.land.title if agreement.land else 'the land'
        lessee_name = request.user.get_full_name() or request.user.email
        create_notification(
            user=agreement.owner,
            title='Agreement ready for your signature',
            body=f'{lessee_name} has filled and signed the agreement for "{land_title}". Please review and sign.',
            notif_type='info',
            icon='draw',
            related_id=agreement.id,
        )
    except Exception:
        pass

    return Response(
        {'detail': 'Agreement submitted for owner review and signing.'},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sign_agreement_witness(request, pk):
    """
    Witness signs the lease agreement.
    The witness signs AFTER lessee submits but BEFORE the agreement activates.
    In this system the witness signs after both lessee and owner sign.
    """
    agreement = get_object_or_404(LeaseAgreement, pk=pk)

    # Witness must match the registered phone / name — verified by token param
    if agreement.witness_signed_at:
        return Response(
            {'detail': 'Witness has already signed this agreement.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not agreement.lessee_submitted:
        return Response(
            {'detail': 'Agreement not yet submitted by lessee.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    serializer = WitnessSignSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    agreement.witness_signature = serializer.validated_data['witness_signature']
    agreement.witness_signed_at = timezone.now()

    # If both lessee and owner have already signed, activate the lease
    if agreement.lessee_signed and agreement.owner_signed:
        agreement.status = 'active'
        agreement.land.status = 'Leased'
        agreement.land.current_lessee = agreement.lessee
        # Partial lease: track how many acres are leased
        req_area = getattr(agreement.lease_request, 'requested_area', None)
        if req_area:
            current = float(agreement.land.leased_area or 0)
            agreement.land.leased_area = current + float(req_area)
        else:
            agreement.land.leased_area = float(agreement.land.total_area)
        agreement.land.save()

    agreement.save()

    return Response(
        {'detail': 'Witness signature recorded. Lease is now fully executed.'},
        status=status.HTTP_200_OK
    )


# ========== ADMIN ENDPOINTS ==========

class AdminAgreementsView(APIView):
    """Admin view: paginated list of all lease agreements."""
    from accounts.permissions import IsSystemAdmin
    permission_classes = [IsSystemAdmin]

    def get(self, request):
        # lazy import to avoid circular dependency
        from django.core.paginator import Paginator

        qs = LeaseAgreement.objects.select_related(
            'land', 'owner', 'lessee', 'lease_request'
        ).order_by('-created_at')

        # Filter by status
        status_filter = request.query_params.get('status')
        if status_filter and status_filter != 'all':
            qs = qs.filter(status=status_filter)

        # Search by lessee/owner name, email, land title
        search = request.query_params.get('search', '').strip()
        if search:
            qs = qs.filter(
                Q(lessee__first_name__icontains=search) |
                Q(lessee__last_name__icontains=search) |
                Q(lessee__email__icontains=search) |
                Q(owner__first_name__icontains=search) |
                Q(owner__last_name__icontains=search) |
                Q(owner__email__icontains=search) |
                Q(land__title__icontains=search) |
                Q(land__location_name__icontains=search)
            )

        total = qs.count()

        page_size = int(request.query_params.get('page_size', 20))
        page_num = int(request.query_params.get('page', 1))
        paginator = Paginator(qs, page_size)
        page_obj = paginator.get_page(page_num)

        # Counts per status bucket
        all_qs = LeaseAgreement.objects.all()
        counts = {
            'all': all_qs.count(),
            'pending_signature': all_qs.filter(status='pending_signature').count(),
            'active': all_qs.filter(status='active').count(),
            'completed': all_qs.filter(status='completed').count(),
            'terminated': all_qs.filter(status='terminated').count(),
        }

        now = timezone.now().date()

        def fmt_date(d):
            if not d:
                return None
            return d.strftime('%b %d, %Y') if hasattr(d, 'strftime') else str(d)

        def user_initials(user):
            fn = (user.first_name or '')[:1].upper()
            ln = (user.last_name or '')[:1].upper()
            return (fn + ln) or user.email[:2].upper()

        def user_name(user):
            n = f"{user.first_name} {user.last_name}".strip()
            return n or user.email

        def calc_progress(start, end):
            if not start or not end:
                return 0
            total_days = (end - start).days
            if total_days <= 0:
                return 100
            elapsed = (now - start).days
            pct = int((elapsed / total_days) * 100)
            return max(0, min(100, pct))

        def duration_label(start, end):
            if not start or not end:
                return 'N/A'
            days = (end - start).days
            years = days // 365
            months = (days % 365) // 30
            if years > 0:
                return f"{years} Year{'s' if years > 1 else ''}"
            if months > 0:
                return f"{months} Month{'s' if months > 1 else ''}"
            return f"{days} Day{'s' if days != 1 else ''}"

        def status_info(agreement):
            s = agreement.status
            lessee_signed = agreement.lessee_signed
            owner_signed = agreement.owner_signed
            lessee_name = user_name(agreement.lessee)
            owner_name = user_name(agreement.owner)
            if s == 'active':
                end = agreement.end_date
                days_left = (end - now).days if end else 0
                if days_left <= 90:
                    return {
                        'label': 'Expiring Soon',
                        'note': f'Expires in {days_left} day{"s" if days_left != 1 else ""}.',
                        'bg': 'bg-orange-50 border-orange-100 text-orange-700',
                        'dot': 'bg-orange-500',
                    }
                return {
                    'label': 'Active',
                    'note': 'Lease is active.',
                    'bg': 'bg-green-50 border-green-100 text-green-700',
                    'dot': 'bg-green-500',
                }
            if s == 'pending_signature':
                if lessee_signed and not owner_signed:
                    signed_at = fmt_date(agreement.lessee_signed_at)
                    return {
                        'label': 'Pending Lessor',
                        'note': f'Lessee signed {signed_at or ""}. Awaiting {owner_name}.',
                        'bg': 'bg-yellow-50 border-yellow-100 text-yellow-700',
                        'dot': 'bg-yellow-500 animate-pulse',
                    }
                if owner_signed and not lessee_signed:
                    signed_at = fmt_date(agreement.owner_signed_at)
                    return {
                        'label': 'Pending Lessee',
                        'note': f'Lessor signed {signed_at or ""}. Awaiting {lessee_name}.',
                        'bg': 'bg-yellow-50 border-yellow-100 text-yellow-700',
                        'dot': 'bg-yellow-500 animate-pulse',
                    }
                if lessee_signed and owner_signed:
                    signed_at = fmt_date(agreement.owner_signed_at)
                    return {
                        'label': 'Fully Signed',
                        'note': f'Last signed by Lessor on {signed_at or ""}.',
                        'bg': 'bg-green-50 border-green-100 text-green-700',
                        'dot': 'bg-green-500',
                    }
                return {
                    'label': 'Awaiting Lessee',
                    'note': f'Awaiting {lessee_name} to fill and sign.',
                    'bg': 'bg-yellow-50 border-yellow-100 text-yellow-700',
                    'dot': 'bg-yellow-500 animate-pulse',
                }
            if s == 'completed':
                return {
                    'label': 'Completed',
                    'note': 'Lease term has ended.',
                    'bg': 'bg-blue-50 border-blue-100 text-blue-700',
                    'dot': 'bg-blue-500',
                }
            if s == 'terminated':
                return {
                    'label': 'Terminated',
                    'note': 'This lease was terminated early.',
                    'bg': 'bg-red-50 border-red-100 text-red-700',
                    'dot': 'bg-red-500',
                }
            return {
                'label': s.replace('_', ' ').title(),
                'note': '',
                'bg': 'bg-gray-50 border-gray-100 text-gray-700',
                'dot': 'bg-gray-500',
            }

        results = []
        for a in page_obj:
            lessee = a.lessee
            owner = a.owner
            land = a.land
            progress = calc_progress(a.start_date, a.end_date)
            si = status_info(a)
            results.append({
                'id': a.id,
                'ref': f'#FL-{a.id:04d}',
                'created': fmt_date(a.created_at),
                'lessee_name': user_name(lessee),
                'lessee_initials': user_initials(lessee),
                'lessor_name': user_name(owner),
                'lessor_initials': user_initials(owner),
                'land_title': land.title if land else 'N/A',
                'land_area': float(land.total_area) if land else 0,
                'land_location': land.location_name if land else '',
                'land_ref': land.title_deed_number if land else '',
                'start_date': fmt_date(a.start_date),
                'end_date': fmt_date(a.end_date),
                'duration': duration_label(a.start_date, a.end_date),
                'date_range': f"{fmt_date(a.start_date)} – {fmt_date(a.end_date)}" if a.start_date and a.end_date else 'N/A',
                'progress': progress,
                'status': a.status,
                'status_label': si['label'],
                'status_note': si['note'],
                'status_bg': si['bg'],
                'status_dot': si['dot'],
                'lessee_signed': a.lessee_signed,
                'owner_signed': a.owner_signed,
                'can_download': a.lessee_signed and a.owner_signed,
            })

        return Response({
            'counts': counts,
            'total': total,
            'page': page_num,
            'page_size': page_size,
            'total_pages': paginator.num_pages,
            'results': results,
        })
