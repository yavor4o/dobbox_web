# Generated by Django 5.0.3 on 2024-03-15 12:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nomenclatures', '0004_city'),
    ]

    operations = [
        migrations.AddField(
            model_name='city',
            name='gps_lat',
            field=models.FloatField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='city',
            name='gps_long',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
