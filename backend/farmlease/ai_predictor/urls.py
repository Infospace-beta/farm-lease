from django.urls import path
from . import views

urlpatterns = [
    path('predict/', views.predict_crop, name='ai-predict-crop'),
    path('history/', views.prediction_history, name='ai-prediction-history'),
    path('land-match/', views.land_match, name='ai-land-match'),
    path('chat/', views.chat, name='ai-chat'),
    path('health/', views.health_check, name='ai-health-check'),
]
