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
    """Serializer for land listings with visibility rules per user role."""

    soil_data = SoilClimateSerializer(read_only=True)
    images = LandImageSerializer(many=True, read_only=True)

    class Meta:
        """Meta options."""

        model = LandListing
        fields = '__all__'
        read_only_fields = (
            'owner', 'is_verified', 'is_flagged', 'flag_reason', 'status'
        )
        extra_kwargs = {
            # Title deed is COMPULSORY on submission
            'title_deed_number': {
                'required': True, 'allow_blank': False, 'allow_null': False
            },
            # Lat/Lng are optional
            'latitude':  {'required': False, 'allow_null': True},
            'longitude': {'required': False, 'allow_null': True},
        }

    def create(self, validated_data):
        """Attach the requesting user as owner before saving."""
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
