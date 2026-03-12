#!/usr/bin/env python
"""Fix admin access - Option to upgrade existing user or show login info."""
import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from accounts.models import User

print("=" * 70)
print("FIX ADMIN ACCESS - 403 FORBIDDEN ERROR")
print("=" * 70)

print("\n🔍 Current Situation:")
print("   You're getting 403 error in admin console")
print("   This means you're logged in but don't have admin permissions\n")

print("=" * 70)
print("SOLUTION OPTIONS")
print("=" * 70)

print("\n✅ OPTION 1: LOGOUT AND LOGIN AS ADMIN (RECOMMENDED)")
print("-" * 70)
print("1. Click on your profile/avatar in top right")
print("2. Select 'Logout'")
print("3. Login with one of these admin accounts:\n")

admin_users = User.objects.filter(is_staff=True, is_active=True)
for user in admin_users:
    print(f"   📧 Email: {user.email}")
    print(f"      Role: {user.role}")
    print(f"      Staff: {user.is_staff} ✓")
    print()

print("\n✅ OPTION 2: UPGRADE CURRENT USER TO ADMIN")
print("-" * 70)
print("If you want to make your current account an admin:\n")

current_user_email = input("Enter your current email (e.g., owner@gmail.com): ").strip()

if current_user_email:
    try:
        user = User.objects.get(email=current_user_email)
        print(f"\nFound user: {user.email}")
        print(f"  Current role: {user.role}")
        print(f"  Current is_staff: {user.is_staff}")
        
        if user.is_staff:
            print("\n✓ This user already has admin permissions!")
            print("  Try logging out and logging back in.")
        else:
            confirm = input("\nUpgrade this user to admin? (yes/no): ").strip().lower()
            if confirm == 'yes':
                user.role = 'admin'
                user.is_staff = True
                user.save()
                print(f"\n✅ SUCCESS! {user.email} is now an admin!")
                print("\nNEXT STEPS:")
                print("1. LOGOUT from your current session")
                print("2. LOGIN again with the same credentials")
                print("3. Your token will now include admin permissions")
                print("4. You'll be able to access /admin/land-verifications")
            else:
                print("\nNo changes made. Use Option 1 to login as existing admin.")
    except User.DoesNotExist:
        print(f"\n❌ User with email '{current_user_email}' not found.")
        print("\nAvailable admin accounts:")
        for user in admin_users:
            print(f"   - {user.email}")
else:
    print("\nNo email entered. Use Option 1 to login as existing admin.")

print("\n" + "=" * 70)
