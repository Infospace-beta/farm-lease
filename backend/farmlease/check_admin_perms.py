#!/usr/bin/env python
"""Check the currently logged-in user's permissions."""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from accounts.models import User
from rest_framework_simplejwt.tokens import RefreshToken

print("=" * 70)
print("CHECKING ADMIN USER PERMISSIONS")
print("=" * 70)

# Check all users with admin role
admin_users = User.objects.filter(role='admin')
print(f"\nFound {admin_users.count()} users with role='admin':\n")

for user in admin_users:
    print(f"Email: {user.email}")
    print(f"  - username: {user.username}")
    print(f"  - role: {user.role}")
    print(f"  - is_staff: {user.is_staff}")
    print(f"  - is_superuser: {user.is_superuser}")
    print(f"  - is_active: {user.is_active}")
    
    # Generate JWT token to see what's included
    token = RefreshToken.for_user(user)
    access_token = str(token.access_token)
    
    print(f"\n  JWT Token Payload:")
    print(f"    - role: {token['role']}")
    print(f"    - is_staff: {token['is_staff']}")
    print(f"    - email: {token['email']}")
    print("-" * 70)

# Check all staff users
print("\n\nAll users with is_staff=True:")
staff_users = User.objects.filter(is_staff=True)
for user in staff_users:
    print(f"  - {user.email} (role={user.role}, staff={user.is_staff})")

print("\n" + "=" * 70)
