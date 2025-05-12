# backend/core/accounts/views.py

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializer import UserSerializer


# /api/auth/token/ and /api/auth/token/refresh/
class CustomTokenObtainPairView(TokenObtainPairView):
    # Can be used to add custom claims to the token
    pass


# /api/auth/users/me/
class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# /api/auth/logout/
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
