# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-07-31 19:16
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('carwash', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='businessprofile',
            name='name',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='clientprofile',
            name='name',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='businessprofile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='bis_profile', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='clientprofile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL),
        ),
    ]
