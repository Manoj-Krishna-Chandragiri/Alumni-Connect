"""
OTP (One-Time Password) models for email verification.
"""
import secrets
from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class EmailOTP(models.Model):
    """
    OTP Model for email verification during signup.
    OTP expires in 5 minutes.
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='email_otps'
    )
    otp_code = models.CharField(max_length=6)
    purpose = models.CharField(
        max_length=20,
        choices=[
            ('signup', 'Signup Verification'),
            ('reset_password', 'Password Reset'),
        ],
        default='signup'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_verified = models.BooleanField(default=False)
    verified_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'email_otps'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'otp_code', 'is_verified']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"OTP for {self.user.email} - {self.otp_code}"
    
    @staticmethod
    def generate_otp_code():
        """Generate a random 6-digit numeric OTP code."""
        # Generate a 6-digit number between 100000 and 999999
        return str(secrets.randbelow(900000) + 100000)
    
    @classmethod
    def create_otp(cls, user, purpose='signup', expiry_minutes=5):
        """
        Create a new OTP for a user.
        Invalidates any previous unverified OTPs.
        """
        # Invalidate previous unverified OTPs
        cls.objects.filter(
            user=user,
            purpose=purpose,
            is_verified=False
        ).delete()
        
        # Generate new OTP
        otp_code = cls.generate_otp_code()
        expires_at = timezone.now() + timedelta(minutes=expiry_minutes)
        
        return cls.objects.create(
            user=user,
            otp_code=otp_code,
            purpose=purpose,
            expires_at=expires_at
        )
    
    def is_expired(self):
        """Check if OTP has expired."""
        return timezone.now() > self.expires_at
    
    def verify(self, code):
        """
        Verify OTP code.
        Returns (success: bool, message: str)
        """
        if self.is_verified:
            return False, "OTP already used"
        
        if self.is_expired():
            return False, "OTP has expired"
        
        if self.otp_code != code:
            return False, "Invalid OTP code"
        
        # Mark as verified
        self.is_verified = True
        self.verified_at = timezone.now()
        self.save()
        
        return True, "OTP verified successfully"
