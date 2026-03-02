# Email OTP Authentication - Setup Guide

## 📧 Email Configuration for Production

To enable email OTP verification, configure your email provider. The system sends OTP emails **FROM** your configured email and works with users having **ANY email domain** (@vvit.net, @gmail.com, @outlook.com, etc.).

**Important**: 
- **Students** can register with `@vvit.net` emails and receive OTPs there
- **Alumni** can register with `@gmail.com` or any personal email (since college emails expire)
- The OTP sender (FROM address) can be configured to any email you have access to

---

## 🏫 VVIT College Email (@vvit.net) - **RECOMMENDED**

### For Institutional Office 365 Accounts

**Best for**: Sending OTPs from official college email like `alumni-noreply@vvit.net` or `22bq1a4225@vvit.net`

No 2-step authentication needed for institutional accounts!

### Configuration Steps:

1. **Get your VVIT email credentials** (username and password)
2. **Update `.env` file**:

```env
# VVIT College Email Configuration (Office 365)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=22bq1a4225@vvit.net
EMAIL_HOST_PASSWORD=YourCollegeEmailPassword
DEFAULT_FROM_EMAIL=VVITU Alumni Network <22bq1a4225@vvit.net>
```

**Alternative SMTP Settings** (if above doesn't work):
```env
EMAIL_HOST=outlook.office365.com
# OR
EMAIL_HOST=smtp-mail.outlook.com
```

### Important Notes:
- ✅ **No app password needed** for institutional accounts
- ✅ Use your **regular email password**
- ✅ Works with all Office 365 educational accounts
- ✅ Sends to ANY email domain (@vvit.net, @gmail.com, @yahoo.com, etc.)
- ⚠️ If login fails, contact IT department to ensure SMTP is enabled for your account
- ⚠️ Some institutions may require MFA/2FA - check with your IT admin

### Testing VVIT Email:

```bash
cd backend
python manage.py shell
```

```python
from django.core.mail import send_mail

send_mail(
    'Test from VVIT Email',
    'This is a test OTP email',
    '22bq1a4225@vvit.net',
    ['recipient@gmail.com'],  # Can be any email
    fail_silently=False,
)
```

---

## 🔐 Personal Gmail Configuration (For Alumni/Personal Use)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already enabled

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select **Mail** and **Other (Custom name)**
3. Enter app name: `Alumni Connect`
4. Click **Generate**
5. Google will provide a 16-character password (e.g., `abcd efgh ijkl mnop`)
6. **Copy this password** - you won't see it again

### Step 3: Update Environment Variables

Add these to your `.env` file in the `backend` directory:

```env
# Email Configuration for Gmail
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=abcd efgh ijkl mnop  # Use the app password from Step 2
DEFAULT_FROM_EMAIL=Alumni Connect <your-email@gmail.com>
```

**Important:**
- Replace `your-email@gmail.com` with your actual Gmail address
- Use the **app password**, NOT your regular Gmail password
- Remove spaces from the app password (or keep them, Django handles both)

---

## 📨 Personal Outlook/Hotmail Configuration

**Use this if**: You want to use personal @outlook.com or @hotmail.com account

### Step 1: Sign in to Microsoft Account
1. Go to [Microsoft Account Security](https://account.microsoft.com/security)
2. Enable **Two-step verification** if not enabled

### Step 2: Generate App Password
1. Go to **Security** → **Advanced security options**
2. Under **App passwords**, click **Create a new app password**
3. Copy the generated password

### Step 3: Update Environment Variables

```env
# Personal Outlook Email Configuration
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@outlook.com
EMAIL_HOST_PASSWORD=your-app-password-here
DEFAULT_FROM_EMAIL=Alumni Connect <your-email@outlook.com>
```

---

## 🧪 Testing Email Configuration

### Option 1: Console Backend (Development)

For local testing without sending real emails, use:

```env
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```

This will print emails to the console instead of sending them.

### Option 2: SMTP Testing

After configuring your email provider, test it with:

```bash
cd backend
python manage.py shell
```

```python
from django.core.mail import send_mail

send_mail(
    'Test Email',
    'This is a test email from Alumni Connect',
    'your-email@gmail.com',
    ['recipient@example.com'],
    fail_silently=False,
)
```

If successful, you'll see "1" printed. If there's an error, check:
- App password is correct
- 2FA is enabled
- Email settings in `.env` are correct
- Firewall isn't blocking port 587

---

## 🔧 Environment Variables Reference

Create/update `backend/.env`:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database
MONGODB_URI=your-mongodb-connection-string
True
ALLOWED_HOSTS=localhost,127.0.0.1,your-domain.com

# Database
MONGODB_URI=your-mongodb-connection-string

# Email Configuration (Choose one based on your needs)

# ========================================
# RECOMMENDED: VVIT College Email (@vvit.net)
# ========================================
# Use this to send from official college email
# Works with students (@vvit.net) and alumni (@gmail.com) email recipients
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=22bq1a4225@vvit.net
EMAIL_HOST_PASSWORD=YourCollegeEmailPassword
DEFAULT_FROM_EMAIL=VVITU Alumni Network <22bq1a4225@vvit.net>

# ========================================
# Option 2: Personal Gmail (Requires App Password)
# ========================================
# EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USE_TLS=True
# EMAIL_HOST_USER=your-email@gmail.com
# EMAIL_HOST_PASSWORD=your-16-char-app-password
# DEFAULT_FROM_EMAIL=VVITU Alumni Network <your-email@gmail.com>

# ==Email Flow:

```
┌─────────────────────────────────────────────────────────────┐
│  Student Registration (@vvit.net email)                     │
│  ─────────────────────────────────────────────────────      │
│  1. Student enters: 22bq1a4225@vvit.net                     │
│  2. System sends OTP FROM: alumni-system@vvit.net           │
│  3. Student receives OTP TO: 22bq1a4225@vvit.net            │
│  4. Student checks Outlook → Enters OTP → Verified ✓        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Alumni Registration (@gmail.com email)                     │
│  ─────────────────────────────────────────────────────────  │
│  1. Alumni enters: john.doe@gmail.com                       │
│  2. System sends OTP FROM: alumni-system@vvit.net           │
│  3. Alumni receives OTP TO: john.doe@gmail.com              │
│  4. Alumni checks Gmail → Enters OTP → Verified ✓           │
└─────────────────────────────────────────────────────────────┘
```

**The System:**
- ✅ Sends FROM: Your configured email (e.g., `22bq1a4225@vvit.net`)
- ✅ Sends TO: Any email domain (Gmail, Outlook, Yahoo, etc.)
- ✅ Works with students using `@vvit.net`
- ✅ Works with alumni using personal emails after graduation

### Backend Changes Made:

1. **OTP Model** (`backend/apps/accounts/otp_models.py`)
   - Stores 6-digit OTP codes
   - Auto-expires after 5 minutes
   - Tracks verification status
   - Works with any email domain

2. **API Endpoints**:
   - `POST /api/auth/register/` - Creates user and sends OTP (to ANY email)
   - `POST /api/auth/verify-otp/` - Verifies OTP and activates account
   - `POST /api/auth/resend-otp/` - Resends new OTP

3. **Email Service** (`backend/common/email_service.py`)
   - Added `send_otp_email()` method
   - Sends to recipient's email (any domain)
   - Uses HTML template for OTP emails

4. **Email Template** (`backend/templates/emails/otp_verification.html`)
   - Professional OTP email design
   - Shows OTP code prominently
   - Includes expiry warning

### Frontend Changes Made:

1. **Register Component** (`frontend/src/pages/auth/Register.jsx`)
   - Added OTP verification step after registration
   - 6-digit OTP input boxes
   - Resend OTP with 60-second cooldown
   - Auto-focus between input boxes
   - Works regardless of user's email domain
   - `POST /api/auth/register/` - Creates user and sends OTP
   - `POST /api/auth/verify-otp/` - Verifies OTP and activates account
   - `POST /api/auth/resend-otp/` - Resends new OTP

3. **Email Service** (`backend/common/email_service.py`)
   - Added `send_otp_email()` method
   - Uses HTML template for OTP emails

4. **Email Template** (`backend/templates/emails/otp_verification.html`)
   - Professional OTP email design
   - Shows OTP code prominently
   - Includes expiry warning

### Frontend Changes Made:

1. **Register Component** (`frontend/src/pages/auth/Register.jsx`)
   - Added OTP verification step after registration
   - 6-digit OTP input boxes
   - Resend OTP with 60-second cooldown
   - Auto-focus between input boxes

2. **Auth API** (`frontend/src/api/auth.api.js`)
   - Added `verifyOtp()` method
   - Added `resendOtp()` method

---

   - Remove quotes around values

2. **VVIT Email (@vvit.net) issues**:
   - ✅ Use `smtp.office365.com` as EMAIL_HOST
   - ✅ Use your **regular password**, NOT app password
   - ✅ Ensure your account has SMTP access enabled
   - ⚠️ If getting "authentication failed", contact IT department
   - ⚠️ Some institutions block SMTP for students - request access
   - Try alternative hosts: `outlook.office365.com` or `smtp-mail.outlook.com`

3. **Gmail issues** (for personal email):
   - Verify 2FA is enabled
   - Use app password, not regular password
   - Check [Less secure app access](https://myaccount.google.com/lesssecureapps) is allowed

4. **Personal Outlook issues**:
   - Ensure using `smtp-mail.outlook.com` or `smtp.office365.com`
   - Verify app password is correct (not regular password)

5. **Firewall blocking**:
   - Ensure port 587 is not blocked
   - Try using port 465 with `EMAIL_USE_SSL=True` instead of TLS

6. **Recipients not receiving**:
   - ✅ System sends to ANY email domain (@vvit.net, @gmail.com, etc.)
   - Check recipient's spam/junk folder
   - Verify recipient email address is correct
   - Test with different recipient domains
## 🔒 Security Features

- ✅ OTP expires in 5 minutes
### For VVIT College (Best Option):

```env
# Production Email Settings - VVIT Official Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=alumni-noreply@vvit.net  # Or your college email
EMAIL_HOST_PASSWORD=YourCollegePassword
DEFAULT_FROM_EMAIL=VVITU Alumni Network <alumni-noreply@vvit.net>
FRONTEND_URL=https://alumni.vvit.net
```

**Why VVIT Email is Best**:
- ✅ Official domain - more trustworthy for recipients
- ✅ No app password hassle (for institutional accounts)
- ✅ Higher sending limits than personal email
- ✅ Professional appearance
- ✅ Works with both student (@vvit.net) and alumni (@gmail.com) recipients

**Best Practices**:
- Use a dedicated email account (e.g., `alumni-noreply@vvit.net`)
- Never commit `.env` file to version control (add to `.gitignore`)
- Use environment-specific `.env` files (`.env.dev`, `.env.prod`)
- Monitor email sending limits:
  - Office 365: 10,000/day (institutional)
  - Gmail: 500/day (personal)
  - Outlook: 300/day (personal)
- For high-volume production (1000+ OTPs/day), consider:
  - SendGrid (free tier: 100/day)
  - Mailgun (free tier: 5,000/month)
  - Amazon SES (pay-as-you-go)
  - Postmark
   - Use app password, not regular password
   - Check [Less secure app access](https://myaccount.google.com/lesssecureapps) is allowed

3. **Outlook issues**:
   - Ensure using `smtp-mail.outlook.com` or `smtp.office365.com`
   - Verify app password is correct

4. **Firewall blocking**:
   - Ensure port 587 is not blocked
   - Try using port 465 with `EMAIL_USE_SSL=True`

### OTP not received?

1. Check spam/junk folder
2. Verify email address is correct
3. Check backend console for error messages
4. Test with console backend first

### Frontend errors?

1. Ensure backend is running
2. Check browser console for API errors
3. Verify CORS settings allow frontend origin

---

## 📝 Recommended Settings for Production

```env
# Production Email Settings
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=noreply@yourdomain.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=VVITU Alumni Network <noreply@yourdomain.com>
FRONTEND_URL=https://yourdomain.com
```

**Best Practices**:
- Use a dedicated email account (e.g., `noreply@yourdomain.com`)
- Never commit `.env` file to version control
- Use environment-specific `.env` files (`.env.dev`, `.env.prod`)
- Monitor email sending limits (Gmail: 500/day, Outlook: 300/day)
- Consider using SendGrid/Mailgun for production at scale

---

## 🎯 Next Steps

1. **Set up email provider** (Gmail/Outlook)
2. **Generate app password**
3. **Update `.env` file** with credentials
4. **Test OTP flow** in development
5. **Monitor emails** for spam folder issues
6. **Consider upgrading** to professional email service for production

---

## 📞 Support

If you encounter issues:
1. Check backend logs: `python manage.py runserver`
2. Check browser console for frontend errors
3. Test email configuration with Django shell
4. Verify all environment variables are set correctly

---

**Created:** February 2026  
**Last Updated:** February 2026  
**Version:** 1.0
