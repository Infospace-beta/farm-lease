from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_crop, name='ai-predict-crop'),
    path('health/', views.health_check, name='ai-health-check'),
]
