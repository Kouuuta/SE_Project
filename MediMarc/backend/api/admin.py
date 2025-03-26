from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Product, Category, Customer, Sale, CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("id", "username", "email", "user_type", "is_staff", "is_superuser")

admin.site.register(CustomUser, CustomUserAdmin)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_id', 'product_name', 'category', 'buying_price', 'selling_price')

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')  

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'address', 'created_at', 'updated_at')

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'product', 'get_quantity', 'total', 'date')  # ✅ Use get_quantity

    def get_quantity(self, obj):
        return obj.quantity  # ✅ Fetch quantity safely
    get_quantity.short_description = 'Quantity'  # ✅ Label in admin panel