# backend/backend/analytics/models/api_request.py

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.contrib.postgres.fields import JSONField


class APIRequest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    request_method = models.CharField(max_length=10)
    request_url = models.URLField()
    response_status = models.PositiveIntegerField()
    requested_at = models.DateTimeField(auto_now_add=True)
    responded_at = models.DateTimeField()

    class Meta:
        db_table = "api_requests"
        verbose_name = "API Request"
        verbose_name_plural = "API Requests"
        ordering = ["-requested_at"]
        indexes = [
            models.Index(fields=["user", "requested_at"]),
        ]
