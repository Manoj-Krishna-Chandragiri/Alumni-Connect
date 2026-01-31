"""
Models for events.
"""
from django.db import models
from django.conf import settings
from common.utils import Choices


class Event(models.Model):
    """Event model."""
    
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_events'
    )
    
    title = models.CharField(max_length=300)
    description = models.TextField()
    cover_image = models.URLField(blank=True, null=True)
    
    event_type = models.CharField(
        max_length=20,
        choices=Choices.EVENT_TYPE,
        default='workshop'
    )
    status = models.CharField(
        max_length=20,
        choices=Choices.EVENT_STATUS,
        default='upcoming'
    )
    
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    
    venue = models.CharField(max_length=300, blank=True)
    is_online = models.BooleanField(default=False)
    meeting_link = models.URLField(blank=True, null=True)
    
    max_attendees = models.IntegerField(blank=True, null=True)
    registration_deadline = models.DateTimeField(blank=True, null=True)
    
    tags = models.JSONField(default=list, blank=True)
    target_audience = models.JSONField(default=list, blank=True)  # ['student', 'alumni']
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'events'
        ordering = ['start_datetime']
    
    def __str__(self):
        return self.title
    
    @property
    def attendees_count(self):
        return self.registrations.count()
    
    @property
    def is_full(self):
        if self.max_attendees:
            return self.attendees_count >= self.max_attendees
        return False


class EventRegistration(models.Model):
    """Event registration model."""
    
    event = models.ForeignKey(
        Event,
        on_delete=models.CASCADE,
        related_name='registrations'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='event_registrations'
    )
    
    status = models.CharField(
        max_length=20,
        choices=[
            ('registered', 'Registered'),
            ('attended', 'Attended'),
            ('cancelled', 'Cancelled'),
        ],
        default='registered'
    )
    
    registered_at = models.DateTimeField(auto_now_add=True)
    attended_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'event_registrations'
        unique_together = ['event', 'user']
        ordering = ['-registered_at']
    
    def __str__(self):
        return f"{self.user.full_name} - {self.event.title}"
