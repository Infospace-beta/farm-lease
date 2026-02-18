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
    soil_data = SoilClimateSerializer(read_only=True)
    images = LandImageSerializer(many=True, read_only=True)

    class Meta:
        model = LandListing
        fields = '__all__'
        read_only_fields = ('owner', 'is_verified', 'status')

    def create(self, validated_data):
        validated_data['owner'] = self.context['request'].user
        return super().create(validated_data)
    
    def to_representation(self, instance):
        """Hide title_deed_number from non-admin users"""
        representation = super().to_representation(instance)
        request = self.context.get('request')

        # Only show title_deed_number to admin users and the owner
        if request and request.user:
            is_admin = (
                getattr(request.user, 'is_staff', False) or
                getattr(request.user, 'is_superuser', False)
            )
            is_owner = instance.owner == request.user

            if not (is_admin or is_owner):
                representation.pop('title_deed_number', None)

        return representation
