#!/usr/bin/env python
"""Check land listings in the database."""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from landmanagement.models import LandListing
from accounts.models import User

print("=" * 60)
print(f"Total lands: {LandListing.objects.count()}")
print(f"Total users: {User.objects.count()}")
print(f"Admin users: {User.objects.filter(is_staff=True).count()}")
print("=" * 60)

print("\nRecent lands:")
for land in LandListing.objects.all().order_by('-created_at')[:5]:
    print(f"  ID: {land.id}")
    print(f"  Title: {land.title}")
    print(f"  Status: {land.status}")
    print(f"  Verified: {land.is_verified}")
    print(f"  Flagged: {land.is_flagged}")
    print(f"  Owner: {land.owner.email}")
    print(f"  Created: {land.created_at}")
    print("-" * 40)

print("\nAdmin/Staff users:")
for user in User.objects.filter(is_staff=True):
    print(f"  - {user.email} (staff={user.is_staff}, superuser={user.is_superuser})")
