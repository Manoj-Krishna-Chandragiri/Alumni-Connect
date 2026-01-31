"""
URL configuration for jobs app.
"""
from django.urls import path
from . import views

app_name = 'jobs'

urlpatterns = [
    path('', views.JobListCreateView.as_view(), name='job_list_create'),
    path('my/', views.MyJobsView.as_view(), name='my_jobs'),
    path('applications/', views.MyApplicationsView.as_view(), name='my_applications'),
    path('saved/', views.MySavedJobsView.as_view(), name='saved_jobs'),
    path('<int:pk>/', views.JobDetailView.as_view(), name='job_detail'),
    path('<int:pk>/apply/', views.JobApplyView.as_view(), name='job_apply'),
    path('<int:pk>/save/', views.JobSaveView.as_view(), name='job_save'),
    path('<int:pk>/applications/', views.JobApplicationsView.as_view(), name='job_applications'),
    path('applications/<int:pk>/status/', views.UpdateApplicationStatusView.as_view(), name='update_application_status'),
]
