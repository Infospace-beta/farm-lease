# Farm Owner API Endpoints

Base URL: `/api/land/`

> All endpoints require `IsAuthenticated`. Land-specific endpoints additionally enforce ownership — land must belong to the requesting user.

---

## Land Listing (3-Step Creation Flow)

### STEP 1 — POST `/api/land/create-basic/`
Create a new land listing with basic information. Returns the `land_id` to be used in Steps 2 and 3.

**Permission:** `IsAuthenticated`

**Request Body (`application/json`):**
```json
{
  "title": "Fertile Farm in Nakuru",
  "description": "Well-drained red soil, suitable for maize and wheat.",
  "total_area": "10.50",
  "price_per_month": "15000.00",
  "preferred_duration": "6 months",
  "title_deed_number": "TD-00123",
  "has_irrigation": true,
  "has_electricity": false,
  "has_road_access": true,
  "has_fencing": false,
  "latitude": "-0.303099",
  "longitude": "36.080026"
}
```

> `title_deed_number` is optional and only visible to the owner and admin users.

**Response `201`:**
```json
{
  "land_id": 7
}
```

---

### STEP 2 — POST `/api/land/<land_id>/add-soil/`
Add soil and climate data to an existing land listing.

**Permission:** `IsAuthenticated` + must be the land owner

**URL Parameter:** `land_id` — ID returned from Step 1

**Request Body (`application/json`):**
```json
{
  "ph_level": 6.5,
  "nitrogen": 0.35,
  "phosphorus": 0.12,
  "potassium": 0.28,
  "moisture": 42.0,
  "temperature": 22.5,
  "rainfall": 800.0
}
```

**Response `201`:**
```json
{
  "message": "Soil data added successfully"
}
```

**Response `404`:**
```json
{
  "error": "Land not found"
}
```

---

### STEP 3 — POST `/api/land/<land_id>/upload-photos/`
Upload one or more photos for a land listing.

**Permission:** `IsAuthenticated` + must be the land owner

**URL Parameter:** `land_id` — ID returned from Step 1

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Field    | Type   | Description                         |
|----------|--------|-------------------------------------|
| `images` | `File` | One or more image files (repeatable)|

**Example (curl):**
```bash
curl -X POST http://localhost:8000/api/land/7/upload-photos/ \
  -H "Authorization: Bearer <token>" \
  -F "images=@photo1.jpg" \
  -F "images=@photo2.jpg"
```

**Response `201`:**
```json
{
  "message": "2 images uploaded successfully"
}
```

**Response `400` (no files sent):**
```json
{
  "error": "No images provided"
}
```

**Response `404`:**
```json
{
  "error": "Land not found"
}
```

---

## Dashboard

### GET `/api/land/ownerdashboard/`
Retrieve summary statistics for the authenticated land owner's dashboard.

**Permission:** `IsAuthenticated`

**Response `200`:**
```json
{
  "active_leases": 3,
  "pending_approvals": 2,
  "total_valuation": "Ksh 45.2M",
  "monthly_revenue": "Ksh 450k"
}
```

| Field               | Description                                       |
|---------------------|---------------------------------------------------|
| `active_leases`     | Number of land listings with status `"Leased"`   |
| `pending_approvals` | Number of listings not yet verified by admin (`is_verified = false`) |
| `total_valuation`   | Placeholder — estimated total land value          |
| `monthly_revenue`   | Placeholder — estimated monthly income            |

---

## Land Listing Field Reference

| Field                | Type      | Required | Notes                              |
|----------------------|-----------|----------|------------------------------------|
| `title`              | string    | Yes      |                                     |
| `description`        | text      | Yes      |                                     |
| `total_area`         | decimal   | Yes      | In acres                           |
| `price_per_month`    | decimal   | Yes      | In KES                             |
| `preferred_duration` | string    | Yes      | e.g. `"6 months"`, `"1 year"`      |
| `title_deed_number`  | string    | No       | Visible to owner and admin only    |
| `has_irrigation`     | boolean   | No       | Default `false`                    |
| `has_electricity`    | boolean   | No       | Default `false`                    |
| `has_road_access`    | boolean   | No       | Default `false`                    |
| `has_fencing`        | boolean   | No       | Default `false`                    |
| `latitude`           | decimal   | Yes      | 6 decimal places                   |
| `longitude`          | decimal   | Yes      | 6 decimal places                   |

**Read-only fields (set by server):**

| Field         | Description                                   |
|---------------|-----------------------------------------------|
| `owner`       | Set to the authenticated user automatically   |
| `status`      | Defaults to `"Vacant"`; updated by admin/lease flow |
| `is_verified` | Defaults to `false`; set to `true` by admin   |
| `created_at`  | Auto-set on creation                          |
