"""Serializers for the contracts app."""
from rest_framework import serializers
from .models import LeaseRequest, LeaseAgreement
from landmanagement.models import LandListing
from accounts.models import User


class LandBasicSerializer(serializers.Serializer):
    """Basic land information for lease requests."""
    id = serializers.IntegerField()
    title = serializers.CharField()
    location = serializers.CharField(source='location_name', allow_null=True)


class LesseeBasicSerializer(serializers.Serializer):
    """Basic lessee information for lease requests."""
    id = serializers.IntegerField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    profile_image = serializers.ImageField(source='profile_picture', allow_null=True)


class LeaseRequestSerializer(serializers.ModelSerializer):
    """Serializer for lease requests."""
    land = LandBasicSerializer(read_only=True)
    lessee = LesseeBasicSerializer(read_only=True)

    class Meta:
        model = LeaseRequest
        fields = [
            'id', 'land', 'lessee',
            'proposed_start_date', 'proposed_end_date',
            'proposed_rent', 'message', 'status',
            'rejection_reason', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'rejection_reason', 'created_at', 'updated_at']


class LeaseRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating lease requests."""
    
    class Meta:
        model = LeaseRequest
        fields = [
            'land', 'proposed_start_date', 'proposed_end_date',
            'proposed_rent', 'message'
        ]


class LeaseRequestApproveSerializer(serializers.Serializer):
    """Serializer for approving lease requests."""
    escrow_amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False
    )


class LeaseRequestRejectSerializer(serializers.Serializer):
    """Serializer for rejecting lease requests."""
    reason = serializers.CharField(required=True)


class LeaseAgreementSerializer(serializers.ModelSerializer):
    """Serializer for lease agreements."""
    land_name = serializers.CharField(source='land.title', read_only=True)
    lessor_name = serializers.SerializerMethodField()
    lessee_name = serializers.SerializerMethodField()

    class Meta:
        model = LeaseAgreement
        fields = [
            'id', 'land', 'land_name', 'owner', 'lessor_name',
            'lessee', 'lessee_name', 'start_date', 'end_date',
            'monthly_rent', 'status', 'owner_signed', 'lessee_signed',
            'owner_signed_at', 'lessee_signed_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'owner_signed', 'lessee_signed',
            'owner_signed_at', 'lessee_signed_at',
            'created_at', 'updated_at'
        ]

    def get_lessor_name(self, obj):
        """Get the full name of the land owner."""
        return f"{obj.owner.first_name} {obj.owner.last_name}".strip() or obj.owner.email

    def get_lessee_name(self, obj):
        """Get the full name of the lessee."""
        return f"{obj.lessee.first_name} {obj.lessee.last_name}".strip() or obj.lessee.email
