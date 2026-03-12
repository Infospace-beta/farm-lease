# Land Verification Flow & Image Display Fix

**Date:** March 3, 2026  
**Status:** ✅ Complete

## Overview
This document explains how the land verification system works and documents the image display issue that was fixed.

## Verification Flow

### 1. Land Creation (Owner)
- **Endpoint:** `/api/lands/create-basic/`
- **Status:** `Under_Review`
- **Verified:** `false`
- **Frontend:** [http://localhost:3000/owner/lands](http://localhost:3000/owner/lands)

When an owner creates a land listing, it starts with:
- `status = 'Under_Review'`
- `is_verified = False`
- `is_flagged = False`

### 2. Admin Verification
- **Frontend:** [http://localhost:3000/admin/land-verifications](http://localhost:3000/admin/land-verifications)
- **List Endpoint:** `/api/lands/admin/all/` (with optional filter query param)
- **Verify Endpoint:** `/api/lands/admin/{land_id}/verify/`
- **Flag Endpoint:** `/api/lands/admin/{land_id}/flag/`

#### Admin Actions:

**Verify Land:**
```
POST /api/lands/admin/{land_id}/verify/
```
Sets:
- `is_verified = True`
- `is_flagged = False`
- `flag_reason = None`
- `status = 'Vacant'` ← **Key: Makes land available for lessees**

**Flag Land:**
```
POST /api/lands/admin/{land_id}/flag/
Body: { "reason": "..." }
```
Sets:
- `is_flagged = True`
- `is_verified = False`
- `flag_reason = "..."`

### 3. Lessee Browse (Find Land)
- **Frontend:** [http://localhost:3000/lessee/browse](http://localhost:3000/lessee/browse)
- **Endpoint:** `/api/lands/browse/`

**Filter Logic:**
```python
LandListing.objects.filter(
    is_verified=True,  # Must be verified by admin
    status='Vacant'     # Must be available
)
```

✅ **Connection Verified:** Only lands that have been verified by the admin AND have status 'Vacant' will appear in the lessee's browse page.

## Image Display Issue - FIXED ✅

### The Problem
Images were not displaying on the lessee browse page (`/lessee/browse`).

### Root Cause
The `browse_land` view in `backend/farmlease/landmanagement/views.py` was not passing the request context to the serializer:

**Before (Buggy):**
```python
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def browse_land(request):
    lands = LandListing.objects.filter(
        is_verified=True, status='Vacant'
    ).select_related('soil_data').prefetch_related('images')
    serializer = PublicLandListingSerializer(lands, many=True)  # ❌ No context
    return Response(serializer.data)
```

### The Fix
Added `context={'request': request}` to the serializer:

**After (Fixed):**
```python
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def browse_land(request):
    lands = LandListing.objects.filter(
        is_verified=True, status='Vacant'
    ).select_related('soil_data').prefetch_related('images')
    serializer = PublicLandListingSerializer(
        lands, many=True, context={'request': request}  # ✅ Context added
    )
    return Response(serializer.data)
```

### Why This Works
When the serializer has the request context, Django Rest Framework's `ImageField` automatically converts relative paths to full URLs:

- **Without context:** `"image": "land_photos/farm123.jpg"`
- **With context:** `"image": "http://localhost:8000/media/land_photos/farm123.jpg"`

The frontend can now properly display images using the full URL.

## Endpoint Status Summary

| Endpoint | Request Context | Images Display |
|----------|----------------|----------------|
| `/api/lands/my-lands/` (Owner) | ✅ Yes | ✅ Working |
| `/api/lands/admin/all/` (Admin) | ✅ Yes | ✅ Working |
| `/api/lands/browse/` (Lessee) | ✅ Fixed | ✅ Fixed |

## Frontend Pages

### Owner Lands
- **URL:** [http://localhost:3000/owner/lands](http://localhost:3000/owner/lands)
- **API:** `/api/lands/my-lands/`
- **Shows:** All lands owned by the logged-in user
- **Images:** ✅ Working

### Admin Land Verifications
- **URL:** [http://localhost:3000/admin/land-verifications](http://localhost:3000/admin/land-verifications)
- **API:** `/api/lands/admin/all/`
- **Actions:**
  - Verify land → Makes it appear in lessee browse
  - Flag land → Hides it and notifies owner
- **Filters:** All, Pending, Verified, Flagged

### Lessee Browse
- **URL:** [http://localhost:3000/lessee/browse](http://localhost:3000/lessee/browse)
- **API:** `/api/lands/browse/`
- **Shows:** Only verified AND vacant lands
- **Images:** ✅ Fixed

## Testing Checklist

- [x] Verify endpoints are properly connected
- [x] Fix image display in browse_land view
- [x] Confirm owner lands show images
- [x] Confirm admin page can view lands
- [x] Confirm lessee browse filters correctly
- [x] Confirm verification flow works end-to-end

## How to Test

1. **As Owner:** Create a land listing at `/owner/lands`
2. **As Admin:** 
   - Go to `/admin/land-verifications`
   - Verify the new land listing
   - Confirm status changes to "Vacant"
3. **As Lessee:**
   - Go to `/lessee/browse`
   - Confirm the verified land appears
   - Confirm images display correctly

## Related Files

### Backend
- `backend/farmlease/landmanagement/views.py` - Main views (FIXED)
- `backend/farmlease/landmanagement/models.py` - Land models
- `backend/farmlease/landmanagement/serializers.py` - API serializers
- `backend/farmlease/landmanagement/urls.py` - URL routing

### Frontend
- `frontend/src/app/(main)/owner/lands/page.tsx` - Owner lands page
- `frontend/src/app/(main)/admin/land-verifications/page.tsx` - Admin verification page
- `frontend/src/app/(main)/lessee/browse/page.tsx` - Lessee browse page
- `frontend/src/lib/services/api.ts` - API client

## Conclusion

✅ **All systems working correctly:**
- Verification flow is properly connected
- Images display on all pages
- Lessees only see verified, vacant lands
- Admin can verify/flag lands successfully
