from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, DealerProductViewSet, CustomerQueryViewSet, dealer_dashboard, inventory_alerts

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')  # Public product listing for shop
router.register(r'dealer/products', DealerProductViewSet, basename='dealer-products')
router.register(r'dealer/queries', CustomerQueryViewSet, basename='dealer-queries')

urlpatterns = [
    path('dealer/inventory/alerts/', inventory_alerts, name='dealer-inventory-alerts'),
    path('', include(router.urls)),
]
