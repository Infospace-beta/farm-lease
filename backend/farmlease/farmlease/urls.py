"""
URL configuration for farmlease project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
from accounts.views import (
    LesseeDashboardView,
    LesseeNotificationListView,
    mark_notification_read,
    mark_all_notifications_read,
)
from productplace.views import dealer_dashboard

def favicon_view(request):
    return HttpResponse(status=204)  # No Content

urlpatterns = [
    path('favicon.ico', favicon_view),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/lands/', include('landmanagement.urls')),
    path('api/contracts/', include('contracts.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/productplace/', include('productplace.urls')),

    # Dealer-specific endpoints
    path('api/dealer/dashboard/', dealer_dashboard, name='dealer-dashboard'),

    # Lessee-specific endpoints
    path('api/lessee/dashboard/', LesseeDashboardView.as_view(), name='lessee-dashboard'),
    path('api/lessee/notifications/', LesseeNotificationListView.as_view(), name='lessee-notifications'),
    path('api/lessee/notifications/<int:pk>/', mark_notification_read, name='lessee-notification-read'),
    path('api/lessee/notifications/mark-all-read/', mark_all_notifications_read, name='lessee-notifications-mark-all'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)