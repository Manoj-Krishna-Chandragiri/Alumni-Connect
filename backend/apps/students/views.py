"""
Views for student-related operations.
"""
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from django.contrib.auth import get_user_model

from common.permissions import RolePermission, ScopePermission, DepartmentPermission, IsAuthenticated, IsAdmin
from common.utils import success_response, error_response
from apps.accounts.models import StudentProfile
from apps.accounts.serializers import StudentProfileSerializer, UserWithProfileSerializer

User = get_user_model()


class StudentListView(generics.ListAPIView):
    """
    List all students.
    - Counsellors can see all students
    - HODs can see students from their department
    - Admin can see all students
    """
    
    serializer_class = UserWithProfileSerializer
    permission_classes = [permissions.IsAuthenticated, ScopePermission, DepartmentPermission]
    required_scopes = ['read:students', 'read:department_students', 'manage:students']
    filterset_fields = ['department', 'is_active']
    search_fields = ['email', 'first_name', 'last_name']
    ordering_fields = ['created_at', 'first_name']
    
    def get_queryset(self):
        queryset = User.objects.filter(role='student', is_active=True)
        
        # HOD can only see their department
        user_role = getattr(self.request, 'jwt_role', self.request.user.role)
        if user_role == 'hod' and self.request.user.department:
            queryset = queryset.filter(department=self.request.user.department)
        
        # Filter by batch year if provided
        batch_year = self.request.query_params.get('batch_year')
        if batch_year:
            queryset = queryset.filter(
                student_profile__batch_year=batch_year
            )
        
        return queryset.select_related('student_profile')


class StudentDetailView(generics.RetrieveAPIView):
    """Get student details."""
    
    queryset = User.objects.filter(role='student')
    serializer_class = UserWithProfileSerializer
    permission_classes = [permissions.IsAuthenticated, ScopePermission, DepartmentPermission]
    required_scopes = ['read:students', 'read:department_students', 'manage:students']


class StudentStatsView(APIView):
    """Get student statistics."""
    
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['read:students', 'read:department_students', 'read:analytics']
    
    def get(self, request):
        from django.db.models import Count, Avg
        
        queryset = User.objects.filter(role='student', is_active=True)
        
        # HOD can only see their department
        user_role = getattr(request, 'jwt_role', request.user.role)
        if user_role == 'hod' and request.user.department:
            queryset = queryset.filter(department=request.user.department)
        
        # Department-wise distribution
        department_stats = queryset.values('department').annotate(
            count=Count('id')
        )
        
        # Batch-wise distribution
        batch_stats = StudentProfile.objects.filter(
            user__in=queryset
        ).values('batch_year').annotate(
            count=Count('id'),
            avg_cgpa=Avg('cgpa')
        )
        
        stats = {
            'total_students': queryset.count(),
            'by_department': list(department_stats),
            'by_batch': list(batch_stats),
        }
        
        return success_response(data=stats)


class AdminStudentToggleView(APIView):
    """Toggle a student's active/disabled status (admin only)."""
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request, pk):
        User = get_user_model()
        try:
            student_user = User.objects.get(pk=pk, role='student')
        except User.DoesNotExist:
            return error_response('Student not found', status.HTTP_404_NOT_FOUND)

        student_user.is_active = not student_user.is_active
        student_user.save(update_fields=['is_active'])

        # Try to sync to MongoDB user if it exists
        try:
            from common.models import User as MongoUser
            mongo_user = MongoUser.objects(email=student_user.email).first()
            if mongo_user:
                mongo_user.is_active = student_user.is_active
                mongo_user.save()
        except Exception:
            pass

        return success_response(
            data={'active': student_user.is_active},
            message=f"Student {'enabled' if student_user.is_active else 'disabled'} successfully"
        )
