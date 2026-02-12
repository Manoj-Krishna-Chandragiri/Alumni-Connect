"""
Comprehensive seed data script for VVIT (Vasireddy Venkatadri Institute of Technology)
Creates students, alumni, counsellors, HODs, principal, and admin with realistic data.
"""
import os
import sys
import django
from datetime import datetime, timedelta
import random

# Setup Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from common.models import (
    User, StudentProfile, AlumniProfile, 
    WorkExperience, Skill, Internship, Placement
)

# VVIT Department Codes
DEPT_CODES = {
    'cse': '4',      # Computer Science & Engineering
    'ece': '5',      # Electronics & Communication
    'eee': '2',      # Electrical & Electronics
    'mech': '3',     # Mechanical Engineering
    'civil': '1',    # Civil Engineering
    'it': '1',       # Information Technology
}

DEPARTMENTS = {
    'cse': 'Computer Science & Engineering',
    'ece': 'Electronics & Communication Engineering',
    'eee': 'Electrical & Electronics Engineering',
    'mech': 'Mechanical Engineering',
    'civil': 'Civil Engineering',
    'it': 'Information Technology',
}

# Andhra Pradesh names
FIRST_NAMES_MALE = [
    'Venkata', 'Sai', 'Krishna', 'Ravi', 'Suresh', 'Praveen', 'Rajesh',
    'Ramesh', 'Mahesh', 'Anil', 'Kiran', 'Srikanth', 'Naveen', 'Vijay',
    'Akhil', 'Charan', 'Pavan', 'Tarun', 'Nikhil', 'Varun'
]

FIRST_NAMES_FEMALE = [
    'Lakshmi', 'Sravani', 'Sravya', 'Divya', 'Sowmya', 'Priya', 'Keerthi',
    'Swathi', 'Haritha', 'Kavya', 'Bhavana', 'Anitha', 'Madhuri', 'Swetha',
    'Chandana', 'Mounika', 'Manasa', 'Sindhuja', 'Pooja', 'Lavanya'
]

LAST_NAMES = [
    'Reddy', 'Kumar', 'Rao', 'Prasad', 'Naidu', 'Chowdary', 'Varma',
    'Krishna', 'Sai', 'Raju', 'Babu', 'Murthy', 'Sastry', 'Chakravarthy',
    'Venkatesh', 'Ramana', 'Mohan', 'Kishore', 'Prakash', 'Sekhar'
]

COMPANIES = [
    'TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'HCL Technologies',
    'Tech Mahindra', 'Amazon', 'Google', 'Microsoft', 'IBM', 'Oracle',
    'Capgemini', 'Deloitte', 'DXC Technology', 'LTI Mindtree'
]

SKILLS_BY_DEPT = {
    'cse': ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'MongoDB', 
            'Machine Learning', 'Data Structures', 'AWS', 'Docker', 'Git'],
    'ece': ['VLSI Design', 'Embedded Systems', 'Signal Processing', 'MATLAB',
            'Verilog', 'Arduino', 'IoT', 'PCB Design', 'Microcontrollers'],
    'eee': ['Power Systems', 'Control Systems', 'MATLAB', 'PLC Programming',
            'AutoCAD Electrical', 'Circuit Design', 'Renewable Energy'],
    'mech': ['AutoCAD', 'SolidWorks', 'CATIA', 'ANSYS', 'CNC Programming',
             '3D Printing', 'Manufacturing Processes', 'Thermodynamics'],
    'civil': ['AutoCAD', 'Revit', 'STAAD Pro', 'Primavera', 'Structural Analysis',
              'BIM', 'Surveying', 'Construction Management'],
    'it': ['Python', 'Java', 'Web Development', 'Database Management', 'Cloud Computing',
           'Cybersecurity', 'Networking', 'DevOps', 'Data Analytics']
}

def generate_roll_number(year, dept, serial):
    """Generate VVIT roll number format: YYBQXAXXXXXs"""
    dept_code = DEPT_CODES.get(dept, '4')
    return f"{year}bq{dept_code}a{serial:04d}"

def create_admin():
    """Create admin account."""
    admin = User.objects(email='admin@vvit.net').first()
    if not admin:
        admin = User(
            email='admin@vvit.net',
            first_name='System',
            last_name='Admin',
            role='admin',
            department='cse'
        )
        admin.set_password('Admin@123')
        admin.save()
        print('✓ Created admin: admin@vvit.net')
    else:
        print('✓ Admin already exists')
    return admin

def create_principal():
    """Create principal account."""
    principal = User.objects(email='principal@vvit.net').first()
    if not principal:
        principal = User(
            email='principal@vvit.net',
            first_name='Dr. Rama',
            last_name='Krishna',
            role='principal',
            department='cse'
        )
        principal.set_password('Principal@123')
        principal.save()
        print('✓ Created principal: principal@vvit.net')
    else:
        print('✓ Principal already exists')
    return principal

def create_hods():
    """Create HOD accounts for each department."""
    hods_data = [
        {'email': 'ramesh.hod@vvit.net', 'first_name': 'Dr. Ramesh', 'last_name': 'Kumar', 'dept': 'cse'},
        {'email': 'lakshmi.hod@vvit.net', 'first_name': 'Dr. Lakshmi', 'last_name': 'Prasad', 'dept': 'ece'},
        {'email': 'suresh.hod@vvit.net', 'first_name': 'Dr. Suresh', 'last_name': 'Reddy', 'dept': 'eee'},
        {'email': 'vijay.hod@vvit.net', 'first_name': 'Dr. Vijay', 'last_name': 'Naidu', 'dept': 'mech'},
    ]
    
    hods = []
    for data in hods_data:
        hod = User.objects(email=data['email']).first()
        if not hod:
            hod = User(
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                role='hod',
                department=data['dept']
            )
            hod.set_password('HOD@123')
            hod.save()
            print(f"✓ Created HOD: {data['email']} - {DEPARTMENTS[data['dept']]}")
        else:
            print(f"✓ HOD already exists: {data['email']}")
        hods.append(hod)
    
    return hods

def create_counsellors(hods):
    """Create counsellor accounts."""
    counsellors_data = [
        {'email': 'priya.cse@vvit.net', 'first_name': 'Priya', 'last_name': 'Sharma', 'dept': 'cse'},
        {'email': 'sravani.cse@vvit.net', 'first_name': 'Sravani', 'last_name': 'Reddy', 'dept': 'cse'},
        {'email': 'kiran.ece@vvit.net', 'first_name': 'Kiran', 'last_name': 'Kumar', 'dept': 'ece'},
        {'email': 'swathi.eee@vvit.net', 'first_name': 'Swathi', 'last_name': 'Rao', 'dept': 'eee'},
    ]
    
    # Map HODs by department
    hod_map = {hod.department: hod for hod in hods}
    
    counsellors = []
    for data in counsellors_data:
        counsellor = User.objects(email=data['email']).first()
        if not counsellor:
            counsellor = User(
                email=data['email'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                role='counsellor',
                department=data['dept'],
                reports_to_hod=hod_map.get(data['dept'])
            )
            counsellor.set_password('Counsellor@123')
            counsellor.save()
            print(f"✓ Created Counsellor: {data['email']} - {DEPARTMENTS[data['dept']]}")
        else:
            print(f"✓ Counsellor already exists: {data['email']}")
        counsellors.append(counsellor)
    
    return counsellors

def create_students(counsellors):
    """Create student accounts with detailed profiles."""
    students_data = [
        # CSE Students (2022 batch - 3rd year)
        {
            'year': '22', 'dept': 'cse', 'serial': 4201,
            'first_name': 'Venkata Sai', 'last_name': 'Krishna',
            'phone': '+91 9876543210', 'current_year': 3, 'cgpa': 8.7,
            'career_interest': 'Full Stack Development',
            'bio': 'Passionate about web technologies and building scalable applications.',
            'counsellor_email': 'priya.cse@vvit.net'
        },
        {
            'year': '22', 'dept': 'cse', 'serial': 4215,
            'first_name': 'Divya', 'last_name': 'Reddy',
            'phone': '+91 9876543211', 'current_year': 3, 'cgpa': 9.1,
            'career_interest': 'Machine Learning & AI',
            'bio': 'Interested in artificial intelligence and data science.',
            'counsellor_email': 'priya.cse@vvit.net'
        },
        {
            'year': '22', 'dept': 'cse', 'serial': 4228,
            'first_name': 'Akhil', 'last_name': 'Kumar',
            'phone': '+91 9876543212', 'current_year': 3, 'cgpa': 8.3,
            'career_interest': 'Cloud Computing',
            'bio': 'AWS enthusiast with focus on cloud architecture.',
            'counsellor_email': 'sravani.cse@vvit.net'
        },
        # ECE Students (2021 batch - 4th year)
        {
            'year': '21', 'dept': 'ece', 'serial': 5101,
            'first_name': 'Sravya', 'last_name': 'Naidu',
            'phone': '+91 9876543213', 'current_year': 4, 'cgpa': 8.9,
            'career_interest': 'VLSI Design',
            'bio': 'Focused on chip design and embedded systems.',
            'counsellor_email': 'kiran.ece@vvit.net'
        },
        {
            'year': '21', 'dept': 'ece', 'serial': 5115,
            'first_name': 'Praveen', 'last_name': 'Chowdary',
            'phone': '+91 9876543214', 'current_year': 4, 'cgpa': 8.5,
            'career_interest': 'IoT & Embedded Systems',
            'bio': 'Building smart devices and IoT solutions.',
            'counsellor_email': 'kiran.ece@vvit.net'
        },
        # EEE Students (2023 batch - 2nd year)
        {
            'year': '23', 'dept': 'eee', 'serial': 2101,
            'first_name': 'Keerthi', 'last_name': 'Prasad',
            'phone': '+91 9876543215', 'current_year': 2, 'cgpa': 8.1,
            'career_interest': 'Power Systems',
            'bio': 'Interested in renewable energy and smart grids.',
            'counsellor_email': 'swathi.eee@vvit.net'
        },
        {
            'year': '23', 'dept': 'eee', 'serial': 2118,
            'first_name': 'Tarun', 'last_name': 'Varma',
            'phone': '+91 9876543216', 'current_year': 2, 'cgpa': 7.8,
            'career_interest': 'Control Systems',
            'bio': 'Passionate about automation and control engineering.',
            'counsellor_email': 'swathi.eee@vvit.net'
        },
    ]
    
    # Map counsellors by email
    counsellor_map = {c.email: c for c in counsellors}
    
    created = 0
    for data in students_data:
        roll_no = generate_roll_number(data['year'], data['dept'], data['serial'])
        email = f"{roll_no}@vvit.net"
        
        user = User.objects(email=email).first()
        if not user:
            user = User(
                email=email,
                first_name=data['first_name'],
                last_name=data['last_name'],
                role='student',
                department=data['dept'],
                assigned_counsellor=counsellor_map.get(data['counsellor_email'])
            )
            user.set_password('Student@123')
            user.save()
            
            # Select random skills from department skills
            dept_skills = SKILLS_BY_DEPT.get(data['dept'], [])
            selected_skills = random.sample(dept_skills, min(6, len(dept_skills)))
            
            # Create profile
            profile = StudentProfile(
                user=user,
                roll_no=roll_no,
                department=data['dept'],
                phone=data['phone'],
                current_year=data['current_year'],
                year=data['current_year'],
                current_semester=(data['current_year'] * 2),
                cgpa=data['cgpa'],
                joined_year=2000 + int(data['year']),
                completion_year=2000 + int(data['year']) + 4,
                career_interest=data['career_interest'],
                bio=data['bio'],
                skills=selected_skills,
                linkedin=f"linkedin.com/in/{data['first_name'].lower()}-{data['last_name'].lower()}",
                github=f"github.com/{data['first_name'].lower()}{data['last_name'].lower()}",
            )
            
            # Add internship for final year students
            if data['current_year'] >= 3:
                profile.internships = [
                    Internship(
                        company=random.choice(COMPANIES[:6]),
                        role=f"{data['career_interest']} Intern",
                        start_date=datetime(2000 + int(data['year']) + 2, 6, 1),
                        end_date=datetime(2000 + int(data['year']) + 2, 8, 31),
                        is_paid=True,
                        description="Summer internship program"
                    )
                ]
            
            profile.save()
            print(f"✓ Created Student: {email} - {data['first_name']} {data['last_name']}")
            created += 1
        else:
            print(f"✓ Student already exists: {email}")
    
    return created

def create_alumni(counsellors):
    """Create alumni accounts with work experience."""
    alumni_data = [
        # CSE Alumni (2020 passout)
        {
            'year': '16', 'dept': 'cse', 'serial': 4102,
            'first_name': 'Ravi', 'last_name': 'Kumar',
            'phone': '+91 9876543220', 'grad_year': 2020,
            'company': 'TCS', 'position': 'Senior Software Engineer',
            'experience_years': 4, 'location': 'Hyderabad',
            'bio': 'Full stack developer with expertise in React and Node.js.',
            'counsellor_email': 'priya.cse@vvit.net'
        },
        {
            'year': '16', 'dept': 'cse', 'serial': 4125,
            'first_name': 'Sowmya', 'last_name': 'Reddy',
            'phone': '+91 9876543221', 'grad_year': 2020,
            'company': 'Amazon', 'position': 'Software Development Engineer II',
            'experience_years': 4, 'location': 'Bangalore',
            'bio': 'Backend engineer working on distributed systems.',
            'counsellor_email': 'priya.cse@vvit.net'
        },
        {
            'year': '17', 'dept': 'cse', 'serial': 4210,
            'first_name': 'Mahesh', 'last_name': 'Chowdary',
            'phone': '+91 9876543222', 'grad_year': 2021,
            'company': 'Google', 'position': 'Software Engineer',
            'experience_years': 3, 'location': 'Hyderabad',
            'bio': 'Working on cloud infrastructure and DevOps.',
            'counsellor_email': 'sravani.cse@vvit.net'
        },
        # ECE Alumni (2019 passout)
        {
            'year': '15', 'dept': 'ece', 'serial': 5108,
            'first_name': 'Srikanth', 'last_name': 'Naidu',
            'phone': '+91 9876543223', 'grad_year': 2019,
            'company': 'Qualcomm', 'position': 'VLSI Design Engineer',
            'experience_years': 5, 'location': 'Bangalore',
            'bio': 'Chip design engineer specializing in low-power SoCs.',
            'counsellor_email': 'kiran.ece@vvit.net'
        },
        {
            'year': '16', 'dept': 'ece', 'serial': 5119,
            'first_name': 'Bhavana', 'last_name': 'Prasad',
            'phone': '+91 9876543224', 'grad_year': 2020,
            'company': 'Texas Instruments', 'position': 'Applications Engineer',
            'experience_years': 4, 'location': 'Bangalore',
            'bio': 'Working on embedded systems and IoT solutions.',
            'counsellor_email': 'kiran.ece@vvit.net'
        },
    ]
    
    counsellor_map = {c.email: c for c in counsellors}
    created = 0
    
    for data in alumni_data:
        roll_no = generate_roll_number(data['year'], data['dept'], data['serial'])
        email = f"{roll_no}@vvit.net"
        
        user = User.objects(email=email).first()
        if not user:
            user = User(
                email=email,
                first_name=data['first_name'],
                last_name=data['last_name'],
                role='alumni',
                department=data['dept'],
                assigned_counsellor=counsellor_map.get(data['counsellor_email']),
                is_verified=True
            )
            user.set_password('Alumni@123')
            user.save()
            
            # Select skills
            dept_skills = SKILLS_BY_DEPT.get(data['dept'], [])
            selected_skills = random.sample(dept_skills, min(8, len(dept_skills)))
            
            # Create profile
            profile = AlumniProfile(
                user=user,
                roll_no=roll_no,
                department=data['dept'],
                graduation_year=data['grad_year'],
                phone=data['phone'],
                current_company=data['company'],
                current_position=data['position'],
                location=data['location'],
                bio=data['bio'],
                skills=selected_skills,
                linkedin=f"linkedin.com/in/{data['first_name'].lower()}-{data['last_name'].lower()}",
                github=f"github.com/{data['first_name'].lower()}{data['last_name'].lower()}",
                is_verified=True
            )
            
            # Add work experience
            start_year = data['grad_year']
            profile.work_experience = [
                WorkExperience(
                    company=data['company'],
                    title=data['position'],
                    location=data['location'],
                    start_date=datetime(start_year, 7, 1),
                    current=True,
                    description=f"Working as {data['position']} at {data['company']}"
                )
            ]
            
            # Add previous experience if experience > 2 years
            if data['experience_years'] >= 2:
                prev_company = random.choice([c for c in COMPANIES if c != data['company']])
                profile.work_experience.insert(0, WorkExperience(
                    company=prev_company,
                    title="Software Engineer",
                    location=data['location'],
                    start_date=datetime(start_year, 7, 1),
                    end_date=datetime(start_year + 2, 6, 30),
                    current=False,
                    description=f"Worked as Software Engineer at {prev_company}"
                ))
            
            profile.save()
            print(f"✓ Created Alumni: {email} - {data['first_name']} {data['last_name']}")
            created += 1
        else:
            print(f"✓ Alumni already exists: {email}")
    
    return created

def main():
    """Main execution function."""
    print("\n" + "="*70)
    print("  VVIT (Vasireddy Venkatadri Institute of Technology)")
    print("  Comprehensive Data Seeding Script")
    print("="*70 + "\n")
    
    print("Creating organizational hierarchy...\n")
    
    # Create hierarchy
    admin = create_admin()
    principal = create_principal()
    print()
    
    hods = create_hods()
    print()
    
    counsellors = create_counsellors(hods)
    print()
    
    print("Creating students with profiles...\n")
    students_created = create_students(counsellors)
    print()
    
    print("Creating alumni with work experience...\n")
    alumni_created = create_alumni(counsellors)
    print()
    
    print("="*70)
    print("✅ DATA SEEDING COMPLETED SUCCESSFULLY!")
    print("="*70)
    print(f"\n📊 Summary:")
    print(f"   • Admin: 1")
    print(f"   • Principal: 1")
    print(f"   • HODs: {len(hods)}")
    print(f"   • Counsellors: {len(counsellors)}")
    print(f"   • Students Created: {students_created}")
    print(f"   • Alumni Created: {alumni_created}")
    print(f"\n🔐 Default Passwords:")
    print(f"   • Admin: Admin@123")
    print(f"   • Principal: Principal@123")
    print(f"   • HOD: HOD@123")
    print(f"   • Counsellor: Counsellor@123")
    print(f"   • Student: Student@123")
    print(f"   • Alumni: Alumni@123")
    print(f"\n🌐 Access the platform at: http://localhost:3000")
    print(f"\n📧 Sample Login Credentials:")
    print(f"   Admin: admin@vvit.net / Admin@123")
    print(f"   Principal: principal@vvit.net / Principal@123")
    print(f"   HOD (CSE): ramesh.hod@vvit.net / HOD@123")
    print(f"   Counsellor: priya.cse@vvit.net / Counsellor@123")
    print(f"   Student: 22bq4a4201@vvit.net / Student@123")
    print(f"   Alumni: 16bq4a4102@vvit.net / Alumni@123")
    print("\n" + "="*70 + "\n")

if __name__ == "__main__":
    main()
