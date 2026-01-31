# Alumni Connect Backend

Production-grade Django REST Framework backend for College Alumni Management & Engagement Platform.

## Tech Stack

- Python 3.11
- Django 5.0
- Django REST Framework
- MongoDB (mongoengine)
- SimpleJWT for authentication
- Role-based + Scope-based authorization

## Project Structure

```
backend/
├── core/                   # Core Django settings
│   ├── settings.py
│   ├── urls.py
│   └── middleware/
├── apps/
│   ├── accounts/          # User authentication & profiles
│   ├── students/          # Student management
│   ├── alumni/            # Alumni management
│   ├── blogs/             # Blog system
│   ├── jobs/              # Job postings
│   ├── events/            # Event management
│   ├── analytics/         # Analytics & reports
│   └── ai_engine/         # AI recommendations
├── common/                # Shared utilities
│   ├── permissions.py
│   ├── serializers.py
│   └── utils.py
└── manage.py
```

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run server:
```bash
python manage.py runserver
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user

### Students
- `GET /api/students/` - List students
- `GET /api/students/profile` - Get profile
- `PUT /api/students/profile` - Update profile

### Alumni
- `GET /api/alumni/` - List alumni
- `GET /api/alumni/{id}` - Get alumni details
- `POST /api/alumni/verify` - Verify alumni (Admin only)

### Blogs
- `GET /api/blogs/` - List blogs
- `POST /api/blogs/` - Create blog (Alumni only)
- `PUT /api/blogs/{id}` - Update blog
- `DELETE /api/blogs/{id}` - Delete blog

### Jobs
- `GET /api/jobs/` - List jobs
- `POST /api/jobs/` - Post job (Alumni only)

### Events
- `GET /api/events/` - List events
- `POST /api/events/` - Create event (Admin only)

### AI Engine
- `GET /api/ai/career-recommendation/{student_id}` - Get career recommendations

## User Roles

- STUDENT
- ALUMNI
- COUNSELLOR
- HOD
- PRINCIPAL
- ADMIN

## License

MIT
