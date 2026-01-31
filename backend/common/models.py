"""
MongoDB Models using mongoengine for Alumni Connect.
"""
from datetime import datetime
import uuid
from mongoengine import (
    Document, EmbeddedDocument, StringField, EmailField, 
    DateTimeField, BooleanField, ListField, IntField,
    EmbeddedDocumentField, ReferenceField, FloatField, UUIDField
)
import bcrypt


class Education(EmbeddedDocument):
    """Embedded document for education history."""
    institution = StringField(required=True)
    degree = StringField(required=True)
    field_of_study = StringField()
    start_year = IntField()
    end_year = IntField()
    grade = StringField()


class WorkExperience(EmbeddedDocument):
    """Embedded document for work experience."""
    company = StringField(required=True)
    title = StringField(required=True)
    location = StringField()
    start_date = DateTimeField()
    end_date = DateTimeField()
    current = BooleanField(default=False)
    description = StringField()


class Internship(EmbeddedDocument):
    """Embedded document for internships."""
    company = StringField(required=True)
    role = StringField(required=True)
    duration = StringField()
    year = IntField()
    description = StringField()


class User(Document):
    """User document for authentication."""
    meta = {'collection': 'users'}
    
    uid = UUIDField(default=uuid.uuid4, binary=False, unique=True)
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    first_name = StringField(required=True, max_length=100)
    last_name = StringField(required=True, max_length=100)
    role = StringField(required=True, choices=[
        'student', 'alumni', 'counsellor', 'hod', 'principal', 'admin'
    ])
    is_active = BooleanField(default=True)
    is_verified = BooleanField(default=False)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    # Profile picture
    avatar = StringField()
    
    def set_password(self, raw_password):
        """Hash and set the password."""
        self.password = bcrypt.hashpw(
            raw_password.encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
    
    def check_password(self, raw_password):
        """Check if the password is correct."""
        return bcrypt.checkpw(
            raw_password.encode('utf-8'),
            self.password.encode('utf-8')
        )
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    def to_dict(self):
        return {
            'id': str(self.uid),
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': self.full_name,
            'role': self.role,
            'is_active': self.is_active,
            'is_verified': self.is_verified,
            'avatar': self.avatar,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class StudentProfile(Document):
    """Student profile document."""
    meta = {'collection': 'student_profiles'}
    
    user = ReferenceField(User, required=True, unique=True)
    roll_no = StringField(unique=True)
    department = StringField()
    year = IntField()
    cgpa = FloatField()
    phone = StringField()
    
    # Address
    address = StringField()
    city = StringField()
    state = StringField()
    
    # Academic
    education = ListField(EmbeddedDocumentField(Education))
    skills = ListField(StringField())
    certifications = ListField(StringField())
    internships = ListField(EmbeddedDocumentField(Internship))
    
    # Career
    career_interest = StringField()
    
    # Social
    linkedin = StringField()
    github = StringField()
    portfolio = StringField()
    
    # Bio
    bio = StringField()
    
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'user': self.user.to_dict() if self.user else None,
            'roll_no': self.roll_no,
            'department': self.department,
            'year': self.year,
            'cgpa': self.cgpa,
            'phone': self.phone,
            'skills': self.skills,
            'certifications': self.certifications,
            'career_interest': self.career_interest,
            'linkedin': self.linkedin,
            'github': self.github,
            'bio': self.bio,
        }


class AlumniProfile(Document):
    """Alumni profile document."""
    meta = {'collection': 'alumni_profiles'}
    
    user = ReferenceField(User, required=True, unique=True)
    graduation_year = IntField()
    department = StringField()
    roll_no = StringField()
    phone = StringField()
    
    # Current position
    current_company = StringField()
    current_position = StringField()
    location = StringField()
    
    # Experience
    work_experience = ListField(EmbeddedDocumentField(WorkExperience))
    education = ListField(EmbeddedDocumentField(Education))
    
    # Skills
    skills = ListField(StringField())
    industries = ListField(StringField())
    
    # Social
    linkedin = StringField()
    github = StringField()
    website = StringField()
    
    # Bio
    bio = StringField()
    about = StringField()
    
    # Verification
    is_verified = BooleanField(default=False)
    verified_at = DateTimeField()
    verified_by = ReferenceField(User)
    
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'user': self.user.to_dict() if self.user else None,
            'graduation_year': self.graduation_year,
            'department': self.department,
            'current_company': self.current_company,
            'current_position': self.current_position,
            'location': self.location,
            'skills': self.skills,
            'industries': self.industries,
            'linkedin': self.linkedin,
            'github': self.github,
            'bio': self.bio,
            'is_verified': self.is_verified,
        }


class Blog(Document):
    """Blog document."""
    meta = {'collection': 'blogs', 'ordering': ['-created_at']}
    
    author = ReferenceField(User, required=True)
    title = StringField(required=True, max_length=200)
    content = StringField(required=True)
    excerpt = StringField(max_length=500)
    category = StringField()
    tags = ListField(StringField())
    
    # Stats
    likes_count = IntField(default=0)
    comments_count = IntField(default=0)
    views_count = IntField(default=0)
    read_time = IntField(default=5)  # minutes
    
    # Status
    is_published = BooleanField(default=True)
    
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'author': self.author.to_dict() if self.author else None,
            'title': self.title,
            'content': self.content,
            'excerpt': self.excerpt,
            'category': self.category,
            'tags': self.tags,
            'likes_count': self.likes_count,
            'comments_count': self.comments_count,
            'views_count': self.views_count,
            'read_time': self.read_time,
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class BlogComment(Document):
    """Blog comment document."""
    meta = {'collection': 'blog_comments'}
    
    blog = ReferenceField(Blog, required=True)
    author = ReferenceField(User, required=True)
    content = StringField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)


class BlogLike(Document):
    """Blog like document."""
    meta = {'collection': 'blog_likes'}
    
    blog = ReferenceField(Blog, required=True)
    user = ReferenceField(User, required=True)
    created_at = DateTimeField(default=datetime.utcnow)


class Job(Document):
    """Job posting document."""
    meta = {'collection': 'jobs', 'ordering': ['-created_at']}
    
    posted_by = ReferenceField(User, required=True)
    title = StringField(required=True, max_length=200)
    company = StringField(required=True)
    location = StringField()
    job_type = StringField(choices=['full-time', 'part-time', 'internship', 'contract'])
    
    description = StringField(required=True)
    requirements = ListField(StringField())
    skills = ListField(StringField())
    
    salary_min = IntField()
    salary_max = IntField()
    salary_currency = StringField(default='INR')
    
    application_link = StringField()
    deadline = DateTimeField()
    
    # Stats
    applications_count = IntField(default=0)
    views_count = IntField(default=0)
    
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'posted_by': self.posted_by.to_dict() if self.posted_by else None,
            'title': self.title,
            'company': self.company,
            'location': self.location,
            'job_type': self.job_type,
            'description': self.description,
            'requirements': self.requirements,
            'skills': self.skills,
            'salary_min': self.salary_min,
            'salary_max': self.salary_max,
            'application_link': self.application_link,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'applications_count': self.applications_count,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class JobApplication(Document):
    """Job application document."""
    meta = {'collection': 'job_applications'}
    
    job = ReferenceField(Job, required=True)
    applicant = ReferenceField(User, required=True)
    resume_url = StringField()
    cover_letter = StringField()
    status = StringField(default='pending', choices=['pending', 'reviewed', 'shortlisted', 'rejected'])
    created_at = DateTimeField(default=datetime.utcnow)


class Event(Document):
    """Event document."""
    meta = {'collection': 'events', 'ordering': ['-event_date']}
    
    created_by = ReferenceField(User, required=True)
    title = StringField(required=True, max_length=200)
    description = StringField(required=True)
    
    event_date = DateTimeField(required=True)
    end_date = DateTimeField()
    location = StringField()
    event_type = StringField(choices=['workshop', 'seminar', 'webinar', 'meetup', 'conference', 'other'])
    
    registration_link = StringField()
    max_participants = IntField()
    
    # Stats
    registrations_count = IntField(default=0)
    
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'created_by': self.created_by.to_dict() if self.created_by else None,
            'title': self.title,
            'description': self.description,
            'event_date': self.event_date.isoformat() if self.event_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'location': self.location,
            'event_type': self.event_type,
            'registration_link': self.registration_link,
            'max_participants': self.max_participants,
            'registrations_count': self.registrations_count,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class EventRegistration(Document):
    """Event registration document."""
    meta = {'collection': 'event_registrations'}
    
    event = ReferenceField(Event, required=True)
    user = ReferenceField(User, required=True)
    created_at = DateTimeField(default=datetime.utcnow)
