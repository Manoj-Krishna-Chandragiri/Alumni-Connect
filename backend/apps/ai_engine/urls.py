"""
URL configuration for AI engine app.
"""
from django.urls import path
from . import views

app_name = 'ai_engine'

urlpatterns = [
    # Original TF-IDF based endpoints
    path('career-recommendation/', views.CareerRecommendationView.as_view(), name='career_recommendation'),
    path('career-recommendation/<int:student_id>/', views.CareerRecommendationView.as_view(), name='career_recommendation_student'),
    path('mentors/', views.MentorRecommendationView.as_view(), name='mentor_recommendations'),
    path('jobs/', views.JobRecommendationView.as_view(), name='job_recommendations'),
    path('skill-gap/', views.SkillGapAnalysisView.as_view(), name='skill_gap_analysis'),
    path('career-paths/', views.CareerPathsView.as_view(), name='career_paths'),
    path('batch-report/', views.BatchCareerReportView.as_view(), name='batch_report'),
    
    # NEW: ML-powered mentor matching endpoints
    path('ml/mentors/', views.MLMentorRecommendationView.as_view(), name='ml_mentor_recommendations'),
    path('ml/prediction/', views.MLMentorshipPredictionView.as_view(), name='ml_mentorship_prediction'),
    path('ml/batch-analysis/', views.MLBatchMentorAnalysisView.as_view(), name='ml_batch_analysis'),
    
    # NEW: ML-powered career & placement prediction endpoints
    path('ml/placement/', views.MLPlacementPredictionView.as_view(), name='ml_placement_prediction'),
    path('ml/salary/', views.MLSalaryPredictionView.as_view(), name='ml_salary_prediction'),
    path('ml/career-analysis/', views.MLCareerAnalysisView.as_view(), name='ml_career_analysis'),
    path('ml/batch-career-analysis/', views.MLBatchCareerAnalysisView.as_view(), name='ml_batch_career_analysis'),
]
