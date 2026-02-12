"""
URL Configuration for Alumni Connect API.
"""
from django.urls import path, include
from api import views

urlpatterns = [
    # Auth
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/refresh/', views.RefreshTokenView.as_view(), name='refresh'),
    path('auth/me/', views.MeView.as_view(), name='me'),
    
    # File Upload
    path('upload/image/', views.ImageUploadView.as_view(), name='image-upload'),
    
    # Utilities
    path('utils/roll-number/', views.RollNumberUtilsView.as_view(), name='roll-number-utils'),
    
    # Students
    path('students/', views.StudentListView.as_view(), name='student-list'),
    path('students/profile/', views.StudentProfileView.as_view(), name='student-profile'),
    
    # Alumni
    path('alumni/', views.AlumniListView.as_view(), name='alumni-list'),
    path('alumni/profile/', views.AlumniProfileView.as_view(), name='alumni-profile'),
    path('alumni/<str:alumni_id>/', views.AlumniDetailView.as_view(), name='alumni-detail'),
    path('alumni/<str:alumni_id>/verify/', views.VerifyAlumniView.as_view(), name='verify-alumni'),
    
    # Blogs
    path('blogs/', views.BlogListView.as_view(), name='blog-list'),
    path('blogs/<str:blog_id>/', views.BlogDetailView.as_view(), name='blog-detail'),
    path('blogs/<str:blog_id>/like/', views.BlogLikeView.as_view(), name='blog-like'),
    path('blogs/<str:blog_id>/comments/', views.BlogCommentView.as_view(), name='blog-comments'),
    path('blogs/<str:blog_id>/share/', views.BlogShareView.as_view(), name='blog-share'),
    
    # Jobs
    path('jobs/', views.JobListView.as_view(), name='job-list'),
    path('jobs/<str:job_id>/', views.JobDetailView.as_view(), name='job-detail'),
    path('jobs/<str:job_id>/save/', views.JobSaveView.as_view(), name='job-save'),
    
    # Events
    path('events/', views.EventListView.as_view(), name='event-list'),
    path('events/<str:event_id>/', views.EventDetailView.as_view(), name='event-detail'),
    
    # AI Engine
    path('ai/career-recommendation/', views.CareerRecommendationView.as_view(), name='career-recommendation'),
    path('ai/career-recommendation/<str:student_id>/', views.CareerRecommendationView.as_view(), name='career-recommendation-student'),
    
    # Counsellor
    path('counsellor/stats/', views.CounsellorStatsView.as_view(), name='counsellor-stats'),
    path('counsellor/insights/', views.CounsellorInsightsView.as_view(), name='counsellor-insights'),
    path('counsellor/students/', views.CounsellorStudentsView.as_view(), name='counsellor-students'),
    path('counsellor/students/<str:student_id>/', views.CounsellorStudentDetailView.as_view(), name='counsellor-student-detail'),
    path('counsellor/alumni/', views.CounsellorAlumniView.as_view(), name='counsellor-alumni'),
    
    # Dashboard
    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
]
