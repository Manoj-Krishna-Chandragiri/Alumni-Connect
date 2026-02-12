#!/usr/bin/env python
"""Check and display alumni user data."""
import os
import sys
import django

# Add the project directory to Python path
project_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_dir)

# Setup Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
import json

User = get_user_model()

print("\n" + "="*70)
print("ALUMNI USERS CHECK")
print("="*70)

# Get all alumni users
alumni_users = User.objects.filter(role='alumni')
print(f"\nFound {alumni_users.count()} alumni user(s)")

if alumni_users.count() == 0:
    print("\n⚠️  No alumni users found!")
    print("Run the seed script: python scripts/seed_data.py")
else:
    print("\n" + "-"*70)
    for user in alumni_users:
        print(f"\nUser ID: {user.id}")
        print(f"Email: {user.email}")
        print(f"First Name: '{user.first_name}' (empty: {not user.first_name})")
        print(f"Last Name: '{user.last_name}' (empty: {not user.last_name})")
        print(f"Full Name: {user.full_name}")
        print(f"Department: {user.department}")
        print(f"Is Verified: {user.is_verified}")
        
        # Check if profile exists
        try:
            profile = user.alumni_profile
            print(f"\n  Alumni Profile:")
            print(f"  - Current Company: {profile.current_company}")
            print(f"  - Current Designation: {profile.current_designation}")
            print(f"  - Location: {profile.current_location}")
            print(f"  - Graduation Year: {profile.graduation_year}")
            print(f"  - Bio: {profile.bio[:50]}..." if profile.bio else "  - Bio: (empty)")
        except Exception as e:
            print(f"  ⚠️  No profile: {e}")
        
        print("-"*70)

print("\n" + "="*70)
print("If names are missing, you can fix them by running:")
print("  python manage.py shell")
print("Then:")
print("  from django.contrib.auth import get_user_model")
print("  User = get_user_model()")
print("  user = User.objects.filter(email='alumni1@gmail.com').first()")
print("  user.first_name = 'Amit'")
print("  user.last_name = 'Kumar'")
print("  user.save()")
print("="*70 + "\n")
