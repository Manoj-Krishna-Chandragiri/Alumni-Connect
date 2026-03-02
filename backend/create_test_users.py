import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.accounts.models import StudentProfile

User = get_user_model()

# Create the specific students you need
students = [
    {
        'roll': '22BQ1A4215',
        'email': '22bq1a4215@vvit.net',
        'name': 'Divya Reddy',
        'dept': 'CSM',
        'year': 4,
        'passout': 2026
    },
    {
        'roll': '22BQ1A4225',
        'email': '22bq1a4225@vvit.net',
        'name': 'Manoj Krishna',
        'dept': 'CSM',
        'year': 4,
        'passout': 2026
    }
]

print("Creating test students...")
for s in students:
    # Check if exists
    if User.objects.filter(email=s['email']).exists():
        print(f"✓ User {s['email']} already exists")
        continue
    
    # Create user
    first_name = s['name'].split()[0]
    last_name = ' '.join(s['name'].split()[1:])
    
    user = User.objects.create_user(
        email=s['email'],
        password='Student@123',
        first_name=first_name,
        last_name=last_name,
        role='student',
        department=s['dept'],
        is_active=True
    )
    
    # Create profile
    StudentProfile.objects.create(
        user=user,
        roll_number=s['roll'],
        batch_year=2022,
        graduation_year=s['passout'],
        current_year=s['year'],
        current_semester=s['year'] * 2
    )
    
    print(f"✓ Created: {s['email']} | Password: Student@123")

print("\n✅ Done! You can now login with:")
print("   Email: 22bq1a4215@vvit.net")
print("   Password: Student@123")
