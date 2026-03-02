# 🔐 VVITU Alumni Portal - Test Login Credentials

**All accounts are now VERIFIED and ACTIVE ✅**

---

## 👨‍💼 ADMINS

| Email | Password | Status |
|-------|----------|--------|
| admin@vvit.net | `Admin@123` | ✅ Active & Verified |
| admin@alumni.edu | `Admin@123` | ✅ Active & Verified |

---

## 🏛️ PRINCIPALS

| Email | Password | Status |
|-------|----------|--------|
| principal@vvit.net | `Principal@123` | ✅ Active & Verified |
| principal@alumni.edu | `Principal@123` | ✅ Active & Verified |

---

## 👔 HEADS OF DEPARTMENT (HODs)

| Email | Password | Status |
|-------|----------|--------|
| hod.csm@vvit.net | `HOD@123` | ✅ Active & Verified |
| hod@alumni.edu | `HOD@123` | ✅ Active & Verified |

---

## 👨‍🏫 COUNSELLORS

| Email | Password | Status |
|-------|----------|--------|
| counsellor.csm@vvit.net | `Counsellor@123` | ✅ Active & Verified |
| counsellor@alumni.edu | `Counsellor@123` | ✅ Active & Verified |

---

## 🎓 STUDENTS (11 accounts)

| Email | Password | Name | Roll Number | Status |
|-------|----------|------|-------------|--------|
| 22bq1a4215@vvit.net | `Student@123` | Divya Reddy | 22BQ1A4215 | ✅ Active & Verified |
| 22bq1a4225@vvit.net | `Student@123` | Manoj Krishna | 22BQ1A4225 | ✅ Active & Verified |
| 23bq5a4214@vvit.net | `Student@123` | Akram Naeemuddin | 23BQ5A4214 | ✅ Active & Verified |
| ananya.gupta@vvit.net | `Student@123` | Ananya Gupta | - | ✅ Active & Verified |
| arjun.rao@vvit.net | `Student@123` | Arjun Rao | - | ✅ Active & Verified |
| divya.singh@vvit.net | `Student@123` | Divya Singh | - | ✅ Active & Verified |
| karthik.reddy@vvit.net | `Student@123` | Karthik Reddy | - | ✅ Active & Verified |
| priya.nair@vvit.net | `Student@123` | Priya Nair | - | ✅ Active & Verified |
| amit.patel@vvit.net | `Student@123` | Amit Patel | - | ✅ Active & Verified |
| sneha.sharma@vvit.net | `Student@123` | Sneha Sharma | - | ✅ Active & Verified |
| rahul.kumar@vvit.net | `Student@123` | Rahul Kumar | - | ✅ Active & Verified |
| student1@alumni.edu | `Student@123` | Student1 Name1 | - | ✅ Active & Verified |

---

## 🎖️ ALUMNI (7 accounts)

| Email | Password | Name | Status |
|-------|----------|------|--------|
| aditya.verma@vvit.net | `Alumni@123` | Aditya Verma | ✅ Active & Verified |
| meera.iyer@vvit.net | `Alumni@123` | Meera Iyer | ✅ Active & Verified |
| neha.kapoor@vvit.net | `Alumni@123` | Neha Kapoor | ✅ Active & Verified |
| pooja.menon@vvit.net | `Alumni@123` | Pooja Menon | ✅ Active & Verified |
| rohit.das@vvit.net | `Alumni@123` | Rohit Das | ✅ Active & Verified |
| vikram.joshi@vvit.net | `Alumni@123` | Vikram Joshi | ✅ Active & Verified |

**Note:** `aditya.verma@vvit.net` appears twice in the original list - this is the same account.

---

## 📊 Summary

- **Total Users:** 26 ✅
- **All Verified:** Yes ✅
- **All Active:** Yes ✅
- **Synced to MongoDB:** Yes (where applicable) ✅

---

## 🔧 What Was Fixed

**Problem:**
```
"Your account is not verified. Please check your email for the verification code."
```

**Cause:**
Seeded test accounts had `is_verified=False` in the database.

**Solution:**
Ran `verify_all_seeded_users.py` to set all accounts to:
- `is_verified=True`
- `is_active=True`

In **BOTH** SQLite and MongoDB databases.

---

## 🚀 Login Now Works!

You can now login with any of the above credentials at:
**http://127.0.0.1:8100/** (Frontend)

**Backend API:** http://127.0.0.1:8000/

---

## 🧪 Test Commands

**Verify a specific user:**
```bash
cd backend
python test_dual_sync.py 22bq1a4215@vvit.net
```

**List all users:**
```bash
python test_dual_sync.py
```

**Re-verify all users (if needed):**
```bash
python verify_all_seeded_users.py
```

---

## 📝 Login Response Example

**Request:**
```json
POST /api/auth/login/
{
  "email": "22bq1a4215@vvit.net",
  "password": "Student@123"
}
```

**Response:**
```json
{
  "tokens": {
    "access": "eyJhbGc...",
    "refresh": "eyJhbGc..."
  },
  "user": {
    "id": 3,
    "email": "22bq1a4215@vvit.net",
    "firstName": "Divya",
    "lastName": "Reddy",
    "fullName": "Divya Reddy",
    "role": "student",
    "department": "CSM",
    "isVerified": true,
    "avatar": "https://ui-avatars.com/api/?name=Divya+Reddy..."
  },
  "profile": {
    "rollNumber": "22BQ1A4215",
    "batchYear": 2022,
    "graduationYear": 2026
  }
}
```

---

**Status: ALL ACCOUNTS READY FOR LOGIN! ✅🎉**
