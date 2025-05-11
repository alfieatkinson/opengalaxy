# backend/core/search/views.py

from django.http import JsonResponse
from django.utils import timezone
from django.views import View

from openverse_client import OpenverseClient
from media.models.media import Media


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
            return JsonResponse({"results": []}, status=400)

        # Fetch results from both endpoints
        params = {"q": query, "per_page": page_size * 2}
        img_resp = self.client.query("images", params={**params, "page": page})
        aud_resp = self.client.query("audio", params={**params, "page": page})

        # Sum the totals
        img_total = img_resp.get("result_count", len(img_resp.get("results", [])))
        aud_total = aud_resp.get("result_count", len(aud_resp.get("results", [])))
        total_count = img_total + aud_total
        total_pages = ceil(total_count / page_size)

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
                "mature": item.get("is_mature"),
                "thumbnail_url": item.get("thumbnail"),
                "height": item.get("height"),
                "width": item.get("width"),
                "duration": item.get("duration"),
                "media_type": item["media_type"],
            }
            # Upsert so you can revisit later
            Media.objects.update_or_create(openverse_id=data["openverse_id"], defaults=data)
            results.append(data)

        return JsonResponse(
            {
                "results": results,
                "page": page,
                "page_size": page_size,
                "total_count": total_count,
                "total_pages": total_pages,
            }
        )
