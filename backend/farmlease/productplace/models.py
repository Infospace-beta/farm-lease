from django.db import models
from accounts.models import User


class Product(models.Model):
    """
    Product model for Agro-Dealer marketplace
    """
    CATEGORY_CHOICES = [
        ('Fertilizers', 'Fertilizers'),
        ('Seeds', 'Seeds'),
        ('Equipment', 'Equipment'),
        ('Pesticides', 'Pesticides'),
        ('Animal Feeds', 'Animal Feeds'),
    ]

    dealer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='dealer_products')
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    sku = models.CharField(max_length=100, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    quantity = models.IntegerField(default=0)
    low_stock_level = models.IntegerField(default=20)
    summary = models.TextField(blank=True)
    description = models.TextField(blank=True)
    is_visible = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def stock(self):
        return self.quantity

    @property
    def unit(self):
        return "Units"


class ProductImage(models.Model):
    """
    Product images for the marketplace
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='product_photos/')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.product.name}"


class CustomerQuery(models.Model):
    """
    Customer queries/inquiries to dealers
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('replied', 'Replied'),
        ('resolved', 'Resolved'),
    ]
    
    dealer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_queries')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_queries')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True, blank=True, related_name='queries')
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Customer Queries'
    
    def __str__(self):
        return f"Query from {self.customer.get_full_name()} to {self.dealer.get_full_name()}"


class QueryReply(models.Model):
    """
    Replies to customer queries
    """
    query = models.ForeignKey(CustomerQuery, on_delete=models.CASCADE, related_name='replies')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
        verbose_name_plural = 'Query Replies'
    
    def __str__(self):
        return f"Reply to query #{self.query.id}"
