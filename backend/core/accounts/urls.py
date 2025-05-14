# backend/core/accounts/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenObtainPairView

from .views import (
    UserDetailView,
    RegisterView,
    LogoutView,
    UserDetailByUsernameView,
    UserPreferencesView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("users/me/", UserDetailView.as_view(), name="user_detail"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("users/<str:username>/", UserDetailByUsernameView.as_view(), name="user_detail_by_username"),
    path("users/<str:username>/preferences/", UserPreferencesView.as_view(), name="user_preferences"),
    #path("users/<str:username>/favourites/", )
]
