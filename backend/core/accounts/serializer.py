# backend/core/accounts/serializer.py

from rest_framework import serializers
from .models import User, UserPreferences

class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreferences
        fields = ('public_profile', 'show_sensitive', 'blur_sensitive')

class UserSerializer(serializers.ModelSerializer):
    preferences = UserPreferencesSerializer(source="userpreferences", read_only=True)
    
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
            "preferences",
        )
        read_only_fields = ("id", "created_at")

    def get_preferences(self, user):
        prefs, _ = UserPreferences.objects.get_or_create(user=user)
        return UserPreferencesSerializer(prefs).data
