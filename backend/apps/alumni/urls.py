"""
URL configuration for alumni app.
"""
from django.urls import path
from . import views

app_name = 'alumni'

urlpatterns = [
    path('', views.AlumniListView.as_view(), name='alumni_list'),
    path('stats/', views.AlumniStatsView.as_view(), name='alumni_stats'),
    path('pending/', views.PendingVerificationView.as_view(), name='pending_verification'),
    path('<int:pk>/', views.AlumniDetailView.as_view(), name='alumni_detail'),
]
