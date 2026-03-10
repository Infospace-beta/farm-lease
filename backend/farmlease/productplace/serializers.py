from rest_framework import serializers
from .models import Product, ProductImage, CustomerQuery, QueryReply


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'created_at']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    dealer_name = serializers.CharField(source='dealer.get_full_name', read_only=True)
    stock = serializers.IntegerField(source='quantity', read_only=True)
    unit = serializers.CharField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'dealer', 'dealer_name', 'name', 'category', 'sku',
            'price', 'discount_price', 'quantity', 'stock', 'unit',
            'low_stock_level', 'summary', 'description',
            'is_visible', 'is_active', 'created_at', 'updated_at', 'images'
        ]
        read_only_fields = ['dealer', 'created_at', 'updated_at']

    def create(self, validated_data):
        # Set the dealer from the request user
        validated_data['dealer'] = self.context['request'].user
        return super().create(validated_data)


class QueryReplySerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    
    class Meta:
        model = QueryReply
        fields = ['id', 'sender', 'sender_name', 'message', 'created_at']
        read_only_fields = ['sender', 'created_at']


class CustomerQuerySerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    dealer_name = serializers.CharField(source='dealer.get_full_name', read_only=True)
    product_name = serializers.CharField(source='product.name', read_only=True, allow_null=True)
    replies = QueryReplySerializer(many=True, read_only=True)
    
    class Meta:
        model = CustomerQuery
        fields = [
            'id', 'dealer', 'dealer_name', 'customer', 'customer_name',
            'product', 'product_name', 'message', 'status', 'is_read',
            'created_at', 'updated_at', 'replies'
        ]
        read_only_fields = ['dealer', 'customer', 'created_at', 'updated_at']
