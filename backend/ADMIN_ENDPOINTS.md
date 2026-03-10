# Admin API Endpoints

Base URL: `/api/auth/`

> Admin endpoints require `IsSystemAdmin` permission — the user must have `role = "admin"` or `is_staff = True`.

---

## Land Verification Endpoints

### GET `/api/land/admin/all/`
Retrieve all land listings with full details (including title deed numbers) for admin review.

**Permission:** `IsSystemAdmin` (admin or staff users only)

**Query Parameters:**
- `filter` (optional): Filter lands by status
  - `all` (default) — Return all lands
  - `pending` — Only lands awaiting verification (`is_verified=false` and `is_flagged=false`)
  - `verified` — Only verified lands (`is_verified=true`)
  - `flagged` — Only flagged lands (`is_flagged=true`)

**Request Example:**
```bash
GET /api/land/admin/all/?filter=pending
Authorization: Bearer <admin_access_token>
```

**Response `200`:**
```json
[
  {
    "id": 7,
    "owner": 12,
    "owner_username": "john_farmer",
    "owner_email": "john@example.com",
    "title": "Fertile Farm in Nakuru",
    "description": "Well-drained red soil...",
    "total_area": "10.50",
    "price_per_month": "15000.00",
    "preferred_duration": "6 months",
    "title_deed_number": "TD-00123",
    "has_irrigation": true,
    "has_electricity": false,
    "has_road_access": true,
    "has_fencing": false,
    "location_name": "Nakuru County",
    "latitude": "-0.303099",
    "longitude": "36.080026",
    "status": "Under_Review",
    "is_verified": false,
    "is_flagged": false,
    "flag_reason": null,
    "current_lessee": null,
    "created_at": "2026-02-20T10:30:00Z",
    "soil_data": { ... },
    "images": [...]
  }
]
```

---

### POST `/api/land/admin/<land_id>/verify/`
Verify a land listing, marking it as approved and changing status to "Vacant".

**Permission:** `IsSystemAdmin`

**URL Parameter:** `land_id` — ID of the land to verify

**Request:**
```bash
POST /api/land/admin/7/verify/
Authorization: Bearer <admin_access_token>
```

**Response `200`:**
```json
{
  "message": "Land 'Fertile Farm in Nakuru' verified successfully."
}
```

**What it does:**
- Sets `is_verified = true`
- Sets `is_flagged = false`
- Clears `flag_reason`
- **Updates `status` to `'Vacant'`** — making it visible to lessees
- Sends notification to the land owner

---

### POST `/api/land/admin/<land_id>/flag/`
Flag a land listing for issues requiring owner correction.

**Permission:** `IsSystemAdmin`

**URL Parameter:** `land_id` — ID of the land to flag

**Request Body:**
```json
{
  "reason": "Title deed number does not match land registry records. Please verify and resubmit."
}
```

**Response `200`:**
```json
{
  "message": "Land 'Fertile Farm in Nakuru' flagged.",
  "reason": "Title deed number does not match..."
}
```

**What it does:**
- Sets `is_flagged = true`
- Sets `is_verified = false`
- Stores the `reason` in `flag_reason`
- Sends notification to the land owner with the reason

---

### GET `/api/land/admin/stats/`
Retrieve aggregated statistics for the admin dashboard.

**Permission:** `IsSystemAdmin`

**Response `200`:**
```json
{
  "total_lands": 45,
  "pending_verification": 12,
  "verified": 30,
  "flagged": 3
}
```

---

## Land Verification Workflow

### 1. Owner Creates Land Listing
When an owner creates a new land listing (via `/api/land/create-basic/`):
- Land is created with `status = "Under_Review"`
- `is_verified = false` (pending admin verification)
- Owner sees "Pending Verification" on their dashboard

### 2. Admin Reviews Land
Admin accesses the Land Verification page:
- Fetches pending lands: `GET /api/land/admin/all/?filter=pending`
- Reviews title deed number and other details
- Can cross-check with land registry

### 3. Admin Decision
**Option A — Verify:**
- `POST /api/land/admin/<land_id>/verify/`
- Land status changes to `"Vacant"`
- Land becomes visible in public listings for lessees
- Owner receives verification notification

**Option B — Flag:**
- `POST /api/land/admin/<land_id>/flag/` with reason
- Land remains hidden from public
- Owner receives notification with correction instructions
- Owner can update and resubmit

### 4. Owner Sees Update
- Owner dashboard shows updated status
- Verified lands display as "Vacant"
- Flagged lands show the flag reason
- Owner can view lands at `/api/land/my-lands/`

---

## Status Field Reference

| Status Value      | Meaning                                  |
|-------------------|------------------------------------------|
| `Under_Review`    | Newly created, pending admin verification|
| `Vacant`          | Verified and available for lease        |
| `Pending_Payment` | Lease approved, awaiting payment         |
| `Leased`          | Currently leased to a farmer             |

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
