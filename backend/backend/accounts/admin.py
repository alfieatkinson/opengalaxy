# backend/backend/accounts/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
import models


@admin.register(models.User)
class UserAdmin(BaseUserAdmin):
    model = models.User
    list_display = ("username", "email", "first_name", "last_name", "is_staff", "created_at")
    list_filter = ("is_staff", "is_active")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("-created_at",)
