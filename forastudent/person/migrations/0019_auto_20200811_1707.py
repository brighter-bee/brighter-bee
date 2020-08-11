# Generated by Django 3.0.8 on 2020-08-11 07:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('person', '0018_project_email'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='category',
        ),
        migrations.RemoveField(
            model_name='post',
            name='poster',
        ),
        migrations.RemoveField(
            model_name='reply',
            name='poster',
        ),
        migrations.RemoveField(
            model_name='reply',
            name='replyTo',
        ),
        migrations.DeleteModel(
            name='ForumCategory',
        ),
        migrations.DeleteModel(
            name='ForumSection',
        ),
        migrations.DeleteModel(
            name='Post',
        ),
        migrations.DeleteModel(
            name='Reply',
        ),
    ]
