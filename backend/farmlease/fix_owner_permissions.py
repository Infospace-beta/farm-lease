"""
Script to fix any existing owners that have been incorrectly given staff permissions.
Run with: python manage.py shell < fix_owner_permissions.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from accounts.models import User

# Fix any non-admin users that have is_staff or is_superuser set
fixed_count = 0
for user in User.objects.exclude(role='admin'):
    if user.is_staff or user.is_superuser:
        user.is_staff = False
        user.is_superuser = False
        user.save()
        print(f"✓ Fixed {user.email} ({user.role}) - removed admin privileges")
        fixed_count += 1

if fixed_count == 0:
    print("✓ No users needed fixing. All permissions are correct.")
else:
    print(f"\n✓ Fixed {fixed_count} user(s)")

# Report on all users
print("\n--- Current User Status ---")
for user in User.objects.all().order_by('role'):
    staff_status = "ADMIN" if user.is_staff else "regular"
    print(f"{user.role:12} | {user.email:30} | {staff_status}")
