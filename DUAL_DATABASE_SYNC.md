# 🔄 Dual Database Synchronization - Implementation Guide

## ✅ IMPLEMENTED: New Users Now Store in BOTH Databases!

As of this update, all new user registrations automatically sync to **BOTH SQLite AND MongoDB**.

---

## 🎯 What Changed

### **Before (Old System):**
- ❌ New users → SQLite only
- ❌ MongoDB had only legacy data
- ❌ Databases out of sync

### **After (New System):**
- ✅ New users → SQLite **AND** MongoDB
- ✅ Student/Alumni profiles sync to both databases
- ✅ Email verification status syncs to both
- ✅ Automatic cleanup in both databases

---

## 🔧 Implementation Details

### **1. User Registration Flow**

When a user registers (`POST /api/auth/register/`):

```python
# Step 1: Create in SQLite (primary database)
user = User(**validated_data)
user.set_password(password)
user.save()  # ← Saves to SQLite

# Step 2: Sync to MongoDB
from common.models import User as MongoUser

mongo_user = MongoUser(
    email=user.email,
    first_name=user.first_name,
    last_name=user.last_name,
    role=user.role,
    department=user.department,
    is_active=user.is_active,
    is_verified=user.is_verified
)
mongo_user.set_password(password)
mongo_user.save()  # ← Saves to MongoDB
```

**Console Output:**
```
✅ MongoDB sync: User created - testuser@vvit.net
```

---

### **2. Student Profile Sync**

When a student profile is created:

```python
# SQLite StudentProfile
student_profile = StudentProfile.objects.create(
    user=user,
    roll_number='22BQ1A4225',
    batch_year=2022,
    graduation_year=2026
)

# MongoDB StudentProfile
mongo_student_profile = MongoStudentProfile(
    user=mongo_user,
    roll_no='22BQ1A4225',
    department='CSM',
    joined_year=2022,
    completion_year=2026,
    current_year=1,
    current_semester=1
)
mongo_student_profile.save()
```

**Console Output:**
```
✅ MongoDB sync: StudentProfile created - 22BQ1A4225
```

---

### **3. Alumni Profile Sync**

When an alumni profile is created:

```python
# SQLite AlumniProfile
alumni_profile = AlumniProfile.objects.create(
    user=user,
    graduation_year=2023,
    roll_number='19BQ1A4201'
)

# MongoDB AlumniProfile
mongo_alumni_profile = MongoAlumniProfile(
    user=mongo_user,
    roll_no='19BQ1A4201',
    department='CSE',
    graduation_year=2023
)
mongo_alumni_profile.save()
```

**Console Output:**
```
✅ MongoDB sync: AlumniProfile created - alumnus@vvit.net
```

---

### **4. Email Verification Sync**

When a user verifies their email (`POST /api/auth/verify-otp/`):

```python
# Update SQLite
user.is_active = True
user.is_verified = True
user.save()

# Sync to MongoDB
mongo_user = MongoUser.objects(email=user.email).first()
if mongo_user:
    mongo_user.is_active = True
    mongo_user.is_verified = True
    mongo_user.save()
```

**Console Output:**
```
✅ MongoDB sync: User verified - testuser@vvit.net
```

---

### **5. Cleanup on Re-registration**

When a user tries to re-register with an unverified account:

```python
# Delete from SQLite
EmailOTP.objects.filter(user=existing_user).delete()
StudentProfile.objects.filter(user=existing_user).delete()
existing_user.delete()

# Delete from MongoDB too
mongo_user = MongoUser.objects(email=email).first()
if mongo_user:
    MongoStudentProfile.objects(user=mongo_user).delete()
    mongo_user.delete()
```

**Console Output:**
```
✅ MongoDB sync: Deleted unverified user - testuser@vvit.net
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    User Registration                    │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
         ┌─────────────────┐
         │  Validate Data  │
         └────────┬────────┘
                  │
                  ▼
    ┌─────────────────────────┐
    │  Create SQLite User     │ ← Primary Database
    │  (Source of Truth)      │
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │  Sync to MongoDB User   │ ← Mirror/Backup
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │  Create Profile         │
    │  (SQLite)               │
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │  Sync Profile           │
    │  (MongoDB)              │
    └────────┬────────────────┘
             │
             ▼
    ┌─────────────────────────┐
    │  Send OTP Email         │
    └─────────────────────────┘
```

---

## 🔍 How to Verify Sync is Working

### **Method 1: Check Console Logs (Easiest)**

When you register a new user, watch the Django console:

```bash
Registration request data: {'first_name': 'Test', 'last_name': 'User', ...}
✅ MongoDB sync: User created - test.user@vvit.net
✅ MongoDB sync: StudentProfile created - 23BQ1A4201

============================================================
📧 OTP Email for: test.user@vvit.net
🔑 OTP Code: 123456
⏰ Expires in: 5 minutes
============================================================
```

### **Method 2: Check MongoDB Compass**

1. Open MongoDB Compass
2. Connect to: `mongodb+srv://cluster0.6p5t1xn.mongodb.net/alumni_connect_db`
3. Browse Collections:
   - `users` → Check for your new user
   - `student_profiles` → Check for your profile
4. Search: `{ "email": "test.user@vvit.net" }`

### **Method 3: Check SQLite Database**

```bash
cd backend
python check_sqlite_direct.py
```

Or use DB Browser for SQLite:
1. Open `backend/db.sqlite3`
2. Browse Data → `users` table
3. Search for your email

### **Method 4: Query Both Databases**

```python
# Check SQLite
from django.contrib.auth import get_user_model
User = get_user_model()
user = User.objects.get(email='test.user@vvit.net')
print(f"SQLite: {user.email}, Active: {user.is_active}")

# Check MongoDB
from common.models import User as MongoUser
mongo_user = MongoUser.objects(email='test.user@vvit.net').first()
print(f"MongoDB: {mongo_user.email}, Active: {mongo_user.is_active}")
```

---

## 🎯 Database Roles

| Database | Purpose | Priority |
|----------|---------|----------|
| **SQLite** | Source of Truth | ✅ PRIMARY |
| **MongoDB** | Mirror/Backup + Legacy Data | 📦 SECONDARY |

**Important Notes:**
- SQLite is always the **source of truth** for authentication
- If MongoDB sync fails, registration still succeeds (SQLite only)
- Login always checks SQLite first
- MongoDB contains both NEW synced data + OLD legacy data

---

## 🚨 Error Handling

### **If MongoDB Sync Fails:**

The system is designed to be resilient:

```python
try:
    mongo_user.save()
    print("✅ MongoDB sync: User created")
except Exception as e:
    print(f"⚠️  MongoDB sync failed: {str(e)}")
    # Continue anyway - SQLite is the source of truth
```

**What happens:**
1. User is still created in SQLite ✅
2. Warning logged to console ⚠️
3. User can login and use the app normally ✅
4. MongoDB sync can be retried later if needed

**Console Output:**
```
⚠️  MongoDB sync failed for test@vvit.net: Connection timeout
[17/Feb/2026 12:30:15] "POST /api/auth/register/ HTTP/1.1" 201 235
```

---

## 📝 Testing the Sync

### **Test Case 1: New Student Registration**

**Steps:**
1. Register with:
   - Email: `23bq1a4201@vvit.net`
   - Name: Test Student
   - Roll: 23BQ1A4201
   - Password: Test@123

**Expected Results:**
- ✅ SQLite user created
- ✅ MongoDB user created
- ✅ SQLite StudentProfile created (roll_number: 23BQ1A4201)
- ✅ MongoDB StudentProfile created (roll_no: 23BQ1A4201)
- ✅ OTP sent
- ✅ Console shows all sync messages

**Verify:**
```bash
# Check SQLite
python check_sqlite_direct.py

# Check MongoDB Compass
Collection: users → Find email: 23bq1a4201@vvit.net
Collection: student_profiles → Find roll_no: 23BQ1A4201
```

---

### **Test Case 2: Email Verification**

**Steps:**
1. Register user (as above)
2. Get OTP from console
3. Verify with OTP

**Expected Results:**
- ✅ SQLite user: is_active=True, is_verified=True
- ✅ MongoDB user: is_active=True, is_verified=True
- ✅ Console: "✅ MongoDB sync: User verified"

**Verify:**
```python
# SQLite
user = User.objects.get(email='23bq1a4201@vvit.net')
print(user.is_verified)  # True

# MongoDB
mongo_user = MongoUser.objects(email='23bq1a4201@vvit.net').first()
print(mongo_user.is_verified)  # True
```

---

### **Test Case 3: Re-registration Cleanup**

**Steps:**
1. Register user: `test@vvit.net`
2. Don't verify (leave inactive)
3. Try to register same email again

**Expected Results:**
- ✅ Old SQLite user deleted
- ✅ Old MongoDB user deleted
- ✅ New SQLite user created
- ✅ New MongoDB user created
- ✅ Console: "✅ MongoDB sync: Deleted unverified user"

---

## 🔧 Manual Sync for Existing Users

If you have existing users in SQLite that aren't in MongoDB:

```python
# Run this script: backend/sync_to_mongodb.py

from django.contrib.auth import get_user_model
from common.models import User as MongoUser, StudentProfile as MongoStudentProfile
from apps.accounts.models import StudentProfile

User = get_user_model()

# Get all SQLite users
sqlite_users = User.objects.all()

for user in sqlite_users:
    # Check if already in MongoDB
    mongo_user = MongoUser.objects(email=user.email).first()
    
    if not mongo_user:
        # Create MongoDB user
        mongo_user = MongoUser(
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            role=user.role,
            department=user.department or '',
            is_active=user.is_active,
            is_verified=user.is_verified
        )
        mongo_user.save()
        print(f"✅ Synced user: {user.email}")
        
        # Sync student profile if exists
        if user.role == 'student' and hasattr(user, 'student_profile'):
            profile = user.student_profile
            mongo_profile = MongoStudentProfile(
                user=mongo_user,
                roll_no=profile.roll_number,
                department=user.department or '',
                joined_year=profile.batch_year,
                completion_year=profile.graduation_year
            )
            mongo_profile.save()
            print(f"✅ Synced profile: {profile.roll_number}")
```

---

## 📚 Summary

✅ **New users automatically sync to MongoDB**  
✅ **Profiles sync to MongoDB**  
✅ **Verification status syncs**  
✅ **Cleanup operations sync**  
✅ **Error-resilient (SQLite is always primary)**  
✅ **Console logging for all sync operations**  

**Your users are now in BOTH databases!** 🎉

Check MongoDB Compass to see your newly registered users appear alongside the legacy data.
