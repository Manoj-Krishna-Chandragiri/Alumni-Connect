import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

print("\n" + "="*80)
print("ALL LOGIN CREDENTIALS")
print("="*80)

# Group by role
roles = ['admin', 'principal', 'hod', 'counsellor', 'student', 'alumni']

for role in roles:
    users = User.objects.filter(role=role).order_by('email')
    if users.exists():
        print(f"\n{role.upper()}S:")
        print("-" * 80)
        for user in users:
            # Determine password based on role
            if role == 'admin':
                password = 'Admin@123'
            elif role == 'principal':
                password = 'Principal@123'
            elif role == 'hod':
                password = 'HOD@123'
            elif role == 'counsellor':
                password = 'Counsellor@123'
            elif role == 'student':
                password = 'Student@123'
            elif role == 'alumni':
                password = 'Alumni@123'
            else:
                password = 'Unknown'
            
            print(f"  Email: {user.email:45} | Password: {password}")

print("\n" + "="*80)
print(f"TOTAL USERS: {User.objects.count()}")
print("="*80 + "\n")
