"""
Notification models for Alumni Connect.
"""
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Notification(models.Model):
    """Model for user notifications."""
    
    NOTIFICATION_TYPES = [
        ('job', 'Job Opportunity'),
        ('event', 'Event'),
        ('comment', 'Comment'),
        ('like', 'Like'),
        ('connection', 'Connection Request'),
        ('message', 'Message'),
        ('announcement', 'Announcement'),
        ('verification', 'Profile Verification'),
        ('blog', 'Blog Post'),
    ]
    
    recipient = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    sender = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sent_notifications'
    )
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    link = models.CharField(max_length=500, blank=True)
    
    # Related object reference (generic)
    related_id = models.CharField(max_length=100, blank=True)
    related_type = models.CharField(max_length=50, blank=True)
    
    is_read = models.BooleanField(default=False)
    is_emailed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.notification_type} for {self.recipient.email}: {self.title}"
    
    def mark_as_read(self):
        """Mark notification as read."""
        if not self.is_read:
            self.is_read = True
            self.read_at = models.DateTimeField(auto_now=True)
            self.save()


class NotificationPreference(models.Model):
    """User notification preferences."""
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='notification_preferences'
    )
    
    # Email notifications
    email_job_notifications = models.BooleanField(default=True)
    email_event_notifications = models.BooleanField(default=True)
    email_comment_notifications = models.BooleanField(default=True)
    email_connection_requests = models.BooleanField(default=True)
    email_announcements = models.BooleanField(default=True)
    email_weekly_digest = models.BooleanField(default=True)
    
    # In-app notifications
    inapp_job_notifications = models.BooleanField(default=True)
    inapp_event_notifications = models.BooleanField(default=True)
    inapp_comment_notifications = models.BooleanField(default=True)
    inapp_connection_requests = models.BooleanField(default=True)
    inapp_announcements = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Notification Preference'
        verbose_name_plural = 'Notification Preferences'
    
    def __str__(self):
        return f"Notification preferences for {self.user.email}"
