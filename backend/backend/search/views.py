# backend/backend/search/views.py

from django.http import JsonResponse
from django.views import View
from openverse_client import OpenverseClient

class SearchView(View):
    """
    GET /api/search/?q=foo
    Hits both images and audio endpoints, merges and returns a flat list.
    """
    client = OpenverseClient()
    
    def get(self, request):
        query = request.GET.get("q", "").strip()
        
        if (not query):
            return JsonResponse({"results": []}, status=400)
        
        # Fetch from both endpoints
        images = self.client.query("images", params={"q": query, "per_page": 18})
        audio = self.client.query("audio", params={"q": query, "per_page": 18})
        
        # Each has a results key
        combined = []
        
        for result in images.get("results", []):
            result["media_type"] = "image"
            combined.append(result)
            
        for result in audio.get("results", []):
            result["media_type"] = "audio"
            combined.append(result)
        
        # TODO: add filtering and sorting
        
        return JsonResponse({"results": combined})