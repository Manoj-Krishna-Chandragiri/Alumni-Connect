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
    start_date = DateTimeField()
    end_date = DateTimeField()
    is_paid = BooleanField(default=False)
    description = StringField()


class Skill(EmbeddedDocument):
    """Embedded document for skills."""
    name = StringField(required=True)
    level = StringField(choices=['beginner', 'intermediate', 'expert'], default='beginner')


class Certification(EmbeddedDocument):
    """Embedded document for certifications."""
    name = StringField(required=True)
    issued_by = StringField()
    issued_date = DateTimeField()
    score = StringField()


class Placement(EmbeddedDocument):
    """Embedded document for placement details."""
    company_name = StringField(required=True)
    role = StringField()
    package = StringField()


class SocialProfile(EmbeddedDocument):
    """Embedded document for social profiles."""
    linkedin = StringField()
    github = StringField()
    medium = StringField()
    leetcode = StringField()
    hackerrank = StringField()
    codechef = StringField()
    codeforces = StringField()
    discord = StringField()


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
    
    # Hierarchical relationships for organizational structure
    # Student/Alumni → Counsellor → HOD → Principal/Admin
    assigned_counsellor = ReferenceField('self', required=False)  # Counsellor assigned to this student/alumni
    reports_to_hod = ReferenceField('self', required=False)  # HOD that this counsellor reports to
    department = StringField()  # Department (CSE, ECE, etc.)
    
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
    roll_no = StringField(unique=True, required=True)
    department = StringField(required=True)
    phone = StringField()
    
    # Academic Details
    year = IntField()  # Keep for backwards compatibility (current year of study)
    joined_year = IntField()
    completion_year = IntField()  # Auto-calculated from roll number
    current_year = IntField()
    current_semester = IntField()
    cgpa = FloatField()
    
    def save(self, *args, **kwargs):
        """Override save to auto-calculate fields from roll number."""
        if self.roll_no:
            from common.roll_number_utils import (
                parse_roll_number, calculate_passout_year, 
                get_academic_status
            )
            
            # Parse roll number
            info = parse_roll_number(self.roll_no)
            if info:
                # Auto-calculate joining year if not set
                if not self.joined_year:
                    self.joined_year = int(info['year'])
                
                # Auto-calculate completion year
                self.completion_year = calculate_passout_year(self.roll_no)
                
                # Get academic status
                status = get_academic_status(self.roll_no)
                if status and status['current_year_of_study']:
                    self.current_year = status['current_year_of_study']
        
        # Update timestamp
        self.updated_at = datetime.utcnow()
        return super(StudentProfile, self).save(*args, **kwargs)
    
    # Address
    address = StringField()
    city = StringField()
    state = StringField()
    
    # Social Profiles - Keep old fields for backwards compatibility
    linkedin = StringField()
    github = StringField()
    portfolio = StringField()
    social_profiles = EmbeddedDocumentField(SocialProfile)
    
    # Academic & Career
    education = ListField(EmbeddedDocumentField(Education))
    skills = ListField(StringField())  # Keep as strings for backwards compatibility
    certifications = ListField(StringField())  # Keep as strings for backwards compatibility
    internships = ListField(EmbeddedDocumentField(Internship))
    
    # Placement Details (for final year students)
    is_placed = BooleanField(default=False)
    placement_offers = ListField(EmbeddedDocumentField(Placement))
    
    # Career Interest
    career_interest = StringField()
    
    # Bio
    bio = StringField()
    
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def to_dict(self):
        social = self.social_profiles
        return {
            'id': str(self.id),
            'user': self.user.to_dict() if self.user else None,
            'roll_no': self.roll_no,
            'department': self.department,
            'phone': self.phone,
            'year': self.year or self.current_year,
            'joined_year': self.joined_year,
            'completion_year': self.completion_year,
            'current_year': self.current_year,
            'current_semester': self.current_semester,
            'cgpa': self.cgpa,
            'linkedin': self.linkedin or (social.linkedin if social else None),
            'github': self.github or (social.github if social else None),
            'social_profiles': {
                'linkedin': social.linkedin if social else self.linkedin,
                'github': social.github if social else self.github,
                'medium': social.medium if social else None,
                'leetcode': social.leetcode if social else None,
                'hackerrank': social.hackerrank if social else None,
                'codechef': social.codechef if social else None,
                'codeforces': social.codeforces if social else None,
                'discord': social.discord if social else None,
            } if (social or self.linkedin or self.github) else {},
            'skills': self.skills or [],
            'certifications': self.certifications or [],
            'internships': [{'company': i.company, 'role': i.role, 'is_paid': i.is_paid} for i in (self.internships or [])],
            'is_placed': self.is_placed,
            'placement_offers': [{'company_name': p.company_name, 'role': p.role} for p in (self.placement_offers or [])],
            'career_interest': self.career_interest,
            'bio': self.bio,
        }


class AlumniProfile(Document):
    """Alumni profile document."""
    meta = {'collection': 'alumni_profiles'}
    
    user = ReferenceField(User, required=True, unique=True)
    roll_no = StringField(required=True)  # Roll number when they were a student
    department = StringField(required=True)
    graduation_year = IntField(required=True)  # Auto-calculated from roll number if not provided
    phone = StringField()
    
    def save(self, *args, **kwargs):
        """Override save to auto-calculate graduation year from roll number."""
        if self.roll_no and not self.graduation_year:
            from common.roll_number_utils import calculate_passout_year
            self.graduation_year = calculate_passout_year(self.roll_no)
        
        # Update timestamp
        self.updated_at = datetime.utcnow()
        return super(AlumniProfile, self).save(*args, **kwargs)
    
    # Social Profiles - Keep old fields for backwards compatibility
    linkedin = StringField()
    github = StringField()
    website = StringField()
    social_profiles = EmbeddedDocumentField(SocialProfile)
    
    # Current Position
    current_company = StringField()
    current_position = StringField()
    location = StringField()
    joined_year = IntField()
    
    # Experience & Education
    work_experience = ListField(EmbeddedDocumentField(WorkExperience))
    education = ListField(EmbeddedDocumentField(Education))  # Higher education (MS, MTech, PhD, etc.)
    
    # Skills
    skills = ListField(StringField())
    industries = ListField(StringField())
    
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
        social = self.social_profiles
        return {
            'id': str(self.id),
            'user': self.user.to_dict() if self.user else None,
            'roll_no': self.roll_no,
            'graduation_year': self.graduation_year,
            'department': self.department,
            'phone': self.phone,
            'current_company': self.current_company,
            'current_position': self.current_position,
            'location': self.location,
            'joined_year': self.joined_year,
            'work_experience': [
                {
                    'company': w.company,
                    'title': w.title,
                    'location': w.location,
                    'start_date': w.start_date.isoformat() if w.start_date else None,
                    'end_date': w.end_date.isoformat() if w.end_date else None,
                    'current': w.current
                } for w in (self.work_experience or [])
            ],
            'education': [
                {
                    'institution': e.institution,
                    'degree': e.degree,
                    'field_of_study': e.field_of_study,
                    'start_year': e.start_year,
                    'end_year': e.end_year
                } for e in (self.education or [])
            ],
            'social_profiles': {
                'linkedin': social.linkedin if social else self.linkedin,
                'github': social.github if social else self.github,
                'medium': social.medium if social else None,
                'leetcode': social.leetcode if social else None,
                'hackerrank': social.hackerrank if social else None,
                'codechef': social.codechef if social else None,
                'codeforces': social.codeforces if social else None,
            } if (social or self.linkedin or self.github) else {},
            'linkedin': self.linkedin or (social.linkedin if social else None),
            'github': self.github or (social.github if social else None),
            'website': self.website,
            'skills': self.skills,
            'industries': self.industries,
            'bio': self.bio,
            'about': self.about,
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
    cover_image = StringField()  # Cover image URL
    
    # Stats
    likes_count = IntField(default=0)
    comments_count = IntField(default=0)
    views_count = IntField(default=0)
    shares_count = IntField(default=0)
    read_time = IntField(default=5)  # minutes
    
    # Status
    is_published = BooleanField(default=True)
    
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'slug': str(self.id),  # Add slug for compatibility
            'author': self.author.to_dict() if self.author else None,
            'title': self.title,
            'content': self.content,
            'excerpt': self.excerpt,
            'category': self.category,
            'tags': self.tags,
            'coverImage': self.cover_image,
            'likes_count': self.likes_count,
            'comments_count': self.comments_count,
            'views_count': self.views_count,
            'shares_count': self.shares_count,
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
    cover_image = StringField()  # Job cover image
    
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
            'postedBy': self.posted_by.to_dict() if self.posted_by else None,
            'posted_by': self.posted_by.to_dict() if self.posted_by else None,  # Compatibility
            'title': self.title,
            'company': self.company,
            'location': self.location,
            'type': self.job_type,  # Frontend expects 'type'
            'job_type': self.job_type,  # Keep for compatibility
            'coverImage': self.cover_image,
            'cover_image': self.cover_image,  # Keep for compatibility
            'description': self.description,
            'requirements': self.requirements,
            'skills': self.skills,
            'salary': f"₹{self.salary_min}-{self.salary_max} LPA" if self.salary_min and self.salary_max else None,
            'salary_min': self.salary_min,
            'salary_max': self.salary_max,
            'applicationLink': self.application_link,
            'application_link': self.application_link,  # Keep for compatibility
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'applications_count': self.applications_count,
            'is_active': self.is_active,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
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


class JobSave(Document):
    """Saved jobs by users."""
    meta = {'collection': 'job_saves'}
    
    job = ReferenceField(Job, required=True)
    user = ReferenceField(User, required=True)
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
    event_image = StringField()  # Cover image URL
    
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
            'date': self.event_date.isoformat() if self.event_date else None,  # Alias for frontend
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'location': self.location,
            'event_type': self.event_type,
            'type': self.event_type,  # Alias for frontend
            'event_image': self.event_image,
            'image': self.event_image,  # Alias for frontend
            'registration_link': self.registration_link,
            'registrationLink': self.registration_link,  # camelCase alias
            'max_participants': self.max_participants,
            'registrations_count': self.registrations_count,
            'attendees': self.registrations_count,  # Alias for frontend
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class EventRegistration(Document):
    """Event registration document."""
    meta = {'collection': 'event_registrations'}
    
    event = ReferenceField(Event, required=True)
    user = ReferenceField(User, required=True)
    created_at = DateTimeField(default=datetime.utcnow)
