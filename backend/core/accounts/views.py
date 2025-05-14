# backend/core/accounts/views.py

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.contrib.auth import get_user_model

from .models import UserPreferences
from .serializer import UserSerializer, UserPreferencesSerializer
from .permissions import PublicOrOwnerPermission, IsOwnerOrAdmin

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
class UserDetailByUsernameView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"
    lookup_url_kwarg = "username"
    authentication_classes = [
        JWTAuthentication,
        SessionAuthentication,
        BasicAuthentication,
    ]
    permission_classes = [PublicOrOwnerPermission]
    
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
