from django.db import models

# Create your models here.

class Items(models.Model):
    cloth_id = models.IntegerField(default=0)
    gender = models.CharField(max_length=10)
    season = models.CharField(max_length=50)
    color = models.CharField(max_length=50)
    type = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    url = models.CharField(max_length=200)


