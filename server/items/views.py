from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
import pandas as pd
from .serializer import ItemSerializer
from .models import Items
import os
from dotenv import load_dotenv

@api_view(["GET"])
def test(request):
    return Response({"message": "server running"})

@api_view(['GET'])
def store_items(request):
    try:
        load_dotenv()
        dataset_path = os.getenv("AWS_CLOTHES_DATASET")
        df = pd.read_csv(dataset_path)

        items_to_create = []

        for _, row in df.iterrows():
            item = Items(
                cloth_id=row.id,
                gender=row.gender,
                season=row.season,
                color=row.baseColour,
                type=row.articleType,
                name=row.productDisplayName,
                url=row.url
            )
            items_to_create.append(item)

        Items.objects.bulk_create(items_to_create, batch_size=1000)

        return Response({"message": f"Bulk inserted {len(items_to_create)} items."}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_items(request):
    try:
        items = Items.objects.order_by("?")[:1000]
        if items.exists():
            serialized_items = ItemSerializer(items, many=True)
            return Response({"items": serialized_items.data, "message": f"{len(items)} items found"})
        else:
            return Response({"message": "No items found"}, status=status.HTTP_404_NOT_FOUND)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def get_item_from_id(request, item_id):
    try:
        item = Items.objects.get(id=item_id)
        serializer = ItemSerializer(item)
        return Response({"message": "Item found", "item": serializer.data}, status=status.HTTP_200_OK)
    except Items.DoesNotExist:
        return Response({"message": "No cloth found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
