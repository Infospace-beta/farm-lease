from django.contrib import admin
from .models import EscrowAccount, Transaction


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'user', 'amount', 'transaction_type', 'status', 'created_at']
    list_filter = ['transaction_type', 'status', 'created_at']
    search_fields = ['transaction_id', 'user__email', 'description']
    date_hierarchy = 'created_at'


@admin.register(EscrowAccount)
class EscrowAccountAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'agreement', 'amount', 'held_amount', 'status',
        'amount_received', 'lessee_agreed', 'owner_signed', 'released_at'
    ]
    list_filter = ['status', 'amount_received', 'lessee_agreed', 'owner_signed', 'created_at']
    search_fields = ['agreement__id', 'agreement__land__title', 'agreement__lessee__email', 'agreement__owner__email']
    readonly_fields = ['created_at', 'updated_at']
