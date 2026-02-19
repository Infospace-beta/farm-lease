# Quick Start Guide for Frontend-Backend Integration

## Prerequisites

- Python 3.8+
- Node.js 16+
- Django 4.2+
- npm or yarn

## Step 1: Backend Setup

### Install Django Dependencies

```bash
cd backend/farmlease
pip install djangorestframework djangorestframework-simplejwt django-cors-headers
```

### Update requirements.txt

```bash
pip freeze > requirements.txt
```

### Configure Backend Files

Follow the instructions in `FRONTEND_BACKEND_INTEGRATION.md` to:
1. Update `settings.py` with REST Framework and JWT configuration
2. Create User model in `accounts/models.py`
3. Create serializers in `accounts/serializers.py`
4. Create views in `accounts/views.py`
5. Create URL patterns in `accounts/urls.py`
6. Update main `urls.py`

### Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Create Superuser

```bash
python manage.py createsuperuser
```

Enter:
- Email: admin@farmlease.com
- Username: admin
- Password: (your choice)

Then in Django shell or admin panel, set:
- role: 'OWNER'
- is_staff: True
- is_superuser: True

### Start Backend Server

```bash
python manage.py runserver
```

Backend should now be running at: http://127.0.0.1:8000

---

## Step 2: Frontend Setup

### Install Dependencies (Already Done)

```bash
cd ../../frontend
npm install
```

Note: `jwt-decode` has already been installed.

### Configure Environment

```bash
# Copy example env file
cp .env.example .env
```

Edit `.env` if you need to change the API URL:
```
VITE_API_BASE_URL=http://127.0.0.1:8000/api
VITE_DEV_MODE=false
```

### Start Frontend Server

```bash
npm run dev
```

Frontend should now be running at: http://localhost:5173

---

## Step 3: Test the Connection

### 1. Open Browser

Navigate to: http://localhost:5173

### 2. Register a New User

- Click "Get Started" or go to `/register`
- Select a role (Farm Owner, Lessee, or Dealer)
- Fill in the form
- Click "Register"

### 3. Login

- Use the credentials you just created
- You should be redirected to the appropriate dashboard based on your role

### 4. Test Admin Access

- Login with the superuser account you created
- You should be redirected to `/admin/dashboard`
- The navbar should show "Admin" as your role

### 5. Verify Token Storage

Open DevTools → Application → Local Storage:
- `accessToken` - JWT token
- `refreshToken` - Refresh token
- `user` - User object with role and is_staff

---

## What's Already Configured (Frontend)

✅ Axios instance with JWT interceptor
✅ Token refresh on 401 errors
✅ JWT decoding to extract user info
✅ Role-based routing with ProtectedRoute
✅ Admin-only routes checking is_staff
✅ Login/Register/Logout functionality
✅ Auth context with user state
✅ Navbar showing user role

---

## Common Issues & Solutions

### CORS Error

**Problem**: Frontend can't connect to backend
**Solution**: Ensure django-cors-headers is installed and configured in settings.py

### 401 Unauthorized

**Problem**: All API requests fail with 401
**Solution**: Check if token is stored in localStorage and is valid at jwt.io

### Role Routing Not Working

**Problem**: Can access routes that should be restricted
**Solution**: Verify JWT token includes role and is_staff claims

### Token Expired

**Problem**: Logged out automatically
**Solution**: Token refresh should happen automatically. Check apiClient.js interceptor

---

## File Structure

```
FarmLease/
├── backend/
│   └── farmlease/
│       ├── manage.py
│       ├── accounts/          ← Authentication app
│       │   ├── models.py      ← User model
│       │   ├── views.py       ← API endpoints
│       │   ├── serializers.py ← Data serializers
│       │   └── urls.py        ← URL routing
│       └── farmlease/
│           ├── settings.py    ← Django config
│           └── urls.py        ← Main URL config
│
├── frontend/
│   ├── .env.example           ← Environment variables template
│   ├── src/
│   │   ├── services/
│   │   │   ├── apiClient.js   ← Axios config with JWT
│   │   │   └── authService.js ← Auth functions
│   │   ├── context/
│   │   │   └── AuthContext.jsx ← Auth state management
│   │   ├── components/
│   │   │   └── common/
│   │   │       └── ProtectedRoute.jsx ← Role-based routing
│   │   └── pages/
│   │       ├── auth/          ← Login/Register pages
│   │       └── admin/         ← Admin dashboard
│   └── package.json
│
├── FRONTEND_BACKEND_INTEGRATION.md  ← Full integration guide
└── QUICK_START.md                    ← This file
```

---

## Next Steps

After successfully connecting frontend and backend:

1. **Implement Land Management APIs**
   - Create API endpoints for lands (CRUD)
   - Connect to frontend land pages

2. **Implement Contract/Lease APIs**
   - Create lease management endpoints
   - Connect to lease request pages

3. **Implement Product Marketplace APIs**
   - Create product CRUD endpoints
   - Connect to dealer pages

4. **Implement Payment APIs**
   - Create payment endpoints
   - Integrate M-Pesa or payment gateway

5. **Add Real Data**
   - Replace mock data in dashboards
   - Connect all pages to real APIs

---

## Useful Commands

**Backend:**
```bash
# Run server
python manage.py runserver

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Django shell
python manage.py shell
```

**Frontend:**
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can register a new user
- [ ] Can login with registered user
- [ ] Token is stored in localStorage
- [ ] Redirects to correct dashboard based on role
- [ ] Can logout successfully
- [ ] Admin user can access `/admin/dashboard`
- [ ] Non-admin users cannot access admin routes
- [ ] Navbar shows correct user info and role
- [ ] Protected routes redirect to login when not authenticated

---

## Support

For detailed information, see:
- `FRONTEND_BACKEND_INTEGRATION.md` - Complete integration guide
- `frontend/README.md` - Frontend documentation
- Django REST Framework docs: https://www.django-rest-framework.org/

---

**Happy Coding! 🚀**
