# Generated by Django 5.0.3 on 2024-03-15 13:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0009_userdata_provincial_city'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userdata',
            name='provincial_city',
        ),
    ]
