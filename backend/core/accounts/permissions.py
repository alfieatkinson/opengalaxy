# backend/core/accounts/permissions.py

from rest_framework.permissions import SAFE_METHODS, BasePermission

from .models import UserPreferences

class PublicOrOwnerPermission(BasePermission):
    def has_permission(self, request, view):
        # Allow all authenticated users through
        if request.user and request.user.is_authenticated:
            return True
        # Otherwise, let unauthenticated users continue *only for GET-like requests*
        return request.method in SAFE_METHODS

    def has_object_permission(self, request, view, obj):
        # Admins or owner always OK
        if request.user and request.user.is_staff:
            return True
        if obj == request.user:
            return True
        # Otherwise only if they’ve set public_profile
        try:
            prefs = UserPreferences.objects.get(user=obj)
        except UserPreferences.DoesNotExist:
            return False
        return prefs.public_profile