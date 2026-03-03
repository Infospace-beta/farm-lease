from django.contrib import admin
from .models import LeaseRequest, LeaseAgreement


@admin.register(LeaseRequest)
class LeaseRequestAdmin(admin.ModelAdmin):
    list_display = ['id', 'land', 'lessee', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['land__title', 'lessee__email']
    date_hierarchy = 'created_at'


@admin.register(LeaseAgreement)
class LeaseAgreementAdmin(admin.ModelAdmin):
    list_display = ['id', 'land', 'owner', 'lessee', 'status', 'start_date', 'end_date']
    list_filter = ['status', 'created_at']
    search_fields = ['land__title', 'owner__email', 'lessee__email']
    date_hierarchy = 'created_at'
