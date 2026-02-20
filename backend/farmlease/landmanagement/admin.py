"""Admin configuration for the landmanagement app."""
# pylint: disable=import-error
from django.contrib import admin
from .models import LandListing, SoilClimateData, LandImage


@admin.register(LandListing)
class LandListingAdmin(admin.ModelAdmin):
    """Admin panel configuration for LandListing."""

    list_display = (
        'id', 'title', 'owner', 'status',
        'is_verified', 'is_flagged', 'title_deed_number', 'created_at',
    )
    list_filter = ('is_verified', 'is_flagged', 'status')
    search_fields = ('title', 'title_deed_number', 'owner__email')
    readonly_fields = ('created_at',)
    actions = ['verify_selected', 'flag_selected']

    @admin.action(description="✅ Verify selected lands")
    def verify_selected(self, request, queryset):
        """Mark selected land listings as verified."""
        updated = queryset.update(
            is_verified=True, is_flagged=False, flag_reason=None
        )
        self.message_user(request, f"{updated} land(s) verified.")

    @admin.action(description="🚩 Flag selected lands")
    def flag_selected(self, request, queryset):
        """Mark selected land listings as flagged."""
        updated = queryset.update(is_flagged=True, is_verified=False)
        self.message_user(request, f"{updated} land(s) flagged.")


@admin.register(SoilClimateData)
class SoilClimateDataAdmin(admin.ModelAdmin):
    """Admin panel configuration for SoilClimateData."""

    list_display = ('id', 'land', 'soil_type', 'ph_level', 'updated_at')
    search_fields = ('land__title',)


@admin.register(LandImage)
class LandImageAdmin(admin.ModelAdmin):
    """Admin panel configuration for LandImage."""

    list_display = ('id', 'land', 'image')
