# backend/core/media/views.py

from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.utils import timezone
from django.views import View

from core.media.models.media import Media
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
