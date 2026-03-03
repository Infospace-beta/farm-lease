"""
Test script to verify browse lands functionality.
This checks if lands are properly filtered for the lessee browse page.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from landmanagement.models import LandListing

print("=" * 60)
print("LESSEE BROWSE LANDS - DATA VERIFICATION")
print("=" * 60)

# Check all lands
all_lands = LandListing.objects.all()
print(f"\n📊 Total lands in database: {all_lands.count()}")

# Check lands by status
for status_choice in ['Vacant', 'Pending_Payment', 'Leased', 'Under_Review']:
    count = LandListing.objects.filter(status=status_choice).count()
    print(f"   └── {status_choice}: {count}")

# Check verified lands
verified_lands = LandListing.objects.filter(is_verified=True)
print(f"\n✅ Verified lands: {verified_lands.count()}")

# Check vacant lands
vacant_lands = LandListing.objects.filter(status='Vacant')
print(f"🏞️  Vacant lands: {vacant_lands.count()}")

# Check lands that SHOULD appear in browse (verified AND vacant)
browse_lands = LandListing.objects.filter(
    is_verified=True, 
    status='Vacant'
)
print(f"\n🎯 Lands visible in LESSEE BROWSE: {browse_lands.count()}")
print("=" * 60)

if browse_lands.exists():
    print("\n📋 Lands that will appear in Browse page:")
    for land in browse_lands:
        print(f"   • {land.title}")
        print(f"     - Status: {land.status}")
        print(f"     - Verified: {land.is_verified}")
        print(f"     - Location: {land.location_name}")
        print(f"     - Price: KES {land.price_per_month}/month")
        print()
else:
    print("\n⚠️  NO LANDS AVAILABLE FOR BROWSE!")
    print("\nTo make lands appear in browse page:")
    print("1. Owner must create a land listing")
    print("2. Admin must verify the land")
    print("3. Land status must be 'Vacant'")
    print("\nCheck lands needing verification:")
    pending = LandListing.objects.filter(is_verified=False, is_flagged=False)
    if pending.exists():
        print(f"\n📋 {pending.count()} land(s) pending admin verification:")
        for land in pending[:5]:  # Show first 5
            print(f"   • {land.title} (Owner: {land.owner.username})")

print("\n" + "=" * 60)
