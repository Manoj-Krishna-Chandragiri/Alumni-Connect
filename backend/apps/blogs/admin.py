from django.contrib import admin
from .models import Blog, BlogComment, BlogLike


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'status', 'views_count', 'likes_count', 'created_at']
    list_filter = ['status', 'category', 'created_at']
    search_fields = ['title', 'content', 'author__email']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['-created_at']


@admin.register(BlogComment)
class BlogCommentAdmin(admin.ModelAdmin):
    list_display = ['blog', 'author', 'created_at']
    list_filter = ['created_at']
    search_fields = ['content', 'author__email']


@admin.register(BlogLike)
class BlogLikeAdmin(admin.ModelAdmin):
    list_display = ['blog', 'user', 'created_at']
    list_filter = ['created_at']
