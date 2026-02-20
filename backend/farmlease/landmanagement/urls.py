"""URL configuration for the landmanagement app."""
# pylint: disable=import-error
from django.urls import path
from . import views

urlpatterns = [
    # Owner — multi-step upload
    path('create-basic/', views.create_basic_info, name='create_basic'),
    path('<int:land_id>/add-soil/', views.add_soil_climate, name='add_soil'),
    path(
        '<int:land_id>/upload-photos/',
        views.upload_land_images,
        name='upload_photos',
    ),

    # Owner — list & dashboard
    path('my-lands/', views.list_user_lands, name='my_lands'),
    path(
        'ownerdashboard/',
        views.LandownerDashboardStats.as_view(),
        name='owner_dashboard',
    ),

    # Public — verified listings for lessees
    path('listings/', views.public_land_listings, name='public_listings'),

    # Admin — management
    path('admin/all/', views.admin_land_list, name='admin_land_list'),
    path(
        'admin/<int:land_id>/verify/', views.verify_land, name='verify_land'
    ),
    path('admin/<int:land_id>/flag/', views.flag_land, name='flag_land'),
    path(
        'admin/stats/',
        views.AdminDashboardStats.as_view(),
        name='admin_land_stats',
    ),
]
