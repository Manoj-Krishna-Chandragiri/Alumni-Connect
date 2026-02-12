"""
Serializers for notifications.
"""
from rest_framework import serializers
from .models import Notification, NotificationPreference


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model."""
    
    sender_name = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message', 'link',
            'sender', 'sender_name', 'is_read', 'created_at', 'read_at',
            'time_ago', 'related_id', 'related_type'
        ]
        read_only_fields = ['id', 'created_at', 'sender', 'sender_name', 'time_ago']
    
    def get_sender_name(self, obj):
        """Get sender's full name."""
        if obj.sender:
            return f"{obj.sender.first_name} {obj.sender.last_name}"
        return "System"
    
    def get_time_ago(self, obj):
        """Get human-readable time ago."""
        from django.utils.timesince import timesince
        return timesince(obj.created_at)


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for NotificationPreference model."""
    
    class Meta:
        model = NotificationPreference
        fields = [
            'email_job_notifications', 'email_event_notifications',
            'email_comment_notifications', 'email_connection_requests',
            'email_announcements', 'email_weekly_digest',
            'inapp_job_notifications', 'inapp_event_notifications',
            'inapp_comment_notifications', 'inapp_connection_requests',
            'inapp_announcements',
        ]
