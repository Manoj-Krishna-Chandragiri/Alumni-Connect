import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.accounts.models import StudentProfile

User = get_user_model()

user = User.objects.get(email='22bq1a4215@vvit.net')
print(f"User Avatar: {user.avatar}")

if hasattr(user, 'student_profile'):
    profile = user.student_profile
    print(f"Profile Picture: {profile.profile_picture}")
else:
    print("No student profile found")

# Set a default avatar
default_avatar = "https://ui-avatars.com/api/?name=Divya+Reddy&background=4F46E5&color=fff&size=128"
user.avatar = default_avatar
user.save()

if hasattr(user, 'student_profile'):
    user.student_profile.profile_picture = default_avatar
    user.student_profile.save()

print(f"\nUpdated Avatar: {user.avatar}")
print(f"Updated Profile Picture: {user.student_profile.profile_picture if hasattr(user, 'student_profile') else None}")
