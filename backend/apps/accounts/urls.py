"""
URL configuration for accounts app.
"""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'accounts'

urlpatterns = [
    # Authentication
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', views.MeView.as_view(), name='me'),
    path('change-password/', views.ChangePasswordView.as_view(), name='change_password'),
    
    # User management (Admin)
    path('users/', views.UserListView.as_view(), name='user_list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user_detail'),
    
    # Alumni verification (Admin)
    path('verify-alumni/', views.AlumniVerificationView.as_view(), name='verify_alumni'),
    
    # Profile management
    path('profile/student/', views.StudentProfileView.as_view(), name='student_profile'),
    path('profile/alumni/', views.AlumniProfileView.as_view(), name='alumni_profile'),
]
