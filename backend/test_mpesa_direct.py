#!/usr/bin/env python
"""Direct test of M-Pesa Daraja STK Push using this repo's Django settings.

Use this to quickly distinguish:
- DNS / outbound HTTPS issues (can't reach Safaricom)
- OAuth credential issues (invalid consumer key/secret)
- STK push payload/permissions issues
"""

from __future__ import annotations

import base64
import json
import os
import socket
import sys
from datetime import datetime
from pathlib import Path

import django
import requests


def _mask(value: str, *, prefix: int = 4, suffix: int = 2) -> str:
    if not value:
        return "(missing)"
    if len(value) <= prefix + suffix:
        return "***"
    return f"{value[:prefix]}***{value[-suffix:]}"


def _resolve_host(host: str) -> list[str]:
    try:
        infos = socket.getaddrinfo(host, 443, proto=socket.IPPROTO_TCP)
        return sorted({info[4][0] for info in infos})
    except Exception:
        return []


BASE_DIR = Path(__file__).resolve().parent
DJANGO_DIR = BASE_DIR / "farmlease"
sys.path.insert(0, str(DJANGO_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "farmlease.settings")
django.setup()

from django.conf import settings  # noqa: E402


print("\n" + "=" * 70)
print("M-PESA STK PUSH DIRECT TEST")
print("=" * 70 + "\n")

cfg = getattr(settings, "MPESA_CONFIG", {})

required = ["CONSUMER_KEY", "CONSUMER_SECRET", "SHORTCODE", "PASSKEY", "ENVIRONMENT"]
missing = [k for k in required if not str(cfg.get(k, "")).strip()]
if missing:
    print("Missing required MPESA_CONFIG keys:", ", ".join(missing))
    print("Set them in backend/.env then restart your server/shell.")
    sys.exit(2)

env = str(cfg.get("ENVIRONMENT", "sandbox")).strip().lower()
base_url = "https://api.safaricom.co.ke" if env == "production" else "https://sandbox.safaricom.co.ke"
auth_url = f"{base_url}/oauth/v1/generate?grant_type=client_credentials"
stk_url = f"{base_url}/mpesa/stkpush/v1/processrequest"

print("CONFIGURATION:")
print(f"  Environment: {env}")
print(f"  Base URL: {base_url}")
print(f"  Consumer Key: {_mask(str(cfg.get('CONSUMER_KEY', '')))}")
print(f"  Consumer Secret: {_mask(str(cfg.get('CONSUMER_SECRET', '')))}")
print(f"  Shortcode: {cfg.get('SHORTCODE')}")
print(f"  Callback URL: {cfg.get('CALLBACK_URL') or '(not set)'}")
print(f"  Auth URL: {auth_url}")
print(f"  STK Push URL: {stk_url}")

host = "api.safaricom.co.ke" if env == "production" else "sandbox.safaricom.co.ke"
resolved = _resolve_host(host)
print("\nDNS CHECK:")
print(f"  Host: {host}")
print(f"  Resolved IPs: {resolved or '(resolution failed)'}")

print("\n" + "=" * 70)
print("STEP 1: Getting Access Token...")
print("=" * 70)

try:
    r = requests.get(
        auth_url,
        auth=(str(cfg["CONSUMER_KEY"]), str(cfg["CONSUMER_SECRET"])),
        timeout=20,
    )
    print(f"Status: {r.status_code}")
    print(f"Body: {r.text}")
    r.raise_for_status()
    access_token = r.json().get("access_token")
    if not access_token:
        raise ValueError("No access_token in response")
    print(f"Token: {_mask(access_token, prefix=6, suffix=4)}")
except Exception as exc:
    print(f"Auth Error: {exc!r}")
    sys.exit(1)

print("\n" + "=" * 70)
print("STEP 2: Preparing STK Push Request...")
print("=" * 70)

phone_number = "254712345678"  # Test number format
amount = 1
agreement_id = 1
timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

password_source = f"{cfg['SHORTCODE']}{cfg['PASSKEY']}{timestamp}"
password = base64.b64encode(password_source.encode("utf-8")).decode("utf-8")

payload = {
    "BusinessShortCode": str(cfg["SHORTCODE"]),
    "Password": password,
    "Timestamp": timestamp,
    "TransactionType": "CustomerPayBillOnline",
    "Amount": int(amount),
    "PartyA": phone_number,
    "PartyB": str(cfg["SHORTCODE"]),
    "PhoneNumber": phone_number,
    "CallBackURL": str(cfg.get("CALLBACK_URL") or ""),
    "AccountReference": f"LEASE-{agreement_id}",
    "TransactionDesc": "Test payment",
}

print("Payload:")
print(json.dumps(payload, indent=2))

print("\n" + "=" * 70)
print("STEP 3: Sending STK Push...")
print("=" * 70)

try:
    r = requests.post(
        stk_url,
        headers={"Authorization": f"Bearer {access_token}"},
        json=payload,
        timeout=25,
    )
    print(f"Status: {r.status_code}")
    print(f"Body: {r.text}")
    try:
        data = r.json()
    except Exception:
        data = None

    if r.status_code >= 400:
        print("STK push failed.")
        if data:
            print("Parsed JSON:")
            print(json.dumps(data, indent=2))
        sys.exit(1)

    if data:
        print("Parsed JSON:")
        print(json.dumps(data, indent=2))
    print("STK push request submitted.")
except Exception as exc:
    print(f"STK Push Error: {exc!r}")
    raise

print("\n" + "=" * 70)
print("TEST COMPLETE")
print("=" * 70 + "\n")
