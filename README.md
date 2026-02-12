# VVITU Alumni Connect - Alumni Management & Engagement Platform

A production-ready, role-based Alumni Management and Engagement Platform for Vasireddy Venkatadri International Technological University, built with React 18, Vite, Tailwind CSS, and modern best practices.

## 🚀 Features

### Role-Based Interfaces
- **Student**: Browse alumni directory, view jobs/events, AI-powered career recommendations, blog interactions
- **Alumni**: Post jobs, write blogs, mentor students, connect with network
- **Counsellor**: Manage students/alumni, track placement trends
- **HOD**: Department analytics and performance monitoring
- **Principal**: Institution-wide statistics and insights
- **Admin**: User management, alumni verification, event management

### Core Functionality
- 🔐 **JWT Authentication** with role-based access control
- 🎨 **Modern UI** with Tailwind CSS and responsive design
- 📊 **Interactive Dashboards** with Recharts and real-time data
- 🤖 **AI-Powered Recommendations** for alumni mentors and career paths
- 📱 **Mobile-Friendly** layouts with adaptive design
- 🛡️ **Scope-Based Permissions** for granular access control

### Social Features
- 💬 **Blog Interactions**: Like, comment, and share blog posts
- 🔗 **Social Sharing**: Share content on LinkedIn, Twitter with one click
- 🤝 **Connection Requests**: Build your professional network
- 👥 **Alumni Recommendations**: AI-powered mentor suggestions with match scores
- 📝 **Rich Text Blogging**: Write and publish career insights

### File Management
- 📎 **File Uploads**: Profile pictures, resumes, certificates
- 🖼️ **Image Preview**: Real-time preview for uploaded images
- ✅ **Validation**: File type and size validation (Max 5MB)
- 📄 **Document Support**: PDF, DOC, DOCX, JPG, PNG formats
- 🗑️ **File Removal**: Easy file deletion before final submission

### Search & Discovery
- 🔍 **Advanced Search**: Debounced search with 500ms delay
- 🎯 **Multiple Filter Types**: Select, multiselect, range, text, date filters
- 🏷️ **Active Filter Badges**: Visual feedback for applied filters
- 🗂️ **Alumni Directory**: Filter by department, graduation year, company, location, skills
- 💼 **Job Filtering**: Filter by job type, location, salary range, experience, skills
- 📅 **Event Filtering**: Filter by event type, date, status

### Notification System
- 📬 **Email Notifications**: Welcome emails, job alerts, event reminders
- 🔔 **In-App Notifications**: Real-time notification bell with unread count
- ⚙️ **Notification Preferences**: Granular control over notification types
- ✉️ **Beautiful Email Templates**: Responsive HTML email designs
- 👀 **Read Tracking**: Mark as read, dismiss, or clear all notifications
- 🎯 **Targeted Notifications**: Job matches, comment replies, connection requests

### Profile Management
- 📝 **Comprehensive Profiles**: 7 tabs for students, 5 tabs for alumni
- 🎓 **Academic Details**: Roll number validation (YYBQXABC## format)
- 💼 **Professional Info**: Current position, company, experience
- 🏆 **Certifications**: Add multiple certifications with file attachments
- 🔗 **Social Links**: LinkedIn (mandatory), GitHub, Twitter, Portfolio, LeetCode, CodeChef
- 📊 **Skills Management**: Add skills with proficiency levels
- 💻 **Internships & Placements**: Track career progression

### Roll Number System
- 🔢 **Pattern**: YYBQXABC## (10 digits)
  - YY: Admission year (e.g., 21 for 2021)
  - B: Branch code (C=CSE, E=ECE, etc.)
  - Q: Quota (R=Regular, M=Management)
  - X: Lateral entry (0=Direct, 1=Lateral)
  - ABC: Sequence number (001-999)
  - ##: Check digits (00-99)
- ✅ **Frontend & Backend Validation**
- 🏢 **Auto Department Detection** from branch code

## 📁 Project Structure

```
src/
├── api/                    # API layer with Axios
│   ├── axiosInstance.js    # Base Axios configuration
│   ├── auth.api.js         # Authentication endpoints
│   ├── student.api.js      # Student-specific endpoints
│   ├── alumni.api.js       # Alumni endpoints
│   ├── admin.api.js        # Admin endpoints
│   └── ...
├── components/
│   ├── shared/             # Reusable UI components
│   ├── student/            # Student-specific components
│   ├── alumni/             # Alumni-specific components
│   ├── counsellor/         # Counsellor components
│   ├── hod/                # HOD components
│   ├── principal/          # Principal components
│   └── admin/              # Admin components
├── constants/
│   └── roles.js            # Roles, scopes, and permissions
├── context/
│   └── AuthContext.jsx     # Authentication context
├── data/
│   ├── mockData.js         # Mock data for development
│   └── adminMockData.js    # Admin-specific mock data
├── layouts/                # Role-based layout components
├── pages/
│   ├── auth/               # Login, Register pages
│   ├── student/            # Student pages
│   ├── alumni/             # Alumni pages
│   ├── counsellor/         # Counsellor pages
│   ├── hod/                # HOD pages
│   ├── principal/          # Principal pages
│   └── admin/              # Admin pages
├── App.jsx                 # Main app with routing
├── main.jsx                # Entry point
└── index.css               # Global styles
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.2.0
- **Build Tool**: Vite 4.4.5
- **Styling**: Tailwind CSS 3.3.3
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: React Icons (Feather Icons, Simple Icons)
- **State Management**: Context API
- **Authentication**: JWT with jwt-decode

### Backend
- **Framework**: Django 4.2+
- **Database**: MongoDB with Mongoengine
- **API**: Django REST Framework
- **Authentication**: Custom JWT
- **Email**: Django Email with HTML templates
- **File Uploads**: Django file handling with validation

### Key Libraries
- **react-router-dom**: v6 for routing
- **axios**: HTTP client with interceptors
- **recharts**: Data visualization
- **react-icons**: Icon library
- **jwt-decode**: JWT token parsing
- **tailwindcss**: Utility-first CSS

## 📦 Installation

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd Alumni-Connect/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd Alumni-Connect/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Create `.env` file in backend directory:
   ```env
   SECRET_KEY=your-secret-key
   DEBUG=True
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET_KEY=your-jwt-secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   FRONTEND_URL=http://localhost:5173
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (for admin access)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Load seed data** (optional)
   ```bash
   python manage.py shell < scripts/seed_data.py
   ```

8. **Start development server**
   ```bash
   python manage.py runserver
   ```

   Backend will run on: `http://localhost:8000`

## 🔐 Authentication

The app uses JWT-based authentication with role-based access control.

### Test Credentials (Mock Mode)
| Role | Email | Password |
|------|-------|----------|
| Student | student@vvitu.ac.in | password |
| Alumni | alumni@gmail.com | password |
| Counsellor | counsellor@vvitu.ac.in | password |
| HOD | hod@vvitu.ac.in | password |
| Principal | principal@vvitu.ac.in | password |
| Admin | admin@vvitu.ac.in | password |

### Scopes & Permissions
Each role has specific scopes that control access to features:
- `view_alumni`, `view_jobs`, `view_events`, `view_blogs`
- `post_job`, `post_blog`, `manage_events`
- `view_students`, `verify_alumni`, `manage_users`
- `view_analytics`, `view_department_stats`, `view_institution_stats`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK=true
```

### API Configuration
The app can run in mock mode (default) or connect to a backend API:
- Set `USE_MOCK = true` in API files for development
- Set `USE_MOCK = false` and configure `VITE_API_BASE_URL` for production

### Email Configuration
For email notifications, configure SMTP settings in backend `.env`:
```env
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=alumni@vvitu.ac.in
```

**Note**: For Gmail, use an App Password rather than your regular password.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/register/` - User registration
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT token

### Notifications
- `GET /api/notifications/` - Get all notifications
- `GET /api/notifications/unread/` - Get unread notifications
- `GET /api/notifications/unread_count/` - Get unread count
- `POST /api/notifications/{id}/mark_read/` - Mark as read
- `POST /api/notifications/mark_all_read/` - Mark all as read
- `DELETE /api/notifications/{id}/dismiss/` - Dismiss notification
- `DELETE /api/notifications/clear_all/` - Clear all read notifications

### Notification Preferences
- `GET /api/notifications/preferences/my_preferences/` - Get preferences
- `PUT /api/notifications/preferences/update_preferences/` - Update preferences

### Blogs
- `GET /api/blogs/` - List all blogs
- `GET /api/blogs/{slug}/` - Get blog details
- `POST /api/blogs/{slug}/like/` - Like/unlike blog
- `POST /api/blogs/{slug}/comments/` - Add comment
- `POST /api/blogs/{slug}/share/` - Track share

### Jobs
- `GET /api/jobs/` - List all jobs
- `GET /api/jobs/{id}/` - Get job details
- `POST /api/jobs/` - Create job (alumni only)

### Events
- `GET /api/events/` - List all events
- `GET /api/events/{id}/` - Get event details
- `POST /api/events/{id}/register/` - Register for event

### AI Recommendations
- `GET /api/ai/mentors/` - Get recommended alumni mentors
- `GET /api/ai/career-recommendation/` - Get career path recommendations

### Profiles
- `GET /api/profile/me/` - Get current user profile
- `PUT /api/profile/me/` - Update profile
- `POST /api/profile/upload/` - Upload files (resume, certificates, photos)

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- **Mobile**: < 768px - Single column layouts, collapsible navigation
- **Tablet**: 768px - 1024px - Two column grids, sidebar navigation
- **Desktop**: > 1024px - Multi-column grids, persistent sidebars

### Mobile Optimizations
- Touch-friendly buttons and inputs
- Hamburger menu for navigation
- Adaptive image sizes
- Optimized form layouts
- Pull-to-refresh support (coming soon)

## 🧩 Component Library

### Shared Components

#### FileUpload
Upload files with validation, preview, and error handling.
```jsx
import { FileUpload } from '../components/shared';

<FileUpload
  label="Resume/CV"
  accept=".pdf,.doc,.docx"
  maxSize={5}  // MB
  value={file}
  onChange={(file) => setFile(file)}
  showPreview={true}
  helperText="Upload your resume (Max 5MB)"
/>
```

#### AdvancedSearch
Advanced search with multiple filter types.
```jsx
import { AdvancedSearch } from '../components/shared';

const filters = [
  {
    key: 'department',
    label: 'Department',
    type: 'select',
    options: ['CSE', 'ECE', 'MECH', 'CIVIL']
  },
  {
    key: 'year',
    label: 'Graduation Year',
    type: 'range',
    min: 2000,
    max: 2024
  },
  {
    key: 'skills',
    label: 'Skills',
    type: 'multiselect',
    options: ['React', 'Python', 'Java', 'AWS']
  }
];

<AdvancedSearch
  filters={filters}
  onSearch={(searchTerm, activeFilters) => {
    // Handle search and filters
  }}
  placeholder="Search alumni..."
  debounceMs={500}
/>
```

#### NotificationBell
Real-time notification bell with dropdown.
```jsx
import { NotificationBell } from '../components/shared';

// In your navbar/header
<NotificationBell />
```

#### RollNumberInput
Roll number input with validation.
```jsx
import { RollNumberInput } from '../components/shared';

<RollNumberInput
  value={rollNumber}
  onChange={(value) => setRollNumber(value)}
  onValidationChange={(isValid) => setIsValid(isValid)}
/>
```

### Student Components

#### ProfileEditForm
7-tab comprehensive profile editor for students.
```jsx
import ProfileEditForm from '../components/student/ProfileEditForm';

<ProfileEditForm
  profile={studentProfile}
  onSave={(updatedProfile) => handleSave(updatedProfile)}
  onCancel={() => setEditing(false)}
  loading={saving}
/>
```

#### BlogCard
LinkedIn-style blog card with like, comment, share.
```jsx
import BlogCard from '../components/student/BlogCard';

<BlogCard
  post={blogPost}
  onLike={(postId) => handleLike(postId)}
  onComment={(postId, comment) => handleComment(postId, comment)}
/>
```

#### SuggestedAlumniCard
Alumni recommendation card with match score.
```jsx
import SuggestedAlumniCard from '../components/student/SuggestedAlumniCard';

<SuggestedAlumniCard
  alumni={alumniData}
  matchScore={85}
  matchReason="Similar career path and skills"
/>
```

### Alumni Components

#### AlumniProfileEditForm
5-tab professional profile editor for alumni.
```jsx
import AlumniProfileEditForm from '../components/alumni/AlumniProfileEditForm';

<AlumniProfileEditForm
  profile={alumniProfile}
  onSave={(updatedProfile) => handleSave(updatedProfile)}
  onCancel={() => setEditing(false)}
  loading={saving}
/>
```

## 🔍 Usage Examples

### Implementing File Upload in Forms

```jsx
import { useState } from 'react';
import { FileUpload } from '../components/shared';

const MyForm = () => {
  const [resume, setResume] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    if (resume) formData.append('resume', resume);
    if (certificate) formData.append('certificate', certificate);
    if (profilePic) formData.append('profile_picture', profilePic);
    
    // Send to API
    await api.post('/profile/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FileUpload
        label="Profile Picture"
        accept="image/*"
        maxSize={5}
        value={profilePic}
        onChange={setProfilePic}
        showPreview={true}
      />
      
      <FileUpload
        label="Resume"
        accept=".pdf,.doc,.docx"
        maxSize={5}
        value={resume}
        onChange={setResume}
      />
      
      <button type="submit">Save</button>
    </form>
  );
};
```

### Implementing Advanced Search

```jsx
import { useState } from 'react';
import { AdvancedSearch } from '../components/shared';
import { searchAlumni } from '../api/alumni.api';

const AlumniDirectory = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(false);

  const filters = [
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      options: ['CSE', 'ECE', 'MECH', 'CIVIL', 'MBA']
    },
    {
      key: 'graduationYear',
      label: 'Graduation Year',
      type: 'range',
      min: 2000,
      max: 2024
    },
    {
      key: 'company',
      label: 'Company',
      type: 'text',
      placeholder: 'Enter company name'
    },
    {
      key: 'skills',
      label: 'Skills',
      type: 'multiselect',
      options: ['React', 'Python', 'Java', 'AWS', 'Machine Learning']
    },
    {
      key: 'location',
      label: 'Location',
      type: 'select',
      options: ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi', 'USA', 'UK']
    }
  ];

  const handleSearch = async (searchTerm, activeFilters) => {
    setLoading(true);
    try {
      const results = await searchAlumni({
        search: searchTerm,
        ...activeFilters
      });
      setAlumni(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdvancedSearch
        filters={filters}
        onSearch={handleSearch}
        placeholder="Search alumni by name, company, or skills..."
      />
      
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumni.map(person => (
            <AlumniCard key={person.id} alumni={person} />
          ))}
        </div>
      )}
    </div>
  );
};
```

### Implementing Notifications

```jsx
import { useEffect, useState } from 'react';
import { NotificationBell } from '../components/shared';
import { getUnreadCount } from '../api/notifications.api';

const AppHeader = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch initial count
    fetchCount();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Failed to fetch count:', error);
    }
  };

  return (
    <header>
      <nav>
        {/* Other nav items */}
        <NotificationBell />
      </nav>
    </header>
  );
};
```

## 🎨 Theming

Colors can be customized in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    // Custom primary color palette
  },
  secondary: {
    // Custom secondary color palette
  },
}
```

## 🚀 Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Preview production build**
   ```bash
   npm run preview
   ```

3. **Deploy** the `dist` folder to your hosting provider

## 📄 License

MIT License - feel free to use this project for educational or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting a PR.

---

Built with ❤️ for connecting VVITU alumni with their alma mater
