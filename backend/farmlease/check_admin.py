#!/usr/bin/env python
"""Quick check of admin user status"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from accounts.models import User

print("=" * 50)
print("CHECKING ADMIN USER STATUS")
print("=" * 50)

admin_users = User.objects.filter(role='admin')
print(f"\nTotal admin users: {admin_users.count()}")

for admin in admin_users:
    print(f"\nAdmin User: {admin.email}")
    print(f"  - is_staff: {admin.is_staff}")
    print(f"  - is_superuser: {admin.is_superuser}")
    print(f"  - is_active: {admin.is_active}")
    print(f"  - role: {admin.role}")

print("\n" + "=" * 50)
print("ALL LAND LISTINGS IN DATABASE")
print("=" * 50)

from landmanagement.models import LandListing

all_lands = LandListing.objects.all()
print(f"\nTotal lands: {all_lands.count()}")

pending = all_lands.filter(is_verified=False, is_flagged=False)
verified = all_lands.filter(is_verified=True)
flagged = all_lands.filter(is_flagged=True)

print(f"  - Pending: {pending.count()}")
print(f"  - Verified: {verified.count()}")
print(f"  - Flagged: {flagged.count()}")

if all_lands.exists():
    print("\nRecent lands:")
    for land in all_lands[:5]:
        status = "Verified" if land.is_verified else ("Flagged" if land.is_flagged else "Pending")
        print(f"  - {land.title} [{status}] (ID: {land.id})")
