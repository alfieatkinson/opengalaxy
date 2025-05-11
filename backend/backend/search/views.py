# backend/backend/search/views.py

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
        
        if (not query):
            return JsonResponse({"results": []}, status=400)
        
        # Each has a results key
        combined = []
        
        # Iterate over the results of both endpoints and merge
        for endpoint, mtype in (('images', 'image'), ('audio', 'audio')):
            resp = self.client.query(endpoint, params={'q': query, 'per_page': 20})
            for item in resp.get('results', []):
                # Build a flat dict for each item
                data = {
                    'openverse_id':      item['id'],
                    'title':             item.get('title'),
                    'indexed_on':        item.get('date_created') or timezone.now().isoformat(),
                    'foreign_landing_url': item.get('foreign_landing_url'),
                    'url':               item.get('url'),
                    'creator':           item.get('creator'),
                    'creator_url':       item.get('creator_url'),
                    'license':           item.get('license'),
                    'license_version':   item.get('license_version'),
                    'license_url':       item.get('license_url'),
                    'attribution':       item.get('attribution'),
                    'category':          item.get('category'),
                    'file_size':         item.get('file_size'),
                    'file_type':         item.get('file_type'),
                    'mature':            item.get('is_mature'),
                    'thumbnail_url':     item.get('thumbnail'),
                    'height':            item.get('height'),
                    'width':             item.get('width'),
                    'duration':          item.get('duration'),
                    'media_type':        mtype,
                }
                combined.append(data)

                # Upsert into the database
                Media.objects.update_or_create(
                    openverse_id = data['openverse_id'],
                    defaults = data
                )
        
        # TODO: add filtering and sorting
        
        return JsonResponse({"results": combined})