"""Views for the contracts app."""
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone

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
