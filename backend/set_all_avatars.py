import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Set default avatars for users without one
users = User.objects.all()

for user in users:
    if not user.avatar:
        # Generate avatar URL using ui-avatars.com
        name = f"{user.first_name}+{user.last_name}".replace(' ', '+')
        avatar_url = f"https://ui-avatars.com/api/?name={name}&background=4F46E5&color=fff&size=128"
        user.avatar = avatar_url
        user.save()
        
        # Also set profile picture if exists
        if hasattr(user, 'student_profile') and user.student_profile:
            user.student_profile.profile_picture = avatar_url
            user.student_profile.save()
        elif hasattr(user, 'alumni_profile') and user.alumni_profile:
            user.alumni_profile.profile_picture = avatar_url
            user.alumni_profile.save()
        
        print(f"✓ Set avatar for {user.email}: {user.first_name} {user.last_name}")

print(f"\n✅ Done! Updated {users.count()} users")
