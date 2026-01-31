"""
Views for blog operations.
"""
from rest_framework import generics, permissions, status, serializers
from rest_framework.views import APIView
from django.utils import timezone
from django.db.models import F

from common.permissions import ScopePermission, IsOwnerOrAdmin, IsVerifiedAlumni
from common.utils import success_response, error_response
from .models import Blog, BlogComment, BlogLike
from .serializers import (
    BlogSerializer,
    BlogListSerializer,
    BlogCreateSerializer,
    BlogCommentSerializer,
    BlogCommentCreateSerializer,
)


class BlogListCreateView(generics.ListCreateAPIView):
    """
    List all published blogs / Create new blog.
    - All authenticated users can read published blogs
    - Only verified alumni can create blogs
    """
    
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'content', 'tags']
    ordering_fields = ['created_at', 'views_count', 'likes_count']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BlogCreateSerializer
        return BlogListSerializer
    
    def get_queryset(self):
        queryset = Blog.objects.all()
        
        user_role = getattr(self.request, 'jwt_role', self.request.user.role)
        
        # Regular users only see published blogs
        if user_role not in ['admin']:
            queryset = queryset.filter(status='published')
        
        # Alumni can see their own drafts
        if user_role == 'alumni':
            queryset = Blog.objects.filter(status='published') | \
                       Blog.objects.filter(author=self.request.user)
        
        # Filter by tag
        tag = self.request.query_params.get('tag')
        if tag:
            queryset = queryset.filter(tags__contains=[tag])
        
        # Filter by author
        author_id = self.request.query_params.get('author')
        if author_id:
            queryset = queryset.filter(author_id=author_id)
        
        return queryset.select_related('author')
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [
                permissions.IsAuthenticated(),
                ScopePermission(),
                IsVerifiedAlumni()
            ]
        return super().get_permissions()
    
    required_scopes = ['create:blogs']
    
    def perform_create(self, serializer):
        blog = serializer.save(author=self.request.user)
        if blog.status == 'published':
            blog.published_at = timezone.now()
            blog.save()


class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, delete a blog post."""
    
    queryset = Blog.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return BlogCreateSerializer
        return BlogSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        return super().get_permissions()
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Increment view count
        Blog.objects.filter(pk=instance.pk).update(views_count=F('views_count') + 1)
        instance.refresh_from_db()
        
        serializer = self.get_serializer(instance)
        return success_response(data=serializer.data)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        blog = serializer.save()
        
        # Set published_at if publishing
        if blog.status == 'published' and not blog.published_at:
            blog.published_at = timezone.now()
            blog.save()
        
        return success_response(
            data=BlogSerializer(blog, context={'request': request}).data,
            message='Blog updated successfully'
        )
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return success_response(message='Blog deleted successfully')


class BlogLikeView(APIView):
    """Like/Unlike a blog post."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, slug):
        try:
            blog = Blog.objects.get(slug=slug)
        except Blog.DoesNotExist:
            return error_response(
                'Blog not found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        like, created = BlogLike.objects.get_or_create(
            blog=blog,
            user=request.user
        )
        
        if created:
            Blog.objects.filter(pk=blog.pk).update(likes_count=F('likes_count') + 1)
            return success_response(message='Blog liked')
        else:
            like.delete()
            Blog.objects.filter(pk=blog.pk).update(likes_count=F('likes_count') - 1)
            return success_response(message='Blog unliked')


class BlogCommentListCreateView(generics.ListCreateAPIView):
    """List/Create comments for a blog."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BlogCommentCreateSerializer
        return BlogCommentSerializer
    
    def get_queryset(self):
        blog_slug = self.kwargs.get('slug')
        return BlogComment.objects.filter(
            blog__slug=blog_slug,
            parent__isnull=True  # Only top-level comments
        ).select_related('author')
    
    def perform_create(self, serializer):
        blog_slug = self.kwargs.get('slug')
        try:
            blog = Blog.objects.get(slug=blog_slug)
        except Blog.DoesNotExist:
            raise serializers.ValidationError({'blog': 'Blog not found'})
        
        serializer.save(blog=blog, author=self.request.user)


class BlogCommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, delete a comment."""
    
    queryset = BlogComment.objects.all()
    serializer_class = BlogCommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]


class MyBlogsView(generics.ListAPIView):
    """List blogs by current user."""
    
    serializer_class = BlogListSerializer
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['create:blogs']
    
    def get_queryset(self):
        return Blog.objects.filter(
            author=self.request.user
        ).order_by('-created_at')
