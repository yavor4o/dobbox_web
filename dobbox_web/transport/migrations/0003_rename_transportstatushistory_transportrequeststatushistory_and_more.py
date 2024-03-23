# Generated by Django 5.0.3 on 2024-03-23 12:53

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('transport', '0002_transportstatushistory'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name='TransportStatusHistory',
            new_name='TransportRequestStatusHistory',
        ),
        migrations.AlterField(
            model_name='transportrequests',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Дата на създаване'),
        ),
        migrations.AlterField(
            model_name='transportrequests',
            name='is_complete',
            field=models.BooleanField(default=False, verbose_name='Изпълнена'),
        ),
        migrations.AlterField(
            model_name='transportrequests',
            name='is_self_transport',
            field=models.BooleanField(default=False, verbose_name='Транспорт SR'),
        ),
        migrations.AlterField(
            model_name='transportrequests',
            name='updated_at',
            field=models.DateTimeField(auto_now=True, verbose_name='Последна промяна на'),
        ),
    ]
