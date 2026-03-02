"""
Email notification service for Alumni Connect.
"""
from django.core.mail import send_mail, EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth import get_user_model
import os

User = get_user_model()


class EmailNotificationService:
    """Service for sending email notifications."""
    
    @staticmethod
    def send_otp_email(user, otp_code):
        """Send OTP verification email to new user."""
        # Print OTP to console in development mode for easy testing
        print(f"\n{'='*60}")
        print(f"📧 OTP Email for: {user.email}")
        print(f"🔑 OTP Code: {otp_code}")
        print(f"⏰ Expires in: 5 minutes")
        print(f"{'='*60}\n")
        
        subject = f'Verify Your Email - VVITU Alumni Network'
        
        context = {
            'user': user,
            'otp_code': otp_code,
            'site_name': 'VVITU Alumni Network',
            'verify_url': f'{settings.FRONTEND_URL}/verify-email',
        }
        
        html_message = render_to_string('emails/otp_verification.html', context)
        plain_message = f"""
        Email Verification - VVITU Alumni Network
        
        Hi {user.first_name},
        
        Thank you for registering with VVITU Alumni Network!
        
        Your One-Time Password (OTP) for email verification is:
        
        {otp_code}
        
        This OTP will expire in 5 minutes.
        
        Please enter this code on the verification page to activate your account.
        
        If you didn't create an account, please ignore this email.
        
        Best regards,
        VVITU Alumni Network Team
        """
        
        return EmailNotificationService._send_email(
            subject=subject,
            message=plain_message,
            recipient_list=[user.email],
            html_message=html_message
        )
    
    @staticmethod
    def send_welcome_email(user):
        """Send welcome email to new user."""
        subject = f'Welcome to VVITU Alumni Network, {user.first_name}!'
        
        context = {
            'user': user,
            'site_name': 'VVITU Alumni Network',
            'login_url': f'{settings.FRONTEND_URL}/login',
        }
        
        html_message = render_to_string('emails/welcome.html', context)
        plain_message = f"""
        Welcome to VVITU Alumni Network!
        
        Hi {user.first_name},
        
        Thank you for joining the VVITU Alumni Network. We're excited to have you as part of our community.
        
        Get started by:
        - Completing your profile
        - Connecting with fellow alumni
        - Exploring job opportunities
        - Reading career insights from alumni
        
        Login here: {settings.FRONTEND_URL}/login
        
        Best regards,
        VVITU Alumni Network Team
        """
        
        return EmailNotificationService._send_email(
            subject=subject,
            message=plain_message,
            recipient_list=[user.email],
            html_message=html_message
        )
    
    @staticmethod
    def send_profile_verification_email(user):
        """Send email when alumni profile is verified."""
        subject = 'Your VVITU Alumni Profile has been Verified!'
        
        context = {
            'user': user,
            'profile_url': f'{settings.FRONTEND_URL}/alumni/profile',
        }
        
        html_message = render_to_string('emails/profile_verified.html', context)
        plain_message = f"""
        Congratulations!
        
        Hi {user.first_name},
        
        Your alumni profile has been verified by our admin team. You now have full access to all alumni features including:
        
        - Post job opportunities
        - Write blogs and share insights
        - Mentor current students
        - Attend exclusive alumni events
        
        View your profile: {settings.FRONTEND_URL}/alumni/profile
        
        Thank you for being part of the VVITU Alumni Network!
        
        Best regards,
        VVITU Alumni Network Team
        """
        
        return EmailNotificationService._send_email(
            subject=subject,
            message=plain_message,
            recipient_list=[user.email],
            html_message=html_message
        )
    
    @staticmethod
    def send_job_notification(student, job):
        """Notify student about new job matching their profile."""
        subject = f'New Job Opportunity: {job.title}'
        
        context = {
            'student': student,
            'job': job,
            'job_url': f'{settings.FRONTEND_URL}/student/jobs/{job.id}',
        }
        
        html_message = render_to_string('emails/job_notification.html', context)
        plain_message = f"""
        New Job Opportunity!
        
        Hi {student.first_name},
        
        A new job has been posted that matches your profile:
        
        Position: {job.title}
        Company: {job.company}
        Location: {job.location}
        
        View job details: {settings.FRONTEND_URL}/student/jobs/{job.id}
        
        Best regards,
        VVITU Alumni Network Team
        """
        
        return EmailNotificationService._send_email(
            subject=subject,
            message=plain_message,
            recipient_list=[student.email],
            html_message=html_message
        )
    
    @staticmethod
    def send_event_reminder(user, event, days_before=1):
        """Send event reminder email."""
        subject = f'Reminder: {event.title} - Tomorrow!'
        
        context = {
            'user': user,
            'event': event,
            'days_before': days_before,
            'event_url': f'{settings.FRONTEND_URL}/events/{event.id}',
        }
        
        html_message = render_to_string('emails/event_reminder.html', context)
        plain_message = f"""
        Event Reminder
        
        Hi {user.first_name},
        
        This is a reminder about the upcoming event you registered for:
        
        Event: {event.title}
        Date: {event.date.strftime('%B %d, %Y')}
        Time: {event.time.strftime('%I:%M %p')}
        Location: {event.location}
        
        View event details: {settings.FRONTEND_URL}/events/{event.id}
        
        We look forward to seeing you there!
        
        Best regards,
        VVITU Alumni Network Team
        """
        
        return EmailNotificationService._send_email(
            subject=subject,
            message=plain_message,
            recipient_list=[user.email],
            html_message=html_message
        )
    
    @staticmethod
    def send_blog_comment_notification(author, blog, comment):
        """Notify blog author about new comment."""
        subject = f'New Comment on Your Blog: {blog.title}'
        
        context = {
            'author': author,
            'blog': blog,
            'comment': comment,
            'blog_url': f'{settings.FRONTEND_URL}/blogs/{blog.slug}',
        }
        
        html_message = render_to_string('emails/blog_comment.html', context)
        plain_message = f"""
        New Comment on Your Blog
        
        Hi {author.first_name},
        
        {comment.author.get_full_name()} commented on your blog "{blog.title}":
        
        "{comment.content[:200]}..."
        
        View and reply: {settings.FRONTEND_URL}/blogs/{blog.slug}
        
        Best regards,
        VVITU Alumni Network Team
        """
        
        return EmailNotificationService._send_email(
            subject=subject,
            message=plain_message,
            recipient_list=[author.email],
            html_message=html_message
        )
    
    @staticmethod
    def send_connection_request(recipient, sender):
        """Notify user about new connection request."""
        subject = f'{sender.get_full_name()} wants to connect with you'
        
        context = {
            'recipient': recipient,
            'sender': sender,
            'profile_url': f'{settings.FRONTEND_URL}/profile/{sender.id}',
        }
        
        html_message = render_to_string('emails/connection_request.html', context)
        plain_message = f"""
        New Connection Request
        
        Hi {recipient.first_name},
        
        {sender.get_full_name()} ({sender.email}) wants to connect with you on VVITU Alumni Network.
        
        View profile: {settings.FRONTEND_URL}/profile/{sender.id}
        
        Best regards,
        VVITU Alumni Network Team
        """
        
        return EmailNotificationService._send_email(
            subject=subject,
            message=plain_message,
            recipient_list=[recipient.email],
            html_message=html_message
        )
    
    @staticmethod
    def send_bulk_announcement(subject, message, recipient_list):
        """Send bulk announcement to multiple users."""
        return EmailNotificationService._send_email(
            subject=subject,
            message=message,
            recipient_list=recipient_list,
        )
    
    @staticmethod
    def _send_email(subject, message, recipient_list, html_message=None):
        """Internal method to send email. Supports both college and personal emails."""
        try:
            if html_message:
                email = EmailMultiAlternatives(
                    subject=subject,
                    body=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=recipient_list
                )
                email.attach_alternative(html_message, "text/html")
                email.send()
            else:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=recipient_list,
                    fail_silently=False,
                )
            print(f"Email sent successfully to: {', '.join(recipient_list)}")
            return True
        except Exception as e:
            print(f"Primary email failed ({str(e)}). Trying Gmail fallback...")
            
            # Try Gmail fallback
            gmail_user = os.getenv('GMAIL_HOST_USER', '')
            gmail_password = os.getenv('GMAIL_HOST_PASSWORD', '')
            
            if gmail_user and gmail_password:
                try:
                    from django.core.mail import get_connection
                    gmail_connection = get_connection(
                        backend='django.core.mail.backends.smtp.EmailBackend',
                        host='smtp.gmail.com',
                        port=587,
                        username=gmail_user,
                        password=gmail_password,
                        use_tls=True,
                    )
                    gmail_from = f'VVITU Alumni Network <{gmail_user}>'
                    if html_message:
                        email = EmailMultiAlternatives(
                            subject=subject,
                            body=message,
                            from_email=gmail_from,
                            to=recipient_list,
                            connection=gmail_connection,
                        )
                        email.attach_alternative(html_message, "text/html")
                        email.send()
                    else:
                        send_mail(
                            subject=subject,
                            message=message,
                            from_email=gmail_from,
                            recipient_list=recipient_list,
                            fail_silently=False,
                            connection=gmail_connection,
                        )
                    print(f"Email sent via Gmail fallback to: {', '.join(recipient_list)}")
                    return True
                except Exception as gmail_err:
                    print(f"Gmail fallback also failed: {str(gmail_err)}")
            
            # Final fallback: print to console so OTP is still visible
            print(f"[FALLBACK] Email subject: {subject}")
            print(f"[FALLBACK] Recipients: {', '.join(recipient_list)}")
            return False


# Convenience functions
def notify_welcome(user):
    return EmailNotificationService.send_welcome_email(user)

def notify_profile_verified(user):
    return EmailNotificationService.send_profile_verification_email(user)

def notify_new_job(student, job):
    return EmailNotificationService.send_job_notification(student, job)

def notify_event_reminder(user, event, days_before=1):
    return EmailNotificationService.send_event_reminder(user, event, days_before)

def notify_blog_comment(author, blog, comment):
    return EmailNotificationService.send_blog_comment_notification(author, blog, comment)

def notify_connection_request(recipient, sender):
    return EmailNotificationService.send_connection_request(recipient, sender)
