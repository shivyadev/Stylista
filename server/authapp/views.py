from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken, TokenError


@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({"detail": "Username, email, and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    # Check if the username or email already exists
    if User.objects.filter(username=username).exists():
        return Response({"detail": "Username already taken."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"detail": "Email already taken."}, status=status.HTTP_400_BAD_REQUEST)

    # Create a new user
    user = User.objects.create_user(username=username, email=email, password=password)
    return Response({"detail": "User registered successfully."}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None:
        # Create JWT token
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({"access": str(access_token), "refresh": str(refresh)}, status=status.HTTP_200_OK)
    else:
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        if "refresh" not in request.data:
            return Response({"error": "Refresh token required"}, status=status.HTTP_400_BAD_REQUEST)
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Successfully logged out"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def refresh(request):
    refresh_token = request.data.get('refresh')

    if not refresh_token:
        return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        token = RefreshToken(refresh_token)
        access_token = str(token.access_token)
        return Response({"access": access_token}, status=status.HTTP_200_OK)

    except TokenError as e:
        return Response({"error": "Invalid or expired refresh token."}, status=status.HTTP_401_UNAUTHORIZED)