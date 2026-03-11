from django.db import models
from django.conf import settings
from landmanagement.models import LandListing


class LeaseRequest(models.Model):
    """Represents a lease request from a lessee to a land owner."""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('review', 'Under Review'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    land = models.ForeignKey(
        LandListing,
        on_delete=models.CASCADE,
        related_name='lease_requests'
    )
    lessee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lease_requests'
    )
    proposed_start_date = models.DateField()
    proposed_end_date = models.DateField()
    proposed_rent = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True
    )
    message = models.TextField(blank=True, null=True)
    requested_area = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Acres requested (for partial lease from a larger plot)"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    rejection_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ['land', 'lessee', 'status']

    def __str__(self):
        return f"Lease Request #{self.id} - {self.land.title} by {self.lessee.email}"


class LeaseAgreement(models.Model):
    """Represents an active lease agreement between owner and lessee."""

    STATUS_CHOICES = [
        ('pending_signature', 'Pending Signature'),
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('terminated', 'Terminated'),
    ]

    lease_request = models.OneToOneField(
        LeaseRequest,
        on_delete=models.CASCADE,
        related_name='agreement'
    )
    land = models.ForeignKey(
        LandListing,
        on_delete=models.CASCADE,
        related_name='agreements'
    )
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owner_agreements'
    )
    lessee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lessee_agreements'
    )
    start_date = models.DateField()
    end_date = models.DateField()
    monthly_rent = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending_signature'
    )
    # Agreement terms (filled by lessee when drafting the contract)
    intended_use = models.CharField(max_length=300, blank=True, default='')
    special_conditions = models.TextField(blank=True, default='')

    # Signature data (typed full name used as legally binding signature)
    lessee_signature = models.TextField(null=True, blank=True)
    owner_signature = models.TextField(null=True, blank=True)

    # Witness details
    witness_name = models.CharField(max_length=200, blank=True, default='')
    witness_id_number = models.CharField(max_length=50, blank=True, default='')
    witness_phone = models.CharField(max_length=20, blank=True, default='')
    witness_signature = models.TextField(null=True, blank=True)
    witness_signed_at = models.DateTimeField(null=True, blank=True)

    # Submission tracking
    lessee_submitted = models.BooleanField(default=False)
    lessee_submitted_at = models.DateTimeField(null=True, blank=True)

    owner_signed = models.BooleanField(default=False)
    lessee_signed = models.BooleanField(default=False)
    owner_signed_at = models.DateTimeField(null=True, blank=True)
    lessee_signed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Lease Agreement #{self.id} - {self.land.title}"
