# Generated by Django 5.0.3 on 2024-03-18 00:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('nomenclatures', '0012_rename_markettypes_customertype_markettypes_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='warehouse',
            name='code',
        ),
    ]
