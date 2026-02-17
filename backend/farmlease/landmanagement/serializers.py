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