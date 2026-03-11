"""Serializers for the contracts app."""
from rest_framework import serializers
from .models import LeaseRequest, LeaseAgreement
from landmanagement.models import LandListing
from landmanagement.serializers import LandImageSerializer
from accounts.models import User


class LandBasicSerializer(serializers.Serializer):
    """Basic land information for lease requests."""
    id = serializers.IntegerField()
    title = serializers.CharField()
    location = serializers.CharField(source='location_name', allow_null=True)
    total_area = serializers.DecimalField(max_digits=10, decimal_places=2)
    price_per_month = serializers.DecimalField(max_digits=12, decimal_places=2)
    owner_name = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    def get_owner_name(self, obj):
        if obj.owner:
            name = f"{obj.owner.first_name} {obj.owner.last_name}".strip()
            return name or obj.owner.email
        return "Land Owner"

    def get_images(self, obj):
        return LandImageSerializer(obj.images.all(), many=True).data


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
            'proposed_rent', 'message', 'requested_area', 'status',
            'rejection_reason', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'rejection_reason', 'created_at', 'updated_at']


class LeaseRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating lease requests."""
    
    class Meta:
        model = LeaseRequest
        fields = [
            'land', 'proposed_start_date', 'proposed_end_date',
            'proposed_rent', 'message', 'requested_area'
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
    """Full serializer for lease agreements (includes all contract terms)."""
    land_name = serializers.CharField(source='land.title', read_only=True)
    land_location = serializers.CharField(source='land.location_name', read_only=True)
    land_area = serializers.DecimalField(source='land.total_area', max_digits=10, decimal_places=2, read_only=True)
    land_county = serializers.CharField(source='land.county', read_only=True, default='')
    lessor_name = serializers.SerializerMethodField()
    lessor_id_number = serializers.SerializerMethodField()
    lessee_name = serializers.SerializerMethodField()
    lessee_id_number = serializers.SerializerMethodField()
    lease_request_id = serializers.IntegerField(source='lease_request.id', read_only=True)

    class Meta:
        model = LeaseAgreement
        fields = [
            'id', 'lease_request_id',
            'land', 'land_name', 'land_location', 'land_area', 'land_county',
            'owner', 'lessor_name', 'lessor_id_number',
            'lessee', 'lessee_name', 'lessee_id_number',
            'start_date', 'end_date', 'monthly_rent', 'status',
            # Contract terms
            'intended_use', 'special_conditions',
            # Signatures
            'lessee_signature', 'owner_signature',
            'lessee_signed', 'owner_signed',
            'lessee_signed_at', 'owner_signed_at',
            'lessee_submitted', 'lessee_submitted_at',
            # Witness
            'witness_name', 'witness_id_number', 'witness_phone',
            'witness_signature', 'witness_signed_at',
            'created_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'lease_request_id', 'land', 'owner', 'lessee',
            'land_name', 'land_location', 'land_area', 'land_county',
            'lessor_name', 'lessor_id_number', 'lessee_name', 'lessee_id_number',
            'lessee_signed', 'owner_signed',
            'lessee_signed_at', 'owner_signed_at',
            'lessee_submitted', 'lessee_submitted_at',
            'witness_signed_at',
            'created_at', 'updated_at',
        ]

    def get_lessor_name(self, obj):
        return f"{obj.owner.first_name} {obj.owner.last_name}".strip() or obj.owner.email

    def get_lessor_id_number(self, obj):
        return getattr(obj.owner, 'national_id', '') or ''

    def get_lessee_name(self, obj):
        return f"{obj.lessee.first_name} {obj.lessee.last_name}".strip() or obj.lessee.email

    def get_lessee_id_number(self, obj):
        return getattr(obj.lessee, 'national_id', '') or ''


class LeaseAgreementSubmitSerializer(serializers.Serializer):
    """Used by lessee to fill in contract terms and sign."""
    intended_use = serializers.CharField(max_length=300)
    special_conditions = serializers.CharField(allow_blank=True, default='')
    lessee_signature = serializers.CharField(max_length=5000000)
    witness_name = serializers.CharField(max_length=200)
    witness_id_number = serializers.CharField(max_length=50)
    witness_phone = serializers.CharField(max_length=20)
    witness_signature = serializers.CharField(max_length=5000000, required=False, allow_blank=True, default='')
    # Lessee-confirmed lease terms (optional — override the owner-proposed values)
    agreed_start_date = serializers.DateField(required=False, allow_null=True)
    agreed_end_date = serializers.DateField(required=False, allow_null=True)
    agreed_monthly_rent = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)


class WitnessSignSerializer(serializers.Serializer):
    """Used by witness to add their signature."""
    witness_signature = serializers.CharField(max_length=5000000)
