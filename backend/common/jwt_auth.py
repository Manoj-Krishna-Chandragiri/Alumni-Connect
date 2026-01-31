"""
Custom JWT Authentication for mongoengine.
"""
import jwt
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework import authentication, exceptions
from common.models import User


def generate_tokens(user):
    """Generate access and refresh tokens for a user."""
    from django.conf import settings
    
    # Get scopes for user role
    scopes = settings.ROLE_SCOPES.get(user.role, [])
    
    # Access token payload
    access_payload = {
        'user_id': str(user.uid),
        'email': user.email,
        'role': user.role,
        'scopes': scopes,
        'type': 'access',
        'exp': datetime.utcnow() + settings.JWT_ACCESS_TOKEN_LIFETIME,
        'iat': datetime.utcnow(),
    }
    
    # Refresh token payload
    refresh_payload = {
        'user_id': str(user.uid),
        'type': 'refresh',
        'exp': datetime.utcnow() + settings.JWT_REFRESH_TOKEN_LIFETIME,
        'iat': datetime.utcnow(),
    }
    
    access_token = jwt.encode(
        access_payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    
    refresh_token = jwt.encode(
        refresh_payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return {
        'access': access_token,
        'refresh': refresh_token,
    }


def decode_token(token):
    """Decode and validate a JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise exceptions.AuthenticationFailed('Token has expired')
    except jwt.InvalidTokenError:
        raise exceptions.AuthenticationFailed('Invalid token')


def refresh_access_token(refresh_token):
    """Generate new access token from refresh token."""
    payload = decode_token(refresh_token)
    
    if payload.get('type') != 'refresh':
        raise exceptions.AuthenticationFailed('Invalid refresh token')
    
    user_id = payload.get('user_id')
    user = User.objects(uid=user_id).first()
    
    if not user:
        raise exceptions.AuthenticationFailed('User not found')
    
    if not user.is_active:
        raise exceptions.AuthenticationFailed('User is deactivated')
    
    return generate_tokens(user)


class JWTAuthentication(authentication.BaseAuthentication):
    """Custom JWT authentication for mongoengine users."""
    
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return None
        
        try:
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
        except ValueError:
            return None
        
        try:
            payload = decode_token(token)
        except exceptions.AuthenticationFailed:
            raise
        
        if payload.get('type') != 'access':
            raise exceptions.AuthenticationFailed('Invalid access token')
        
        user_id = payload.get('user_id')
        user = User.objects(uid=user_id).first()
        
        if not user:
            raise exceptions.AuthenticationFailed('User not found')
        
        if not user.is_active:
            raise exceptions.AuthenticationFailed('User is deactivated')
        
        # Attach scopes to request
        request.user_scopes = payload.get('scopes', [])
        request.user_role = payload.get('role')
        
        return (user, token)
    
    def authenticate_header(self, request):
        return 'Bearer'


class MongoUser:
    """Wrapper to make mongoengine User compatible with DRF."""
    
    def __init__(self, user):
        self._user = user
        self.is_authenticated = True
    
    def __getattr__(self, name):
        return getattr(self._user, name)
