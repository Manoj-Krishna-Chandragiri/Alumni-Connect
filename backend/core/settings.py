"""
Django settings for Alumni Connect backend.
Using MongoDB with mongoengine.
"""
import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv
import mongoengine

load_dotenv()

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-change-this-in-production-xyz123')
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1,*').split(',')

# MongoDB Connection
MONGODB_URI = os.getenv(
    'MONGODB_URI',
    'mongodb+srv://alumni_app_user:wg1Ai34AJYndCOLm@cluster0.p9k7x.mongodb.net/alumni_connect_db?retryWrites=true&w=majority'
)

# Connect to MongoDB using mongoengine
mongoengine.connect(host=MONGODB_URI)

# Application definition
INSTALLED_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.messages',
    
    # Third-party apps
    'rest_framework',
    'corsheaders',
    'django_filters',
    
    # Local apps
    'api',
    'common',
    'apps.accounts',
    'apps.students',
    'apps.alumni',
    'apps.events',
    'apps.blogs',
    'apps.jobs',
    'apps.ai_engine',
    'apps.analytics',
    'apps.notifications',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Database configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Custom User Model  
AUTH_USER_MODEL = 'accounts.User'

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = 'static/'

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', '').split(',') if os.getenv('CORS_ALLOWED_ORIGINS') else []

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'common.jwt_auth.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'UNAUTHENTICATED_USER': None,
}

# JWT Settings
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
JWT_ACCESS_TOKEN_LIFETIME = timedelta(days=1)
JWT_REFRESH_TOKEN_LIFETIME = timedelta(days=7)
JWT_ALGORITHM = 'HS256'

# Role to Scope Mapping
ROLE_SCOPES = {
    'student': [
        'read:blogs', 'read:alumni', 'read:events', 'read:jobs',
        'update:self_profile', 'ai:recommendation'
    ],
    'alumni': [
        'read:blogs', 'create:blogs', 'read:jobs', 'create:jobs',
        'read:events', 'read:alumni', 'update:self_profile'
    ],
    'counsellor': [
        'read:students', 'read:alumni', 'read:events', 'read:ai_reports'
    ],
    'hod': [
        'read:department_students', 'read:department_alumni',
        'read:analytics', 'read:events'
    ],
    'principal': [
        'read:students', 'read:alumni', 'read:institution_analytics', 'read:events'
    ],
    'admin': [
        'verify:alumni', 'manage:students', 'manage:alumni',
        'create:events', 'manage:system', 'read:students', 'read:alumni',
        'read:events', 'read:blogs', 'read:jobs'
    ],
}
# Frontend URL for email links
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

# Email Configuration
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'alumni@vvitu.ac.in')