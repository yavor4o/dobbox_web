# Generated by Django 5.0.3 on 2024-03-17 22:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nomenclatures', '0008_custclass_customertype_markettype_objtype_seasonal'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustSubClass',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=20, unique=True, verbose_name='Код')),
                ('name', models.CharField(max_length=100, verbose_name='Име')),
            ],
            options={
                'verbose_name': 'Подклас на клиент',
                'verbose_name_plural': 'Подкласове на клиенти',
            },
        ),
        migrations.AlterModelOptions(
            name='warehouse',
            options={'verbose_name': 'Склад', 'verbose_name_plural': 'Складове'},
        ),
        migrations.AlterModelOptions(
            name='warehousetype',
            options={'verbose_name': 'Тип на склад', 'verbose_name_plural': 'Типове на складове'},
        ),
        migrations.AlterField(
            model_name='warehouse',
            name='address',
            field=models.CharField(max_length=255, verbose_name='Адрес'),
        ),
        migrations.AlterField(
            model_name='warehouse',
            name='city',
            field=models.CharField(max_length=100, verbose_name='Град'),
        ),
        migrations.AlterField(
            model_name='warehouse',
            name='code',
            field=models.CharField(max_length=50, unique=True, verbose_name='Код'),
        ),
        migrations.AlterField(
            model_name='warehouse',
            name='dealer_id',
            field=models.CharField(blank=True, max_length=50, null=True, verbose_name='Дилър ID'),
        ),
        migrations.AlterField(
            model_name='warehouse',
            name='gps_lat',
            field=models.FloatField(blank=True, null=True, verbose_name='GPS Ширина'),
        ),
        migrations.AlterField(
            model_name='warehouse',
            name='gps_long',
            field=models.FloatField(blank=True, null=True, verbose_name='GPS Дължина'),
        ),
        migrations.AlterField(
            model_name='warehouse',
            name='name',
            field=models.CharField(max_length=255, verbose_name='Име'),
        ),
        migrations.AlterField(
            model_name='warehouse',
            name='region',
            field=models.CharField(max_length=100, verbose_name='Регион'),
        ),
        migrations.AlterField(
            model_name='warehouse',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='nomenclatures.warehousetype', verbose_name='Тип'),
        ),
        migrations.AlterField(
            model_name='warehousetype',
            name='name',
            field=models.CharField(max_length=100, unique=True, verbose_name='Име'),
        ),
    ]
