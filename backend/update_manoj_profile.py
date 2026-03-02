"""
Update Manoj Krishna's profile with skills for AI matching
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.accounts.models import StudentProfile

User = get_user_model()

print("\n" + "="*80)
print("👤 UPDATING MANOJ KRISHNA'S PROFILE")
print("="*80)

try:
    user = User.objects.get(email='22bq1a4225@vvit.net')
    profile = user.student_profile
    
    print(f"\n📋 Current Profile:")
    print(f"   Name: {user.full_name}")
    print(f"   Email: {user.email}")
    print(f"   Department: {user.department}")
    print(f"   Skills: {profile.skills or 'None'}")
    print(f"   Interests: {profile.interests or 'None'}")
    print(f"   Bio: {profile.bio or 'None'}")
    
    # Update with skills and interests
    profile.skills = ['Python', 'JavaScript', 'React', 'Django', 'SQL', 'Git']
    profile.interests = ['Web Development', 'Cloud Computing', 'AI/ML', 'System Design']
    profile.bio = 'Computer Science student passionate about full-stack development and cloud technologies. Looking to connect with industry professionals and explore internship opportunities in software engineering.'
    profile.save()
    
    print(f"\n✅ Updated Profile:")
    print(f"   Skills: {profile.skills}")
    print(f"   Interests: {profile.interests}")
    print(f"   Bio: {profile.bio[:80]}...")
    
    print(f"\n{'='*80}")
    print("✅ Profile updated successfully!")
    print("Now AI recommendation engine can match Manoj with alumni mentors!")
    print(f"{'='*80}\n")
    
except User.DoesNotExist:
    print("\n❌ User not found!")
except Exception as e:
    print(f"\n❌ Error: {str(e)}")
