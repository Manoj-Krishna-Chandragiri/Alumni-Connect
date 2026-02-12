"""
Script to create test counsellor and student data with hierarchical relationships.
"""
import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from common.models import User, StudentProfile

def create_test_data():
    """Create test counsellor and students with relationships."""
    
    # Create a test counsellor
    counsellor_email = "counsellor1@college.edu"
    counsellor = User.objects(email=counsellor_email).first()
    
    if not counsellor:
        counsellor = User(
            email=counsellor_email,
            first_name="Dr. Priya",
            last_name="Sharma",
            role="counsellor"
        )
        counsellor.set_password("password123")
        counsellor.save()
        print(f"✓ Created counsellor: {counsellor.full_name}")
    else:
        print(f"✓ Counsellor already exists: {counsellor.full_name}")
    
    # Create test students
    students_data = [
        {
            "email": "amit.kumar@college.edu",
            "first_name": "Amit",
            "last_name": "Kumar",
            "roll_no": "CS2021001",
            "department": "cse",
            "year": 3,
            "cgpa": 8.5,
            "phone": "+91 9876543210",
            "career_interest": "Software Development",
            "skills": ["Python", "JavaScript", "React", "Machine Learning"],
        },
        {
            "email": "neha.gupta@college.edu",
            "first_name": "Neha",
            "last_name": "Gupta",
            "roll_no": "CS2021002",
            "department": "cse",
            "year": 3,
            "cgpa": 9.2,
            "phone": "+91 9876543211",
            "career_interest": "Data Science",
            "skills": ["Python", "R", "Statistics", "Deep Learning"],
        },
        {
            "email": "rajesh.nair@college.edu",
            "first_name": "Rajesh",
            "last_name": "Nair",
            "roll_no": "EC2021001",
            "department": "ece",
            "year": 4,
            "cgpa": 7.8,
            "phone": "+91 9876543212",
            "career_interest": "Embedded Systems",
            "skills": ["C", "C++", "VHDL", "Arduino"],
        },
        {
            "email": "priyanka.mehta@college.edu",
            "first_name": "Priyanka",
            "last_name": "Mehta",
            "roll_no": "IT2021001",
            "department": "it",
            "year": 2,
            "cgpa": 8.9,
            "phone": "+91 9876543213",
            "career_interest": "Cloud Computing",
            "skills": ["AWS", "Python", "Docker", "Kubernetes"],
        },
        {
            "email": "sanjay.verma@college.edu",
            "first_name": "Sanjay",
            "last_name": "Verma",
            "roll_no": "ME2021001",
            "department": "mech",
            "year": 3,
            "cgpa": 7.5,
            "phone": "+91 9876543214",
            "career_interest": "Design Engineering",
            "skills": ["AutoCAD", "SolidWorks", "MATLAB", "3D Printing"],
        },
    ]
    
    created_count = 0
    for data in students_data:
        # Check if user exists
        user = User.objects(email=data["email"]).first()
        
        if not user:
            # Create user with counsellor assignment
            user = User(
                email=data["email"],
                first_name=data["first_name"],
                last_name=data["last_name"],
                role="student",
                assigned_counsellor=counsellor  # Assign to counsellor
            )
            user.set_password("password123")
            user.save()
            print(f"✓ Created student: {user.full_name}")
            
            # Check if profile exists
            existing_profile = StudentProfile.objects(roll_no=data["roll_no"]).first()
            if not existing_profile:
                # Create student profile
                profile = StudentProfile(
                    user=user,
                    roll_no=data["roll_no"],
                    department=data["department"],
                    year=data["year"],
                    current_year=data["year"],
                    cgpa=data["cgpa"],
                    phone=data["phone"],
                    career_interest=data["career_interest"],
                    skills=data["skills"],
                )
                profile.save()
                print(f"  → Created profile for {data['roll_no']}")
                created_count += 1
            else:
                print(f"  → Profile already exists for {data['roll_no']}")
        else:
            # Update existing user to assign counsellor
            if not user.assigned_counsellor:
                user.assigned_counsellor = counsellor
                user.save()
                print(f"✓ Updated student: {user.full_name} - assigned counsellor")
            else:
                print(f"✓ Student already exists: {user.full_name}")
    
    print(f"\n✅ Setup complete!")
    print(f"   Counsellor: {counsellor.email} / password123")
    print(f"   Students: {len(students_data)} students assigned")
    print(f"   New students created: {created_count}")
    print(f"\n🔐 Login at http://localhost:3000/login with counsellor credentials")

if __name__ == "__main__":
    create_test_data()
