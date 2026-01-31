from django.contrib import admin
from .models import Event, EventRegistration


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'event_type', 'status', 'start_datetime', 'created_by']
    list_filter = ['event_type', 'status', 'is_online', 'start_datetime']
    search_fields = ['title', 'description', 'venue']
    ordering = ['-start_datetime']


@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ['event', 'user', 'status', 'registered_at']
    list_filter = ['status', 'registered_at']
    search_fields = ['event__title', 'user__email']
