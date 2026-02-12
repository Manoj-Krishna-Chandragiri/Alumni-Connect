# Alumni Connect - Database Schema Documentation

**Project**: Alumni Connect Platform  
**Database**: MongoDB (NoSQL)  
**Document Version**: 1.0  
**Last Updated**: February 10, 2026

---

## Table of Contents
1. [Overview](#overview)
2. [Collections](#collections)
3. [Relationships](#relationships)
4. [Data Types](#data-types)
5. [Passout Year Logic](#passout-year-logic)
6. [Schema Flexibility](#schema-flexibility)

---

## Overview

This document describes the database schema for the Alumni Connect platform. The system uses **MongoDB**, a NoSQL database, which provides flexibility in schema design.

### Key Features:
- **Flexible Schema**: Fields can be added or modified without strict constraints
- **Document-Based**: Data stored as JSON-like documents (BSON)
- **References**: Collections reference each other using ObjectIds
- **Auto-Calculation**: Graduation years calculated automatically from roll numbers

---

## Collections

### 1. users
Stores all user authentication and basic profile data.

| Field         | Type      | Required | Description                                      |
|---------------|-----------|----------|--------------------------------------------------|
| _id           | ObjectId  | Yes      | Primary key (auto-generated)                     |
| uid           | UUID      | Yes      | Unique user identifier                           |
| email         | String    | Yes      | User email (unique)                              |
| password      | String    | Yes      | Hashed password (bcrypt)                         |
| first_name    | String    | Yes      | First name                                       |
| last_name     | String    | Yes      | Last name                                        |
| role          | String    | Yes      | User role (student/alumni/counsellor/hod/principal/admin) |
| is_active     | Boolean   | Yes      | Account active status (default: true)            |
| is_verified   | Boolean   | Yes      | Email/profile verified (default: false)          |
| avatar        | String    | No       | Profile picture URL (Cloudinary)                 |
| created_at    | DateTime  | Yes      | Account creation timestamp                       |
| updated_at    | DateTime  | Yes      | Last update timestamp                            |

**Indexes**: email (unique), uid (unique)

---

### 2. student_profiles
Extended profile data for students.

| Field              | Type      | Required | Description                                  |
|--------------------|-----------|----------|----------------------------------------------|
| _id                | ObjectId  | Yes      | Primary key (auto-generated)                 |
| user               | ObjectId  | Yes      | Reference to users collection                |
| roll_no            | String    | Yes      | Student roll number (unique, format: YYBQXABC##) |
| department         | String    | Yes      | Department/Branch (CSE, ECE, etc.)           |
| phone              | String    | No       | Contact number                               |
| year               | Integer   | No       | Current year of study (1-4)                  |
| joined_year        | Integer   | No       | Year of joining (auto-calculated from roll_no) |
| completion_year    | Integer   | No       | Expected graduation year (auto-calculated)   |
| current_year       | Integer   | No       | Current year of study (auto-calculated)      |
| current_semester   | Integer   | No       | Current semester (1-8)                       |
| cgpa               | Float     | No       | Cumulative GPA                               |
| address            | String    | No       | Address                                      |
| city               | String    | No       | City                                         |
| state              | String    | No       | State                                        |
| bio                | String    | No       | Biography/About                              |
| linkedin           | String    | No       | LinkedIn profile URL                         |
| github             | String    | No       | GitHub profile URL                           |
| portfolio          | String    | No       | Portfolio website URL                        |
| social_profiles    | Object    | No       | Social media links (embedded document)       |
| skills             | Array     | No       | List of skills (strings)                     |
| certifications     | Array     | No       | List of certifications (strings)             |
| internships        | Array     | No       | List of internship records (embedded docs)   |
| is_placed          | Boolean   | No       | Placement status (default: false)            |
| placement_offers   | Array     | No       | List of placement offers (embedded docs)     |
| career_interest    | String    | No       | Career interest area                         |
| created_at         | DateTime  | Yes      | Profile creation timestamp                   |
| updated_at         | DateTime  | Yes      | Last update timestamp                        |

**Indexes**: user (unique), roll_no (unique)

**Embedded Documents**:
- **social_profiles**: {linkedin, github, leetcode, hackerrank, codechef, codeforces, discord, medium}
- **internships**: {company, role, start_date, end_date, is_paid, description}
- **placement_offers**: {company_name, role, package}

---

### 3. alumni_profiles
Extended profile data for alumni.

| Field              | Type      | Required | Description                                  |
|--------------------|-----------|----------|----------------------------------------------|
| _id                | ObjectId  | Yes      | Primary key (auto-generated)                 |
| user               | ObjectId  | Yes      | Reference to users collection                |
| roll_no            | String    | Yes      | Roll number when student (format: YYBQXABC##) |
| department         | String    | Yes      | Department/Branch (CSE, ECE, etc.)           |
| graduation_year    | Integer   | Yes      | Year of graduation (auto-calculated from roll_no) |
| phone              | String    | No       | Contact number                               |
| current_company    | String    | No       | Current employer                             |
| current_position   | String    | No       | Current job title/designation                |
| location           | String    | No       | Current location/city                        |
| joined_year        | Integer   | No       | Year joined current company                  |
| bio                | String    | No       | Biography/About                              |
| about              | String    | No       | Detailed about section                       |
| linkedin           | String    | No       | LinkedIn profile URL                         |
| github             | String    | No       | GitHub profile URL                           |
| website            | String    | No       | Personal website URL                         |
| social_profiles    | Object    | No       | Social media links (embedded document)       |
| work_experience    | Array     | No       | List of work experiences (embedded docs)     |
| education          | Array     | No       | Higher education records (embedded docs)     |
| skills             | Array     | No       | List of skills (strings)                     |
| industries         | Array     | No       | List of industries/expertise areas           |
| is_verified        | Boolean   | Yes      | Alumni verification status (default: false)  |
| verified_at        | DateTime  | No       | Verification timestamp                       |
| verified_by        | ObjectId  | No       | Reference to user who verified               |
| created_at         | DateTime  | Yes      | Profile creation timestamp                   |
| updated_at         | DateTime  | Yes      | Last update timestamp                        |

**Indexes**: user (unique), roll_no

**Embedded Documents**:
- **social_profiles**: {linkedin, github, leetcode, hackerrank, codechef, codeforces, medium}
- **work_experience**: {company, title, location, start_date, end_date, current, description}
- **education**: {institution, degree, field_of_study, start_year, end_year, grade}

---

### 4. blogs
Blog posts created by users (alumni/students).

| Field            | Type      | Required | Description                                 |
|------------------|-----------|----------|---------------------------------------------|
| _id              | ObjectId  | Yes      | Primary key (auto-generated)                |
| author           | ObjectId  | Yes      | Reference to users collection               |
| title            | String    | Yes      | Blog title (max 200 chars)                  |
| content          | String    | Yes      | Blog content (full text)                    |
| excerpt          | String    | No       | Short summary (max 500 chars)               |
| category         | String    | No       | Blog category                               |
| tags             | Array     | No       | List of tags (strings)                      |
| likes_count      | Integer   | Yes      | Number of likes (default: 0)                |
| comments_count   | Integer   | Yes      | Number of comments (default: 0)             |
| views_count      | Integer   | Yes      | Number of views (default: 0)                |
| read_time        | Integer   | Yes      | Estimated read time in minutes (default: 5) |
| is_published     | Boolean   | Yes      | Published status (default: true)            |
| created_at       | DateTime  | Yes      | Creation timestamp                          |
| updated_at       | DateTime  | Yes      | Last update timestamp                       |

**Indexes**: author, created_at (descending)

---

### 5. blog_comments
Comments on blog posts.

| Field       | Type      | Required | Description                      |
|-------------|-----------|----------|----------------------------------|
| _id         | ObjectId  | Yes      | Primary key (auto-generated)     |
| blog        | ObjectId  | Yes      | Reference to blogs collection    |
| author      | ObjectId  | Yes      | Reference to users collection    |
| content     | String    | Yes      | Comment text                     |
| created_at  | DateTime  | Yes      | Comment timestamp                |

**Indexes**: blog, author

---

### 6. blog_likes
Like records for blogs.

| Field       | Type      | Required | Description                      |
|-------------|-----------|----------|----------------------------------|
| _id         | ObjectId  | Yes      | Primary key (auto-generated)     |
| blog        | ObjectId  | Yes      | Reference to blogs collection    |
| user        | ObjectId  | Yes      | Reference to users collection    |
| created_at  | DateTime  | Yes      | Like timestamp                   |

**Indexes**: (blog, user) - compound unique index

---

### 7. jobs
Job postings created by alumni/admin.

| Field               | Type      | Required | Description                                 |
|---------------------|-----------|----------|---------------------------------------------|
| _id                 | ObjectId  | Yes      | Primary key (auto-generated)                |
| posted_by           | ObjectId  | Yes      | Reference to users collection               |
| title               | String    | Yes      | Job title (max 200 chars)                   |
| company             | String    | Yes      | Company name                                |
| location            | String    | No       | Job location                                |
| job_type            | String    | No       | Type: full-time/part-time/internship/contract |
| description         | String    | Yes      | Job description                             |
| requirements        | Array     | No       | List of requirements (strings)              |
| skills              | Array     | No       | Required skills (strings)                   |
| salary_min          | Integer   | No       | Minimum salary                              |
| salary_max          | Integer   | No       | Maximum salary                              |
| salary_currency     | String    | Yes      | Currency code (default: INR)                |
| application_link    | String    | No       | External application URL                    |
| deadline            | DateTime  | No       | Application deadline                        |
| applications_count  | Integer   | Yes      | Number of applications (default: 0)         |
| views_count         | Integer   | Yes      | Number of views (default: 0)                |
| is_active           | Boolean   | Yes      | Active status (default: true)               |
| created_at          | DateTime  | Yes      | Creation timestamp                          |
| updated_at          | DateTime  | Yes      | Last update timestamp                       |

**Indexes**: posted_by, created_at (descending), is_active

---

### 8. job_applications
Job application records.

| Field         | Type      | Required | Description                            |
|---------------|-----------|----------|----------------------------------------|
| _id           | ObjectId  | Yes      | Primary key (auto-generated)           |
| job           | ObjectId  | Yes      | Reference to jobs collection           |
| applicant     | ObjectId  | Yes      | Reference to users collection          |
| resume_url    | String    | No       | Resume file URL                        |
| cover_letter  | String    | No       | Cover letter text                      |
| status        | String    | Yes      | Status: pending/reviewed/shortlisted/rejected (default: pending) |
| created_at    | DateTime  | Yes      | Application timestamp                  |

**Indexes**: (job, applicant) - compound unique index, applicant

---

### 9. events
Events created by admin/alumni.

| Field               | Type      | Required | Description                                 |
|---------------------|-----------|----------|---------------------------------------------|
| _id                 | ObjectId  | Yes      | Primary key (auto-generated)                |
| created_by          | ObjectId  | Yes      | Reference to users collection               |
| title               | String    | Yes      | Event title (max 200 chars)                 |
| description         | String    | Yes      | Event description                           |
| event_date          | DateTime  | Yes      | Event start date and time                   |
| end_date            | DateTime  | No       | Event end date and time                     |
| location            | String    | No       | Event location                              |
| event_type          | String    | No       | Type: workshop/seminar/webinar/meetup/conference/other |
| registration_link   | String    | No       | External registration URL                   |
| max_participants    | Integer   | No       | Maximum number of participants              |
| registrations_count | Integer   | Yes      | Number of registrations (default: 0)        |
| is_active           | Boolean   | Yes      | Active status (default: true)               |
| created_at          | DateTime  | Yes      | Creation timestamp                          |
| updated_at          | DateTime  | Yes      | Last update timestamp                       |

**Indexes**: created_by, event_date (descending), is_active

---

### 10. event_registrations
Event registration records.

| Field       | Type      | Required | Description                      |
|-------------|-----------|----------|----------------------------------|
| _id         | ObjectId  | Yes      | Primary key (auto-generated)     |
| event       | ObjectId  | Yes      | Reference to events collection   |
| user        | ObjectId  | Yes      | Reference to users collection    |
| created_at  | DateTime  | Yes      | Registration timestamp           |

**Indexes**: (event, user) - compound unique index, user

---

## Relationships

### Entity Relationship Diagram (Simplified)

```
┌──────────────┐
│    users     │
│  (central)   │
└──────────────┘
      │
      ├─── One-to-One ────→ student_profiles
      │
      ├─── One-to-One ────→ alumni_profiles
      │
      ├─── One-to-Many ───→ blogs (as author)
      │
      ├─── One-to-Many ───→ jobs (as posted_by)
      │
      ├─── One-to-Many ───→ events (as created_by)
      │
      ├─── Many-to-Many ──→ blog_likes (through user reference)
      │
      ├─── Many-to-Many ──→ job_applications (through applicant reference)
      │
      └─── Many-to-Many ──→ event_registrations (through user reference)
```

### Reference Types:
1. **One-to-One**: User ↔ StudentProfile, User ↔ AlumniProfile
2. **One-to-Many**: User → Blogs, User → Jobs, User → Events
3. **Many-to-Many**: Users ↔ Blogs (via likes), Users ↔ Jobs (via applications), Users ↔ Events (via registrations)

---

## Data Types

### MongoDB Data Types Used:
- **ObjectId**: 12-byte unique identifier (primary keys, references)
- **String**: Text data (UTF-8 encoded)
- **Integer**: 32-bit or 64-bit whole numbers
- **Float**: Floating-point numbers (for CGPA, etc.)
- **Boolean**: true/false values
- **DateTime**: ISO 8601 timestamp
- **Array**: List of values (can be any type)
- **Object**: Embedded document (nested structure)
- **UUID**: Universally unique identifier (for user uid)

### Common Field Patterns:
- **created_at, updated_at**: Automatic timestamps on all main collections
- **is_active, is_verified**: Boolean flags for status tracking
- **_count fields**: Integer counters (views_count, likes_count, etc.)
- **social_profiles**: Embedded object for social media links

---

## Passout Year Logic

### Automatic Calculation
The system automatically calculates passout/graduation years from roll numbers.

### Roll Number Format: YYBQXABC##
- **YY**: Joining year (e.g., "22" = 2022)
- **BQ**: Constant
- **X**: Entry type (1 = Regular 4-year, 5 = Lateral 3-year)
- **A**: Constant
- **BC**: Branch code
- **##**: Student number

### Calculation Rules:
1. **Regular Entry (X=1)**: Passout Year = Joining Year + 4
   - Example: `22BQ1A4225` → Joined 2022 → Passout 2026

2. **Lateral Entry (X=5)**: Passout Year = Joining Year + 3
   - Example: `22BQ5A4225` → Joined 2022 → Passout 2025

### Alumni Status:
- **Passout Date**: March 31st of passout year
- **Status**:
  - If current date > March 31, passout_year → **Alumni**
  - Otherwise → **Current Student**

### Implementation:
- **student_profiles.completion_year**: Auto-calculated from roll_no
- **student_profiles.joined_year**: Extracted from roll_no
- **alumni_profiles.graduation_year**: Auto-calculated from roll_no

**Note**: See `PASSOUT_YEAR_LOGIC.md` for detailed documentation.

---

## Schema Flexibility

### NoSQL Advantages:
1. **Dynamic Schema**: New fields can be added without altering existing documents
2. **No Strict Constraints**: Field types and structures can evolve over time
3. **Easy Modifications**: Schema changes don't require complex migrations
4. **Flexible Nesting**: Embedded documents allow hierarchical data without joins

### Schema Evolution:
This schema **can be modified according to requirements**. Changes can include:
- Adding new fields to existing collections
- Creating new collections
- Modifying field types (with data migration if needed)
- Adding/removing indexes for performance
- Restructuring embedded documents

### Backward Compatibility:
The system maintains backward compatibility through:
- Optional fields (most fields allow null/undefined)
- Dual field support (e.g., `linkedin` and `social_profiles.linkedin`)
- Default values for new fields
- Gradual migration of old data

---

## Notes for Stakeholders

### Database Type:
- **NoSQL (MongoDB)**: Document-oriented database providing flexibility and scalability

### Key Benefits:
1. **Flexible Schema**: Easy to adapt to changing requirements
2. **Auto-Calculation**: Graduation years calculated automatically, reducing manual errors
3. **Scalability**: MongoDB scales horizontally across multiple servers
4. **Performance**: Fast queries with proper indexing
5. **JSON-like Structure**: Easy integration with web applications

### Maintenance:
- Regular backups recommended (MongoDB Atlas provides automatic backups)
- Indexes monitored for query performance
- Schema updates documented and versioned
- Data migration scripts available when structure changes

### Security:
- Password hashing using bcrypt
- MongoDB connection secured with authentication
- Environment variables for sensitive configuration
- Role-based access control at application level

---

## Appendix: Branch Codes

| Code | Short Name | Full Name |
|------|------------|-----------|
| 61   | AIML       | Artificial Intelligence & Machine Learning |
| 47   | CIC        | CSE with IoT and Cyber Security including Blockchain Technology |
| 01   | CIV        | Civil Engineering |
| 05   | CSE        | Computer Science & Engineering |
| 42   | CSM        | CSE with Artificial Intelligence & Machine Learning |
| 49   | CSO        | CSE with Internet of Things |
| 04   | ECE        | Electronics & Communication Engineering |
| 02   | EEE        | Electrical & Electronics Engineering |
| 12   | IT         | Information Technology |
| 03   | MEC        | Mechanical Engineering |
| 54   | AID        | Artificial Intelligence & Data Science |

---

**Document End**

For technical implementation details, refer to:
- `backend/common/models.py` - Model definitions
- `backend/common/roll_number_utils.py` - Passout year calculation
- `PASSOUT_YEAR_LOGIC.md` - Detailed logic documentation
