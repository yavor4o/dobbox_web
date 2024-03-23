# Generated by Django 5.0.3 on 2024-03-19 12:32

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contragents', '0003_alter_contragent_attention_alter_contragent_chain_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contragent',
            name='company',
            field=models.ForeignKey(blank=True, db_column='company_code', null=True, on_delete=django.db.models.deletion.PROTECT, related_name='contragents', to='contragents.company', verbose_name='Компания'),
        ),
    ]