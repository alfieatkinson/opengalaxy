# backend/core/accounts/views.py

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView
from rest_framework.pagination import PageNumberPagination
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model
from django.db.models import Count
from django.conf import settings

from .models import UserPreferences
from .serializer import UserSerializer, UserPreferencesSerializer
from .permissions import PublicOrOwnerPermission, IsOwnerOrAdmin
from .authentication import JWTAuthenticationFromCookie

from core.media.models import Favourite
from core.media.serializers import FavouriteSerializer

User = get_user_model()

def get_cookie_params():
    if settings.DEBUG:
        return {'httponly': True, 'secure': False, 'samesite': 'Lax', 'path': '/'}
    return {'httponly': True, 'secure': True, 'samesite': 'None', 'path': '/'}

# /api/accounts/token/
class CookieTokenObtainPairView(TokenObtainPairView):
    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        if response.status_code == 200:
            data = response.data
            access = data.pop('access', None)
            refresh = data.pop('refresh', None)
            cookie_params = get_cookie_params()
            if access:
                response.set_cookie('accessToken', access, max_age=60*15, **cookie_params)
            if refresh:
                response.set_cookie('refreshToken', refresh, max_age=60*60*24*7, **cookie_params)
        return response

# /api/accounts/token/refresh/
class CookieTokenRefreshView(TokenRefreshView):
    permission_classes = []  # AllowAny

    def post(self, request, *args, **kwargs):
        # Pull the cookie
        raw_refresh = request.COOKIES.get('refreshToken')
        if not raw_refresh:
            return Response({'detail': 'No refresh token cookie found'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Forge a new request body so the parent sees it
        request._full_data = {'refresh': raw_refresh}

        # Delegate to parent (validate and rotate)
        response = super().post(request, *args, **kwargs)

        # If anything went wrong, bubble it up
        if response.status_code != 200:
            return response

        # Otherwise grab the new tokens…
        data = response.data
        new_access = data.get('access')
        new_refresh = data.get('refresh')

        # And set them as cookies
        cookie_params = get_cookie_params()
        if new_access:
            response.set_cookie('accessToken', new_access,
                                   max_age=60*15, **cookie_params)
        if new_refresh:
            response.set_cookie('refreshToken', new_refresh,
                                   max_age=60*60*24*7, **cookie_params)
        return response
    
# /api/accounts/register/
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        # you’ll need the client to supply `password`
        password = self.request.data.get("password")
        user = serializer.save()
        if password:
            user.set_password(password)
            user.save()
            
        UserPreferences.objects.get_or_create(user=user)

# /api/accounts/users/me/
class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    authentication_classes = [JWTAuthenticationFromCookie]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# /api/accounts/logout/
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        # blacklist the refresh token as before…
        response = Response(status=status.HTTP_205_RESET_CONTENT)
        # clear cookies
        response.delete_cookie('accessToken')
        response.delete_cookie('refreshToken')
        return response

# /api/accounts/users/<username>/
class UserDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/accounts/users/<username>/ => retrieve
    PATCH  /api/accounts/users/<username>/ => update (with password check)
    DELETE /api/accounts/users/<username>/ => delete
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    authentication_classes = [
        JWTAuthenticationFromCookie,
        SessionAuthentication,
        BasicAuthentication,
    ]
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

    def update(self, request, *args, **kwargs):
        # Check ownership/admin
        username = self.kwargs['username']
        if request.user.username != username and not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Ensure password is provided
        current_password = request.data.get('password')
        if not current_password:
            return Response(
                {'detail': 'Current password is required to update details'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Verify it
        if not request.user.check_password(current_password):
            return Response(
                {'detail': 'Incorrect password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Remove password from data so serializer won't try to set it
        data = request.data.copy()
        data.pop('password', None)

        # Perform the normal partial_update (PATCH)
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        username = self.kwargs['username']
        # Owner / admin check
        if request.user.username != username and not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        # Password required
        pwd = request.data.get('password')
        if not pwd:
            return Response(
                {'detail': 'Password is required to delete account'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not request.user.check_password(pwd):
            return Response(
                {'detail': 'Incorrect password'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # perform delete
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    
class UserPreferencesView(generics.RetrieveUpdateAPIView):
    """
    GET  /users/<username>/preferences/  => retrieve prefs
    PATCH /users/<username>/preferences/ => update prefs
    """
    serializer_class = UserPreferencesSerializer
    authentication_classes = [JWTAuthenticationFromCookie, SessionAuthentication, BasicAuthentication]
    permission_classes = [IsOwnerOrAdmin]

    lookup_field = 'username'
    lookup_url_kwarg = 'username'

    def get_queryset(self):
        # we join from User to prefs
        return UserPreferences.objects.select_related('user').all()

    def get_object(self):
        # first get the UserPreferences instance for the user with this username
        username = self.kwargs[self.lookup_url_kwarg]
        try:
            return self.get_queryset().get(user__username=username)
        except UserPreferences.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

class FavouritesPagination(PageNumberPagination):
    page_size = 24
    page_size_query_param = 'page_size'
    max_page_size = 100
    
class UserFavouritesView(generics.ListAPIView):
    """
    GET /api/accounts/users/<username>/favourites/
    """
    serializer_class = FavouriteSerializer
    permission_classes = [PublicOrOwnerPermission]
    pagination_class = FavouritesPagination

    def get_queryset(self):
        username = self.kwargs['username']
        # Only return favourites for that user, newest first
        return (
            Favourite.objects
            .filter(user__username=username)
            .select_related('media')
            # annotate each media with its total favourites count
            .annotate(media__favourites_count=Count('media__favourite'))
            .order_by('-added_at')
        )
    
class ChangePasswordView(APIView):
    """
    POST /api/accounts/users/<username>/password/ => change password
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        # must be owner
        if request.user.username != username and not request.user.is_staff:
            return Response(status=status.HTTP_403_FORBIDDEN)

        old = request.data.get('old_password')
        new = request.data.get('password')
        user = request.user

        if not user.check_password(old):
            return Response({'detail': 'Old password incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new)
        user.save()
        return Response({'detail': 'Password changed'}, status=status.HTTP_200_OK)
