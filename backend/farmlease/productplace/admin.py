from django.contrib import admin
from .models import Product, ProductImage, CustomerQuery, QueryReply


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class QueryReplyInline(admin.TabularInline):
    model = QueryReply
    extra = 0
    readonly_fields = ['sender', 'created_at']


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'dealer', 'category', 'price', 'quantity', 'is_visible', 'is_active', 'created_at']
    list_filter = ['category', 'is_visible', 'is_active', 'created_at']
    search_fields = ['name', 'description', 'sku']
    inlines = [ProductImageInline]
    readonly_fields = ['created_at', 'updated_at']


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ['product', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'created_at']


@admin.register(CustomerQuery)
class CustomerQueryAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'dealer', 'product', 'status', 'is_read', 'created_at']
    list_filter = ['status', 'is_read', 'created_at']
    search_fields = ['message', 'customer__first_name', 'customer__last_name', 'dealer__first_name']
    inlines = [QueryReplyInline]
    readonly_fields = ['created_at', 'updated_at']


@admin.register(QueryReply)
class QueryReplyAdmin(admin.ModelAdmin):
    list_display = ['query', 'sender', 'created_at']
    list_filter = ['created_at']
    readonly_fields = ['created_at']
