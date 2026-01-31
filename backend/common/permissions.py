"""
Custom permissions for Role-based and Scope-based access control.
"""
from rest_framework import permissions


class IsAuthenticated(permissions.BasePermission):
    """Check if user is authenticated."""
    
    def has_permission(self, request, view):
        return request.user is not None


class RolePermission(permissions.BasePermission):
    """Permission class for role-based access control."""
    
    allowed_roles = []
    
    def has_permission(self, request, view):
        if not request.user:
            return False
        
        # Get allowed roles from view if not set
        allowed_roles = getattr(view, 'allowed_roles', self.allowed_roles)
        
        user_role = getattr(request, 'user_role', None) or getattr(request.user, 'role', None)
        
        if not user_role:
            return False
        
        return user_role in allowed_roles


class ScopePermission(permissions.BasePermission):
    """Permission class for scope-based access control."""
    
    required_scope = None
    
    def has_permission(self, request, view):
        if not request.user:
            return False
        
        # Get required scope from view if not set
        required_scope = getattr(view, 'required_scope', self.required_scope)
        
        if not required_scope:
            return True
        
        user_scopes = getattr(request, 'user_scopes', [])
        
        if isinstance(required_scope, list):
            return any(scope in user_scopes for scope in required_scope)
        
        return required_scope in user_scopes


def require_scope(scope):
    """Factory to create scope permission class."""
    class ScopeRequired(ScopePermission):
        required_scope = scope
    return ScopeRequired


def require_role(*roles):
    """Factory to create role permission class."""
    class RoleRequired(RolePermission):
        allowed_roles = list(roles)
    return RoleRequired


# Pre-defined permission classes
class IsStudent(RolePermission):
    allowed_roles = ['student']


class IsAlumni(RolePermission):
    allowed_roles = ['alumni']


class IsCounsellor(RolePermission):
    allowed_roles = ['counsellor']


class IsHOD(RolePermission):
    allowed_roles = ['hod']


class IsPrincipal(RolePermission):
    allowed_roles = ['principal']


class IsAdmin(RolePermission):
    allowed_roles = ['admin']


class IsStaff(RolePermission):
    allowed_roles = ['counsellor', 'hod', 'principal', 'admin']


class CanReadBlogs(ScopePermission):
    required_scope = 'read:blogs'


class CanCreateBlogs(ScopePermission):
    required_scope = 'create:blogs'


class CanReadJobs(ScopePermission):
    required_scope = 'read:jobs'


class CanCreateJobs(ScopePermission):
    required_scope = 'create:jobs'


class CanReadEvents(ScopePermission):
    required_scope = 'read:events'


class CanCreateEvents(ScopePermission):
    required_scope = 'create:events'


class CanReadStudents(ScopePermission):
    required_scope = ['read:students', 'read:department_students']


class CanReadAlumni(ScopePermission):
    required_scope = ['read:alumni', 'read:department_alumni']


class CanVerifyAlumni(ScopePermission):
    required_scope = 'verify:alumni'
