"""
API Views for Alumni Connect backend.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.conf import settings
from datetime import datetime

from common.models import (
    User, StudentProfile, AlumniProfile, Blog, Job, Event,
    BlogComment, BlogLike, JobApplication, EventRegistration
)
from common.jwt_auth import generate_tokens, refresh_access_token, decode_token
from common.permissions import (
    IsAuthenticated, IsAdmin, IsAlumni, IsStudent,
    CanReadBlogs, CanCreateBlogs, CanReadJobs, CanCreateJobs,
    CanReadEvents, CanCreateEvents, CanReadStudents, CanReadAlumni,
    CanVerifyAlumni, ScopePermission
)
from common.utils import success_response, error_response, paginate_results


# ============== AUTH VIEWS ==============

class RegisterView(APIView):
    """User registration endpoint."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        data = request.data
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'role']
        for field in required_fields:
            if not data.get(field):
                return error_response(f'{field} is required')
        
        email = data['email'].lower().strip()
        role = data['role'].lower()
        
        # Validate role
        valid_roles = ['student', 'alumni']
        if role not in valid_roles:
            return error_response(f'Invalid role. Must be one of: {valid_roles}')
        
        # Check if user exists
        if User.objects(email=email).first():
            return error_response('User with this email already exists')
        
        # Create user
        user = User(
            email=email,
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=role
        )
        user.set_password(data['password'])
        user.save()
        
        # Create profile based on role
        if role == 'student':
            StudentProfile(
                user=user,
                department=data.get('department', ''),
                year=data.get('year'),
                roll_no=data.get('roll_no', '')
            ).save()
        elif role == 'alumni':
            AlumniProfile(
                user=user,
                department=data.get('department', ''),
                graduation_year=data.get('graduation_year')
            ).save()
        
        # Generate tokens
        tokens = generate_tokens(user)
        
        return success_response(
            data={
                'user': user.to_dict(),
                'tokens': tokens
            },
            message='Registration successful',
            status_code=status.HTTP_201_CREATED
        )


class LoginView(APIView):
    """User login endpoint."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get('email', '').lower().strip()
        password = request.data.get('password', '')
        
        if not email or not password:
            return error_response('Email and password are required')
        
        # Find user
        user = User.objects(email=email).first()
        
        if not user:
            return error_response('Invalid credentials', status_code=status.HTTP_401_UNAUTHORIZED)
        
        if not user.check_password(password):
            return error_response('Invalid credentials', status_code=status.HTTP_401_UNAUTHORIZED)
        
        if not user.is_active:
            return error_response('Account is deactivated', status_code=status.HTTP_401_UNAUTHORIZED)
        
        # Generate tokens
        tokens = generate_tokens(user)
        
        # Get user profile
        profile = None
        if user.role == 'student':
            student_profile = StudentProfile.objects(user=user).first()
            if student_profile:
                profile = student_profile.to_dict()
        elif user.role == 'alumni':
            alumni_profile = AlumniProfile.objects(user=user).first()
            if alumni_profile:
                profile = alumni_profile.to_dict()
        
        return success_response(
            data={
                'user': user.to_dict(),
                'profile': profile,
                'tokens': tokens
            },
            message='Login successful'
        )


class RefreshTokenView(APIView):
    """Refresh access token endpoint."""
    permission_classes = [AllowAny]
    
    def post(self, request):
        refresh_token = request.data.get('refresh')
        
        if not refresh_token:
            return error_response('Refresh token is required')
        
        try:
            tokens = refresh_access_token(refresh_token)
            return success_response(data={'tokens': tokens})
        except Exception as e:
            return error_response(str(e), status_code=status.HTTP_401_UNAUTHORIZED)


class MeView(APIView):
    """Get current user profile."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Get profile based on role
        profile = None
        if user.role == 'student':
            student_profile = StudentProfile.objects(user=user).first()
            if student_profile:
                profile = student_profile.to_dict()
        elif user.role == 'alumni':
            alumni_profile = AlumniProfile.objects(user=user).first()
            if alumni_profile:
                profile = alumni_profile.to_dict()
        
        return success_response(
            data={
                'user': user.to_dict(),
                'profile': profile,
                'scopes': getattr(request, 'user_scopes', [])
            }
        )


# ============== STUDENT VIEWS ==============

class StudentProfileView(APIView):
    """Student profile endpoint."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'student':
            return error_response('Not a student', status_code=status.HTTP_403_FORBIDDEN)
        
        profile = StudentProfile.objects(user=request.user).first()
        if not profile:
            return error_response('Profile not found', status_code=status.HTTP_404_NOT_FOUND)
        
        return success_response(data=profile.to_dict())
    
    def put(self, request):
        if request.user.role != 'student':
            return error_response('Not a student', status_code=status.HTTP_403_FORBIDDEN)
        
        profile = StudentProfile.objects(user=request.user).first()
        if not profile:
            profile = StudentProfile(user=request.user)
        
        # Update fields
        updateable_fields = [
            'department', 'year', 'cgpa', 'phone', 'address', 'city', 'state',
            'skills', 'certifications', 'career_interest', 'linkedin', 'github', 'bio'
        ]
        
        for field in updateable_fields:
            if field in request.data:
                setattr(profile, field, request.data[field])
        
        profile.updated_at = datetime.utcnow()
        profile.save()
        
        return success_response(data=profile.to_dict(), message='Profile updated')


class StudentListView(APIView):
    """List students - for staff."""
    permission_classes = [IsAuthenticated, CanReadStudents]
    
    def get(self, request):
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        department = request.GET.get('department')
        year = request.GET.get('year')
        
        queryset = StudentProfile.objects.all()
        
        if department:
            queryset = queryset.filter(department__icontains=department)
        if year:
            queryset = queryset.filter(year=int(year))
        
        result = paginate_results(queryset, page, page_size)
        result['results'] = [p.to_dict() for p in result['results']]
        
        return success_response(data=result)


# ============== ALUMNI VIEWS ==============

class AlumniListView(APIView):
    """List alumni."""
    permission_classes = [IsAuthenticated, CanReadAlumni]
    
    def get(self, request):
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        department = request.GET.get('department')
        graduation_year = request.GET.get('graduation_year')
        verified = request.GET.get('verified')
        
        queryset = AlumniProfile.objects.all()
        
        if department:
            queryset = queryset.filter(department__icontains=department)
        if graduation_year:
            queryset = queryset.filter(graduation_year=int(graduation_year))
        if verified:
            queryset = queryset.filter(is_verified=(verified.lower() == 'true'))
        
        result = paginate_results(queryset, page, page_size)
        result['results'] = [p.to_dict() for p in result['results']]
        
        return success_response(data=result)


class AlumniDetailView(APIView):
    """Get alumni details."""
    permission_classes = [IsAuthenticated, CanReadAlumni]
    
    def get(self, request, alumni_id):
        profile = AlumniProfile.objects(id=alumni_id).first()
        if not profile:
            return error_response('Alumni not found', status_code=status.HTTP_404_NOT_FOUND)
        
        return success_response(data=profile.to_dict())


class AlumniProfileView(APIView):
    """Alumni own profile endpoint."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'alumni':
            return error_response('Not an alumni', status_code=status.HTTP_403_FORBIDDEN)
        
        profile = AlumniProfile.objects(user=request.user).first()
        if not profile:
            return error_response('Profile not found', status_code=status.HTTP_404_NOT_FOUND)
        
        return success_response(data=profile.to_dict())
    
    def put(self, request):
        if request.user.role != 'alumni':
            return error_response('Not an alumni', status_code=status.HTTP_403_FORBIDDEN)
        
        profile = AlumniProfile.objects(user=request.user).first()
        if not profile:
            profile = AlumniProfile(user=request.user)
        
        # Update fields
        updateable_fields = [
            'graduation_year', 'department', 'phone', 'current_company', 'current_position',
            'location', 'skills', 'industries', 'linkedin', 'github', 'website', 'bio', 'about'
        ]
        
        for field in updateable_fields:
            if field in request.data:
                setattr(profile, field, request.data[field])
        
        profile.updated_at = datetime.utcnow()
        profile.save()
        
        return success_response(data=profile.to_dict(), message='Profile updated')


class VerifyAlumniView(APIView):
    """Admin verify alumni."""
    permission_classes = [IsAuthenticated, CanVerifyAlumni]
    
    def post(self, request, alumni_id):
        profile = AlumniProfile.objects(id=alumni_id).first()
        if not profile:
            return error_response('Alumni not found', status_code=status.HTTP_404_NOT_FOUND)
        
        action = request.data.get('action', 'verify')  # verify or reject
        
        if action == 'verify':
            profile.is_verified = True
            profile.verified_at = datetime.utcnow()
            profile.verified_by = request.user
            profile.save()
            
            # Update user
            profile.user.is_verified = True
            profile.user.save()
            
            return success_response(message='Alumni verified successfully')
        else:
            profile.is_verified = False
            profile.save()
            return success_response(message='Alumni verification rejected')


# ============== BLOG VIEWS ==============

class BlogListView(APIView):
    """List and create blogs."""
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated(), CanReadBlogs()]
        return [IsAuthenticated(), CanCreateBlogs()]
    
    def get(self, request):
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        category = request.GET.get('category')
        
        queryset = Blog.objects(is_published=True)
        
        if category:
            queryset = queryset.filter(category=category)
        
        result = paginate_results(queryset, page, page_size)
        result['results'] = [b.to_dict() for b in result['results']]
        
        return success_response(data=result)
    
    def post(self, request):
        if request.user.role != 'alumni':
            return error_response('Only alumni can create blogs', status_code=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        
        if not data.get('title') or not data.get('content'):
            return error_response('Title and content are required')
        
        blog = Blog(
            author=request.user,
            title=data['title'],
            content=data['content'],
            excerpt=data.get('excerpt', data['content'][:200]),
            category=data.get('category', ''),
            tags=data.get('tags', [])
        )
        blog.save()
        
        return success_response(
            data=blog.to_dict(),
            message='Blog created successfully',
            status_code=status.HTTP_201_CREATED
        )


class BlogDetailView(APIView):
    """Get, update, delete blog."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, blog_id):
        blog = Blog.objects(id=blog_id).first()
        if not blog:
            return error_response('Blog not found', status_code=status.HTTP_404_NOT_FOUND)
        
        # Increment views
        blog.views_count += 1
        blog.save()
        
        return success_response(data=blog.to_dict())
    
    def put(self, request, blog_id):
        blog = Blog.objects(id=blog_id).first()
        if not blog:
            return error_response('Blog not found', status_code=status.HTTP_404_NOT_FOUND)
        
        # Check ownership
        if str(blog.author.uid) != str(request.user.uid):
            return error_response('Not authorized', status_code=status.HTTP_403_FORBIDDEN)
        
        # Update fields
        for field in ['title', 'content', 'excerpt', 'category', 'tags', 'is_published']:
            if field in request.data:
                setattr(blog, field, request.data[field])
        
        blog.updated_at = datetime.utcnow()
        blog.save()
        
        return success_response(data=blog.to_dict(), message='Blog updated')
    
    def delete(self, request, blog_id):
        blog = Blog.objects(id=blog_id).first()
        if not blog:
            return error_response('Blog not found', status_code=status.HTTP_404_NOT_FOUND)
        
        # Check ownership or admin
        if str(blog.author.uid) != str(request.user.uid) and request.user.role != 'admin':
            return error_response('Not authorized', status_code=status.HTTP_403_FORBIDDEN)
        
        blog.delete()
        return success_response(message='Blog deleted')


# ============== JOB VIEWS ==============

class JobListView(APIView):
    """List and create jobs."""
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated(), CanReadJobs()]
        return [IsAuthenticated(), CanCreateJobs()]
    
    def get(self, request):
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        job_type = request.GET.get('type')
        
        queryset = Job.objects(is_active=True)
        
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        
        result = paginate_results(queryset, page, page_size)
        result['results'] = [j.to_dict() for j in result['results']]
        
        return success_response(data=result)
    
    def post(self, request):
        if request.user.role != 'alumni':
            return error_response('Only alumni can post jobs', status_code=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        
        if not data.get('title') or not data.get('company') or not data.get('description'):
            return error_response('Title, company and description are required')
        
        job = Job(
            posted_by=request.user,
            title=data['title'],
            company=data['company'],
            location=data.get('location', ''),
            job_type=data.get('type', 'full-time'),
            description=data['description'],
            requirements=data.get('requirements', []),
            skills=data.get('skills', []),
            salary_min=data.get('salary_min'),
            salary_max=data.get('salary_max'),
            application_link=data.get('application_link', '')
        )
        
        if data.get('deadline'):
            job.deadline = datetime.fromisoformat(data['deadline'].replace('Z', '+00:00'))
        
        job.save()
        
        return success_response(
            data=job.to_dict(),
            message='Job posted successfully',
            status_code=status.HTTP_201_CREATED
        )


class JobDetailView(APIView):
    """Get job details."""
    permission_classes = [IsAuthenticated, CanReadJobs]
    
    def get(self, request, job_id):
        job = Job.objects(id=job_id).first()
        if not job:
            return error_response('Job not found', status_code=status.HTTP_404_NOT_FOUND)
        
        job.views_count += 1
        job.save()
        
        return success_response(data=job.to_dict())


# ============== EVENT VIEWS ==============

class EventListView(APIView):
    """List and create events."""
    
    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAuthenticated(), CanReadEvents()]
        return [IsAuthenticated(), CanCreateEvents()]
    
    def get(self, request):
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        event_type = request.GET.get('type')
        upcoming = request.GET.get('upcoming')
        
        queryset = Event.objects(is_active=True)
        
        if event_type:
            queryset = queryset.filter(event_type=event_type)
        if upcoming and upcoming.lower() == 'true':
            queryset = queryset.filter(event_date__gte=datetime.utcnow())
        
        result = paginate_results(queryset, page, page_size)
        result['results'] = [e.to_dict() for e in result['results']]
        
        return success_response(data=result)
    
    def post(self, request):
        if request.user.role != 'admin':
            return error_response('Only admin can create events', status_code=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        
        if not data.get('title') or not data.get('description') or not data.get('event_date'):
            return error_response('Title, description and event_date are required')
        
        event = Event(
            created_by=request.user,
            title=data['title'],
            description=data['description'],
            event_date=datetime.fromisoformat(data['event_date'].replace('Z', '+00:00')),
            location=data.get('location', ''),
            event_type=data.get('type', 'other'),
            registration_link=data.get('registration_link', ''),
            max_participants=data.get('max_participants')
        )
        
        if data.get('end_date'):
            event.end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00'))
        
        event.save()
        
        return success_response(
            data=event.to_dict(),
            message='Event created successfully',
            status_code=status.HTTP_201_CREATED
        )


class EventDetailView(APIView):
    """Get event details."""
    permission_classes = [IsAuthenticated, CanReadEvents]
    
    def get(self, request, event_id):
        event = Event.objects(id=event_id).first()
        if not event:
            return error_response('Event not found', status_code=status.HTTP_404_NOT_FOUND)
        
        return success_response(data=event.to_dict())


# ============== AI ENGINE VIEWS ==============

class CareerRecommendationView(APIView):
    """AI Career Recommendation endpoint."""
    permission_classes = [IsAuthenticated]
    required_scope = 'ai:recommendation'
    
    def get(self, request, student_id=None):
        # If student_id not provided, use current user
        if student_id:
            student_profile = StudentProfile.objects(id=student_id).first()
        else:
            if request.user.role != 'student':
                return error_response('Not a student', status_code=status.HTTP_403_FORBIDDEN)
            student_profile = StudentProfile.objects(user=request.user).first()
        
        if not student_profile:
            return error_response('Student profile not found', status_code=status.HTTP_404_NOT_FOUND)
        
        # Get student skills
        student_skills = set(s.lower() for s in (student_profile.skills or []))
        student_certifications = set(c.lower() for c in (student_profile.certifications or []))
        
        # Get all verified alumni
        alumni_profiles = AlumniProfile.objects(is_verified=True)
        
        recommendations = []
        
        for alumni in alumni_profiles:
            alumni_skills = set(s.lower() for s in (alumni.skills or []))
            
            if not alumni_skills:
                continue
            
            # Calculate skill match
            common_skills = student_skills.intersection(alumni_skills)
            if student_skills:
                match_score = len(common_skills) / len(student_skills) * 100
            else:
                match_score = 0
            
            if match_score > 30:  # Only include if >30% match
                recommendations.append({
                    'alumni': alumni.to_dict(),
                    'match_score': round(match_score, 1),
                    'common_skills': list(common_skills),
                    'career_domain': alumni.current_position or 'Unknown',
                    'company': alumni.current_company or 'Unknown'
                })
        
        # Sort by match score
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        
        # Get top 5
        top_recommendations = recommendations[:5]
        
        # Career domains analysis
        career_domains = {}
        for rec in recommendations:
            domain = rec['career_domain']
            if domain not in career_domains:
                career_domains[domain] = {'count': 0, 'total_score': 0}
            career_domains[domain]['count'] += 1
            career_domains[domain]['total_score'] += rec['match_score']
        
        suggested_domains = sorted(
            [{'domain': k, 'avg_score': v['total_score']/v['count'], 'alumni_count': v['count']}
             for k, v in career_domains.items()],
            key=lambda x: x['avg_score'],
            reverse=True
        )[:3]
        
        return success_response(data={
            'student': student_profile.to_dict(),
            'recommended_mentors': top_recommendations,
            'suggested_career_domains': suggested_domains,
            'skill_analysis': {
                'current_skills': list(student_skills),
                'certifications': list(student_certifications),
                'skill_count': len(student_skills)
            }
        })


# ============== ANALYTICS VIEWS ==============

class DashboardStatsView(APIView):
    """Dashboard statistics."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        role = request.user.role
        
        stats = {
            'total_alumni': AlumniProfile.objects.count(),
            'verified_alumni': AlumniProfile.objects(is_verified=True).count(),
            'total_students': StudentProfile.objects.count(),
            'total_blogs': Blog.objects(is_published=True).count(),
            'total_jobs': Job.objects(is_active=True).count(),
            'total_events': Event.objects(is_active=True).count(),
        }
        
        if role == 'admin':
            stats['pending_verifications'] = AlumniProfile.objects(is_verified=False).count()
            stats['total_users'] = User.objects.count()
        
        return success_response(data=stats)
