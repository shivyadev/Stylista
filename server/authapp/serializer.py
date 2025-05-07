from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response

class AccessTokenOnlySerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        return {'access': data['access']}  # Remove refresh

class AccessTokenOnlyView(TokenObtainPairView):
    serializer_class = AccessTokenOnlySerializer
