from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import LandListing, SoilClimateData, LandImage
from .serializers import LandListingSerializer, SoilClimateSerializer

# --- STEP 1: Basic Info ---
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_basic_info(request):
    serializer = LandListingSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        land = serializer.save()
        return Response({"land_id": land.id}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- STEP 2: Soil & Climate ---
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_soil_climate(request, land_id):
    try:
        land = LandListing.objects.get(id=land_id, owner=request.user)
    except LandListing.DoesNotExist:
        return Response({"error": "Land not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = SoilClimateSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(land=land)
        return Response({"message": "Soil data added successfully"}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- STEP 3: Multiple Photos ---
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_land_images(request, land_id):
    try:
        land = LandListing.objects.get(id=land_id, owner=request.user)
    except LandListing.DoesNotExist:
        return Response({"error": "Land not found"}, status=status.HTTP_404_NOT_FOUND)

    images = request.FILES.getlist('images')
    if not images:
        return Response({"error": "No images provided"}, status=status.HTTP_400_BAD_REQUEST)

    for img in images:
        LandImage.objects.create(land=land, image=img)
    return Response({"message": f"{len(images)} images uploaded successfully"}, status=status.HTTP_201_CREATED)

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
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        lands = LandListing.objects.filter(owner=request.user)
        return Response({
            "active_leases": lands.filter(status='Leased').count(),
            "pending_approvals": lands.filter(is_verified=False).count(),
            "total_valuation": "Ksh 45.2M", # Placeholder for actual valuation logic
            "monthly_revenue": "Ksh 450k",  # Placeholder for actual payment logic
        })


