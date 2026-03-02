"""
Verify All Seeded Users
========================
This script sets is_verified=True and is_active=True for all seeded users
in BOTH SQLite and MongoDB databases.
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from common.models import User as MongoUser

User = get_user_model()

def verify_all_users():
    """Set all users to verified and active in both databases"""
    
    print("\n" + "="*80)
    print("🔧 VERIFYING ALL SEEDED USERS")
    print("="*80)
    
    # Get all SQLite users
    sqlite_users = User.objects.all()
    
    print(f"\n📦 Found {sqlite_users.count()} users in SQLite")
    print(f"\n{'Email':<50} {'Status'}")
    print("-" * 80)
    
    updated_count = 0
    already_verified = 0
    
    for user in sqlite_users:
        # Update SQLite
        needs_update = False
        if not user.is_verified or not user.is_active:
            needs_update = True
            user.is_verified = True
            user.is_active = True
            user.save()
            updated_count += 1
            status = "✅ VERIFIED (SQLite)"
        else:
            already_verified += 1
            status = "✓ Already verified"
        
        # Sync to MongoDB
        try:
            mongo_user = MongoUser.objects(email=user.email).first()
            if mongo_user:
                if not mongo_user.is_verified or not mongo_user.is_active:
                    mongo_user.is_verified = True
                    mongo_user.is_active = True
                    mongo_user.save()
                    status += " + MongoDB"
                else:
                    status += " (MongoDB ✓)"
            else:
                status += " (not in MongoDB)"
        except Exception as e:
            status += f" (MongoDB error: {str(e)[:20]})"
        
        print(f"{user.email:<50} {status}")
    
    print("\n" + "="*80)
    print(f"✅ Updated: {updated_count} users")
    print(f"✓ Already verified: {already_verified} users")
    print("="*80)
    
    # Verify MongoDB users too
    print("\n📦 Checking MongoDB users...")
    try:
        mongo_users = MongoUser.objects.all()
        mongo_updated = 0
        
        for mongo_user in mongo_users:
            if not mongo_user.is_verified or not mongo_user.is_active:
                mongo_user.is_verified = True
                mongo_user.is_active = True
                mongo_user.save()
                mongo_updated += 1
        
        if mongo_updated > 0:
            print(f"✅ Updated {mongo_updated} MongoDB-only users")
        else:
            print("✓ All MongoDB users already verified")
    except Exception as e:
        print(f"⚠️  MongoDB error: {str(e)}")
    
    print("\n" + "="*80)
    print("🎉 ALL USERS NOW VERIFIED AND ACTIVE!")
    print("="*80 + "\n")

if __name__ == '__main__':
    verify_all_users()
