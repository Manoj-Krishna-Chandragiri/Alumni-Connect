"""
Serializers for blog models.
"""
from rest_framework import serializers
from .models import Blog, BlogComment, BlogLike, BlogSave
from apps.accounts.serializers import UserSerializer


class BlogSerializer(serializers.ModelSerializer):
    """Serializer for blog posts."""
    
    author = UserSerializer(read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Blog
        fields = [
            'id', 'author', 'title', 'slug', 'excerpt', 'content',
            'cover_image', 'tags', 'category', 'status', 'views_count',
            'likes_count', 'is_liked', 'is_saved', 'comments_count',
            'published_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'author', 'slug', 'views_count', 'likes_count',
            'published_at', 'created_at', 'updated_at'
        ]
    
    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return BlogLike.objects.filter(blog=obj, user=request.user).exists()
        return False
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return BlogSave.objects.filter(blog=obj, user=request.user).exists()
        return False
    
    def get_comments_count(self, obj):
        return obj.comments.count()


class BlogListSerializer(serializers.ModelSerializer):
    """Lighter serializer for blog listing."""

    author = UserSerializer(read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            'id', 'author', 'title', 'slug', 'excerpt', 'content', 'cover_image',
            'tags', 'category', 'status', 'views_count', 'likes_count', 'is_liked',
            'is_saved', 'comments_count', 'published_at', 'created_at'
        ]

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return BlogLike.objects.filter(blog=obj, user=request.user).exists()
        return False

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return BlogSave.objects.filter(blog=obj, user=request.user).exists()
        return False

    def get_comments_count(self, obj):
        return obj.comments.count()


class BlogCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating blogs."""
    
    class Meta:
        model = Blog
        fields = [
            'title', 'excerpt', 'content', 'cover_image',
            'tags', 'category', 'status'
        ]
    
    def create(self, validated_data):
        # Handle base64 image upload
        cover_image = validated_data.get('cover_image', '')
        
        if cover_image and cover_image.startswith('data:image'):
            # It's a base64 image, upload to Cloudinary
            import base64
            import io
            from common.cloudinary_utils import upload_image
            
            try:
                # Extract base64 data
                header, encoded = cover_image.split(',', 1)
                image_data = base64.b64decode(encoded)
                image_file = io.BytesIO(image_data)
                image_file.name = 'blog_cover.jpg'
                image_file.content_type = 'image/jpeg'
                
                # Upload to Cloudinary
                result = upload_image(image_file, folder='blogs/covers')
                
                if result.get('success'):
                    validated_data['cover_image'] = result.get('url')
                else:
                    # Remove cover_image if upload failed
                    validated_data.pop('cover_image', None)
            except Exception as e:
                print(f"Error uploading blog cover image: {str(e)}")
                # Remove cover_image if processing failed
                validated_data.pop('cover_image', None)
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        # Handle base64 image upload for updates
        cover_image = validated_data.get('cover_image', '')
        
        if cover_image and cover_image.startswith('data:image'):
            # It's a base64 image, upload to Cloudinary
            import base64
            import io
            from common.cloudinary_utils import upload_image
            
            try:
                # Extract base64 data
                header, encoded = cover_image.split(',', 1)
                image_data = base64.b64decode(encoded)
                image_file = io.BytesIO(image_data)
                image_file.name = 'blog_cover.jpg'
                image_file.content_type = 'image/jpeg'
                
                # Upload to Cloudinary
                result = upload_image(image_file, folder='blogs/covers')
                
                if result.get('success'):
                    validated_data['cover_image'] = result.get('url')
                else:
                    # Keep existing cover_image if upload failed
                    validated_data.pop('cover_image', None)
            except Exception as e:
                print(f"Error uploading blog cover image: {str(e)}")
                # Keep existing cover_image if processing failed
                validated_data.pop('cover_image', None)
        
        return super().update(instance, validated_data)


class BlogCommentSerializer(serializers.ModelSerializer):
    """Serializer for blog comments."""
    
    author = UserSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = BlogComment
        fields = [
            'id', 'blog', 'author', 'content', 'parent',
            'replies', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'author', 'created_at', 'updated_at']
    
    def get_replies(self, obj):
        if obj.parent is None:  # Only get replies for top-level comments
            replies = obj.replies.all()
            return BlogCommentSerializer(replies, many=True).data
        return []


class BlogCommentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating comments."""
    
    class Meta:
        model = BlogComment
        fields = ['content', 'parent']
