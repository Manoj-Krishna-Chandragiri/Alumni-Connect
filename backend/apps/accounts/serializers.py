"""
Serializers for authentication and user management.
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.conf import settings
from .models import StudentProfile, AlumniProfile

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT serializer that includes role and scopes in token.
    """
    
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['role'] = user.role
        token['scopes'] = settings.ROLE_SCOPES.get(user.role, [])
        token['email'] = user.email
        token['full_name'] = user.full_name
        
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user info to response
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': self.user.role,
            'scopes': settings.ROLE_SCOPES.get(self.user.role, []),
            'is_verified': self.user.is_verified,
            'avatar': self.user.avatar,
        }
        
        return data


class UserSerializer(serializers.ModelSerializer):
    """Basic user serializer."""
    
    full_name = serializers.ReadOnlyField()
    scopes = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'avatar', 'role', 'department', 'is_verified',
            'scopes', 'date_joined', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'email', 'role', 'date_joined', 'created_at', 'updated_at']
    
    def get_scopes(self, obj):
        return settings.ROLE_SCOPES.get(obj.role, [])


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    # Optional profile fields based on role
    roll_number = serializers.CharField(required=False)
    batch_year = serializers.IntegerField(required=False)
    graduation_year = serializers.IntegerField(required=False)
    
    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm', 'first_name', 'last_name',
            'phone', 'role', 'department', 'roll_number', 'batch_year', 'graduation_year'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match.'
            })
        
        role = attrs.get('role', 'student')
        
        if role == 'student':
            if not attrs.get('roll_number'):
                raise serializers.ValidationError({
                    'roll_number': 'Roll number is required for students.'
                })
            if not attrs.get('batch_year'):
                raise serializers.ValidationError({
                    'batch_year': 'Batch year is required for students.'
                })
        
        if role == 'alumni':
            if not attrs.get('graduation_year'):
                raise serializers.ValidationError({
                    'graduation_year': 'Graduation year is required for alumni.'
                })
        
        return attrs
    
    def create(self, validated_data):
        # Extract profile data
        roll_number = validated_data.pop('roll_number', None)
        batch_year = validated_data.pop('batch_year', None)
        graduation_year = validated_data.pop('graduation_year', None)
        validated_data.pop('password_confirm', None)
        
        # Create user
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create profile based on role
        if user.role == 'student':
            StudentProfile.objects.create(
                user=user,
                roll_number=roll_number,
                batch_year=batch_year,
                graduation_year=graduation_year or (batch_year + 4 if batch_year else None)
            )
        elif user.role == 'alumni':
            AlumniProfile.objects.create(
                user=user,
                graduation_year=graduation_year,
                roll_number=roll_number
            )
        
        return user


class StudentProfileSerializer(serializers.ModelSerializer):
    """Serializer for student profiles."""
    
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class AlumniProfileSerializer(serializers.ModelSerializer):
    """Serializer for alumni profiles."""
    
    user = UserSerializer(read_only=True)
    verified_by = UserSerializer(read_only=True)
    
    class Meta:
        model = AlumniProfile
        fields = '__all__'
        read_only_fields = [
            'user', 'verification_status', 'verified_at',
            'verified_by', 'created_at', 'updated_at'
        ]


class UserWithProfileSerializer(serializers.ModelSerializer):
    """Serializer that includes the appropriate profile based on role."""
    
    full_name = serializers.ReadOnlyField()
    scopes = serializers.SerializerMethodField()
    profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'avatar', 'role', 'department', 'is_verified',
            'scopes', 'profile', 'date_joined', 'created_at', 'updated_at'
        ]
    
    def get_scopes(self, obj):
        return settings.ROLE_SCOPES.get(obj.role, [])
    
    def get_profile(self, obj):
        if obj.role == 'student':
            try:
                profile = obj.student_profile
                return StudentProfileSerializer(profile).data
            except StudentProfile.DoesNotExist:
                return None
        elif obj.role == 'alumni':
            try:
                profile = obj.alumni_profile
                return AlumniProfileSerializer(profile).data
            except AlumniProfile.DoesNotExist:
                return None
        return None


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change."""
    
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': 'New passwords do not match.'
            })
        return attrs


class AlumniVerificationSerializer(serializers.Serializer):
    """Serializer for alumni verification by admin."""
    
    alumni_id = serializers.IntegerField()
    action = serializers.ChoiceField(choices=['verify', 'reject'])
    rejection_reason = serializers.CharField(required=False, allow_blank=True)
