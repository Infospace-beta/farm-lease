"""Serializers for the landmanagement app."""
# pylint: disable=import-error
from rest_framework import serializers
from .models import LandListing, SoilClimateData, LandImage


class SoilClimateSerializer(serializers.ModelSerializer):
    """Serializer for SoilClimateData model."""

    class Meta:
        """Meta configuration for SoilClimateSerializer."""
        model = SoilClimateData
        fields = [
            'id', 'soil_type', 'ph_level', 'nitrogen', 'phosphorus',
            'potassium', 'moisture', 'temperature', 'rainfall',
            'latitude', 'longitude', 'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']


class LandImageSerializer(serializers.ModelSerializer):
    """Serializer for LandImage model."""

    class Meta:
        """Meta configuration for LandImageSerializer."""
        model = LandImage
        fields = ['id', 'image']
        read_only_fields = ['id']


class LandListingSerializer(serializers.ModelSerializer):
    """Serializer for LandListing model."""
    owner_username = serializers.CharField(
        source='owner.username', read_only=True
    )
    soil_data = SoilClimateSerializer(read_only=True)
    images = LandImageSerializer(many=True, read_only=True)

    class Meta:
        """Meta configuration for LandListingSerializer."""
        model = LandListing
        fields = [
            'id', 'owner', 'owner_username', 'title', 'description',
            'total_area', 'price_per_month', 'preferred_duration',
            'title_deed_number', 'has_irrigation', 'has_electricity',
            'has_road_access', 'has_fencing', 'location_name',
            'latitude', 'longitude', 'status', 'is_verified',
            'is_flagged', 'flag_reason', 'current_lessee',
            'created_at', 'soil_data', 'images'
        ]
        read_only_fields = ['owner', 'created_at', 'is_verified']

    def create(self, validated_data):
        """Create a land listing with the current user as owner."""
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)


class PublicLandListingSerializer(serializers.ModelSerializer):
    """Public serializer for LandListing (hides sensitive info)."""
    soil_data = SoilClimateSerializer(read_only=True)
    images = LandImageSerializer(many=True, read_only=True)

    class Meta:
        """Meta configuration for PublicLandListingSerializer."""
        model = LandListing
        fields = [
            'id', 'title', 'description', 'total_area',
            'price_per_month', 'preferred_duration',
            'has_irrigation', 'has_electricity',
            'has_road_access', 'has_fencing',
            'location_name', 'latitude', 'longitude',
            'status', 'soil_data', 'images'
        ]


class AdminLandListingSerializer(serializers.ModelSerializer):
    """Admin serializer for LandListing (includes all fields)."""
    owner_username = serializers.CharField(
        source='owner.username', read_only=True
    )
    owner_email = serializers.CharField(
        source='owner.email', read_only=True
    )
    soil_data = SoilClimateSerializer(read_only=True)
    images = LandImageSerializer(many=True, read_only=True)

    class Meta:
        """Meta configuration for AdminLandListingSerializer."""
        model = LandListing
        fields = [
            'id', 'owner', 'owner_username', 'owner_email',
            'title', 'description', 'total_area', 'price_per_month',
            'preferred_duration', 'title_deed_number',
            'has_irrigation', 'has_electricity', 'has_road_access',
            'has_fencing', 'location_name', 'latitude', 'longitude',
            'status', 'is_verified', 'is_flagged', 'flag_reason',
            'current_lessee', 'created_at', 'soil_data', 'images'
        ]
        read_only_fields = ['owner', 'created_at']

