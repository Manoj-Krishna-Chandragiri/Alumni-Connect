"""
Quick script to create specific test users immediately.
Run with: python scripts/create_specific_test_users.py
"""
import os
import sys

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from apps.accounts.models import StudentProfile

User = get_user_model()


def create_test_user():
    """Create the specific test user: 22BQ1A4225@vvit.net"""
    
    email = '22bq1a4225@vvit.net'
    roll_no = '22BQ1A4225'
    
    # Check if exists
    if User.objects.filter(email=email).exists():
        print(f'✓ User already exists: {email}')
        user = User.objects.get(email=email)
        # Make sure they're active and verified
        user.is_active = True
        user.is_verified = True
        user.save()
        print(f'✓ Updated user to active and verified: {email}')
        return user
    
    # Create user
    user = User.objects.create_user(
        email=email,
        password='Student@123',
        first_name='Manoj',
        last_name='Krishna',
        role='student',
        department='csm',
        is_active=True,
        is_verified=True
    )
    
    # Create student profile
    StudentProfile.objects.create(
        user=user,
        roll_no=roll_no,
        phone='+919876543210',
        current_year=4,
        cgpa=8.5,
        bio='Test student account for Manoj Krishna',
        skills=['Python', 'Django', 'React', 'JavaScript'],
        department='csm',
        batch_year=2022,
        graduation_year=2026,
    )
    
    print(f'✅ Created test user: {email} / Student@123')
    return user


if __name__ == '__main__':
    print("\n" + "="*60)
    print("  Creating Specific Test User")
    print("="*60 + "\n")
    
    user = create_test_user()
    
    print("\n" + "="*60)
    print("✅ Done!")
    print("="*60)
    print(f"\nLogin Credentials:")
    print(f"  Email: {user.email}")
    print(f"  Password: Student@123")
    print("\n" + "="*60 + "\n")
