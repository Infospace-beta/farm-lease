#!/usr/bin/env python
"""Test script to validate signup serializer"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

from accounts.serializers import SignupSerializer

# Test with sample data
test_data = {
    'email': 'test@example.com',
    'password': 'testpass123',
    'password2': 'testpass123',
    'phone_number': '+1234567890',
    'role': 'farmer',
    'first_name': 'Test',
    'last_name': 'User'
}

print("Testing SignupSerializer validation...")
print(f"Test data: {test_data}")
print()

serializer = SignupSerializer(data=test_data)
if serializer.is_valid():
    print('✓ Serializer is valid')
    print('Validated data:', serializer.validated_data)
else:
    print('✗ Validation errors:')
    for field, errors in serializer.errors.items():
        print(f"  {field}: {errors}")
