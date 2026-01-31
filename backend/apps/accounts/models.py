"""
User models for authentication and profiles.
"""
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from common.utils import Choices


class UserManager(BaseUserManager):
    """Custom user manager."""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Custom User model."""
    
    email = models.EmailField(unique=True, max_length=255)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15, blank=True, null=True)
    avatar = models.URLField(blank=True, null=True)
    
    role = models.CharField(
        max_length=20,
        choices=Choices.ROLES,
        default='student'
    )
    department = models.CharField(
        max_length=10,
        choices=Choices.DEPARTMENTS,
        blank=True,
        null=True
    )
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)  # For alumni verification
    
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.email} ({self.role})"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def get_scopes(self):
        """Get scopes based on user role."""
        from django.conf import settings
        return settings.ROLE_SCOPES.get(self.role, [])


class StudentProfile(models.Model):
    """Extended profile for students."""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    roll_number = models.CharField(max_length=20, unique=True)
    batch_year = models.IntegerField()
    graduation_year = models.IntegerField(blank=True, null=True)
    semester = models.IntegerField(default=1)
    cgpa = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    
    skills = models.JSONField(default=list, blank=True)
    interests = models.JSONField(default=list, blank=True)
    bio = models.TextField(blank=True, null=True)
    
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    portfolio_url = models.URLField(blank=True, null=True)
    resume_url = models.URLField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'student_profiles'
    
    def __str__(self):
        return f"{self.user.full_name} - {self.roll_number}"


class AlumniProfile(models.Model):
    """Extended profile for alumni."""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='alumni_profile'
    )
    graduation_year = models.IntegerField()
    roll_number = models.CharField(max_length=20, blank=True, null=True)
    
    # Current employment
    current_company = models.CharField(max_length=200, blank=True, null=True)
    current_designation = models.CharField(max_length=200, blank=True, null=True)
    current_location = models.CharField(max_length=200, blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True, null=True)
    experience_years = models.IntegerField(default=0)
    
    skills = models.JSONField(default=list, blank=True)
    expertise_areas = models.JSONField(default=list, blank=True)
    bio = models.TextField(blank=True, null=True)
    
    # Social links
    linkedin_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    portfolio_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    
    # Verification
    verification_status = models.CharField(
        max_length=20,
        choices=Choices.VERIFICATION_STATUS,
        default='pending'
    )
    verification_document = models.URLField(blank=True, null=True)
    verified_at = models.DateTimeField(blank=True, null=True)
    verified_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verified_alumni'
    )
    
    # Preferences
    available_for_mentoring = models.BooleanField(default=False)
    available_for_referrals = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'alumni_profiles'
    
    def __str__(self):
        return f"{self.user.full_name} - {self.graduation_year}"
