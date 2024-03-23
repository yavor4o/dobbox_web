# Generated by Django 5.0.3 on 2024-03-23 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('nomenclatures', '0014_alter_warehouse_region'),
    ]

    operations = [
        migrations.CreateModel(
            name='AssetType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True, verbose_name='Наименование на типа на съоръжението')),
            ],
            options={
                'verbose_name': 'Тип на съоръжение',
                'verbose_name_plural': 'Типове на съоръжения',
            },
        ),
    ]