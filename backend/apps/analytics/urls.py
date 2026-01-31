"""
URL configuration for analytics app.
"""
from django.urls import path
from . import views

app_name = 'analytics'

urlpatterns = [
    path('dashboard/', views.DashboardStatsView.as_view(), name='dashboard_stats'),
    path('department/', views.DepartmentAnalyticsView.as_view(), name='department_analytics'),
    path('placement/', views.PlacementAnalyticsView.as_view(), name='placement_analytics'),
    path('engagement/', views.EngagementAnalyticsView.as_view(), name='engagement_analytics'),
]
