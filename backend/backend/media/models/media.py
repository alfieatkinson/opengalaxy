# backend/backend/media/models/media.py

from django.db import models
from django.conf import settings

class Media(models.Model):
    title = models.CharField(max_length=255)
    indexed_on = models.DateTimeField()
    url = models.URLField(null=True)
    creator = models.CharField(max_length=255, null=True)
    creator_url = models.URLField(null=True)
    license = models.CharField(max_length=50)
    license_version = models.CharField(max_length=25, null=True)
    license_url = models.URLField()
    attribution = models.CharField(max_length=255)
    category = models.CharField(max_length=80, null=True)
    file_size = models.IntegerField(null=True)
    file_type = models.CharField(max_length=80, null=True)
    mature = models.BooleanField()
    thumbnail_url = models.URLField()
    
    class Meta:
        db_table = "media"
        verbose_name = "media"
        verbose_name_plural = "media"
        ordering = ["-indexed_on"]
        indexes = [
            models.Index(fields=["title"], name="media_title_idx"),
        ]