from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    AdminDashboardStatsView,
    ChangePasswordView,
    LesseeDashboardView,
    LesseeNotificationListView,
    LogoutView,
    MyTokenObtainPairView,
    SignupView,
    UserProfileView,
    get_user_profile,
    mark_notification_read,
    mark_all_notifications_read,
)

app_name = 'accounts'

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('me/', get_user_profile, name='get_user_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('admin/', AdminDashboardStatsView.as_view(), name='admin'),
]
