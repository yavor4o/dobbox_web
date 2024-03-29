# Generated by Django 5.0.3 on 2024-03-17 22:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nomenclatures', '0007_warehousetype_warehouse'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustClass',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=20, verbose_name='Код')),
                ('name', models.CharField(max_length=100, verbose_name='Име')),
            ],
            options={
                'verbose_name': 'Приоритет',
                'verbose_name_plural': 'Приоритети',
            },
        ),
        migrations.CreateModel(
            name='CustomerType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=20, unique=True, verbose_name='Код')),
                ('name', models.CharField(max_length=100, verbose_name='Име')),
            ],
            options={
                'verbose_name': 'Тип на клиент',
                'verbose_name_plural': 'Типове на клиенти',
            },
        ),
        migrations.CreateModel(
            name='MarketType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=20, unique=True, verbose_name='Код')),
                ('name', models.CharField(max_length=100, verbose_name='Име')),
            ],
            options={
                'verbose_name': 'Тип на пазара',
                'verbose_name_plural': 'Типове на пазари',
            },
        ),
        migrations.CreateModel(
            name='ObjType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=20, unique=True, verbose_name='Код')),
                ('name', models.CharField(max_length=100, verbose_name='Име')),
            ],
            options={
                'verbose_name': 'Тип Обект',
                'verbose_name_plural': 'Типове Обекти',
            },
        ),
        migrations.CreateModel(
            name='Seasonal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True, verbose_name='Наименование')),
            ],
            options={
                'verbose_name': 'Сезонност',
                'verbose_name_plural': 'Сезонност',
            },
        ),
    ]
