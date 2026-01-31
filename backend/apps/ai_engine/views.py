"""
Views for AI-powered features.
"""
from rest_framework.views import APIView
from rest_framework import permissions, status
from django.contrib.auth import get_user_model

from common.permissions import ScopePermission
from common.utils import success_response, error_response
from .recommendation_engine import CareerRecommendationEngine

User = get_user_model()


class CareerRecommendationView(APIView):
    """
    Get AI-powered career recommendations for a student.
    """
    
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['ai:recommendation', 'read:ai_reports']
    
    def get(self, request, student_id=None):
        # If no student_id provided, use current user
        if student_id is None:
            if request.user.role != 'student':
                return error_response(
                    'Only students can view their own recommendations',
                    status_code=status.HTTP_403_FORBIDDEN
                )
            student_id = request.user.id
        else:
            # Check if user has permission to view other's recommendations
            user_role = getattr(request, 'jwt_role', request.user.role)
            if user_role not in ['counsellor', 'admin'] and request.user.id != student_id:
                return error_response(
                    'Permission denied',
                    status_code=status.HTTP_403_FORBIDDEN
                )
        
        engine = CareerRecommendationEngine()
        
        # Get all recommendations
        mentor_recommendations = engine.recommend_alumni_mentors(student_id)
        job_recommendations = engine.recommend_jobs(student_id)
        career_paths = engine.recommend_career_paths(student_id)
        skill_analysis = engine.get_skill_gap_analysis(student_id)
        
        return success_response(data={
            'recommended_mentors': mentor_recommendations,
            'recommended_jobs': job_recommendations,
            'career_paths': career_paths,
            'skill_analysis': skill_analysis,
        })


class MentorRecommendationView(APIView):
    """Get alumni mentor recommendations."""
    
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['ai:recommendation']
    
    def get(self, request):
        if request.user.role != 'student':
            return error_response(
                'Only students can view mentor recommendations',
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        engine = CareerRecommendationEngine()
        limit = int(request.query_params.get('limit', 5))
        
        recommendations = engine.recommend_alumni_mentors(request.user.id, limit=limit)
        
        return success_response(data={
            'recommendations': recommendations
        })


class JobRecommendationView(APIView):
    """Get job recommendations."""
    
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['ai:recommendation']
    
    def get(self, request):
        if request.user.role != 'student':
            return error_response(
                'Only students can view job recommendations',
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        engine = CareerRecommendationEngine()
        limit = int(request.query_params.get('limit', 10))
        
        recommendations = engine.recommend_jobs(request.user.id, limit=limit)
        
        return success_response(data={
            'recommendations': recommendations
        })


class SkillGapAnalysisView(APIView):
    """Get skill gap analysis."""
    
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['ai:recommendation']
    
    def get(self, request):
        if request.user.role != 'student':
            return error_response(
                'Only students can view skill analysis',
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        engine = CareerRecommendationEngine()
        analysis = engine.get_skill_gap_analysis(request.user.id)
        
        return success_response(data=analysis)


class CareerPathsView(APIView):
    """Get career path recommendations."""
    
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['ai:recommendation']
    
    def get(self, request):
        if request.user.role != 'student':
            return error_response(
                'Only students can view career paths',
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        engine = CareerRecommendationEngine()
        paths = engine.recommend_career_paths(request.user.id)
        
        return success_response(data={
            'career_paths': paths
        })


class BatchCareerReportView(APIView):
    """
    Generate career report for a batch of students.
    For counsellors and admins.
    """
    
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['read:ai_reports']
    
    def get(self, request):
        from apps.accounts.models import StudentProfile
        from django.db.models import Count
        
        batch_year = request.query_params.get('batch_year')
        department = request.query_params.get('department')
        
        students = StudentProfile.objects.all()
        
        if batch_year:
            students = students.filter(batch_year=batch_year)
        if department:
            students = students.filter(user__department=department)
        
        # Aggregate skills
        all_skills = {}
        all_interests = {}
        
        for student in students:
            for skill in (student.skills or []):
                skill_lower = skill.lower()
                all_skills[skill_lower] = all_skills.get(skill_lower, 0) + 1
            
            for interest in (student.interests or []):
                interest_lower = interest.lower()
                all_interests[interest_lower] = all_interests.get(interest_lower, 0) + 1
        
        # Sort by frequency
        top_skills = sorted(
            all_skills.items(),
            key=lambda x: x[1],
            reverse=True
        )[:20]
        
        top_interests = sorted(
            all_interests.items(),
            key=lambda x: x[1],
            reverse=True
        )[:20]
        
        report = {
            'total_students': students.count(),
            'batch_year': batch_year,
            'department': department,
            'top_skills': [{'skill': s, 'count': c} for s, c in top_skills],
            'top_interests': [{'interest': i, 'count': c} for i, c in top_interests],
        }
        
        return success_response(data=report)
