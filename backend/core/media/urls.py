# backend/core/media/urls.py

from django.urls import path
from .views import MediaDetailView, MediaFavouriteView

urlpatterns = [
    path("<str:openverse_id>/", MediaDetailView.as_view(), name="media_detail"),
    path("<str:openverse_id>/favourite/", MediaFavouriteView.as_view(), name="media_favourite"),
]
