"""
Serializers for job models.
"""
from rest_framework import serializers
from .models import Job, JobApplication, SavedJob
from apps.accounts.serializers import UserSerializer


class JobSerializer(serializers.ModelSerializer):
    """Serializer for job postings."""
    
    posted_by = UserSerializer(read_only=True)
    is_saved = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = [
            'id', 'posted_by', 'title', 'company', 'company_logo',
            'description', 'requirements', 'responsibilities',
            'job_type', 'location', 'is_remote',
            'salary_min', 'salary_max', 'salary_currency',
            'experience_min', 'experience_max',
            'skills_required', 'qualifications',
            'application_url', 'application_email',
            'status', 'deadline', 'views_count', 'applications_count',
            'is_saved', 'has_applied', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'posted_by', 'views_count', 'applications_count',
            'created_at', 'updated_at'
        ]
    
    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(job=obj, user=request.user).exists()
        return False
    
    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return JobApplication.objects.filter(job=obj, applicant=request.user).exists()
        return False


class JobListSerializer(serializers.ModelSerializer):
    """Lighter serializer for job listing."""
    
    posted_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Job
        fields = [
            'id', 'posted_by', 'title', 'company', 'company_logo',
            'job_type', 'location', 'is_remote',
            'salary_min', 'salary_max', 'salary_currency',
            'experience_min', 'experience_max',
            'skills_required', 'status', 'deadline',
            'views_count', 'applications_count', 'created_at'
        ]


class JobCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating jobs."""
    
    class Meta:
        model = Job
        fields = [
            'title', 'company', 'company_logo', 'description',
            'requirements', 'responsibilities', 'job_type',
            'location', 'is_remote', 'salary_min', 'salary_max',
            'salary_currency', 'experience_min', 'experience_max',
            'skills_required', 'qualifications',
            'application_url', 'application_email', 'deadline'
        ]


class JobApplicationSerializer(serializers.ModelSerializer):
    """Serializer for job applications."""
    
    applicant = UserSerializer(read_only=True)
    job = JobListSerializer(read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job', 'applicant', 'cover_letter', 'resume_url',
            'status', 'applied_at', 'updated_at'
        ]
        read_only_fields = ['id', 'applicant', 'applied_at', 'updated_at']


class JobApplicationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating job applications."""
    
    class Meta:
        model = JobApplication
        fields = ['cover_letter', 'resume_url']


class SavedJobSerializer(serializers.ModelSerializer):
    """Serializer for saved jobs."""
    
    job = JobListSerializer(read_only=True)
    
    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'saved_at']
