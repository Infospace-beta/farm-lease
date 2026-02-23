"""URL configuration for the landmanagement app."""
# pylint: disable=import-error
from django.urls import path
from . import views

urlpatterns = [
    # Owner — multi-step upload
    path('create-basic/', views.create_basic_info, name='create_basic'),
    path(
        '<int:land_id>/add-soil/',
        views.add_soil_climate,
        name='add_soil'
    ),
    path(
        '<int:land_id>/upload-photos/',
        views.upload_land_images,
        name='upload_photos'
    ),
    # Owner — list & dashboard
    path('my-lands/', views.list_user_lands, name='my_lands'),
    path(
        'ownerdashboard/',
        views.LandownerDashboardStats.as_view(),
        name='owner'
    ),
    # Public — browse
    path('browse/', views.browse_land, name='browse_land'),
]
