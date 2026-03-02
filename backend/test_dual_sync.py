"""
Test Dual Database Synchronization
===================================
This script tests that new users are being synced to BOTH SQLite AND MongoDB.
"""

import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from common.models import User as MongoUser, StudentProfile as MongoStudentProfile

User = get_user_model()

def test_user_in_both_databases(email):
    """Check if a user exists in both SQLite and MongoDB"""
    
    print(f"\n{'='*70}")
    print(f"🔍 Checking user: {email}")
    print(f"{'='*70}")
    
    # Check SQLite
    try:
        sqlite_user = User.objects.get(email=email)
        print(f"\n✅ SQLite User Found:")
        print(f"   - Email: {sqlite_user.email}")
        print(f"   - Name: {sqlite_user.first_name} {sqlite_user.last_name}")
        print(f"   - Role: {sqlite_user.role}")
        print(f"   - Active: {sqlite_user.is_active}")
        print(f"   - Verified: {sqlite_user.is_verified}")
        
        # Check for StudentProfile
        if hasattr(sqlite_user, 'student_profile'):
            profile = sqlite_user.student_profile
            print(f"   - Roll Number: {profile.roll_number}")
            print(f"   - Batch Year: {profile.batch_year}")
            print(f"   - Graduation Year: {profile.graduation_year}")
    except User.DoesNotExist:
        print(f"\n❌ SQLite User NOT Found")
        sqlite_user = None
    
    # Check MongoDB
    try:
        mongo_user = MongoUser.objects(email=email).first()
        if mongo_user:
            print(f"\n✅ MongoDB User Found:")
            print(f"   - Email: {mongo_user.email}")
            print(f"   - Name: {mongo_user.first_name} {mongo_user.last_name}")
            print(f"   - Role: {mongo_user.role}")
            print(f"   - Active: {mongo_user.is_active}")
            print(f"   - Verified: {mongo_user.is_verified}")
            
            # Check for StudentProfile
            mongo_profile = MongoStudentProfile.objects(user=mongo_user).first()
            if mongo_profile:
                print(f"   - Roll Number: {mongo_profile.roll_no}")
                print(f"   - Joined Year: {mongo_profile.joined_year}")
                print(f"   - Completion Year: {mongo_profile.completion_year}")
        else:
            print(f"\n❌ MongoDB User NOT Found")
    except Exception as e:
        print(f"\n❌ MongoDB Error: {str(e)}")
        mongo_user = None
    
    # Summary
    print(f"\n{'='*70}")
    if sqlite_user and mongo_user:
        print("✅ SYNC STATUS: User exists in BOTH databases!")
    elif sqlite_user and not mongo_user:
        print("⚠️  SYNC STATUS: User only in SQLite (sync may have failed)")
    elif not sqlite_user and mongo_user:
        print("⚠️  SYNC STATUS: User only in MongoDB (legacy data?)")
    else:
        print("❌ SYNC STATUS: User not found in either database")
    print(f"{'='*70}\n")
    
    return sqlite_user and mongo_user

def list_all_users():
    """List all users in both databases for comparison"""
    
    print(f"\n{'='*70}")
    print("📊 ALL USERS COMPARISON")
    print(f"{'='*70}")
    
    # SQLite users
    sqlite_users = User.objects.all().values_list('email', 'first_name', 'last_name', 'role')
    print(f"\n📦 SQLite Users ({len(sqlite_users)} total):")
    for email, fname, lname, role in sqlite_users:
        print(f"   - {email} ({fname} {lname}) - {role}")
    
    # MongoDB users
    mongo_users = MongoUser.objects.all()
    print(f"\n📦 MongoDB Users ({mongo_users.count()} total):")
    for user in mongo_users:
        print(f"   - {user.email} ({user.first_name} {user.last_name}) - {user.role}")
    
    # Find synced users
    sqlite_emails = set(User.objects.values_list('email', flat=True))
    mongo_emails = set(user.email for user in mongo_users)
    
    synced_emails = sqlite_emails & mongo_emails
    only_sqlite = sqlite_emails - mongo_emails
    only_mongo = mongo_emails - sqlite_emails
    
    print(f"\n{'='*70}")
    print(f"✅ Synced Users (in both): {len(synced_emails)}")
    for email in synced_emails:
        print(f"   - {email}")
    
    if only_sqlite:
        print(f"\n⚠️  Only in SQLite: {len(only_sqlite)}")
        for email in only_sqlite:
            print(f"   - {email}")
    
    if only_mongo:
        print(f"\n⚠️  Only in MongoDB: {len(only_mongo)}")
        for email in only_mongo:
            print(f"   - {email}")
    
    print(f"\n{'='*70}\n")
    
    return {
        'synced': len(synced_emails),
        'only_sqlite': len(only_sqlite),
        'only_mongo': len(only_mongo)
    }

if __name__ == '__main__':
    print("\n" + "="*70)
    print("🔄 DUAL DATABASE SYNC TEST")
    print("="*70)
    
    # Test specific user if provided
    if len(sys.argv) > 1:
        email = sys.argv[1]
        test_user_in_both_databases(email)
    else:
        # List all users
        stats = list_all_users()
        
        print("\n💡 USAGE:")
        print("   python test_dual_sync.py <email>")
        print("   Example: python test_dual_sync.py 22bq1a4225@vvit.net")
        print("\n💡 TO TEST NEW REGISTRATION:")
        print("   1. Register a new user via the frontend")
        print("   2. Run: python test_dual_sync.py <their_email>")
        print("   3. Check console for sync messages (✅ MongoDB sync: User created)")
        print()
