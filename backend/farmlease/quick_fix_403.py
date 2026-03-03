#!/usr/bin/env python
"""Quick fix for 403 admin access error."""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from accounts.models import User

print("=" * 70)
print("QUICK FIX: 403 FORBIDDEN IN ADMIN CONSOLE")
print("=" * 70)

print("\n🔴 PROBLEM: You're logged in with a non-admin account")
print("🟢 SOLUTION: Choose one option below\n")

print("=" * 70)
print("OPTION 1: Upgrade owner@gmail.com to Admin (FASTEST)")
print("=" * 70)

try:
    owner_user = User.objects.get(email='owner@gmail.com')
    print(f"\nCurrent status of owner@gmail.com:")
    print(f"  Role: {owner_user.role}")
    print(f"  is_staff: {owner_user.is_staff}")
    
    if not owner_user.is_staff:
        print("\n⚙️ Upgrading to admin...")
        owner_user.role = 'admin'
        owner_user.is_staff = True
        owner_user.save()
        print("✅ SUCCESS! owner@gmail.com is now an admin!")
        print("\n📝 NEXT STEPS:")
        print("   1. LOGOUT in your browser")
        print("   2. LOGIN again with: owner@gmail.com")
        print("   3. Go to /admin/land-verifications")
        print("   4. You should see the lands now! ✓")
    else:
        print("\n✓ Already has admin permissions!")
        print("   Just logout and login again to refresh token.")
        
except User.DoesNotExist:
    print("❌ owner@gmail.com not found")

print("\n" + "=" * 70)
print("OPTION 2: Use Existing Admin Account")
print("=" * 70)
print("\nLogout and login with one of these:")

admin_users = User.objects.filter(is_staff=True)
for user in admin_users:
    print(f"   ✓ {user.email}")

print("\n" + "=" * 70)
print("After logging in, refresh the /admin/land-verifications page")
print("=" * 70)
