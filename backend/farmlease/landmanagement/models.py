"""Data models for the landmanagement app."""
# pylint: disable=import-error
from django.db import models
from django.conf import settings


class LandListing(models.Model):
    """Represents a land listing created by a farm owner."""

    # STEP 1: Basic Info
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    total_area = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )  # In Acres
    price_per_month = models.DecimalField(max_digits=12, decimal_places=2)
    preferred_duration = models.CharField(max_length=50, blank=True, default='')
    title_deed_number = models.CharField(
        max_length=100,
        help_text="For admin verification only — compulsory"
    )

    # Amenities
    has_irrigation = models.BooleanField(default=False)
    has_electricity = models.BooleanField(default=False)
    has_road_access = models.BooleanField(default=False)
    has_fencing = models.BooleanField(default=False)

    # Location
    location_name = models.CharField(
        max_length=255,
        default="Unknown Location"
    )
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    # Add status choices for better control
    STATUS_CHOICES = [
        ('Vacant', 'Vacant'),
        ('Pending_Payment', 'Pending Payment'),
        ('Leased', 'Leased'),
        ('Under_Review', 'Under Review'),
    ]

    # Workflow Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Under_Review'
    )
    is_verified = models.BooleanField(default=False)
    is_flagged = models.BooleanField(default=False)
    flag_reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    # Track the Current Tenant (null if vacant)
    current_lessee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='rented_lands'
    )

    def __str__(self):
        return str(self.title)


class SoilClimateData(models.Model):
    """Stores optional soil and climate data linked to a land listing."""

    SOIL_TYPE_CHOICES = [
        ('Sandy', 'Sandy'),
        ('Clay', 'Clay'),
        ('Loamy', 'Loamy'),
        ('Silt', 'Silt'),
        ('Peat', 'Peat'),
        ('Chalk', 'Chalk'),
        ('Sandy Loam', 'Sandy Loam'),
        ('Clay Loam', 'Clay Loam'),
        ('Other', 'Other'),
    ]

    # STEP 2: Soil & Climate Data (all optional — farmer may not have lab data)
    land = models.OneToOneField(
        LandListing,
        on_delete=models.CASCADE,
        related_name='soil_data'
    )
    soil_type = models.CharField(
        max_length=50,
        choices=SOIL_TYPE_CHOICES,
        blank=True,
        null=True,
        help_text="General soil classification"
    )
    ph_level = models.FloatField(null=True, blank=True)
    nitrogen = models.FloatField(null=True, blank=True)
    phosphorus = models.FloatField(null=True, blank=True)
    potassium = models.FloatField(null=True, blank=True)
    moisture = models.FloatField(null=True, blank=True)
    temperature = models.FloatField(null=True, blank=True)
    rainfall = models.FloatField(null=True, blank=True)
    # Optional coordinates — can be provided here if not known at listing time
    latitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=9, decimal_places=6, null=True, blank=True
    )
    updated_at = models.DateTimeField(auto_now=True)


class LandImage(models.Model):
    """Stores photo uploads associated with a land listing."""

    # STEP 3: Photos
    land = models.ForeignKey(
        LandListing,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='land_photos/')
