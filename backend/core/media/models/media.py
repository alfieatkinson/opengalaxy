# backend/core/media/models/media.py

from django.db import models


class Media(models.Model):
    openverse_id = models.CharField(max_length=255, unique=True)
    title = models.CharField(max_length=255)
    indexed_on = models.DateTimeField()
    foreign_landing_url = models.URLField()
    url = models.URLField()
    creator = models.CharField(max_length=255, null=True)
    creator_url = models.URLField(null=True)
    license = models.CharField(max_length=50)
    license_version = models.CharField(max_length=25, null=True)
    license_url = models.URLField()
    attribution = models.CharField(max_length=1000)
    category = models.CharField(max_length=80, null=True)
    file_size = models.IntegerField(null=True)
    file_type = models.CharField(max_length=80, null=True)
    mature = models.BooleanField()
    thumbnail_url = models.URLField(null=True)
    height = models.IntegerField(null=True)
    width = models.IntegerField(null=True)
    duration = models.IntegerField(null=True)
    media_type = models.CharField(
        max_length=10,
        choices=[
            ("image", "Image"),
            ("audio", "Audio"),
        ],
    )
    accessed_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "media"
        verbose_name = "media"
        verbose_name_plural = "media"
        ordering = ["-indexed_on"]
        indexes = [
            models.Index(fields=["title"], name="media_title_idx"),
        ]
