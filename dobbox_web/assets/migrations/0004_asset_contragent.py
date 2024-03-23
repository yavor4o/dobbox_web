# Generated by Django 5.0.3 on 2024-03-18 20:38

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assets', '0003_remove_warehouse_type_alter_asset_warehouse_and_more'),
        ('contragents', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='asset',
            name='contragent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='contragents.contragent', verbose_name='Обект'),
        ),
    ]