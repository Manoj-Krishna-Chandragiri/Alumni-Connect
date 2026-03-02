"""
Test email configuration for VVIT Alumni Connect
This script tests if OTP emails can be sent successfully
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.core.mail import send_mail

print("=" * 60)
print("Testing VVIT Email Configuration")
print("=" * 60)
print(f"From: 22bq1a4225@vvit.net")
print(f"To: 22bq1a4225@vvit.net (sending to yourself for testing)")
print("")

try:
    result = send_mail(
        subject='🔐 Test OTP Email - Alumni Connect',
        message='Your OTP code is: 123456\n\nThis is a test email from VVITU Alumni Network.\nIf you received this, your email configuration is working correctly!',
        from_email='22bq1a4225@vvit.net',
        recipient_list=['22bq1a4225@vvit.net'],
        fail_silently=False,
    )
    
    print("✅ SUCCESS! Email sent successfully!")
    print(f"   Result: {result}")
    print("")
    print("📬 Check your Outlook inbox at: https://outlook.office365.com")
    print("   Email: 22bq1a4225@vvit.net")
    print("")
    print("If you see the test email, your configuration is perfect!")
    print("The system can now send OTPs to ANY email address during registration.")
    
except Exception as e:
    print("❌ ERROR: Failed to send email")
    print(f"   Error: {str(e)}")
    print("")
    print("Troubleshooting:")
    print("1. Verify your password is correct in .env file")
    print("2. Check if you can login to Outlook with the same credentials")
    print("3. Try alternative SMTP servers in .env:")
    print("   - outlook.office365.com")
    print("   - smtp-mail.outlook.com")
    print("4. Contact IT if SMTP is blocked for student accounts")

print("=" * 60)
