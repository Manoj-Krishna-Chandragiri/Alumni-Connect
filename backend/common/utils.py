"""
Utility functions for Alumni Connect backend.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.utils.text import slugify as django_slugify


# Re-export Django's slugify for convenience
slugify = django_slugify


class Choices:
    """Constants for model choices."""
    
    ROLES = [
        ('student', 'Student'),
        ('alumni', 'Alumni'),
        ('counsellor', 'Counsellor'),
        ('hod', 'HOD'),
        ('principal', 'Principal'),
        ('admin', 'Admin'),
    ]
    
    DEPARTMENTS = [
        ('cse', 'Computer Science & Engineering'),
        ('ece', 'Electronics & Communication Engineering'),
        ('eee', 'Electrical & Electronics Engineering'),
        ('mech', 'Mechanical Engineering'),
        ('civil', 'Civil Engineering'),
        ('it', 'Information Technology'),
    ]
    
    VERIFICATION_STATUS = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]
    
    EVENT_TYPE = [
        ('workshop', 'Workshop'),
        ('seminar', 'Seminar'),
        ('webinar', 'Webinar'),
        ('conference', 'Conference'),
        ('meetup', 'Meetup'),
        ('networking', 'Networking'),
        ('other', 'Other'),
    ]
    
    EVENT_STATUS = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    BLOG_STATUS = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    
    JOB_TYPE = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
        ('freelance', 'Freelance'),
    ]
    
    JOB_STATUS = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('filled', 'Filled'),
    ]


def custom_exception_handler(exc, context):
    """Custom exception handler for consistent error responses."""
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response = {
            'success': False,
            'error': {
                'status_code': response.status_code,
                'message': str(exc),
                'details': response.data
            }
        }
        response.data = custom_response
    
    return response


def success_response(data=None, message="Success", status_code=status.HTTP_200_OK):
    """Create a standardized success response."""
    return Response({
        'success': True,
        'message': message,
        'data': data
    }, status=status_code)


def error_response(message="Error", details=None, status_code=status.HTTP_400_BAD_REQUEST):
    """Create a standardized error response."""
    return Response({
        'success': False,
        'error': {
            'message': message,
            'details': details
        }
    }, status=status_code)


def paginate_results(queryset, page=1, page_size=20):
    """Paginate mongoengine queryset."""
    total = queryset.count()
    start = (page - 1) * page_size
    end = start + page_size
    
    items = list(queryset[start:end])
    
    return {
        'results': items,
        'count': total,
        'page': page,
        'page_size': page_size,
        'total_pages': (total + page_size - 1) // page_size
    }
