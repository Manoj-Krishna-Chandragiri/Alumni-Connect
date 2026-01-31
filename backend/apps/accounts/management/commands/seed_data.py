"""
Management command to seed the database with sample data.
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import random

from apps.accounts.models import StudentProfile, AlumniProfile
from apps.blogs.models import Blog
from apps.jobs.models import Job
from apps.events.models import Event

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed the database with sample data'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )
    
    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            User.objects.filter(is_superuser=False).delete()
            Blog.objects.all().delete()
            Job.objects.all().delete()
            Event.objects.all().delete()
        
        self.stdout.write('Seeding database...')
        
        # Create users
        self.create_users()
        
        # Create blogs
        self.create_blogs()
        
        # Create jobs
        self.create_jobs()
        
        # Create events
        self.create_events()
        
        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
    
    def create_users(self):
        self.stdout.write('Creating users...')
        
        departments = ['cse', 'ece', 'eee', 'mech', 'civil', 'it']
        skills = [
            'Python', 'JavaScript', 'React', 'Node.js', 'Django',
            'Machine Learning', 'Data Science', 'AWS', 'Docker',
            'Java', 'C++', 'SQL', 'MongoDB', 'Git', 'Agile'
        ]
        companies = [
            'Google', 'Microsoft', 'Amazon', 'Meta', 'Apple',
            'Infosys', 'TCS', 'Wipro', 'Accenture', 'Deloitte'
        ]
        industries = [
            'Technology', 'Finance', 'Healthcare', 'E-commerce',
            'Consulting', 'Manufacturing', 'Education'
        ]
        
        # Create admin
        if not User.objects.filter(email='admin@alumni.edu').exists():
            User.objects.create_superuser(
                email='admin@alumni.edu',
                password='admin123',
                first_name='Admin',
                last_name='User',
                role='admin'
            )
            self.stdout.write('  Created admin user')
        
        # Create counsellor
        if not User.objects.filter(email='counsellor@alumni.edu').exists():
            User.objects.create_user(
                email='counsellor@alumni.edu',
                password='password123',
                first_name='Jane',
                last_name='Counsellor',
                role='counsellor'
            )
            self.stdout.write('  Created counsellor user')
        
        # Create HOD
        if not User.objects.filter(email='hod@alumni.edu').exists():
            User.objects.create_user(
                email='hod@alumni.edu',
                password='password123',
                first_name='Dr. Robert',
                last_name='Wilson',
                role='hod',
                department='cse'
            )
            self.stdout.write('  Created HOD user')
        
        # Create Principal
        if not User.objects.filter(email='principal@alumni.edu').exists():
            User.objects.create_user(
                email='principal@alumni.edu',
                password='password123',
                first_name='Dr. Sarah',
                last_name='Johnson',
                role='principal'
            )
            self.stdout.write('  Created principal user')
        
        # Create students
        for i in range(1, 11):
            email = f'student{i}@alumni.edu'
            if not User.objects.filter(email=email).exists():
                user = User.objects.create_user(
                    email=email,
                    password='password123',
                    first_name=f'Student{i}',
                    last_name=f'Name{i}',
                    role='student',
                    department=random.choice(departments)
                )
                
                StudentProfile.objects.create(
                    user=user,
                    roll_number=f'2021CSE{str(i).zfill(3)}',
                    batch_year=random.choice([2021, 2022, 2023]),
                    semester=random.randint(1, 8),
                    cgpa=round(random.uniform(7.0, 10.0), 2),
                    skills=random.sample(skills, k=random.randint(3, 7)),
                    interests=['Web Development', 'AI/ML', 'Cloud Computing'],
                    bio=f'Passionate student interested in technology and innovation.'
                )
        self.stdout.write(f'  Created 10 student users')
        
        # Create alumni
        for i in range(1, 11):
            email = f'alumni{i}@alumni.edu'
            if not User.objects.filter(email=email).exists():
                user = User.objects.create_user(
                    email=email,
                    password='password123',
                    first_name=f'Alumni{i}',
                    last_name=f'Name{i}',
                    role='alumni',
                    department=random.choice(departments),
                    is_verified=i <= 7  # First 7 are verified
                )
                
                AlumniProfile.objects.create(
                    user=user,
                    graduation_year=random.choice([2015, 2016, 2017, 2018, 2019, 2020]),
                    current_company=random.choice(companies),
                    current_designation=random.choice([
                        'Software Engineer', 'Senior Developer', 'Tech Lead',
                        'Data Scientist', 'Product Manager'
                    ]),
                    current_location=random.choice(['Bangalore', 'Hyderabad', 'Chennai', 'Mumbai']),
                    industry=random.choice(industries),
                    experience_years=random.randint(2, 8),
                    skills=random.sample(skills, k=random.randint(5, 10)),
                    expertise_areas=['Mentoring', 'Career Guidance', 'Technical Training'],
                    verification_status='verified' if i <= 7 else 'pending',
                    available_for_mentoring=random.choice([True, False]),
                    available_for_referrals=random.choice([True, False])
                )
        self.stdout.write(f'  Created 10 alumni users')
    
    def create_blogs(self):
        self.stdout.write('Creating blogs...')
        
        alumni = User.objects.filter(role='alumni', is_verified=True)
        
        blog_templates = [
            {
                'title': 'My Journey from Campus to Corporate',
                'excerpt': 'Sharing my experience of transitioning from college to working at a top tech company.',
                'content': 'Starting my career was both exciting and challenging...',
                'category': 'Career',
                'tags': ['career', 'transition', 'tips']
            },
            {
                'title': 'Top 10 Skills Every CS Graduate Should Have',
                'excerpt': 'Essential skills that will help you stand out in the job market.',
                'content': 'In today\'s competitive job market, having the right skills is crucial...',
                'category': 'Skills',
                'tags': ['skills', 'programming', 'career']
            },
            {
                'title': 'How I Cracked My Dream Company Interview',
                'excerpt': 'Tips and strategies that helped me land my dream job.',
                'content': 'Preparing for interviews requires a systematic approach...',
                'category': 'Interview',
                'tags': ['interview', 'preparation', 'tips']
            },
            {
                'title': 'The Importance of Networking in Tech',
                'excerpt': 'Building connections that can shape your career.',
                'content': 'Networking has been one of the most valuable aspects of my career...',
                'category': 'Networking',
                'tags': ['networking', 'career', 'growth']
            },
            {
                'title': 'Working Remotely: Lessons Learned',
                'excerpt': 'My experience with remote work and productivity tips.',
                'content': 'Remote work has become the new normal for many of us...',
                'category': 'Work',
                'tags': ['remote', 'productivity', 'work-life']
            }
        ]
        
        for i, template in enumerate(blog_templates):
            if alumni.exists():
                author = alumni[i % alumni.count()]
                Blog.objects.create(
                    author=author,
                    title=template['title'],
                    excerpt=template['excerpt'],
                    content=template['content'] * 10,  # Make content longer
                    category=template['category'],
                    tags=template['tags'],
                    status='published',
                    published_at=timezone.now() - timedelta(days=random.randint(1, 30)),
                    views_count=random.randint(50, 500),
                    likes_count=random.randint(5, 50)
                )
        
        self.stdout.write(f'  Created {len(blog_templates)} blogs')
    
    def create_jobs(self):
        self.stdout.write('Creating jobs...')
        
        alumni = User.objects.filter(role='alumni', is_verified=True)
        
        job_templates = [
            {
                'title': 'Software Engineer',
                'company': 'Google',
                'description': 'Join our team to build innovative products that impact billions of users.',
                'job_type': 'full_time',
                'location': 'Bangalore',
                'skills_required': ['Python', 'Java', 'Algorithms', 'System Design'],
                'salary_min': 1500000,
                'salary_max': 2500000,
                'experience_min': 0,
                'experience_max': 3
            },
            {
                'title': 'Frontend Developer',
                'company': 'Microsoft',
                'description': 'Build beautiful and responsive web applications.',
                'job_type': 'full_time',
                'location': 'Hyderabad',
                'skills_required': ['React', 'JavaScript', 'CSS', 'TypeScript'],
                'salary_min': 1200000,
                'salary_max': 2000000,
                'experience_min': 1,
                'experience_max': 4
            },
            {
                'title': 'Data Science Intern',
                'company': 'Amazon',
                'description': 'Work on real-world machine learning problems.',
                'job_type': 'internship',
                'location': 'Chennai',
                'skills_required': ['Python', 'Machine Learning', 'SQL', 'Statistics'],
                'salary_min': 50000,
                'salary_max': 80000,
                'experience_min': 0,
                'experience_max': 0
            },
            {
                'title': 'DevOps Engineer',
                'company': 'Netflix',
                'description': 'Scale infrastructure for millions of users.',
                'job_type': 'full_time',
                'location': 'Remote',
                'skills_required': ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
                'salary_min': 1800000,
                'salary_max': 3000000,
                'experience_min': 2,
                'experience_max': 5
            },
            {
                'title': 'Product Manager',
                'company': 'Flipkart',
                'description': 'Lead product development from conception to launch.',
                'job_type': 'full_time',
                'location': 'Bangalore',
                'skills_required': ['Product Strategy', 'Analytics', 'Agile', 'Communication'],
                'salary_min': 2000000,
                'salary_max': 3500000,
                'experience_min': 3,
                'experience_max': 7
            }
        ]
        
        for i, template in enumerate(job_templates):
            if alumni.exists():
                poster = alumni[i % alumni.count()]
                Job.objects.create(
                    posted_by=poster,
                    title=template['title'],
                    company=template['company'],
                    description=template['description'],
                    job_type=template['job_type'],
                    location=template['location'],
                    is_remote=template['location'] == 'Remote',
                    skills_required=template['skills_required'],
                    salary_min=template['salary_min'],
                    salary_max=template['salary_max'],
                    experience_min=template['experience_min'],
                    experience_max=template['experience_max'],
                    status='open',
                    deadline=timezone.now().date() + timedelta(days=random.randint(15, 60)),
                    views_count=random.randint(100, 1000)
                )
        
        self.stdout.write(f'  Created {len(job_templates)} jobs')
    
    def create_events(self):
        self.stdout.write('Creating events...')
        
        admin = User.objects.filter(role='admin').first()
        if not admin:
            admin = User.objects.filter(is_superuser=True).first()
        
        if not admin:
            self.stdout.write('  No admin user found, skipping events')
            return
        
        event_templates = [
            {
                'title': 'Tech Talk: AI in 2024',
                'description': 'Join us for an insightful session on the latest trends in Artificial Intelligence.',
                'event_type': 'webinar',
                'is_online': True,
                'days_from_now': 7,
                'target_audience': ['student', 'alumni']
            },
            {
                'title': 'Alumni Reunion 2024',
                'description': 'Annual gathering of all alumni batches. Networking, fun, and memories!',
                'event_type': 'reunion',
                'is_online': False,
                'venue': 'College Auditorium',
                'days_from_now': 30,
                'target_audience': ['alumni']
            },
            {
                'title': 'Career Guidance Workshop',
                'description': 'Interactive workshop on career planning and job search strategies.',
                'event_type': 'workshop',
                'is_online': True,
                'days_from_now': 14,
                'target_audience': ['student']
            },
            {
                'title': 'Hackathon 2024',
                'description': '24-hour coding challenge with exciting prizes!',
                'event_type': 'workshop',
                'is_online': False,
                'venue': 'Innovation Lab',
                'days_from_now': 21,
                'target_audience': ['student', 'alumni']
            },
            {
                'title': 'Industry Expert Panel Discussion',
                'description': 'Panel of industry experts sharing insights on emerging technologies.',
                'event_type': 'seminar',
                'is_online': True,
                'days_from_now': 10,
                'target_audience': ['student', 'alumni']
            }
        ]
        
        for template in event_templates:
            start = timezone.now() + timedelta(days=template['days_from_now'])
            Event.objects.create(
                created_by=admin,
                title=template['title'],
                description=template['description'],
                event_type=template['event_type'],
                is_online=template['is_online'],
                venue=template.get('venue', ''),
                start_datetime=start,
                end_datetime=start + timedelta(hours=3),
                target_audience=template['target_audience'],
                max_attendees=100 if not template['is_online'] else None,
                registration_deadline=start - timedelta(days=1),
                status='upcoming'
            )
        
        self.stdout.write(f'  Created {len(event_templates)} events')
