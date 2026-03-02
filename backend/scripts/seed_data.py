"""
Seed data script for MongoDB.
Run with: python seed_data.py
"""
import os
import sys
from datetime import datetime, timedelta

# Add the backend directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Set up Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from common.models import User, StudentProfile, AlumniProfile, Blog, Job, Event


def clear_data():
    """Clear existing data."""
    print("Clearing existing data...")
    Event.objects.delete()
    Job.objects.delete()
    Blog.objects.delete()
    AlumniProfile.objects.delete()
    StudentProfile.objects.delete()
    User.objects.delete()
    print("Data cleared.")


def create_users():
    """Create test users with VVITU roll numbers."""
    print("\nCreating users...")
    
    # Current date: Feb 2026
    # Students: 22-25 batches (currently enrolled)
    # Alumni: 18-21 batches (graduated before 2026)
    
    users = [
        # Admin
        {
            'email': 'admin@vvit.net',
            'password': 'Admin@123',
            'first_name': 'System',
            'last_name': 'Admin',
            'role': 'admin',
            'department': 'administration',
            'is_verified': True
        },
        # Staff
        {
            'email': 'counsellor@vvit.net',
            'password': 'Counsellor@123',
            'first_name': 'Dr. Meena',
            'last_name': 'Iyer',
            'role': 'counsellor',
            'department': 'csm',
            'is_verified': True
        },
        {
            'email': 'hod@vvit.net',
            'password': 'HOD@123',
            'first_name': 'Prof. Suresh',
            'last_name': 'Reddy',
            'role': 'hod',
            'department': 'csm',
            'is_verified': True
        },
        {
            'email': 'principal@vvit.net',
            'password': 'Principal@123',
            'first_name': 'Dr. Ramesh',
            'last_name': 'Gupta',
            'role': 'principal',
            'department': 'administration',
            'is_verified': True
        },
        
        # STUDENTS (Currently enrolled in Feb 2026)
        # 2022 Batch - 4th Year (Graduate in 2026)
        {
            'email': '22bq1a4201@vvit.net',
            'password': 'Student@123',
            'first_name': 'Venkata Sai',
            'last_name': 'Krishna',
            'role': 'student',
            'department': 'csm',
            'is_verified': True
        },
        {
            'email': '22bq1a4215@vvit.net',
            'password': 'Student@123',
            'first_name': 'Divya',
            'last_name': 'Reddy',
            'role': 'student',
            'department': 'csm',
            'is_verified': True
        },
        {
            'email': '22bq1a4228@vvit.net',
            'password': 'Student@123',
            'first_name': 'Akhil',
            'last_name': 'Kumar',
            'role': 'student',
            'department': 'csm',
            'is_verified': True
        },
        
        # 2023 Batch - 3rd Year (Graduate in 2027)
        {
            'email': '23bq1a0401@vvit.net',
            'password': 'Student@123',
            'first_name': 'Sravya',
            'last_name': 'Naidu',
            'role': 'student',
            'department': 'ece',
            'is_verified': True
        },
        {
            'email': '23bq1a0415@vvit.net',
            'password': 'Student@123',
            'first_name': 'Praveen',
            'last_name': 'Chowdary',
            'role': 'student',
            'department': 'ece',
            'is_verified': True
        },
        
        # 2024 Batch - 2nd Year (Graduate in 2028)
        {
            'email': '24bq1a0201@vvit.net',
            'password': 'Student@123',
            'first_name': 'Keerthi',
            'last_name': 'Prasad',
            'role': 'student',
            'department': 'eee',
            'is_verified': True
        },
        {
            'email': '24bq1a0218@vvit.net',
            'password': 'Student@123',
            'first_name': 'Tarun',
            'last_name': 'Varma',
            'role': 'student',
            'department': 'eee',
            'is_verified': True
        },
        
        # 2024 Lateral Entry - 2nd Year (Graduate in 2027 - 3 year course)
        {
            'email': '24bq5a6101@vvit.net',
            'password': 'Student@123',
            'first_name': 'Lakshmi',
            'last_name': 'Devi',
            'role': 'student',
            'department': 'aiml',
            'is_verified': True
        },
        
        # ALUMNI (Graduated before 2026)
        # 2018 Batch - Graduated 2022
        {
            'email': '18bq1a4202@vvit.net',
            'password': 'Alumni@123',
            'first_name': 'Ravi',
            'last_name': 'Kumar',
            'role': 'alumni',
            'department': 'csm',
            'is_verified': True
        },
        {
            'email': '18bq1a4225@vvit.net',
            'password': 'Alumni@123',
            'first_name': 'Sowmya',
            'last_name': 'Reddy',
            'role': 'alumni',
            'department': 'csm',
            'is_verified': True
        },
        
        # 2019 Batch - Graduated 2023
        {
            'email': '19bq1a4210@vvit.net',
            'password': 'Alumni@123',
            'first_name': 'Mahesh',
            'last_name': 'Chowdary',
            'role': 'alumni',
            'department': 'csm',
            'is_verified': True
        },
        {
            'email': '19bq1a0501@vvit.net',
            'password': 'Alumni@123',
            'first_name': 'Ananya',
            'last_name': 'Sharma',
            'role': 'alumni',
            'department': 'cse',
            'is_verified': True
        },
        
        # 2020 Batch - Graduated 2024
        {
            'email': '20bq1a0408@vvit.net',
            'password': 'Alumni@123',
            'first_name': 'Srikanth',
            'last_name': 'Naidu',
            'role': 'alumni',
            'department': 'ece',
            'is_verified': True
        },
        
        # 2021 Lateral - Graduated 2024 (3 year course)
        {
            'email': '21bq5a0419@vvit.net',
            'password': 'Alumni@123',
            'first_name': 'Bhavana',
            'last_name': 'Prasad',
            'role': 'alumni',
            'department': 'ece',
            'is_verified': True
        },
    ]
    
    created_users = {}
    for user_data in users:
        password = user_data.pop('password')
        user = User(**user_data)
        user.set_password(password)
        user.save()
        created_users[user_data['email']] = user
        print(f"  Created user: {user_data['email']} ({user_data['role']}) - Dept: {user_data.get('department', 'N/A')}")
    
    return created_users


def create_student_profiles(users):
    """Create student profiles with correct VVITU data."""
    print("\nCreating student profiles...")
    
    # Feb 2026: Currently enrolled students
    profiles = [
        # 2022 Batch - 4th Year (CSM - AI/ML Specialization)
        {
            'user': users['22bq1a4201@vvit.net'],
            'roll_no': '22BQ1A4201',
            'department': 'csm',
            'year': 4,
            'current_year': 4,
            'current_semester': 7,
            'cgpa': 8.7,
            'phone': '9876543201',
            'skills': ['Python', 'Machine Learning', 'React', 'Node.js', 'TensorFlow', 'Docker'],
            'certifications': ['AWS Cloud Practitioner', 'Google IT Support', 'TensorFlow Developer'],
            'career_interest': 'Full Stack Development with AI',
            'linkedin': 'https://linkedin.com/in/venkata-sai-krishna',
            'github': 'https://github.com/vskrishna',
            'bio': 'Passionate about AI and full stack development. Final year CSM student.',
            'city': 'Guntur',
            'state': 'Andhra Pradesh'
        },
        {
            'user': users['22bq1a4215@vvit.net'],
            'roll_no': '22BQ1A4215',
            'department': 'csm',
            'year': 4,
            'current_year': 4,
            'current_semester': 7,
            'cgpa': 9.1,
            'phone': '9876543202',
            'skills': ['Python', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'PyTorch'],
            'certifications': ['Deep Learning Specialization', 'AWS ML Specialty', 'Kaggle Expert'],
            'career_interest': 'Machine Learning & AI Research',
            'linkedin': 'https://linkedin.com/in/divya-reddy',
            'github': 'https://github.com/divyareddy',
            'bio': 'AI enthusiast with focus on NLP and computer vision. Top performer in class.',
            'city': 'Vijayawada',
            'state': 'Andhra Pradesh'
        },
        {
            'user': users['22bq1a4228@vvit.net'],
            'roll_no': '22BQ1A4228',
            'department': 'csm',
            'year': 4,
            'current_year': 4,
            'current_semester': 7,
            'cgpa': 8.3,
            'phone': '9876543203',
            'skills': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python', 'CI/CD'],
            'certifications': ['AWS Solutions Architect', 'Kubernetes Admin', 'Docker Certified'],
            'career_interest': 'Cloud Computing & DevOps',
            'linkedin': 'https://linkedin.com/in/akhil-kumar',
            'github': 'https://github.com/akhilkumar',
            'bio': 'Cloud and DevOps enthusiast. Love automating everything.',
            'city': 'Guntur',
            'state': 'Andhra Pradesh'
        },
        
        # 2023 Batch - 3rd Year (ECE)
        {
            'user': users['23bq1a0401@vvit.net'],
            'roll_no': '23BQ1A0401',
            'department': 'ece',
            'year': 3,
            'current_year': 3,
            'current_semester': 5,
            'cgpa': 8.9,
            'phone': '9876543204',
            'skills': ['Verilog', 'VLSI Design', 'Embedded C', 'PCB Design', 'FPGA', 'ARM'],
            'certifications': ['Embedded Systems Certificate', 'PCB Design Pro'],
            'career_interest': 'VLSI Design & Chip Architecture',
            'linkedin': 'https://linkedin.com/in/sravya-naidu',
            'github': 'https://github.com/sravyanaidu',
            'bio': 'Passionate about chip design and embedded systems.',
            'city': 'Vijayawada',
            'state': 'Andhra Pradesh'
        },
        {
            'user': users['23bq1a0415@vvit.net'],
            'roll_no': '23BQ1A0415',
            'department': 'ece',
            'year': 3,
            'current_year': 3,
            'current_semester': 5,
            'cgpa': 8.5,
            'phone': '9876543205',
            'skills': ['IoT', 'Arduino', 'Raspberry Pi', 'Embedded C', 'Python', 'MQTT'],
            'certifications': ['IoT and Embedded Systems', 'AWS IoT Core'],
            'career_interest': 'IoT & Embedded Systems',
            'linkedin': 'https://linkedin.com/in/praveen-chowdary',
            'github': 'https://github.com/praveenchowdary',
            'bio': 'IoT and embedded systems enthusiast. Love building smart devices.',
            'city': 'Guntur',
            'state': 'Andhra Pradesh'
        },
        
        # 2024 Batch - 2nd Year (EEE)
        {
            'user': users['24bq1a0201@vvit.net'],
            'roll_no': '24BQ1A0201',
            'department': 'eee',
            'year': 2,
            'current_year': 2,
            'current_semester': 3,
            'cgpa': 8.1,
            'phone': '9876543206',
            'skills': ['MATLAB', 'Python', 'Power Systems', 'Circuit Analysis', 'Simulink'],
            'certifications': ['MATLAB Programming', 'Electrical Safety'],
            'career_interest': 'Power Systems & Renewable Energy',
            'linkedin': 'https://linkedin.com/in/keerthi-prasad',
            'github': 'https://github.com/keerthiprasad',
            'bio': 'Interested in power systems and renewable energy technologies.',
            'city': 'Vijayawada',
            'state': 'Andhra Pradesh'
        },
        {
            'user': users['24bq1a0218@vvit.net'],
            'roll_no': '24BQ1A0218',
            'department': 'eee',
            'year': 2,
            'current_year': 2,
            'current_semester': 3,
            'cgpa': 7.8,
            'phone': '9876543207',
            'skills': ['Control Systems', 'PLC', 'SCADA', 'MATLAB', 'Python'],
            'certifications': ['PLC Programming', 'Industrial Automation'],
            'career_interest': 'Control Systems & Automation',
            'linkedin': 'https://linkedin.com/in/tarun-varma',
            'github': 'https://github.com/tarunvarma',
            'bio': 'Fascinated by control systems and industrial automation.',
            'city': 'Guntur',
            'state': 'Andhra Pradesh'
        },
        
        # 2024 Lateral Entry - 2nd Year (AIML)
        {
            'user': users['24bq5a6101@vvit.net'],
            'roll_no': '24BQ5A6101',
            'department': 'aiml',
            'year': 2,
            'current_year': 2,
            'current_semester': 3,
            'cgpa': 8.6,
            'phone': '9876543208',
            'skills': ['Python', 'Machine Learning', 'Data Science', 'SQL', 'Pandas', 'Scikit-learn'],
            'certifications': ['Data Science Professional', 'Python for Data Science'],
            'career_interest': 'Data Science & AI',
            'linkedin': 'https://linkedin.com/in/lakshmi-devi',
            'github': 'https://github.com/lakshmidevi',
            'bio': 'Lateral entry student passionate about data science and AI.',
            'city': 'Vijayawada',
            'state': 'Andhra Pradesh'
        }
    ]
    
    for profile_data in profiles:
        profile = StudentProfile(**profile_data)
        profile.save()
        print(f"  Created: {profile_data['roll_no']} - {profile_data['user'].full_name} ({profile_data['department'].upper()}) Year {profile_data['year']}")
        print(f"    → Passout: {profile.completion_year}, CGPA: {profile_data['cgpa']}")


def create_alumni_profiles(users):
    """Create alumni profiles with correct VVITU data."""
    print("\nCreating alumni profiles...")
    
    # Feb 2026: Alumni who have already graduated
    profiles = [
        # 2018 Batch - Graduated 2022 (CSM)
        {
            'user': users['18bq1a4202@vvit.net'],
            'roll_no': '18BQ1A4202',
            'department': 'csm',
            'phone': '9876543210',
            'current_company': 'Tata Consultancy Services',
            'current_position': 'Senior Software Engineer',
            'location': 'Hyderabad, Telangana',
            'joined_year': 2022,
            'skills': ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Docker', 'Kubernetes'],
            'industries': ['IT Services', 'Cloud Computing'],
            'linkedin': 'https://linkedin.com/in/ravi-kumar-vvit',
            'github': 'https://github.com/ravikumar',
            'bio': 'Senior Software Engineer at TCS with 4 years of experience in enterprise applications.',
            'is_verified': True
        },
        {
            'user': users['18bq1a4225@vvit.net'],
            'roll_no': '18BQ1A4225',
            'department': 'csm',
            'phone': '9876543211',
            'current_company': 'Amazon',
            'current_position': 'SDE II',
            'location': 'Bangalore, Karnataka',
            'joined_year': 2023,
            'skills': ['Python', 'Machine Learning', 'AWS', 'TensorFlow', 'SQL', 'Spark'],
            'industries': ['E-commerce', 'Machine Learning'],
            'linkedin': 'https://linkedin.com/in/sowmya-reddy-vvit',
            'github': 'https://github.com/sowmyareddy',
            'bio': 'SDE II at Amazon working on ML-powered recommendation systems.',
            'is_verified': True
        },
        
        # 2019 Batch - Graduated 2023 (CSM)
        {
            'user': users['19bq1a4210@vvit.net'],
            'roll_no': '19BQ1A4210',
            'department': 'csm',
            'phone': '9876543212',
            'current_company': 'Google',
            'current_position': 'Software Engineer',
            'location': 'Bangalore, Karnataka',
            'joined_year': 2023,
            'skills': ['Go', 'Python', 'Distributed Systems', 'Kubernetes', 'gRPC', 'Cloud'],
            'industries': ['Technology', 'Cloud Infrastructure'],
            'linkedin': 'https://linkedin.com/in/mahesh-chowdary-vvit',
            'github': 'https://github.com/maheshchowdary',
            'bio': 'Software Engineer at Google Cloud, working on distributed systems and infrastructure.',
            'is_verified': True
        },
        {
            'user': users['19bq1a0501@vvit.net'],
            'roll_no': '19BQ1A0501',
            'department': 'cse',
            'phone': '9876543213',
            'current_company': 'Microsoft',
            'current_position': 'Software Engineer',
            'location': 'Hyderabad, Telangana',
            'joined_year': 2023,
            'skills': ['C#', '.NET', 'Azure', 'React', 'TypeScript', 'SQL Server'],
            'industries': ['Software', 'Cloud Services'],
            'linkedin': 'https://linkedin.com/in/ananya-sharma-vvit',
            'github': 'https://github.com/ananyasharma',
            'bio': 'Software Engineer at Microsoft working on Azure cloud services.',
            'is_verified': True
        },
        
        # 2020 Batch - Graduated 2024 (ECE)
        {
            'user': users['20bq1a0408@vvit.net'],
            'roll_no': '20BQ1A0408',
            'department': 'ece',
            'phone': '9876543214',
            'current_company': 'Qualcomm',
            'current_position': 'VLSI Design Engineer',
            'location': 'Bangalore, Karnataka',
            'joined_year': 2024,
            'skills': ['Verilog', 'VLSI', 'RTL Design', 'Synthesis', 'SystemVerilog', 'UVM'],
            'industries': ['Semiconductor', 'Chip Design'],
            'linkedin': 'https://linkedin.com/in/srikanth-naidu-vvit',
            'github': 'https://github.com/srikanthnaidu',
            'bio': 'VLSI Design Engineer at Qualcomm specializing in chip architecture.',
            'is_verified': True
        },
        
        # 2021 Lateral - Graduated 2024 (ECE - 3 year course)
        {
            'user': users['21bq5a0419@vvit.net'],
            'roll_no': '21BQ5A0419',
            'department': 'ece',
            'phone': '9876543215',
            'current_company': 'Texas Instruments',
            'current_position': 'Applications Engineer',
            'location': 'Bangalore, Karnataka',
            'joined_year': 2024,
            'skills': ['Embedded C', 'ARM', 'PCB Design', 'IoT', 'Sensors', 'Debugging'],
            'industries': ['Semiconductor', 'Embedded Systems'],
            'linkedin': 'https://linkedin.com/in/bhavana-prasad-vvit',
            'github': 'https://github.com/bhavanap rasad',
            'bio': 'Applications Engineer at TI, lateral entry graduate specializing in embedded systems.',
            'is_verified': True
        },
    ]
    
    for profile_data in profiles:
        profile = AlumniProfile(**profile_data)
        profile.save()
        
        print(f"  Created: {profile_data['roll_no']} - {profile_data['user'].full_name} ({profile_data['department'].upper()})")
        print(f"    → Graduated: {profile.graduation_year}, Company: {profile_data['current_company']}, Verified: ✓")


def create_blogs(users):
    """Create sample blogs."""
    print("\nCreating blogs...")
    
    blogs = [
        {
            'author': users['18bq1a4202@vvit.net'],
            'title': 'My Journey from College to Google',
            'content': '''
After graduating in 2020, I never imagined I would be working at Google within 2 years. Here's my journey and the lessons I learned along the way.

## The Beginning

When I was a student, I focused on building strong fundamentals in data structures and algorithms. I spent countless hours on platforms like LeetCode and participated in coding competitions.

## The Interview Process

The interview process at Google was challenging but fair. It consisted of:
1. Phone screening
2. Technical rounds (4-5)
3. System design round
4. Behavioral round

## Key Takeaways

- **Consistency is key**: Practice coding daily
- **Build projects**: Real-world projects matter more than certificates
- **Network**: Connect with alumni and industry professionals
- **Never give up**: Rejections are part of the process

Feel free to reach out if you have any questions!
            ''',
            'excerpt': 'My journey from being a college student to becoming a Software Engineer at Google.',
            'category': 'Career Journey',
            'tags': ['google', 'interview', 'career', 'software engineering'],
            'is_published': True
        },
        {
            'author': users['18bq1a4225@vvit.net'],
            'title': 'Breaking into Data Science: A Practical Guide',
            'content': '''
Data Science is one of the most sought-after careers today. Here's a practical guide based on my experience.

## Skills You Need

### Technical Skills
- **Python**: The primary language for data science
- **SQL**: Essential for data manipulation
- **Machine Learning**: Understanding algorithms and their applications
- **Statistics**: Foundation for all data analysis

### Soft Skills
- Communication
- Problem-solving
- Business acumen

## Learning Path

1. Start with Python and SQL basics
2. Learn statistics and probability
3. Move to machine learning fundamentals
4. Work on projects using real datasets
5. Specialize in a domain (NLP, Computer Vision, etc.)

## Resources I Recommend

- Andrew Ng's Machine Learning course
- Kaggle competitions
- Fast.ai courses
- Real-world projects

Good luck on your data science journey!
            ''',
            'excerpt': 'A comprehensive guide to starting your career in Data Science based on my personal experience.',
            'category': 'Career Advice',
            'tags': ['data science', 'machine learning', 'career', 'python'],
            'is_published': True
        }
    ]
    
    for blog_data in blogs:
        blog = Blog(**blog_data)
        blog.save()
        print(f"  Created blog: {blog_data['title'][:50]}...")


def create_jobs(users):
    """Create sample job postings."""
    print("\nCreating jobs...")
    
    jobs = [
        {
            'posted_by': users['19bq1a4210@vvit.net'],
            'title': 'Software Engineer Intern',
            'company': 'Google',
            'location': 'Bangalore, India',
            'job_type': 'internship',
            'description': '''
We are looking for passionate software engineering interns to join our team in Bangalore.

**What you'll do:**
- Work on cutting-edge technology projects
- Collaborate with experienced engineers
- Contribute to products used by millions

**Requirements:**
- Currently pursuing B.Tech/M.Tech in CS or related field
- Strong programming skills in any language
- Good problem-solving abilities
            ''',
            'requirements': ['B.Tech/M.Tech in CS', 'Programming skills', 'Problem solving'],
            'skills': ['Python', 'Java', 'Data Structures', 'Algorithms'],
            'salary_min': 50000,
            'salary_max': 80000,
            'deadline': datetime.utcnow() + timedelta(days=30),
            'application_link': 'https://careers.google.com'
        },
        {
            'posted_by': users['18bq1a4225@vvit.net'],
            'title': 'Junior Data Scientist',
            'company': 'Amazon',
            'location': 'Hyderabad, India',
            'job_type': 'full-time',
            'description': '''
Join Amazon's Data Science team and work on challenging problems at scale.

**Responsibilities:**
- Develop ML models for various applications
- Analyze large datasets
- Present findings to stakeholders

**What we're looking for:**
- Strong foundation in statistics and ML
- Proficiency in Python and SQL
- Experience with big data technologies is a plus
            ''',
            'requirements': ['MS/PhD preferred', 'Python', 'SQL', 'ML fundamentals'],
            'skills': ['Python', 'Machine Learning', 'SQL', 'Statistics', 'TensorFlow'],
            'salary_min': 1500000,
            'salary_max': 2500000,
            'deadline': datetime.utcnow() + timedelta(days=45),
            'application_link': 'https://amazon.jobs'
        },
        {
            'posted_by': users['19bq1a0501@vvit.net'],
            'title': 'Frontend Developer',
            'company': 'Microsoft',
            'location': 'Remote',
            'job_type': 'full-time',
            'description': '''
Looking for a talented Frontend Developer to join our team.

**You will:**
- Build beautiful, responsive web applications
- Work with React and TypeScript
- Collaborate with designers and backend engineers

**Requirements:**
- 1-3 years of experience in frontend development
- Proficiency in React, JavaScript/TypeScript
- Eye for design and user experience
            ''',
            'requirements': ['1-3 years experience', 'React', 'TypeScript'],
            'skills': ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML'],
            'salary_min': 1200000,
            'salary_max': 2000000,
            'deadline': datetime.utcnow() + timedelta(days=60),
            'application_link': 'https://careers.microsoft.com'
        }
    ]
    
    for job_data in jobs:
        job = Job(**job_data)
        job.save()
        print(f"  Created job: {job_data['title']} at {job_data['company']}")


def create_events(users):
    """Create sample events."""
    print("\nCreating events...")
    
    events = [
        {
            'created_by': users['admin@vvit.net'],
            'title': 'Annual Alumni Meet 2024',
            'description': '''
Join us for the Annual Alumni Meet 2024!

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

All alumni and current students are welcome!
            ''',
            'event_date': datetime.utcnow() + timedelta(days=60),
            'end_date': datetime.utcnow() + timedelta(days=60, hours=12),
            'location': 'College Auditorium',
            'event_type': 'meetup',
            'max_participants': 500,
            'registration_link': 'https://forms.google.com/alumni-meet-2024'
        },
        {
            'created_by': users['admin@vvit.net'],
            'title': 'Tech Talk: Future of AI',
            'description': '''
Join us for an exciting tech talk on the Future of Artificial Intelligence.

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

Q&A session included!
            ''',
            'event_date': datetime.utcnow() + timedelta(days=15),
            'end_date': datetime.utcnow() + timedelta(days=15, hours=3),
            'location': 'Online (Zoom)',
            'event_type': 'webinar',
            'max_participants': 1000,
            'registration_link': 'https://zoom.us/tech-talk-ai'
        },
        {
            'created_by': users['admin@vvit.net'],
            'title': 'Campus Recruitment Drive 2024',
            'description': '''
Annual Campus Recruitment Drive for final year students.

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

Prepare well and good luck!
            ''',
            'event_date': datetime.utcnow() + timedelta(days=30),
            'end_date': datetime.utcnow() + timedelta(days=35),
            'location': 'College Campus',
            'event_type': 'other',
            'max_participants': 300,
            'registration_link': 'https://college.edu/placements'
        }
    ]
    
    for event_data in events:
        event = Event(**event_data)
        event.save()
        print(f"  Created event: {event_data['title']}")


def main():
    """Main function to seed all data."""
    print("=" * 60)
    print("ALUMNI CONNECT - DATABASE SEEDING")
    print("=" * 60)
    
    # Clear existing data
    clear_data()
    
    # Create all data
    users = create_users()
    create_student_profiles(users)
    create_alumni_profiles(users)
    create_blogs(users)
    create_jobs(users)
    create_events(users)
    
    print("\n" + "=" * 60)
    print("SEEDING COMPLETE!")
    print("=" * 60)
    
    print("\n" + "=" * 100)
    print("📋 VVITU ALUMNI CONNECT - TEST CREDENTIALS")
    print("=" * 100)
    
    print("\n👨‍🎓 STUDENTS (Password: Student@123)")
    print("-" * 100)
    print(f"{'Roll Number':<15} {'Email':<30} {'Name':<25} {'Dept':<6} {'Year':<4} {'Interest'}")
    print("-" * 100)
    print(f"{'22BQ1A4201':<15} {'22bq1a4201@vvit.net':<30} {'Venkata Sai Krishna':<25} {'CSM':<6} {'4':<4} {'Full Stack + AI'}")
    print(f"{'22BQ1A4215':<15} {'22bq1a4215@vvit.net':<30} {'Divya Reddy':<25} {'CSM':<6} {'4':<4} {'ML & AI Research'}")
    print(f"{'22BQ1A4228':<15} {'22bq1a4228@vvit.net':<30} {'Akhil Kumar':<25} {'CSM':<6} {'4':<4} {'Cloud & DevOps'}")
    print(f"{'23BQ1A0401':<15} {'23bq1a0401@vvit.net':<30} {'Sravya Naidu':<25} {'ECE':<6} {'3':<4} {'VLSI Design'}")
    print(f"{'23BQ1A0415':<15} {'23bq1a0415@vvit.net':<30} {'Praveen Chowdary':<25} {'ECE':<6} {'3':<4} {'IoT & Embedded'}")
    print(f"{'24BQ1A0201':<15} {'24bq1a0201@vvit.net':<30} {'Keerthi Prasad':<25} {'EEE':<6} {'2':<4} {'Power Systems'}")
    print(f"{'24BQ1A0218':<15} {'24bq1a0218@vvit.net':<30} {'Tarun Varma':<25} {'EEE':<6} {'2':<4} {'Control Systems'}")
    print(f"{'24BQ5A6101':<15} {'24bq5a6101@vvit.net':<30} {'Lakshmi Devi':<25} {'AIML':<6} {'2':<4} {'Data Science'}")
    
    print("\n👨‍💼 ALUMNI (Password: Alumni@123)")
    print("-" * 100)
    print(f"{'Roll Number':<15} {'Email':<30} {'Name':<25} {'Grad':<6} {'Company':<20} {'Position'}")
    print("-" * 100)
    print(f"{'18BQ1A4202':<15} {'18bq1a4202@vvit.net':<30} {'Ravi Kumar':<25} {'2022':<6} {'TCS':<20} {'Sr. SDE'}")
    print(f"{'18BQ1A4225':<15} {'18bq1a4225@vvit.net':<30} {'Sowmya Reddy':<25} {'2022':<6} {'Amazon':<20} {'SDE II'}")
    print(f"{'19BQ1A4210':<15} {'19bq1a4210@vvit.net':<30} {'Mahesh Chowdary':<25} {'2023':<6} {'Google':<20} {'SDE'}")
    print(f"{'19BQ1A0501':<15} {'19bq1a0501@vvit.net':<30} {'Ananya Sharma':<25} {'2023':<6} {'Microsoft':<20} {'SDE'}")
    print(f"{'20BQ1A0408':<15} {'20bq1a0408@vvit.net':<30} {'Srikanth Naidu':<25} {'2024':<6} {'Qualcomm':<20} {'VLSI Engineer'}")
    print(f"{'21BQ5A0419':<15} {'21bq5a0419@vvit.net':<30} {'Bhavana Prasad':<25} {'2024':<6} {'Texas Instruments':<20} {'App Engineer'}")
    
    print("\n🏢 STAFF")
    print("-" * 100)
    print(f"{'Role':<15} {'Email':<35} {'Password':<20}")
    print("-" * 100)
    print(f"{'Admin':<15} {'admin@vvit.net':<35} {'Admin@123':<20}")
    print(f"{'Counsellor':<15} {'counsellor@vvit.net':<35} {'Counsellor@123':<20}")
    print(f"{'HOD':<15} {'hod@vvit.net':<35} {'HOD@123':<20}")
    print(f"{'Principal':<15} {'principal@vvit.net':<35} {'Principal@123':<20}")
    print("=" * 100)


if __name__ == '__main__':
    main()
