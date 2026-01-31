"""
Models for job postings.
"""
from django.db import models
from django.conf import settings
from common.utils import Choices


class Job(models.Model):
    """Job posting model."""
    
    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='posted_jobs'
    )
    
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    company_logo = models.URLField(blank=True, null=True)
    
    description = models.TextField()
    requirements = models.TextField(blank=True)
    responsibilities = models.TextField(blank=True)
    
    job_type = models.CharField(
        max_length=20,
        choices=Choices.JOB_TYPE,
        default='full_time'
    )
    location = models.CharField(max_length=200)
    is_remote = models.BooleanField(default=False)
    
    salary_min = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True
    )
    salary_max = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True
    )
    salary_currency = models.CharField(max_length=3, default='INR')
    
    experience_min = models.IntegerField(default=0)
    experience_max = models.IntegerField(blank=True, null=True)
    
    skills_required = models.JSONField(default=list, blank=True)
    qualifications = models.JSONField(default=list, blank=True)
    
    application_url = models.URLField(blank=True, null=True)
    application_email = models.EmailField(blank=True, null=True)
    
    status = models.CharField(
        max_length=20,
        choices=Choices.JOB_STATUS,
        default='open'
    )
    
    deadline = models.DateField(blank=True, null=True)
    views_count = models.IntegerField(default=0)
    applications_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'jobs'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} at {self.company}"


class JobApplication(models.Model):
    """Job application model."""
    
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='applications'
    )
    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='job_applications'
    )
    
    cover_letter = models.TextField(blank=True)
    resume_url = models.URLField(blank=True, null=True)
    
    status = models.CharField(
        max_length=20,
        choices=[
            ('applied', 'Applied'),
            ('reviewed', 'Reviewed'),
            ('shortlisted', 'Shortlisted'),
            ('rejected', 'Rejected'),
            ('hired', 'Hired'),
        ],
        default='applied'
    )
    
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'job_applications'
        unique_together = ['job', 'applicant']
        ordering = ['-applied_at']
    
    def __str__(self):
        return f"{self.applicant.full_name} - {self.job.title}"


class SavedJob(models.Model):
    """Saved/Bookmarked job."""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='saved_jobs'
    )
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='saved_by'
    )
    saved_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'saved_jobs'
        unique_together = ['user', 'job']
