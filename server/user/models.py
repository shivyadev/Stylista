from django.db import models
import uuid

# Create your models here.
class ClothInput(models.Model):
    unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user_id = models.IntegerField(default=0)
    usage = models.CharField(max_length=50)
    gender = models.CharField(max_length=50)
    type = models.CharField(max_length=50, default="SHIRTS")
    color = models.CharField(max_length=50)
    imageURL = models.CharField(max_length=500)
    outfits = models.JSONField(default=list)

class SavedOutfit(models.Model):
    upload_id = models.CharField(max_length=255)  # Reference to the original upload
    user_id = models.IntegerField(default=0)
    client_outfit_id = models.CharField(max_length=255)  # Client-side ID for reference
    upload_data = models.JSONField()  # Stores user upload info
    outfit_data = models.JSONField()  # Stores complete outfit data
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('upload_id', 'client_outfit_id')  # Prevent duplicate saves
