from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import SavedOutfit, ClothInput
from django.db import IntegrityError

@api_view(['GET'])
def get_saved_outfits(request, upload_id):
    """
    Get all saved outfits for a specific upload that belong to the current user
    """
    try:
        # Ensure the user is authenticated
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
            
        # Get the current user's ID
        user_id = request.user.id
        
        # Find all saved outfits matching the upload ID and user ID
        if upload_id.lower() == 'all':
            # Get all saved outfits for the current user
            saved_outfits = SavedOutfit.objects.filter(user_id=user_id)
        else:
            # Get saved outfits for specific upload and current user
            saved_outfits = SavedOutfit.objects.filter(upload_id=upload_id, user_id=user_id)
        
        # Format the response data
        saved_outfits_data = []
        for outfit in saved_outfits:
            saved_outfits_data.append({
                'clientOutfitId': outfit.client_outfit_id,
                'uploadId': outfit.upload_id,  # Include the upload ID for filtering
                'uploadData': outfit.upload_data,
                'outfitData': outfit.outfit_data,
                'createdAt': outfit.created_at
            })
        
        return Response({
            'savedOutfits': saved_outfits_data,
            'count': len(saved_outfits_data)
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': f'Failed to retrieve saved outfits: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def save_outfit(request):
    """
    Save a new outfit combination for the current user
    """
    try:
        # Ensure the user is authenticated
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = request.user.id

        # Extract data from request
        client_outfit_id = request.data.get('clientOutfitId')
        upload_id = request.data.get('userUpload', {}).get('uploadId')
        
        # Validate required fields
        if not client_outfit_id or not upload_id:
            return Response({
                'error': 'Missing required fields: clientOutfitId or uploadId'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if the original cloth input exists
        cloth_input = ClothInput.objects.filter(unique_id=upload_id).first()
        if not cloth_input:
            return Response({
                'error': f'No cloth input found with ID: {upload_id}'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Create the saved outfit
        saved_outfit = SavedOutfit.objects.create(
            upload_id=upload_id,
            client_outfit_id=client_outfit_id,
            user_id=user_id,
            upload_data=request.data.get('userUpload', {}),
            outfit_data=request.data.get('outfit', [])
        )
        
        return Response({
            'message': 'Outfit saved successfully',
            'savedOutfitId': saved_outfit.id
        }, status=status.HTTP_200_OK)
    
    except IntegrityError:
        # Handle case where outfit is already saved
        return Response({
            'message': 'This outfit is already saved'
        }, status=status.HTTP_409_CONFLICT)
    
    except Exception as e:
        return Response({
            'error': f'Failed to save outfit: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def unsave_outfit(request):
    """
    Remove a saved outfit combination for the current user
    """
    try:
        # Ensure the user is authenticated
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = request.user.id
        
        # Extract data from request
        client_outfit_id = request.data.get('clientOutfitId')
        upload_id = request.data.get('uploadId')
        
        # Validate required fields
        if not client_outfit_id or not upload_id:
            return Response({
                'error': 'Missing required fields: clientOutfitId or uploadId'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Find the saved outfit for the current user
        saved_outfit = SavedOutfit.objects.filter(
            upload_id=upload_id,
            client_outfit_id=client_outfit_id,
            user_id=user_id
        ).first()
        
        if not saved_outfit:
            return Response({
                'error': 'Saved outfit not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Delete the saved outfit
        saved_outfit.delete()
        
        return Response({
            'message': 'Outfit removed from saved items'
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': f'Failed to remove saved outfit: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_outfit_details(request, upload_id):
    """
    Get outfit details along with saved status for the current user
    """
    try:
        # Ensure the user is authenticated
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = request.user.id
        
        # Get the cloth input
        cloth_input = get_object_or_404(ClothInput, unique_id=upload_id)
        
        # Get saved outfits for this upload and the current user
        saved_outfits = SavedOutfit.objects.filter(upload_id=upload_id, user_id=user_id)
        saved_outfit_ids = [outfit.client_outfit_id for outfit in saved_outfits]
        
        # Prepare the response data
        outfits = []
        for index, outfit_group in enumerate(cloth_input.outfits):
            # Generate the same client-side ID as we do in the frontend
            outfit_id = f"outfit-{upload_id}-{index}"
            
            outfits.append({
                'id': outfit_id,
                'name': f"{cloth_input.usage or 'Casual'} Outfit {index + 1}",
                'style': cloth_input.usage or 'Casual',
                'items': outfit_group,
                'isSaved': outfit_id in saved_outfit_ids
            })
        
        response_data = {
            'unique_id': cloth_input.unique_id,
            'type': cloth_input.type,
            'color': cloth_input.color,
            'imageURL': cloth_input.imageURL,
            'gender': cloth_input.gender,
            'usage': cloth_input.usage,
            'outfits': outfits,
            'savedOutfitIds': saved_outfit_ids
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': f'Failed to retrieve outfit details: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
def get_user_uploads(request):
    """
    Get all uploads from the current user for filtering in the saved outfits screen
    """
    try:
        # Ensure the user is authenticated
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)

        user_id = request.user.id
        
        # Get cloth inputs for the current user
        cloth_inputs = ClothInput.objects.filter(user_id=user_id)
        
        # Format the response data
        uploads = []
        for cloth_input in cloth_inputs:
            uploads.append({
                'unique_id': cloth_input.unique_id,
                'type': cloth_input.type,
                'color': cloth_input.color,
                'imageURL': cloth_input.imageURL,
                'gender': cloth_input.gender,
                'usage': cloth_input.usage
            })
        
        return Response({
            'uploads': uploads,
            'count': len(uploads)
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': f'Failed to retrieve user uploads: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)