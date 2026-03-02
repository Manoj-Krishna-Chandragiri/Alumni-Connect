"""
Management command to seed counsellors for all 11 departments, plus
sample students and alumni assigned to each counsellor.

Creates users in Django ORM (primary auth system) and syncs to MongoDB.

Usage:
    python manage.py seed_counsellors
    python manage.py seed_counsellors --clear-counsellors
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import random

from apps.accounts.models import StudentProfile, AlumniProfile

User = get_user_model()

# All 11 departments with branch codes (for roll number generation)
DEPARTMENTS = [
    {'code': 'CSE',  'branch_code': '05', 'name': 'Computer Science & Engineering'},
    {'code': 'CSM',  'branch_code': '42', 'name': 'CSE with AI & ML'},
    {'code': 'AID',  'branch_code': '54', 'name': 'Artificial Intelligence & Data Science'},
    {'code': 'AIML', 'branch_code': '61', 'name': 'Artificial Intelligence & Machine Learning'},
    {'code': 'CSO',  'branch_code': '49', 'name': 'CSE with IoT'},
    {'code': 'CIC',  'branch_code': '47', 'name': 'CSE with IoT and Cyber Security'},
    {'code': 'ECE',  'branch_code': '04', 'name': 'Electronics & Communication Engineering'},
    {'code': 'EEE',  'branch_code': '02', 'name': 'Electrical & Electronics Engineering'},
    {'code': 'IT',   'branch_code': '12', 'name': 'Information Technology'},
    {'code': 'CIV',  'branch_code': '01', 'name': 'Civil Engineering'},
    {'code': 'MEC',  'branch_code': '03', 'name': 'Mechanical Engineering'},
]

COUNSELLORS_DATA = [
    {'code': 'CSE',  'first_name': 'Priya',      'last_name': 'Sharma'},
    {'code': 'CSM',  'first_name': 'Kavitha',    'last_name': 'Reddy'},
    {'code': 'AID',  'first_name': 'Sravani',    'last_name': 'Naidu'},
    {'code': 'AIML', 'first_name': 'Divya',      'last_name': 'Prasad'},
    {'code': 'CSO',  'first_name': 'Mounika',    'last_name': 'Rao'},
    {'code': 'CIC',  'first_name': 'Haritha',    'last_name': 'Kumar'},
    {'code': 'ECE',  'first_name': 'Kiran',      'last_name': 'Varma'},
    {'code': 'EEE',  'first_name': 'Swathi',     'last_name': 'Chowdary'},
    {'code': 'IT',   'first_name': 'Bhavana',    'last_name': 'Krishna'},
    {'code': 'CIV',  'first_name': 'Lakshmi',    'last_name': 'Raju'},
    {'code': 'MEC',  'first_name': 'Anitha',     'last_name': 'Babu'},
]

STUDENT_NAMES = [
    ('Venkata Sai', 'Krishna'), ('Rajesh', 'Kumar'), ('Divya', 'Reddy'),
    ('Suresh', 'Rao'), ('Priya', 'Naidu'), ('Anil', 'Varma'),
    ('Kavya', 'Prasad'), ('Srikanth', 'Chowdary'), ('Sindhu', 'Raju'),
    ('Tarun', 'Murthy'), ('Swathi', 'Babu'), ('Nikhil', 'Sekhar'),
    ('Mounika', 'Reddy'), ('Pavan', 'Kumar'), ('Haritha', 'Sharma'),
]

ALUMNI_NAMES = [
    ('Ravi', 'Shankar'), ('Lakshmi', 'Prasad'), ('Mahesh', 'Chandra'),
    ('Sravya', 'Reddy'), ('Vijay', 'Krishna'), ('Naveen', 'Rao'),
    ('Swetha', 'Kumar'), ('Akhil', 'Naidu'), ('Chandana', 'Varma'),
]

COMPANIES = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant',
             'HCL Technologies', 'Tech Mahindra', 'Amazon', 'Google', 'Microsoft']

SKILLS_BY_DEPT = {
    'CSE':  ['Python', 'Java', 'JavaScript', 'React', 'SQL', 'MongoDB'],
    'CSM':  ['Machine Learning', 'Deep Learning', 'Python', 'TensorFlow', 'NLP'],
    'AID':  ['Data Science', 'Python', 'R', 'Tableau', 'Machine Learning', 'SQL'],
    'AIML': ['AI', 'ML', 'Python', 'PyTorch', 'Computer Vision', 'NLP'],
    'CSO':  ['IoT', 'Python', 'Arduino', 'Raspberry Pi', 'Node.js', 'MQTT'],
    'CIC':  ['Cybersecurity', 'Blockchain', 'Python', 'Network Security', 'Solidity'],
    'ECE':  ['VLSI Design', 'Embedded Systems', 'MATLAB', 'Verilog', 'Arduino'],
    'EEE':  ['Power Systems', 'Control Systems', 'MATLAB', 'PLC Programming'],
    'IT':   ['Python', 'Java', 'Web Development', 'Cloud Computing', 'DevOps'],
    'CIV':  ['AutoCAD', 'Revit', 'STAAD Pro', 'BIM', 'Surveying'],
    'MEC':  ['AutoCAD', 'SolidWorks', 'CATIA', 'ANSYS', 'CNC Programming'],
}


def make_roll_number(year_2digit, branch_code, serial):
    """Generate roll number: YYBq1A{branch_code}{serial:02d}"""
    return f"{year_2digit}BQ1A{branch_code}{serial:02d}"


class Command(BaseCommand):
    help = 'Seed counsellors for all 11 departments with students and alumni'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear-counsellors',
            action='store_true',
            help='Delete existing seeded counsellors before re-seeding',
        )

    def handle(self, *args, **options):
        if options['clear_counsellors']:
            self._clear_seeded_counsellors()

        self.stdout.write(self.style.MIGRATE_HEADING('Seeding counsellors for all departments...'))

        counsellors = self._seed_counsellors()
        self._seed_students_and_alumni(counsellors)

        self.stdout.write(self.style.SUCCESS('\nCounsellor seeding complete!'))
        self.stdout.write('')
        self.stdout.write('Counsellor login credentials:')
        for dept_info in DEPARTMENTS:
            dept = dept_info['code'].lower()
            self.stdout.write(f"  counsellor.{dept}@vvit.net  /  Counsellor@123")

    def _clear_seeded_counsellors(self):
        """Remove counsellors whose emails match the seeding pattern."""
        deleted = 0
        for dept_info in DEPARTMENTS:
            dept = dept_info['code'].lower()
            email = f"counsellor.{dept}@vvit.net"
            count, _ = User.objects.filter(email=email, role='counsellor').delete()
            deleted += count
        self.stdout.write(f'Removed {deleted} existing seeded counsellors.')

    def _seed_counsellors(self):
        """Create 1 counsellor per department in SQLite + MongoDB."""
        counsellors = {}

        for data in COUNSELLORS_DATA:
            dept_code = data['code']
            dept = dept_code.lower()
            email = f"counsellor.{dept}@vvit.net"

            # --- Django ORM (SQLite - primary auth) ---
            django_counsellor, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'role': 'counsellor',
                    'department': dept_code,
                    'is_active': True,
                    'is_verified': True,
                }
            )
            if created:
                django_counsellor.set_password('Counsellor@123')
                django_counsellor.save()
                self.stdout.write(f"  ✓ Created counsellor: {email} [{dept_code}]")
            else:
                # Ensure counsellor is active and verified even if pre-existing
                updated = False
                if not django_counsellor.is_active:
                    django_counsellor.is_active = True
                    updated = True
                if not django_counsellor.is_verified:
                    django_counsellor.is_verified = True
                    updated = True
                if updated:
                    django_counsellor.save()
                self.stdout.write(f"  - Counsellor already exists: {email} [{dept_code}]")

            # --- MongoDB sync ---
            try:
                from common.models import User as MongoUser
                mongo_counsellor = MongoUser.objects(email=email).first()
                if not mongo_counsellor:
                    mongo_counsellor = MongoUser(
                        email=email,
                        first_name=data['first_name'],
                        last_name=data['last_name'],
                        role='counsellor',
                        department=dept_code,
                        is_active=True,
                        is_verified=True,
                    )
                    mongo_counsellor.set_password('Counsellor@123')
                    mongo_counsellor.save()
                    self.stdout.write(f"    → MongoDB synced for {email}")
                else:
                    if not mongo_counsellor.is_active or not mongo_counsellor.is_verified:
                        mongo_counsellor.is_active = True
                        mongo_counsellor.is_verified = True
                        mongo_counsellor.save()
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"    ⚠ MongoDB sync failed for {email}: {e}"))

            counsellors[dept_code] = django_counsellor

        return counsellors

    def _seed_students_and_alumni(self, counsellors):
        """Create sample students and alumni per department and assign them."""
        self.stdout.write('')
        self.stdout.write(self.style.MIGRATE_HEADING('Seeding students and alumni per department...'))

        student_names = list(STUDENT_NAMES)
        alumni_names = list(ALUMNI_NAMES)
        random.shuffle(student_names)
        random.shuffle(alumni_names)

        for i, dept_info in enumerate(DEPARTMENTS):
            dept_code = dept_info['code']
            branch_code = dept_info['branch_code']
            counsellor = counsellors.get(dept_code)
            if not counsellor:
                continue

            # Pick 3-4 student names specific to this dept
            dept_students = student_names[i * 3 % len(student_names):(i * 3 % len(student_names)) + 3]
            if not dept_students:
                dept_students = student_names[:3]

            # Pick 2 alumni names
            dept_alumni = alumni_names[i * 2 % len(alumni_names):(i * 2 % len(alumni_names)) + 2]
            if not dept_alumni:
                dept_alumni = alumni_names[:2]

            # Create students
            for j, (first, last) in enumerate(dept_students):
                serial = j + 1
                year = '22'
                roll_no = make_roll_number(year, branch_code, serial)
                email = f"student.{dept_code.lower()}.{serial:02d}@vvit.net"
                self._create_student(email, first, last, dept_code, roll_no,
                                     int('20' + year), counsellor)

            # Create alumni
            for j, (first, last) in enumerate(dept_alumni):
                serial = j + 1
                year = '19'
                roll_no = make_roll_number(year, branch_code, serial + 50)
                email = f"alumni.{dept_code.lower()}.{serial:02d}@vvit.net"
                grad_year = 2023
                company = COMPANIES[(i + j) % len(COMPANIES)]
                self._create_alumni(email, first, last, dept_code, roll_no,
                                    grad_year, company, counsellor)

            self.stdout.write(f"  ✓ {dept_code}: {len(dept_students)} students + {len(dept_alumni)} alumni")

        # Also assign any EXISTING unassigned students/alumni per department
        self._assign_existing_users(counsellors)

    def _create_student(self, email, first_name, last_name, dept_code, roll_no,
                         batch_year, counsellor):
        """Create a student in SQLite + MongoDB and assign counsellor."""
        # Django ORM
        django_student, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'role': 'student',
                'department': dept_code,
                'is_active': True,
                'is_verified': True,
                'assigned_counsellor': counsellor,
            }
        )
        if created:
            django_student.set_password('Student@123')
            django_student.save()
            # Create SQLite StudentProfile
            if not StudentProfile.objects.filter(roll_number=roll_no).exists():
                StudentProfile.objects.create(
                    user=django_student,
                    roll_number=roll_no,
                    batch_year=batch_year,
                    graduation_year=batch_year + 4,
                    current_year=3,
                    current_semester=5,
                    cgpa=round(random.uniform(6.5, 9.5), 2),
                    skills=random.sample(SKILLS_BY_DEPT.get(dept_code, ['Python']), 3),
                )
        else:
            # Update counsellor assignment if not set
            if not django_student.assigned_counsellor:
                django_student.assigned_counsellor = counsellor
                django_student.save()

        # MongoDB sync
        try:
            from common.models import User as MongoUser, StudentProfile as MongoStudentProfile
            mongo_student = MongoUser.objects(email=email).first()
            if not mongo_student:
                mongo_student = MongoUser(
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    role='student',
                    department=dept_code,
                    is_active=True,
                    is_verified=True,
                )
                mongo_student.set_password('Student@123')
                mongo_student.save()

            # Set assigned counsellor in MongoDB
            mongo_counsellor = MongoUser.objects(email=counsellor.email).first()
            if mongo_counsellor and mongo_student.assigned_counsellor != mongo_counsellor:
                mongo_student.assigned_counsellor = mongo_counsellor
                mongo_student.save()

            # Create MongoDB StudentProfile if missing
            if not MongoStudentProfile.objects(user=mongo_student).first():
                MongoStudentProfile(
                    user=mongo_student,
                    roll_no=roll_no,
                    department=dept_code,
                    year=3,
                    joined_year=batch_year,
                    completion_year=batch_year + 4,
                    current_year=3,
                    current_semester=5,
                    cgpa=round(random.uniform(6.5, 9.5), 2),
                    skills=random.sample(SKILLS_BY_DEPT.get(dept_code, ['Python']), 3),
                    career_interest=f"{dept_code} Engineering",
                    bio=f"Student of {dept_code} department.",
                    is_placed=False,
                ).save()
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"    ⚠ MongoDB sync failed for student {email}: {e}"))

    def _create_alumni(self, email, first_name, last_name, dept_code, roll_no,
                        grad_year, company, counsellor):
        """Create an alumni in SQLite + MongoDB and assign counsellor."""
        # Django ORM
        django_alumni, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': first_name,
                'last_name': last_name,
                'role': 'alumni',
                'department': dept_code,
                'is_active': True,
                'is_verified': True,
                'assigned_counsellor': counsellor,
            }
        )
        if created:
            django_alumni.set_password('Alumni@123')
            django_alumni.save()
            # Create SQLite AlumniProfile
            AlumniProfile.objects.get_or_create(
                user=django_alumni,
                defaults={
                    'graduation_year': grad_year,
                    'roll_number': roll_no,
                    'current_company': company,
                    'current_designation': 'Software Engineer',
                    'verification_status': 'verified',
                    'skills': random.sample(SKILLS_BY_DEPT.get(dept_code, ['Python']), 3),
                }
            )
        else:
            if not django_alumni.assigned_counsellor:
                django_alumni.assigned_counsellor = counsellor
                django_alumni.save()

        # MongoDB sync
        try:
            from common.models import User as MongoUser, AlumniProfile as MongoAlumniProfile
            mongo_alumni = MongoUser.objects(email=email).first()
            if not mongo_alumni:
                mongo_alumni = MongoUser(
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    role='alumni',
                    department=dept_code,
                    is_active=True,
                    is_verified=True,
                )
                mongo_alumni.set_password('Alumni@123')
                mongo_alumni.save()

            # Set assigned counsellor in MongoDB
            mongo_counsellor = MongoUser.objects(email=counsellor.email).first()
            if mongo_counsellor and mongo_alumni.assigned_counsellor != mongo_counsellor:
                mongo_alumni.assigned_counsellor = mongo_counsellor
                mongo_alumni.save()

            # Create MongoDB AlumniProfile if missing
            if not MongoAlumniProfile.objects(user=mongo_alumni).first():
                MongoAlumniProfile(
                    user=mongo_alumni,
                    roll_no=roll_no,
                    department=dept_code,
                    graduation_year=grad_year,
                    current_company=company,
                    current_position='Software Engineer',
                    location='Hyderabad, India',
                    is_verified=True,
                    bio=f"Alumni of {dept_code} department, working at {company}.",
                ).save()
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"    ⚠ MongoDB sync failed for alumni {email}: {e}"))

    def _assign_existing_users(self, counsellors):
        """Assign any existing unassigned students/alumni to their dept counsellor."""
        self.stdout.write('')
        self.stdout.write('Assigning existing unassigned users to counsellors...')
        count = 0
        for dept_code, counsellor in counsellors.items():
            # Django ORM: students (case-insensitive dept match)
            unassigned_students = User.objects.filter(
                role='student',
                department__iexact=dept_code,
                assigned_counsellor__isnull=True,
            ).exclude(email__startswith='student.')
            for student in unassigned_students:
                student.assigned_counsellor = counsellor
                student.save(update_fields=['assigned_counsellor'])
                count += 1
                # Sync to MongoDB
                try:
                    from common.models import User as MongoUser
                    mongo_student = MongoUser.objects(email=student.email).first()
                    mongo_counsellor = MongoUser.objects(email=counsellor.email).first()
                    if mongo_student and mongo_counsellor:
                        mongo_student.assigned_counsellor = mongo_counsellor
                        mongo_student.save()
                except Exception:
                    pass

            # Django ORM: alumni (case-insensitive dept match)
            unassigned_alumni = User.objects.filter(
                role='alumni',
                department__iexact=dept_code,
                assigned_counsellor__isnull=True,
            ).exclude(email__startswith='alumni.')
            for alumni in unassigned_alumni:
                alumni.assigned_counsellor = counsellor
                alumni.save(update_fields=['assigned_counsellor'])
                count += 1
                try:
                    from common.models import User as MongoUser
                    mongo_alumni = MongoUser.objects(email=alumni.email).first()
                    mongo_counsellor = MongoUser.objects(email=counsellor.email).first()
                    if mongo_alumni and mongo_counsellor:
                        mongo_alumni.assigned_counsellor = mongo_counsellor
                        mongo_alumni.save()
                except Exception:
                    pass

        if count:
            self.stdout.write(f"  → Assigned {count} existing users to their counsellors")
        else:
            self.stdout.write('  → No unassigned users found')
