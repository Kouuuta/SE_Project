# Generated by Django 5.1.6 on 2025-04-09 19:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0005_product_original_stock"),
    ]

    operations = [
        migrations.AlterField(
            model_name="product",
            name="shipment_date",
            field=models.DateField(),
        ),
    ]
