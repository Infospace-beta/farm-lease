#!/usr/bin/env python
"""Check all users and simulate login for admin users."""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from accounts.models import User
from django.test import RequestFactory
from accounts.views import MyTokenObtainPairView
import json

print("=" * 70)
print("ALL USERS IN SYSTEM")
print("=" * 70)

all_users = User.objects.all()
for user in all_users:
    print(f"\n{user.email}")
    print(f"  username: {user.username}")
    print(f"  role: {user.role}")
    print(f"  is_staff: {user.is_staff}")
    print(f"  is_superuser: {user.is_superuser}")
    print(f"  is_active: {user.is_active}")

print("\n" + "=" * 70)
print("ISSUE DIAGNOSIS")
print("=" * 70)

# Check for users with username 'owner1'
owner1_users = User.objects.filter(username__icontains='owner')
if owner1_users.exists():
    print("\nFound users with 'owner' in username:")
    for user in owner1_users:
        print(f"  - {user.email} (username={user.username}, role={user.role}, is_staff={user.is_staff})")

print("\n" + "=" * 70)
print("ADMIN USERS")
print("=" * 70)

admin_role_users = User.objects.filter(role='admin')
print(f"\nUsers with role='admin': {admin_role_users.count()}")
for user in admin_role_users:
    print(f"  ✓ {user.email}")
    print(f"    - is_staff: {user.is_staff} (REQUIRED for admin endpoints)")
    print(f"    - is_active: {user.is_active}")

staff_users = User.objects.filter(is_staff=True)
print(f"\nUsers with is_staff=True: {staff_users.count()}")
for user in staff_users:
    print(f"  ✓ {user.email} (role={user.role})")

print("\n" + "=" * 70)
print("SOLUTION")
print("=" * 70)
print("\nTo fix 403 Forbidden error:")
print("1. Make sure you're logged in as one of these admin users:")
for user in staff_users:
    print(f"   - {user.email}")
print("\n2. If you created a new admin user, they MUST have:")
print("   - role = 'admin'")
print("   - is_staff = True")
print("\n3. After logging in, check browser localStorage for 'access_token'")
print("   and verify it contains 'is_staff: true' in the JWT payload")
