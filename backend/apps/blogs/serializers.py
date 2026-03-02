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
