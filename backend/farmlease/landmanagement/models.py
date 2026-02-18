from django.db import models
from django.conf import settings


class LandListing(models.Model):
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
    preferred_duration = models.CharField(max_length=50)
    title_deed_number = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        help_text="For admin verification only"
    )
    
    # Amenities
    has_irrigation = models.BooleanField(default=False)
    has_electricity = models.BooleanField(default=False)
    has_road_access = models.BooleanField(default=False)
    has_fencing = models.BooleanField(default=False)

    # Location
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    # Workflow Status
    status = models.CharField(max_length=20, default='Vacant')
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.title)


class SoilClimateData(models.Model):
    # STEP 2: Soil & Climate Data
    land = models.OneToOneField(
        LandListing,
        on_delete=models.CASCADE,
        related_name='soil_data'
    )
    ph_level = models.FloatField()
    nitrogen = models.FloatField()
    phosphorus = models.FloatField()
    potassium = models.FloatField()
    moisture = models.FloatField()
    temperature = models.FloatField()
    rainfall = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)


class LandImage(models.Model):
    # STEP 3: Photos
    land = models.ForeignKey(
        LandListing,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='land_photos/')
