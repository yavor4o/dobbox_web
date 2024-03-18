# Generated by Django 5.0.3 on 2024-03-17 21:24

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assets', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Warehouse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=50, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('city', models.CharField(max_length=100)),
                ('address', models.CharField(max_length=255)),
                ('gps_lat', models.FloatField(blank=True, null=True)),
                ('gps_long', models.FloatField(blank=True, null=True)),
                ('region', models.CharField(max_length=100)),
                ('dealer_id', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='WarehouseType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.AddField(
            model_name='asset',
            name='warehouse',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='assets.warehouse', verbose_name='Склад'),
        ),
        migrations.AddField(
            model_name='warehouse',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='assets.warehousetype'),
        ),
    ]