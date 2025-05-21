# backend/core/search/models/search_history.py

from django.db import models
from django.conf import settings


class SearchHistory(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    search_key = models.CharField(max_length=10, default="q")
    search_value = models.CharField(max_length=255)
    searched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "search_history"
        verbose_name = "search history"
        verbose_name_plural = "search histories"
        ordering = ["-searched_at"]
