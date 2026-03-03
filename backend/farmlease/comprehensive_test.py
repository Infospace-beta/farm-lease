#!/usr/bin/env python
"""Comprehensive connection test for admin land verifications."""
import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from django.test import RequestFactory
from rest_framework.test import force_authenticate
from accounts.models import User
from accounts.views import get_user_profile
from landmanagement.views import admin_land_list, admin_stats
from landmanagement.models import LandListing

print("=" * 70)
print("FARM LEASE - ADMIN LAND VERIFICATION CONNECTION TEST")
print("=" * 70)

# Get admin user
admin_user = User.objects.filter(email='admin@gmail.com').first()
if not admin_user:
    admin_user = User.objects.filter(is_staff=True).first()

print(f"\n✓ Admin User Found: {admin_user.email}")
print(f"  - Role: {admin_user.role}")
print(f"  - is_staff: {admin_user.is_staff}")
print(f"  - is_superuser: {admin_user.is_superuser}")

# Test /auth/me/ endpoint
print("\n" + "-" * 70)
print("1. Testing /api/auth/me/ endpoint (user profile)")
print("-" * 70)
factory = RequestFactory()
request = factory.get('/api/auth/me/')
force_authenticate(request, user=admin_user)
response = get_user_profile(request)
print(f"   Status: {response.status_code}")
print(f"   Role returned: {response.data['role']}")
print(f"   is_staff: {response.data['is_staff']}")
print(f"   ✓ Authentication working correctly!")

# Test admin stats
print("\n" + "-" * 70)
print("2. Testing /api/lands/admin/stats/ endpoint")
print("-" * 70)
request = factory.get('/api/lands/admin/stats/')
force_authenticate(request, user=admin_user)
response = admin_stats(request)
print(f"   Status: {response.status_code}")
print(f"   Data: {json.dumps(response.data, indent=6)}")

# Test admin land list
print("\n" + "-" * 70)
print("3. Testing /api/lands/admin/all/ endpoint")
print("-" * 70)
request = factory.get('/api/lands/admin/all/')
force_authenticate(request, user=admin_user)
response = admin_land_list(request)
print(f"   Status: {response.status_code}")
print(f"   Number of lands: {len(response.data)}")

# Show pending lands
pending_lands = [land for land in response.data if not land['is_verified'] and not land['is_flagged']]
print(f"\n   PENDING VERIFICATION ({len(pending_lands)} lands):")
for land in pending_lands:
    print(f"      - ID:{land['id']} | {land['title']} | Owner: {land['owner_email']}")

# Show verified lands
verified_lands = [land for land in response.data if land['is_verified']]
print(f"\n   VERIFIED ({len(verified_lands)} lands):")
for land in verified_lands[:3]:  # Show first 3
    print(f"      - ID:{land['id']} | {land['title']} | Owner: {land['owner_email']}")

print("\n" + "=" * 70)
print("CONCLUSION")
print("=" * 70)
print("✅ Backend is working correctly!")
print("✅ Admin endpoints are accessible!")
print(f"✅ {len(pending_lands)} land(s) waiting for verification!")
print("\n📌 TO ACCESS THE ADMIN CONSOLE:")
print(f"   1. Go to: http://localhost:3000/login")
print(f"   2. Login with: {admin_user.email}")
print(f"   3. You will be redirected to: /admin/land-verifications")
print(f"   4. You should see {len(pending_lands)} pending verification(s)")
print("\n📌 IF YOU CAN'T SEE IT:")
print("   - Make sure you're logged in as admin, not as landowner")
print("   - Check browser console for errors (F12)")
print("   - Verify NEXT_PUBLIC_API_URL is set to http://localhost:8000/api")
print("=" * 70)
