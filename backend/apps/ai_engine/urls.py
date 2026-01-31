"""
URL configuration for AI engine app.
"""
from django.urls import path
from . import views

app_name = 'ai_engine'

urlpatterns = [
    path('career-recommendation/', views.CareerRecommendationView.as_view(), name='career_recommendation'),
    path('career-recommendation/<int:student_id>/', views.CareerRecommendationView.as_view(), name='career_recommendation_student'),
    path('mentors/', views.MentorRecommendationView.as_view(), name='mentor_recommendations'),
    path('jobs/', views.JobRecommendationView.as_view(), name='job_recommendations'),
    path('skill-gap/', views.SkillGapAnalysisView.as_view(), name='skill_gap_analysis'),
    path('career-paths/', views.CareerPathsView.as_view(), name='career_paths'),
    path('batch-report/', views.BatchCareerReportView.as_view(), name='batch_report'),
]
