#!/usr/bin/env python
"""Quick JWT token decoder"""
import os
import django
import json
import base64

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from accounts.models import User

print("=" * 60)
print("DECODE JWT TOKEN FROM FRONTEND")
print("=" * 60)

# Please paste your JWT access token from browser localStorage
print("\nInstructions:")
print("1. Open browser DevTools (F12)")
print("2. Go to Application/Storage > Local Storage")
print("3. Find 'access_token'")
print("4. Copy the token value and paste it here")
print("\nToken: ", end="")

try:
    token = input().strip()
    if not token:
        print("No token provided")
        exit(1)
    
    # Decode JWT (format: header.payload.signature)
    parts = token.split('.')
    if len(parts) != 3:
        print("Invalid JWT format")
        exit(1)
    
    # Decode payload (add padding if needed)
    payload = parts[1]
    padding = len(payload) % 4
    if padding:
        payload += '=' * (4 - padding)
    
    decoded = base64.urlsafe_b64decode(payload)
    data = json.loads(decoded)
    
    print("\n" + "=" * 60)
    print("DECODED TOKEN DATA")
    print("=" * 60)
    print(json.dumps(data, indent=2))
    
    # Check user
    user_id = data.get('user_id')
    if user_id:
        user = User.objects.filter(id=user_id).first()
        if user:
            print("\n" + "=" * 60)
            print("USER INFO FROM DATABASE")
            print("=" * 60)
            print(f"Email: {user.email}")
            print(f"Role: {user.role}")
            print(f"is_staff: {user.is_staff}")
            print(f"is_superuser: {user.is_superuser}")
            print(f"is_active: {user.is_active}")
        else:
            print(f"\nUser with ID {user_id} not found in database")
    
except KeyboardInterrupt:
    print("\nCancelled")
except Exception as e:
    print(f"\nError: {e}")
