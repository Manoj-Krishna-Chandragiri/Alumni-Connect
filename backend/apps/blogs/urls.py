"""
URL configuration for blogs app.
"""
from django.urls import path
from . import views

app_name = 'blogs'

urlpatterns = [
    path('', views.BlogListCreateView.as_view(), name='blog_list_create'),
    path('my/', views.MyBlogsView.as_view(), name='my_blogs'),
    path('<slug:slug>/', views.BlogDetailView.as_view(), name='blog_detail'),
    path('<slug:slug>/like/', views.BlogLikeView.as_view(), name='blog_like'),
    path('<slug:slug>/comments/', views.BlogCommentListCreateView.as_view(), name='blog_comments'),
    path('comments/<int:pk>/', views.BlogCommentDetailView.as_view(), name='comment_detail'),
]
