import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.accounts.models import EmailOTP
from django.utils import timezone

User = get_user_model()

email = '23BQ5A4214@vvit.net'.lower()

print(f"Searching for user with email: {email}")
print("=" * 60)

try:
    user = User.objects.get(email=email)
    print(f"✅ User found:")
    print(f"  Email: {user.email}")
    print(f"  Name: {user.first_name} {user.last_name}")
    print(f"  Role: {user.role}")
    print(f"  Active: {user.is_active}")
    print(f"  Verified: {user.is_verified}")
    print(f"  Created: {user.created_at}")
    
    # Check OTPs
    print("\n" + "=" * 60)
    print("OTPs for this user:")
    otps = EmailOTP.objects.filter(user=user, purpose='signup').order_by('-created_at')
    
    if otps.exists():
        for i, otp in enumerate(otps, 1):
            status = "✅ VALID" if not otp.is_expired() and not otp.is_verified else "❌ EXPIRED/USED"
            print(f"\n  OTP #{i}: {otp.otp_code} - {status}")
            print(f"    Created: {otp.created_at}")
            print(f"    Expires: {otp.expires_at}")
            print(f"    Verified: {otp.is_verified}")
            print(f"    Expired: {otp.is_expired()}")
            
        # Show the latest valid OTP
        latest_valid = EmailOTP.objects.filter(
            user=user,
            purpose='signup',
            is_verified=False
        ).order_by('-created_at').first()
        
        if latest_valid and not latest_valid.is_expired():
            print("\n" + "=" * 60)
            print(f"🔑 CURRENT VALID OTP: {latest_valid.otp_code}")
            print(f"   Use this OTP to verify your account!")
            print("=" * 60)
    else:
        print("  No OTPs found. Please request a new OTP.")
    
except User.DoesNotExist:
    print(f"❌ No user found with email: {email}")
    print("   User may have been deleted. Please register again.")
