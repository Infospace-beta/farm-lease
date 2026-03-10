"""Admin configuration for the landmanagement app."""
# pylint: disable=import-error
from django.contrib import admin
from .models import LandListing, SoilClimateData, LandImage


class LandImageInline(admin.TabularInline):
    """Inline admin for LandImage."""
    model = LandImage
    extra = 1


class SoilClimateDataInline(admin.StackedInline):
    """Inline admin for SoilClimateData."""
    model = SoilClimateData
    can_delete = False


@admin.register(LandListing)
class LandListingAdmin(admin.ModelAdmin):
    """Admin interface for LandListing model."""
    list_display = [
        'title', 'owner', 'total_area', 'price_per_month',
        'status', 'is_verified', 'is_flagged', 'created_at'
    ]
    list_filter = ['status', 'is_verified', 'is_flagged', 'created_at']
    search_fields = [
        'title', 'description', 'owner__username',
        'title_deed_number', 'location_name'
    ]
    readonly_fields = ['created_at']
    inlines = [SoilClimateDataInline, LandImageInline]
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'owner', 'title', 'description', 'total_area',
                'price_per_month', 'preferred_duration'
            )
        }),
        ('Location', {
            'fields': ('location_name', 'latitude', 'longitude')
        }),
        ('Amenities', {
            'fields': (
                'has_irrigation', 'has_electricity',
                'has_road_access', 'has_fencing'
            )
        }),
        ('Verification', {
            'fields': (
                'title_deed_number', 'is_verified',
                'is_flagged', 'flag_reason'
            )
        }),
        ('Status', {
            'fields': ('status', 'current_lessee', 'created_at')
        }),
    )

    actions = ['verify_listings', 'flag_listings']

    def verify_listings(self, request, queryset):  # pylint: disable=W0613
        """Verify selected listings."""
        queryset.update(is_verified=True, is_flagged=False)
        self.message_user(
            request, f"{queryset.count()} listings verified."
        )

    def flag_listings(self, request, queryset):  # pylint: disable=W0613
        """Flag selected listings."""
        queryset.update(is_flagged=True, is_verified=False)
        self.message_user(request, f"{queryset.count()} listings flagged.")


@admin.register(SoilClimateData)
class SoilClimateDataAdmin(admin.ModelAdmin):
    """Admin interface for SoilClimateData model."""
    list_display = [
        'land', 'soil_type', 'ph_level', 'temperature',
        'rainfall', 'updated_at'
    ]
    list_filter = ['soil_type', 'updated_at']
    search_fields = ['land__title']


@admin.register(LandImage)
class LandImageAdmin(admin.ModelAdmin):
    """Admin interface for LandImage model."""
    list_display = ['land', 'image']
    search_fields = ['land__title']
