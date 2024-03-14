# Generated by Django 5.0.3 on 2024-03-14 19:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0005_remove_userdata_region'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='dobboxuser',
            options={'permissions': (('can_import', 'Може да импортира'), ('can_export', 'Може да експортира')), 'verbose_name': 'Потребител', 'verbose_name_plural': 'Потребители'},
        ),
        migrations.AlterModelOptions(
            name='userdata',
            options={'permissions': (('can_import', 'Може да импортира'), ('can_export', 'Може да експортира')), 'verbose_name': 'Профил', 'verbose_name_plural': 'Профил'},
        ),
    ]
