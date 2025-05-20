# backend/core/accounts/urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.views import TokenObtainPairView

from .views import (
    RegisterView,
    LogoutView,
    UserDetailView,
    UserDetailUpdateDeleteView,
    ChangePasswordView,
    UserPreferencesView,
    UserFavouritesView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/me/', UserDetailView.as_view(), name='user_detail_me'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('users/<str:username>/', UserDetailUpdateDeleteView.as_view(), name='user_detail_update_delete'),
    path('users/<str:username>/password/', ChangePasswordView.as_view(), name='change_password'),
    path('users/<str:username>/preferences/', UserPreferencesView.as_view(), name='user_preferences'),
    path('users/<str:username>/favourites/', UserFavouritesView.as_view(), name='user_favourites'),
]
