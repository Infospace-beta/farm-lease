from django.contrib import admin
from .models import LandListing

@admin.register(LandListing)
class LandListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'owner', 'is_verified', 'status', 'created_at')
    list_filter = ('is_verified', 'status')
    actions = ['verify_land']

    @admin.action(description="Verify selected land listings")
    def verify_land(self, request, queryset):
        queryset.update(is_verified=True, status='Vacant')
        self.message_user(request, "Selected lands are now live for Lessees.")


