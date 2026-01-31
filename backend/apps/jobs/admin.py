from django.contrib import admin
from .models import Job, JobApplication, SavedJob


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'posted_by', 'job_type', 'status', 'created_at']
    list_filter = ['job_type', 'status', 'is_remote', 'created_at']
    search_fields = ['title', 'company', 'description']
    ordering = ['-created_at']


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ['job', 'applicant', 'status', 'applied_at']
    list_filter = ['status', 'applied_at']
    search_fields = ['job__title', 'applicant__email']


@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    list_display = ['user', 'job', 'saved_at']
    list_filter = ['saved_at']
