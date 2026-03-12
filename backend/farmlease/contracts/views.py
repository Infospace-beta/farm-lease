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
    LeaseAgreementSerializer
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

    # Sign the agreement
    agreement.owner_signed = True
    agreement.owner_signed_at = timezone.now()

    # If both parties signed, activate the agreement
    if agreement.lessee_signed:
        agreement.status = 'active'
        agreement.land.status = 'Leased'
        agreement.land.current_lessee = agreement.lessee
        agreement.land.save()

    agreement.save()

    return Response(
        {'detail': 'Agreement signed successfully.'},
        status=status.HTTP_200_OK
    )
