# Generated by Django 4.2.13 on 2025-05-22 09:10

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('signals', '0004_rename_log_content_signals_content_signals_project_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='signals',
            name='changed_fields',
        ),
        migrations.RemoveField(
            model_name='signals',
            name='new_values',
        ),
        migrations.RemoveField(
            model_name='signals',
            name='old_values',
        ),
    ]
