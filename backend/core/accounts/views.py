# backend/core/accounts/views.py

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import get_user_model
from django.db.models import Count

from .models import UserPreferences
from .serializer import UserSerializer, UserPreferencesSerializer
from .permissions import PublicOrOwnerPermission, IsOwnerOrAdmin

from core.media.models import Favourite
from core.media.serializers import FavouriteSerializer

User = get_user_model()

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
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# /api/accounts/logout/
class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            # the client must send {"refresh": "<token>"}
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_205_RESET_CONTENT)

# /api/accounts/users/<username>/
class UserDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET    /api/accounts/users/<username>/        → retrieve
    PATCH  /api/accounts/users/<username>/        → update
    DELETE /api/accounts/users/<username>/        → delete
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsOwnerOrAdmin]  # only owner or admin
    
class UserPreferencesView(generics.RetrieveUpdateAPIView):
    """
    GET  /users/<username>/preferences/  → retrieve prefs
    PATCH /users/<username>/preferences/  → update prefs
    """
    serializer_class = UserPreferencesSerializer
    authentication_classes = [JWTAuthentication, SessionAuthentication, BasicAuthentication]
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
