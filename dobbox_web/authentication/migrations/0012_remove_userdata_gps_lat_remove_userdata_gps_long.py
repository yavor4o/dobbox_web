# Generated by Django 5.0.3 on 2024-03-15 13:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0011_userdata_office'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userdata',
            name='gps_lat',
        ),
        migrations.RemoveField(
            model_name='userdata',
            name='gps_long',
        ),
    ]
