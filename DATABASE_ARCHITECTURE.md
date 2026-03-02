# 📊 Alumni Connect Database Architecture

## 🗄️ Dual Database System

### **1. SQLite Database (db.sqlite3)** - PRIMARY DATABASE
**Location:** `backend/db.sqlite3`  
**Purpose:** Main application database for user authentication and profiles

**Tables:**
- ✅ `users` - User accounts (email, password, role, etc.)
- ✅ `accounts_studentprofile` - Student profiles (roll_number, batch_year, profile_picture, etc.)
- ✅ `accounts_alumniprofile` - Alumni profiles (graduation_year, current_company, etc.)
- ✅ `accounts_emailotp` - Email verification OTP codes
- ✅ `blogs_blog` - Blog posts (stored in SQLite)
- ✅ `events_event` - Events (stored in SQLite)
- ✅ `jobs_job` - Job postings (stored in SQLite)
- ✅ `notifications_notification` - User notifications

**Users Stored Here:**
- 🆕 All NEW registrations (including 22bq1a4225@vvit.net)
- 👤 Users created via seed scripts
- 🔐 All authentication happens against this database

**How to View:**
```bash
# Option 1: Using DB Browser for SQLite (recommended)
Download from: https://sqlitebrowser.org/
Open file: D:\Projects\Alumni-Connect\backend\db.sqlite3

# Option 2: Using command line
cd backend
python check_sqlite_direct.py

# Option 3: SQLite CLI
sqlite3 db.sqlite3
.tables
SELECT * FROM users;
```

---

### **2. MongoDB Atlas** - LEGACY/CONTENT DATABASE
**Connection:** `cluster0.6p5t1xn.mongodb.net/alumni_connect_db`  
**Purpose:** Legacy data from previous implementation

**Collections:**
- 📦 `users` - OLD user accounts (from previous system)
- 📦 `studentprofiles` - OLD student profiles (roll numbers like 24BQ1A0218)
- 📦 `alumniprofiles` - OLD alumni profiles
- 📦 `blogs` - Legacy blog posts
- 📦 `events` - Legacy events
- 📦 `jobs` - Legacy job postings

**Users Stored Here:**
- 👥 Legacy users from previous implementation
- 🔢 Roll numbers: 24BQ1A0218, 24BQ5A6101, 25BQ1A4703, etc.
- ⚠️ NOT USED for new registrations

**How to View:**
- MongoDB Compass: mongodb+srv://cluster0.6p5t1xn.mongodb.net/alumni_connect_db
- Use credentials from .env file

---

## 🔍 Why You Can't Find 22bq1a4225@vvit.net in MongoDB

**Answer:** Because this user was created AFTER the SQLite migration!

**Timeline:**
1. **Old System:** Used MongoDB for everything
2. **Migration:** Moved to Django with SQLite as primary database
3. **Current System:** New users go to SQLite, MongoDB has only legacy data

**User Location:**
```
22bq1a4225@vvit.net → SQLite (db.sqlite3)
24BQ1A0218 → MongoDB (legacy)
```

---

## 📋 Current SQLite Users (as of seed_data.py)

### **Students** (11):
- 22bq1a4215@vvit.net - Divya Reddy
- **22bq1a4225@vvit.net - Manoj Krishna** ← YOUR USER
- rahul.kumar@vvit.net - Rahul Kumar
- sneha.sharma@vvit.net - Sneha Sharma
- amit.patel@vvit.net - Amit Patel
- priya.nair@vvit.net - Priya Nair
- karthik.reddy@vvit.net - Karthik Reddy
- divya.singh@vvit.net - Divya Singh
- arjun.rao@vvit.net - Arjun Rao
- ananya.gupta@vvit.net - Ananya Gupta
- student1@alumni.edu - Student1 Name1

### **Alumni** (6):
- aditya.verma@vvit.net
- meera.iyer@vvit.net
- neha.kapoor@vvit.net
- pooja.menon@vvit.net
- rohit.das@vvit.net
- vikram.joshi@vvit.net

### **Staff** (8):
- admin@vvit.net, admin@alumni.edu
- principal@vvit.net, principal@alumni.edu
- hod.csm@vvit.net, hod@alumni.edu
- counsellor.csm@vvit.net, counsellor@alumni.edu

**Total:** 25 users in SQLite

---

## 🔧 How to Check SQLite Database

### Method 1: Python Script (Easiest)
```bash
cd backend
python check_sqlite_direct.py
```

### Method 2: Django Shell
```bash
cd backend
python manage.py shell

from django.contrib.auth import get_user_model
User = get_user_model()

# Get all users
User.objects.all()

# Find specific user
user = User.objects.get(email='22bq1a4225@vvit.net')
print(user.first_name, user.last_name)
```

### Method 3: DB Browser for SQLite (GUI)
1. Download: https://sqlitebrowser.org/
2. Open: `D:\Projects\Alumni-Connect\backend\db.sqlite3`
3. Browse Data → Select `users` table
4. Filter: `email = 22bq1a4225@vvit.net`

### Method 4: SQLite Command Line
```bash
cd backend
sqlite3 db.sqlite3

.tables                                    # List all tables
.schema users                             # Show users table structure
SELECT * FROM users WHERE email LIKE '%22bq1a4225%';
SELECT * FROM accounts_studentprofile;    # Show all student profiles
.quit
```

---

## 📊 Database Queries

### Get user by email:
```sql
SELECT * FROM users WHERE LOWER(email) = '22bq1a4225@vvit.net';
```

### Get user with student profile:
```sql
SELECT 
    u.email, 
    u.first_name, 
    u.last_name, 
    s.roll_number, 
    s.batch_year,
    s.graduation_year
FROM users u
LEFT JOIN accounts_studentprofile s ON u.id = s.user_id
WHERE LOWER(u.email) = '22bq1a4225@vvit.net';
```

### Get all students:
```sql
SELECT 
    u.email, 
    u.first_name, 
    u.last_name, 
    s.roll_number, 
    s.batch_year
FROM users u
INNER JOIN accounts_studentprofile s ON u.id = s.user_id
WHERE u.role = 'student'
ORDER BY s.roll_number;
```

### Count users by role:
```sql
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

---

## ✅ User Status for 22bq1a4225@vvit.net

Based on the server logs, your user exists and is:
- ✅ Email: 22bq1a4225@vvit.net
- ✅ Name: Manoj Krishna Chandragiri
- ✅ Role: Student
- ✅ Department: CSM
- ✅ Roll Number: 22BQ1A4225
- ✅ Batch Year: 2022
- ✅ Graduation Year: 2026
- ✅ Active: Yes
- ✅ Verified: Yes (because registration error says "already exists, please login")

**You can LOGIN with this account!**

Credentials:
- Email: `22bq1a4225@vvit.net` (case-insensitive)
- Password: Whatever you set during registration

---

## 🎯 Summary

| Feature | SQLite | MongoDB |
|---------|--------|---------|
| User Authentication | ✅ Yes | ❌ No |
| New Registrations | ✅ Yes | ❌ No |
| Student Profiles | ✅ Yes (new) | 📦 Yes (legacy) |
| Roll Numbers | 22BQ*, 23BQ* | 24BQ*, 25BQ* |
| Your Data | ✅ HERE | ❌ Not here |

**To find your data:** Look in SQLite, not MongoDB!
