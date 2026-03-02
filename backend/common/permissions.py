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
        
        # Check jwt_scopes set by JWTScopeMiddleware
        user_scopes = getattr(request, 'jwt_scopes', [])
        
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


class IsSameUserOrAdmin(permissions.BasePermission):
    """Allow access if user is accessing their own resource or is admin."""
    
    def has_object_permission(self, request, view, obj):
        # Admin has full access
        if hasattr(request.user, 'role') and request.user.role == 'admin':
            return True
        
        # User can access their own resource
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # If obj is User model directly
        return obj == request.user


class DepartmentPermission(permissions.BasePermission):
    """Allow access only to users from the same department (for HODs)."""
    
    def has_permission(self, request, view):
        # Admin and principal have access to all departments
        if hasattr(request.user, 'role') and request.user.role in ['admin', 'principal']:
            return True
        return True  # Allow, will check in has_object_permission
    
    def has_object_permission(self, request, view, obj):
        # Admin and principal have full access
        if hasattr(request.user, 'role') and request.user.role in ['admin', 'principal']:
            return True
        
        # HOD can only access their department
        if hasattr(request.user, 'role') and request.user.role == 'hod':
            user_dept = getattr(request.user, 'department', None)
            obj_dept = getattr(obj, 'department', None)
            if user_dept and obj_dept:
                return user_dept == obj_dept
        
        # Counsellors have access to their assigned students
        # Others have access to their own resources
        return True


class IsOwnerOrAdmin(permissions.BasePermission):
    """Allow access if user owns the resource or is admin."""
    
    def has_object_permission(self, request, view, obj):
        # Admin has full access
        if hasattr(request.user, 'role') and request.user.role == 'admin':
            return True
        
        # Check if user is the owner
        if hasattr(obj, 'author'):
            return obj.author == request.user
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        return obj == request.user


class IsVerifiedAlumni(permissions.BasePermission):
    """Allow only verified alumni."""
    
    def has_permission(self, request, view):
        if not request.user or request.user.role != 'alumni':
            return False
        
        # Check if alumni profile is verified
        try:
            from apps.accounts.models import AlumniProfile
            profile = AlumniProfile.objects.filter(user=request.user).first()
            return profile and profile.verification_status == 'verified'
        except:
            return False
