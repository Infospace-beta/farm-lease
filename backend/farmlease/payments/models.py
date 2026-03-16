"""Models for the payments app."""
from django.db import models
from django.conf import settings
from contracts.models import LeaseAgreement
from django.utils import timezone


class Transaction(models.Model):
    """Represents a payment transaction."""

    TRANSACTION_TYPE_CHOICES = [
        ('rent_payment', 'Rent Payment'),
        ('escrow_hold', 'Escrow Hold'),
        ('escrow_release', 'Escrow Release'),
        ('withdrawal', 'Withdrawal'),
        ('deposit', 'Deposit'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('stk_initiated', 'STK Push Initiated'),
        ('user_cancelled', 'User Cancelled'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('in_escrow', 'In Escrow'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('mpesa', 'M-Pesa'),
        ('escrow', 'Escrow'),
        ('bank_transfer', 'Bank Transfer'),
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
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default='mpesa',
        blank=True,
        null=True,
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    mpesa_receipt = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='M-Pesa receipt number for successful payment',
    )
    checkout_request_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text='M-Pesa CheckoutRequestID from STK Push',
    )
    mpesa_result_code = models.CharField(
        max_length=10,
        blank=True,
        null=True,
        help_text='Result code from M-Pesa callback (0 = success)',
    )
    mpesa_result_desc = models.TextField(
        blank=True,
        null=True,
        help_text='Result description from M-Pesa',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['checkout_request_id']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['user', 'status']),
        ]

    def __str__(self):
        return f"{self.transaction_id} - {self.amount} KES - {self.status}"


class EscrowAccount(models.Model):
    """Escrow account that temporarily holds lessee payments per agreement."""

    STATUS_CHOICES = [
        ('awaiting_signature', 'Awaiting Both Signatures'),
        ('both_signed', 'Both Signed - Ready to Release'),
        ('released', 'Released to Owner'),
        ('refunded', 'Refunded to Lessee'),
        ('disputed', 'Disputed'),
    ]

    agreement = models.OneToOneField(
        LeaseAgreement,
        on_delete=models.CASCADE,
        related_name='escrow'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default='awaiting_signature',
        help_text='Escrow release is tied to lease agreement signing',
    )
    released_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        help_text='Amount released to owner',
    )
    refunded_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        help_text='Amount refunded to lessee',
    )

    amount_received = models.BooleanField(
        default=False,
        help_text='True when lessee has completed M-Pesa payment',
    )
    amount_received_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When payment was received in escrow',
    )
    lessee_agreed = models.BooleanField(
        default=False,
        help_text='Lessee has agreed (signed agreement)',
    )
    lessee_signed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When lessee signed agreement',
    )
    owner_signed = models.BooleanField(
        default=False,
        help_text='Owner has signed agreement',
    )
    owner_signed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When owner signed agreement',
    )
    owner_approved_release = models.BooleanField(
        default=False,
        help_text='Owner has approved escrow release',
    )
    released_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When escrow was released to owner',
    )
    refunded_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When escrow was refunded to lessee',
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def can_be_released(self) -> bool:
        return self.amount_received and self.lessee_agreed and self.owner_signed

    @property
    def held_amount(self):
        return (self.amount or 0) - (self.released_amount or 0) - (self.refunded_amount or 0)

    def mark_released(self):
        self.released_amount = (self.released_amount or 0) + max(self.held_amount, 0)
        self.status = 'released'
        self.released_at = timezone.now()
        self.save(update_fields=['released_amount', 'status', 'released_at', 'updated_at'])

    def __str__(self):
        return f"Escrow #{self.id} Agreement {self.agreement_id} - {self.status}"
