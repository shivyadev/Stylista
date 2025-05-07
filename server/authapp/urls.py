from django.urls import path
from .serializer import AccessTokenOnlyView
from .views import register, login, logout, refresh

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('refresh/', refresh, name='refresh')
]