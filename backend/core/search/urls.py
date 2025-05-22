# backend/core/search/urls.py

from django.urls import path
from .views import (
    SearchView,
    SearchHistoryPreviewView,
    SearchHistoryListView,
    SearchHistoryDeleteView,
    SearchHistoryClearView
)

urlpatterns = [
    path("", SearchView.as_view(), name="search"),
    path("/history/preview/", SearchHistoryPreviewView.as_view(), name="/history-preview"),
    path("/history/",         SearchHistoryListView.as_view(),    name="/history-list"),
    path("/history/<int:pk>/",SearchHistoryDeleteView.as_view(),  name="/history-delete"),
    path("/history/clear/",   SearchHistoryClearView.as_view(),   name="/history-clear"),
]
