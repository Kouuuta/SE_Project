# Generated by Django 5.1.6 on 2025-02-25 11:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0007_alter_product_item_code"),
    ]

    operations = [
        migrations.AddField(
            model_name="sale",
            name="status",
            field=models.CharField(
                choices=[
                    ("Pending", "Pending"),
                    ("Cancelled", "Cancelled"),
                    ("Delivered", "Delivered"),
                ],
                default="Pending",
                max_length=10,
            ),
        ),
    ]
