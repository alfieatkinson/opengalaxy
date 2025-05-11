# backend/backend/accounts/models/preferences.py

from django.db import models
from django.conf import settings


class UserPreferences(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    public_profile = models.BooleanField(default=True)
    show_sensitive = models.BooleanField(default=False)
    blur_sensitive = models.BooleanField(default=True)

    class Meta:
        db_table = "user_preferences"
        verbose_name = "User Preference"
        verbose_name_plural = "User Preferences"
