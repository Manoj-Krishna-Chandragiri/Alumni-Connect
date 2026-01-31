"""
Views for job operations.
"""
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from django.db.models import F

from common.permissions import ScopePermission, IsOwnerOrAdmin, IsVerifiedAlumni
from common.utils import success_response, error_response
from .models import Job, JobApplication, SavedJob
from .serializers import (
    JobSerializer,
    JobListSerializer,
    JobCreateSerializer,
    JobApplicationSerializer,
    JobApplicationCreateSerializer,
    SavedJobSerializer,
)


class JobListCreateView(generics.ListCreateAPIView):
    """
    List all open jobs / Create new job.
    - All authenticated users can see open jobs
    - Only verified alumni can post jobs
    """
    
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['job_type', 'status', 'is_remote']
    search_fields = ['title', 'company', 'location', 'description']
    ordering_fields = ['created_at', 'salary_max', 'deadline']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return JobCreateSerializer
        return JobListSerializer
    
    def get_queryset(self):
        queryset = Job.objects.filter(status='open')
        
        # Filter by skills
        skills = self.request.query_params.get('skills')
        if skills:
            skill_list = [s.strip() for s in skills.split(',')]
            for skill in skill_list:
                queryset = queryset.filter(skills_required__icontains=skill)
        
        # Filter by experience
        experience = self.request.query_params.get('experience')
        if experience:
            queryset = queryset.filter(experience_min__lte=experience)
        
        # Filter by salary
        min_salary = self.request.query_params.get('min_salary')
        if min_salary:
            queryset = queryset.filter(salary_min__gte=min_salary)
        
        return queryset.select_related('posted_by')
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [
                permissions.IsAuthenticated(),
                ScopePermission(),
                IsVerifiedAlumni()
            ]
        return super().get_permissions()
    
    required_scopes = ['create:jobs']
    
    def perform_create(self, serializer):
        serializer.save(posted_by=self.request.user)


class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, delete a job posting."""
    
    queryset = Job.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return JobCreateSerializer
        return JobSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        return super().get_permissions()
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Increment view count
        Job.objects.filter(pk=instance.pk).update(views_count=F('views_count') + 1)
        instance.refresh_from_db()
        
        serializer = self.get_serializer(instance, context={'request': request})
        return success_response(data=serializer.data)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return success_response(
            data=JobSerializer(instance, context={'request': request}).data,
            message='Job updated successfully'
        )
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = 'closed'
        instance.save()
        return success_response(message='Job closed successfully')


class JobApplyView(APIView):
    """Apply for a job."""
    
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['read:jobs']  # Students can apply
    
    def post(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return error_response(
                'Job not found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        if job.status != 'open':
            return error_response(
                'This job is no longer accepting applications',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if already applied
        if JobApplication.objects.filter(job=job, applicant=request.user).exists():
            return error_response(
                'You have already applied for this job',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = JobApplicationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        application = serializer.save(job=job, applicant=request.user)
        
        # Increment applications count
        Job.objects.filter(pk=job.pk).update(
            applications_count=F('applications_count') + 1
        )
        
        return success_response(
            data=JobApplicationSerializer(application).data,
            message='Application submitted successfully',
            status_code=status.HTTP_201_CREATED
        )


class JobSaveView(APIView):
    """Save/Unsave a job."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist:
            return error_response(
                'Job not found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        saved, created = SavedJob.objects.get_or_create(
            job=job,
            user=request.user
        )
        
        if created:
            return success_response(message='Job saved')
        else:
            saved.delete()
            return success_response(message='Job unsaved')


class MyJobsView(generics.ListAPIView):
    """List jobs posted by current user."""
    
    serializer_class = JobListSerializer
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['create:jobs']
    
    def get_queryset(self):
        return Job.objects.filter(
            posted_by=self.request.user
        ).order_by('-created_at')


class MyApplicationsView(generics.ListAPIView):
    """List current user's job applications."""
    
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return JobApplication.objects.filter(
            applicant=self.request.user
        ).select_related('job', 'job__posted_by')


class MySavedJobsView(generics.ListAPIView):
    """List current user's saved jobs."""
    
    serializer_class = SavedJobSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return SavedJob.objects.filter(
            user=self.request.user
        ).select_related('job', 'job__posted_by')


class JobApplicationsView(generics.ListAPIView):
    """List applications for a job (job poster only)."""
    
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        job_id = self.kwargs.get('pk')
        return JobApplication.objects.filter(
            job_id=job_id,
            job__posted_by=self.request.user
        ).select_related('applicant')


class UpdateApplicationStatusView(APIView):
    """Update application status (job poster only)."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def patch(self, request, pk):
        try:
            application = JobApplication.objects.get(pk=pk)
        except JobApplication.DoesNotExist:
            return error_response(
                'Application not found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # Only job poster can update
        if application.job.posted_by != request.user:
            return error_response(
                'Permission denied',
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        new_status = request.data.get('status')
        if new_status not in ['applied', 'reviewed', 'shortlisted', 'rejected', 'hired']:
            return error_response(
                'Invalid status',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        application.status = new_status
        application.save()
        
        return success_response(
            data=JobApplicationSerializer(application).data,
            message='Application status updated'
        )
