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
    """Create test users."""
    print("\nCreating users...")
    
    users = [
        {
            'email': 'admin@college.edu',
            'password': 'Admin@123',
            'first_name': 'System',
            'last_name': 'Admin',
            'role': 'admin',
            'is_verified': True
        },
        {
            'email': 'student1@college.edu',
            'password': 'Student@123',
            'first_name': 'Rahul',
            'last_name': 'Sharma',
            'role': 'student'
        },
        {
            'email': 'student2@college.edu',
            'password': 'Student@123',
            'first_name': 'Priya',
            'last_name': 'Patel',
            'role': 'student'
        },
        {
            'email': 'alumni1@gmail.com',
            'password': 'Alumni@123',
            'first_name': 'Amit',
            'last_name': 'Kumar',
            'role': 'alumni',
            'is_verified': True
        },
        {
            'email': 'alumni2@gmail.com',
            'password': 'Alumni@123',
            'first_name': 'Sneha',
            'last_name': 'Verma',
            'role': 'alumni',
            'is_verified': True
        },
        {
            'email': 'alumni3@gmail.com',
            'password': 'Alumni@123',
            'first_name': 'Rajesh',
            'last_name': 'Singh',
            'role': 'alumni',
            'is_verified': False
        },
        {
            'email': 'counsellor@college.edu',
            'password': 'Counsellor@123',
            'first_name': 'Dr. Meena',
            'last_name': 'Iyer',
            'role': 'counsellor',
            'is_verified': True
        },
        {
            'email': 'hod@college.edu',
            'password': 'HOD@123',
            'first_name': 'Prof. Suresh',
            'last_name': 'Reddy',
            'role': 'hod',
            'is_verified': True
        },
        {
            'email': 'principal@college.edu',
            'password': 'Principal@123',
            'first_name': 'Dr. Ramesh',
            'last_name': 'Gupta',
            'role': 'principal',
            'is_verified': True
        }
    ]
    
    created_users = {}
    for user_data in users:
        password = user_data.pop('password')
        user = User(**user_data)
        user.set_password(password)
        user.save()
        created_users[user_data['email']] = user
        print(f"  Created user: {user_data['email']} ({user_data['role']})")
    
    return created_users


def create_student_profiles(users):
    """Create student profiles."""
    print("\nCreating student profiles...")
    
    profiles = [
        {
            'user': users['student1@college.edu'],
            'roll_no': 'CS2021001',
            'department': 'Computer Science',
            'year': 3,
            'cgpa': 8.5,
            'phone': '9876543210',
            'skills': ['Python', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
            'certifications': ['AWS Cloud Practitioner', 'Google IT Support'],
            'career_interest': 'Full Stack Development',
            'linkedin': 'https://linkedin.com/in/rahulsharma',
            'github': 'https://github.com/rahulsharma',
            'bio': 'Passionate about web development and cloud technologies.'
        },
        {
            'user': users['student2@college.edu'],
            'roll_no': 'CS2021002',
            'department': 'Computer Science',
            'year': 3,
            'cgpa': 9.0,
            'phone': '9876543211',
            'skills': ['Python', 'Machine Learning', 'TensorFlow', 'Data Science', 'SQL'],
            'certifications': ['TensorFlow Developer', 'IBM Data Science'],
            'career_interest': 'Data Science & AI',
            'linkedin': 'https://linkedin.com/in/priyapatel',
            'github': 'https://github.com/priyapatel',
            'bio': 'Aspiring data scientist with interest in ML and AI.'
        }
    ]
    
    for profile_data in profiles:
        profile = StudentProfile(**profile_data)
        profile.save()
        print(f"  Created student profile: {profile_data['user'].email}")


def create_alumni_profiles(users):
    """Create alumni profiles."""
    print("\nCreating alumni profiles...")
    
    profiles = [
        {
            'user': users['alumni1@gmail.com'],
            'graduation_year': 2020,
            'department': 'Computer Science',
            'phone': '9876543212',
            'current_company': 'Google',
            'current_position': 'Software Engineer',
            'location': 'Bangalore',
            'skills': ['Python', 'JavaScript', 'React', 'Node.js', 'Kubernetes', 'Go'],
            'industries': ['Technology', 'Cloud Computing'],
            'linkedin': 'https://linkedin.com/in/amitkumar',
            'github': 'https://github.com/amitkumar',
            'bio': 'SDE at Google with 4+ years of experience in cloud and distributed systems.',
            'is_verified': True
        },
        {
            'user': users['alumni2@gmail.com'],
            'graduation_year': 2019,
            'department': 'Computer Science',
            'phone': '9876543213',
            'current_company': 'Amazon',
            'current_position': 'Data Scientist',
            'location': 'Hyderabad',
            'skills': ['Python', 'Machine Learning', 'TensorFlow', 'AWS', 'SQL', 'Spark'],
            'industries': ['E-commerce', 'Data Science'],
            'linkedin': 'https://linkedin.com/in/snehaverma',
            'github': 'https://github.com/snehaverma',
            'bio': 'Data Scientist at Amazon working on recommendation systems.',
            'is_verified': True
        },
        {
            'user': users['alumni3@gmail.com'],
            'graduation_year': 2021,
            'department': 'Computer Science',
            'phone': '9876543214',
            'current_company': 'Startup Inc',
            'current_position': 'Backend Developer',
            'location': 'Mumbai',
            'skills': ['Java', 'Spring Boot', 'Microservices', 'Docker'],
            'industries': ['Fintech'],
            'linkedin': 'https://linkedin.com/in/rajeshsingh',
            'bio': 'Backend developer specializing in microservices.',
            'is_verified': False  # Pending verification
        }
    ]
    
    for profile_data in profiles:
        profile = AlumniProfile(**profile_data)
        profile.save()
        print(f"  Created alumni profile: {profile_data['user'].email} (verified: {profile_data['is_verified']})")


def create_blogs(users):
    """Create sample blogs."""
    print("\nCreating blogs...")
    
    blogs = [
        {
            'author': users['alumni1@gmail.com'],
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
            'author': users['alumni2@gmail.com'],
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
            'posted_by': users['alumni1@gmail.com'],
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
            'posted_by': users['alumni2@gmail.com'],
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
            'posted_by': users['alumni1@gmail.com'],
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
            'created_by': users['admin@college.edu'],
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
            'created_by': users['admin@college.edu'],
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
            'created_by': users['admin@college.edu'],
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
    
    print("\n📋 TEST CREDENTIALS:")
    print("-" * 40)
    print("| Role       | Email                    | Password      |")
    print("-" * 40)
    print("| Admin      | admin@college.edu        | Admin@123     |")
    print("| Student    | student1@college.edu     | Student@123   |")
    print("| Student    | student2@college.edu     | Student@123   |")
    print("| Alumni     | alumni1@gmail.com        | Alumni@123    |")
    print("| Alumni     | alumni2@gmail.com        | Alumni@123    |")
    print("| Alumni     | alumni3@gmail.com        | Alumni@123    |")
    print("| Counsellor | counsellor@college.edu   | Counsellor@123|")
    print("| HOD        | hod@college.edu          | HOD@123       |")
    print("| Principal  | principal@college.edu    | Principal@123 |")
    print("-" * 40)


if __name__ == '__main__':
    main()
