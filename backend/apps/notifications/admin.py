"""
Admin configuration for notifications.
"""
from django.contrib import admin
from .models import Notification, NotificationPreference


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Admin for Notification model."""
    
    list_display = ['recipient', 'notification_type', 'title', 'is_read', 'is_emailed', 'created_at']
    list_filter = ['notification_type', 'is_read', 'is_emailed', 'created_at']
    search_fields = ['recipient__email', 'title', 'message']
    readonly_fields = ['created_at', 'read_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Recipient', {
            'fields': ('recipient', 'sender')
        }),
        ('Notification Details', {
            'fields': ('notification_type', 'title', 'message', 'link')
        }),
        ('Related Object', {
            'fields': ('related_id', 'related_type'),
            'classes': ('collapse',)
        }),
        ('Status', {
            'fields': ('is_read', 'is_emailed', 'read_at')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    """Admin for NotificationPreference model."""
    
    list_display = ['user', 'email_job_notifications', 'email_event_notifications', 'email_announcements']
    search_fields = ['user__email']
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Email Notifications', {
            'fields': (
                'email_job_notifications',
                'email_event_notifications',
                'email_comment_notifications',
                'email_connection_requests',
                'email_announcements',
                'email_weekly_digest',
            )
        }),
        ('In-App Notifications', {
            'fields': (
                'inapp_job_notifications',
                'inapp_event_notifications',
                'inapp_comment_notifications',
                'inapp_connection_requests',
                'inapp_announcements',
            )
        }),
    )
