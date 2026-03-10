from django.db import models as django_models
from django.db.models import Sum, Count, Avg
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from .models import Product, ProductImage, CustomerQuery, QueryReply
from .serializers import ProductSerializer, CustomerQuerySerializer, QueryReplySerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dealer_dashboard(request):
    """
    Dashboard statistics for dealer
    """
    dealer = request.user
    products = Product.objects.filter(dealer=dealer)
    
    # Calculate statistics
    total_products = products.count()
    low_stock_count = products.filter(quantity__lte=django_models.F('low_stock_level')).count()
    out_of_stock = products.filter(quantity=0).count()
    active_products = products.filter(is_visible=True, is_active=True).count()
    
    return Response({
        'total_sales': 0,  # TODO: Calculate from orders
        'sales_trend': 0,
        'active_orders': 0,  # TODO: Calculate from orders
        'orders_trend': 0,
        'low_stock_count': low_stock_count,
        'out_of_stock_count': out_of_stock,
        'store_rating': 4.5,  # TODO: Calculate from reviews
        'rating_change': 0.2,
        'total_products': total_products,
        'active_products': active_products,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inventory_alerts(request):
    """
    Get products with low stock or out of stock
    """
    dealer = request.user
    alerts = Product.objects.filter(
        dealer=dealer,
        quantity__lte=django_models.F('low_stock_level')
    ).order_by('quantity')
    
    serializer = ProductSerializer(alerts, many=True)
    return Response(serializer.data)


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public ViewSet for browsing all available products (for lessees/shop)
    """
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Return all visible and active products from all dealers
        queryset = Product.objects.filter(is_visible=True, is_active=True)
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category and category not in ['All Categories', 'All Products']:
            queryset = queryset.filter(category=category)
        
        # Search by name or description
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                django_models.Q(name__icontains=search) | 
                django_models.Q(description__icontains=search)
            )
        
        # Filter by dealer
        dealer = self.request.query_params.get('dealer')
        if dealer:
            queryset = queryset.filter(dealer_id=dealer)
        
        return queryset


class DealerProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for dealer products management
    """
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return products belonging to the current dealer
        return Product.objects.filter(dealer=self.request.user)

    def perform_create(self, serializer):
        # Automatically set the dealer to the current user
        product = serializer.save(dealer=self.request.user)
        
        # Handle image uploads
        files = self.request.FILES
        for key, file in files.items():
            if key.startswith('image_'):
                ProductImage.objects.create(
                    product=product,
                    image=file,
                    is_primary=(key == 'image_0')  # First image is primary
                )
    
    @action(detail=True, methods=['post'])
    def toggle_visibility(self, request, pk=None):
        """Toggle product visibility"""
        product = self.get_object()
        product.is_visible = not product.is_visible
        product.save()
        return Response({'is_visible': product.is_visible})

    def list(self, request, *args, **kwargs):
        """List products with optional filtering"""
        queryset = self.get_queryset()
        
        # Filter by category
        category = request.query_params.get('category')
        if category and category != 'All Products':
            queryset = queryset.filter(category=category)
        
        # Search by name
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        # Filter by status
        status_filter = request.query_params.get('status')
        if status_filter:
            if status_filter == 'active':
                queryset = queryset.filter(is_active=True)
            elif status_filter == 'hidden':
                queryset = queryset.filter(is_visible=False)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CustomerQueryViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing customer queries (dealer side)
    """
    serializer_class = CustomerQuerySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only return queries for the current dealer
        return CustomerQuery.objects.filter(dealer=self.request.user)
    
    def list(self, request, *args, **kwargs):
        """List queries with optional filtering"""
        queryset = self.get_queryset()
        
        # Filter by status
        status_filter = request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Search by customer name or message
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                django_models.Q(customer__first_name__icontains=search) |
                django_models.Q(customer__last_name__icontains=search) |
                django_models.Q(message__icontains=search)
            )
        
        serializer = self.get_serializer(queryset, many=True)
        return Response({'results': serializer.data})
    
    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """Reply to a customer query"""
        query = self.get_object()
        message = request.data.get('message')
        
        if not message:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create reply
        reply = QueryReply.objects.create(
            query=query,
            sender=request.user,
            message=message
        )
        
        # Update query status
        query.status = 'replied'
        query.save()
        
        serializer = QueryReplySerializer(reply)
        return Response(serializer.data)
    
    def partial_update(self, request, *args, **kwargs):
        """Update query status or mark as read"""
        query = self.get_object()
        
        if 'status' in request.data:
            query.status = request.data['status']
        if 'is_read' in request.data:
            query.is_read = request.data['is_read']
        
        query.save()
        serializer = self.get_serializer(query)
        return Response(serializer.data)
