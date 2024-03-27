# Generated by Django 5.0.3 on 2024-03-23 20:20

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transport', '0009_alter_transportpricecompany_asset_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='TransportCompanyRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estimated_transport_cost', models.FloatField(blank=True, null=True, verbose_name='Транспортни разходи')),
                ('total_distance_km', models.FloatField(blank=True, null=True, verbose_name='Общо разстояние в км')),
                ('transport_price_per_km', models.FloatField(blank=True, null=True, verbose_name='Цена за транспорт за км')),
                ('price_for_assets', models.FloatField(blank=True, null=True, verbose_name='Цена за активи')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Създадена на')),
                ('transport_company', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='transport_requests_company', to='transport.transportcompany', verbose_name='Транспортна компания')),
                ('transport_requests', models.ManyToManyField(blank=True, null=True, related_name='assigned_transport_company_requests', to='transport.transportrequests', verbose_name='Заявки за транспорт')),
            ],
            options={
                'verbose_name': 'Заявка за транспорт',
                'verbose_name_plural': 'Заявки за транспорт',
            },
        ),
    ]