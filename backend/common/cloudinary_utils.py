"""
Cloudinary utility functions for file upload
"""
import os
import cloudinary
import cloudinary.uploader
from django.conf import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET'),
    secure=True
)


def upload_image(file, folder='alumni-connect', public_id=None, transformation=None):
    """
    Upload an image or video to Cloudinary
    
    Args:
        file: File object or file path
        folder: Cloudinary folder to store the image (default: 'alumni-connect')
        public_id: Custom public ID for the image (optional)
        transformation: Image transformation options (optional)
        
    Returns:
        dict: Cloudinary response with url, secure_url, public_id, etc.
    """
    try:
        # Detect if it's a video based on content type
        is_video = hasattr(file, 'content_type') and file.content_type.startswith('video/')
        
        upload_options = {
            'folder': folder,
            'resource_type': 'video' if is_video else 'image',
            'quality': 'auto:good' if not is_video else 'auto',
            'fetch_format': 'auto' if not is_video else None,
        }
        
        if public_id:
            upload_options['public_id'] = public_id
            upload_options['overwrite'] = True
            
        if transformation:
            upload_options['transformation'] = transformation
        elif not is_video:
            # Default transformation - optimize for images (not videos)
            upload_options['transformation'] = [
                {'width': 1920, 'height': 1080, 'crop': 'limit'},
                {'quality': 'auto:good'},
                {'fetch_format': 'auto'}
            ]
        
        result = cloudinary.uploader.upload(file, **upload_options)
        return {
            'success': True,
            'url': result.get('secure_url'),
            'public_id': result.get('public_id'),
            'width': result.get('width'),
            'height': result.get('height'),
            'format': result.get('format'),
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def delete_image(public_id):
    """
    Delete an image from Cloudinary
    
    Args:
        public_id: Public ID of the image to delete
        
    Returns:
        dict: Cloudinary response
    """
    try:
        result = cloudinary.uploader.destroy(public_id)
        return {
            'success': result.get('result') == 'ok',
            'message': result.get('result')
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }


def get_image_url(public_id, transformation=None):
    """
    Get the URL for an image stored in Cloudinary
    
    Args:
        public_id: Public ID of the image
        transformation: Image transformation options (optional)
        
    Returns:
        str: Image URL
    """
    try:
        if transformation:
            return cloudinary.CloudinaryImage(public_id).build_url(transformation=transformation)
        return cloudinary.CloudinaryImage(public_id).build_url()
    except Exception as e:
        return None
