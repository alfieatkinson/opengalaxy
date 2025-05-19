# backend/core/search/views.py

import logging
from math import ceil
from django.http import JsonResponse
from django.utils import timezone
from django.views import View
from django.shortcuts import get_object_or_404

from core.openverse_client import OpenverseClient
from core.media.models.media import Media
from core.media.models.tag import Tag, MediaTag

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
        page_size = max(int(request.GET.get("page_size", 18)), 1)
        mature = request.GET.get("mature", "false").lower() == "true"
        sort_by = request.GET.get("sort_by", "indexed_on").lower()
        sort_dir = request.GET.get("sort_dir", "desc").lower()
        collection = request.GET.get("collection", "").lower()
        tag = request.GET.get("tag", "").lower()
        source = request.GET.get("source", "").lower()
        creator = request.GET.get("creator", "").lower()

        if not query:
            logger.warning("Search query is empty, returning 400 response.")
            return JsonResponse({"results": []}, status=400)

        logger.info(f"Received search query: {query}, page: {page}, page_size: {page_size}")

        # Fetch results from both endpoints
        params = {
            "q": query,
            "page": page,
            "per_page": page_size // 2,
            "unstable__include_sensitive_results": mature,
            "unstable__sort_by": sort_by,
            "unstable__sort_dir": sort_dir,
        }
        
        # Handle collection, tag, source, and creator filters
        if collection == "tag" and tag:
            params["unstable__collection"] = "tag"
            params["unstable__tag"] = tag
        elif collection == "source" and source:
            params["unstable__collection"] = "source"
            params["source"] = source
        elif collection == "creator" and creator:
            params["unstable__collection"] = "creator"
            params["creator"] = creator
            if source:
                params["source"] = source
        
        # Query both images and audio
        try:
            img_resp = self.client.query("images", params={**params})
            aud_resp = self.client.query("audio", params={**params})
        except Exception as e:
            logger.error(f"Error while querying Openverse: {e}")
            return JsonResponse({"error": "Error fetching data from Openverse."}, status=500)

        # Log response data for debugging
        #logger.debug(f"Image response: {img_resp}")
        #logger.debug(f"Audio response: {aud_resp}")
        for kind, resp in (("img", img_resp), ("aud", aud_resp)):
            results = resp.get("results", [])
            logger.debug(f"{kind}_resp returned {len(results)} results")
            if results:
                logger.debug("%s_resp keys: %s", kind, list(results[0].keys()))

        # Sum the totals
        img_total = img_resp.get("result_count", len(img_resp.get("results", [])))
        aud_total = aud_resp.get("result_count", len(aud_resp.get("results", [])))
        total_count = img_total + aud_total
        total_pages = ceil(total_count / page_size)

        # Log total count and pages
        logger.info(f"Total results: {total_count}, Total pages: {total_pages}")

        # Process image and audio items and add media_type and mature flags
        img_items = []
        for item in img_resp.get("results", []):
            item["media_type"] = "image"
            is_sensitive = bool(item.get("mature")) or bool(item.get("unstable__sensitivity"))
            item["mature"] = is_sensitive
            img_items.append(item)

        aud_items = []
        for item in aud_resp.get("results", []):
            item["media_type"] = "audio"
            is_sensitive = bool(item.get("mature")) or bool(item.get("unstable__sensitivity"))
            item["mature"] = is_sensitive
            aud_items.append(item)
            
        # Merge the two lists respecting the sort order
        if sort_by == "relevance":
            # Interleave
            merged = []
            # zip_longest from itertools handles uneven lists
            from itertools import zip_longest
            for img, aud in zip_longest(img_items, aud_items, fillvalue=None):
                if img: merged.append(img)
                if aud: merged.append(aud)
        else:
            # Timestamp or other global sort
            merged = sorted(
                img_items + aud_items,
                key=lambda i: i.get(sort_by) or "indexed_on",
                reverse=(sort_dir == "desc")
            )

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
                "indexed_on": item.get("indexed_on") or timezone.now().isoformat(),
                "foreign_landing_url": item.get("foreign_landing_url"),
                "url": item.get("url"),
                "creator": item.get("creator"),
                "creator_url": item.get("creator_url"),
                "license": item.get("license"),
                "license_version": item.get("license_version"),
                "license_url": item.get("license_url"),
                "attribution": item.get("attribution"),
                "source": item.get("source"),
                "category": item.get("category"),
                "file_size": item.get("filesize"),
                "file_type": item.get("filetype"),
                "mature": item["mature"],
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
            
            # Get the media object to associate tags
            media = get_object_or_404(Media, openverse_id=data["openverse_id"])
            
            # Upsert tags for the media item
            for tag_name in item.get("tags", []):
                tag_obj, _ = Tag.objects.get_or_create(name=tag_name)
                MediaTag.objects.get_or_create(media_id=media.id, tag=tag_obj)

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
