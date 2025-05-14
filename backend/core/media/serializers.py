# backend/core/media/serializers.py

from rest_framework import serializers
from core.media.models import Media, Favourite

class MediaSerializer(serializers.ModelSerializer):
    # Annotated field for the number of favourites
    favourites_count = serializers.IntegerField(source='favourites_count', read_only=True)
    
    class Meta:
        model = Media
        fields = (
            "openverse_id",
            "title",
            "indexed_on",
            "foreign_landing_url",
            "url",
            "creator",
            "creator_url",
            "license",
            "license_version",
            "license_url",
            "attribution",
            "category",
            "file_size",
            "file_type",
            "mature",
            "thumbnail_url",
            "height",
            "width",
            "duration",
            "media_type",
            "accessed_at",
            "favourites_count",
        )
        
class FavouriteSerializer(serializers.ModelSerializer):
    media = MediaSerializer()
    
    class Meta:
        model = Favourite
        fields = ("media", "added_at")
