#!/usr/bin/env python
"""Fix alumni user names."""
import os
import sys
import django

# Setup Django
project_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, project_dir)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("\n" + "="*70)
print("FIXING ALUMNI USER NAMES")
print("="*70)

# Alumni users to fix
alumni_data = [
    {
        'email': 'alumni1@gmail.com',
        'first_name': 'Amit',
        'last_name': 'Kumar',
        'phone': '9876543212'
    },
    {
        'email': 'alumni2@gmail.com',
        'first_name': 'Sneha',
        'last_name': 'Verma',
        'phone': '9876543213'
    },
    {
        'email': 'alumni3@gmail.com',
        'first_name': 'Rajesh',
        'last_name': 'Singh',
        'phone': '9876543214'
    },
    {
        'email': 'alumni10@alumni.edu',
        'first_name': 'Priya',
        'last_name': 'Reddy',
        'phone': '9876543210'
    }
]

updated = 0
created = 0
not_found = 0

for data in alumni_data:
    email = data['email']
    try:
        user = User.objects.get(email=email)
        user.first_name = data['first_name']
        user.last_name = data['last_name']
        if 'phone' in data:
            user.phone = data['phone']
        user.save()
        print(f"✓ Updated: {user.full_name} ({email})")
        updated += 1
    except User.DoesNotExist:
        print(f"✗ Not found: {email}")
        not_found += 1

print("\n" + "="*70)
print(f"Summary:")
print(f"  Updated: {updated}")
print(f"  Not found: {not_found}")
print("="*70 + "\n")

# Display current alumni
print("Current alumni users:")
print("-"*70)
for user in User.objects.filter(role='alumni')[:5]:
    print(f"{user.full_name:20} | {user.email:30} | {user.department}")
print("-"*70 + "\n")
