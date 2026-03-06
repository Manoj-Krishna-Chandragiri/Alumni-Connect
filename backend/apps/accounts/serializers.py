"""
Serializers for authentication and user management.
"""
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from django.conf import settings
from .models import StudentProfile, AlumniProfile, EmailOTP
from common.roll_number_utils import validate_roll_number, parse_roll_number

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
        # Our User model uses 'email' as USERNAME_FIELD, but frontend sends 'email'
        # SimpleJWT expects the field name to match User.USERNAME_FIELD
        
        # Validate email field is present
        email = attrs.get('email', '').strip().lower()
        password = attrs.get('password', '')
        
        if not email:
            raise serializers.ValidationError({
                'email': 'Email address is required.'
            })
        
        if not password:
            raise serializers.ValidationError({
                'password': 'Password is required.'
            })
        
        # Authenticate manually using Django's authenticate
        User = get_user_model()
        
        # Try to find user
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'detail': 'Invalid email or password. Please check your credentials and try again.'
            })
        
        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError({
                'detail': 'Invalid email or password. Please check your credentials and try again.'
            })
        
        # Check if verified (auto-verify @vvit.net seeded accounts)
        if not user.is_verified:
            if user.email.endswith('@vvit.net'):
                # Auto-verify @vvit.net accounts (seeded users)
                user.is_verified = True
                user.is_active = True
                user.save()
                print(f"✅ Auto-verified seeded account: {user.email}")
            else:
                raise serializers.ValidationError({
                    'detail': 'Your account is not verified. Please check your email for the verification code.',
                    'error_code': 'not_verified'
                })
        
        # Check if active
        if not user.is_active:
            raise serializers.ValidationError({
                'detail': 'Your account has been deactivated. Please contact the college administrator for assistance.',
                'error_code': 'account_deactivated'
            })
        
        # Check alumni verification status (pending admin approval)
        if user.role == 'alumni':
            try:
                alumni_profile = AlumniProfile.objects.get(user=user)
                if alumni_profile.verification_status == 'pending':
                    raise serializers.ValidationError({
                        'detail': 'Your alumni account is pending verification by the college administration. This process typically takes up to 24 hours. Please check back later.',
                        'error_code': 'alumni_pending_verification'
                    })
                elif alumni_profile.verification_status == 'rejected':
                    raise serializers.ValidationError({
                        'detail': 'Your alumni verification was not approved. Please contact the college administration for more details.',
                        'error_code': 'alumni_rejected'
                    })
            except AlumniProfile.DoesNotExist:
                pass
        
        # Manually set the user and generate tokens
        refresh = self.get_token(user)
        
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        
        # Store user for later use
        self.user = user
        
        # Get profile picture from student/alumni profile or user avatar
        avatar = user.avatar
        if not avatar and hasattr(user, 'student_profile'):
            avatar = user.student_profile.profile_picture
        elif not avatar and hasattr(user, 'alumni_profile'):
            avatar = user.alumni_profile.profile_picture
        
        # Add complete user info to response (camelCase for frontend)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'firstName': self.user.first_name,
            'lastName': self.user.last_name,
            'fullName': self.user.full_name,
            'phone': self.user.phone,
            'role': self.user.role,
            'department': self.user.department,
            'scopes': settings.ROLE_SCOPES.get(self.user.role, []),
            'isVerified': self.user.is_verified,
            'avatar': avatar,
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
    
    password = serializers.CharField(
        write_only=True, 
        min_length=8,
        error_messages={
            'required': 'Password is required.',
            'min_length': 'Password must be at least 8 characters long.',
            'blank': 'Password cannot be blank.'
        }
    )
    password_confirm = serializers.CharField(
        write_only=True,
        error_messages={
            'required': 'Please confirm your password.',
            'blank': 'Password confirmation cannot be blank.'
        }
    )
    
    # Optional profile fields based on role
    roll_number = serializers.CharField(
        required=False,
        error_messages={
            'blank': 'Roll number cannot be blank.',
            'invalid': 'Please enter a valid roll number.'
        }
    )
    batch_year = serializers.IntegerField(
        required=False,
        error_messages={
            'invalid': 'Batch year must be a valid number.'
        }
    )
    graduation_year = serializers.IntegerField(
        required=False,
        error_messages={
            'invalid': 'Graduation year must be a valid number.'
        }
    )
    assigned_counsellor = serializers.IntegerField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'password', 'password_confirm', 'first_name', 'last_name',
            'phone', 'role', 'department', 'roll_number', 'batch_year', 
            'graduation_year', 'assigned_counsellor'
        ]
    
    def validate(self, attrs):
        # Validate password match
        password = attrs.get('password', '')
        password_confirm = attrs.get('password_confirm', '')
        
        if password != password_confirm:
            raise serializers.ValidationError({
                'password_confirm': 'Passwords do not match. Please make sure both passwords are identical.'
            })
        
        # Additional password strength validation
        if len(password) < 8:
            raise serializers.ValidationError({
                'password': 'Password must be at least 8 characters long.'
            })
        
        if password.isdigit():
            raise serializers.ValidationError({
                'password': 'Password cannot contain only numbers. Please include letters or special characters.'
            })
        
        if password.lower() == password:
            # No uppercase - give a warning but allow (optional)
            pass  # Can be enforced if needed
        
        # Check if user already exists with this email
        email = attrs.get('email', '').lower()
        existing_user = User.objects.filter(email=email).first()
        
        if existing_user:
            # If user exists and is active/verified, don't allow re-registration
            if existing_user.is_active or existing_user.is_verified:
                raise serializers.ValidationError({
                    'email': 'An account with this email already exists. Please login instead.'
                })
            else:
                # User exists but never verified - delete old account to allow re-registration
                # Also delete associated OTPs and profiles
                from apps.accounts.models import EmailOTP, StudentProfile, AlumniProfile
                
                # Delete OTPs
                EmailOTP.objects.filter(user=existing_user).delete()
                
                # Delete profiles
                StudentProfile.objects.filter(user=existing_user).delete()
                AlumniProfile.objects.filter(user=existing_user).delete()
                
                # ========== DELETE FROM MONGODB TOO ==========
                try:
                    from common.models import User as MongoUser, StudentProfile as MongoStudentProfile, AlumniProfile as MongoAlumniProfile
                    
                    # Find and delete MongoDB user and profiles
                    mongo_user = MongoUser.objects(email=email).first()
                    if mongo_user:
                        # Delete MongoDB profiles
                        MongoStudentProfile.objects(user=mongo_user).delete()
                        MongoAlumniProfile.objects(user=mongo_user).delete()
                        
                        # Delete MongoDB user
                        mongo_user.delete()
                        print(f"✅ MongoDB sync: Deleted unverified user - {email}")
                except Exception as e:
                    print(f"⚠️  MongoDB cleanup failed for {email}: {str(e)}")
                
                # Delete SQLite user
                existing_user.delete()
        
        role = attrs.get('role', 'student')
        roll_number = attrs.get('roll_number')
        
        # Validate roll number format
        if roll_number:
            # Ensure roll number is uppercase
            roll_number_original = roll_number
            roll_number = roll_number.strip().upper()
            attrs['roll_number'] = roll_number  # Update with uppercase version
            
            is_valid, error_message = validate_roll_number(roll_number)
            if not is_valid:
                # Add hint about uppercase if user entered lowercase
                if roll_number_original != roll_number:
                    error_message = f"{error_message}. Note: Roll number should be in UPPERCASE (e.g., 22BQ1A4225)."
                raise serializers.ValidationError({
                    'roll_number': error_message
                })
            
            # Parse roll number to extract information
            roll_info = parse_roll_number(roll_number)
            if roll_info:
                # Auto-populate department from roll number if not provided
                if not attrs.get('department'):
                    attrs['department'] = roll_info['branch_short']
                
                # Auto-populate batch year from roll number if not provided
                if not attrs.get('batch_year') and role == 'student':
                    attrs['batch_year'] = int(roll_info['year'])
        
        if role == 'student':
            if not attrs.get('roll_number'):
                raise serializers.ValidationError({
                    'roll_number': 'Roll number is required for student registration. Format: YYBQXABC## (e.g., 22BQ1A4225)'
                })
            if not attrs.get('batch_year'):
                raise serializers.ValidationError({
                    'batch_year': 'Batch year is required for student registration.'
                })
        
        if role == 'alumni':
            if not attrs.get('graduation_year'):
                raise serializers.ValidationError({
                    'graduation_year': 'Graduation year is required for alumni registration.'
                })
            
            # Validate graduation year is in the past or current year
            from datetime import datetime
            current_year = datetime.now().year
            grad_year = attrs.get('graduation_year')
            if grad_year and grad_year > current_year:
                raise serializers.ValidationError({
                    'graduation_year': f'Graduation year cannot be in the future. Current year is {current_year}.'
                })
        
        # Validate assigned counsellor if provided
        if attrs.get('assigned_counsellor'):
            counsellor_id = attrs['assigned_counsellor']
            try:
                counsellor = User.objects.get(id=counsellor_id, role='counsellor', is_active=True)
            except User.DoesNotExist:
                raise serializers.ValidationError({
                    'assigned_counsellor': 'Invalid counsellor selected.'
                })
        
        return attrs
    
    def create(self, validated_data):
        # Extract profile data
        roll_number = validated_data.pop('roll_number', None)
        batch_year = validated_data.pop('batch_year', None)
        graduation_year = validated_data.pop('graduation_year', None)
        assigned_counsellor_id = validated_data.pop('assigned_counsellor', None)
        validated_data.pop('password_confirm', None)
        
        # Normalize email to lowercase for case-insensitive storage
        if 'email' in validated_data:
            validated_data['email'] = validated_data['email'].lower()
        
        # Create user in SQLite (Django ORM)
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        
        # Set assigned counsellor if provided
        if assigned_counsellor_id:
            try:
                counsellor = User.objects.get(id=assigned_counsellor_id, role='counsellor', is_active=True)
                user.assigned_counsellor = counsellor
            except User.DoesNotExist:
                pass
        
        user.save()  # Save to SQLite
        
        # ========== SYNC TO MONGODB ==========
        try:
            from common.models import User as MongoUser, StudentProfile as MongoStudentProfile, AlumniProfile as MongoAlumniProfile
            
            # Create MongoDB user
            mongo_user = MongoUser(
                email=user.email,
                first_name=user.first_name,
                last_name=user.last_name,
                role=user.role,
                department=user.department or '',
                is_active=user.is_active,
                is_verified=user.is_verified,
                avatar=user.avatar or ''
            )
            mongo_user.set_password(password)  # Hash password for MongoDB
            mongo_user.save()
            
            print(f"✅ MongoDB sync: User created - {user.email}")
            
        except Exception as e:
            print(f"⚠️  MongoDB sync failed for user {user.email}: {str(e)}")
            # Continue anyway - SQLite is the source of truth
        
        # Create profile based on role
        if user.role == 'student':
            # Check if profile with this roll number already exists
            if StudentProfile.objects.filter(roll_number=roll_number).exists():
                user.delete()  # Clean up the user we just created
                raise serializers.ValidationError({
                    'roll_number': f'A student with roll number {roll_number} is already registered. If this is your account, please login instead.'
                })
            
            # Create StudentProfile in SQLite
            student_profile = StudentProfile.objects.create(
                user=user,
                roll_number=roll_number,
                batch_year=batch_year,
                graduation_year=graduation_year or (batch_year + 4 if batch_year else None)
            )
            
            # ========== SYNC STUDENT PROFILE TO MONGODB ==========
            try:
                from common.models import StudentProfile as MongoStudentProfile
                
                # Find the MongoDB user we just created
                from common.models import User as MongoUser
                mongo_user = MongoUser.objects(email=user.email).first()
                
                if mongo_user:
                    # Create MongoDB StudentProfile
                    mongo_student_profile = MongoStudentProfile(
                        user=mongo_user,
                        roll_no=roll_number,
                        department=user.department or '',
                        phone=user.phone or '',
                        year=1,  # Default to 1st year
                        joined_year=batch_year,
                        completion_year=graduation_year or (batch_year + 4 if batch_year else None),
                        current_year=1,
                        current_semester=1,
                        skills=[],
                        certifications=[],
                        is_placed=False
                    )
                    mongo_student_profile.save()
                    
                    print(f"✅ MongoDB sync: StudentProfile created - {roll_number}")
                else:
                    print(f"⚠️  MongoDB user not found for {user.email}, skipping profile sync")
                    
            except Exception as e:
                print(f"⚠️  MongoDB StudentProfile sync failed for {roll_number}: {str(e)}")
                # Continue anyway - SQLite is the source of truth
                
        elif user.role == 'alumni':
            # Create AlumniProfile in SQLite
            alumni_profile = AlumniProfile.objects.create(
                user=user,
                graduation_year=graduation_year,
                roll_number=roll_number
            )
            
            # ========== SYNC ALUMNI PROFILE TO MONGODB ==========
            try:
                from common.models import AlumniProfile as MongoAlumniProfile
                
                # Find the MongoDB user we just created
                from common.models import User as MongoUser
                mongo_user = MongoUser.objects(email=user.email).first()
                
                if mongo_user:
                    # Create MongoDB AlumniProfile
                    mongo_alumni_profile = MongoAlumniProfile(
                        user=mongo_user,
                        roll_no=roll_number or '',
                        department=user.department or '',
                        graduation_year=graduation_year,
                        phone=user.phone or '',
                        is_verified=False
                    )
                    mongo_alumni_profile.save()
                    
                    print(f"✅ MongoDB sync: AlumniProfile created - {user.email}")
                else:
                    print(f"⚠️  MongoDB user not found for {user.email}, skipping profile sync")
                    
            except Exception as e:
                print(f"⚠️  MongoDB AlumniProfile sync failed for {user.email}: {str(e)}")
                # Continue anyway - SQLite is the source of truth
        
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


# ========== OTP Serializers ==========

class OTPVerificationSerializer(serializers.Serializer):
    """Serializer for OTP verification."""
    
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': 'Email address is required.',
            'invalid': 'Please enter a valid email address.',
            'blank': 'Email address cannot be blank.'
        }
    )
    otp_code = serializers.CharField(
        required=True, 
        min_length=6, 
        max_length=6,
        error_messages={
            'required': 'OTP code is required.',
            'min_length': 'OTP code must be exactly 6 digits.',
            'max_length': 'OTP code must be exactly 6 digits.',
            'blank': 'OTP code cannot be blank.'
        }
    )
    
    def validate(self, attrs):
        email = attrs.get('email', '').lower()  # Normalize to lowercase
        otp_code = attrs.get('otp_code', '').strip()
        
        # Validate OTP code format
        if not otp_code.isdigit():
            raise serializers.ValidationError({
                'otp_code': 'OTP code must contain only numbers.'
            })
        
        # Check if user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({
                'email': 'No account found with this email address. Please check and try again.'
            })
        
        # Get latest unverified OTP
        otp = EmailOTP.objects.filter(
            user=user,
            otp_code=otp_code,
            purpose='signup',
            is_verified=False
        ).order_by('-created_at').first()
        
        if not otp:
            # Check if there's any OTP for this user (to give better error message)
            any_otp = EmailOTP.objects.filter(
                user=user,
                purpose='signup',
                is_verified=False
            ).order_by('-created_at').first()
            
            if any_otp:
                raise serializers.ValidationError({
                    'otp_code': 'Invalid OTP code. Please check the code sent to your email and try again.'
                })
            else:
                raise serializers.ValidationError({
                    'otp_code': 'No valid OTP found. Please click "Resend OTP" to get a new code.'
                })
        
        # Check if expired
        if otp.is_expired():
            raise serializers.ValidationError({
                'otp_code': 'This OTP code has expired. Please click "Resend OTP" to receive a new code.'
            })
        
        attrs['user'] = user
        attrs['otp'] = otp
        return attrs


class OTPResendSerializer(serializers.Serializer):
    """Serializer for resending OTP."""
    
    email = serializers.EmailField(
        required=True,
        error_messages={
            'required': 'Email address is required.',
            'invalid': 'Please enter a valid email address.',
            'blank': 'Email address cannot be blank.'
        }
    )
    
    def validate_email(self, value):
        # Normalize email to lowercase
        email = value.lower()
        try:
            user = User.objects.get(email=email)
            if user.is_active and user.is_verified:
                raise serializers.ValidationError(
                    'This account is already verified. Please login to access your account.'
                )
        except User.DoesNotExist:
            raise serializers.ValidationError(
                'No account found with this email address. Please register first.'
            )
        return email  # Return normalized email

