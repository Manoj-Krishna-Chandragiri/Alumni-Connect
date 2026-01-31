"""
Views for analytics and reports.
"""
from rest_framework.views import APIView
from rest_framework import permissions
from django.contrib.auth import get_user_model
from django.db.models import Count, Avg
from django.utils import timezone
from datetime import timedelta

from common.permissions import ScopePermission, DepartmentPermission
from common.utils import success_response
from apps.accounts.models import StudentProfile, AlumniProfile
from apps.blogs.models import Blog
from apps.jobs.models import Job, JobApplication
from apps.events.models import Event, EventRegistration

User = get_user_model()


class DashboardStatsView(APIView):
    """Get dashboard statistics based on user role."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user_role = getattr(request, 'jwt_role', request.user.role)
        
        if user_role == 'student':
            return self._student_stats(request)
        elif user_role == 'alumni':
            return self._alumni_stats(request)
        elif user_role == 'counsellor':
            return self._counsellor_stats(request)
        elif user_role == 'hod':
            return self._hod_stats(request)
        elif user_role == 'principal':
            return self._principal_stats(request)
        elif user_role == 'admin':
            return self._admin_stats(request)
        
        return success_response(data={})
    
    def _student_stats(self, request):
        stats = {
            'total_alumni': User.objects.filter(role='alumni', is_verified=True).count(),
            'total_blogs': Blog.objects.filter(status='published').count(),
            'open_jobs': Job.objects.filter(status='open').count(),
            'upcoming_events': Event.objects.filter(
                status='upcoming',
                start_datetime__gte=timezone.now()
            ).count(),
            'my_applications': JobApplication.objects.filter(
                applicant=request.user
            ).count(),
            'my_event_registrations': EventRegistration.objects.filter(
                user=request.user,
                status='registered'
            ).count(),
        }
        return success_response(data=stats)
    
    def _alumni_stats(self, request):
        stats = {
            'my_blogs': Blog.objects.filter(author=request.user).count(),
            'published_blogs': Blog.objects.filter(
                author=request.user,
                status='published'
            ).count(),
            'my_jobs': Job.objects.filter(posted_by=request.user).count(),
            'open_jobs': Job.objects.filter(
                posted_by=request.user,
                status='open'
            ).count(),
            'total_applications': JobApplication.objects.filter(
                job__posted_by=request.user
            ).count(),
            'upcoming_events': Event.objects.filter(
                status='upcoming',
                start_datetime__gte=timezone.now()
            ).count(),
        }
        return success_response(data=stats)
    
    def _counsellor_stats(self, request):
        stats = {
            'total_students': User.objects.filter(
                role='student',
                is_active=True
            ).count(),
            'total_alumni': User.objects.filter(
                role='alumni',
                is_active=True,
                is_verified=True
            ).count(),
            'upcoming_events': Event.objects.filter(
                status='upcoming',
                start_datetime__gte=timezone.now()
            ).count(),
            'recent_blogs': Blog.objects.filter(
                status='published',
                created_at__gte=timezone.now() - timedelta(days=7)
            ).count(),
        }
        return success_response(data=stats)
    
    def _hod_stats(self, request):
        department = request.user.department
        
        students = User.objects.filter(role='student', is_active=True)
        alumni = User.objects.filter(role='alumni', is_active=True)
        
        if department:
            students = students.filter(department=department)
            alumni = alumni.filter(department=department)
        
        stats = {
            'total_students': students.count(),
            'total_alumni': alumni.count(),
            'verified_alumni': alumni.filter(is_verified=True).count(),
            'avg_cgpa': StudentProfile.objects.filter(
                user__in=students
            ).aggregate(avg=Avg('cgpa'))['avg'],
        }
        return success_response(data=stats)
    
    def _principal_stats(self, request):
        stats = {
            'total_students': User.objects.filter(
                role='student',
                is_active=True
            ).count(),
            'total_alumni': User.objects.filter(
                role='alumni',
                is_active=True
            ).count(),
            'verified_alumni': User.objects.filter(
                role='alumni',
                is_verified=True
            ).count(),
            'total_blogs': Blog.objects.filter(status='published').count(),
            'total_jobs': Job.objects.count(),
            'total_events': Event.objects.count(),
            'departments': User.objects.filter(
                role='student'
            ).values('department').annotate(
                count=Count('id')
            ),
        }
        return success_response(data=stats)
    
    def _admin_stats(self, request):
        stats = {
            'total_users': User.objects.filter(is_active=True).count(),
            'total_students': User.objects.filter(
                role='student',
                is_active=True
            ).count(),
            'total_alumni': User.objects.filter(
                role='alumni',
                is_active=True
            ).count(),
            'pending_verifications': AlumniProfile.objects.filter(
                verification_status='pending'
            ).count(),
            'total_blogs': Blog.objects.count(),
            'total_jobs': Job.objects.count(),
            'total_events': Event.objects.count(),
            'recent_registrations': User.objects.filter(
                created_at__gte=timezone.now() - timedelta(days=30)
            ).count(),
        }
        return success_response(data=stats)


class DepartmentAnalyticsView(APIView):
    """Get department-wise analytics."""
    
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['read:analytics', 'read:institution_analytics']
    
    def get(self, request):
        # Students by department
        students_by_dept = User.objects.filter(
            role='student',
            is_active=True
        ).values('department').annotate(
            count=Count('id')
        )
        
        # Alumni by department
        alumni_by_dept = User.objects.filter(
            role='alumni',
            is_active=True,
            is_verified=True
        ).values('department').annotate(
            count=Count('id')
        )
        
        # Average CGPA by department
        cgpa_by_dept = StudentProfile.objects.values(
            'user__department'
        ).annotate(
            avg_cgpa=Avg('cgpa')
        )
        
        return success_response(data={
            'students_by_department': list(students_by_dept),
            'alumni_by_department': list(alumni_by_dept),
            'cgpa_by_department': list(cgpa_by_dept),
        })


class PlacementAnalyticsView(APIView):
    """Get placement analytics."""
    
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['read:analytics', 'read:institution_analytics']
    
    def get(self, request):
        # Jobs by type
        jobs_by_type = Job.objects.values('job_type').annotate(
            count=Count('id')
        )
        
        # Applications by status
        applications_by_status = JobApplication.objects.values(
            'status'
        ).annotate(
            count=Count('id')
        )
        
        # Top hiring companies
        top_companies = AlumniProfile.objects.exclude(
            current_company__isnull=True
        ).values('current_company').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        
        # Industry distribution
        industry_dist = AlumniProfile.objects.exclude(
            industry__isnull=True
        ).values('industry').annotate(
            count=Count('id')
        ).order_by('-count')
        
        return success_response(data={
            'jobs_by_type': list(jobs_by_type),
            'applications_by_status': list(applications_by_status),
            'top_companies': list(top_companies),
            'industry_distribution': list(industry_dist),
        })


class EngagementAnalyticsView(APIView):
    """Get engagement analytics."""
    
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['read:analytics', 'read:institution_analytics']
    
    def get(self, request):
        # Blog engagement
        blog_stats = {
            'total_blogs': Blog.objects.filter(status='published').count(),
            'total_views': sum(
                Blog.objects.filter(status='published').values_list('views_count', flat=True)
            ),
            'total_likes': sum(
                Blog.objects.filter(status='published').values_list('likes_count', flat=True)
            ),
        }
        
        # Event engagement
        event_stats = {
            'total_events': Event.objects.count(),
            'upcoming_events': Event.objects.filter(
                status='upcoming',
                start_datetime__gte=timezone.now()
            ).count(),
            'total_registrations': EventRegistration.objects.filter(
                status='registered'
            ).count(),
            'total_attendances': EventRegistration.objects.filter(
                status='attended'
            ).count(),
        }
        
        # Monthly registrations
        monthly_registrations = []
        for i in range(6):
            start_date = timezone.now() - timedelta(days=30 * (i + 1))
            end_date = timezone.now() - timedelta(days=30 * i)
            count = User.objects.filter(
                created_at__gte=start_date,
                created_at__lt=end_date
            ).count()
            monthly_registrations.append({
                'month': start_date.strftime('%B %Y'),
                'count': count
            })
        
        return success_response(data={
            'blog_engagement': blog_stats,
            'event_engagement': event_stats,
            'monthly_registrations': monthly_registrations[::-1],
        })
