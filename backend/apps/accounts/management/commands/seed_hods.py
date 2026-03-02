"""
Management command to seed HODs (Heads of Department) for all 11 departments.

Creates 1 HOD per department in Django ORM (SQLite) + MongoDB, then:
  - Assigns each department's counsellor to report to the HOD (`reports_to_hod`)
  - Assigns all dept students/alumni to report to the HOD indirectly (via counsellor)

Hierarchy: Student/Alumni → Counsellor → HOD → Principal → Admin

Usage:
    python manage.py seed_hods
    python manage.py seed_hods --clear-hods
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

# All 11 departments with HOD data (realistic Indian professor names)
HODS_DATA = [
    {
        'code': 'CSE',
        'name': 'Computer Science & Engineering',
        'first_name': 'Venkata Ramana',
        'last_name': 'Murthy',
        'qualification': 'Ph.D (Computer Science)',
        'specialization': 'Machine Learning & Distributed Systems',
        'experience_years': 18,
        'phone': '9848012345',
    },
    {
        'code': 'CSM',
        'name': 'CSE with AI & ML',
        'first_name': 'Srinivasa',
        'last_name': 'Rao',
        'qualification': 'Ph.D (Artificial Intelligence)',
        'specialization': 'Deep Learning & Neural Networks',
        'experience_years': 15,
        'phone': '9848023456',
    },
    {
        'code': 'AID',
        'name': 'Artificial Intelligence & Data Science',
        'first_name': 'Padmavathi',
        'last_name': 'Devi',
        'qualification': 'Ph.D (Data Science)',
        'specialization': 'Big Data Analytics & Business Intelligence',
        'experience_years': 14,
        'phone': '9848034567',
    },
    {
        'code': 'AIML',
        'name': 'Artificial Intelligence & Machine Learning',
        'first_name': 'Gopinath',
        'last_name': 'Reddy',
        'qualification': 'Ph.D (Machine Learning)',
        'specialization': 'Computer Vision & Natural Language Processing',
        'experience_years': 16,
        'phone': '9848045678',
    },
    {
        'code': 'CSO',
        'name': 'CSE with IoT',
        'first_name': 'Lakshmi Narayana',
        'last_name': 'Prasad',
        'qualification': 'Ph.D (Internet of Things)',
        'specialization': 'Embedded Systems & IoT Architecture',
        'experience_years': 13,
        'phone': '9848056789',
    },
    {
        'code': 'CIC',
        'name': 'CSE with IoT and Cyber Security',
        'first_name': 'Chandrakala',
        'last_name': 'Sharma',
        'qualification': 'Ph.D (Cyber Security)',
        'specialization': 'Network Security & Blockchain Technology',
        'experience_years': 17,
        'phone': '9848067890',
    },
    {
        'code': 'ECE',
        'name': 'Electronics & Communication Engineering',
        'first_name': 'Subrahmanyam',
        'last_name': 'Naidu',
        'qualification': 'Ph.D (VLSI Design)',
        'specialization': 'Signal Processing & Wireless Communications',
        'experience_years': 20,
        'phone': '9848078901',
    },
    {
        'code': 'EEE',
        'name': 'Electrical & Electronics Engineering',
        'first_name': 'Satyanarayana',
        'last_name': 'Babu',
        'qualification': 'Ph.D (Power Systems)',
        'specialization': 'Power Electronics & Renewable Energy',
        'experience_years': 22,
        'phone': '9848089012',
    },
    {
        'code': 'IT',
        'name': 'Information Technology',
        'first_name': 'Venkateswara',
        'last_name': 'Raju',
        'qualification': 'Ph.D (Information Technology)',
        'specialization': 'Cloud Computing & DevOps',
        'experience_years': 15,
        'phone': '9848090123',
    },
    {
        'code': 'CIV',
        'name': 'Civil Engineering',
        'first_name': 'Raghavendra',
        'last_name': 'Varma',
        'qualification': 'Ph.D (Structural Engineering)',
        'specialization': 'Structural Analysis & Construction Management',
        'experience_years': 24,
        'phone': '9848001234',
    },
    {
        'code': 'MEC',
        'name': 'Mechanical Engineering',
        'first_name': 'Surya Narayana',
        'last_name': 'Rao',
        'qualification': 'Ph.D (Mechanical Engineering)',
        'specialization': 'CAD/CAM & Manufacturing Technology',
        'experience_years': 21,
        'phone': '9848011234',
    },
]


class Command(BaseCommand):
    help = 'Seed HODs (Heads of Department) for all 11 departments'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear-hods',
            action='store_true',
            help='Delete existing seeded HODs before re-seeding',
        )

    def handle(self, *args, **options):
        if options['clear_hods']:
            self._clear_seeded_hods()

        self.stdout.write(self.style.MIGRATE_HEADING('Seeding HODs for all 11 departments...'))

        hods = self._seed_hods()
        self._link_counsellors_to_hods(hods)

        self.stdout.write(self.style.SUCCESS('\nHOD seeding complete!'))
        self.stdout.write('')
        self.stdout.write('HOD login credentials:')
        for data in HODS_DATA:
            dept = data['code'].lower()
            self.stdout.write(f"  hod.{dept}@vvit.net  /  HOD@123")
        self.stdout.write('')
        self.stdout.write(
            self.style.WARNING('Hierarchy: Student/Alumni → Counsellor → HOD → Principal → Admin')
        )

    # ------------------------------------------------------------------ #
    # Private helpers
    # ------------------------------------------------------------------ #

    def _clear_seeded_hods(self):
        """Remove HODs whose emails match the seeding pattern."""
        deleted = 0
        for data in HODS_DATA:
            dept = data['code'].lower()
            email = f"hod.{dept}@vvit.net"
            count, _ = User.objects.filter(email=email, role='hod').delete()
            deleted += count
            # Also clean MongoDB
            try:
                from common.models import User as MongoUser
                MongoUser.objects(email=email, role='hod').delete()
            except Exception:
                pass
        self.stdout.write(f'Removed {deleted} existing seeded HODs.')

    def _seed_hods(self):
        """Create 1 HOD per department in Django ORM + MongoDB."""
        hods = {}

        for data in HODS_DATA:
            dept_code = data['code']
            dept = dept_code.lower()
            email = f"hod.{dept}@vvit.net"

            # ---- Django ORM (SQLite) ----
            django_hod, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'first_name': data['first_name'],
                    'last_name': data['last_name'],
                    'role': 'hod',
                    'department': dept_code,
                    'phone': data.get('phone'),
                    'is_active': True,
                    'is_verified': True,
                    'is_staff': False,
                }
            )
            if created:
                django_hod.set_password('HOD@123')
                django_hod.save()
                self.stdout.write(
                    f"  ✓ Created HOD: {email} [{dept_code}] — Dr. {data['first_name']} {data['last_name']}"
                )
            else:
                if not django_hod.is_active or not django_hod.is_verified:
                    django_hod.is_active = True
                    django_hod.is_verified = True
                    django_hod.save()
                self.stdout.write(f"  - HOD already exists: {email} [{dept_code}]")

            # ---- MongoDB sync ----
            try:
                from common.models import User as MongoUser
                mongo_hod = MongoUser.objects(email=email).first()
                if not mongo_hod:
                    mongo_hod = MongoUser(
                        email=email,
                        first_name=data['first_name'],
                        last_name=data['last_name'],
                        role='hod',
                        department=dept_code,
                        is_active=True,
                        is_verified=True,
                    )
                    mongo_hod.set_password('HOD@123')
                    mongo_hod.save()
                    self.stdout.write(f"    → MongoDB synced for {email}")
                else:
                    updated = False
                    if not mongo_hod.is_active:
                        mongo_hod.is_active = True
                        updated = True
                    if not mongo_hod.is_verified:
                        mongo_hod.is_verified = True
                        updated = True
                    if not mongo_hod.department:
                        mongo_hod.department = dept_code
                        updated = True
                    if updated:
                        mongo_hod.save()
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"    ⚠ MongoDB sync failed for {email}: {e}"))

            hods[dept_code] = django_hod

        return hods

    def _link_counsellors_to_hods(self, hods):
        """
        Set `reports_to_hod` on every counsellor pointing to the HOD
        of the same department (case-insensitive), in both Django ORM and MongoDB.
        """
        self.stdout.write('')
        self.stdout.write(self.style.MIGRATE_HEADING('Linking counsellors → HODs...'))

        linked = 0
        already_linked = 0

        for dept_code, hod in hods.items():
            counsellors = User.objects.filter(role='counsellor', department__iexact=dept_code)
            for counsellor in counsellors:
                # Django ORM
                if counsellor.reports_to_hod_id != hod.pk:
                    counsellor.reports_to_hod = hod
                    counsellor.save(update_fields=['reports_to_hod'])
                    linked += 1
                    action = '✓ Linked'
                else:
                    already_linked += 1
                    action = '- Already linked'

                self.stdout.write(
                    f"  {action}: counsellor {counsellor.email} → HOD {hod.email} [{dept_code}]"
                )

                # MongoDB sync
                try:
                    from common.models import User as MongoUser
                    mongo_counsellor = MongoUser.objects(email=counsellor.email).first()
                    mongo_hod = MongoUser.objects(email=hod.email).first()
                    if mongo_counsellor and mongo_hod:
                        if mongo_counsellor.reports_to_hod != mongo_hod:
                            mongo_counsellor.reports_to_hod = mongo_hod
                            mongo_counsellor.save()
                except Exception as e:
                    self.stdout.write(
                        self.style.WARNING(f"    ⚠ MongoDB link failed for {counsellor.email}: {e}")
                    )

        self.stdout.write(f'  Linked: {linked} new, {already_linked} already set.')
