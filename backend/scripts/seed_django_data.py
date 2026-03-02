"""
Seed data script for Django ORM (SQLite).
Run with: python manage.py shell < scripts/seed_django_data.py
Or: cd backend && python scripts/seed_django_data.py
"""
import os
import sys
from datetime import datetime

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from django.contrib.auth import get_user_model
from apps.accounts.models import StudentProfile, AlumniProfile
from apps.blogs.models import Blog
from apps.jobs.models import Job
from apps.events.models import Event

User = get_user_model()


def clear_data():
    """Clear existing data."""
    print("Clearing existing data...")
    Event.objects.all().delete()
    Job.objects.all().delete()
    Blog.objects.all().delete()
    AlumniProfile.objects.all().delete()
    StudentProfile.objects.all().delete()
    # Delete users one by one to avoid cascade issues
    for user in User.objects.all():
        user.delete()
    print("Data cleared.")


def create_users():
    """Create test users with VVITU roll numbers."""
    print("\nCreating users...")
    
    users_data = [
        # Admin
        {
            'email': 'admin@vvit.net',
            'password': 'Admin@123',
            'first_name': 'System',
            'last_name': 'Admin',
            'role': 'admin',
            'department': 'cse',
            'phone': '9876543210',
            'is_verified': True,
            'avatar': 'https://ui-avatars.com/api/?name=System+Admin&background=E77E69&color=fff&size=200',
        },
        # Principal
        {
            'email': 'principal@vvit.net',
            'password': 'Principal@123',
            'first_name': 'Dr. Principal',
            'last_name': 'Kumar',
            'role': 'principal',
            'department': 'administration',
            'phone': '9876543211',
            'is_verified': True,
            'avatar': 'https://ui-avatars.com/api/?name=Dr+Principal+Kumar&background=4A90D9&color=fff&size=200',
        },
        # HOD
        {
            'email': 'hod.csm@vvit.net',
            'password': 'Hod@123',
            'first_name': 'Dr. Rajesh',
            'last_name': 'Sharma',
            'role': 'hod',
            'department': 'csm',
            'phone': '9876543212',
            'is_verified': True,
            'avatar': 'https://ui-avatars.com/api/?name=Dr+Rajesh+Sharma&background=2ECC71&color=fff&size=200',
        },
        # Counsellor
        {
            'email': 'counsellor.csm@vvit.net',
            'password': 'Counsellor@123',
            'first_name': 'Prof. Priya',
            'last_name': 'Reddy',
            'role': 'counsellor',
            'department': 'csm',
            'phone': '9876543213',
            'is_verified': True,
            'avatar': 'https://ui-avatars.com/api/?name=Prof+Priya+Reddy&background=9B59B6&color=fff&size=200',
        },
        
        # Students (Currently enrolled - 2022-2024 batches)
        {
            'email': 'rahul.kumar@vvit.net',
            'password': 'Student@123',
            'first_name': 'Rahul',
            'last_name': 'Kumar',
            'role': 'student',
            'department': 'csm',
            'phone': '9001234501',
            'avatar': 'https://randomuser.me/api/portraits/men/32.jpg',
            'roll_number': '22BQ1A4201',
            'batch_year': 2022,
            'current_year': 4,
            'cgpa': 8.7,
            'bio': 'Full-stack developer passionate about building scalable web apps. Active contributor to college coding club.',
            'location': 'Guntur, Andhra Pradesh',
            'skills': [
                {'name': 'React', 'proficiency': 'advanced'},
                {'name': 'Python', 'proficiency': 'advanced'},
                {'name': 'Django', 'proficiency': 'intermediate'},
                {'name': 'JavaScript', 'proficiency': 'advanced'},
                {'name': 'PostgreSQL', 'proficiency': 'intermediate'},
            ],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/rahul-kumar-vvit',
                'github': 'https://github.com/rahulkumar',
                'leetcode': 'https://leetcode.com/rahulkumar',
                'portfolio': 'https://rahulkumar.dev',
            },
            'interests': ['Web Development', 'AI/ML', 'Cloud Computing'],
            'certifications': [
                {'name': 'AWS Certified Solutions Architect', 'issuer': 'Amazon', 'date': '2024-05-20', 'link': ''},
                {'name': 'Meta Front-End Developer', 'issuer': 'Coursera', 'date': '2024-01-10', 'link': ''},
            ],
            'internships': [
                {'company': 'Zoho Corporation', 'role': 'Software Intern', 'startDate': '2024-05-01', 'endDate': '2024-07-31', 'description': 'Worked on Zoho CRM frontend using React and TypeScript.'},
            ],
        },
        {
            'email': 'sneha.sharma@vvit.net',
            'password': 'Student@123',
            'first_name': 'Sneha',
            'last_name': 'Sharma',
            'role': 'student',
            'department': 'csm',
            'phone': '9001234502',
            'avatar': 'https://randomuser.me/api/portraits/women/44.jpg',
            'roll_number': '22BQ1A4212',
            'batch_year': 2022,
            'current_year': 4,
            'cgpa': 9.1,
            'bio': 'Data science enthusiast and ML researcher. Published a paper on NLP at IEEE conference.',
            'location': 'Vijayawada, Andhra Pradesh',
            'skills': [
                {'name': 'Python', 'proficiency': 'advanced'},
                {'name': 'TensorFlow', 'proficiency': 'advanced'},
                {'name': 'Machine Learning', 'proficiency': 'advanced'},
                {'name': 'NLP', 'proficiency': 'intermediate'},
                {'name': 'SQL', 'proficiency': 'intermediate'},
            ],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/sneha-sharma-vvit',
                'github': 'https://github.com/snehasharma',
                'leetcode': 'https://leetcode.com/snehasharma',
            },
            'interests': ['Data Science', 'NLP', 'Research'],
            'certifications': [
                {'name': 'Deep Learning Specialization', 'issuer': 'Coursera (Andrew Ng)', 'date': '2024-03-15', 'link': ''},
                {'name': 'Google Data Analytics', 'issuer': 'Google', 'date': '2023-11-20', 'link': ''},
            ],
            'internships': [
                {'company': 'Infosys', 'role': 'Data Science Intern', 'startDate': '2024-06-01', 'endDate': '2024-08-31', 'description': 'Built ML models for customer churn prediction using scikit-learn.'},
            ],
        },
        {
            'email': 'amit.patel@vvit.net',
            'password': 'Student@123',
            'first_name': 'Amit',
            'last_name': 'Patel',
            'role': 'student',
            'department': 'csm',
            'phone': '9001234503',
            'avatar': 'https://randomuser.me/api/portraits/men/75.jpg',
            'roll_number': '22BQ1A4228',
            'batch_year': 2022,
            'current_year': 4,
            'cgpa': 8.3,
            'bio': 'Backend developer with a keen interest in microservices and DevOps. Active open-source contributor.',
            'location': 'Guntur, Andhra Pradesh',
            'skills': [
                {'name': 'Java', 'proficiency': 'advanced'},
                {'name': 'Spring Boot', 'proficiency': 'intermediate'},
                {'name': 'Docker', 'proficiency': 'intermediate'},
                {'name': 'Kubernetes', 'proficiency': 'beginner'},
                {'name': 'MongoDB', 'proficiency': 'intermediate'},
            ],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/amit-patel-vvit',
                'github': 'https://github.com/amitpatel',
                'codechef': 'https://codechef.com/users/amitpatel',
            },
            'interests': ['Backend Development', 'DevOps', 'Open Source'],
            'certifications': [
                {'name': 'Docker Certified Associate', 'issuer': 'Docker', 'date': '2024-02-10', 'link': ''},
            ],
            'internships': [],
        },
        {
            'email': 'priya.nair@vvit.net',
            'password': 'Student@123',
            'first_name': 'Priya',
            'last_name': 'Nair',
            'role': 'student',
            'department': 'ece',
            'phone': '9001234504',
            'avatar': 'https://randomuser.me/api/portraits/women/65.jpg',
            'roll_number': '23BQ1A0401',
            'batch_year': 2023,
            'current_year': 3,
            'cgpa': 8.9,
            'bio': 'Electronics enthusiast with a focus on IoT and embedded systems. Built a smart agriculture monitoring system.',
            'location': 'Guntur, Andhra Pradesh',
            'skills': [
                {'name': 'Embedded C', 'proficiency': 'advanced'},
                {'name': 'Arduino', 'proficiency': 'advanced'},
                {'name': 'Python', 'proficiency': 'intermediate'},
                {'name': 'VHDL', 'proficiency': 'intermediate'},
                {'name': 'IoT', 'proficiency': 'intermediate'},
            ],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/priya-nair-vvit',
                'github': 'https://github.com/priyanair',
            },
            'interests': ['IoT', 'Embedded Systems', 'Smart Agriculture'],
            'certifications': [
                {'name': 'Introduction to IoT', 'issuer': 'Cisco', 'date': '2024-01-15', 'link': ''},
            ],
            'internships': [],
        },
        {
            'email': 'karthik.reddy@vvit.net',
            'password': 'Student@123',
            'first_name': 'Karthik',
            'last_name': 'Reddy',
            'role': 'student',
            'department': 'ece',
            'phone': '9001234505',
            'avatar': 'https://randomuser.me/api/portraits/men/22.jpg',
            'roll_number': '23BQ1A0415',
            'batch_year': 2023,
            'current_year': 3,
            'cgpa': 8.5,
            'bio': 'VLSI design student with experience in Cadence and Synopsys tools. Aspiring chip designer.',
            'location': 'Hyderabad, Telangana',
            'skills': [
                {'name': 'Verilog', 'proficiency': 'advanced'},
                {'name': 'VLSI Design', 'proficiency': 'intermediate'},
                {'name': 'Cadence', 'proficiency': 'intermediate'},
                {'name': 'Python', 'proficiency': 'intermediate'},
                {'name': 'MATLAB', 'proficiency': 'intermediate'},
            ],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/karthik-reddy-vvit',
                'github': 'https://github.com/karthikreddy',
            },
            'interests': ['VLSI Design', 'Semiconductor', 'Signal Processing'],
            'certifications': [],
            'internships': [],
        },
        {
            'email': 'divya.singh@vvit.net',
            'password': 'Student@123',
            'first_name': 'Divya',
            'last_name': 'Singh',
            'role': 'student',
            'department': 'eee',
            'phone': '9001234506',
            'avatar': 'https://randomuser.me/api/portraits/women/28.jpg',
            'roll_number': '24BQ1A0201',
            'batch_year': 2024,
            'current_year': 2,
            'cgpa': 8.1,
            'bio': 'Aspiring power systems engineer. Interested in renewable energy and smart grid technologies.',
            'location': 'Guntur, Andhra Pradesh',
            'skills': [
                {'name': 'MATLAB', 'proficiency': 'intermediate'},
                {'name': 'Power Systems', 'proficiency': 'beginner'},
                {'name': 'Python', 'proficiency': 'beginner'},
                {'name': 'AutoCAD', 'proficiency': 'intermediate'},
            ],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/divya-singh-vvit',
            },
            'interests': ['Renewable Energy', 'Smart Grid', 'Power Electronics'],
            'certifications': [],
            'internships': [],
        },
        {
            'email': 'arjun.rao@vvit.net',
            'password': 'Student@123',
            'first_name': 'Arjun',
            'last_name': 'Rao',
            'role': 'student',
            'department': 'eee',
            'phone': '9001234507',
            'avatar': 'https://randomuser.me/api/portraits/men/45.jpg',
            'roll_number': '24BQ1A0218',
            'batch_year': 2024,
            'current_year': 2,
            'cgpa': 7.8,
            'bio': 'Interested in control systems and automation. Building a line-following robot for Robocon competition.',
            'location': 'Guntur, Andhra Pradesh',
            'skills': [
                {'name': 'C Programming', 'proficiency': 'intermediate'},
                {'name': 'Arduino', 'proficiency': 'intermediate'},
                {'name': 'Control Systems', 'proficiency': 'beginner'},
                {'name': 'MATLAB', 'proficiency': 'beginner'},
            ],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/arjun-rao-vvit',
                'github': 'https://github.com/arjunrao',
            },
            'interests': ['Robotics', 'Automation', 'Control Systems'],
            'certifications': [],
            'internships': [],
        },
        {
            'email': 'ananya.gupta@vvit.net',
            'password': 'Student@123',
            'first_name': 'Ananya',
            'last_name': 'Gupta',
            'role': 'student',
            'department': 'aiml',
            'phone': '9001234508',
            'avatar': 'https://randomuser.me/api/portraits/women/17.jpg',
            'roll_number': '24BQ5A6101',
            'batch_year': 2024,
            'current_year': 2,
            'cgpa': 8.6,
            'bio': 'AI/ML student exploring computer vision and generative models. Google Developer Student Clubs lead.',
            'location': 'Guntur, Andhra Pradesh',
            'skills': [
                {'name': 'Python', 'proficiency': 'advanced'},
                {'name': 'PyTorch', 'proficiency': 'intermediate'},
                {'name': 'Computer Vision', 'proficiency': 'intermediate'},
                {'name': 'TensorFlow', 'proficiency': 'beginner'},
                {'name': 'OpenCV', 'proficiency': 'intermediate'},
            ],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/ananya-gupta-vvit',
                'github': 'https://github.com/ananyagupta',
                'leetcode': 'https://leetcode.com/ananyagupta',
            },
            'interests': ['Computer Vision', 'Generative AI', 'Deep Learning'],
            'certifications': [
                {'name': 'TensorFlow Developer Certificate', 'issuer': 'Google', 'date': '2024-08-01', 'link': ''},
            ],
            'internships': [],
        },
        
        # Alumni (Graduated before 2026)
        {
            'email': 'aditya.verma@vvit.net',
            'password': 'Alumni@123',
            'first_name': 'Aditya',
            'last_name': 'Verma',
            'role': 'alumni',
            'department': 'csm',
            'phone': '9002345601',
            'avatar': 'https://randomuser.me/api/portraits/men/52.jpg',
            'roll_number': '18BQ1A4202',
            'graduation_year': 2022,
            'company': 'TCS',
            'position': 'Software Engineer',
            'location': 'Bangalore',
            'bio': 'Software Engineer at TCS Digital with 2+ years of experience in enterprise Java development. Passionate about mentoring juniors from VVITU.',
            'industry': 'Information Technology',
            'experience_years': 2,
            'skills': ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Docker', 'SQL'],
            'expertise_areas': ['Software Development', 'System Design', 'Microservices Architecture'],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/aditya-verma-tcs',
                'github': 'https://github.com/adityaverma',
                'twitter': 'https://twitter.com/adityaverma_dev',
                'portfolio': 'https://adityaverma.dev',
            },
            'work_experience': [
                {'company': 'TCS Digital', 'role': 'Software Engineer', 'location': 'Bangalore', 'startDate': '2022-07-01', 'endDate': '', 'current': True, 'description': 'Building enterprise microservices with Spring Boot and AWS. Leading a team of 3 junior developers.'},
                {'company': 'TCS', 'role': 'Trainee', 'location': 'Chennai', 'startDate': '2022-01-15', 'endDate': '2022-06-30', 'current': False, 'description': 'Completed 6-month training in Java full-stack development.'},
            ],
            'achievements': [
                {'title': 'TCS Star Performer Award', 'description': 'Recognized for delivering critical project ahead of deadline', 'date': '2023-12-01'},
            ],
        },
        {
            'email': 'pooja.menon@vvit.net',
            'password': 'Alumni@123',
            'first_name': 'Pooja',
            'last_name': 'Menon',
            'role': 'alumni',
            'department': 'csm',
            'phone': '9002345602',
            'avatar': 'https://randomuser.me/api/portraits/women/56.jpg',
            'roll_number': '18BQ1A4225',
            'graduation_year': 2022,
            'company': 'Amazon',
            'position': 'SDE-II',
            'location': 'Hyderabad',
            'bio': 'SDE-II at Amazon working on AWS Lambda and serverless technologies. Active in women-in-tech communities.',
            'industry': 'Cloud Computing',
            'experience_years': 3,
            'skills': ['Python', 'AWS', 'Serverless', 'TypeScript', 'Node.js', 'DynamoDB'],
            'expertise_areas': ['Cloud Architecture', 'Serverless Computing', 'Backend Development'],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/pooja-menon-amazon',
                'github': 'https://github.com/poojamenon',
                'twitter': 'https://twitter.com/pooja_tech',
            },
            'work_experience': [
                {'company': 'Amazon', 'role': 'SDE-II', 'location': 'Hyderabad', 'startDate': '2023-08-01', 'endDate': '', 'current': True, 'description': 'Leading serverless migration for AWS Lambda service. Reduced latency by 40%.'},
                {'company': 'Amazon', 'role': 'SDE-I', 'location': 'Hyderabad', 'startDate': '2022-06-01', 'endDate': '2023-07-31', 'current': False, 'description': 'Developed internal tooling for AWS CloudFormation team using Python and TypeScript.'},
            ],
            'achievements': [
                {'title': 'Amazon Bar Raiser', 'description': 'Certified Bar Raiser for interviewing candidates', 'date': '2024-01-15'},
            ],
        },
        {
            'email': 'vikram.joshi@vvit.net',
            'password': 'Alumni@123',
            'first_name': 'Vikram',
            'last_name': 'Joshi',
            'role': 'alumni',
            'department': 'csm',
            'phone': '9002345603',
            'avatar': 'https://randomuser.me/api/portraits/men/67.jpg',
            'roll_number': '19BQ1A4210',
            'graduation_year': 2023,
            'company': 'Google',
            'position': 'Software Engineer',
            'location': 'Bangalore',
            'bio': 'Software Engineer at Google working on Search infrastructure. Competitive programming enthusiast with Codeforces rating 1900+.',
            'industry': 'Information Technology',
            'experience_years': 1,
            'skills': ['C++', 'Python', 'Go', 'Distributed Systems', 'gRPC', 'BigQuery'],
            'expertise_areas': ['Distributed Systems', 'Search Infrastructure', 'Competitive Programming'],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/vikram-joshi-google',
                'github': 'https://github.com/vikramjoshi',
                'leetcode': 'https://leetcode.com/vikramjoshi',
            },
            'work_experience': [
                {'company': 'Google', 'role': 'Software Engineer', 'location': 'Bangalore', 'startDate': '2023-07-01', 'endDate': '', 'current': True, 'description': 'Working on Google Search ranking infrastructure using C++ and Python.'},
            ],
            'achievements': [
                {'title': 'ACM ICPC Regionalist', 'description': 'Reached Asia Regional round of ACM ICPC 2022', 'date': '2022-12-01'},
                {'title': 'Google Spot Bonus', 'description': 'Awarded for shipping critical search quality improvement', 'date': '2024-03-01'},
            ],
        },
        {
            'email': 'neha.kapoor@vvit.net',
            'password': 'Alumni@123',
            'first_name': 'Neha',
            'last_name': 'Kapoor',
            'role': 'alumni',
            'department': 'ece',
            'phone': '9002345604',
            'avatar': 'https://randomuser.me/api/portraits/women/33.jpg',
            'roll_number': '19BQ1A0501',
            'graduation_year': 2023,
            'company': 'Microsoft',
            'position': 'Software Development Engineer',
            'location': 'Hyderabad',
            'bio': 'SDE at Microsoft working on Azure IoT platform. Passionate about bridging hardware and software.',
            'industry': 'Cloud Computing',
            'experience_years': 1,
            'skills': ['C#', '.NET', 'Azure', 'Python', 'IoT', 'React'],
            'expertise_areas': ['IoT Platforms', 'Cloud Services', 'Full-Stack Development'],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/neha-kapoor-msft',
                'github': 'https://github.com/nehakapoor',
            },
            'work_experience': [
                {'company': 'Microsoft', 'role': 'Software Development Engineer', 'location': 'Hyderabad', 'startDate': '2023-07-15', 'endDate': '', 'current': True, 'description': 'Building Azure IoT Hub features for enterprise customers. Working with C#, .NET, and React.'},
            ],
            'achievements': [
                {'title': 'Microsoft Hackathon Winner', 'description': 'Won internal hackathon for building an IoT anomaly detection system', 'date': '2024-02-01'},
            ],
        },
        {
            'email': 'rohit.das@vvit.net',
            'password': 'Alumni@123',
            'first_name': 'Rohit',
            'last_name': 'Das',
            'role': 'alumni',
            'department': 'ece',
            'phone': '9002345605',
            'avatar': 'https://randomuser.me/api/portraits/men/88.jpg',
            'roll_number': '20BQ1A0408',
            'graduation_year': 2024,
            'company': 'Qualcomm',
            'position': 'Hardware Engineer',
            'location': 'Bangalore',
            'bio': 'Hardware Engineer at Qualcomm designing 5G modem chips. VLSI and RTL design specialist.',
            'industry': 'Semiconductor',
            'experience_years': 1,
            'skills': ['Verilog', 'SystemVerilog', 'UVM', 'VLSI', 'Python', 'FPGA'],
            'expertise_areas': ['VLSI Design', 'RTL Verification', '5G Modem Design'],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/rohit-das-qualcomm',
                'github': 'https://github.com/rohitdas',
            },
            'work_experience': [
                {'company': 'Qualcomm', 'role': 'Hardware Engineer', 'location': 'Bangalore', 'startDate': '2024-07-01', 'endDate': '', 'current': True, 'description': 'Working on 5G modem RTL design and verification using SystemVerilog/UVM.'},
            ],
            'achievements': [],
        },
        {
            'email': 'meera.iyer@vvit.net',
            'password': 'Alumni@123',
            'first_name': 'Meera',
            'last_name': 'Iyer',
            'role': 'alumni',
            'department': 'eee',
            'phone': '9002345606',
            'avatar': 'https://randomuser.me/api/portraits/women/71.jpg',
            'roll_number': '21BQ5A0419',
            'graduation_year': 2024,
            'company': 'Texas Instruments',
            'position': 'Embedded Systems Engineer',
            'location': 'Bangalore',
            'bio': 'Embedded Systems Engineer at TI working on motor control solutions. Published paper on efficient PID controllers.',
            'industry': 'Semiconductor',
            'experience_years': 1,
            'skills': ['Embedded C', 'ARM Cortex', 'RTOS', 'PCB Design', 'MATLAB', 'Python'],
            'expertise_areas': ['Embedded Systems', 'Motor Control', 'Power Electronics'],
            'social_profiles': {
                'linkedin': 'https://linkedin.com/in/meera-iyer-ti',
                'github': 'https://github.com/meeraiyer',
            },
            'work_experience': [
                {'company': 'Texas Instruments', 'role': 'Embedded Systems Engineer', 'location': 'Bangalore', 'startDate': '2024-06-15', 'endDate': '', 'current': True, 'description': 'Developing firmware for TI motor control MCUs. Working with C2000 real-time microcontrollers.'},
            ],
            'achievements': [
                {'title': 'IEEE Paper Published', 'description': 'Published paper on adaptive PID controllers for BLDC motors at IEEE INDICON 2023', 'date': '2023-12-15'},
            ],
        },
    ]
    
    created_users = {}
    for user_data in users_data:
        password = user_data.pop('password')
        roll_number = user_data.pop('roll_number', None)
        batch_year = user_data.pop('batch_year', None)
        current_year = user_data.pop('current_year', None)
        cgpa = user_data.pop('cgpa', None)
        graduation_year = user_data.pop('graduation_year', None)
        company = user_data.pop('company', None)
        position = user_data.pop('position', None)
        location = user_data.pop('location', None)
        
        # Extract enriched profile fields
        bio = user_data.pop('bio', '')
        skills = user_data.pop('skills', [])
        social_profiles = user_data.pop('social_profiles', {})
        interests = user_data.pop('interests', [])
        certifications = user_data.pop('certifications', [])
        internships = user_data.pop('internships', [])
        industry = user_data.pop('industry', '')
        experience_years = user_data.pop('experience_years', 0)
        expertise_areas = user_data.pop('expertise_areas', [])
        work_experience = user_data.pop('work_experience', [])
        achievements = user_data.pop('achievements', [])
        
        user = User.objects.create_user(**user_data)
        user.set_password(password)
        user.is_verified = True
        user.is_active = True
        user.save()
        created_users[user.email] = user
        
        # Create profiles
        if user.role == 'student' and roll_number:
            StudentProfile.objects.create(
                user=user,
                roll_number=roll_number,
                batch_year=batch_year,
                graduation_year=batch_year + 4 if batch_year else None,
                current_year=current_year,
                current_semester=(current_year * 2) if current_year else 1,
                cgpa=cgpa,
                location=location or '',
                profile_picture=user.avatar or '',
                bio=bio,
                skills=skills,
                interests=interests,
                social_profiles=social_profiles,
                certifications=certifications,
                internships=internships,
            )
        elif user.role == 'alumni' and roll_number:
            AlumniProfile.objects.create(
                user=user,
                roll_number=roll_number,
                graduation_year=graduation_year,
                current_company=company,
                current_designation=position,
                location=location,
                profile_picture=user.avatar or '',
                industry=industry,
                experience_years=experience_years or (datetime.now().year - graduation_year if graduation_year else 0),
                bio=bio,
                skills=skills,
                expertise_areas=expertise_areas,
                social_profiles=social_profiles,
                work_experience=work_experience,
                achievements=achievements,
                available_for_mentoring=True,
                available_for_referrals=True,
                verification_status='verified'
            )
            user.is_verified = True
            user.save()
    
    print(f"Created {len(created_users)} users")
    return created_users


def create_blogs(users):
    """Create sample blogs."""
    print("\nCreating blogs...")
    
    alumni_users = [u for u in users.values() if u.role == 'alumni']
    if not alumni_users:
        print("No alumni found, skipping blogs")
        return
    
    blogs_data = [
        {
            'author': alumni_users[0],
            'title': 'My Journey from VVITU to Tech Giant',
            'content': '''When I joined VVITU in 2018, I had dreams but wasn't sure how to achieve them. 
            
Today, working at a top tech company, I can confidently say that VVITU provided the perfect foundation. Here's my story...

## Early Days

The first year was challenging. Adapting to college life, understanding the curriculum, and finding my passion - it was overwhelming. But our professors and mentors guided us through.

## The Turning Point

In my second year, I joined the coding club and started participating in hackathons. This exposure changed everything. I learned about real-world problem-solving and teamwork.

## Internships and Learning

Summer internships were crucial. I interned at a startup in my third year, which taught me more than any classroom ever could. The hands-on experience was invaluable.

## Placement Preparation

The placement cell at VVITU was extremely supportive. Mock interviews, resume building workshops, and constant guidance helped me prepare thoroughly.

## Key Takeaways

1. Never stop learning
2. Build projects, not just grades
3. Network with seniors and alumni
4. Participate in extracurricular activities
5. Stay consistent and persistent

To all current students: Your journey is unique. Make the most of every opportunity!''',
            'excerpt': 'From a nervous freshman to landing my dream job - here\'s how VVITU shaped my career.',
            'category': 'Career',
            'tags': ['Career', 'Journey', 'Placement', 'Advice']
        },
        {
            'author': alumni_users[1] if len(alumni_users) > 1 else alumni_users[0],
            'title': 'Top 5 Skills Every Engineering Student Must Have',
            'content': '''As an alumnus working in the industry for 3+ years, I've realized that technical knowledge alone isn't enough. Here are the top 5 skills that will set you apart:

## 1. Communication Skills

Being able to explain complex technical concepts in simple terms is crucial. Practice this by:
- Writing technical blogs
- Giving presentations
- Participating in group discussions

## 2. Problem-Solving Ability

Employers value candidates who can think critically. Improve this by:
- Solving coding problems regularly
- Participating in hackathons
- Working on real-world projects

## 3. Teamwork and Collaboration

Almost all projects involve teams. Learn to:
- Work with different personalities
- Give and receive constructive feedback
- Use collaboration tools like Git, Jira

## 4. Continuous Learning

Technology evolves rapidly. Stay updated by:
- Following industry blogs and podcasts
- Taking online courses
- Attending tech conferences

## 5. Time Management

Balancing academics, projects, and personal life is essential. Practice by:
- Setting realistic goals
- Prioritizing tasks
- Using productivity tools

Start developing these skills today. Your future self will thank you!''',
            'excerpt': 'Beyond technical knowledge - essential skills for a successful engineering career.',
            'category': 'Skills',
            'tags': ['Skills', 'Career Development', 'Advice', 'Students']
        }
    ]
    
    from django.utils import timezone
    for blog_data in blogs_data:
        blog_data['status'] = 'published'
        blog_data['published_at'] = timezone.now()
        Blog.objects.create(**blog_data)
    
    print(f"Created {len(blogs_data)} blogs")


def create_jobs(users):
    """Create sample job postings."""
    print("\nCreating jobs...")
    
    alumni_users = [u for u in users.values() if u.role == 'alumni']
    if not alumni_users:
        print("No alumni found, skipping jobs")
        return
    
    jobs_data = [
        {
            'posted_by': alumni_users[0],
            'title': 'Software Development Engineer',
            'company': 'TCS Digital',
            'location': 'Hyderabad',
            'job_type': 'full_time',
            'description': '''We are looking for talented Software Development Engineers to join our team!

**About TCS Digital:**
TCS Digital is the digital transformation arm of Tata Consultancy Services, working on cutting-edge technologies and innovative solutions.

**Responsibilities:**
- Design and develop scalable web applications
- Write clean, maintainable code
- Collaborate with cross-functional teams
- Participate in code reviews
- Debug and fix production issues

**Work Culture:**
- Hybrid work model
- Learning and development opportunities
- Great work-life balance
- Excellent benefits package''',
            'requirements': '''- B.Tech/BE in Computer Science or related field
- Strong programming skills in Java/Python/JavaScript
- Understanding of data structures and algorithms
- Good problem-solving abilities
- Excellent communication skills''',
            'skills_required': ['Java', 'Python', 'Spring Boot', 'React', 'SQL'],
            'salary_min': 600000,
            'salary_max': 800000,
            'deadline': datetime(2026, 3, 15).date()
        },
        {
            'posted_by': alumni_users[1] if len(alumni_users) > 1 else alumni_users[0],
            'title': 'Data Science Intern',
            'company': 'Amazon',
            'location': 'Bangalore',
            'job_type': 'internship',
            'description': '''Amazon is hiring Data Science Interns for Summer 2026!

**About the Role:**
Work on real-world machine learning problems at Amazon scale. You'll be part of a team building ML models that impact millions of customers.

**What You'll Do:**
- Analyze large datasets to extract insights
- Build and evaluate ML models
- Work with senior data scientists
- Present findings to stakeholders

**What We Offer:**
- Stipend: ₹50,000/month
- 6-month internship
- Pre-placement offer possibility
- Mentorship from industry experts
- Access to AWS resources''',
            'requirements': '''- Currently pursuing B.Tech/M.Tech
- Strong foundation in mathematics and statistics
- Experience with Python and ML libraries
- Knowledge of SQL
- Previous internship experience is a plus''',
            'skills_required': ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Statistics'],
            'salary_min': 50000,
            'salary_max': 50000,
            'deadline': datetime(2026, 2, 28).date()
        },
        {
            'posted_by': alumni_users[2] if len(alumni_users) > 2 else alumni_users[0],
            'title': 'Frontend Developer',
            'company': 'Google',
            'location': 'Bangalore',
            'job_type': 'full_time',
            'description': '''Join Google's frontend team and build products used by billions!

**About Google:**
At Google, we work on products that impact the lives of people globally. Our frontend team creates beautiful, responsive, and accessible web applications.

**Role Description:**
As a Frontend Developer, you'll be responsible for building user-facing features and ensuring exceptional user experience.

**Responsibilities:**
- Develop new user-facing features
- Build reusable code and libraries
- Optimize applications for speed and scalability
- Collaborate with designers and backend engineers
- Ensure technical feasibility of UI/UX designs

**Why Google:**
- Competitive compensation
- World-class benefits
- Learning and growth opportunities
- Work with the best engineers
- Impact billions of users''',
            'requirements': '''- B.Tech/M.Tech in Computer Science or equivalent
- 2+ years of frontend development experience
- Expert knowledge of JavaScript, HTML, CSS
- Experience with modern frameworks (React, Vue, Angular)
- Strong understanding of web performance
- Portfolio of impressive projects''',
            'skills_required': ['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML', 'Web Performance'],
            'salary_min': 2000000,
            'salary_max': 3000000,
            'deadline': datetime(2026, 3, 31).date()
        }
    ]
    
    for job_data in jobs_data:
        Job.objects.create(**job_data)
    
    print(f"Created {len(jobs_data)} jobs")


def create_events(users):
    """Create sample events."""
    print("\nCreating events...")
    
    admin_user = User.objects.filter(role='admin').first()
    if not admin_user:
        print("No admin found, skipping events")
        return
    
    events_data = [
        {
            'title': 'Annual Alumni Meet 2024',
            'description': '''Join us for the Annual Alumni Meet 2024!

**Event Highlights:**
- Networking opportunities
- Panel discussions with industry leaders
- Cultural performances
- Dinner and awards ceremony

**Schedule:**
- 10:00 AM - Registration
- 11:00 AM - Welcome address
- 12:00 PM - Panel discussions
- 2:00 PM - Lunch
- 4:00 PM - Networking session
- 7:00 PM - Cultural program and dinner

All alumni and current students are welcome!''',
            'created_by': admin_user,
            'start_datetime': datetime(2026, 4, 14, 10, 0),
            'end_datetime': datetime(2026, 4, 14, 20, 0),
            'venue': 'College Auditorium',
            'event_type': 'meetup',
            'is_online': False,
            'max_attendees': 500
        },
        {
            'title': 'Campus Recruitment Drive 2024',
            'description': '''Annual Campus Recruitment Drive for final year students.

**Participating Companies:**
- Google
- Amazon
- Microsoft
- Flipkart
- And many more...

**Eligibility:**
- Final year B.Tech/M.Tech students
- Minimum 7.0 CGPA
- No active backlogs

**Documents required:**
- Resume
- Academic transcripts
- ID proof

Prepare well and good luck!''',
            'created_by': admin_user,
            'start_datetime': datetime(2026, 3, 15, 9, 0),
            'end_datetime': datetime(2026, 3, 15, 18, 0),
            'venue': 'College Campus',
            'event_type': 'other',
            'is_online': False,
            'max_attendees': 1000
        },
        {
            'title': 'Tech Talk: Future of AI',
            'description': '''Join us for an exciting tech talk on the Future of Artificial Intelligence.

**Speaker:** Dr. Sarah Johnson, AI Research Lead at OpenAI

**Topics covered:**
- Current state of AI
- Large Language Models
- AI in industry applications
- Career opportunities in AI

**Who should attend:**
- Students interested in AI/ML
- Researchers
- Industry professionals

Q&A session included!''',
            'created_by': admin_user,
            'start_datetime': datetime(2026, 2, 28, 17, 0),
            'end_datetime': datetime(2026, 2, 28, 19, 0),
            'venue': 'Online (Zoom)',
            'event_type': 'webinar',
            'is_online': True,
            'max_attendees': 1000
        }
    ]
    
    for event_data in events_data:
        Event.objects.create(**event_data)
    
    print(f"Created {len(events_data)} events")


def main():
    """Main function to seed all data."""
    print("=" * 50)
    print("VVITU Alumni Connect - Django Data Seeding")
    print("=" * 50)
    
    # Clear existing data first
    clear_data()
    
    # Create all data
    users = create_users()
    create_blogs(users)
    create_jobs(users)
    create_events(users)
    
    print("\n" + "=" * 50)
    print("Data seeding completed successfully!")
    print("=" * 50)
    print("\nSummary:")
    print(f"- Total users: {User.objects.count()}")
    print(f"- Students: {User.objects.filter(role='student').count()}")
    print(f"- Alumni: {User.objects.filter(role='alumni').count()}")
    print(f"- Blogs: {Blog.objects.count()}")
    print(f"- Jobs: {Job.objects.count()}")
    print(f"- Events: {Event.objects.count()}")
    print("\nYou can now login with:")
    print("Admin: admin@vvit.net / Admin@123")
    print("Student: rahul.kumar@vvit.net / Student@123")
    print("Alumni: aditya.verma@vvit.net / Alumni@123")


if __name__ == '__main__':
    main()
