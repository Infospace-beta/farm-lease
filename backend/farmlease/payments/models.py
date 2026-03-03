"""Models for the payments app."""
from django.db import models
from django.conf import settings
from contracts.models import LeaseAgreement


class Transaction(models.Model):
    """Represents a payment transaction."""

    TRANSACTION_TYPE_CHOICES = [
        ('rent_payment', 'Rent Payment'),
        ('escrow_release', 'Escrow Release'),
        ('withdrawal', 'Withdrawal'),
        ('deposit', 'Deposit'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('in_escrow', 'In Escrow'),
    ]

    transaction_id = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='transactions'
    )
    agreement = models.ForeignKey(
        LeaseAgreement,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='transactions'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    transaction_type = models.CharField(
        max_length=20,
        choices=TRANSACTION_TYPE_CHOICES
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    description = models.TextField(blank=True, null=True)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    mpesa_receipt = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.transaction_id} - {self.amount}"


class EscrowAccount(models.Model):
    """Represents an escrow account for a lease agreement."""

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('released', 'Released'),
        ('refunded', 'Refunded'),
    ]

    agreement = models.OneToOneField(
        LeaseAgreement,
        on_delete=models.CASCADE,
        related_name='escrow'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )
    released_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Escrow for Agreement #{self.agreement.id}"

