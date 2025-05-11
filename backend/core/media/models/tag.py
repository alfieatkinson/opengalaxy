# backend/core/media/models/tag.py

from django.db import models
from django.conf import settings


class Tag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "tags"
        verbose_name = "tag"
        verbose_name_plural = "tags"


class MediaTag(models.Model):
    media = models.ForeignKey("media.Media", on_delete=models.CASCADE)
    tag = models.ForeignKey("media.Tag", on_delete=models.CASCADE)

    class Meta:
        db_table = "media_tags"
        verbose_name = "media tag"
        verbose_name_plural = "media tags"
        constraints = [models.UniqueConstraint(fields=["media", "tag"], name="unique_media_tag")]
