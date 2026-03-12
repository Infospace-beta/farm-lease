# Land Verification Integration: Admin ↔ Owner

## Overview
This document explains how the Admin's Land Verification page is linked with the Owner's land submission system, enabling a seamless verification workflow.

---

## 🔄 Complete Workflow

### 1. Owner Submits Land Listing

**Steps:**
1. Owner navigates to `/owner/lands/add`
2. Completes the 3-step land listing form:
   - **Step 1:** Basic information (title, description, area, price, title deed number, etc.)
   - **Step 2:** Soil & climate data (optional)
   - **Step 3:** Upload photos (optional)
3. Upon submission, the land is created with:
   ```json
   {
     "status": "Under_Review",
     "is_verified": false,
     "is_flagged": false
   }
   ```

**Endpoint Used:** 
- `POST /api/land/create-basic/`
- `POST /api/land/<land_id>/add-soil/`
- `POST /api/land/<land_id>/upload-photos/`

**What Happens:**
- Land appears in Owner's "My Lands" page with "Under Review" status
- Land is **NOT visible** to lessees (not in public listings)
- Admin receives the land in their verification queue

---

### 2. Admin Views Pending Lands

**Location:** Admin Dashboard → Land Verifications page (`/admin/land-verifications`)

**How It Works:**
1. Admin page fetches lands using:
   ```typescript
   landsApi.adminAllLands('pending')  // Fetches only pending lands
   ```
2. Backend endpoint: `GET /api/land/admin/all/?filter=pending`
3. Returns all lands where:
   ```python
   is_verified=False AND is_flagged=False
   ```

**Admin Can See:**
- Complete land details including **title deed number** (hidden from public)
- Owner information (username, email)
- Submission timestamp
- All photos and soil data

**Available Filters:**
- `All` — View all lands
- `Pending` — Only lands awaiting verification
- `Verified` — Only verified lands  
- `Flagged` — Only flagged lands

---

### 3. Admin Makes Decision

#### Option A: ✅ Verify Land

**Action:** Admin clicks "Verify Property" button

**API Call:**
```typescript
landsApi.verifyLand(landId)  // POST /api/land/admin/<land_id>/verify/
```

**Backend Updates:**
```python
land.is_verified = True
land.is_flagged = False
land.flag_reason = None
land.status = 'Vacant'  # ← KEY CHANGE: Status becomes Vacant
land.save()
```

**Results:**
1. ✅ Land status changes to **"Vacant"**
2. ✅ Land becomes visible in public listings (`/api/land/browse/`)
3. ✅ Lessees can now see and lease the land
4. ✅ Owner receives verification success notification
5. ✅ Owner sees "Vacant" status in their dashboard

---

#### Option B: ⚠️ Flag Land

**Action:** Admin clicks "Flag" and provides a reason

**API Call:**
```typescript
landsApi.flagLand(landId, reason)  // POST /api/land/admin/<land_id>/flag/
```

**Backend Updates:**
```python
land.is_flagged = True
land.is_verified = False
land.flag_reason = reason  # e.g., "Title deed number mismatch"
land.save()
```

**Results:**
1. ⚠️ Land remains hidden from public
2. ⚠️ Owner receives notification with flag reason
3. ⚠️ Land shows "Flagged" status in owner's dashboard
4. ⚠️ Owner can view the reason and make corrections

---

### 4. Owner Sees Updated Status

**How Owner Checks Status:**

1. **Dashboard:** `/owner/dashboard`
   - Fetches: `GET /api/land/ownerdashboard/`
   - Shows stats: pending verifications, vacant lands, etc.

2. **My Lands Page:** `/owner/lands`
   - Fetches: `GET /api/land/my-lands/`
   - Displays all lands with current status badges

**Status Display Examples:**

```tsx
// Verified Land
{
  "id": 7,
  "title": "Fertile Farm in Nakuru",
  "status": "Vacant",        // ✅ Ready for lease
  "is_verified": true,
  "is_flagged": false
}

// Pending Land
{
  "id": 8,
  "title": "Highland Plot",
  "status": "Under_Review",  // ⏳ Awaiting admin
  "is_verified": false,
  "is_flagged": false
}

// Flagged Land
{
  "id": 9,
  "title": "Valley Land",
  "status": "Under_Review",  // ⚠️ Needs correction
  "is_verified": false,
  "is_flagged": true,
  "flag_reason": "Title deed number does not match registry"
}
```

**Status Badges on Frontend:**
- 🟢 **Vacant** — Green badge, land is verified and available
- 🔵 **Under Review** — Blue badge, pending admin verification
- 🟡 **Pending Payment** — Yellow badge, lease approved
- ⚫ **Leased** — Gray badge, currently rented
- 🔴 **Flagged** — Red badge with reason displayed

---

## 📡 API Endpoints Summary

### Admin Endpoints

| Method | Endpoint                           | Purpose                          |
|--------|------------------------------------|----------------------------------|
| GET    | `/api/land/admin/all/`             | Fetch all lands (with filters)   |
| GET    | `/api/land/admin/all/?filter=pending` | Fetch only pending lands      |
| GET    | `/api/land/admin/stats/`           | Get verification statistics      |
| POST   | `/api/land/admin/<id>/verify/`     | Verify land (status → Vacant)    |
| POST   | `/api/land/admin/<id>/flag/`       | Flag land with reason            |

### Owner Endpoints

| Method | Endpoint                      | Purpose                              |
|--------|-------------------------------|--------------------------------------|
| POST   | `/api/land/create-basic/`     | Create land listing (Step 1)         |
| POST   | `/api/land/<id>/add-soil/`    | Add soil data (Step 2)               |
| POST   | `/api/land/<id>/upload-photos/` | Upload photos (Step 3)             |
| GET    | `/api/land/my-lands/`         | Fetch owner's lands with status      |
| GET    | `/api/land/ownerdashboard/`   | Get dashboard stats                  |

---

## 🔑 Key Changes Made

### 1. Backend (Django)

#### `landmanagement/views.py`
- ✅ Added query filter support to `admin_land_list()`:
  ```python
  filter_type = request.query_params.get('filter', 'all')
  if filter_type == 'pending':
      lands = lands.filter(is_verified=False, is_flagged=False)
  ```
- ✅ `verify_land()` now sets `status='Vacant'` after verification

#### `landmanagement/serializers.py`
- ✅ Completed `AdminLandListingSerializer` with all fields including `status`

#### `landmanagement/models.py`
- ✅ Default status is `'Under_Review'` (already set)

---

### 2. Frontend (Next.js)

#### `lib/services/api.ts`
- ✅ Updated `adminAllLands()` to accept filter parameter:
  ```typescript
  adminAllLands: (filter?: "all" | "pending" | "verified" | "flagged") =>
    api.get("/lands/admin/all/", { params: filter ? { filter } : {} })
  ```

#### `admin/land-verifications/page.tsx`
- ✅ Updated `handleVerify()` to set `status: 'Vacant'` in local state
- ✅ Enhanced toast message to confirm status update

#### `owner/lands/page.tsx`
- ✅ Already displays status with proper badges
- ✅ Automatically shows updated status on refresh

---

### 3. Documentation

#### `ADMIN_ENDPOINTS.md`
- ✅ Added detailed Land Verification Endpoints section
- ✅ Documented query filter parameters
- ✅ Explained complete verification workflow

#### `OWNER_ENDPOINTS.md`
- ✅ Added Land Status Workflow section
- ✅ Documented status field values and meanings
- ✅ Explained owner's view of the verification process

---

## 🎯 Status Field Values

| Status          | Owner View                    | Lessee View      | Meaning                          |
|-----------------|-------------------------------|------------------|----------------------------------|
| `Under_Review`  | Blue "Under Review" badge     | Hidden           | Awaiting admin verification      |
| `Vacant`        | Green "Vacant" badge          | Visible          | Verified and available for lease |
| `Pending_Payment` | Yellow "Pending Payment" badge | Hidden         | Lease approved, awaiting payment |
| `Leased`        | Gray "Leased" badge           | Hidden           | Currently rented to a farmer     |

---

## 🚀 How to Test

### Test the Complete Flow

1. **As Owner:**
   ```bash
   # Login as land owner
   POST /api/auth/login/
   
   # Create a land listing
   POST /api/land/create-basic/
   # Response: { "land_id": 123 }
   
   # Check status (should be "Under_Review")
   GET /api/land/my-lands/
   ```

2. **As Admin:**
   ```bash
   # Login as admin
   POST /api/auth/login/
   
   # View pending lands
   GET /api/land/admin/all/?filter=pending
   
   # Verify the land
   POST /api/land/admin/123/verify/
   ```

3. **As Owner Again:**
   ```bash
   # Refresh lands list
   GET /api/land/my-lands/
   # Status should now be "Vacant", is_verified: true
   ```

4. **As Lessee:**
   ```bash
   # Browse available lands
   GET /api/land/browse/
   # The verified land should now appear in the list
   ```

---

## ✅ Benefits of This Integration

1. **Automated Status Updates** — Admin verification automatically changes status to "Vacant"
2. **Real-time Visibility** — Owner sees status changes immediately upon refresh
3. **Efficient Filtering** — Admin can focus on pending lands only
4. **Clear Communication** — Flag reasons notify owners of required corrections
5. **Public Listing Control** — Only verified lands appear to lessees
6. **Audit Trail** — All status changes are tracked with timestamps

---

## 📝 Notes

- **Automatic Refresh:** Owner must refresh the page to see status updates (consider adding WebSocket notifications in the future)
- **Title Deed Security:** Only admin can see title deed numbers; hidden from public and lessees
- **Notification System:** Backend sends notifications to owners on verification/flagging (check `owner_notifications` endpoint)
- **Bulk Actions:** Admin can batch verify/flag multiple lands (future enhancement)

---

## 🔗 Related Files

- Backend API: `backend/farmlease/landmanagement/views.py`
- Models: `backend/farmlease/landmanagement/models.py`
- Serializers: `backend/farmlease/landmanagement/serializers.py`
- Admin Frontend: `frontend/src/app/(main)/admin/land-verifications/page.tsx`
- Owner Frontend: `frontend/src/app/(main)/owner/lands/page.tsx`
- API Service: `frontend/src/lib/services/api.ts`

---

**Last Updated:** February 25, 2026
**Integration Status:** ✅ Complete and Functional
