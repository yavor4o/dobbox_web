# Generated by Django 5.0.3 on 2024-03-19 12:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contragents', '0004_alter_contragent_company'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contragent',
            name='neighborhood',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]