from django.contrib.auth.models import AbstractUser, Group, Permission
from django.db import models
from django.utils import timezone

class CustomUser(AbstractUser):
    USER_TYPES = [
        ("SUPERADMIN", "Superadmin"),
        ("ADMIN", "Admin"),
        ("USER", "User"),
    ]
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default="USER")
    groups = models.ManyToManyField(Group, related_name="customuser_groups", blank=True)
    user_permissions = models.ManyToManyField(
        Permission, related_name="customuser_permissions", blank=True
    )

    def __str__(self):
        return self.username

    def get_user_type_display(self):
        if self.is_superuser:
            return "SUPER ADMIN"
        return dict(self.USER_TYPES).get(self.user_type, "USER")


class Product(models.Model):
    product_id = models.AutoField(primary_key=True)
    item_code = models.CharField(max_length=100)
    product_name = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    buying_price = models.DecimalField(max_digits=10, decimal_places=2)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    original_stock = models.IntegerField(default=0)
    critical_stock = models.PositiveIntegerField(default=100)  # New critical stock field
    created_at = models.DateTimeField(auto_now_add=True)
    lot_number = models.CharField(max_length=100, blank=True, null=True)
    expiration_date = models.DateField(blank=True, null=True)
    shipment_date = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.product_name


class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Customer(models.Model):
    name = models.CharField(max_length=255, unique=True)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Sale(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Cancelled", "Cancelled"),
        ("Delivered", "Delivered"),
    ]
    invoice_number = models.CharField(max_length=100, null=True, blank=True)  
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="sales")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="sales")
    quantity = models.PositiveIntegerField()
    total = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="Pending")

    def __str__(self):
        return f"{self.customer.name} - {self.product.product_name} - {self.quantity}"



