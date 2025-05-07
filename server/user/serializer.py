from rest_framework import serializers
from .models import ClothInput

class ClothInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClothInput
        fields = "__all__"

    def validate_outfits(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Outfits must be a list.")
        
        for row in value:
            if not isinstance(row, list):
                raise serializers.ValidationError("Each outfit group must be a list.")
            for item in row:
                if not isinstance(item, dict):
                    raise serializers.ValidationError("Each outfit item must be a dictionary (JSON object).")
        
        return value