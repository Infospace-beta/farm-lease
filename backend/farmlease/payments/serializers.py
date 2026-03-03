"""Serializers for the payments app."""
from rest_framework import serializers
from .models import Transaction, EscrowAccount


class TransactionSerializer(serializers.ModelSerializer):
    """Serializer for transactions."""
    land_title = serializers.SerializerMethodField()
    lessee_name = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    date = serializers.DateTimeField(source='created_at', read_only=True)

    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_id', 'land_title', 'lessee_name',
            'amount', 'type', 'status', 'date', 'description',
            'payment_method', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'transaction_id', 'created_at', 'updated_at']

    def get_land_title(self, obj):
        """Get the land title if transaction is related to an agreement."""
        if obj.agreement:
            return obj.agreement.land.title
        return "N/A"

    def get_lessee_name(self, obj):
        """Get the lessee name if transaction is related to an agreement."""
        if obj.agreement:
            lessee = obj.agreement.lessee
            return f"{lessee.first_name} {lessee.last_name}".strip() or lessee.email
        return "N/A"

    def get_type(self, obj):
        """Map transaction_type to simpler frontend type."""
        type_mapping = {
            'rent_payment': 'credit',
            'escrow_release': 'escrow',
            'withdrawal': 'pending',
            'deposit': 'credit',
        }
        return type_mapping.get(obj.transaction_type, 'pending')

    def to_representation(self, instance):
        """Customize the representation to match frontend expectations."""
        representation = super().to_representation(instance)
        
        # Map status to frontend format
        status_mapping = {
            'pending': 'Pending',
            'completed': 'Completed',
            'failed': 'Failed',
            'in_escrow': 'In Escrow',
        }
        representation['status'] = status_mapping.get(instance.status, 'Pending')
        
        return representation


class EscrowAccountSerializer(serializers.ModelSerializer):
    """Serializer for escrow accounts."""
    land_title = serializers.CharField(source='agreement.land.title', read_only=True)

    class Meta:
        model = EscrowAccount
        fields = [
            'id', 'agreement', 'land_title', 'amount',
            'status', 'released_amount', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'released_amount', 'created_at', 'updated_at']

