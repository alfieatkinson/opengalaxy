# backend/backend/openverse_client.py

import requests
from django.conf import settings
from django.core.cache import cache

class OpenverseClient:
    """
    A client for interfacing with the Openverse API using OAuth2 client credentials and Redis-backed token caching.
    """
    TOKEN_CACHE_KEY = "openverse_access_token"
    TOKEN_TTL_BUFFER = 60  # seconds before actual expiration to refresh the token
    
    def __init__(self, api_url=None, client_id=None, client_secret=None):
        self.api_url = api_url or settings.OPENVERSE_API_URL
        self.client_id = client_id or settings.OPENVERSE_CLIENT_ID
        self.client_secret = client_secret or settings.OPENVERSE_CLIENT_SECRET
        
    def _fetch_token(self):
        """Fetch a fresh token from the Openverse token endpoint."""
        resp = requests.post(
            f"{self.api_url}auth_tokens/token/",
            data={
                "grant_type": "client_credentials",
                "client_id": self.client_id,
                "client_secret": self.client_secret,
            },
            headers={
                "Content-Type": "application/x-www-form-urlencoded",
            },
        )
        
        if (resp.status_code != 200):
            raise RuntimeError(
                f"Failed to fetch token: {resp.status_code} - {resp.text}"
            )
        
        data = resp.json()
        token = data["access_token"]
        expires_in = data.get("expires_in", 0)
        
        # Cache with TTL slightly shorter than the actual expiration time
        cache.set(self.TOKEN_CACHE_KEY, token, timeout=(expires_in - self.TOKEN_TTL_BUFFER))
        
        return token
    
    def get_token(self):
        """Retrieve token from cache or fetch a new one if expired/missing."""
        token = cache.get(self.TOKEN_CACHE_KEY)
        
        if not token:
            token = self._fetch_token()
        
        return token
    
    def query(self, endpoint, params=None, method="GET", data=None, **kwargs):
        """
        Generic method to query any Openverse API endpoint.

        :param endpoint: path relative to api_url, e.g. 'images' or 'audio'
        :param params: dict of querystring parameters
        :param method: 'get' or 'post'
        :param data: dict for POST payload
        :return: JSON response
        """
        
        token = self.get_token()
        url = f"{self.api_url}{endpoint.lstrip("/")}/"
        headers = {"Authorization": f"Bearer {token}"}
        func = getattr(requests, method.lower())
        resp = func(url, headers=headers, params=params, json=data, **kwargs)
        
        if (resp.status_code != 200):
            raise RuntimeError(
                f"Failed to query {url}: {resp.status_code} - {resp.text}"
            )
            
        return resp.json()