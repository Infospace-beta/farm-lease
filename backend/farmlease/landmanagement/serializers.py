from rest_framework import serializers
from .models import LandListing, SoilClimateData, LandImage

class LandImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandImage
        fields = ['id', 'image']

class SoilClimateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoilClimateData
        fields = '__all__'
        read_only_fields = ('land',)

class LandListingSerializer(serializers.ModelSerializer):
    """
    FULL SERIALIZER: Used by Landowners and Admins.
    Includes sensitive documents like Title Deeds.
    """
    soil_data = SoilClimateSerializer(read_only=True)
    images = LandImageSerializer(many=True, read_only=True)
    summary = serializers.SerializerMethodField()

    class Meta:
        model = LandListing
        fields = [
            'id', 'owner', 'title', 'description', 'total_area', 
            'price_per_month', 'preferred_duration', 'location_name', 
            'has_irrigation', 'has_electricity', 'has_road_access', 
            'has_fencing', 'latitude', 'longitude', 'status', 
            'is_verified', 'soil_data', 'images', 'summary',
            'title_deed_number' # <--- Landowner sees this
        ]
        read_only_fields = ('owner', 'is_verified', 'status')

    def get_summary(self, obj):
        return f"{obj.total_area} Acres in {obj.location_name}"

class PublicLandListingSerializer(LandListingSerializer):
    """
    PUBLIC SERIALIZER: Used by Lessees in the 'Browse' view.
    Excludes the title_deed_document for security.
    """
    class Meta(LandListingSerializer.Meta):
        fields = [
            f for f in LandListingSerializer.Meta.fields 
            if f != 'title_deed_number'
        ]

    def create(self, validated_data):
        # Automatically assign the logged-in user as the owner
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)