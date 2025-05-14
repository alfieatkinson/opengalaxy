# backend/core/media/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
from django.views import View

from core.media.models import Media, Favourite
from core.openverse_client import OpenverseClient


class MediaDetailView(View):
    client = OpenverseClient()

    def get(self, request, openverse_id):
        # Fetch the media object from the database (or 404 if not found)
        media = get_object_or_404(Media, openverse_id=openverse_id)

        # Re-query if the media was last accessed more than 7 days ago
        if (timezone.now() - media.accessed_at).days > 7:
            endpoint = "images" if media.media_type == "image" else "audio"
            fresh = self.client.query(f"{endpoint}/{openverse_id}")

            # Update the media object with fresh data
            updated = {
                "title": fresh.get("title", media.title),
                "indexed_on": fresh.get("date_created") or media.indexed_on,
                "foreign_landing_url": fresh.get("foreign_landing_url", media.foreign_landing_url),
                "url": fresh.get("url", media.url),
                "creator": fresh.get("creator", media.creator),
                "creator_url": fresh.get("creator_url", media.creator_url),
                "license": fresh.get("license", media.license),
                "license_version": fresh.get("license_version", media.license_version),
                "license_url": fresh.get("license_url", media.license_url),
                "attribution": fresh.get("attribution", media.attribution),
                "category": fresh.get("category", media.category),
                "file_size": fresh.get("file_size", media.file_size),
                "file_type": fresh.get("file_type", media.file_type),
                "mature": fresh.get("is_mature", media.mature),
                "thumbnail_url": fresh.get("thumbnail", media.thumbnail_url),
                "height": fresh.get("height", media.height),
                "width": fresh.get("width", media.width),
                "duration": fresh.get("duration", media.duration),
            }

            # Update the media object with the new values
            for field, val in updated.items():
                setattr(media, field, val)

        media.accessed_at = timezone.now()  # Explicit bump
        media.save()  # Save the updated media object

        # Return the media details as a JSON response
        return JsonResponse(
            {
                "openverse_id": media.openverse_id,
                "title": media.title,
                "indexed_on": media.indexed_on.isoformat(),
                "foreign_landing_url": media.foreign_landing_url,
                "url": media.url,
                "creator": media.creator,
                "creator_url": media.creator_url,
                "license": media.license,
                "license_version": media.license_version,
                "license_url": media.license_url,
                "attribution": media.attribution,
                "category": media.category,
                "file_size": media.file_size,
                "file_type": media.file_type,
                "mature": media.mature,
                "thumbnail_url": media.thumbnail_url,
                "height": media.height,
                "width": media.width,
                "duration": media.duration,
                "media_type": media.media_type,
                "accessed_at": media.accessed_at.isoformat(),
            }
        )

class MediaFavouriteView(APIView):
    """
    :GET /api/media/<openverse_id>/favourite/ → { is_favourite: bool }
    :POST /api/media/<openverse_id>/favourite/ → add, returns { is_favourite: True }
    :DELETE /api/media/<openverse_id>/favourite/ → remove, returns { is_favourite: False }
    """
    
    def get(self, request, openverse_id):
        # Anonymous > always false
        if not request.user or not request.user.is_authenticated:
            return Response({"is_favourite": False}, status=status.HTTP_200_OK)
        
        media = get_object_or_404(Media, openverse_id=openverse_id)
        exists = Favourite.objects.filter(user=request.user, media=media).exists()
        return Response({"is_favourite": exists}, status=status.HTTP_200_OK)
    
    def post(self, request, openverse_id):
        if not request.user or not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        
        media = get_object_or_404(Media, openverse_id=openverse_id)
        Favourite.objects.get_or_create(user=request.user, media=media)
        
        # Update favourite count
        media.favourites_count = Favourite.objects.filter(media=media).count()
        media.save(update_fields=['favourites_count'])
        
        return Response({"is_favourite": True}, status=status.HTTP_201_CREATED)
        
    def delete(self, request, openverse_id):
        if not request.user or not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
        
        media = get_object_or_404(Media, openverse_id=openverse_id)
        Favourite.objects.filter(user=request.user, media=media).delete()
        
        # Update favourite count
        media.favourites_count = Favourite.objects.filter(media=media).count()
        media.save(update_fields=['favourites_count'])
        
        return Response({"is_favourite": False}, status=status.HTTP_200_OK)