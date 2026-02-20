# Admin API Endpoints

Base URL: `/api/auth/`

> Admin endpoints require `IsSystemAdmin` permission — the user must have `role = "admin"` or `is_staff = True`.

---

## Authentication Endpoints (Public / Any User)

### POST `/api/auth/register/`
Register a new user account.

**Permission:** `AllowAny`

**Request Body:**
```json
{
  "email": "user@example.com",
  "phone_number": "0712345678",
  "role": "farmer | landowner | dealer | admin",
  "password": "strongpassword123",
  "password2": "strongpassword123",
  "first_name": "John",
  "last_name": "Doe",
  "address": "123 Main St",
  "county": "Nairobi",
  "id_number": "12345678"
}
```

**Response `201`:**
```json
{
  "id": 1,
  "username": "user",
  "email": "user@example.com",
  "role": "farmer",
  "phone_number": "0712345678",
  ...
}
```

---

### POST `/api/auth/login/`
Authenticate a user and receive JWT tokens with custom claims (`role`, `username`, `email`, `is_staff`).

**Permission:** `AllowAny`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "strongpassword123"
}
```

**Response `200`:**
```json
{
  "access": "<access_token>",
  "refresh": "<refresh_token>"
}
```

---

### POST `/api/auth/refresh/`
Obtain a new access token using a valid refresh token.

**Permission:** `AllowAny`

**Request Body:**
```json
{
  "refresh": "<refresh_token>"
}
```

**Response `200`:**
```json
{
  "access": "<new_access_token>"
}
```

---

## Authenticated Endpoints (Any Logged-in User)

### POST `/api/auth/logout/`
Blacklist the refresh token to invalidate the session.

**Permission:** `IsAuthenticated`

**Request Body:**
```json
{
  "refresh": "<refresh_token>"
}
```

**Response `200`:**
```json
{
  "message": "Logout successful"
}
```

---

### GET `/api/auth/profile/`
Retrieve the current user's profile.

**Permission:** `IsAuthenticated`

**Response `200`:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "name": "John Doe",
  "role": "admin",
  "phone_number": "0712345678",
  "address": "123 Main St",
  "county": "Nairobi",
  "id_number": "12345678",
  "is_verified": true,
  "is_staff": true,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-02-01T00:00:00Z"
}
```

---

### PUT / PATCH `/api/auth/profile/`
Update the current user's profile (full or partial update).

**Permission:** `IsAuthenticated`

**Request Body (partial example):**
```json
{
  "first_name": "Jane",
  "county": "Mombasa"
}
```

**Response `200`:** Updated user object (same shape as GET above).

---

### GET `/api/auth/me/`
Lightweight endpoint to validate token and retrieve basic user info.

**Permission:** `IsAuthenticated`

**Response `200`:** Same user object shape as `GET /api/auth/profile/`.

---

### POST `/api/auth/change-password/`
Change the current user's password.

**Permission:** `IsAuthenticated`

**Request Body:**
```json
{
  "old_password": "currentpassword",
  "new_password": "newsecurepassword123"
}
```

**Response `200`:**
```json
{
  "message": "Password changed successfully"
}
```

**Response `400` (wrong old password):**
```json
{
  "old_password": "Wrong password"
}
```

---

## Admin-Only Endpoints

### GET `/api/auth/admin/`
Retrieve platform-wide statistics for the admin dashboard.

**Permission:** `IsSystemAdmin` (role must be `"admin"` or `is_staff = True`)

**Response `200`:**
```json
{
  "total_farmers": 120,
  "total_landowners": 45,
  "system_revenue_estimate": 0.00
}
```

---

## Role Values Reference

| Value       | Description       |
|-------------|-------------------|
| `farmer`    | Lessee / Farmer   |
| `landowner` | Farm Owner        |
| `dealer`    | Agro-Dealer       |
| `admin`     | Administrator     |
