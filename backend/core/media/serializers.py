# backend/core/media/serializers.py

from rest_framework import serializers
from core.media.models import Media, Favourite, MediaTag

class MediaSerializer(serializers.ModelSerializer):
    # Annotated field for the number of favourites
    favourites_count = serializers.IntegerField(read_only=True)
    tags = serializers.SerializerMethodField()
    related_media = serializers.SerializerMethodField()
    
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
            "tags",
            "related_media",
        )
        
    def get_tags(self, obj):
        tags = MediaTag.objects.filter(media=obj).select_related('tag')
        return [{"name": tag.tag.name, "accuracy": tag.accuracy} for tag in tags]
    
    def get_related_media(self, media):
        # return a list of minimal info for preview cards
        items = media.related_media.select_related('related_media').all()
        return [
            {
                'openverse_id': related.related_media.openverse_id,
                'title': related.related_media.title,
                'url': related.related_media.url,
                'thumbnail_url': related.related_media.thumbnail_url,
                'mature': related.related_media.mature,
                'media_type': related.related_media.media_type,
                'favourites_count': related.related_media.favourites_count,
            }
            for related in items
        ]
        
class FavouriteSerializer(serializers.ModelSerializer):
    media = MediaSerializer()
    
    class Meta:
        model = Favourite
        fields = ("media", "added_at")
