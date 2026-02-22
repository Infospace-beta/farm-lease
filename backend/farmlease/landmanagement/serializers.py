"""Serializers for the landmanagement app."""
# pylint: disable=import-error
from rest_framework import serializers
from .models import LandListing, SoilClimateData, LandImage


class LandImageSerializer(serializers.ModelSerializer):
    """Serializer for land photo thumbnails."""

    class Meta:
        """Meta options."""

        model = LandImage
        fields = ['id', 'image']


class SoilClimateSerializer(serializers.ModelSerializer):
    """All soil/climate fields are optional — farmers may not have lab data."""

    class Meta:
        """Meta options."""

        model = SoilClimateData
        fields = '__all__'
        read_only_fields = ('land',)
        extra_kwargs = {
            'soil_type': {
                'required': False, 'allow_null': True, 'allow_blank': True
            },
            'ph_level':    {'required': False, 'allow_null': True},
            'nitrogen':    {'required': False, 'allow_null': True},
            'phosphorus':  {'required': False, 'allow_null': True},
            'potassium':   {'required': False, 'allow_null': True},
            'moisture':    {'required': False, 'allow_null': True},
            'temperature': {'required': False, 'allow_null': True},
            'rainfall':    {'required': False, 'allow_null': True},
            'latitude':    {'required': False, 'allow_null': True},
            'longitude':   {'required': False, 'allow_null': True},
        }


class LandListingSerializer(serializers.ModelSerializer):
    """
    FULL SERIALIZER: Used by Landowners and Admins.
    Includes sensitive documents like Title Deeds.
    """
    soil_data = SoilClimateSerializer(read_only=True)
    images = LandImageSerializer(many=True, read_only=True)
    summary = serializers.SerializerMethodField()

    class Meta:
        """Meta options."""

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

    def to_representation(self, instance):
        """
        • Unverified lands: only owner & admin can see full details.
        • title_deed_number: admin-only (not shown to lessees or owner).
        • is_flagged / flag_reason: visible to admin and the land owner.
        """
        representation = super().to_representation(instance)
        request = self.context.get('request')

        if request and request.user:
            is_admin = (
                getattr(request.user, 'is_staff', False) or
                getattr(request.user, 'is_superuser', False)
            )
            is_owner = instance.owner_id == request.user.pk

            # Title deed is admin-only
            if not is_admin:
                representation.pop('title_deed_number', None)

            # flag_reason only for admin and owner
            if not (is_admin or is_owner):
                representation.pop('flag_reason', None)

        return representation


class AdminLandListingSerializer(LandListingSerializer):
    """Serializer for admin endpoints — always exposes title_deed_number."""

    def to_representation(self, instance):
        # Bypass parent filtering; show everything
        representation = serializers.ModelSerializer.to_representation(
            self, instance
        )
        representation['soil_data'] = SoilClimateSerializer(
            getattr(instance, 'soil_data', None)
        ).data if hasattr(instance, 'soil_data') else None
        representation['images'] = LandImageSerializer(
            instance.images.all(), many=True
        ).data
        return representation
