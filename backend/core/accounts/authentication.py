# backend/core/accounts/authentication.py

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed

class JWTAuthenticationFromCookie(JWTAuthentication):
    """
    Look first in Authorization header, then in accessToken cookie.
    """
    def authenticate(self, request):
        # Try header as normal
        header_auth = super().authenticate(request)
        if header_auth is not None:
            return header_auth

        # Fallback to cookie
        raw_token = request.COOKIES.get('accessToken')
        if not raw_token:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            user = self.get_user(validated_token)
        except InvalidToken as e:
            raise AuthenticationFailed('Invalid access token') from e

        return (user, validated_token)
