from django_filters import rest_framework as filters

from .models import Sale


class SalesFilter(filters.FilterSet):
    start_date = filters.DateFilter(field_name="date", lookup_expr="gte")
    end_date = filters.DateFilter(field_name="date", lookup_expr="lte")
    customer_name = filters.CharFilter(
        field_name="customer__name", lookup_expr="icontains"
    )

    class Meta:
        model = Sale
        fields = [
            "date",
            "customer",
            "product",
            "quantity",
            "total",
        ]
