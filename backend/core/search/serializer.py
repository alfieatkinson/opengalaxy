# backend/core/search/serializer.py

from rest_framework import serializers
from models import SearchHistory

class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = ["id", "query", "searched_at"]
        read_only_fields = ["id", "searched_at"]
