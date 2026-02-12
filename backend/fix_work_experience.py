"""
Temporary fix script to check and repair work experience data
Run this to see what's actually in the database
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from apps.accounts.models import AlumniProfile
import json

# Get all alumni profiles
profiles = AlumniProfile.objects.all()

for profile in profiles:
    print(f"\n=== Alumni: {profile.user.email} ===")
    print(f"Work Experience Data:")
    print(json.dumps(profile.work_experience, indent=2))
    
    # Check if work experience has position field
    if profile.work_experience:
        for idx, exp in enumerate(profile.work_experience):
            print(f"\nExperience #{idx + 1}:")
            print(f"  Keys: {list(exp.keys())}")
            print(f"  Has 'position'?: {'position' in exp}")
            print(f"  Has 'role'?: {'role' in exp}")
            if 'position' in exp:
                print(f"  Position value: {exp['position']}")
            if 'role' in exp:
                print(f"  Role value: {exp['role']}")
