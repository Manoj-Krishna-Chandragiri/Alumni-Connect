# Alumni Connect - Alumni Management & Engagement Platform

A production-ready, role-based Alumni Management and Engagement Platform for colleges, built with React 18, Vite, Tailwind CSS, and modern best practices.

## 🚀 Features

### Role-Based Interfaces
- **Student**: Browse alumni directory, view jobs/events, AI-powered career recommendations
- **Alumni**: Post jobs, write blogs, connect with students
- **Counsellor**: Manage students/alumni, track placement trends
- **HOD**: Department analytics and performance monitoring
- **Principal**: Institution-wide statistics and insights
- **Admin**: User management, alumni verification, event management

### Core Functionality
- 🔐 JWT Authentication with role-based access control
- 🎨 Modern UI with Tailwind CSS and responsive design
- 📊 Interactive dashboards with Recharts
- 🔍 AI-powered alumni recommendations
- 📱 Mobile-friendly layouts
- 🛡️ Scope-based permission system

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

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Icons**: React Icons
- **State Management**: Context API
- **Authentication**: JWT with jwt-decode

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd Alumni-Connect
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
   http://localhost:3000
   ```

## 🔐 Authentication

The app uses JWT-based authentication with role-based access control.

### Test Credentials (Mock Mode)
| Role | Email | Password |
|------|-------|----------|
| Student | student@college.edu | password |
| Alumni | alumni@gmail.com | password |
| Counsellor | counsellor@college.edu | password |
| HOD | hod@college.edu | password |
| Principal | principal@college.edu | password |
| Admin | admin@college.edu | password |

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

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

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

Built with ❤️ for connecting alumni with their alma mater
