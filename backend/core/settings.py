"""
Django settings for Alumni Connect backend.
Using MongoDB with mongoengine + PostgreSQL (production) / SQLite (development).
"""
import os
import dj_database_url
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

_allowed = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1')
ALLOWED_HOSTS = [h.strip() for h in _allowed.split(',') if h.strip()]

# Render auto-injects RENDER_EXTERNAL_HOSTNAME with the service's public hostname
_render_host = os.getenv('RENDER_EXTERNAL_HOSTNAME', '')
if _render_host and _render_host not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(_render_host)
# Always allow internal health-check probes on Render
if os.getenv('RENDER') and '127.0.0.1' not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.extend(['127.0.0.1', 'localhost'])

# Production security headers (only enforced when DEBUG=False)
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = False  # Render handles HTTPS termination
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True

# MongoDB Connection (required — set MONGODB_URI in environment)
MONGODB_URI = os.getenv('MONGODB_URI', '')

# Connect to MongoDB using mongoengine (optional - for document-based models)
try:
    # Parse database name from URI or use default
    if '/' in MONGODB_URI.split('@')[-1]:
        db_name = MONGODB_URI.split('/')[-1].split('?')[0]
    else:
        db_name = 'alumni_connect'
    
    mongoengine.connect(
        db=db_name,
        host=MONGODB_URI,
        # Only skip TLS validation in local dev; Atlas certs are valid in prod
        tlsAllowInvalidCertificates=DEBUG
    )
    print("[OK] MongoDB connected successfully")
except Exception as e:
    print(f"[WARNING] MongoDB connection failed: {str(e)}")
    print("[OK] Continuing with SQLite database...")

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
    'whitenoise.runserver_nostatic',
    
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
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'core.middleware.jwt_middleware.JWTScopeMiddleware',
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
# Uses DATABASE_URL env var (PostgreSQL on Render) with SQLite as local fallback
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL:
    DATABASES = {
        'default': dj_database_url.config(
            default=DATABASE_URL,
            conn_max_age=600,
            conn_health_checks=True,
        )
    }
else:
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

# Static files (whitenoise serves them in production without a CDN)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# CORS Settings
CORS_ALLOW_CREDENTIALS = True
_cors_origins = os.getenv('CORS_ALLOWED_ORIGINS', '')
CORS_ALLOWED_ORIGINS = [o.strip() for o in _cors_origins.split(',') if o.strip()]
# Allow all origins only in local dev
if DEBUG and not CORS_ALLOWED_ORIGINS:
    CORS_ALLOW_ALL_ORIGINS = True

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# JWT Settings (custom)
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', SECRET_KEY)
JWT_ACCESS_TOKEN_LIFETIME = timedelta(days=1)
JWT_REFRESH_TOKEN_LIFETIME = timedelta(days=7)
JWT_ALGORITHM = 'HS256'

# SimpleJWT Settings (for rest_framework_simplejwt)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

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

# Allow @vvit.net accounts to login without email verification (for seeded accounts)
SKIP_EMAIL_VERIFICATION_FOR_VVIT = os.getenv('SKIP_EMAIL_VERIFICATION', 'True').lower() == 'true'

# Email Configuration - Use SMTP from environment variables
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.smtp.EmailBackend')
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.office365.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True').lower() == 'true'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'VVITU Alumni Network <noreply@vvit.net>')