# Generated by Django 3.0.8 on 2020-08-11 14:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0020_auto_20200811_1708'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='meeting',
            options={'ordering': ('time',)},
        ),
    ]
