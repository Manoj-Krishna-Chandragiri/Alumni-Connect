"""
JWT Scope Middleware for extracting and validating JWT scopes.
"""
import jwt
from django.conf import settings
from django.http import JsonResponse


class JWTScopeMiddleware:
    """
    Middleware to extract scopes from JWT token and attach to request.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Extract token from Authorization header
        auth_header = request.headers.get('Authorization', '')
        
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            try:
                # Decode token without verification (verification done by DRF)
                payload = jwt.decode(
                    token,
                    settings.SIMPLE_JWT['SIGNING_KEY'],
                    algorithms=[settings.SIMPLE_JWT['ALGORITHM']]
                )
                
                # Attach scopes to request
                request.jwt_scopes = payload.get('scopes', [])
                request.jwt_role = payload.get('role', '')
                request.jwt_user_id = payload.get('user_id', '')
                
            except jwt.ExpiredSignatureError:
                request.jwt_scopes = []
                request.jwt_role = ''
            except jwt.InvalidTokenError:
                request.jwt_scopes = []
                request.jwt_role = ''
        else:
            request.jwt_scopes = []
            request.jwt_role = ''
        
        response = self.get_response(request)
        return response
