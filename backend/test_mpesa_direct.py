#!/usr/bin/env python
"""
Direct test of M-Pesa STK Push without going through Django.
This helps identify exactly what Safaricom is rejecting.
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, '/home/samdev652/farm-lease/backend/farmlease')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'farmlease.settings')
django.setup()

import base64
import requests
import json
from datetime import datetime
from django.conf import settings

print("\n" + "="*70)
print("M-PESA STK PUSH DIRECT TEST")
print("="*70 + "\n")

# Read config
config = settings.MPESA_CONFIG

print("📋 CONFIGURATION:")
print(f"  Consumer Key: {config['CONSUMER_KEY'][:20]}...")
print(f"  Consumer Secret: {config['CONSUMER_SECRET'][:20]}...")
print(f"  Shortcode: {config['BUSINESS_SHORT_CODE']}")
print(f"  Environment: {config['ENVIRONMENT']}")
print(f"  Auth URL: {config['AUTH_URL']}")
print(f"  STK Push URL: {config['STK_PUSH_URL']}")
print(f"  Callback URL: {config['CALLBACK_URL']}")

# Step 1: Get access token
print("\n" + "="*70)
print("STEP 1: Getting Access Token from Safaricom...")
print("="*70)

try:
    auth_string = f"{config['CONSUMER_KEY']}:{config['CONSUMER_SECRET']}"
    auth_bytes = auth_string.encode('utf-8')
    auth_base64 = base64.b64encode(auth_bytes).decode('utf-8')
    
    headers = {
        'Authorization': f'Basic {auth_base64}',
    }
    
    print(f"\n📤 Auth Request:")
    print(f"   URL: {config['AUTH_URL']}")
    print(f"   Auth Header: Basic {auth_base64[:30]}...")
    
    response = requests.get(
        config['AUTH_URL'],
        headers=headers,
        timeout=30
    )
    
    print(f"\n📥 Auth Response:")
    print(f"   Status: {response.status_code}")
    print(f"   Body: {response.text}")
    
    if response.status_code != 200:
        print(f"\n❌ ERROR: Could not get access token!")
        print(f"   This means your credentials might be invalid.")
        print(f"   Check Consumer Key and Secret in .env file.")
        sys.exit(1)
    
    data = response.json()
    access_token = data.get('access_token')
    print(f"\n✅ Success! Token: {access_token[:30]}...")
    
except Exception as e:
    print(f"\n❌ Auth Error: {str(e)}")
    sys.exit(1)

# Step 2: Prepare STK Push
print("\n" + "="*70)
print("STEP 2: Preparing STK Push Request...")
print("="*70)

phone_number = "254712345678"  # Test phone
amount = 100
agreement_id = 1
timestamp = datetime.now().strftime('%Y%m%d%H%M%S')

# Create password
business_shortcode = config['BUSINESS_SHORT_CODE']
passkey = config['PASSKEY']
password_string = f"{business_shortcode}{passkey}{timestamp}"
password_base64 = base64.b64encode(password_string.encode('utf-8')).decode('utf-8')

payload = {
    "BusinessShortCode": business_shortcode,
    "Password": password_base64,
    "Timestamp": timestamp,
    "TransactionType": "CustomerPayBillOnline",
    "Amount": amount,
    "PartyA": phone_number,
    "PartyB": business_shortcode,
    "PhoneNumber": phone_number,
    "CallBackURL": config['CALLBACK_URL'],
    "AccountReference": f"LEASE-{agreement_id}",
    "TransactionDesc": "Test payment",
}

print(f"\n📋 STK Push Payload:")
print(json.dumps(payload, indent=2))

# Step 3: Send STK Push
print("\n" + "="*70)
print("STEP 3: Sending STK Push to Safaricom...")
print("="*70)

try:
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json',
    }
    
    print(f"\n📤 STK Push Request:")
    print(f"   URL: {config['STK_PUSH_URL']}")
    print(f"   Headers: {{'Authorization': 'Bearer ...', 'Content-Type': 'application/json'}}")
    print(f"   Payload: {json.dumps(payload, indent=6)}")
    
    response = requests.post(
        config['STK_PUSH_URL'],
        json=payload,
        headers=headers,
        timeout=30
    )
    
    print(f"\n📥 STK Push Response:")
    print(f"   Status Code: {response.status_code}")
    print(f"   Status: {'✅ SUCCESS' if response.status_code == 200 else '❌ FAILED'}")
    print(f"   Headers: {dict(response.headers)}")
    print(f"   Body (Raw): {response.text}")
    
    try:
        json_response = response.json()
        print(f"   Body (JSON): {json.dumps(json_response, indent=2)}")
    except:
        print(f"   (Could not parse as JSON)")
    
    if response.status_code == 200:
        print(f"\n✅ STK Push successful!")
        data = response.json()
        print(f"   CheckoutRequestID: {data.get('CheckoutRequestID')}")
        print(f"   ResponseCode: {data.get('ResponseCode')}")
        print(f"   CustomerMessage: {data.get('CustomerMessage')}")
    else:
        print(f"\n❌ STK Push failed!")
        print(f"   Safaricom returned status {response.status_code}")
        
        if response.status_code == 500:
            print("\n   💡 This usually means:")
            print("      1. Shortcode 174379 is NOT activated for STK Push")
            print("      2. Callback URL is not whitelisted")
            print("      3. Your app doesn't have STK Push permission")
            print("\n   ➡️  Fix: Go to Safaricom Developer Portal > Your App > Enable STK Push")
        elif response.status_code == 400:
            print("\n   💡 This usually means:")
            print("      1. Invalid payload format")
            print("      2. Missing required fields")
            print("      3. Invalid phone number format")
            
except Exception as e:
    print(f"\n❌ STK Push Error: {str(e)}")
    import traceback
    traceback.print_exc()

print("\n" + "="*70)
print("TEST COMPLETE")
print("="*70 + "\n")
