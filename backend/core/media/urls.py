# backend/core/media/urls.py

from django.urls import path
from .views import MediaDetailView

urlpatterns = [
    path("<str:openverse_id>/", MediaDetailView.as_view(), name="media_detail"),
]
