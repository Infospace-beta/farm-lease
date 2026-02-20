from django.db import models
from django.conf import settings

class LandListing(models.Model):
    # STEP 1: Basic Info
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    total_area = models.DecimalField(max_digits=10, decimal_places=2) # In Acres
    price_per_month = models.DecimalField(max_digits=12, decimal_places=2)
    preferred_duration = models.CharField(max_length=50)
    
    # Amenities
    has_irrigation = models.BooleanField(default=False)
    has_electricity = models.BooleanField(default=False)
    has_road_access = models.BooleanField(default=False)
    has_fencing = models.BooleanField(default=False)

    # Location
    location_name = models.CharField(max_length=255, default="Unknown Location")
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)

    # Workflow Status
    status = models.CharField(max_length=20, default='Vacant')
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # Document for Admin to check (Hidden from Lessee)
    title_deed_number = models.CharField(max_length=255, unique=True, help_text="The official registration number from the Ministry of Lands"
    )
    
    # Track the Current Tenant (null if vacant)
    current_lessee = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, blank=True, 
        related_name='rented_lands'
    )

    #Add status choices for better control
    STATUS_CHOICES = [
        ('Vacant', 'Vacant'),
        ('Pending_Payment', 'Pending Payment'),
        ('Leased', 'Leased'),
        ('Under_Review', 'Under Review'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Vacant')

    def __str__(self):
        return self.title

class SoilClimateData(models.Model):
    # STEP 2: Soil & Climate Data
    land = models.OneToOneField(LandListing, on_delete=models.CASCADE, related_name='soil_data')
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
    land = models.ForeignKey(LandListing, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='land_photos/')
