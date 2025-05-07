from django.urls import path
from .views import get_saved_outfits, save_outfit, unsave_outfit, get_outfit_details, get_user_uploads

urlpatterns = [
    # Existing URLs...
    path('saved-outfits/<str:upload_id>/', get_saved_outfits, name='get_saved_outfits'),
    path('save-outfit/', save_outfit, name='save_outfit'),
    path('unsave-outfit/', unsave_outfit, name='unsave_outfit'),
    path('get-outfit-details/<str:upload_id>/', get_outfit_details, name='get_outfit_details'),
    path('user-uploads/', get_user_uploads, name='get_user_uploads'),
]
