# Generated by Django 5.1.7 on 2025-05-14 13:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("media", "0004_alter_media_attribution"),
    ]

    operations = [
        migrations.AddField(
            model_name="media",
            name="favourites_count",
            field=models.PositiveIntegerField(default=0),
        ),
    ]
