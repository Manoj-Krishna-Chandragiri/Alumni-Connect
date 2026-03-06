"""
Views for authentication and user management.
"""
from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.utils import timezone
import threading

from common.permissions import RolePermission, ScopePermission, IsSameUserOrAdmin
from common.utils import success_response, error_response
from common.roll_number_utils import validate_roll_number, parse_roll_number
from common.email_service import EmailNotificationService
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserRegistrationSerializer,
    UserWithProfileSerializer,
    PasswordChangeSerializer,
    AlumniVerificationSerializer,
    StudentProfileSerializer,
    AlumniProfileSerializer,
    OTPVerificationSerializer,
    OTPResendSerializer,
)
from .models import StudentProfile, AlumniProfile, EmailOTP

User = get_user_model()


def send_otp_email_async(user, otp_code):
    """Send OTP email in background thread to avoid blocking request."""
    def _send_email():
        try:
            EmailNotificationService.send_otp_email(user, otp_code)
            print(f"✅ OTP email sent successfully to {user.email}")
        except Exception as e:
            print(f"❌ Failed to send OTP email to {user.email}: {str(e)}")
    
    thread = threading.Thread(target=_send_email)
    thread.daemon = True
    thread.start()


class RegisterView(generics.CreateAPIView):
    """Register new user with OTP email verification."""
    
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        # Debug logging
        print(f"Registration request data: {request.data}")
        
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            print(f"Validation errors: {serializer.errors}")
        
        serializer.is_valid(raise_exception=True)
        
        # Create user (will be inactive until OTP verification)
        user = serializer.save()
        
        # User is created as inactive by default
        user.is_active = False
        user.save()
        
        # Generate and send OTP
        otp = EmailOTP.create_otp(user, purpose='signup', expiry_minutes=5)
        
        # Send OTP email asynchronously (non-blocking)
        send_otp_email_async(user, otp.otp_code)
        
        return success_response(
            data={
                'email': user.email,
                'message': 'Registration successful! Please check your email for the OTP to verify your account.',
                'otp_expires_in_minutes': 5
            },
            message='Registration successful. OTP sent to email.',
            status_code=status.HTTP_201_CREATED
        )


class VerifyOTPView(APIView):
    """Verify OTP and activate user account."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        # Debug logging
        print(f"OTP verification request data: {request.data}")
        
        serializer = OTPVerificationSerializer(data=request.data)
        
        if not serializer.is_valid():
            print(f"OTP Validation errors: {serializer.errors}")
        
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        otp = serializer.validated_data['otp']
        
        # Mark OTP as verified
        otp.is_verified = True
        otp.verified_at = timezone.now()
        otp.save()
        
        # Activate user account in SQLite
        user.is_active = True
        user.is_verified = True
        user.save()
        
        # ========== SYNC VERIFICATION STATUS TO MONGODB ==========
        try:
            from common.models import User as MongoUser
            
            mongo_user = MongoUser.objects(email=user.email).first()
            if mongo_user:
                mongo_user.is_active = True
                mongo_user.is_verified = True
                mongo_user.save()
                print(f"✅ MongoDB sync: User verified - {user.email}")
            else:
                print(f"⚠️  MongoDB user not found for verification: {user.email}")
                
        except Exception as e:
            print(f"⚠️  MongoDB verification sync failed for {user.email}: {str(e)}")
            # Continue anyway - SQLite is the source of truth
        
        # Generate tokens for immediate login
        refresh = RefreshToken.for_user(user)
        refresh['role'] = user.role
        refresh['scopes'] = user.get_scopes()
        
        return success_response(
            data={
                'user': UserWithProfileSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            },
            message='Email verified successfully! You are now logged in.'
        )


class ResendOTPView(APIView):
    """Resend OTP to user's email."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = OTPResendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        user = User.objects.get(email=email)
        
        # Generate new OTP
        otp = EmailOTP.create_otp(user, purpose='signup', expiry_minutes=5)
        
        # Send OTP email asynchronously (non-blocking)
        send_otp_email_async(user, otp.otp_code)
        
        return success_response(
            data={
                'email': user.email,
                'message': 'A new OTP has been sent to your email.',
                'otp_expires_in_minutes': 5
            },
            message='OTP resent successfully.'
        )


class LoginView(TokenObtainPairView):
    """Custom login view with role and scopes."""
    
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        # Get the token response from serializer (already has user data)
        response = super().post(request, *args, **kwargs)
        data = response.data
        
        # Restructure to match frontend expectations: {tokens: {access, refresh}, user, profile}
        # The serializer already includes complete user data
        return Response({
            'tokens': {
                'access': data['access'],
                'refresh': data['refresh'],
            },
            'user': data['user'],
            'profile': None  # Profile data is included in user object
        }, status=response.status_code)


class LogoutView(APIView):
    """Logout view - blacklist refresh token."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return success_response(message='Logout successful')
        except Exception as e:
            return success_response(message='Logout successful')


class MeView(APIView):
    """Get current authenticated user details."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserWithProfileSerializer(request.user)
        return success_response(data=serializer.data)
    
    def patch(self, request):
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return success_response(
            data=UserWithProfileSerializer(request.user).data,
            message='Profile updated successfully'
        )


class ChangePasswordView(APIView):
    """Change user password."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        if not user.check_password(serializer.validated_data['old_password']):
            return error_response(
                'Current password is incorrect',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return success_response(message='Password changed successfully')


class UserListView(generics.ListAPIView):
    """List users - Admin only."""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, RolePermission]
    required_roles = ['admin']
    filterset_fields = ['role', 'department', 'is_active', 'is_verified']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'email', 'role']


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, delete user - Admin only."""
    
    queryset = User.objects.all()
    serializer_class = UserWithProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsSameUserOrAdmin]
    
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = False
        user.save()
        return success_response(message='User deactivated successfully')


class AlumniVerificationView(APIView):
    """Verify or reject alumni - Admin only."""
    
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['verify:alumni']
    
    def post(self, request):
        serializer = AlumniVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            alumni_profile = AlumniProfile.objects.get(
                user_id=serializer.validated_data['alumni_id']
            )
        except AlumniProfile.DoesNotExist:
            return error_response(
                'Alumni not found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        action = serializer.validated_data['action']
        
        if action == 'verify':
            alumni_profile.verification_status = 'verified'
            alumni_profile.verified_at = timezone.now()
            alumni_profile.verified_by = request.user
            alumni_profile.user.is_verified = True
            alumni_profile.user.save()
            message = 'Alumni verified successfully'
        else:
            alumni_profile.verification_status = 'rejected'
            message = 'Alumni verification rejected'
        
        alumni_profile.save()
        
        return success_response(
            data=AlumniProfileSerializer(alumni_profile).data,
            message=message
        )


class StudentProfileView(APIView):
    """Get/Update student profile."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'student':
            return error_response(
                'Only students can access this endpoint',
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        try:
            profile = request.user.student_profile
            serializer = StudentProfileSerializer(profile)
            
            # Merge user data with profile data
            data = serializer.data
            data['firstName'] = request.user.first_name
            data['lastName'] = request.user.last_name
            data['email'] = request.user.email
            data['phone'] = request.user.phone
            data['department'] = request.user.department
            
            # Field name mapping (snake_case to camelCase)
            top_level_mapping = {
                'roll_number': 'rollNumber',
                'batch_year': 'batchYear',
                'graduation_year': 'graduationYear',
                'current_year': 'currentYear',
                'current_semester': 'currentSemester',
                'profile_picture': 'profilePicture',
                'social_profiles': 'socialProfiles',
                'created_at': 'createdAt',
                'updated_at': 'updatedAt',
            }
            
            # Nested field mappings
            nested_mapping = {
                'start_date': 'startDate',
                'end_date': 'endDate',
                'is_current': 'isCurrent',
            }
            
            def convert_field_names(obj):
                """Recursively convert snake_case keys to camelCase"""
                if isinstance(obj, dict):
                    converted = {}
                    for key, value in obj.items():
                        # Try top-level mapping first, then nested mapping
                        new_key = top_level_mapping.get(key, nested_mapping.get(key, key))
                        converted[new_key] = convert_field_names(value)
                    return converted
                elif isinstance(obj, list):
                    return [convert_field_names(item) for item in obj]
                else:
                    return obj
            
            # Convert field names
            converted_data = convert_field_names(data)
            
            return success_response(data=converted_data)
        except StudentProfile.DoesNotExist:
            return error_response(
                'Student profile not found',
                status_code=status.HTTP_404_NOT_FOUND
            )
    
    def patch(self, request):
        if request.user.role != 'student':
            return error_response(
                'Only students can access this endpoint',
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        try:
            profile = request.user.student_profile
            
            # Extract User model fields
            user_fields = {}
            if 'firstName' in request.data:
                user_fields['first_name'] = request.data.pop('firstName')
            if 'lastName' in request.data:
                user_fields['last_name'] = request.data.pop('lastName')
            if 'phone' in request.data:
                user_fields['phone'] = request.data.pop('phone')
            if 'email' in request.data:
                # Email might be read-only, skip it
                request.data.pop('email')
            
            # Update user fields
            if user_fields:
                for field, value in user_fields.items():
                    setattr(request.user, field, value)
                request.user.save()
            
            # Helper function to convert nested camelCase to snake_case
            def convert_to_snake_case(obj):
                """Recursively convert nested camelCase keys to snake_case"""
                nested_field_mapping = {
                    'startDate': 'start_date',
                    'endDate': 'end_date',
                    'isCurrent': 'is_current',
                }
                
                if isinstance(obj, dict):
                    converted = {}
                    for key, value in obj.items():
                        # Check if key needs conversion
                        new_key = nested_field_mapping.get(key, key)
                        converted[new_key] = convert_to_snake_case(value)
                    return converted
                elif isinstance(obj, list):
                    return [convert_to_snake_case(item) for item in obj]
                else:
                    return obj
            
            # Map frontend field names to backend (camelCase to snake_case)
            profile_data = {}
            field_mapping = {
                'rollNumber': 'roll_number',
                'currentYear': 'current_year',
                'currentSemester': 'current_semester',
                'profilePicture': 'profile_picture',
                'socialProfiles': 'social_profiles',
            }
            
            for key, value in request.data.items():
                backend_key = field_mapping.get(key, key)
                # Convert nested objects/arrays (like internships, skills, etc.) from camelCase to snake_case
                if backend_key in ['social_profiles', 'internships', 'certifications', 'placements']:
                    profile_data[backend_key] = convert_to_snake_case(value)
                else:
                    profile_data[backend_key] = value
            
            serializer = StudentProfileSerializer(
                profile,
                data=profile_data,
                partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            # Return merged data with camelCase field names
            response_data = serializer.data
            response_data['firstName'] = request.user.first_name
            response_data['lastName'] = request.user.last_name
            response_data['email'] = request.user.email
            response_data['phone'] = request.user.phone
            response_data['department'] = request.user.department
            
            # Field name mapping (snake_case to camelCase) for response
            top_level_mapping = {
                'roll_number': 'rollNumber',
                'batch_year': 'batchYear',
                'graduation_year': 'graduationYear',
                'current_year': 'currentYear',
                'current_semester': 'currentSemester',
                'profile_picture': 'profilePicture',
                'social_profiles': 'socialProfiles',
                'created_at': 'createdAt',
                'updated_at': 'updatedAt',
            }
            
            # Nested field mappings
            nested_mapping = {
                'start_date': 'startDate',
                'end_date': 'endDate',
                'is_current': 'isCurrent',
            }
            
            def convert_field_names(obj):
                """Recursively convert snake_case keys to camelCase for response"""
                if isinstance(obj, dict):
                    converted = {}
                    for key, value in obj.items():
                        # Try top-level mapping first, then nested mapping
                        new_key = top_level_mapping.get(key, nested_mapping.get(key, key))
                        converted[new_key] = convert_field_names(value)
                    return converted
                elif isinstance(obj, list):
                    return [convert_field_names(item) for item in obj]
                else:
                    return obj
            
            # Convert field names for response
            converted_response = convert_field_names(response_data)
            
            return success_response(
                data=converted_response,
                message='Profile updated successfully'
            )
        except StudentProfile.DoesNotExist:
            return error_response(
                'Student profile not found',
                status_code=status.HTTP_404_NOT_FOUND
            )


class AlumniProfileView(APIView):
    """Get/Update alumni profile."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'alumni':
            return error_response(
                'Only alumni can access this endpoint',
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        try:
            profile = request.user.alumni_profile
            serializer = AlumniProfileSerializer(profile)
            
            # Merge user data with profile data
            data = serializer.data
            data['firstName'] = request.user.first_name
            data['lastName'] = request.user.last_name
            data['email'] = request.user.email
            data['phone'] = request.user.phone
            data['department'] = request.user.department
            
            # Field name mapping (snake_case to camelCase) - TOP LEVEL ONLY
            field_mapping = {
                'roll_number': 'rollNumber',
                'graduation_year': 'graduationYear',
                'profile_picture': 'profilePicture',
                'current_company': 'currentCompany',
                'current_designation': 'currentDesignation',
                'current_location': 'currentLocation',
                'experience_years': 'experienceYears',
                'expertise_areas': 'expertiseAreas',
                'social_profiles': 'socialProfiles',
                'work_experience': 'workExperience',
                'verification_status': 'verificationStatus',
                'verification_document': 'verificationDocument',
                'verified_at': 'verifiedAt',
                'verified_by': 'verifiedBy',
                'available_for_mentoring': 'availableForMentoring',
                'available_for_referrals': 'availableForReferrals',
                'created_at': 'createdAt',
                'updated_at': 'updatedAt',
            }
            
            # Convert ONLY top-level field names, leave nested data as-is
            converted_data = {}
            for key, value in data.items():
                new_key = field_mapping.get(key, key)
                converted_data[new_key] = value
            
            # Debug logging
            import json
            if converted_data.get('workExperience'):
                print(f"\n=== RETRIEVING PROFILE ===")
                print(f"DB stored: {json.dumps(profile.work_experience, indent=2)}")
                print(f"Returning: {json.dumps(converted_data.get('workExperience'), indent=2)}")
                print(f"============================\n")
            
            return success_response(data=converted_data)
        except AlumniProfile.DoesNotExist:
            return error_response(
                'Alumni profile not found',
                status_code=status.HTTP_404_NOT_FOUND
            )
    
    def patch(self, request):
        if request.user.role != 'alumni':
            return error_response(
                'Only alumni can access this endpoint',
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        try:
            profile = request.user.alumni_profile
            
            # Make a mutable copy of request.data
            data = dict(request.data)
            
            # Extract User model fields
            user_fields = {}
            if 'firstName' in data:
                user_fields['first_name'] = data.pop('firstName')
            if 'lastName' in data:
                user_fields['last_name'] = data.pop('lastName')
            if 'phone' in data:
                user_fields['phone'] = data.pop('phone')
            if 'email' in data:
                # Email might be read-only, skip it
                data.pop('email')
            
            # Update user fields
            if user_fields:
                for field, value in user_fields.items():
                    setattr(request.user, field, value)
                request.user.save()
            
            # Map frontend field names to backend (camelCase to snake_case)
            # Store workExperience AS-IS without any nested conversions
            profile_data = {}
            field_mapping = {
                'rollNumber': 'roll_number',
                'graduationYear': 'graduation_year',
                'currentCompany': 'current_company',
                'currentDesignation': 'current_designation',
                'currentLocation': 'current_location',
                'experienceYears': 'experience_years',
                'expertiseAreas': 'expertise_areas',
                'profilePicture': 'profile_picture',
                'socialProfiles': 'social_profiles',
                'workExperience': 'work_experience',
                'yearsOfExperience': 'experience_years',
                'availableForMentoring': 'available_for_mentoring',
                'availableForReferrals': 'available_for_referrals',
            }
            
            for key, value in data.items():
                backend_key = field_mapping.get(key, key)
                # Store as-is without any nested conversions
                profile_data[backend_key] = value
            
            # Debug logging
            import json
            print(f"\n=== SAVING PROFILE ===")
            if 'workExperience' in data:
                print(f"Frontend sent: {json.dumps(data['workExperience'], indent=2)}")
                print(f"Storing in DB: {json.dumps(profile_data.get('work_experience'), indent=2)}")
            
            serializer = AlumniProfileSerializer(
                profile,
                data=profile_data,
                partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            # Debug logging after save
            print(f"\n=== AFTER SAVE ===")
            profile.refresh_from_db()
            print(f"Stored in DB: {json.dumps(profile.work_experience, indent=2)}")
            print(f"===================\n")
            
            # Return merged data with camelCase field names
            response_data = serializer.data
            response_data['firstName'] = request.user.first_name
            response_data['lastName'] = request.user.last_name
            response_data['email'] = request.user.email
            response_data['phone'] = request.user.phone
            response_data['department'] = request.user.department
            
            # Field name mapping (snake_case to camelCase) - TOP LEVEL ONLY
            field_mapping = {
                'roll_number': 'rollNumber',
                'graduation_year': 'graduationYear',
                'profile_picture': 'profilePicture',
                'current_company': 'currentCompany',
                'current_designation': 'currentDesignation',
                'current_location': 'currentLocation',
                'experience_years': 'experienceYears',
                'expertise_areas': 'expertiseAreas',
                'social_profiles': 'socialProfiles',
                'work_experience': 'workExperience',
                'verification_status': 'verificationStatus',
                'verification_document': 'verificationDocument',
                'verified_at': 'verifiedAt',
                'verified_by': 'verifiedBy',
                'available_for_mentoring': 'availableForMentoring',
                'available_for_referrals': 'availableForReferrals',
                'created_at': 'createdAt',
                'updated_at': 'updatedAt',
            }
            
            # Convert ONLY top-level field names, leave nested data UNCHANGED
            converted_response = {}
            for key, value in response_data.items():
                new_key = field_mapping.get(key, key)
                converted_response[new_key] = value
            
            print(f"\n=== RETURNING TO FRONTEND ===")
            print(f"workExperience: {json.dumps(converted_response.get('workExperience'), indent=2)}")
            print(f"==============================\n")
            
            return success_response(
                data=converted_response,
                message='Profile updated successfully'
            )
        except AlumniProfile.DoesNotExist:
            return error_response(
                'Alumni profile not found',
                status_code=status.HTTP_404_NOT_FOUND
            )


class ValidateRollNumberView(APIView):
    """Validate roll number format and return parsed information."""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        roll_number = request.data.get('roll_number', '').strip()
        
        if not roll_number:
            return error_response(
                'Roll number is required',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate roll number
        is_valid, error_message = validate_roll_number(roll_number)
        
        if not is_valid:
            return Response({
                'is_valid': False,
                'error': error_message
            }, status=status.HTTP_200_OK)
        
        # Parse roll number to get information
        roll_info = parse_roll_number(roll_number)
        
        # Check if roll number already exists
        existing_student = StudentProfile.objects.filter(roll_number=roll_number).first()
        existing_alumni = AlumniProfile.objects.filter(roll_number=roll_number).first()
        
        already_exists = existing_student is not None or existing_alumni is not None
        
        return success_response(
            data={
                'is_valid': True,
                'already_exists': already_exists,
                'info': roll_info
            }
        )


class CounsellorListView(APIView):
    """Get list of counsellors, optionally filtered by department."""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        department = request.query_params.get('department', None)
        
        # Filter counsellors by role
        counsellors = User.objects.filter(role='counsellor', is_active=True)
        
        # Apply department filter if provided (case-insensitive)
        if department:
            counsellors = counsellors.filter(department__iexact=department)
        
        # Serialize counsellor data
        data = []
        for counsellor in counsellors:
            data.append({
                'id': counsellor.id,
                'name': counsellor.full_name,
                'email': counsellor.email,
                'department': counsellor.department,
            })
        
        return success_response(
            data=data,
            message=f'Found {len(data)} counsellor(s)'
        )
