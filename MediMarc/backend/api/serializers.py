import json
from django.contrib.auth.models import User
from requests import Response
from rest_framework import serializers
from rest_framework.viewsets import ModelViewSet
from .models import Product, Category, Customer, Sale, CustomUser
from rest_framework import viewsets
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    user_type_display = serializers.SerializerMethodField()  

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "first_name", "last_name", "user_type", "user_type_display"]

    def get_user_type_display(self, obj):
        """ Return correct user type name for frontend display """
        if obj.is_superuser:
            return "SUPER ADMIN"
        return dict(CustomUser.USER_TYPES).get(obj.user_type, "USER")


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['user'] = {
            'username': self.user.username,
            'user_type_display': self.user.get_user_type_display()
        }
        return data

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category', read_only=True)  # ✅ Ensures correct display

    class Meta:
        model = Product
        fields = ['product_id', 'item_code', 'product_name', 'category', 'buying_price', 'selling_price', 'stock', 'category_name', 'lot_number', 'expiration_date']


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class SaleSerializer(serializers.ModelSerializer):
    status = serializers.CharField(required=True)  
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    product_id = serializers.IntegerField(source="product.product_id", read_only=True) 
    product_name = serializers.CharField(source="product.product_name", read_only=True)
    item_code = serializers.CharField(source="product.item_code", read_only=True)
    selling_price = serializers.DecimalField(
        source="product.selling_price", read_only=True, max_digits=10, decimal_places=2
    )
    lot_number = serializers.CharField(source="product.lot_number", read_only=True)
    expiration_date = serializers.DateField(source="product.expiration_date", read_only=True)

    class Meta:
        model = Sale
        fields = ["id", "customer", "customer_name", "product", "product_id", "product_name",
                  "item_code", "lot_number", "expiration_date", "quantity", "selling_price", "total", "date", "status"]

class SaleViewSet(ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer

    def create(self, request, *args, **kwargs):
        print("📌 Incoming Sale Data:", json.dumps(request.data, indent=2))

        product_id = request.data.get("product")
        if not Product.objects.filter(id=product_id).exists():
            return Response({"product": ["Product ID does not exist."]}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)