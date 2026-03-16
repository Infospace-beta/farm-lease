"""Serializers for the payments app."""
from rest_framework import serializers
from .models import EscrowAccount, Transaction


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for transactions."""
    land_title = serializers.SerializerMethodField()
    land_name = serializers.SerializerMethodField()
    lessee_name = serializers.SerializerMethodField()
    agreement_id = serializers.IntegerField(source='agreement.id', read_only=True)
    payment_method = serializers.SerializerMethodField()
    mpesa_code = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_id', 'land_title', 'lessee_name',
            'land_name', 'agreement_id', 'payment_method', 'mpesa_code',
            'amount', 'transaction_type', 'status', 'description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'transaction_id', 'created_at', 'updated_at']

    def get_land_title(self, obj):
        """Get the land title if transaction is related to an agreement."""
        if obj.agreement:
            return obj.agreement.land.title
        return "N/A"

    def get_land_name(self, obj):
        """Frontend-friendly alias for land title."""
        return self.get_land_title(obj)

    def get_lessee_name(self, obj):
        """Get the lessee name if transaction is related to an agreement."""
        if obj.agreement:
            lessee = obj.agreement.lessee
            return f"{lessee.first_name} {lessee.last_name}".strip() or lessee.email
        return "N/A"

    def get_payment_method(self, obj):
        """Current payment method for lease transactions."""
        return obj.payment_method or "mpesa"

    def get_mpesa_code(self, obj):
        """Return M-Pesa receipt/check-out identifier when available."""
        return obj.mpesa_receipt or obj.checkout_request_id


class EscrowAccountSerializer(serializers.ModelSerializer):
    """Serializer for escrow account state."""

    agreement_id = serializers.IntegerField(source='agreement.id', read_only=True)
    land_name = serializers.CharField(source='agreement.land.title', read_only=True)
    land_title = serializers.CharField(source='agreement.land.title', read_only=True)
    lessee_name = serializers.SerializerMethodField()
    held_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = EscrowAccount
        fields = [
            'id', 'agreement_id', 'land_name', 'amount', 'held_amount',
            'land_title', 'lessee_name',
            'released_amount', 'refunded_amount', 'status',
            'amount_received', 'amount_received_at',
            'lessee_agreed', 'lessee_signed_at',
            'owner_signed', 'owner_signed_at',
            'released_at', 'refunded_at',
            'created_at', 'updated_at',
        ]

    def get_lessee_name(self, obj):
        lessee = obj.agreement.lessee
        return f"{lessee.first_name} {lessee.last_name}".strip() or lessee.email
