# Generated by Django 5.1.7 on 2025-05-16 10:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("media", "0005_media_favourites_count"),
    ]

    operations = [
        migrations.AlterField(
            model_name="media",
            name="attribution",
            field=models.CharField(max_length=1000, null=True),
        ),
    ]
