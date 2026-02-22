"""API views for the landmanagement app."""
# pylint: disable=import-error
from django.db.models import Sum
from rest_framework import status, permissions
from rest_framework.decorators import (
    api_view, permission_classes, parser_classes
)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import LandListing, LandImage
from .serializers import (
    LandListingSerializer,
    SoilClimateSerializer,
    AdminLandListingSerializer,
)


# ─── Permission helpers ───────────────────────────────────────
class IsAdminUser(permissions.BasePermission):
    """Grants access only to staff or superuser accounts."""

    def has_permission(self, request, view):  # pylint: disable=unused-argument
        """Return True if the user is staff or superuser."""
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.is_staff or request.user.is_superuser)
        )


# ─── STEP 1: Basic Info ───────────────────────────────────────
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_basic_info(request):
    """Create the basic land listing record (Step 1 of the upload flow)."""
    serializer = LandListingSerializer(
        data=request.data, context={'request': request}
    )
    if serializer.is_valid():
        land = serializer.save()
        return Response({"land_id": land.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── STEP 2: Soil & Climate ───────────────────────────────────
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_soil_climate(request, land_id):
    """Save or update soil/climate data for a land listing (Step 2)."""
    try:
        land = LandListing.objects.get(id=land_id, owner=request.user)
    except LandListing.DoesNotExist:
        return Response(
            {'error': 'Land not found'}, status=status.HTTP_404_NOT_FOUND
        )

    # Allow skipping soil data (all fields optional)
    # Use update_or_create so re-submissions don't fail
    existing = getattr(land, 'soil_data', None)
    if existing:
        serializer = SoilClimateSerializer(
            existing, data=request.data, partial=True
        )
    else:
        serializer = SoilClimateSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(land=land)
        return Response(
            {'message': 'Soil data saved successfully'},
            status=status.HTTP_200_OK,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ─── STEP 3: Multiple Photos ──────────────────────────────────
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_land_images(request, land_id):
    """Upload photo attachments for a land listing (Step 3)."""
    try:
        land = LandListing.objects.get(id=land_id, owner=request.user)
    except LandListing.DoesNotExist:
        return Response(
            {'error': 'Land not found'}, status=status.HTTP_404_NOT_FOUND
        )

    images = request.FILES.getlist('images')
    if not images:
        # Photos are optional — allow proceeding without them
        return Response(
            {'message': 'No images uploaded; listing saved.'},
            status=status.HTTP_200_OK,
        )

    for img in images:
        LandImage.objects.create(land=land, image=img)
    return Response(
        {'message': f'{len(images)} image(s) uploaded successfully'},
        status=status.HTTP_201_CREATED,
    )


# ─── Owner: LIST MY LANDS ─────────────────────────────────────
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def list_user_lands(request):
    """Return all land listings belonging to the authenticated owner."""
    lands = LandListing.objects.filter(
        owner=request.user
    ).order_by('-created_at')
    serializer = LandListingSerializer(
        lands, many=True, context={'request': request}
    )
    return Response(serializer.data, status=status.HTTP_200_OK)


# ─── Public: VERIFIED LANDS for lessees ──────────────────────
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def public_land_listings(request):
    """Return verified, non-flagged lands. Title deed hidden by serializer."""
    lands = LandListing.objects.filter(
        is_verified=True, is_flagged=False
    ).select_related('soil_data').prefetch_related('images').order_by(
        '-created_at'
    )
    serializer = LandListingSerializer(
        lands, many=True, context={'request': request}
    )
    return Response(serializer.data, status=status.HTTP_200_OK)


# ─── Admin: LIST ALL PENDING LANDS ───────────────────────────
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_land_list(request):
    """Return all lands with full details (incl. title deed) for admin."""
    lands = LandListing.objects.select_related(
        'owner', 'soil_data'
    ).prefetch_related('images')
    serializer = AdminLandListingSerializer(
        lands, many=True, context={'request': request}
    )
    return Response(serializer.data, status=status.HTTP_200_OK)


# ─── Admin: VERIFY LAND ───────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAdminUser])
def verify_land(request, land_id):  # pylint: disable=unused-argument
    """Mark a land listing as verified and clear any flag."""
    try:
        land = LandListing.objects.get(id=land_id)
    except LandListing.DoesNotExist:
        return Response(
            {'error': 'Land not found'}, status=status.HTTP_404_NOT_FOUND
        )

    land.is_verified = True
    land.is_flagged = False
    land.flag_reason = None
    land.save(update_fields=['is_verified', 'is_flagged', 'flag_reason'])
    return Response(
        {'message': f"Land '{land.title}' verified successfully."},
        status=status.HTTP_200_OK,
    )


# ─── Admin: FLAG LAND ─────────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAdminUser])
def flag_land(request, land_id):
    """Flag a land listing with a reason and clear its verified status."""
    try:
        land = LandListing.objects.get(id=land_id)
    except LandListing.DoesNotExist:
        return Response(
            {'error': 'Land not found'}, status=status.HTTP_404_NOT_FOUND
        )

    reason = request.data.get('reason', '')
    land.is_flagged = True
    land.is_verified = False
    land.flag_reason = reason
    land.save(update_fields=['is_flagged', 'is_verified', 'flag_reason'])
    return Response(
        {'message': f"Land '{land.title}' flagged.", 'reason': reason},
        status=status.HTTP_200_OK,
    )

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import LandListing
from .serializers import LandListingSerializer

# --- LESSEE VIEW: Browse land ---
@api_view(['GET'])
@permission_classes([AllowAny]) # Allows unregistered users to see the listings
def browse_land(request):
    """
    Uses PublicLandListingSerializer to hide sensitive documents.
    """
    lands = LandListing.objects.filter(is_verified=True, status='Vacant')
    serializer = PublicLandListingSerializer(lands, many=True) 
    return Response(serializer.data)

# --- DASHBOARD STATS ---
class LandownerDashboardStats(APIView):
    """Return aggregated stats for the authenticated land owner's portfolio."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Handle GET — compute and return portfolio stats."""
        lands = LandListing.objects.filter(owner=request.user)

        total_lands = lands.count()
        active_leases = lands.filter(status='Leased').count()
        vacant_lands = lands.filter(status='Vacant').count()
        pending_verifications = lands.filter(
            is_verified=False, is_flagged=False
        ).count()
        flagged_lands = lands.filter(is_flagged=True).count()

        area_result = lands.aggregate(total=Sum('total_area'))
        total_area = float(area_result['total'] or 0)

        # Monthly revenue = sum of price_per_month for all Leased lands
        revenue_result = lands.filter(
            status='Leased'
        ).aggregate(rev=Sum('price_per_month'))
        monthly_revenue = float(revenue_result['rev'] or 0)

        return Response({
            'total_lands': total_lands,
            'active_leases': active_leases,
            'vacant_lands': vacant_lands,
            'pending_verifications': pending_verifications,
            'flagged_lands': flagged_lands,
            'total_area': total_area,
            'monthly_revenue': monthly_revenue,
        })


