# 🌾 FarmLease

A full-stack agricultural land leasing marketplace that connects farmers, landowners, agro-dealers, and administrators on a single platform. Built with **Next.js 15** and **Django REST Framework**.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Reference](#api-reference)
  - [Authentication](#authentication)
  - [Land Management](#land-management)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

FarmLease is a multi-role marketplace designed for the agricultural sector. Landowners list their farmland with detailed soil and climate data, farmers browse and lease land with AI-powered insights, agro-dealers sell farming products, and administrators oversee the entire platform.

### User Roles

| Role | Description |
|------|-------------|
| **Farmer (Lessee)** | Browse, compare, and lease available farmland |
| **Landowner** | List and manage farmland, track leases and revenue |
| **Agro-Dealer** | Sell agricultural products and services |
| **Admin** | Verify land listings, manage disputes, view analytics |

---

## Features

### Landowners
- **3-step land listing** — basic info → soil/climate data → photo uploads
- Dashboard with active leases, pending approvals, total valuation, and revenue
- Lease request and agreement management
- Escrow and financials tracking

### Farmers
- Browse and search available farmland
- Interactive maps with Leaflet
- Side-by-side land comparison
- AI crop-yield predictor
- Agro-dealer marketplace for farming products
- Lease and payment tracking
- Notification center

### Admins
- Platform-wide analytics dashboard
- Land listing verification workflow
- User management across all roles
- Dispute resolution
- Dealer oversight

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15.1.7 | React framework with App Router |
| React | 19.0.0 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Tailwind CSS | 4.2.0 | Utility-first styling |
| Axios | 1.7.9 | HTTP client with JWT interceptors |
| React-Leaflet | 5.0.0 | Interactive maps |
| Recharts | 3.7.0 | Data visualization |
| React Hook Form | 7.54.2 | Form handling |
| Yup | 1.6.1 | Schema validation |

### Backend

| Technology | Version | Purpose |
|-----------|---------|---------|
| Django | 5.2.11 | Web framework |
| Django REST Framework | 3.16.1 | REST API |
| Simple JWT | 5.5.1 | JWT authentication |
| SQLite | — | Default database (PostgreSQL-ready) |
| Pillow | 12.1.1 | Image processing |
| django-cors-headers | 4.9.0 | Cross-origin requests |
| django-filter | 25.2 | API filtering and search |

---

## Project Structure

```
farm-lease/
├── frontend/                       # Next.js application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/             # Login & signup pages
│   │   │   ├── (main)/
│   │   │   │   ├── admin/          # Admin dashboard, analytics, verifications
│   │   │   │   ├── owner/          # Land management, leases, financials
│   │   │   │   ├── lessee/         # Browse, compare, AI predictor, shop
│   │   │   │   └── dealer/         # Agro-dealer dashboard
│   │   │   └── api/                # Next.js API routes
│   │   ├── components/             # Reusable UI & role-specific components
│   │   ├── lib/                    # Auth helpers, API client, utilities
│   │   ├── types/                  # TypeScript type definitions
│   │   └── constants/              # Application constants
│   ├── public/                     # Static assets
│   └── package.json
│
├── backend/
│   ├── farmlease/                  # Django project
│   │   ├── farmlease/              # Project settings & root URL config
│   │   ├── accounts/               # Custom User model, auth views, permissions
│   │   ├── landmanagement/         # Land listings, soil data, images
│   │   ├── contracts/              # Lease agreements (stub)
│   │   ├── payments/               # Payment processing (stub)
│   │   └── productplace/           # Agro-dealer products (stub)
│   ├── requirements.txt
│   ├── ADMIN_ENDPOINTS.md          # Admin API documentation
│   └── OWNER_ENDPOINTS.md          # Landowner API documentation
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Python** 3.8+
- **Node.js** 18+
- **npm** (or yarn / pnpm)

### Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
cd farmlease
python manage.py migrate

# Create an admin user
python manage.py createsuperuser

# Start the development server
python manage.py runserver      # http://localhost:8000
```

The Django admin panel is available at `http://localhost:8000/admin/`.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev                     # http://localhost:3000
```

**Other commands:**

```bash
npm run build       # Production build
npm start           # Start production server
npm run lint        # Run ESLint
```

---

## API Reference

All API endpoints are prefixed with `/api/`. Full request/response examples are available in [`backend/ADMIN_ENDPOINTS.md`](backend/ADMIN_ENDPOINTS.md) and [`backend/OWNER_ENDPOINTS.md`](backend/OWNER_ENDPOINTS.md).

### Authentication

Base path: `/api/auth/`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register/` | Public | Register a new user |
| POST | `/login/` | Public | Login and receive JWT tokens |
| POST | `/refresh/` | Public | Refresh an access token |
| POST | `/logout/` | Required | Blacklist a refresh token |
| GET | `/profile/` | Required | Get current user profile |
| PUT/PATCH | `/profile/` | Required | Update user profile |
| GET | `/me/` | Required | Validate token and get user info |
| POST | `/change-password/` | Required | Change password |
| GET | `/admin/` | Admin | Admin dashboard statistics |

### Land Management

Base path: `/api/land/`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/create-basic/` | Required | Step 1 — Create a land listing |
| POST | `/<id>/add-soil/` | Owner | Step 2 — Add soil and climate data |
| POST | `/<id>/upload-photos/` | Owner | Step 3 — Upload land photos |
| GET | `/ownerdashboard/` | Required | Get owner dashboard statistics |

---

## Database Schema

### User

| Field | Type | Notes |
|-------|------|-------|
| email | EmailField | Unique |
| username | CharField | Unique |
| phone_number | CharField | Unique |
| role | CharField | `farmer`, `landowner`, `dealer`, or `admin` |
| id_number | CharField | Unique, optional |
| address, county | CharField | — |
| profile_picture | ImageField | Optional |
| is_verified | BooleanField | — |

### LandListing

| Field | Type | Notes |
|-------|------|-------|
| owner | ForeignKey → User | CASCADE |
| title, description | CharField / TextField | — |
| total_area | DecimalField | Acres |
| price_per_month | DecimalField | KES |
| preferred_duration | CharField | — |
| title_deed_number | CharField | Visible to owner & admin only |
| has_irrigation, has_electricity, has_road_access, has_fencing | BooleanField | Amenities |
| latitude, longitude | DecimalField | 6 decimal places |
| status | CharField | Default: `Vacant` |
| is_verified | BooleanField | Admin-controlled |

### SoilClimateData

One-to-one with `LandListing`. Fields: `ph_level`, `nitrogen`, `phosphorus`, `potassium`, `moisture`, `temperature`, `rainfall`.

### LandImage

Many-to-one with `LandListing`. Stores uploaded photos in `media/land_photos/`.

---

## Authentication & Authorization

FarmLease uses **JWT (JSON Web Tokens)** for stateless authentication:

1. **Register** — `POST /api/auth/register/` with role selection
2. **Login** — `POST /api/auth/login/` returns `access` and `refresh` tokens
3. **Authenticated requests** — include `Authorization: Bearer <access_token>` header
4. **Token refresh** — `POST /api/auth/refresh/` when the access token expires
5. **Logout** — `POST /api/auth/logout/` blacklists the refresh token

| Setting | Value |
|---------|-------|
| Access token lifetime | 1 hour |
| Refresh token lifetime | 7 days |
| Algorithm | HS256 |
| Token rotation | Enabled |

**Role-based access control** is enforced via custom Django permission classes (`IsSystemAdmin`) and frontend route guards that check the user's role from the decoded JWT.

---

## Environment Variables

### Backend (`backend/.env`)

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is available as open source. See the repository for license details.
