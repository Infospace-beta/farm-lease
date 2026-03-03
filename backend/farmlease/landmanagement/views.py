"""API views for the landmanagement app."""
# pylint: disable=import-error
from datetime import date
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
    PublicLandListingSerializer,
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
    ).select_related('soil_data').prefetch_related('images').order_by(
        '-created_at'
    )
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
    serializer = PublicLandListingSerializer(
        lands, many=True, context={'request': request}
    )
    return Response(serializer.data, status=status.HTTP_200_OK)


# ─── Admin: LIST ALL PENDING LANDS ───────────────────────────
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_land_list(request):
    """Return all lands with full details (incl. title deed) for admin.
    
    Query Parameters:
        - filter: 'pending' | 'verified' | 'flagged' | 'all' (default: 'all')
    """
    filter_type = request.query_params.get('filter', 'all')
    
    lands = LandListing.objects.select_related(
        'owner', 'soil_data'
    ).prefetch_related('images')
    
    # Apply filter based on query parameter
    if filter_type == 'pending':
        lands = lands.filter(is_verified=False, is_flagged=False)
    elif filter_type == 'verified':
        lands = lands.filter(is_verified=True)
    elif filter_type == 'flagged':
        lands = lands.filter(is_flagged=True)
    # 'all' returns everything (no filter)
    
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
    land.status = 'Vacant'
    land.save(update_fields=['is_verified', 'is_flagged', 'flag_reason', 'status'])
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


# ─── LESSEE VIEW: Browse land ─────────────────────────────────
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def browse_land(request):
    """
    Return available lands for lessees.
    Uses PublicLandListingSerializer to hide sensitive documents.
    """
    lands = LandListing.objects.filter(
        is_verified=True, status='Vacant'
    ).select_related('soil_data').prefetch_related('images')
    serializer = PublicLandListingSerializer(
        lands, many=True, context={'request': request}
    )
    return Response(serializer.data)


# ─── DASHBOARD STATS ──────────────────────────────────────────
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


# ─── ADMIN DASHBOARD STATS ────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):  # pylint: disable=unused-argument
    """Return aggregated stats for admin dashboard."""
    all_lands = LandListing.objects.all()
    
    total_lands = all_lands.count()
    pending_verification = all_lands.filter(
        is_verified=False,
        is_flagged=False
    ).count()
    verified = all_lands.filter(is_verified=True).count()
    flagged = all_lands.filter(is_flagged=True).count()
    
    return Response({
        'total_lands': total_lands,
        'pending_verification': pending_verification,
        'verified': verified,
        'flagged': flagged,
    })


# ─── OWNER NOTIFICATIONS ──────────────────────────────────────
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def owner_notifications(request):
    """Return notifications for the authenticated land owner."""
    lands = LandListing.objects.filter(owner=request.user)
    notifications = []
    
    # Pending verifications
    pending = lands.filter(is_verified=False, is_flagged=False).count()
    if pending > 0:
        notifications.append({
            'id': f'pending-{pending}',
            'icon': 'pending_actions',
            'iconBg': 'bg-amber-50',
            'iconColor': 'text-amber-600',
            'title': f'{pending} land listing{"s" if pending > 1 else ""} awaiting admin verification',
            'msg': 'Your land will be visible to lessees once the admin verifies your Title Deed Number.',
            'time': 'Pending',
            'read': False,
        })
    
    # Flagged lands
    flagged_lands = lands.filter(is_flagged=True)
    for land in flagged_lands:
        notifications.append({
            'id': f'flagged-{land.id}',
            'icon': 'flag',
            'iconBg': 'bg-red-50',
            'iconColor': 'text-red-600',
            'title': f'Land "{land.title}" has been flagged',
            'msg': land.flag_reason or 'Please contact admin for details.',
            'time': 'Recent',
            'read': False,
        })
    
    # Recently verified lands
    verified = lands.filter(is_verified=True).order_by('-created_at')[:2]
    for land in verified:
        notifications.append({
            'id': f'verified-{land.id}',
            'icon': 'verified',
            'iconBg': 'bg-green-50',
            'iconColor': 'text-green-600',
            'title': f'Land "{land.title}" verified',
            'msg': 'Your land is now visible to potential lessees.',
            'time': 'Recent',
            'read': True,
        })
    
    # Vacant lands reminder
    vacant = lands.filter(status='Vacant', is_verified=True).count()
    if vacant > 0:
        notifications.append({
            'id': f'vacant-{vacant}',
            'icon': 'info',
            'iconBg': 'bg-blue-50',
            'iconColor': 'text-blue-600',
            'title': f'{vacant} verified land{"s" if vacant > 1 else ""} available for lease',
            'msg': 'Your lands are ready to receive lease requests.',
            'time': 'Info',
            'read': True,
        })
    
    return Response(notifications[:10])  # Return max 10 notifications


# ─── OWNER ACTIVITY FEED ──────────────────────────────────────
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def owner_activity_feed(request):
    """Return recent activity feed for the authenticated land owner."""
    lands = LandListing.objects.filter(owner=request.user).order_by('-created_at')
    activities = []
    
    # Recently created lands
    for land in lands[:3]:
        days_ago = (date.today() - land.created_at.date()).days
        time_str = (
            'Today' if days_ago == 0 else
            'Yesterday' if days_ago == 1 else
            f'{days_ago} days ago'
        )
        
        if land.is_verified:
            activities.append({
                'dotColor': 'bg-green-500',
                'time': time_str,
                'title': f'Land "{land.title}" listed successfully',
                'body': f'Your {land.total_area} acre plot is now visible to lessees.',
                'type': 'verified',
            })
        elif land.is_flagged:
            activities.append({
                'dotColor': 'bg-red-500',
                'time': time_str,
                'title': f'Land "{land.title}" flagged',
                'body': land.flag_reason or 'Please contact admin.',
                'type': 'flagged',
            })
        else:
            activities.append({
                'dotColor': 'bg-amber-500',
                'time': time_str,
                'title': f'Land "{land.title}" pending verification',
                'body': 'Awaiting admin verification of Title Deed Number.',
                'type': 'pending',
            })
    
    # Add a welcome message if no lands
    if not activities:
        activities.append({
            'dotColor': 'bg-blue-500',
            'time': 'Now',
            'title': 'Welcome to FarmLease',
            'body': 'Start by listing your first land plot.',
            'type': 'info',
        })
    
    return Response(activities[:10])  # Return max 10 activities
