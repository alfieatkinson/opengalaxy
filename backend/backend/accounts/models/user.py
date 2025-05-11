# backend/backend/accounts/models/user.py

import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    id = models.UUIDField(
        "user id",
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    email = models.EmailField(
        "email address",
        unique=True,
        error_messages={
            "unique": "A user with that email already exists.",
        },
    )
    created_at = models.DateTimeField(
        "created at",
        auto_now_add=True,  # ← use auto_now_add here
        editable=False,
    )
    updated_at = models.DateTimeField(
        "updated at",
        auto_now=True,  # ← auto_now is sufficient
    )

    REQUIRED_FIELDS = ["email", "first_name", "last_name"]
    USERNAME_FIELD = "username"

    def __str__(self):
        return self.username

    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    class Meta:
        db_table = "user"
        verbose_name = "user"
        verbose_name_plural = "users"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["email"], name="user_email_idx"),
            models.Index(fields=["username"], name="user_username_idx"),
        ]
