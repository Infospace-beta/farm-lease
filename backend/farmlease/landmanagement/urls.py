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
    path('owner-notifications/', views.owner_notifications, name='owner_notifications'),
    path('owner-activity/', views.owner_activity_feed, name='owner_activity'),
    # Public — browse
    path('browse/', views.browse_land, name='browse_land'),
    # Admin — management
    path('admin/all/', views.admin_land_list, name='admin_all_lands'),
    path('admin/stats/', views.admin_stats, name='admin_stats'),
    path(
        'admin/<int:land_id>/verify/',
        views.verify_land,
        name='verify_land'
    ),
    path(
        'admin/<int:land_id>/flag/',
        views.flag_land,
        name='flag_land'
    ),
]
