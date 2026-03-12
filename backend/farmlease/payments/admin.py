from django.contrib import admin
from .models import Transaction, EscrowAccount


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['transaction_id', 'user', 'amount', 'transaction_type', 'status', 'created_at']
    list_filter = ['transaction_type', 'status', 'created_at']
    search_fields = ['transaction_id', 'user__email', 'description']
    date_hierarchy = 'created_at'


@admin.register(EscrowAccount)
class EscrowAccountAdmin(admin.ModelAdmin):
    list_display = ['id', 'agreement', 'amount', 'released_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    date_hierarchy = 'created_at'
