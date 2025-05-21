# backend/core/search/views.py

import logging
from math import ceil
from django.http import JsonResponse
from django.utils import timezone
from django.views import View
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication

from core.openverse_client import OpenverseClient
from core.media.models.media import Media
from core.media.models.tag import Tag, MediaTag
from .models import SearchHistory
from .serializer import SearchHistorySerializer

logger = logging.getLogger(__name__)

TAG_ACCURACY_THRESHOLD = 0.5

class SearchView(APIView):
    """
    GET /api/search/?q=foo
    Hits both images and audio endpoints, merges and returns a flat list.
    """
    
    authentication_classes = [
        JWTAuthentication,
        SessionAuthentication,
        BasicAuthentication,
    ]
    
    permission_classes = [AllowAny]

    client = OpenverseClient()

    def get(self, request):
        # Get the search key and value from the request
        SEARCH_KEYS = ["q", "title", "tag", "creator"]
        search_key = next((k for k in SEARCH_KEYS if k in request.GET), "q")
        search_value = request.GET.get(search_key, "").strip()
        
        page = max(int(request.GET.get("page", 1)), 1)
        page_size = max(int(request.GET.get("page_size", 18)), 1)
        
        # Get media_type and mature flags
        media_type = request.GET.get("media_type", "image").lower()
        mature = request.GET.get("mature", "false").lower() == "true"
        
        # Get sort parameters
        sort_by = request.GET.get("sort_by", "relevance").lower()
        sort_dir = request.GET.get("sort_dir", "desc").lower()
        
        # Get filter parameters, split list by comma
        source_list = [
            s.strip() for s in request.GET.get("source", "").split(",")
            if s.strip()
        ]
        license_list = [
            l.strip() for l in request.GET.get("license", "").split(",")
            if l.strip()
        ]
        extension_list = [
            e.strip() for e in request.GET.get("extension", "").split(",")
            if e.strip()
        ]

        if not search_value:
            logger.warning("Search value is empty, returning 400 response.")
            return JsonResponse({"results": []}, status=400)

        logger.info(f"Received search: {search_key}='{search_value}', page: {page}, page_size: {page_size}")
        
        # Save to search history
        if request.user.is_authenticated:
            SearchHistory.objects.create(user=request.user, search_key=search_key, search_value=search_value)
            logger.info(f"Saved search history for user {request.user.id}: {search_value}")
        else:
            logger.info("Anonymous user, not saving search history.")

        # Fetch results from both endpoints
        params = {
            search_key: search_value,
            "page": page,
            "per_page": page_size,
            "unstable__include_sensitive_results": mature,
            "unstable__sort_by": sort_by,
            "unstable__sort_dir": sort_dir,
        }
        
        # Add optional parameters if provided
        if source_list:
            params["source"] = ",".join(source_list)
        if license_list:
            params["license"] = ",".join(license_list)
        if extension_list:
            params["extension"] = ",".join(extension_list)
        
        # Log the parameters being sent to Openverse
        logger.debug(f"Parameters: {params}")
        
        # Only hit the endpoint the user wants
        try:
            if media_type == "image":
                img_resp = self.client.query("images", params={**params})
                aud_resp = {"results": [], "result_count": 0}
            elif media_type == "audio":
                img_resp = {"results": [], "result_count": 0}
                aud_resp = self.client.query("audio", params={**params})
            else:
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
            for tag_dict in item.get("tags", []):
                name = tag_dict.get("name")
                accuracy = tag_dict.get("accuracy")
                # Only keep tags with a defined accuracy >= threshold
                if name and isinstance(accuracy, (int, float)) and accuracy >= TAG_ACCURACY_THRESHOLD:
                    tag_obj, _ = Tag.objects.get_or_create(name=name)
                    MediaTag.objects.get_or_create(media=media, tag=tag_obj, defaults={"accuracy": accuracy})

        logger.info(f"Search complete for {search_key}'{search_value}' with {len(results)} results.")

        return Response(
            {
                "results": results,
                "page": page,
                "page_size": page_size,
                "total_count": total_count,
                "total_pages": total_pages,
            }
        )

class SearchHistoryPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 100

class SearchHistoryPreviewView(generics.ListAPIView):
    """
    GET /api/search/history/preview/
    Returns the last 5 searches for the authenticated user.
    """
    serializer_class = SearchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SearchHistory.objects.filter(user=self.request.user)[:5]

class SearchHistoryListView(generics.ListAPIView):
    """
    GET /api/search/history/?page=1&page_size=24
    Paginated list of all searches for the authenticated user.
    """
    serializer_class = SearchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = SearchHistoryPagination

    def get_queryset(self):
        return (
            SearchHistory.objects
            .filter(user=self.request.user)
            .order_by('-searched_at')
        )

class SearchHistoryDeleteView(generics.DestroyAPIView):
    """
    DELETE /api/search/history/<pk>/
    Delete a single history entry.
    """
    serializer_class = SearchHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SearchHistory.objects.filter(user=self.request.user)

class SearchHistoryClearView(APIView):
    """
    DELETE /api/search/history/clear/
    Remove all history for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        SearchHistory.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)