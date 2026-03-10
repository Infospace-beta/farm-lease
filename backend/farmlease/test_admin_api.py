#!/usr/bin/env python
"""Test admin endpoints directly"""
import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from accounts.models import User
from rest_framework_simplejwt.tokens import RefreshToken

print("=" * 60)
print("TESTING ADMIN ENDPOINT ACCESS")
print("=" * 60)

# Get an admin user
admin = User.objects.filter(role='admin', is_staff=True).first()

if not admin:
    print("\nNo admin user found!")
    exit(1)

print(f"\nUsing admin: {admin.email}")
print(f"  - is_staff: {admin.is_staff}")
print(f"  - is_superuser: {admin.is_superuser}")

# Generate JWT token
refresh = RefreshToken.for_user(admin)
access_token = str(refresh.access_token)

print(f"\n✓ Generated JWT token")
print(f"  Token preview: {access_token[:50]}...")

# Test the admin endpoints
base_url = "http://localhost:8000/api"
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

print("\n" + "=" * 60)
print("TEST 1: Admin All Lands Endpoint")
print("=" * 60)

try:
    response = requests.get(f"{base_url}/lands/admin/all/", headers=headers, timeout=5)
    print(f"\nStatus Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ SUCCESS - Received {len(data)} lands")
        if data:
            print(f"  First land: {data[0].get('title', 'N/A')}")
    else:
        print(f"✗ FAILED - Response: {response.text[:200]}")
except Exception as e:
    print(f"✗ ERROR: {e}")

print("\n" + "=" * 60)
print("TEST 2: Admin Stats Endpoint")
print("=" * 60)

try:
    response = requests.get(f"{base_url}/lands/admin/stats/", headers=headers, timeout=5)
    print(f"\nStatus Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ SUCCESS - Stats: {data}")
    else:
        print(f"✗ FAILED - Response: {response.text[:200]}")
except Exception as e:
    print(f"✗ ERROR: {e}")

print("\n" + "=" * 60)
