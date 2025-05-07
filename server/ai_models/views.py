from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from django.conf import settings
from items.models import Items
from items.serializer import ItemSerializer
from user.models import ClothInput
from user.serializer import ClothInputSerializer
from .utlis import predict_category, extract_cloth_colors_with_segmentation, extract_compatible_clothes, find_closest_color, upload_image
from PIL import Image
from io import BytesIO
import requests

@api_view(["GET"])
def test(request):
    return Response({"message": "Hello"}, status=status.HTTP_200_OK)


@api_view(["GET"])
def test_models(request):
    """Test if all models and category mappings are loaded properly."""
    models_loaded = {
        "ResNet50": "Loaded" if "resnet50" in settings.MODEL_REGISTRY else "Not Loaded",
        "EfficientNet": "Loaded" if "efficientnet" in settings.MODEL_REGISTRY else "Not Loaded",
        "Mask R-CNN": "Loaded" if "mask-rcnn" in settings.MODEL_REGISTRY else "Not Loaded",
        "Casual Model": "Loaded" if "casual_model" in settings.MODEL_REGISTRY else "Not Loaded",
        "Formal Model": "Loaded" if "formal_model" in settings.MODEL_REGISTRY else "Not Loaded",
        "Sports Model": "Loaded" if "sports_model" in settings.MODEL_REGISTRY else "Not Loaded",
        "Casual Mapping": "Loaded" if "casual_mapping" in settings.MODEL_REGISTRY else "Not Loaded",
        "Formal Mapping": "Loaded" if "formal_mapping" in settings.MODEL_REGISTRY else "Not Loaded",
        "Sports Mapping": "Loaded" if "sports_mapping" in settings.MODEL_REGISTRY else "Not Loaded",
    }

    return Response({"models_status": models_loaded}) 

@api_view(["POST"])
def model_test(request):
    """
    Handles an image upload and predicts the clothing category.
    """
    try:
        # Ensure an image file is provided in the request
        if "image" not in request.FILES:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Read image from request
        image_file = request.FILES["image"]
        image = Image.open(image_file).convert("RGB")  # Convert to RGB

        # Load the model and category mapping from settings
        casual_model = settings.MODEL_REGISTRY["casual_model"]
        casual_mapping = settings.MODEL_REGISTRY["casual_mapping"]

        # Predict category
        category, _ = predict_category(image, casual_model, casual_mapping)

        return Response({"Category": category}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(["POST"])
def provide_outfits(request):
    try:
        if "image" not in request.FILES:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)

        if not request.user or not request.user.is_authenticated:
            return Response({"error": "No user found"}, status=status.HTTP_400_BAD_REQUEST)

        user_id = request.user.id

        image_file = request.FILES["image"]
        image_bytes = image_file.read()
        image_name = image_file.name
        image_file.seek(0)

         # Read image from request
        if "gender" not in request.data:
            return Response({"error": "No gender provided"}, status=status.HTTP_400_BAD_REQUEST)
        gender = request.data["gender"].replace(" ", "")

        if "usage" not in request.data:
            return Response({"error": "No usage provided"}, status=status.HTTP_400_BAD_REQUEST)
        usage = request.data["usage"].replace(" ", "")

        pairs_dataset = 'https://fashion-recommendation-models.s3.ap-south-1.amazonaws.com/Compatible-Outfits.csv'
        clothes_dataset = "https://fashion-recommendation-models.s3.ap-south-1.amazonaws.com/filtered_data_13.csv"

        casual_model = settings.MODEL_REGISTRY["casual_model"]
        casual_mapping = settings.MODEL_REGISTRY["casual_mapping"]
        formal_model = settings.MODEL_REGISTRY["formal_model"]
        formal_mapping = settings.MODEL_REGISTRY["formal_mapping"]
        sports_model = settings.MODEL_REGISTRY["sports_model"]
        sports_mapping = settings.MODEL_REGISTRY["sports_mapping"]
        

        category = ""
        if usage == "Casual":
            category = predict_category(image_bytes, casual_model, casual_mapping)[0]
        elif usage == "Formal":
            category = predict_category(image_bytes, formal_model, formal_mapping)[0]
        elif usage == "Sports":
            category = predict_category(image_bytes, sports_model, sports_mapping)[0]
        else: 
            print("Unrecognized Usage")
            return Response({"Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        print(category)

        ArticleType = {
            "Topwear" : ['Tshirts','Shirts','Tops','Kurtas','Kurtis','Dresses'],
            "Layered Wear":['Jackets','Waistcoat','Sweatshirts','Blazers','Shrug'],
            "Bottomwear" :['Jeans','Trousers','Track Pants','Shorts','Capris','Leggings','Skirts'],
            "Footwear" : ['Casual Shoes','Formal Shoes','Sports Shoes','Sneakers','Flats','Loafers','Heels','Sandal'],
            "Accessories": ['Watches','Handbags','Socks', 'Belts']
        }

        cloth_type = ""

        for key, values in ArticleType.items():
            if category in values:
                cloth_type = key

        
        colors, segmented_image =  extract_cloth_colors_with_segmentation(image_bytes)
        color = tuple(colors[0][0])
        column_name = f"{cloth_type} Color RGB"
        
        closest_matches = find_closest_color(pairs_dataset, color, column_name)
        filtered_matches = closest_matches.loc[(closest_matches[cloth_type] == category) & (closest_matches["Usage"].str.contains(usage))].head(10) 
        
        top_matches = extract_compatible_clothes(clothes_dataset, filtered_matches, cloth_type, gender, usage)
        top_matches = [[int(value) for value in row] for row in top_matches]

        response = requests.get(f"https://www.thecolorapi.com/id?rgb={color[0]},{color[1]},{color[2]}")
        data = response.json()  
        color_name = data['name']['value']
        url = upload_image(image_bytes, image_name)

        all_serialized_groups = []

        for group in top_matches:
            # Fetch items using IDs in group
            items = Items.objects.filter(cloth_id__in=group)

            # Create a mapping of cloth_id to item for sorting
            item_dict = {item.cloth_id: item for item in items}

            # Maintain the order of the group
            ordered_items = [item_dict[cloth_id] for cloth_id in group if cloth_id in item_dict]

            serializer = ItemSerializer(ordered_items, many=True)
            all_serialized_groups.append(serializer.data)

        data = {
            "user_id": user_id,
            "usage": usage,
            "gender": gender,
            "color": color_name,
            "type": category,
            "imageURL": url,
            "outfits": all_serialized_groups   
        }

        try:
            instance = ClothInput.objects.create(**data)
            uuid_value = instance.unique_id
            return Response({"id": uuid_value}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error creating instance: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)