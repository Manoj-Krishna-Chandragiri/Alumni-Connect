"""
URL Configuration for Alumni Connect backend.
All routes are now in the api app with mongoengine models.
"""
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static


def health_check(request):
    return JsonResponse({'status': 'ok'})


urlpatterns = [
    # Health check for Render
    path('health/', health_check),
    # All API endpoints
    path('api/', include('api.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
