# Farm Owner API Reference

> **Last Updated:** February 17, 2026  
> **Target User:** Farm Owners / Land Owners  
> **Base URL:** `http://localhost:8000/api`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Land Listing Workflow](#land-listing-workflow)
   - [Step 1: Create Basic Information](#step-1-create-basic-information)
   - [Step 2: Add Soil & Climate Data](#step-2-add-soil--climate-data)
   - [Step 3: Upload Land Photos](#step-3-upload-land-photos)
4. [Dashboard & Analytics](#dashboard--analytics)
5. [Profile Management](#profile-management)
6. [Error Handling](#error-handling)
7. [Complete Code Examples](#complete-code-examples)

---

## Overview

This document provides a comprehensive guide to all API endpoints available to **Farm Owners** in the FarmLease platform. Farm Owners can list their agricultural land through a multi-step process, manage their listings, and track their dashboard statistics.

### Key Features for Farm Owners:
- 📋 **Multi-step Land Listing** - List land with detailed information in 3 easy steps
- 🌾 **Soil & Climate Data** - Add scientific data (pH, NPK, moisture, temperature, rainfall)
- 📸 **Photo Gallery** - Upload multiple high-quality images of your land
- 📊 **Dashboard Analytics** - Track active leases, pending approvals, and valuation
- ✅ **Verification System** - Submit listings for admin verification
- 📍 **Location Mapping** - Precise GPS coordinates for your land

---

## Authentication

All Farm Owner endpoints require JWT authentication. Include the access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Register as Farm Owner

```http
POST /api/auth/register/
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Kamau",
  "email": "john.kamau@example.com",
  "password": "SecurePass123!",
  "role": "landowner",
  "phone": "+254712345678"
}
```

**Response (201 Created):**
```json
{
  "id": 15,
  "name": "John Kamau",
  "email": "john.kamau@example.com",
  "role": "landowner",
  "phone": "+254712345678"
}
```

---

### Login

```http
POST /api/auth/login/
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john.kamau@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 15,
    "name": "John Kamau",
    "email": "john.kamau@example.com",
    "role": "landowner",
    "phone": "+254712345678"
  }
}
```

---

### Refresh Token

```http
POST /api/auth/refresh/
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Logout

```http
POST /api/auth/logout/
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
  }
}
```

**Store tokens:**
```javascript
localStorage.setItem('access_token', response.access);
localStorage.setItem('refresh_token', response.refresh);
```

---

### Token Refresh

```http
POST /auth/refresh/
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Logout

```http
POST /auth/logout/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

---

## Farm Owner Specific Endpoints

### Get Dashboard Statistics

Get overview statistics for the farm owner's portfolio.

```http
GET /lands/ownerdashboard/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "active_leases": 3,
  "pending_approvals": 2,
  "total_valuation": "Ksh 45.2M",
  "monthly_revenue": "Ksh 450k"
}
```

**Frontend Usage:**
```javascript
const fetchDashboardStats = async () => {
  try {
    const response = await apiClient.get('/lands/ownerdashboard/');
    setStats(response.data);
  } catch (error) {
    console.error('Failed to fetch stats', error);
  }
};
```

---

### STEP 1: Create Land Listing (Basic Info)

Create a new land listing with basic information.

```http
POST /lands/create-basic/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Prime Agricultural Land - Kiambu County",
  "description": "Fertile farmland with excellent irrigation system and road access. Ideal for vegetable farming or horticulture.",
  "total_area": 3.5,
  "price_per_month": 50000,
  "preferred_duration": "12 months",
  "has_irrigation": true,
  "has_electricity": true,
  "has_road_access": true,
  "has_fencing": false,
  "latitude": -1.2921,
  "longitude": 36.8219
}
```

**Response (201 Created):**
```json
{
  "land_id": 42
}
```

**Field Descriptions:**
- `title` (string, required): Descriptive title for the land listing
- `description` (text, required): Detailed description of the land
- `total_area` (decimal, required): Total area in acres
- `price_per_month` (decimal, required): Monthly lease price in KES
- `preferred_duration` (string, required): Preferred lease duration (e.g., "6 months", "12 months", "24 months")
- `has_irrigation` (boolean): Whether irrigation system is available
- `has_electricity` (boolean): Whether electricity is available
- `has_road_access` (boolean): Whether road access is available
- `has_fencing` (boolean): Whether the land is fenced
- `latitude` (decimal, required): GPS latitude coordinate
- `longitude` (decimal, required): GPS longitude coordinate

---

### STEP 2: Add Soil & Climate Data

Add scientific soil and climate data to an existing land listing.

```http
POST /lands/{land_id}/add-soil/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**URL Parameters:**
- `land_id` (integer): The ID of the land listing returned from Step 1

**Request Body:**
```json
{
  "ph_level": 6.5,
  "nitrogen": 45.2,
  "phosphorus": 32.8,
  "potassium": 28.5,
  "moisture": 40.0,
  "temperature": 26.5,
  "rainfall": 940.0
}
```

**Response (201 Created):**
```json
{
  "message": "Soil data added successfully"
}
```

**Field Descriptions:**
- `ph_level` (float, required): Soil pH level (0-14 scale)
- `nitrogen` (float, required): Nitrogen content (N) in mg/kg
- `phosphorus` (float, required): Phosphorus content (P) in mg/kg
- `potassium` (float, required): Potassium content (K) in mg/kg
- `moisture` (float, required): Soil moisture percentage
- `temperature` (float, required): Average temperature in Celsius
- `rainfall` (float, required): Average annual rainfall in mm

---

### STEP 3: Upload Land Photos

Upload multiple photos for a land listing.

```http
POST /lands/{land_id}/upload-photos/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**URL Parameters:**
- `land_id` (integer): The ID of the land listing

**Request Body (Form Data):**
```
images: File[]  // Multiple image files
```

**Response (201 Created):**
```json
{
  "message": "5 images uploaded successfully"
}
```

**Frontend Example (React):**
```javascript
const handlePhotoUpload = async (landId, files) => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append('images', file);
  });
  
  try {
    const response = await apiClient.post(
      `/lands/${landId}/upload-photos/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    toast.success(response.data.message);
  } catch (error) {
    toast.error('Failed to upload images');
  }
};
```

**Image Requirements:**
- Supported formats: JPEG, PNG, WebP
- Max file size: 5MB per image
- Recommended resolution: 1920x1080 or higher
- Maximum images: 10 per listing

---

### Get All My Land Listings

Retrieve all land listings owned by the authenticated user.

```http
GET /lands/my-lands/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 42,
    "title": "Prime Agricultural Land - Kiambu County",
    "description": "Fertile farmland with excellent irrigation system...",
    "total_area": 3.5,
    "price_per_month": 50000,
    "preferred_duration": "12 months",
    "has_irrigation": true,
    "has_electricity": true,
    "has_road_access": true,
    "has_fencing": false,
    "latitude": -1.2921,
    "longitude": 36.8219,
    "status": "Vacant",
    "is_verified": false,
    "created_at": "2024-10-15T08:30:00Z",
    "owner": 15,
    "soil_data": {
      "id": 12,
      "ph_level": 6.5,
      "nitrogen": 45.2,
      "phosphorus": 32.8,
      "potassium": 28.5,
      "moisture": 40.0,
      "temperature": 26.5,
      "rainfall": 940.0,
      "updated_at": "2024-10-15T08:35:00Z"
    },
    "images": [
      {
        "id": 81,
        "image": "/media/land_photos/plot_a4_view1.jpg"
      },
      {
        "id": 82,
        "image": "/media/land_photos/plot_a4_view2.jpg"
      }
    ]
  }
]
```

**Status Values:**
- `Vacant` - Available for lease
- `Leased` - Currently leased to a farmer
- `Pending` - Pending admin verification
- `Rejected` - Rejected by admin

---

### Get Single Land Details

Retrieve detailed information about a specific land listing.

```http
GET /lands/{land_id}/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": 42,
  "title": "Prime Agricultural Land - Kiambu County",
  "description": "Fertile farmland with excellent irrigation system...",
  "total_area": 3.5,
  "price_per_month": 50000,
  "preferred_duration": "12 months",
  "has_irrigation": true,
  "has_electricity": true,
  "has_road_access": true,
  "has_fencing": false,
  "latitude": -1.2921,
  "longitude": 36.8219,
  "status": "Leased",
  "is_verified": true,
  "created_at": "2024-10-15T08:30:00Z",
  "owner": 15,
  "soil_data": {
    "id": 12,
    "ph_level": 6.5,
    "nitrogen": 45.2,
    "phosphorus": 32.8,
    "potassium": 28.5,
    "moisture": 40.0,
    "temperature": 26.5,
    "rainfall": 940.0,
    "updated_at": "2024-10-15T08:35:00Z"
  },
  "images": [
    {
      "id": 81,
      "image": "/media/land_photos/plot_a4_view1.jpg"
    }
  ]
}
```

---

### Update Land Listing

Update an existing land listing (basic information only).

```http
PUT /lands/{land_id}/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Prime Agricultural Land - Kiambu County (Updated)",
  "description": "Updated description...",
  "total_area": 3.5,
  "price_per_month": 55000,
  "preferred_duration": "12 months",
  "has_irrigation": true,
  "has_electricity": true,
  "has_road_access": true,
  "has_fencing": true,
  "latitude": -1.2921,
  "longitude": 36.8219
}
```

**Response (200 OK):**
```json
{
  "id": 42,
  "title": "Prime Agricultural Land - Kiambu County (Updated)",
  "price_per_month": 55000,
  "has_fencing": true,
  ...
}
```

**Note:** Can only update lands that you own. Cannot update `status`, `is_verified`, or `owner` fields.

---

### Delete Land Listing

Delete a land listing.

```http
DELETE /lands/{land_id}/
Authorization: Bearer {access_token}
```

**Response (204 No Content)**

**Note:** 
- Can only delete lands that you own
- Cannot delete lands with active leases
- Soft deletion is recommended for data integrity

---

## Lease Management

### Get Lease Requests for My Lands

Retrieve all lease requests made to your land listings.

```http
GET /leases/my-requests/
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, rejected, active)
- `land_id` (optional): Filter by specific land listing

**Response (200 OK):**
```json
[
  {
    "id": 88,
    "lease_id": "FL-2024-882",
    "land": {
      "id": 42,
      "title": "Prime Agricultural Land - Kiambu County",
      "total_area": 3.5
    },
    "lessee": {
      "id": 23,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "+254700123456",
      "rating": 4.9,
      "total_leases": 24
    },
    "owner": {
      "id": 15,
      "name": "John Kamau"
    },
    "duration": 12,
    "start_date": "2025-01-01",
    "end_date": "2025-12-31",
    "monthly_price": 50000,
    "total_amount": 600000,
    "status": "pending",
    "terms_accepted": true,
    "created_at": "2024-10-24T10:30:00Z",
    "updated_at": "2024-10-24T10:30:00Z"
  }
]
```

**Lease Status Values:**
- `pending` - Awaiting owner review
- `approved` - Approved by owner, awaiting payment
- `active` - Payment completed, lease active
- `rejected` - Rejected by owner
- `completed` - Lease period ended
- `cancelled` - Cancelled by either party

---

### Get Lease Details

Get detailed information about a specific lease.

```http
GET /leases/{lease_id}/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": 88,
  "lease_id": "FL-2024-882",
  "land": {
    "id": 42,
    "title": "Prime Agricultural Land - Kiambu County",
    "total_area": 3.5,
    "price_per_month": 50000,
    "images": [
      {
        "id": 81,
        "image": "/media/land_photos/plot_a4_view1.jpg"
      }
    ]
  },
  "lessee": {
    "id": 23,
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "+254700123456",
    "profile_picture": "/media/avatars/jane_smith.jpg"
  },
  "owner": {
    "id": 15,
    "name": "John Kamau",
    "email": "john.kamau@example.com"
  },
  "duration": 12,
  "start_date": "2025-01-01",
  "end_date": "2025-12-31",
  "monthly_price": 50000,
  "total_amount": 600000,
  "status": "pending",
  "terms_accepted": true,
  "agreement_url": "/media/agreements/FL-2024-882.pdf",
  "created_at": "2024-10-24T10:30:00Z",
  "updated_at": "2024-10-24T10:30:00Z"
}
```

---

### Approve/Reject Lease Request

Update the status of a lease request.

```http
PATCH /leases/{lease_id}/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body (Approve):**
```json
{
  "status": "approved",
  "owner_notes": "Approved. Looking forward to working with you."
}
```

**Request Body (Reject):**
```json
{
  "status": "rejected",
  "rejection_reason": "Land already committed to another lessee for this period."
}
```

**Response (200 OK):**
```json
{
  "id": 88,
  "status": "approved",
  "owner_notes": "Approved. Looking forward to working with you.",
  "updated_at": "2024-10-24T14:20:00Z",
  "message": "Lease request approved successfully. Lessee will be notified."
}
```

---

### Get My Active Leases

Get all currently active leases for the farm owner.

```http
GET /leases/my-active/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 85,
    "lease_id": "FL-2024-850",
    "land": {
      "id": 40,
      "title": "Plot A4 - North Sector"
    },
    "lessee": {
      "id": 20,
      "name": "John Doe"
    },
    "start_date": "2024-10-01",
    "end_date": "2024-12-31",
    "monthly_price": 50000,
    "status": "active",
    "days_remaining": 68
  }
]
```

---

### Generate Lease Agreement

Generate an AI-powered lease agreement for an approved lease.

```http
POST /leases/{lease_id}/generate-agreement/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "custom_terms": [
    "Lessee must maintain soil quality through proper crop rotation",
    "Owner reserves right to inspect land quarterly",
    "Water usage limited to 1000 liters per day"
  ],
  "payment_schedule": "monthly",
  "deposit_amount": 100000
}
```

**Response (201 Created):**
```json
{
  "agreement_id": 42,
  "agreement_url": "/media/agreements/FL-2024-882_draft.pdf",
  "preview_url": "/agreements/preview/42/",
  "message": "Agreement generated successfully",
  "requires_signature": true
}
```

---

## Financial & Payment Management

### Get Financial Dashboard

Get financial overview and statistics.

```http
GET /payments/owner-dashboard/
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `period` (optional): `month`, `quarter`, `year` (default: `month`)

**Response (200 OK):**
```json
{
  "wallet_balance": 125000,
  "total_in_escrow": 1200000,
  "monthly_revenue": 450000,
  "pending_releases": 650000,
  "completed_transactions_count": 48,
  "revenue_trend": [
    { "month": "May", "actual": 45000, "projected": 40000 },
    { "month": "Jun", "actual": 52000, "projected": 48000 },
    { "month": "Jul", "actual": 48000, "projected": 50000 },
    { "month": "Aug", "actual": 62000, "projected": 55000 },
    { "month": "Sep", "actual": 58000, "projected": 60000 },
    { "month": "Oct", "actual": 75000, "projected": 65000 }
  ]
}
```

---

### Get Transaction History

Get detailed transaction history.

```http
GET /payments/transactions/
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `type` (optional): Filter by transaction type (`lease_payment`, `withdrawal`, `escrow_deposit`, `escrow_release`)
- `status` (optional): Filter by status (`pending`, `completed`, `failed`)
- `start_date` (optional): Filter from date (YYYY-MM-DD)
- `end_date` (optional): Filter to date (YYYY-MM-DD)
- `page` (optional): Page number for pagination

**Response (200 OK):**
```json
{
  "count": 48,
  "next": "/api/payments/transactions/?page=2",
  "previous": null,
  "results": [
    {
      "id": 201,
      "transaction_id": "TX-20241024-201",
      "type": "lease_payment",
      "description": "Lease Payment - Plot B2",
      "from_user": {
        "id": 23,
        "name": "Jane Smith"
      },
      "to_user": {
        "id": 15,
        "name": "John Kamau"
      },
      "amount": 45000,
      "currency": "KES",
      "status": "completed",
      "lease_id": "FL-2024-882",
      "payment_method": "M-PESA",
      "mpesa_receipt": "RK12AB3CD4",
      "created_at": "2024-10-24T09:15:00Z",
      "completed_at": "2024-10-24T09:15:30Z"
    },
    {
      "id": 198,
      "transaction_id": "TX-20241020-198",
      "type": "withdrawal",
      "description": "Withdrawal to Bank - Ref: WD-90283",
      "from_user": {
        "id": 15,
        "name": "John Kamau"
      },
      "to_user": null,
      "amount": 20000,
      "currency": "KES",
      "status": "processed",
      "bank_reference": "WD-90283",
      "bank_account": "****5678",
      "created_at": "2024-10-20T11:30:00Z",
      "completed_at": "2024-10-20T14:45:00Z"
    }
  ]
}
```

---

### Get Escrow Status

Track escrow payment milestones for all leases.

```http
GET /payments/escrow-status/
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `lease_id` (optional): Filter by specific lease

**Response (200 OK):**
```json
[
  {
    "id": 42,
    "lease": {
      "id": 88,
      "lease_id": "FL-2024-882",
      "land_title": "Plot A4 - North Sector"
    },
    "lessee": {
      "id": 23,
      "name": "Jane Smith"
    },
    "total_amount": 650000,
    "deposit_amount": 100000,
    "balance_amount": 550000,
    "status": "conditions_met",
    "progress_percentage": 75,
    "milestones": [
      {
        "id": 1,
        "label": "Deposit Paid",
        "description": "Initial deposit received",
        "amount": 100000,
        "completed": true,
        "completed_at": "2024-10-12T10:00:00Z"
      },
      {
        "id": 2,
        "label": "Agreement Signed",
        "description": "Digital signatures completed",
        "completed": true,
        "completed_at": "2024-10-15T14:30:00Z"
      },
      {
        "id": 3,
        "label": "Conditions Met",
        "description": "All lease conditions verified",
        "completed": false,
        "active": true,
        "pending_actions": [
          "Soil Inspection Report approval required"
        ]
      },
      {
        "id": 4,
        "label": "Funds Released",
        "description": "Payment released to owner",
        "amount": 550000,
        "completed": false,
        "estimated_date": "2024-11-01"
      }
    ],
    "action_required": true,
    "action_message": "Pending Action: Soil Inspection Report approval required.",
    "last_updated": "2024-10-24T08:00:00Z"
  }
]
```

**Escrow Status Values:**
- `deposit_paid` - Initial deposit received
- `awaiting_signatures` - Waiting for agreement signatures
- `conditions_pending` - Waiting for lease conditions to be met
- `conditions_met` - All conditions satisfied, ready for release
- `released` - Funds released to owner
- `disputed` - Escrow under dispute

---

### Approve Escrow Release Condition

Approve a specific condition for escrow release (e.g., inspection report).

```http
POST /payments/escrow/{escrow_id}/approve-condition/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "condition_type": "soil_inspection",
  "approval_notes": "Soil inspection report reviewed and approved. All metrics within acceptable range.",
  "approved": true
}
```

**Response (200 OK):**
```json
{
  "message": "Condition approved successfully",
  "escrow_status": "conditions_met",
  "next_milestone": "Funds will be released automatically within 24 hours",
  "updated_at": "2024-10-24T15:20:00Z"
}
```

---

### Initiate Withdrawal

Withdraw funds from wallet to bank account.

```http
POST /payments/withdraw/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 50000,
  "bank_account_id": 5,
  "withdrawal_method": "bank_transfer",
  "notes": "Monthly withdrawal"
}
```

**Response (201 Created):**
```json
{
  "withdrawal_id": "WD-20241024-301",
  "amount": 50000,
  "bank_account": "Equity Bank - ****5678",
  "status": "processing",
  "estimated_completion": "2024-10-25T15:00:00Z",
  "transaction_fee": 50,
  "net_amount": 49950,
  "message": "Withdrawal request submitted successfully"
}
```

---

### Get Withdrawal History

Get history of all withdrawal transactions.

```http
GET /payments/withdrawals/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 15,
    "withdrawal_id": "WD-20241024-301",
    "amount": 50000,
    "transaction_fee": 50,
    "net_amount": 49950,
    "bank_account": "Equity Bank - ****5678",
    "status": "completed",
    "created_at": "2024-10-24T11:30:00Z",
    "completed_at": "2024-10-25T09:15:00Z"
  }
]
```

---

## Reviews & Ratings

### Get Reviews for My Lands

Get all reviews submitted for your land listings.

```http
GET /reviews/my-lands/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 42,
    "land": {
      "id": 42,
      "title": "Prime Agricultural Land - Kiambu County"
    },
    "reviewer": {
      "id": 23,
      "name": "Jane Smith",
      "profile_picture": "/media/avatars/jane_smith.jpg"
    },
    "lease_id": "FL-2024-882",
    "rating": 5,
    "comment": "Excellent land with great soil quality. Owner was very cooperative and responsive.",
    "created_at": "2024-10-15T10:30:00Z",
    "updated_at": "2024-10-15T10:30:00Z"
  }
]
```

---

### Respond to Review

Respond to a review left by a lessee.

```http
POST /reviews/{review_id}/respond/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "response": "Thank you for the positive feedback! It was a pleasure working with you."
}
```

**Response (201 Created):**
```json
{
  "message": "Response added successfully",
  "review_id": 42,
  "response": "Thank you for the positive feedback! It was a pleasure working with you.",
  "responded_at": "2024-10-24T16:00:00Z"
}
```

---

## Profile Management

### Get My Profile

Get the authenticated owner's profile information.

```http
GET /users/profile/
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "id": 15,
  "name": "John Kamau",
  "email": "john.kamau@example.com",
  "phone": "+254712345678",
  "role": "landowner",
  "profile_picture": "/media/avatars/john_kamau.jpg",
  "bio": "Experienced land owner with 20+ years in agriculture",
  "location": "Kiambu County, Kenya",
  "date_joined": "2024-01-10T08:00:00Z",
  "is_verified": true,
  "verification_documents": [
    {
      "type": "national_id",
      "verified": true
    },
    {
      "type": "land_title_deed",
      "verified": true
    }
  ],
  "stats": {
    "total_lands": 5,
    "active_leases": 3,
    "total_revenue": 2450000,
    "average_rating": 4.8,
    "total_reviews": 24
  }
}
```

---

### Update Profile

Update profile information.

```http
PUT /users/profile/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Kamau",
  "phone": "+254712345678",
  "bio": "Experienced land owner with 20+ years in agriculture. Specializing in horticulture and vegetable farming.",
  "location": "Kiambu County, Kenya"
}
```

**Response (200 OK):**
```json
{
  "id": 15,
  "name": "John Kamau",
  "bio": "Experienced land owner with 20+ years in agriculture. Specializing in horticulture and vegetable farming.",
  "updated_at": "2024-10-24T17:00:00Z"
}
```

---

### Upload Profile Picture

Upload or update profile picture.

```http
POST /users/profile/picture/
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
image: File
```

**Response (200 OK):**
```json
{
  "profile_picture_url": "/media/avatars/john_kamau_20241024.jpg",
  "message": "Profile picture updated successfully"
}
```

---

### Change Password

Change account password.

```http
POST /users/change-password/
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "old_password": "OldSecurePass123!",
  "new_password": "NewSecurePass456!",
  "confirm_password": "NewSecurePass456!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

---

## Farm Owner Workflow

This section outlines the complete workflow for Farm Owners from registration to receiving payments.

### 1. Registration & Onboarding

```
┌─────────────────────────────────────────────────────────────┐
│ Step 1: Create Account                                       │
│ POST /auth/register/                                         │
│ - Provide name, email, password, phone                       │
│ - Select role: "landowner"                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 2: Verify Email (if required)                          │
│ - Check email for verification link                          │
│ - Click link to verify account                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 3: Complete Profile                                     │
│ PUT /users/profile/                                          │
│ - Add bio, location, and other details                       │
│ - Upload profile picture                                     │
│ POST /users/profile/picture/                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Step 4: Upload Verification Documents (Optional)            │
│ POST /users/documents/upload/                                │
│ - National ID                                                │
│ - Land title deeds                                           │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Land Listing Process

The land listing process is divided into 3 steps for better UX:

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Basic Information                                    │
│ POST /lands/create-basic/                                    │
│                                                              │
│ ✓ Land title                                                │
│ ✓ Description                                               │
│ ✓ Total area (acres)                                        │
│ ✓ Monthly lease price                                       │
│ ✓ Preferred duration                                        │
│ ✓ GPS coordinates (latitude, longitude)                    │
│ ✓ Amenities (irrigation, electricity, fencing, etc.)       │
│                                                              │
│ Returns: { land_id: 42 }                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Soil & Climate Data                                 │
│ POST /lands/{land_id}/add-soil/                             │
│                                                              │
│ ✓ Soil pH level                                             │
│ ✓ NPK values (Nitrogen, Phosphorus, Potassium)            │
│ ✓ Soil moisture                                             │
│ ✓ Average temperature                                       │
│ ✓ Average rainfall                                          │
│                                                              │
│ Note: Climate data can be auto-filled using GPS coords     │
│       via weather API integration                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Photos & Documentation                              │
│ POST /lands/{land_id}/upload-photos/                        │
│                                                              │
│ ✓ Upload 3-10 high-quality photos                          │
│ ✓ Set cover photo                                           │
│ ✓ Upload land title deed (optional)                        │
│                                                              │
│ Recommendations:                                             │
│ • Aerial/drone shots                                        │
│ • Soil close-ups                                            │
│ • Irrigation systems                                         │
│ • Access roads                                               │
│ • Boundaries/fencing                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ FINAL: Submit for Verification                              │
│                                                              │
│ Land status: "Pending"                                       │
│ Admin reviews listing → Approves or Rejects                 │
│                                                              │
│ If Approved: status = "Vacant"                              │
│ If Rejected: Owner notified with reason                     │
└─────────────────────────────────────────────────────────────┘
```

**Frontend Implementation:**
```javascript
// Complete land listing flow
const handleLandListing = async () => {
  try {
    // Step 1: Create basic info
    const step1Response = await apiClient.post('/lands/create-basic/', {
      title: formData.title,
      description: formData.description,
      total_area: formData.totalArea,
      price_per_month: formData.leasePrice,
      preferred_duration: formData.leaseDuration,
      latitude: formData.latitude,
      longitude: formData.longitude,
      has_irrigation: formData.amenities.irrigationSystem,
      has_electricity: formData.amenities.electricity,
      has_road_access: formData.amenities.roadAccess,
      has_fencing: formData.amenities.fencing,
    });
    
    const landId = step1Response.data.land_id;
    
    // Step 2: Add soil data
    await apiClient.post(`/lands/${landId}/add-soil/`, {
      ph_level: formData.soilPH,
      nitrogen: formData.nitrogen,
      phosphorus: formData.phosphorus,
      potassium: formData.potassium,
      moisture: formData.soilMoisture,
      temperature: formData.avgTemperature,
      rainfall: formData.avgRainfall,
    });
    
    // Step 3: Upload photos
    const photoFormData = new FormData();
    uploadedPhotos.forEach(photo => {
      photoFormData.append('images', photo.file);
    });
    
    await apiClient.post(
      `/lands/${landId}/upload-photos/`,
      photoFormData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    
    toast.success('Land listing created successfully! Awaiting admin approval.');
    navigate('/farm-owner/my-lands');
    
  } catch (error) {
    toast.error('Failed to create listing: ' + error.message);
  }
};
```

---

### 3. Managing Lease Requests

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Receive Lease Request                                     │
│ GET /leases/my-requests/                                     │
│                                                              │
│ Farmer submits lease request → Owner receives notification  │
│ Status: "pending"                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Review Request Details                                    │
│ GET /leases/{lease_id}/                                      │
│                                                              │
│ Owner reviews:                                               │
│ • Farmer profile & ratings                                   │
│ • Proposed lease duration                                    │
│ • Offer amount                                               │
│ • Start date                                                 │
│ • Farmer's farming plan (if provided)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                ┌──────┴──────┐
                │             │
                ▼             ▼
┌────────────────────┐  ┌────────────────────┐
│ APPROVE            │  │ REJECT             │
│ PATCH /leases/     │  │ PATCH /leases/     │
│ {lease_id}/        │  │ {lease_id}/        │
│                    │  │                    │
│ status: "approved" │  │ status: "rejected" │
└──────┬─────────────┘  └────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Generate Lease Agreement                                  │
│ POST /leases/{lease_id}/generate-agreement/                 │
│                                                              │
│ AI generates customized lease agreement with:               │
│ • Standard terms and conditions                              │
│ • Custom clauses (if specified)                             │
│ • Payment schedule                                           │
│ • Deposit amount                                             │
│ • Land maintenance requirements                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Both Parties Sign Agreement                              │
│                                                              │
│ Owner signs → Lessee signs → Agreement finalized            │
│ Status: "awaiting_payment"                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Lessee Makes Payment                                      │
│                                                              │
│ Payment goes into ESCROW (not directly to owner)            │
│ Status: "active"                                             │
│ Land status: "Leased"                                        │
└─────────────────────────────────────────────────────────────┘
```

---

### 4. Escrow & Payment Release

FarmLease uses an escrow system to protect both parties:

```
┌─────────────────────────────────────────────────────────────┐
│ MILESTONE 1: Deposit Paid                                    │
│ ✓ Amount: Typically 15-20% of total                         │
│ ✓ Held in platform escrow                                   │
│ ✓ Non-refundable once agreement signed                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ MILESTONE 2: Agreement Signed                                │
│ ✓ Both parties complete digital signatures                   │
│ ✓ Legally binding contract in place                         │
│ ✓ Lease officially commences                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ MILESTONE 3: Conditions Met                                  │
│ GET /payments/escrow-status/                                │
│                                                              │
│ Owner must verify/approve:                                   │
│ • Lessee has taken possession                               │
│ • Initial soil inspection (if required)                     │
│ • Insurance documents submitted (if required)               │
│                                                              │
│ POST /payments/escrow/{escrow_id}/approve-condition/        │
│ Owner approves each condition                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ MILESTONE 4: Funds Released                                  │
│ ✓ All conditions met                                        │
│ ✓ Escrow automatically releases funds to owner wallet       │
│ ✓ Owner can withdraw to bank account                        │
│                                                              │
│ POST /payments/withdraw/                                     │
└─────────────────────────────────────────────────────────────┘
```

**Escrow Timeline:**
- **Days 1-7:** Deposit paid, agreement signed
- **Days 7-14:** Conditions verification period
- **Day 14+:** Funds released to owner (if all conditions met)

---

### 5. Dashboard & Monitoring

Farm owners can monitor their portfolio through the dashboard:

```
┌─────────────────────────────────────────────────────────────┐
│ DASHBOARD OVERVIEW                                           │
│ GET /lands/ownerdashboard/                                   │
│                                                              │
│ Key Metrics:                                                 │
│ • Total Portfolio Valuation                                  │
│ • Monthly Revenue                                            │
│ • Occupancy Rate                                             │
│ • Active Leases Count                                        │
│ • Pending Approvals                                          │
│                                                              │
│ My Lands Card View:                                          │
│ GET /lands/my-lands/                                         │
│ • Shows all land listings                                    │
│ • Status indicators (Vacant, Leased, Pending)              │
│ • Quick actions (Manage, Edit, View Details)               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ FINANCIAL MANAGEMENT                                         │
│ GET /payments/owner-dashboard/                               │
│                                                              │
│ • Wallet Balance                                             │
│ • Total in Escrow                                            │
│ • Revenue Trends (graphs)                                    │
│ • Transaction History                                        │
│ • Withdrawal Management                                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ LEASE TRACKING                                               │
│ GET /leases/my-active/                                       │
│                                                              │
│ For each active lease:                                       │
│ • Current lessee information                                 │
│ • Days remaining                                             │
│ • Payment status                                             │
│ • Quick communication                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ ESCROW TRACKING                                              │
│ GET /payments/escrow-status/                                 │
│                                                              │
│ Monitor all escrow payments:                                 │
│ • Progress percentage                                        │
│ • Milestone completion status                               │
│ • Action items requiring approval                           │
│ • Estimated release dates                                    │
└─────────────────────────────────────────────────────────────┘
```

---

### 6. Complete User Journey Example

**Scenario:** John Kamau wants to lease his 3.5-acre land in Kiambu

```javascript
// 1. Register
const register = async () => {
  const response = await apiClient.post('/auth/register/', {
    name: 'John Kamau',
    email: 'john@example.com',
    password: 'SecurePass123!',
    role: 'landowner',
    phone: '+254712345678'
  });
  // Store tokens
};

// 2. Create land listing
const createListing = async () => {
  // Step 1: Basic info
  const step1 = await apiClient.post('/lands/create-basic/', {
    title: 'Prime Agricultural Land - Kiambu',
    total_area: 3.5,
    price_per_month: 50000,
    // ... other fields
  });
  
  const landId = step1.data.land_id;
  
  // Step 2: Soil data
  await apiClient.post(`/lands/${landId}/add-soil/`, {
    ph_level: 6.5,
    nitrogen: 45.2,
    // ... other fields
  });
  
  // Step 3: Photos
  const formData = new FormData();
  photos.forEach(p => formData.append('images', p));
  await apiClient.post(`/lands/${landId}/upload-photos/`, formData);
};

// 3. Monitor dashboard
const fetchDashboard = async () => {
  const stats = await apiClient.get('/lands/ownerdashboard/');
  // Display stats: active leases, revenue, etc.
};

// 4. Receive lease request from Jane Smith
const checkLeaseRequests = async () => {
  const requests = await apiClient.get('/leases/my-requests/');
  // Show pending requests
};

// 5. Review and approve request
const approveRequest = async (leaseId) => {
  await apiClient.patch(`/leases/${leaseId}/`, {
    status: 'approved',
    owner_notes: 'Approved. Looking forward!'
  });
};

// 6. Generate agreement
const generateAgreement = async (leaseId) => {
  await apiClient.post(`/leases/${leaseId}/generate-agreement/`, {
    custom_terms: ['Maintain soil quality', 'Quarterly inspections'],
    payment_schedule: 'monthly',
    deposit_amount: 100000
  });
};

// 7. Track escrow
const trackEscrow = async () => {
  const escrows = await apiClient.get('/payments/escrow-status/');
  // Monitor payment milestones
};

// 8. Approve conditions
const approveCondition = async (escrowId) => {
  await apiClient.post(`/payments/escrow/${escrowId}/approve-condition/`, {
    condition_type: 'soil_inspection',
    approval_notes: 'Inspection approved',
    approved: true
  });
};

// 9. Withdraw funds
const withdrawFunds = async () => {
  await apiClient.post('/payments/withdraw/', {
    amount: 50000,
    bank_account_id: 5,
    withdrawal_method: 'bank_transfer'
  });
};
```

---

## Error Handling

### Common Error Responses

All API endpoints return consistent error formats:

**400 Bad Request - Validation Error**
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": {
    "total_area": ["This field must be a positive number"],
    "price_per_month": ["Ensure this value is greater than or equal to 1000"]
  }
}
```

**401 Unauthorized - Authentication Required**
```json
{
  "error": "Unauthorized",
  "message": "Authentication credentials were not provided or are invalid",
  "detail": "Token expired or invalid"
}
```

**403 Forbidden - Insufficient Permissions**
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to perform this action",
  "detail": "Only land owners can access this endpoint"
}
```

**404 Not Found**
```json
{
  "error": "Not Found",
  "message": "The requested resource was not found",
  "detail": "Land with id 999 does not exist"
}
```

**409 Conflict**
```json
{
  "error": "Conflict",
  "message": "The request conflicts with the current state",
  "detail": "Cannot delete land with active leases"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "detail": "Please contact support if this persists"
}
```

### Frontend Error Handling Pattern

```javascript
import { toast } from 'react-toastify';

const handleApiCall = async () => {
  try {
    const response = await apiClient.post('/lands/create-basic/', data);
    toast.success('Land listing created successfully!');
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          // Validation errors
          Object.keys(data.details || {}).forEach(field => {
            toast.error(`${field}: ${data.details[field][0]}`);
          });
          break;
        case 401:
          // Unauthorized - redirect to login
          toast.error('Session expired. Please login again.');
          navigate('/auth/login');
          break;
        case 403:
          toast.error('You do not have permission for this action');
          break;
        case 404:
          toast.error('Resource not found');
          break;
        case 409:
          toast.error(data.detail || 'Conflict with current state');
          break;
        default:
          toast.error('An error occurred. Please try again.');
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred');
    }
  }
};
```

---

## Code Examples

### Complete React Component Example

```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '@/services/apiClient';

const FarmOwnerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [lands, setLands] = useState([]);
  const [leaseRequests, setLeaseRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard stats
      const statsResponse = await apiClient.get('/lands/ownerdashboard/');
      setStats(statsResponse.data);
      
      // Fetch my lands
      const landsResponse = await apiClient.get('/lands/my-lands/');
      setLands(landsResponse.data);
      
      // Fetch pending lease requests
      const requestsResponse = await apiClient.get('/leases/my-requests/?status=pending');
      setLeaseRequests(requestsResponse.data);
      
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (leaseId) => {
    try {
      await apiClient.patch(`/leases/${leaseId}/`, {
        status: 'approved',
        owner_notes: 'Request approved'
      });
      
      toast.success('Lease request approved!');
      fetchDashboardData(); // Refresh data
      
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleRejectRequest = async (leaseId, reason) => {
    try {
      await apiClient.patch(`/leases/${leaseId}/`, {
        status: 'rejected',
        rejection_reason: reason
      });
      
      toast.success('Lease request rejected');
      fetchDashboardData(); // Refresh data
      
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard 
          title="Total Valuation" 
          value={stats?.total_valuation}
          change={stats?.valuation_change}
        />
        <StatCard 
          title="Monthly Revenue" 
          value={stats?.monthly_revenue}
          change={stats?.revenue_change}
        />
        <StatCard 
          title="Active Leases" 
          value={stats?.active_leases}
        />
        <StatCard 
          title="Pending Approvals" 
          value={stats?.pending_approvals}
        />
      </div>

      {/* Pending Lease Requests */}
      <div className="lease-requests">
        <h2>Pending Lease Requests ({leaseRequests.length})</h2>
        {leaseRequests.map(request => (
          <LeaseRequestCard
            key={request.id}
            request={request}
            onApprove={() => handleApproveRequest(request.id)}
            onReject={(reason) => handleRejectRequest(request.id, reason)}
          />
        ))}
      </div>

      {/* My Lands */}
      <div className="my-lands">
        <h2>My Land Listings ({lands.length})</h2>
        <div className="lands-grid">
          {lands.map(land => (
            <LandCard key={land.id} land={land} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmOwnerDashboard;
```

---

### Service Layer Example

```javascript
// src/services/farmOwnerService.js
import apiClient from './apiClient';

class FarmOwnerService {
  // Dashboard
  async getDashboardStats() {
    const response = await apiClient.get('/lands/ownerdashboard/');
    return response.data;
  }

  // Land Management
  async createBasicLandInfo(data) {
    const response = await apiClient.post('/lands/create-basic/', data);
    return response.data;
  }

  async addSoilData(landId, data) {
    const response = await apiClient.post(`/lands/${landId}/add-soil/`, data);
    return response.data;
  }

  async uploadLandPhotos(landId, files) {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    const response = await apiClient.post(
      `/lands/${landId}/upload-photos/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  }

  async getMyLands() {
    const response = await apiClient.get('/lands/my-lands/');
    return response.data;
  }

  async updateLand(landId, data) {
    const response = await apiClient.put(`/lands/${landId}/`, data);
    return response.data;
  }

  async deleteLand(landId) {
    const response = await apiClient.delete(`/lands/${landId}/`);
    return response.data;
  }

  // Lease Management
  async getLeaseRequests(status = null) {
    const params = status ? { status } : {};
    const response = await apiClient.get('/leases/my-requests/', { params });
    return response.data;
  }

  async getLeaseDetails(leaseId) {
    const response = await apiClient.get(`/leases/${leaseId}/`);
    return response.data;
  }

  async approveLeaseRequest(leaseId, notes = '') {
    const response = await apiClient.patch(`/leases/${leaseId}/`, {
      status: 'approved',
      owner_notes: notes
    });
    return response.data;
  }

  async rejectLeaseRequest(leaseId, reason) {
    const response = await apiClient.patch(`/leases/${leaseId}/`, {
      status: 'rejected',
      rejection_reason: reason
    });
    return response.data;
  }

  async generateAgreement(leaseId, agreementData) {
    const response = await apiClient.post(
      `/leases/${leaseId}/generate-agreement/`,
      agreementData
    );
    return response.data;
  }

  // Financial Management
  async getFinancialDashboard(period = 'month') {
    const response = await apiClient.get('/payments/owner-dashboard/', {
      params: { period }
    });
    return response.data;
  }

  async getTransactionHistory(filters = {}) {
    const response = await apiClient.get('/payments/transactions/', {
      params: filters
    });
    return response.data;
  }

  async getEscrowStatus(leaseId = null) {
    const params = leaseId ? { lease_id: leaseId } : {};
    const response = await apiClient.get('/payments/escrow-status/', { params });
    return response.data;
  }

  async approveEscrowCondition(escrowId, conditionData) {
    const response = await apiClient.post(
      `/payments/escrow/${escrowId}/approve-condition/`,
      conditionData
    );
    return response.data;
  }

  async initiateWithdrawal(amount, bankAccountId) {
    const response = await apiClient.post('/payments/withdraw/', {
      amount,
      bank_account_id: bankAccountId,
      withdrawal_method: 'bank_transfer'
    });
    return response.data;
  }

  async getWithdrawalHistory() {
    const response = await apiClient.get('/payments/withdrawals/');
    return response.data;
  }
}

export default new FarmOwnerService();
```

---

## Notes & Best Practices

### Security Considerations

1. **JWT Token Management**
   - Store access token in memory or secure storage
   - Store refresh token in httpOnly cookie (if supported)
   - Implement automatic token refresh before expiration
   - Clear tokens on logout

2. **File Upload Security**
   - Validate file types on client side
   - Server validates file types and sizes
   - Scan uploaded files for malware
   - Use secure file storage (AWS S3, etc.)

3. **Data Validation**
   - Client-side validation for UX
   - Server-side validation is mandatory
   - Sanitize all user inputs
   - Use parameterized queries

### Performance Optimization

1. **Image Optimization**
   - Compress images before upload
   - Use lazy loading for image lists
   - Implement image CDN for faster delivery
   - Generate thumbnails on server

2. **API Caching**
   - Cache dashboard stats (1-5 minutes)
   - Cache land listings (update on mutation)
   - Use SWR or React Query for smart caching

3. **Pagination**
   - Implement pagination for large lists
   - Use cursor-based pagination for real-time updates
   - Default page size: 20 items

### User Experience

1. **Loading States**
   - Show skeleton loaders during data fetch
   - Disable buttons during API calls
   - Provide progress indicators for file uploads

2. **Error Feedback**
   - Clear, actionable error messages
   - Field-level validation errors
   - Toast notifications for success/failure

3. **Confirmation Dialogs**
   - Confirm before deleting lands
   - Confirm before rejecting lease requests
   - Confirm withdrawal amounts

---

## Support & Resources

### Backend Implementation Checklist

- [ ] User authentication (JWT)
- [ ] Land listing CRUD operations
- [ ] Multi-step land creation flow
- [ ] Image upload handling
- [ ] Lease request management
- [ ] Escrow payment tracking
- [ ] Payment integration (M-PESA)
- [ ] Agreement generation
- [ ] Notification system
- [ ] Admin verification workflow

### Testing Endpoints

Use tools like Postman or Thunder Client to test endpoints:

```bash
# Example: Test login
POST http://localhost:8000/api/auth/login/
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

# Example: Test dashboard (with auth)
GET http://localhost:8000/api/lands/ownerdashboard/
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Environment Variables

```bash
# .env file
VITE_API_BASE_URL=http://localhost:8000/api
VITE_MEDIA_URL=http://localhost:8000/media
```

---

**Document Version:** 1.0  
**Last Updated:** February 17, 2026  
**Maintained By:** FarmLease Development Team

For questions or issues, contact: support@farmlease.io
