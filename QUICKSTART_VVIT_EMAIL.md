# 🚀 Quick Start - VVIT Email OTP Configuration

## Using Your VVIT College Email (@vvit.net)

Your VVIT email (`22bq1a4225@vvit.net`) can send OTP emails to **ANY email address**:
- ✅ Students with `@vvit.net` emails
- ✅ Alumni with `@gmail.com`, `@outlook.com`, etc.
- ✅ No 2-step authentication needed!

---

## ⚡ 3-Step Setup

### Step 1: Copy `.env.example` to `.env`

```bash
cd backend
cp .env.example .env
```

### Step 2: Edit `.env` file

Open `backend/.env` and update these lines:

```env
# Replace with YOUR college email and password
EMAIL_HOST_USER=22bq1a4225@vvit.net
EMAIL_HOST_PASSWORD=YourActualPassword
```

**Important:**
- Use your **college email** (e.g., `22bq1a4225@vvit.net`)
- Use your **regular password** (the one you use to login to Outlook)
- No app password needed!

### Step 3: Test It!

```bash
# Start backend
cd backend
python manage.py runserver

# In another terminal, start frontend
cd frontend
npm run dev
```

Then visit: `http://localhost:5173/register`

---

## 📧 How It Works

### Registration Flow:

1. **Student registers** with email: `22bq1a4201@vvit.net`
   - System sends OTP FROM: `22bq1a4225@vvit.net` (your email)
   - Student receives OTP TO: `22bq1a4201@vvit.net`
   - Student checks **Outlook** → Gets OTP → Verifies ✓

2. **Alumni registers** with email: `john.alumni@gmail.com`
   - System sends OTP FROM: `22bq1a4225@vvit.net` (your email)
   - Alumni receives OTP TO: `john.alumni@gmail.com`
   - Alumni checks **Gmail** → Gets OTP → Verifies ✓

**The system automatically detects:**
- Email domain doesn't matter for recipients
- Students typically use `@vvit.net`
- Alumni use personal emails since college email expires

---

## 🧪 Test Email Sending

Before running the app, test if email works:

```bash
cd backend
python manage.py shell
```

```python
from django.core.mail import send_mail

# Test sending to a VVIT email
send_mail(
    'Test OTP',
    'Your OTP is: 123456',
    '22bq1a4225@vvit.net',  # FROM: your email
    ['22bq1a4201@vvit.net'],  # TO: test recipient
    fail_silently=False,
)
# Should print: 1

# Test sending to Gmail
send_mail(
    'Test OTP',
    'Your OTP is: 123456',
    '22bq1a4225@vvit.net',  # FROM: your email
    ['someone@gmail.com'],  # TO: Gmail recipient
    fail_silently=False,
)
# Should print: 1
```

If you see `1`, it worked! Check the recipient's inbox (or spam).

---

## 🐛 Troubleshooting

### "Authentication Failed" Error?

Try these SMTP servers in your `.env`:

```env
# Option 1 (Default)
EMAIL_HOST=smtp.office365.com

# Option 2
EMAIL_HOST=outlook.office365.com

# Option 3
EMAIL_HOST=smtp-mail.outlook.com
```

### Still not working?

1. **Verify your credentials**:
   - Can you login to [Outlook Web](https://outlook.office365.com) with the same email/password?
   - If yes, SMTP should work too

2. **Contact IT Department**:
   - Some institutions disable SMTP for student accounts
   - Ask them to enable SMTP access for your account

3. **Use Console Backend (Testing)**:
   - Edit `backend/.env`:
     ```env
     EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
     ```
   - OTP will be printed in terminal instead of emailed
   - Perfect for testing the flow without email

### Email not received?

1. **Check spam folder** (especially for Gmail recipients)
2. **Wait 1-2 minutes** (Office 365 can be slow sometimes)
3. **Verify recipient email** is correct in registration form

---

## ✅ Ready to Go!

Your configuration is now:

```
┌─────────────────────────────────────────────┐
│ SEND FROM: 22bq1a4225@vvit.net             │
│ SEND TO: ANY email domain                   │
│ ├── Students (@vvit.net)                    │
│ └── Alumni (@gmail.com, @outlook.com, etc.) │
└─────────────────────────────────────────────┘
```

Start the server and test registration! 🎉

---

## 📚 Full Documentation

For detailed configuration and troubleshooting, see:
- [EMAIL_OTP_SETUP_GUIDE.md](EMAIL_OTP_SETUP_GUIDE.md)
