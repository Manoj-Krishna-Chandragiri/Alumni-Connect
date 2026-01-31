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
    
    # Third-party apps
    'rest_framework',
    'corsheaders',
    'django_filters',
    
    # Local apps
    'api',
    'common',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# No SQL Database needed - using MongoDB via mongoengine
DATABASES = {}

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
        'read:events', 'update:self_profile'
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
