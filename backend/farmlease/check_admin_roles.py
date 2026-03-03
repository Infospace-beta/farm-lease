#!/usr/bin/env python
"""Check admin user roles."""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from accounts.models import User

print("=" * 60)
print("Admin/Staff users with their roles:")
print("=" * 60)

for user in User.objects.filter(is_staff=True):
    print(f"\nEmail: {user.email}")
    print(f"  Role: {user.role}")
    print(f"  is_staff: {user.is_staff}")
    print(f"  is_superuser: {user.is_superuser}")

print("\n" + "=" * 60)
print("\nAll unique roles in the system:")
roles = User.objects.values_list('role', flat=True).distinct()
for role in roles:
    count = User.objects.filter(role=role).count()
    print(f"  - {role}: {count} users")
