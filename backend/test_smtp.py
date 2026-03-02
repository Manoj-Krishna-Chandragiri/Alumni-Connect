"""
Simple SMTP test for VVIT email configuration
Tests email sending without Django dependencies
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

print("=" * 60)
print("Testing VVIT Email Configuration (Direct SMTP)")
print("=" * 60)

# Email configuration from .env
EMAIL_HOST = "smtp.office365.com"
EMAIL_PORT = 587
EMAIL_FROM = "22bq1a4225@vvit.net"
EMAIL_PASSWORD = "Lu@B9pk@3k4Wp"
EMAIL_TO = "22bq1a4225@vvit.net"  # Sending to yourself for testing

print(f"\nConfiguration:")
print(f"  SMTP Server: {EMAIL_HOST}:{EMAIL_PORT}")
print(f"  From: {EMAIL_FROM}")
print(f"  To: {EMAIL_TO}")
print(f"  TLS: Enabled")
print("\nAttempting to send test email...\n")

try:
    # Create message
    msg = MIMEMultipart()
    msg['From'] = f"VVITU Alumni Network <{EMAIL_FROM}>"
    msg['To'] = EMAIL_TO
    msg['Subject'] = "🔐 Test OTP Email - Alumni Connect"
    
    body = """
    Your OTP code is: 123456
    
    This is a test email from VVITU Alumni Network.
    
    If you received this email, your email configuration is working correctly!
    
    The system can now send OTPs to ANY email address:
    - Students with @vvit.net emails
    - Alumni with @gmail.com, @outlook.com, or any other email
    
    No hardcoding needed - OTPs are sent automatically to whatever
    email the user enters during registration.
    
    ---
    VVITU Alumni Network
    """
    
    msg.attach(MIMEText(body, 'plain'))
    
    # Connect and send
    server = smtplib.SMTP(EMAIL_HOST, EMAIL_PORT)
    server.set_debuglevel(0)  # Set to 1 for detailed SMTP logs
    server.starttls()
    
    print("Logging in to SMTP server...")
    server.login(EMAIL_FROM, EMAIL_PASSWORD)
    
    print("Sending email...")
    server.send_message(msg)
    server.quit()
    
    print("\n" + "=" * 60)
    print("✅ SUCCESS! Email sent successfully!")
    print("=" * 60)
    print("\n📬 Check your Outlook inbox:")
    print("   URL: https://outlook.office365.com")
    print("   Email: 22bq1a4225@vvit.net")
    print("\nIf you see the test email, your configuration is perfect!")
    print("\n🎯 How it works:")
    print("   - System sends FROM: 22bq1a4225@vvit.net")
    print("   - Users can register with ANY email:")
    print("     ✓ 22bq0520@vvit.net")
    print("     ✓ 22bq1a1234@vvit.net")
    print("     ✓ john@gmail.com")
    print("     ✓ anyone@outlook.com")
    print("   - OTPs sent automatically to their email!")
    print("\n" + "=" * 60)
    
except smtplib.SMTPAuthenticationError as e:
    print("\n" + "=" * 60)
    print("❌ ERROR: Authentication Failed")
    print("=" * 60)
    print(f"\nError details: {str(e)}")
    print("\nTroubleshooting:")
    print("1. ✓ Verify password in .env file is correct")
    print("2. ✓ Try logging into Outlook with same credentials:")
    print("   https://outlook.office365.com")
    print("3. ✓ Contact IT department if SMTP is blocked")
    print("4. ✓ Try alternative SMTP servers:")
    print("   - outlook.office365.com")
    print("   - smtp-mail.outlook.com")
    
except Exception as e:
    print("\n" + "=" * 60)
    print("❌ ERROR: Failed to send email")
    print("=" * 60)
    print(f"\nError type: {type(e).__name__}")
    print(f"Error details: {str(e)}")
    print("\nTroubleshooting:")
    print("1. Check internet connection")
    print("2. Verify firewall isn't blocking port 587")
    print("3. Check .env file configuration")
