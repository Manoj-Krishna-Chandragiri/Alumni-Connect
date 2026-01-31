"""
Models for blog posts.
"""
from django.db import models
from django.conf import settings
from common.utils import Choices, slugify


class Blog(models.Model):
    """Blog post model."""
    
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blogs'
    )
    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=350, unique=True, blank=True)
    excerpt = models.TextField(max_length=500, blank=True)
    content = models.TextField()
    cover_image = models.URLField(blank=True, null=True)
    
    tags = models.JSONField(default=list, blank=True)
    category = models.CharField(max_length=100, blank=True)
    
    status = models.CharField(
        max_length=20,
        choices=Choices.BLOG_STATUS,
        default='draft'
    )
    
    views_count = models.IntegerField(default=0)
    likes_count = models.IntegerField(default=0)
    
    published_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'blogs'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Blog.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)


class BlogComment(models.Model):
    """Comment on blog post."""
    
    blog = models.ForeignKey(
        Blog,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blog_comments'
    )
    content = models.TextField(max_length=1000)
    
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='replies'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'blog_comments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Comment by {self.author.full_name} on {self.blog.title}"


class BlogLike(models.Model):
    """Like on blog post."""
    
    blog = models.ForeignKey(
        Blog,
        on_delete=models.CASCADE,
        related_name='likes'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='blog_likes'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'blog_likes'
        unique_together = ['blog', 'user']
