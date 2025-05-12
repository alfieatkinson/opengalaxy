# backend/core/search/views.py

import logging
from math import ceil
from django.http import JsonResponse
from django.utils import timezone
from django.views import View

from core.openverse_client import OpenverseClient
from core.media.models.media import Media

logger = logging.getLogger(__name__)


class SearchView(View):
    """
    GET /api/search/?q=foo
    Hits both images and audio endpoints, merges and returns a flat list.
    """

    client = OpenverseClient()

    def get(self, request):
        query = request.GET.get("q", "").strip()
        page = max(int(request.GET.get("page", 1)), 1)
        page_size = max(int(request.GET.get("page_size", 20)), 1)

        if not query:
            logger.warning("Search query is empty, returning 400 response.")
            return JsonResponse({"results": []}, status=400)

        logger.info(f"Received search query: {query}, page: {page}, page_size: {page_size}")

        # Fetch results from both endpoints
        params = {"q": query, "per_page": page_size * 2}
        try:
            img_resp = self.client.query("images", params={**params, "page": page})
            aud_resp = self.client.query("audio", params={**params, "page": page})
        except Exception as e:
            logger.error(f"Error while querying Openverse: {e}")
            return JsonResponse({"error": "Error fetching data from Openverse."}, status=500)

        # Log response data for debugging
        logger.debug(f"Image response: {img_resp}")
        logger.debug(f"Audio response: {aud_resp}")

        # Sum the totals
        img_total = img_resp.get("result_count", len(img_resp.get("results", [])))
        aud_total = aud_resp.get("result_count", len(aud_resp.get("results", [])))
        total_count = img_total + aud_total
        total_pages = ceil(total_count / (page_size * 2))

        # Log total count and pages
        logger.info(f"Total results: {total_count}, Total pages: {total_pages}")

        # Merge and tag the results
        merged = []
        for item in img_resp.get("results", []):
            item["media_type"] = "image"
            merged.append(item)
        for item in aud_resp.get("results", []):
            item["media_type"] = "audio"
            merged.append(item)

        # Slice for this page
        start = (page - 1) * page_size
        end = start + page_size
        page_items = merged[start:end]

        # Log the number of items being returned for this page
        logger.info(f"Returning {len(page_items)} items for page {page}.")

        # Upset and build the flat dict
        results = []
        for item in page_items:
            data = {
                "openverse_id": item["id"],
                "title": item.get("title"),
                "indexed_on": item.get("date_created") or timezone.now().isoformat(),
                "foreign_landing_url": item.get("foreign_landing_url"),
                "url": item.get("url"),
                "creator": item.get("creator"),
                "creator_url": item.get("creator_url"),
                "license": item.get("license"),
                "license_version": item.get("license_version"),
                "license_url": item.get("license_url"),
                "attribution": item.get("attribution"),
                "category": item.get("category"),
                "file_size": item.get("file_size"),
                "file_type": item.get("file_type"),
                "mature": item.get("is_mature", False),
                "thumbnail_url": item.get("thumbnail"),
                "height": item.get("height"),
                "width": item.get("width"),
                "duration": item.get("duration"),
                "media_type": item["media_type"],
            }
            # Log upsert action
            logger.debug(f"Upserting media item: {data['openverse_id']}")

            # Upsert so you can revisit later
            Media.objects.update_or_create(openverse_id=data["openverse_id"], defaults=data)
            results.append(data)

        logger.info(f"Search complete for query '{query}' with {len(results)} results.")

        return JsonResponse(
            {
                "results": results,
                "page": page,
                "page_size": page_size,
                "total_count": total_count,
                "total_pages": total_pages,
            }
        )
