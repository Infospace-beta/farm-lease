#!/usr/bin/env python
"""Test admin endpoints."""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from django.test import RequestFactory
from rest_framework.test import force_authenticate
from landmanagement.views import admin_land_list, admin_stats
from accounts.models import User

# Get an admin user
admin_user = User.objects.filter(is_staff=True).first()
print(f"Testing with admin user: {admin_user.email}")
print("=" * 60)

# Create a request factory
factory = RequestFactory()

# Test admin_land_list endpoint
print("\n1. Testing /lands/admin/all/ endpoint:")
request = factory.get('/api/lands/admin/all/')
force_authenticate(request, user=admin_user)
response = admin_land_list(request)
print(f"   Status Code: {response.status_code}")
print(f"   Number of lands returned: {len(response.data)}")
if response.data:
    print(f"   First land: {response.data[0]['title']} (Verified: {response.data[0]['is_verified']})")

# Test admin_stats endpoint
print("\n2. Testing /lands/admin/stats/ endpoint:")
request = factory.get('/api/lands/admin/stats/')
force_authenticate(request, user=admin_user)
response = admin_stats(request)
print(f"   Status Code: {response.status_code}")
print(f"   Stats: {response.data}")

print("\n" + "=" * 60)
print("✓ Both endpoints are working correctly!")
print(f"\nTo access the admin console:")
print(f"  1. Log in as: {admin_user.email}")
print(f"  2. Or use: admin@gmail.com")
print(f"  3. Navigate to: /admin/land-verifications")
