"""Utility helpers for M-Pesa Daraja STK Push integration."""

from __future__ import annotations

import base64
from datetime import datetime
from typing import Any, Tuple

import requests
from django.conf import settings


class MpesaClient:
    """Minimal Daraja client for STK Push."""

    def __init__(self) -> None:
        cfg = getattr(settings, "MPESA_CONFIG", {})
        self.consumer_key = cfg.get("CONSUMER_KEY", "")
        self.consumer_secret = cfg.get("CONSUMER_SECRET", "")
        self.shortcode = str(cfg.get("SHORTCODE", ""))
        self.passkey = cfg.get("PASSKEY", "")
        self.callback_url = cfg.get("CALLBACK_URL", "")
        env = cfg.get("ENVIRONMENT", "sandbox")
        self.base_url = (
            "https://api.safaricom.co.ke"
            if env == "production"
            else "https://sandbox.safaricom.co.ke"
        )

    def is_configured(self) -> bool:
        return len(self.config_issues()) == 0

    def config_issues(self) -> list[str]:
        """Return a list of configuration issues that block STK push."""
        issues: list[str] = []
        if not self.consumer_key:
            issues.append("MPESA_CONSUMER_KEY is missing")
        if not self.consumer_secret:
            issues.append("MPESA_CONSUMER_SECRET is missing")
        if not self.shortcode:
            issues.append("MPESA_SHORTCODE is missing")
        if not self.passkey:
            issues.append("MPESA_PASSKEY is missing")
        if self.callback_url and not self.callback_url.startswith(("http://", "https://")):
            issues.append("MPESA_CALLBACK_URL must start with http:// or https://")
        return issues

    def get_access_token(self) -> str:
        """Get OAuth token from Daraja."""
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        response = requests.get(
            url,
            auth=(self.consumer_key, self.consumer_secret),
            timeout=20,
        )
        response.raise_for_status()
        data = response.json()
        token = data.get("access_token")
        if not token:
            raise ValueError("No access_token received from M-Pesa")
        return token

    def initiate_stk_push(
        self,
        *,
        amount: int,
        phone_number: str,
        account_reference: str,
        transaction_desc: str,
        callback_url: str,
    ) -> Tuple[bool, dict[str, Any]]:
        """Initiate STK push and return success flag + API payload."""
        try:
            token = self.get_access_token()
            timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
            password_source = f"{self.shortcode}{self.passkey}{timestamp}"
            password = base64.b64encode(password_source.encode("utf-8")).decode("utf-8")

            payload = {
                "BusinessShortCode": self.shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone_number,
                "PartyB": self.shortcode,
                "PhoneNumber": phone_number,
                "CallBackURL": callback_url,
                "AccountReference": account_reference,
                "TransactionDesc": transaction_desc,
            }

            response = requests.post(
                f"{self.base_url}/mpesa/stkpush/v1/processrequest",
                headers={"Authorization": f"Bearer {token}"},
                json=payload,
                timeout=25,
            )
            data = response.json()
            if response.status_code >= 400:
                return False, {
                    "error": data.get("errorMessage")
                    or data.get("errorCode")
                    or f"M-Pesa request failed ({response.status_code})",
                    "raw": data,
                }

            if data.get("ResponseCode") == "0":
                return True, data

            return False, {
                "error": data.get("ResponseDescription")
                or data.get("CustomerMessage")
                or "M-Pesa rejected the STK request",
                "raw": data,
            }
        except requests.RequestException as exc:
            return False, {"error": f"Failed to reach M-Pesa service: {exc}"}
        except Exception as exc:  # noqa: BLE001
            return False, {"error": f"Payment initiation failed: {exc}"}
