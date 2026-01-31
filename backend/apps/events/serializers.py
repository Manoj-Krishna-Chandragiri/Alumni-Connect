"""
Serializers for event models.
"""
from rest_framework import serializers
from .models import Event, EventRegistration
from apps.accounts.serializers import UserSerializer


class EventSerializer(serializers.ModelSerializer):
    """Serializer for events."""
    
    created_by = UserSerializer(read_only=True)
    attendees_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    is_registered = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'created_by', 'title', 'description', 'cover_image',
            'event_type', 'status', 'start_datetime', 'end_datetime',
            'venue', 'is_online', 'meeting_link', 'max_attendees',
            'registration_deadline', 'tags', 'target_audience',
            'attendees_count', 'is_full', 'is_registered',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def get_is_registered(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return EventRegistration.objects.filter(
                event=obj,
                user=request.user,
                status='registered'
            ).exists()
        return False


class EventListSerializer(serializers.ModelSerializer):
    """Lighter serializer for event listing."""
    
    created_by = UserSerializer(read_only=True)
    attendees_count = serializers.ReadOnlyField()
    is_full = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'created_by', 'title', 'cover_image', 'event_type',
            'status', 'start_datetime', 'end_datetime', 'venue',
            'is_online', 'max_attendees', 'attendees_count', 'is_full',
            'created_at'
        ]


class EventCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating events."""
    
    class Meta:
        model = Event
        fields = [
            'title', 'description', 'cover_image', 'event_type',
            'status', 'start_datetime', 'end_datetime', 'venue',
            'is_online', 'meeting_link', 'max_attendees',
            'registration_deadline', 'tags', 'target_audience'
        ]
    
    def validate(self, attrs):
        if attrs.get('end_datetime') and attrs.get('start_datetime'):
            if attrs['end_datetime'] <= attrs['start_datetime']:
                raise serializers.ValidationError({
                    'end_datetime': 'End datetime must be after start datetime.'
                })
        return attrs


class EventRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for event registrations."""
    
    user = UserSerializer(read_only=True)
    event = EventListSerializer(read_only=True)
    
    class Meta:
        model = EventRegistration
        fields = [
            'id', 'event', 'user', 'status',
            'registered_at', 'attended_at'
        ]
        read_only_fields = ['id', 'user', 'registered_at', 'attended_at']


class EventAttendeesSerializer(serializers.ModelSerializer):
    """Serializer for event attendees list."""
    
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = EventRegistration
        fields = ['id', 'user', 'status', 'registered_at', 'attended_at']
