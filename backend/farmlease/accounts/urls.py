from django.urls import path

from .views import (
    AdminAnalyticsView,
    AdminDashboardStatsView,
    AdminDealerOversightView,
    AdminPaymentsView,
    AdminUserListView,
    AdminUserSuspendView,
    ChangePasswordView,
    LesseeDashboardView,
    LesseeNotificationListView,
    MyNotificationListView,
    MyTokenRefreshView,
    LogoutView,
    MyTokenObtainPairView,
    SignupView,
    UserProfileView,
    get_user_profile,
    mark_notification_read,
    mark_all_notifications_read,
    notification_unread_count,
)

app_name = 'accounts'

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', MyTokenObtainPairView.as_view(), name='login'),
    path('refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('me/', get_user_profile, name='get_user_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('admin/', AdminDashboardStatsView.as_view(), name='admin'),
    path('admin/users/', AdminUserListView.as_view(), name='admin_users'),
    path('admin/users/<int:user_id>/suspend/', AdminUserSuspendView.as_view(), name='admin_user_suspend'),
    path('admin/dealers/', AdminDealerOversightView.as_view(), name='admin_dealers'),
    path('admin/payments/', AdminPaymentsView.as_view(), name='admin_payments'),
    path('admin/analytics/', AdminAnalyticsView.as_view(), name='admin_analytics'),
    # Notifications
    path('notifications/', MyNotificationListView.as_view(), name='notifications'),
    path('notifications/unread-count/', notification_unread_count, name='notification_unread_count'),
    path('notifications/<int:pk>/read/', mark_notification_read, name='mark_notification_read'),
    path('notifications/mark-all-read/', mark_all_notifications_read, name='mark_all_notifications_read'),
]
