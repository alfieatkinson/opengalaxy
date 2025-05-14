# backend/core/accounts/serializer.py

from rest_framework import serializers
from .models import User, UserPreferences


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "created_at",
            "updated_at",
            "is_active",
            "is_staff",
        )
        read_only_fields = ("id", "created_at")

class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = ('public_profile', 'show_sensitive', 'blur_sensitive')
