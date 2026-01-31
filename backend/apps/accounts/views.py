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

from common.permissions import RolePermission, ScopePermission, IsSameUserOrAdmin
from common.utils import success_response, error_response
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserRegistrationSerializer,
    UserWithProfileSerializer,
    PasswordChangeSerializer,
    AlumniVerificationSerializer,
    StudentProfileSerializer,
    AlumniProfileSerializer,
)
from .models import StudentProfile, AlumniProfile

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """Register new user."""
    
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
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
            message='Registration successful',
            status_code=status.HTTP_201_CREATED
        )


class LoginView(TokenObtainPairView):
    """Custom login view with role and scopes."""
    
    serializer_class = CustomTokenObtainPairSerializer


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
            return success_response(data=serializer.data)
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
            serializer = StudentProfileSerializer(
                profile,
                data=request.data,
                partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return success_response(
                data=serializer.data,
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
            return success_response(data=serializer.data)
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
            serializer = AlumniProfileSerializer(
                profile,
                data=request.data,
                partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return success_response(
                data=serializer.data,
                message='Profile updated successfully'
            )
        except AlumniProfile.DoesNotExist:
            return error_response(
                'Alumni profile not found',
                status_code=status.HTTP_404_NOT_FOUND
            )
