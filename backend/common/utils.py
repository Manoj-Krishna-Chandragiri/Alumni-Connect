"""
Utility functions for Alumni Connect backend.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


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
