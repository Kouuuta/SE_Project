# Generated by Django 5.1.6 on 2025-04-09 08:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="product",
            name="shipment_date",
            field=models.DateField(blank=True, null=True),
        ),
    ]
