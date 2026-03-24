from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Custom User model for FarmLease application.
    Supports multiple user roles.
    """

    ROLE_CHOICES = (
        ("farmer", "Farmer"),
        ("landowner", "Landowner"),
        ("dealer", "Agro-Dealer"),
        ("admin", "Administrator"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    phone_number = models.CharField(max_length=15, unique=True)
    email = models.EmailField(unique=True)

    address = models.TextField(blank=True, null=True)
    county = models.CharField(max_length=50, blank=True, null=True)
    id_number = models.CharField(max_length=20, blank=True, null=True, unique=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'phone_number', 'role']

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        """
        Sync is_staff with role='admin'.
        Admin users always get is_staff=True; all others are stripped of staff/superuser.
        """
        # Backward-compat: some older data used role='owner'. Normalize it.
        if self.role == 'owner':
            self.role = 'landowner'
        if self.role == 'admin':
            self.is_staff = True
        else:
            self.is_staff = False
            self.is_superuser = False
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email} ({self.role})"

    @property
    def name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username


class Notification(models.Model):
    """Persistent in-app notification for any user."""
    TYPE_CHOICES = (
        ('info', 'Info'),
        ('success', 'Success'),
        ('warning', 'Warning'),
        ('error', 'Error'),
    )

    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    notif_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='info')
    icon = models.CharField(max_length=60, default='notifications')
    related_id = models.IntegerField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.notif_type}] {self.title} → {self.user.email}"


def create_notification(user, title, body='', notif_type='info', icon='notifications', related_id=None):
    """Helper: create a Notification for a user. Safe to call from any view."""
    Notification.objects.create(
        user=user,
        title=title,
        body=body,
        notif_type=notif_type,
        icon=icon,
        related_id=related_id,
    )
