# backend/backend/media/models/favourite.py

from django.db import models
from django.conf import settings


class Favourite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    media = models.ForeignKey("media.Media", on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "favourites"
        verbose_name = "favourite"
        verbose_name_plural = "favourites"
        ordering = ["-added_at"]
        constraints = [models.UniqueConstraint(fields=["user", "media"], name="unique_favourite")]
