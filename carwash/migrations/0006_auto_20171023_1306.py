# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-10-23 13:06
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('carwash', '0005_auto_20171013_1921'),
    ]

    operations = [
        migrations.AlterField(
            model_name='clientprofile',
            name='user',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL),
        ),
    ]
