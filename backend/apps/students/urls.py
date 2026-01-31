"""
URL configuration for students app.
"""
from django.urls import path
from . import views

app_name = 'students'

urlpatterns = [
    path('', views.StudentListView.as_view(), name='student_list'),
    path('stats/', views.StudentStatsView.as_view(), name='student_stats'),
    path('<int:pk>/', views.StudentDetailView.as_view(), name='student_detail'),
]
