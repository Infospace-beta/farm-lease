from django.urls import path
from . import views

urlpatterns = [
    path('create-basic/', views.create_basic_info, name='create_basic'),
    path('<int:land_id>/add-soil/', views.add_soil_climate, name='add_soil'),
    path('<int:land_id>/upload-photos/', views.upload_land_images, name='upload_photos'),
    path('browse/', views.browse_land, name='browse_land'),
    path('ownerdashboard/', views.LandownerDashboardStats.as_view(), name='owner'),
]