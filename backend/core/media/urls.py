# backend/core/media/urls.py

from django.urls import path
from .views import MediaDetailView, MediaFavouriteView, TagListView, SourceListView, CreatorListView

urlpatterns = [
    path("<str:openverse_id>/", MediaDetailView.as_view(), name="media_detail"),
    path("<str:openverse_id>/favourite/", MediaFavouriteView.as_view(), name="media_favourite"),
    path("filters/tags/", TagListView.as_view(), name="tag_list"),
    path("filters/sources/", SourceListView.as_view(), name="source_list"),
    path("filters/creators/", CreatorListView.as_view(), name="creator_list"),
]
