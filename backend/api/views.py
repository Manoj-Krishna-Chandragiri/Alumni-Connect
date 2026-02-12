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
from common.cloudinary_utils import upload_image


# ============== FILE UPLOAD VIEWS ==============

class ImageUploadView(APIView):
    """Image upload endpoint using Cloudinary."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Upload an image or video to Cloudinary."""
        if 'file' not in request.FILES:
            return error_response('No file provided', status.HTTP_400_BAD_REQUEST)
        
        file = request.FILES['file']
        folder = request.data.get('folder', 'alumni-connect/profiles')
        public_id = request.data.get('public_id', None)
        
        # Validate file type - allow both images and videos
        allowed_types = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
            'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
        ]
        if file.content_type not in allowed_types:
            return error_response('Invalid file type. Only images and videos are allowed.', status.HTTP_400_BAD_REQUEST)
        
        # Validate file size (max 50MB for videos, 5MB for images)
        is_video = file.content_type.startswith('video/')
        max_size = (50 * 1024 * 1024) if is_video else (5 * 1024 * 1024)
        if file.size > max_size:
            size_limit = '50MB' if is_video else '5MB'
            return error_response(f'File size must be less than {size_limit}', status.HTTP_400_BAD_REQUEST)
        
        # Upload to Cloudinary
        result = upload_image(file, folder=folder, public_id=public_id)
        
        if result.get('success'):
            return success_response({
                'url': result['url'],
                'public_id': result['public_id'],
                'width': result.get('width'),
                'height': result.get('height'),
                'format': result.get('format'),
            })
        else:
            return error_response(result.get('error', 'Failed to upload image'), status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            roll_no = data.get('roll_no', '')
            student_profile = StudentProfile(
                user=user,
                department=data.get('department', ''),
                year=data.get('year'),
                roll_no=roll_no
            )
            
            # Auto-calculate completion year and joining year from roll number
            if roll_no:
                from common.roll_number_utils import calculate_passout_year, parse_roll_number
                completion_year = calculate_passout_year(roll_no)
                info = parse_roll_number(roll_no)
                if completion_year:
                    student_profile.completion_year = completion_year
                if info:
                    student_profile.joined_year = int(info['year'])
            
            student_profile.save()
            
        elif role == 'alumni':
            roll_no = data.get('roll_no', '')
            graduation_year = data.get('graduation_year')
            
            # Auto-calculate graduation year from roll number if not provided
            if not graduation_year and roll_no:
                from common.roll_number_utils import calculate_passout_year
                graduation_year = calculate_passout_year(roll_no)
            
            AlumniProfile(
                user=user,
                department=data.get('department', ''),
                graduation_year=graduation_year,
                roll_no=roll_no
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
        
        # Get user profile and format it for frontend (camelCase)
        profile = None
        if user.role == 'student':
            student_profile = StudentProfile.objects(user=user).first()
            if student_profile:
                profile = {
                    'id': str(student_profile.id),
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'email': user.email,
                    'phone': student_profile.phone or '',
                    'rollNumber': student_profile.roll_no,
                    'rollNo': student_profile.roll_no,
                    'department': student_profile.department or '',
                    'profilePicture': user.avatar or None,
                    'currentYear': student_profile.current_year or student_profile.year or 1,
                    'currentSemester': student_profile.current_semester or 1,
                    'cgpa': str(student_profile.cgpa) if student_profile.cgpa else '',
                    'bio': student_profile.bio or '',
                }
        elif user.role == 'alumni':
            alumni_profile = AlumniProfile.objects(user=user).first()
            if alumni_profile:
                profile = {
                    'id': str(alumni_profile.id),
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'email': user.email,
                    'phone': alumni_profile.phone or '',
                    'rollNumber': alumni_profile.roll_no,
                    'rollNo': alumni_profile.roll_no,
                    'department': alumni_profile.department or '',
                    'profilePicture': user.avatar or None,
                    'graduationYear': alumni_profile.graduation_year,
                    'currentCompany': alumni_profile.current_company or '',
                    'currentPosition': alumni_profile.current_position or '',
                    'currentDesignation': alumni_profile.current_position or '',
                    'bio': alumni_profile.bio or '',
                }
        
        return success_response(
            data={
                'user': {
                    'id': str(user.uid),
                    'email': user.email,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'role': user.role,
                    'isActive': user.is_active,
                    'isVerified': user.is_verified,
                },
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


class RollNumberUtilsView(APIView):
    """
    Utility endpoint for roll number operations.
    
    Endpoints:
    - POST /validate: Validate roll number format
    - POST /parse: Parse and get info from roll number
    - POST /status: Get academic status (alumni or student)
    """
    permission_classes = [AllowAny]  # Can be accessed without authentication
    
    def post(self, request):
        from common.roll_number_utils import (
            validate_roll_number, parse_roll_number, 
            calculate_passout_year, get_passout_date,
            is_alumni, get_academic_status
        )
        
        action = request.data.get('action', 'status')  # validate, parse, or status
        roll_number = request.data.get('roll_number', '').strip().upper()
        
        if not roll_number:
            return error_response('Roll number is required', status.HTTP_400_BAD_REQUEST)
        
        # Validate action
        if action == 'validate':
            is_valid, error_msg = validate_roll_number(roll_number)
            return success_response(data={
                'valid': is_valid,
                'error': error_msg,
                'roll_number': roll_number
            })
        
        elif action == 'parse':
            info = parse_roll_number(roll_number)
            if not info:
                return error_response('Invalid roll number format', status.HTTP_400_BAD_REQUEST)
            return success_response(data=info)
        
        elif action == 'status':
            # Get full academic status
            status_info = get_academic_status(roll_number)
            if not status_info:
                return error_response('Invalid roll number format', status.HTTP_400_BAD_REQUEST)
            return success_response(data=status_info)
        
        else:
            return error_response(
                f'Invalid action. Must be one of: validate, parse, status',
                status.HTTP_400_BAD_REQUEST
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
        
        # Build response with proper camelCase keys for frontend
        data = {
            'id': str(profile.id),
            'firstName': request.user.first_name,
            'lastName': request.user.last_name,
            'email': request.user.email,
            'phone': profile.phone or '',
            'rollNumber': profile.roll_no,
            'department': profile.department or '',
            'profilePicture': request.user.avatar or None,
            'currentYear': profile.current_year or profile.year or 1,
            'currentSemester': profile.current_semester or 1,
            'cgpa': str(profile.cgpa) if profile.cgpa else '',
            'location': profile.address or '',
            'bio': profile.bio or '',
            'socialProfiles': {
                'linkedin': profile.linkedin or '',
                'github': profile.github or '',
                'twitter': '',
                'instagram': '',
                'facebook': '',
                'portfolio': profile.portfolio or '',
                'leetcode': '',
                'codechef': '',
            },
            'skills': [{'name': s, 'proficiency': 'intermediate'} for s in (profile.skills or [])],
            'certifications': [{'name': c, 'issuer': '', 'date': '', 'link': ''} for c in (profile.certifications or [])],
            'internships': [
                {
                    'company': i.company,
                    'role': i.role,
                    'startDate': '',
                    'endDate': '',
                    'description': i.description or '',
                    'isPaid': i.is_paid
                } for i in (profile.internships or [])
            ],
            'placements': [
                {
                    'company': p.company_name,
                    'role': p.role or '',
                    'package': p.package or '',
                    'offerDate': '',
                    'joiningDate': ''
                } for p in (profile.placement_offers or [])
            ],
        }
        
        # Add social_profiles if exists
        if profile.social_profiles:
            data['socialProfiles'].update({
                'linkedin': profile.social_profiles.linkedin or data['socialProfiles']['linkedin'],
                'github': profile.social_profiles.github or data['socialProfiles']['github'],
                'leetcode': profile.social_profiles.leetcode or '',
                'codechef': profile.social_profiles.codechef or '',
                'hackerrank': profile.social_profiles.hackerrank or '',
            })
        
        return success_response(data=data)
    
    def patch(self, request):
        return self.put(request)  # Reuse PUT logic for PATCH
    
    def put(self, request):
        if request.user.role != 'student':
            return error_response('Not a student', status_code=status.HTTP_403_FORBIDDEN)
        
        profile = StudentProfile.objects(user=request.user).first()
        if not profile:
            profile = StudentProfile(user=request.user)
        
        # Update User model fields
        if 'firstName' in request.data:
            request.user.first_name = request.data['firstName']
        if 'lastName' in request.data:
            request.user.last_name = request.data['lastName']
        if 'profilePicture' in request.data:
            request.user.avatar = request.data['profilePicture']
        if 'phone' in request.data:
            profile.phone = request.data['phone']
        request.user.updated_at = datetime.utcnow()
        request.user.save()
        
        # Map frontend camelCase to backend snake_case
        field_mapping = {
            'rollNumber': 'roll_no',
            'currentYear': 'current_year',
            'currentSemester': 'current_semester',
            'careerInterest': 'career_interest',
        }
        
        # Auto-calculate completion year and joining year from roll number if roll number is provided
        if 'rollNumber' in request.data and request.data['rollNumber']:
            from common.roll_number_utils import calculate_passout_year, parse_roll_number
            roll_no = request.data['rollNumber']
            completion_year = calculate_passout_year(roll_no)
            info = parse_roll_number(roll_no)
            if completion_year:
                profile.completion_year = completion_year
            if info:
                profile.joined_year = int(info['year'])
        
        # Update simple fields with proper type conversion
        simple_fields = [
            'department', 'address', 'city', 'state', 'bio'
        ]
        
        for field in simple_fields:
            if field in request.data:
                setattr(profile, field, request.data[field])
        
        # Handle numeric fields with type conversion
        if 'cgpa' in request.data:
            try:
                profile.cgpa = float(request.data['cgpa']) if request.data['cgpa'] else None
            except (ValueError, TypeError):
                profile.cgpa = None
        
        if 'year' in request.data:
            try:
                profile.year = int(request.data['year']) if request.data['year'] else None
            except (ValueError, TypeError):
                profile.year = None
        
        if 'joined_year' in request.data:
            try:
                profile.joined_year = int(request.data['joined_year']) if request.data['joined_year'] else None
            except (ValueError, TypeError):
                profile.joined_year = None
        
        if 'completion_year' in request.data:
            try:
                profile.completion_year = int(request.data['completion_year']) if request.data['completion_year'] else None
            except (ValueError, TypeError):
                profile.completion_year = None
        
        # Handle mapped fields with type conversion
        for frontend_field, backend_field in field_mapping.items():
            if frontend_field in request.data:
                value = request.data[frontend_field]
                # Convert numeric fields
                if backend_field in ['current_year', 'current_semester']:
                    try:
                        value = int(value) if value else None
                    except (ValueError, TypeError):
                        value = None
                setattr(profile, backend_field, value)
        
        # Handle social profiles (nested object -> dict)
        if 'socialProfiles' in request.data:
            social = request.data['socialProfiles']
            from common.models import SocialProfile
            profile.social_profiles = SocialProfile(
                linkedin=social.get('linkedin', ''),
                github=social.get('github', ''),
                leetcode=social.get('leetcode', ''),
                codechef=social.get('codechef', ''),
                hackerrank=social.get('hackerrank', ''),
                codeforces=social.get('codeforces', ''),
                medium=social.get('medium', ''),
                discord=social.get('discord', '')
            )
            # Also update legacy fields
            profile.linkedin = social.get('linkedin', '')
            profile.github = social.get('github', '')
        
        # Handle skills (array of objects -> array of strings)
        if 'skills' in request.data:
            skills_data = request.data['skills']
            if isinstance(skills_data, list) and len(skills_data) > 0:
                if isinstance(skills_data[0], dict):
                    # Frontend sends [{name, proficiency}] -> extract names
                    profile.skills = [s.get('name', '') for s in skills_data if s.get('name')]
                else:
                    # Already strings
                    profile.skills = skills_data
        
        # Handle certifications (array of objects -> array of strings or keep as objects)
        if 'certifications' in request.data:
            certs_data = request.data['certifications']
            if isinstance(certs_data, list):
                # Frontend sends [{name, issuer, date, link}]
                # For now, store as comma-separated string of names
                if len(certs_data) > 0 and isinstance(certs_data[0], dict):
                    profile.certifications = [c.get('name', '') for c in certs_data if c.get('name')]
                else:
                    profile.certifications = certs_data
        
        # Handle internships (array of objects)
        if 'internships' in request.data:
            from common.models import Internship
            internships_data = request.data['internships']
            if isinstance(internships_data, list):
                profile.internships = []
                for intern in internships_data:
                    if isinstance(intern, dict) and intern.get('company'):
                        profile.internships.append(Internship(
                            company=intern.get('company', ''),
                            role=intern.get('role', ''),
                            description=intern.get('description', ''),
                            is_paid=intern.get('isPaid', False)
                        ))
        
        # Handle placements (array of objects)
        if 'placements' in request.data:
            from common.models import Placement
            placements_data = request.data['placements']
            if isinstance(placements_data, list):
                profile.placement_offers = []
                for place in placements_data:
                    if isinstance(place, dict) and place.get('company'):
                        profile.placement_offers.append(Placement(
                            company_name=place.get('company', ''),
                            role=place.get('role', ''),
                            package=place.get('package', '')
                        ))
        
        profile.updated_at = datetime.utcnow()
        
        try:
            profile.save()
        except Exception as e:
            return error_response(
                f'Failed to save profile: {str(e)}',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Return merged data in camelCase format (same as GET)
        data = {
            'firstName': request.user.first_name,
            'lastName': request.user.last_name,
            'email': request.user.email,
            'phone': profile.phone or '',
            'rollNumber': profile.roll_no,
            'department': profile.department or '',
            'currentYear': profile.current_year or profile.year or 1,
            'currentSemester': profile.current_semester or 1,
            'cgpa': str(profile.cgpa) if profile.cgpa else '',
            'location': profile.address or '',
            'bio': profile.bio or '',
            'socialProfiles': request.data.get('socialProfiles', {}),
            'skills': request.data.get('skills', []),
            'certifications': request.data.get('certifications', []),
            'internships': request.data.get('internships', []),
            'placements': request.data.get('placements', []),
        }
        
        return success_response(data=data, message='Profile updated')


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
        
        # Build response with proper camelCase keys for frontend
        data = {
            'id': str(profile.id),
            'firstName': request.user.first_name,
            'lastName': request.user.last_name,
            'email': request.user.email,
            'phone': profile.phone or '',
            'rollNumber': profile.roll_no,
            'department': profile.department or '',
            'profilePicture': request.user.avatar or None,
            'graduationYear': profile.graduation_year,
            'currentCompany': profile.current_company or '',
            'currentDesignation': profile.current_position or '',
            'location': profile.location or '',
            'bio': profile.bio or '',
            'about': profile.about or '',
            'socialProfiles': {
                'linkedin': profile.linkedin or '',
                'github': profile.github or '',
                'twitter': '',
                'instagram': '',
                'facebook': '',
                'portfolio': profile.website or '',
            },
            'skills': [{'name': s, 'proficiency': 'intermediate'} for s in (profile.skills or [])],
            'expertiseAreas': profile.industries or [],
            'workExperience': [
                {
                    'company': w.company,
                    'role': w.title,
                    'location': w.location or '',
                    'startDate': w.start_date.isoformat() if w.start_date else '',
                    'endDate': w.end_date.isoformat() if w.end_date else '',
                    'current': w.current,
                    'description': w.description or ''
                } for w in (profile.work_experience or [])
            ],
            'availableForMentoring': profile.is_verified if hasattr(profile, 'is_verified') else False,
            'availableForReferrals': False,
        }
        
        # Add social_profiles if exists
        if profile.social_profiles:
            data['socialProfiles'].update({
                'linkedin': profile.social_profiles.linkedin or data['socialProfiles']['linkedin'],
                'github': profile.social_profiles.github or data['socialProfiles']['github'],
                'leetcode': profile.social_profiles.leetcode or '',
                'codechef': profile.social_profiles.codechef or '',
            })
        
        return success_response(data=data)
    
    def patch(self, request):
        return self.put(request)  # Reuse PUT logic for PATCH
    
    def put(self, request):
        if request.user.role != 'alumni':
            return error_response('Not an alumni', status_code=status.HTTP_403_FORBIDDEN)
        
        profile = AlumniProfile.objects(user=request.user).first()
        if not profile:
            profile = AlumniProfile(user=request.user)
        
        # Update User model fields
        if 'firstName' in request.data:
            request.user.first_name = request.data['firstName']
        if 'lastName' in request.data:
            request.user.last_name = request.data['lastName']
        if 'profilePicture' in request.data:
            request.user.avatar = request.data['profilePicture']
        if 'phone' in request.data:
            profile.phone = request.data['phone']
        request.user.updated_at = datetime.utcnow()
        request.user.save()
        
        # Map frontend camelCase to backend snake_case
        field_mapping = {
            'rollNumber': 'roll_no',
            'graduationYear': 'graduation_year',
            'currentCompany': 'current_company',
            'currentPosition': 'current_position',
            'currentDesignation': 'current_position',
            'joinedYear': 'joined_year',
            'expertiseAreas': 'industries',
            'availableForMentoring': 'available_for_mentoring',
            'availableForReferrals': 'available_for_referrals',
        }
        
        # Auto-calculate graduation year from roll number if roll number is provided
        if 'rollNumber' in request.data and request.data['rollNumber']:
            from common.roll_number_utils import calculate_passout_year
            calculated_graduation_year = calculate_passout_year(request.data['rollNumber'])
            if calculated_graduation_year:
                profile.graduation_year = calculated_graduation_year
        
        # Update simple fields
        simple_fields = [
            'department', 'location', 'bio', 'about', 'website'
        ]
        
        for field in simple_fields:
            if field in request.data:
                setattr(profile, field, request.data[field])
        
        # Handle mapped fields with type conversion
        for frontend_field, backend_field in field_mapping.items():
            if frontend_field in request.data:
                value = request.data[frontend_field]
                # Skip graduation_year if already auto-calculated
                if backend_field == 'graduation_year' and 'rollNumber' in request.data:
                    continue
                # Convert numeric fields
                if backend_field in ['graduation_year', 'joined_year']:
                    try:
                        value = int(value) if value else None
                    except (ValueError, TypeError):
                        value = None
                setattr(profile, backend_field, value)
        
        # Handle social profiles
        if 'socialProfiles' in request.data:
            social = request.data['socialProfiles']
            from common.models import SocialProfile
            profile.social_profiles = SocialProfile(
                linkedin=social.get('linkedin', ''),
                github=social.get('github', ''),
                leetcode=social.get('leetcode', ''),
                codechef=social.get('codechef', ''),
                hackerrank=social.get('hackerrank', ''),
                codeforces=social.get('codeforces', ''),
                medium=social.get('medium', ''),
                discord=social.get('discord', '')
            )
            # Also update legacy fields
            profile.linkedin = social.get('linkedin', '')
            profile.github = social.get('github', '')
        
        # Handle skills (array of objects -> array of strings)
        if 'skills' in request.data:
            skills_data = request.data['skills']
            if isinstance(skills_data, list) and len(skills_data) > 0:
                if isinstance(skills_data[0], dict):
                    profile.skills = [s.get('name', '') for s in skills_data if s.get('name')]
                else:
                    profile.skills = skills_data
        
        # Handle work experience
        if 'workExperience' in request.data:
            from common.models import WorkExperience
            work_data = request.data['workExperience']
            if isinstance(work_data, list):
                profile.work_experience = []
                for work in work_data:
                    if isinstance(work, dict) and work.get('company'):
                        profile.work_experience.append(WorkExperience(
                            company=work.get('company', ''),
                            title=work.get('role', work.get('title', '')),
                            location=work.get('location', ''),
                            description=work.get('description', ''),
                            current=work.get('current', False)
                        ))
        
        profile.updated_at = datetime.utcnow()
        
        try:
            profile.save()
        except Exception as e:
            return error_response(
                f'Failed to save profile: {str(e)}',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Return merged data in camelCase format (same as GET)
        data = {
            'firstName': request.user.first_name,
            'lastName': request.user.last_name,
            'email': request.user.email,
            'phone': profile.phone or '',
            'rollNumber': profile.roll_no,
            'department': profile.department or '',
            'graduationYear': profile.graduation_year,
            'currentCompany': profile.current_company or '',
            'currentDesignation': profile.current_position or '',
            'location': profile.location or '',
            'bio': profile.bio or '',
            'about': profile.about or '',
            'socialProfiles': request.data.get('socialProfiles', {}),
            'skills': request.data.get('skills', []),
            'expertiseAreas': request.data.get('expertiseAreas', []),
            'workExperience': request.data.get('workExperience', []),
        }
        
        return success_response(data=data, message='Profile updated')


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
            tags=data.get('tags', []),
            cover_image=data.get('coverImage', '')
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
        
        # Check if current user has liked this blog
        is_liked = BlogLike.objects(blog=blog, user=request.user).first() is not None
        
        blog_dict = blog.to_dict()
        blog_dict['is_liked'] = is_liked
        
        return success_response(data=blog_dict)
    
    def put(self, request, blog_id):
        blog = Blog.objects(id=blog_id).first()
        if not blog:
            return error_response('Blog not found', status_code=status.HTTP_404_NOT_FOUND)
        
        # Check ownership - compare MongoEngine document IDs
        if str(blog.author.id) != str(request.user.id):
            return error_response('Not authorized', status_code=status.HTTP_403_FORBIDDEN)
        
        # Update fields
        for field in ['title', 'content', 'excerpt', 'category', 'tags', 'is_published']:
            if field in request.data:
                setattr(blog, field, request.data[field])
        
        # Handle coverImage separately (camelCase to snake_case)
        if 'coverImage' in request.data:
            blog.cover_image = request.data['coverImage']
        
        blog.updated_at = datetime.utcnow()
        blog.save()
        
        return success_response(data=blog.to_dict(), message='Blog updated')
    
    def delete(self, request, blog_id):
        blog = Blog.objects(id=blog_id).first()
        if not blog:
            return error_response('Blog not found', status_code=status.HTTP_404_NOT_FOUND)
        
        # Check ownership or admin - use MongoEngine document ID
        if str(blog.author.id) != str(request.user.id) and request.user.role != 'admin':
            return error_response('Not authorized', status_code=status.HTTP_403_FORBIDDEN)
        
        blog.delete()
        return success_response(message='Blog deleted')


class BlogShareView(APIView):
    """Share blog endpoint."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, blog_id):
        blog = Blog.objects(id=blog_id).first()
        if not blog:
            return error_response('Blog not found', status_code=status.HTTP_404_NOT_FOUND)
        
        # Increment shares count
        blog.shares_count += 1
        blog.save()
        
        return success_response(
            data={'shares_count': blog.shares_count},
            message='Blog shared successfully'
        )


class BlogLikeView(APIView):
    """Like/Unlike blog."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, blog_id):
        blog = Blog.objects(id=blog_id).first()
        if not blog:
            return error_response('Blog not found', status_code=status.HTTP_404_NOT_FOUND)
        
        # Check if already liked
        existing_like = BlogLike.objects(blog=blog, user=request.user).first()
        
        if existing_like:
            # Unlike
            existing_like.delete()
            blog.likes_count = max(0, blog.likes_count - 1)
            blog.save()
            return success_response(data={'liked': False, 'likes_count': blog.likes_count}, message='Blog unliked')
        else:
            # Like
            BlogLike(blog=blog, user=request.user).save()
            blog.likes_count += 1
            blog.save()
            return success_response(data={'liked': True, 'likes_count': blog.likes_count}, message='Blog liked')


class BlogCommentView(APIView):
    """Get comments or add comment to blog."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, blog_id):
        blog = Blog.objects(id=blog_id).first()
        if not blog:
            return error_response('Blog not found', status_code=status.HTTP_404_NOT_FOUND)
        
        comments = BlogComment.objects(blog=blog).order_by('-created_at')
        comments_data = []
        for comment in comments:
            comments_data.append({
                'id': str(comment.id),
                'author': comment.author.to_dict() if comment.author else None,
                'content': comment.content,
                'created_at': comment.created_at.isoformat() if comment.created_at else None,
            })
        
        return success_response(data=comments_data)
    
    def post(self, request, blog_id):
        blog = Blog.objects(id=blog_id).first()
        if not blog:
            return error_response('Blog not found', status_code=status.HTTP_404_NOT_FOUND)
        
        content = request.data.get('content', '').strip()
        if not content:
            return error_response('Comment content is required')
        
        comment = BlogComment(
            blog=blog,
            author=request.user,
            content=content
        )
        comment.save()
        
        # Update comment count
        blog.comments_count += 1
        blog.save()
        
        return success_response(
            data={
                'id': str(comment.id),
                'author': request.user.to_dict(),
                'content': content,
                'created_at': comment.created_at.isoformat(),
            },
            message='Comment added',
            status_code=status.HTTP_201_CREATED
        )


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
        
        # Handle requirements field (string or array)
        requirements = data.get('requirements', [])
        if isinstance(requirements, str):
            requirements = [req.strip() for req in requirements.split('\n') if req.strip()]
        
        # Handle skills field (string or array)
        skills = data.get('skills', [])
        if isinstance(skills, str):
            skills = [s.strip() for s in skills.split(',') if s.strip()]
        elif not isinstance(skills, list):
            skills = []
        
        job = Job(
            posted_by=request.user,
            title=data['title'],
            company=data['company'],
            location=data.get('location', ''),
            job_type=data.get('type', data.get('job_type', 'full-time')).lower(),
            cover_image=data.get('coverImage', data.get('cover_image', '')),
            description=data['description'],
            requirements=requirements,
            skills=skills,
            salary_min=data.get('salary_min'),
            salary_max=data.get('salary_max'),
            application_link=data.get('applicationLink', data.get('application_link', ''))
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
    """Get, update, and delete job details."""
    permission_classes = [IsAuthenticated, CanReadJobs]
    
    def get(self, request, job_id):
        job = Job.objects(id=job_id).first()
        if not job:
            return error_response('Job not found', status_code=status.HTTP_404_NOT_FOUND)
        
        job.views_count += 1
        job.save()
        
        # Check if user has saved this job
        from common.models import JobSave
        is_saved = JobSave.objects(job=job, user=request.user).first() is not None
        
        job_data = job.to_dict()
        job_data['isSaved'] = is_saved
        
        return success_response(data=job_data)
    
    def put(self, request, job_id):
        """Update job posting."""
        job = Job.objects(id=job_id).first()
        if not job:
            return error_response('Job not found', status_code=status.HTTP_404_NOT_FOUND)
        
        # Check if user is the owner or admin
        if request.user.role != 'admin' and str(job.posted_by.id) != str(request.user.id):
            return error_response('Permission denied', status_code=status.HTTP_403_FORBIDDEN)
        
        data = request.data
        
        # Update fields
        if data.get('title'):
            job.title = data['title']
        if data.get('company'):
            job.company = data['company']
        if 'location' in data:
            job.location = data['location']
        if data.get('type') or data.get('job_type'):
            job.job_type = (data.get('type') or data.get('job_type')).lower()
        if 'coverImage' in data or 'cover_image' in data:
            job.cover_image = data.get('coverImage', data.get('cover_image', ''))
        if 'description' in data:
            job.description = data['description']
        
        # Handle requirements (string or array)
        if 'requirements' in data:
            requirements = data['requirements']
            if isinstance(requirements, str):
                job.requirements = [req.strip() for req in requirements.split(',') if req.strip()]
            else:
                job.requirements = requirements
        
        # Handle skills (string or array)
        if 'skills' in data:
            skills = data['skills']
            if isinstance(skills, str):
                job.skills = [s.strip() for s in skills.split(',') if s.strip()]
            else:
                job.skills = skills
        
        # Handle salary
        if 'salary' in data:
            # Parse salary string like "20 LPA" or "10-20 LPA"
            salary_str = data['salary'].strip()
            # Extract numbers from salary string
            import re
            numbers = re.findall(r'\d+', salary_str)
            if len(numbers) >= 2:
                job.salary_min = int(numbers[0]) * 100000
                job.salary_max = int(numbers[1]) * 100000
            elif len(numbers) == 1:
                job.salary_min = int(numbers[0]) * 100000
                job.salary_max = int(numbers[0]) * 100000
        
        if 'salary_min' in data:
            job.salary_min = data['salary_min']
        if 'salary_max' in data:
            job.salary_max = data['salary_max']
        
        if 'experience' in data:
            # Store experience as a requirement or in description
            if data['experience'] and data['experience'] not in str(job.requirements):
                if not job.requirements:
                    job.requirements = []
                job.requirements.append(f"Experience: {data['experience']}")
        
        if 'applicationLink' in data or 'application_link' in data:
            job.application_link = data.get('applicationLink', data.get('application_link', ''))
        
        if data.get('deadline'):
            job.deadline = datetime.fromisoformat(data['deadline'].replace('Z', '+00:00'))
        
        job.updated_at = datetime.utcnow()
        job.save()
        
        return success_response(
            data=job.to_dict(),
            message='Job updated successfully'
        )


class JobSaveView(APIView):
    """Save or unsave a job."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, job_id):
        from common.models import JobSave
        
        job = Job.objects(id=job_id).first()
        if not job:
            return error_response('Job not found', status_code=status.HTTP_404_NOT_FOUND)
        
        # Check if already saved
        existing_save = JobSave.objects(job=job, user=request.user).first()
        
        if existing_save:
            # Unsave
            existing_save.delete()
            return success_response(message='Job unsaved', data={'isSaved': False})
        else:
            # Save
            job_save = JobSave(job=job, user=request.user)
            job_save.save()
            return success_response(message='Job saved', data={'isSaved': True})
    
    def get(self, request, job_id):
        """Check if job is saved."""
        from common.models import JobSave
        
        job = Job.objects(id=job_id).first()
        if not job:
            return error_response('Job not found', status_code=status.HTTP_404_NOT_FOUND)
        
        is_saved = JobSave.objects(job=job, user=request.user).first() is not None
        return success_response(data={'isSaved': is_saved})


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
            event_image=data.get('event_image', ''),
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
    """Get, update, delete event details."""
    permission_classes = [IsAuthenticated, CanReadEvents]
    
    def get(self, request, event_id):
        event = Event.objects(id=event_id).first()
        if not event:
            return error_response('Event not found', status_code=status.HTTP_404_NOT_FOUND)
        
        return success_response(data=event.to_dict())
    
    def put(self, request, event_id):
        if request.user.role != 'admin':
            return error_response('Only admin can update events', status_code=status.HTTP_403_FORBIDDEN)
        
        event = Event.objects(id=event_id).first()
        if not event:
            return error_response('Event not found', status_code=status.HTTP_404_NOT_FOUND)
        
        data = request.data
        
        # Update fields
        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'event_date' in data:
            event.event_date = datetime.fromisoformat(data['event_date'].replace('Z', '+00:00'))
        if 'end_date' in data:
            event.end_date = datetime.fromisoformat(data['end_date'].replace('Z', '+00:00')) if data['end_date'] else None
        if 'location' in data:
            event.location = data['location']
        if 'event_type' in data or 'type' in data:
            event.event_type = data.get('event_type') or data.get('type')
        if 'event_image' in data:
            event.event_image = data['event_image']
        if 'registration_link' in data:
            event.registration_link = data['registration_link']
        if 'max_participants' in data:
            event.max_participants = data['max_participants']
        
        event.updated_at = datetime.utcnow()
        event.save()
        
        return success_response(data=event.to_dict(), message='Event updated successfully')


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


# ============== COUNSELLOR VIEWS ==============

class CounsellorStatsView(APIView):
    """Dashboard statistics for counsellors."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Verify user is a counsellor
        if request.user.role != 'counsellor':
            return error_response('Access denied. Counsellors only.', status_code=status.HTTP_403_FORBIDDEN)
        
        # Count students assigned to this counsellor
        assigned_student_users = User.objects(assigned_counsellor=request.user, role='student')
        total_students = assigned_student_users.count()
        
        # Count alumni assigned to this counsellor
        assigned_alumni_users = User.objects(assigned_counsellor=request.user, role='alumni')
        total_alumni = assigned_alumni_users.count()
        
        # Count placed students
        placed_count = 0
        for user in assigned_student_users:
            profile = StudentProfile.objects(user=user).first()
            if profile and profile.is_placed:
                placed_count += 1
        
        # Calculate placement rate
        placement_rate = (placed_count / total_students * 100) if total_students > 0 else 0
        
        # Count verified alumni
        verified_alumni = 0
        for user in assigned_alumni_users:
            profile = AlumniProfile.objects(user=user).first()
            if profile and profile.is_verified:
                verified_alumni += 1
        
        stats = {
            'totalStudents': total_students,
            'totalAlumni': total_alumni,
            'placements': placed_count,
            'placementRate': round(placement_rate, 1),
            'verifiedAlumni': verified_alumni,
        }
        
        return success_response(data=stats)


class CounsellorInsightsView(APIView):
    """Counselling insights and analytics."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Verify user is a counsellor
        if request.user.role != 'counsellor':
            return error_response('Access denied. Counsellors only.', status_code=status.HTTP_403_FORBIDDEN)
        
        # Get students assigned to this counsellor
        assigned_student_users = User.objects(assigned_counsellor=request.user, role='student')
        
        # Aggregate data by department
        department_stats = {}
        year_stats = {}
        career_interests = {}
        
        for user in assigned_student_users:
            profile = StudentProfile.objects(user=user).first()
            if profile:
                # Department stats
                dept = profile.department
                if dept not in department_stats:
                    department_stats[dept] = 0
                department_stats[dept] += 1
                
                # Year stats
                year = profile.current_year or profile.year
                if year:
                    year_key = f'Year {year}'
                    if year_key not in year_stats:
                        year_stats[year_key] = 0
                    year_stats[year_key] += 1
                
                # Career interests
                if profile.career_interest:
                    interest = profile.career_interest
                    if interest not in career_interests:
                        career_interests[interest] = 0
                    career_interests[interest] += 1
        
        insights = {
            'departmentDistribution': department_stats,
            'yearDistribution': year_stats,
            'topCareerInterests': career_interests,
            'totalStudents': assigned_student_users.count(),
        }
        
        return success_response(data=insights)


class CounsellorStudentsView(APIView):
    """List students assigned to the logged-in counsellor."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Verify user is a counsellor
        if request.user.role != 'counsellor':
            return error_response('Access denied. Counsellors only.', status_code=status.HTTP_403_FORBIDDEN)
        
        # Get filter parameters
        department = request.GET.get('department')
        year = request.GET.get('year')
        cgpa_min = request.GET.get('cgpa_min')
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        
        # Find all students assigned to this counsellor
        assigned_student_users = User.objects(assigned_counsellor=request.user, role='student')
        
        # Get their student profiles
        students = []
        for user in assigned_student_users:
            profile = StudentProfile.objects(user=user).first()
            if profile:
                # Apply filters
                if department and profile.department != department:
                    continue
                if year and profile.current_year != int(year):
                    continue
                if cgpa_min and (not profile.cgpa or profile.cgpa < float(cgpa_min)):
                    continue
                
                # Build student data
                students.append({
                    'id': str(user.uid),
                    'name': user.full_name,
                    'firstName': user.first_name,
                    'lastName': user.last_name,
                    'email': user.email,
                    'rollNo': profile.roll_no,
                    'department': profile.department,
                    'year': profile.current_year or profile.year,
                    'cgpa': float(profile.cgpa) if profile.cgpa else None,
                    'phone': profile.phone,
                    'avatar': user.avatar,
                    'skills': profile.skills or [],
                    'careerInterest': profile.career_interest,
                    'bio': profile.bio,
                })
        
        # Manual pagination
        total = len(students)
        start = (page - 1) * page_size
        end = start + page_size
        paginated_students = students[start:end]
        
        result = {
            'results': paginated_students,
            'count': total,
            'page': page,
            'page_size': page_size,
            'total_pages': (total + page_size - 1) // page_size
        }
        
        return success_response(data=result)


class CounsellorStudentDetailView(APIView):
    """Get detailed information about a student assigned to the counsellor."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request, student_id):
        # Verify user is a counsellor
        if request.user.role != 'counsellor':
            return error_response('Access denied. Counsellors only.', status_code=status.HTTP_403_FORBIDDEN)
        
        # Find student by ID
        student_user = User.objects(uid=student_id, role='student').first()
        if not student_user:
            return error_response('Student not found', status_code=status.HTTP_404_NOT_FOUND)
        
        # Verify student is assigned to this counsellor
        if student_user.assigned_counsellor != request.user:
            return error_response('You are not assigned to this student', status_code=status.HTTP_403_FORBIDDEN)
        
        # Get student profile
        profile = StudentProfile.objects(user=student_user).first()
        if not profile:
            return error_response('Student profile not found', status_code=status.HTTP_404_NOT_FOUND)
        
        # Build detailed student data
        student_data = {
            'id': str(student_user.uid),
            'name': student_user.full_name,
            'firstName': student_user.first_name,
            'lastName': student_user.last_name,
            'email': student_user.email,
            'phone': profile.phone,
            'avatar': student_user.avatar,
            'rollNo': profile.roll_no,
            'department': profile.department,
            'year': profile.current_year or profile.year,
            'semester': profile.current_semester,
            'cgpa': float(profile.cgpa) if profile.cgpa else None,
            'joinedYear': profile.joined_year,
            'completionYear': profile.completion_year,
            'careerInterest': profile.career_interest,
            'bio': profile.bio,
            'skills': profile.skills or [],
            'certifications': profile.certifications or [],
            'internships': [
                {
                    'company': i.company,
                    'role': i.role,
                    'startDate': i.start_date.isoformat() if i.start_date else None,
                    'endDate': i.end_date.isoformat() if i.end_date else None,
                    'isPaid': i.is_paid,
                    'description': i.description,
                }
                for i in (profile.internships or [])
            ],
            'isPlaced': profile.is_placed,
            'placementOffers': [
                {
                    'companyName': p.company_name,
                    'role': p.role,
                    'package': p.package,
                }
                for p in (profile.placement_offers or [])
            ],
            'socialProfiles': {
                'linkedin': profile.linkedin,
                'github': profile.github,
                'portfolio': profile.portfolio,
            },
        }
        
        return success_response(data=student_data)


class CounsellorAlumniView(APIView):
    """List alumni assigned to the logged-in counsellor."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Verify user is a counsellor
        if request.user.role != 'counsellor':
            return error_response('Access denied. Counsellors only.', status_code=status.HTTP_403_FORBIDDEN)
        
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        
        # Find all alumni assigned to this counsellor
        assigned_alumni_users = User.objects(assigned_counsellor=request.user, role='alumni')
        
        # Get their alumni profiles
        alumni_list = []
        for user in assigned_alumni_users:
            profile = AlumniProfile.objects(user=user).first()
            if profile:
                alumni_list.append({
                    'id': str(user.uid),
                    'name': user.full_name,
                    'email': user.email,
                    'graduationYear': profile.graduation_year,
                    'department': profile.department,
                    'currentCompany': profile.current_company,
                    'currentPosition': profile.current_position,
                    'location': profile.location,
                    'avatar': user.avatar,
                })
        
        # Manual pagination
        total = len(alumni_list)
        start = (page - 1) * page_size
        end = start + page_size
        paginated_alumni = alumni_list[start:end]
        
        result = {
            'results': paginated_alumni,
            'count': total,
            'page': page,
            'page_size': page_size,
            'total_pages': (total + page_size - 1) // page_size
        }
        
        return success_response(data=result)
