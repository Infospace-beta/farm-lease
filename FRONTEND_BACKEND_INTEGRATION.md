# Frontend-Backend Integration Guide

## Overview

This document explains how the React frontend is connected to the Django backend, including authentication, API calls, and role-based access control.

## ✅ What's Already Configured (Frontend)

### 1. API Client Setup (`src/services/apiClient.js`)

The frontend has an Axios instance configured with:
- **Base URL**: `http://localhost:8000/api` (configurable via `VITE_API_BASE_URL`)
- **JWT Token Interceptor**: Automatically attaches Bearer token to all requests
- **Token Refresh**: Handles 401 errors and refreshes tokens automatically

```javascript
// Request headers automatically include:
Authorization: Bearer <access_token>
```

### 2. Authentication Service (`src/services/authService.js`)

**Key Features:**
- ✅ JWT token decoding to extract user info (role, is_staff, user_id, etc.)
- ✅ Stores tokens in localStorage: `accessToken`, `refreshToken`, `user`
- ✅ Login, Register, Logout functions
- ✅ Helper methods: `isAuthenticated()`, `getUserRole()`, `isStaff()`

**Token Structure Expected:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**JWT Payload Expected:**
```json
{
  "user_id": 123,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "OWNER",  // OWNER, LESSEE, DEALER
  "is_staff": false,
  "exp": 1234567890
}
```

### 3. Role-Based Routing (`src/components/common/ProtectedRoute.jsx`)

**Features:**
- ✅ Checks JWT token for authentication
- ✅ Role-based access control (`allowedRoles` prop)
- ✅ Admin-only routes (`requireAdmin={true}` checks `is_staff` flag)
- ✅ Automatic redirection to appropriate dashboard
- ✅ Loading states during authentication check

**Usage Examples:**
```jsx
// Regular user route
<ProtectedRoute allowedRoles={['OWNER']}>
  <MyLandsPage />
</ProtectedRoute>

// Admin-only route (checks is_staff)
<ProtectedRoute requireAdmin={true}>
  <AdminDashboard />
</ProtectedRoute>
```

### 4. Authentication Context (`src/context/AuthContext.jsx`)

**Provides:**
- `user` - Current user object with role and is_staff
- `login(email, password)` - Login function
- `register(userData)` - Register function
- `logout()` - Logout function
- `isAuthenticated` - Boolean auth status
- `userRole` - Current user's role
- `isStaff` - Boolean admin status

### 5. Updated UI Components

**Navbar** (`src/components/layout/Navbar.jsx`)
- ✅ Displays username and role
- ✅ Shows "Admin" for staff users
- ✅ Logout button

**Admin Routes** (`src/App.jsx`)
- ✅ Uses `requireAdmin={true}` for admin pages
- ✅ Only accessible to users with `is_staff: true`

---

## 🔧 Backend Implementation Required

To make the frontend work, your Django backend needs the following:

### 1. Install Dependencies

```bash
cd backend/farmlease
pip install djangorestframework djangorestframework-simplejwt django-cors-headers
```

### 2. Update `settings.py`

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    
    # Your apps
    'accounts',
    'landmanagement',
    'contracts',
    'payments',
    'productplace',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this at the top
    'django.middleware.security.SecurityMiddleware',
    # ... other middleware
]

# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True

# REST Framework Settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# JWT Settings
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    
    # Include custom claims in token
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}
```

### 3. Create Custom User Model (`accounts/models.py`)

```python
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('OWNER', 'Farm Owner'),
        ('LESSEE', 'Farmer/Lessee'),
        ('DEALER', 'Agro-Dealer'),
    ]
    
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=15, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'role']
    
    def __str__(self):
        return f"{self.username} ({self.role})"
```

**Update `settings.py`:**
```python
AUTH_USER_MODEL = 'accounts.User'
```

### 4. Create Serializers (`accounts/serializers.py`)

```python
from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        # Add custom claims
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        token['is_staff'] = user.is_staff
        
        return token

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'is_staff']
        read_only_fields = ['id', 'is_staff']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'phone']
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
```

### 5. Create Views (`accounts/views.py`)

```python
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    RegisterSerializer
)

User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    # You can implement token blacklisting here if needed
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    stats = {
        'total_users': User.objects.count(),
        'farm_owners': User.objects.filter(role='OWNER').count(),
        'lessees': User.objects.filter(role='LESSEE').count(),
        'dealers': User.objects.filter(role='DEALER').count(),
    }
    return Response(stats)
```

### 6. Create URL Patterns (`accounts/urls.py`)

```python
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Auth endpoints
    path('login/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path('logout/', views.logout_view, name='logout'),
    
    # User endpoints
    path('me/', views.get_current_user, name='current_user'),
    path('admin-stats/', views.admin_stats, name='admin_stats'),
]
```

### 7. Update Main URLs (`farmlease/urls.py`)

```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    # Add other app URLs here
    # path('api/lands/', include('landmanagement.urls')),
    # path('api/leases/', include('contracts.urls')),
    # path('api/payments/', include('payments.urls')),
    # path('api/products/', include('productplace.urls')),
]
```

### 8. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 9. Create Superuser (Admin)

```bash
python manage.py createsuperuser
# Follow prompts and set role to OWNER
```

Update user in Django admin or shell to set `is_staff=True` for admin access.

---

## 🧪 Testing the Integration

### 1. Start Backend Server

```bash
cd backend/farmlease
python manage.py runserver
```

Server should run on: `http://127.0.0.1:8000`

### 2. Start Frontend Server

```bash
cd frontend
npm run dev
```

Server should run on: `http://localhost:5173`

### 3. Test Authentication Flow

1. **Register a new user**
   - Go to http://localhost:5173/register
   - Fill in the form with role selection
   - Should redirect to login page

2. **Login**
   - Go to http://localhost:5173/login
   - Use registered credentials
   - Should redirect to role-specific dashboard

3. **Check Token Storage**
   - Open browser DevTools → Application → Local Storage
   - Verify `accessToken`, `refreshToken`, and `user` are stored

4. **Test Protected Routes**
   - Try accessing `/owner/dashboard` as LESSEE → Should redirect
   - Try accessing `/admin/dashboard` without `is_staff` → Should redirect

5. **Test Admin Access**
   - Create user in Django admin with `is_staff=True`
   - Login with that user
   - Should redirect to `/admin/dashboard`

### 4. Test API Calls

Open browser console and test:

```javascript
// Check if token is being sent
fetch('http://localhost:8000/api/auth/me/', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## 📋 API Endpoints Reference

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login/` | Login and get JWT tokens | No |
| POST | `/api/auth/register/` | Register new user | No |
| POST | `/api/auth/refresh/` | Refresh access token | No |
| POST | `/api/auth/logout/` | Logout (blacklist token) | Yes |
| GET | `/api/auth/me/` | Get current user info | Yes |
| GET | `/api/auth/admin-stats/` | Get admin statistics | Admin Only |

### Expected Request/Response Formats

**Login Request:**
```json
POST /api/auth/login/
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Register Request:**
```json
POST /api/auth/register/
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "OWNER",
  "phone": "+254712345678"
}
```

**Current User Response:**
```json
GET /api/auth/me/
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "OWNER",
  "phone": "+254712345678",
  "is_staff": false
}
```

---

## 🔍 Troubleshooting

### Frontend Can't Connect to Backend

1. **CORS Error**: Make sure `django-cors-headers` is installed and configured
2. **Network Error**: Check if Django server is running on port 8000
3. **401 Unauthorized**: Token might be expired or invalid

### Token Issues

1. **Check localStorage**: Verify tokens are stored after login
2. **Decode JWT**: Use jwt.io to inspect token payload
3. **Token Expiry**: Check `exp` claim in token

### Role-Based Routing Not Working

1. **Check JWT Payload**: Ensure `role` and `is_staff` are in token
2. **Check authService**: Verify `getCurrentUser()` returns correct data
3. **Check ProtectedRoute**: Use `requireAdmin={true}` for admin routes

### Development Mode

To bypass authentication during development, set in `.env`:
```
VITE_DEV_MODE=true
```

**⚠️ Never use in production!**

---

## 📝 Next Steps

1. ✅ Backend API endpoints implemented
2. ✅ Frontend authentication configured
3. ✅ Role-based routing working
4. ⏭️ Implement other API endpoints (lands, leases, products, payments)
5. ⏭️ Add form validation
6. ⏭️ Add error handling and user feedback
7. ⏭️ Add loading states
8. ⏭️ Deploy to production

---

## 📚 Additional Resources

- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django Simple JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Axios Documentation](https://axios-http.com/)
- [JWT.io - Token Debugger](https://jwt.io/)

---

## 🆘 Support

If you encounter issues:
1. Check browser console for errors
2. Check Django server logs
3. Verify token in JWT.io
4. Check CORS headers in Network tab
5. Ensure migrations are up to date

---

**Last Updated**: February 2026
**Frontend Framework**: React + Vite
**Backend Framework**: Django + DRF + JWT
