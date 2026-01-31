"""
Views for event operations.
"""
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from django.utils import timezone

from common.permissions import ScopePermission, IsOwnerOrAdmin
from common.utils import success_response, error_response
from .models import Event, EventRegistration
from .serializers import (
    EventSerializer,
    EventListSerializer,
    EventCreateSerializer,
    EventRegistrationSerializer,
    EventAttendeesSerializer,
)


class EventListCreateView(generics.ListCreateAPIView):
    """
    List all events / Create new event.
    - All authenticated users can see events
    - Only admin can create events
    """
    
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['event_type', 'status', 'is_online']
    search_fields = ['title', 'description', 'venue']
    ordering_fields = ['start_datetime', 'created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EventCreateSerializer
        return EventListSerializer
    
    def get_queryset(self):
        queryset = Event.objects.all()
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        else:
            # By default, don't show cancelled events
            queryset = queryset.exclude(status='cancelled')
        
        # Filter by target audience
        audience = self.request.query_params.get('audience')
        if audience:
            queryset = queryset.filter(target_audience__contains=[audience])
        
        # Upcoming events only
        upcoming = self.request.query_params.get('upcoming')
        if upcoming == 'true':
            queryset = queryset.filter(
                start_datetime__gte=timezone.now(),
                status='upcoming'
            )
        
        return queryset.select_related('created_by')
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated(), ScopePermission()]
        return super().get_permissions()
    
    required_scopes = ['create:events']
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, delete an event."""
    
    queryset = Event.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return EventCreateSerializer
        return EventSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsOwnerOrAdmin()]
        return super().get_permissions()
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, context={'request': request})
        return success_response(data=serializer.data)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return success_response(
            data=EventSerializer(instance, context={'request': request}).data,
            message='Event updated successfully'
        )
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = 'cancelled'
        instance.save()
        return success_response(message='Event cancelled')


class EventRegisterView(APIView):
    """Register/Unregister for an event."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return error_response(
                'Event not found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # Check if event is full
        if event.is_full:
            return error_response(
                'Event is full',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Check registration deadline
        if event.registration_deadline and timezone.now() > event.registration_deadline:
            return error_response(
                'Registration deadline has passed',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        # Check event status
        if event.status != 'upcoming':
            return error_response(
                'Cannot register for this event',
                status_code=status.HTTP_400_BAD_REQUEST
            )
        
        registration, created = EventRegistration.objects.get_or_create(
            event=event,
            user=request.user,
            defaults={'status': 'registered'}
        )
        
        if not created:
            if registration.status == 'cancelled':
                registration.status = 'registered'
                registration.save()
                return success_response(message='Re-registered for event')
            else:
                return error_response(
                    'Already registered for this event',
                    status_code=status.HTTP_400_BAD_REQUEST
                )
        
        return success_response(
            data=EventRegistrationSerializer(registration).data,
            message='Registered successfully',
            status_code=status.HTTP_201_CREATED
        )
    
    def delete(self, request, pk):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return error_response(
                'Event not found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        try:
            registration = EventRegistration.objects.get(
                event=event,
                user=request.user
            )
            registration.status = 'cancelled'
            registration.save()
            return success_response(message='Registration cancelled')
        except EventRegistration.DoesNotExist:
            return error_response(
                'Not registered for this event',
                status_code=status.HTTP_400_BAD_REQUEST
            )


class EventAttendeesView(generics.ListAPIView):
    """List event attendees (creator only)."""
    
    serializer_class = EventAttendeesSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        event_id = self.kwargs.get('pk')
        return EventRegistration.objects.filter(
            event_id=event_id
        ).select_related('user')


class MyEventsView(generics.ListAPIView):
    """List events created by current user."""
    
    serializer_class = EventListSerializer
    permission_classes = [permissions.IsAuthenticated, ScopePermission]
    required_scopes = ['create:events']
    
    def get_queryset(self):
        return Event.objects.filter(
            created_by=self.request.user
        ).order_by('-start_datetime')


class MyRegistrationsView(generics.ListAPIView):
    """List current user's event registrations."""
    
    serializer_class = EventRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return EventRegistration.objects.filter(
            user=self.request.user,
            status='registered'
        ).select_related('event', 'event__created_by')


class MarkAttendanceView(APIView):
    """Mark attendance for an event (creator only)."""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk, registration_id):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return error_response(
                'Event not found',
                status_code=status.HTTP_404_NOT_FOUND
            )
        
        # Only creator can mark attendance
        if event.created_by != request.user:
            return error_response(
                'Permission denied',
                status_code=status.HTTP_403_FORBIDDEN
            )
        
        try:
            registration = EventRegistration.objects.get(
                pk=registration_id,
                event=event
            )
            registration.status = 'attended'
            registration.attended_at = timezone.now()
            registration.save()
            
            return success_response(
                data=EventAttendeesSerializer(registration).data,
                message='Attendance marked'
            )
        except EventRegistration.DoesNotExist:
            return error_response(
                'Registration not found',
                status_code=status.HTTP_404_NOT_FOUND
            )
