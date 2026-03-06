"""
Generate 120+ users for VVIT platform (Admin, Principal, HODs, Counsellors, Students, Alumni)
Works with PostgreSQL on production and SQLite locally.
Run with: python scripts/seed_bulk_users.py
"""
import os
import sys
import random
from datetime import datetime, timedelta

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from apps.accounts.models import StudentProfile, AlumniProfile

User = get_user_model()

# Sample data
DEPARTMENTS = ['csm', 'ece', 'eee', 'mech', 'civil']
FIRST_NAMES_MALE = ['Rahul', 'Amit', 'Karthik', 'Aditya', 'Vikram', 'Rohit', 'Arjun', 'Rajesh', 'Suresh', 'Manoj', 
                     'Venkat', 'Krishna', 'Sai', 'Praveen', 'Naveen', 'Pavan', 'Tarun', 'Akhil', 'Nikhil', 'Varun']
FIRST_NAMES_FEMALE = ['Sneha', 'Priya', 'Divya', 'Ananya', 'Pooja', 'Neha', 'Meera', 'Sravani', 'Keerthi', 'Swathi',
                       'Lakshmi', 'Sowmya', 'Kavya', 'Bhavana', 'Haritha', 'Swetha', 'Chandana', 'Mounika', 'Manasa', 'Lavanya']
LAST_NAMES = ['Kumar', 'Sharma', 'Patel', 'Reddy', 'Verma', 'Gupta', 'Joshi', 'Kapoor', 'Das', 'Iyer', 
              'Menon', 'Nair', 'Rao', 'Singh', 'Prasad', 'Naidu', 'Chowdary', 'Varma', 'Babu', 'Murthy']

SKILLS = ['Python', 'Java', 'JavaScript', 'React', 'Django', 'Node.js', 'SQL', 'MongoDB', 
          'Machine Learning', 'Data Science', 'Cloud Computing', 'AWS', 'Docker', 'Git']

COMPANIES = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'HCL', 'Tech Mahindra', 
             'Amazon', 'Google', 'Microsoft', 'IBM', 'Oracle', 'Capgemini', 'Deloitte']


def create_admin_hierarchy():
    """Create admin, principal, HODs, counsellors."""
    users_created = 0
    
    # Admin
    if not User.objects.filter(email='admin@vvit.net').exists():
        admin = User.objects.create_user(
            email='admin@vvit.net',
            password='Admin@123',
            first_name='System',
            last_name='Admin',
            role='admin',
            department='csm',
            is_active=True,
            is_verified=True
        )
        print(f'✓ Created Admin: {admin.email}')
        users_created += 1
    
    # Principal
    if not User.objects.filter(email='principal@vvit.net').exists():
        principal = User.objects.create_user(
            email='principal@vvit.net',
            password='Principal@123',
            first_name='Dr. Principal',
            last_name='Kumar',
            role='principal',
            department='csm',
            is_active=True,
            is_verified=True
        )
        print(f'✓ Created Principal: {principal.email}')
        users_created += 1
    
    # HODs (one per department)
    hod_names = [
        ('Rajesh', 'Sharma', 'csm'),
        ('Suresh', 'Reddy', 'ece'),
        ('Ramesh', 'Patel', 'eee'),
        ('Mahesh', 'Kumar', 'mech'),
        ('Ganesh', 'Rao', 'civil'),
    ]
    
    for first, last, dept in hod_names:
        email = f'hod.{dept}@vvit.net'
        if not User.objects.filter(email=email).exists():
            hod = User.objects.create_user(
                email=email,
                password='Hod@123',
                first_name=f'Dr. {first}',
                last_name=last,
                role='hod',
                department=dept,
                is_active=True,
                is_verified=True
            )
            print(f'✓ Created HOD: {hod.email}')
            users_created += 1
    
    # Counsellors (2 per department = 10 total)
    for dept in DEPARTMENTS:
        for i in range(1, 3):
            email = f'counsellor{i}.{dept}@vvit.net'
            if not User.objects.filter(email=email).exists():
                first_name = random.choice(FIRST_NAMES_MALE + FIRST_NAMES_FEMALE)
                last_name = random.choice(LAST_NAMES)
                counsellor = User.objects.create_user(
                    email=email,
                    password='Counsellor@123',
                    first_name=f'Prof. {first_name}',
                    last_name=last_name,
                    role='counsellor',
                    department=dept,
                    is_active=True,
                    is_verified=True
                )
                print(f'✓ Created Counsellor: {counsellor.email}')
                users_created += 1
    
    return users_created


def create_students_bulk(count=50):
    """Create bulk students (currently enrolled)."""
    users_created = 0
    batches = [2022, 2023, 2024]  # Current students
    
    for i in range(1, count + 1):
        # Generate unique email
        dept = random.choice(DEPARTMENTS)
        batch_year = random.choice(batches)
        roll_prefix = str(batch_year)[-2:]  # Last 2 digits of year
        
        # VVIT roll format: YYBQXAserial (e.g., 22BQ1A4201)
        dept_code = {'csm': '4', 'ece': '5', 'eee': '2', 'mech': '3', 'civil': '1'}.get(dept, '4')
        roll_no = f"{roll_prefix}BQ{dept_code}A{4200 + i:04d}"
        email = f"{roll_no.lower()}@vvit.net"
        
        # Skip if exists
        if User.objects.filter(email=email).exists():
            continue
        
        # Random name
        gender = random.choice(['male', 'female'])
        first_name = random.choice(FIRST_NAMES_MALE if gender == 'male' else FIRST_NAMES_FEMALE)
        last_name = random.choice(LAST_NAMES)
        
        # Create user
        user = User.objects.create_user(
            email=email,
            password='Student@123',
            first_name=first_name,
            last_name=last_name,
            role='student',
            department=dept,
            is_active=True,
            is_verified=True
        )
        
        # Create student profile
        current_year = 2026 - batch_year  # Calculate year based on batch
        cgpa = round(random.uniform(6.5, 9.5), 2)
        
        StudentProfile.objects.create(
            user=user,
            roll_number=roll_no,
            current_year=current_year,
            cgpa=cgpa,
            bio=f'{first_name} {last_name} - {dept.upper()} student, batch of {batch_year}',
            skills=random.sample(SKILLS, k=random.randint(3, 6)),
            batch_year=batch_year,
            graduation_year=batch_year + 4,
        )
        
        users_created += 1
        if users_created % 10 == 0:
            print(f'  Created {users_created} students...')
    
    return users_created


def create_alumni_bulk(count=50):
    """Create bulk alumni (graduated)."""
    users_created = 0
    graduation_years = [2020, 2021, 2022, 2023]  # Graduated alumni
    
    for i in range(1, count + 1):
        # Generate unique email
        grad_year = random.choice(graduation_years)
        first_name = random.choice(FIRST_NAMES_MALE + FIRST_NAMES_FEMALE)
        last_name = random.choice(LAST_NAMES)
        email = f"{first_name.lower()}.{last_name.lower()}{i}@vvit.net"
        
        # Skip if exists
        if User.objects.filter(email=email).exists():
            email = f"{first_name.lower()}.{last_name.lower()}{i}{random.randint(10,99)}@vvit.net"
            if User.objects.filter(email=email).exists():
                continue
        
        dept = random.choice(DEPARTMENTS)
        
        # Create user
        user = User.objects.create_user(
            email=email,
            password='Alumni@123',
            first_name=first_name,
            last_name=last_name,
            role='alumni',
            department=dept,
            is_active=True,
            is_verified=True
        )
        
        # Create alumni profile
        batch_year = grad_year - 4
        roll_prefix = str(batch_year)[-2:]
        dept_code = {'csm': '4', 'ece': '5', 'eee': '2', 'mech': '3', 'civil': '1'}.get(dept, '4')
        roll_no = f"{roll_prefix}BQ{dept_code}A{4100 + i:04d}"
        
        AlumniProfile.objects.create(
            user=user,
            roll_number=roll_no,
            bio=f'Alumni from {dept.upper()} department, graduated in {grad_year}',
            current_company=random.choice(COMPANIES),
            current_designation=random.choice(['Software Engineer', 'Senior Developer', 'Tech Lead', 'Manager']),
            experience_years=2026 - grad_year,
            skills=random.sample(SKILLS, k=random.randint(4, 8)),
            graduation_year=grad_year,
        )
        
        users_created += 1
        if users_created % 10 == 0:
            print(f'  Created {users_created} alumni...')
    
    return users_created


def main():
    """Generate all 120+ users."""
    print("\n" + "="*70)
    print("  VVIT - Bulk User Generation (120+ Users)")
    print("="*70 + "\n")
    
    print("Phase 1: Creating admin hierarchy...")
    admin_count = create_admin_hierarchy()
    print(f"✓ Created {admin_count} admin/principal/HODs/counsellors\n")
    
    print("Phase 2: Creating 50 students...")
    student_count = create_students_bulk(50)
    print(f"✓ Created {student_count} students\n")
    
    print("Phase 3: Creating 50 alumni...")
    alumni_count = create_alumni_bulk(50)
    print(f"✓ Created {alumni_count} alumni\n")
    
    total = admin_count + student_count + alumni_count
    
    print("="*70)
    print(f"✅ SUCCESS! Created {total} total users")
    print("="*70)
    print(f"\n📊 Breakdown:")
    print(f"   • Admin/Principal: 2")
    print(f"   • HODs: 5")
    print(f"   • Counsellors: 10")
    print(f"   • Students: {student_count}")
    print(f"   • Alumni: {alumni_count}")
    print(f"\n🔐 Default Passwords:")
    print(f"   • Admin: Admin@123")
    print(f"   • Principal: Principal@123")
    print(f"   • HOD: Hod@123")
    print(f"   • Counsellor: Counsellor@123")
    print(f"   • Student: Student@123")
    print(f"   • Alumni: Alumni@123")
    print(f"\n📧 Sample Logins:")
    print(f"   Admin: admin@vvit.net / Admin@123")
    print(f"   Student: 22bq1a4201@vvit.net / Student@123")
    print(f"   Alumni: Check created users above / Alumni@123")
    print("\n" + "="*70 + "\n")


if __name__ == '__main__':
    main()
