# VVITU Alumni Connect - Login Credentials

## All User Accounts

### ADMINS
| Email | Password | Role |
|-------|----------|------|
| admin@vvit.net | Admin@123 | Admin |
| admin@alumni.edu | Admin@123 | Admin |

### PRINCIPALS
| Email | Password | Role |
|-------|----------|------|
| principal@vvit.net | Principal@123 | Principal |
| principal@alumni.edu | Principal@123 | Principal |

### HODs (Head of Departments)
| Email | Password | Role | Department |
|-------|----------|------|------------|
| hod.csm@vvit.net | HOD@123 | HOD | CSM |
| hod@alumni.edu | HOD@123 | HOD | - |

### COUNSELLORS
| Email | Password | Role | Department |
|-------|----------|------|------------|
| counsellor.csm@vvit.net | Counsellor@123 | Counsellor | CSM |
| counsellor@alumni.edu | Counsellor@123 | Counsellor | - |

### STUDENTS (Password: Student@123)
| Email | Roll Number | Name | Department | Year |
|-------|-------------|------|------------|------|
| 22bq1a4215@vvit.net | 22BQ1A4215 | Divya Reddy | CSM | 4 |
| 22bq1a4225@vvit.net | 22BQ1A4225 | Manoj Krishna | CSM | 4 |
| rahul.kumar@vvit.net | 22BQ1A4201 | Rahul Kumar | - | - |
| sneha.sharma@vvit.net | 22BQ1A4212 | Sneha Sharma | - | - |
| amit.patel@vvit.net | 22BQ1A4228 | Amit Patel | - | - |
| priya.nair@vvit.net | 23BQ1A0401 | Priya Nair | - | - |
| karthik.reddy@vvit.net | 23BQ1A0415 | Karthik Reddy | - | - |
| divya.singh@vvit.net | 24BQ1A0201 | Divya Singh | - | - |
| arjun.rao@vvit.net | 24BQ1A0218 | Arjun Rao | - | - |
| ananya.gupta@vvit.net | 24BQ5A6101 | Ananya Gupta | - | - |
| student1@alumni.edu | - | - | - | - |

### ALUMNI (Password: Alumni@123)
| Email | Name |
|-------|------|
| aditya.verma@vvit.net | Aditya Verma |
| meera.iyer@vvit.net | Meera Iyer |
| neha.kapoor@vvit.net | Neha Kapoor |
| pooja.menon@vvit.net | Pooja Menon |
| rohit.das@vvit.net | Rohit Das |
| vikram.joshi@vvit.net | Vikram Joshi |

---

## Quick Test Credentials

**For Testing Student Features:**
- Email: `22bq1a4215@vvit.net`
- Password: `Student@123`

**For Testing Alumni Features:**
- Email: `aditya.verma@vvit.net`
- Password: `Alumni@123`

**For Testing Admin Features:**
- Email: `admin@vvit.net`
- Password: `Admin@123`

---

## What Was Fixed

### 1. Login Authentication Issue
- ✅ Fixed SimpleJWT authentication to work with email field
- ✅ Email now case-insensitive (22BQ1A4215 same as 22bq1a4215)
- ✅ Created test users with correct credentials

### 2. Navbar Display Issue
- ✅ Fixed login response to use camelCase (firstName, lastName, fullName, avatar)
- ✅ Navbar now shows user name immediately after login (no need to update profile first)
- ✅ Avatar/profile picture displays correctly

---

## Testing Instructions

1. **Logout** from current session
2. **Login** with test student: `22bq1a4215@vvit.net` / `Student@123`
3. **Verify** navbar shows "Divya Reddy" and roll number immediately
4. **Navigate** to profile to see full details

The navbar should now display user information immediately after login without needing to update the profile first.
