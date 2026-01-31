"""
URL configuration for events app.
"""
from django.urls import path
from . import views

app_name = 'events'

urlpatterns = [
    path('', views.EventListCreateView.as_view(), name='event_list_create'),
    path('my/', views.MyEventsView.as_view(), name='my_events'),
    path('registrations/', views.MyRegistrationsView.as_view(), name='my_registrations'),
    path('<int:pk>/', views.EventDetailView.as_view(), name='event_detail'),
    path('<int:pk>/register/', views.EventRegisterView.as_view(), name='event_register'),
    path('<int:pk>/attendees/', views.EventAttendeesView.as_view(), name='event_attendees'),
    path('<int:pk>/attendance/<int:registration_id>/', views.MarkAttendanceView.as_view(), name='mark_attendance'),
]
