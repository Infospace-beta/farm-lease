"""Escrow helpers for payment + agreement workflows."""

from __future__ import annotations

from decimal import Decimal
from uuid import uuid4

from django.utils import timezone

from .models import EscrowAccount, Transaction


VALID_ESCROW_STATUSES = {
    "awaiting_signature",
    "both_signed",
    "released",
    "refunded",
    "disputed",
}


def ensure_escrow_for_agreement(agreement) -> EscrowAccount:
    """Ensure an escrow account exists and is synchronized with agreement signatures."""
    escrow, _ = EscrowAccount.objects.get_or_create(
        agreement=agreement,
        defaults={
            "amount": Decimal("0"),
            "lessee_agreed": bool(agreement.lessee_signed),
            "owner_signed": bool(agreement.owner_signed),
            "lessee_signed_at": agreement.lessee_signed_at,
            "owner_signed_at": agreement.owner_signed_at,
        },
    )
    changed = False
    if escrow.status not in VALID_ESCROW_STATUSES:
        escrow.status = "awaiting_signature"
        changed = True

    if escrow.lessee_agreed != bool(agreement.lessee_signed):
        escrow.lessee_agreed = bool(agreement.lessee_signed)
        escrow.lessee_signed_at = agreement.lessee_signed_at
        changed = True
    if escrow.owner_signed != bool(agreement.owner_signed):
        escrow.owner_signed = bool(agreement.owner_signed)
        escrow.owner_signed_at = agreement.owner_signed_at
        changed = True

    if escrow.can_be_released and escrow.status == "awaiting_signature":
        escrow.status = "both_signed"
        changed = True

    if changed:
        escrow.save()
    return escrow


def hold_payment_in_escrow(transaction: Transaction) -> EscrowAccount:
    """Move a successful rent payment into escrow for the linked agreement."""
    if not transaction.agreement:
        raise ValueError("Cannot hold payment in escrow without an agreement")

    agreement = transaction.agreement
    escrow = ensure_escrow_for_agreement(agreement)

    escrow.amount = (escrow.amount or Decimal("0")) + (transaction.amount or Decimal("0"))
    escrow.amount_received = True
    escrow.amount_received_at = timezone.now()

    if escrow.can_be_released:
        escrow.status = "both_signed"
    elif escrow.status == "released":
        # If a new cycle payment comes in after release, start awaiting again.
        escrow.status = "awaiting_signature"

    escrow.save(
        update_fields=[
            "amount",
            "amount_received",
            "amount_received_at",
            "status",
            "updated_at",
        ]
    )

    transaction.status = "in_escrow"
    transaction.transaction_type = "escrow_hold"
    transaction.save(update_fields=["status", "transaction_type", "updated_at"])
    return escrow


def try_release_escrow(agreement) -> bool:
    """Release escrow money to owner if both parties have signed and funds exist."""
    escrow = ensure_escrow_for_agreement(agreement)
    held_amount = escrow.held_amount
    if held_amount <= 0:
        return False

    if not escrow.can_be_released:
        return False

    if escrow.status != "released":
        escrow.mark_released()

    Transaction.objects.create(
        transaction_id=f"ESCREL-{uuid4().hex[:14].upper()}",
        user=agreement.owner,
        agreement=agreement,
        amount=held_amount,
        transaction_type="escrow_release",
        status="completed",
        payment_method="escrow",
        description=f"Escrow released to owner for agreement {agreement.id}",
    )

    return True
