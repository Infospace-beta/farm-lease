"""
Fix the owner@gmail.com user to have the correct role.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from accounts.models import User

try:
    owner = User.objects.get(email='owner@gmail.com')
    print(f"Before: {owner.email} - role={owner.role}, is_staff={owner.is_staff}")
    
    # Change role to landowner (the save() method will auto-remove is_staff)
    owner.role = 'landowner'
    owner.save()
    
    print(f"After:  {owner.email} - role={owner.role}, is_staff={owner.is_staff}")
    print("\n✓ Successfully fixed owner@gmail.com - now has role='landowner' and is_staff=False")
except User.DoesNotExist:
    print("✗ User owner@gmail.com does not exist")
