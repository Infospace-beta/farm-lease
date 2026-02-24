# FarmLease — Lessee & Agro-Dealer Dashboard API Endpoints

> **Stack**: Django REST Framework (backend) · Next.js 15 (frontend)  
> **Base URL**: `http://localhost:8000/api` (dev) · `NEXT_PUBLIC_API_URL` env var (production)

---

## Table of Contents

1. [Authentication & Workflow](#1-authentication--workflow)
2. [Frontend Setup — Connecting to Backend](#2-frontend-setup--connecting-to-backend)
3. [Lessee Dashboard Endpoints](#3-lessee-dashboard-endpoints)
4. [Agro-Dealer Dashboard Endpoints](#4-agro-dealer-dashboard-endpoints)
5. [Shared Endpoints](#5-shared-endpoints)
6. [Backend Implementation Checklist](#6-backend-implementation-checklist)

---

## 1. Authentication & Workflow

### Login Flow

```
User submits email + password
    ↓
POST /api/auth/login/
    ↓
Response: { access: "...", refresh: "..." }
    ↓
Store tokens in localStorage
    ↓
GET /api/auth/me/ (with Authorization: Bearer <access>)
    ↓
Response: { id, email, role, first_name, ... }
    ↓
role === "lessee"  → redirect to /lessee/dashboard
role === "dealer"  → redirect to /dealer/dashboard
role === "owner"   → redirect to /owner/dashboard
role === "admin"   → redirect to /admin/dashboard
```

### Token Lifecycle

| Event                       | Action                                               |
| --------------------------- | ---------------------------------------------------- |
| Every API request           | Attach `Authorization: Bearer <access_token>` header |
| `401 Unauthorized` received | Auto-refresh via `POST /api/auth/refresh/`           |
| Refresh also fails          | Clear tokens, redirect to `/login`                   |
| User clicks Logout          | `POST /api/auth/logout/` → clear tokens → `/login`   |

### JWT Token Format (Django Simple JWT)

```json
{
  "access": "eyJ0eXAiOiJKV1Q...", // Short-lived (5–15 min)
  "refresh": "eyJ0eXAiOiJKV1Q..." // Long-lived (7–30 days)
}
```

---

## 2. Frontend Setup — Connecting to Backend

### Step 1: Set environment variable

Create or update `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 2: Start Django backend

```bash
cd backend/farmlease
pip install -r ../requirements.txt
python manage.py migrate
python manage.py runserver
```

### Step 3: Start Next.js frontend

```bash
cd frontend
npm install
npm run dev
```

### Step 4: Use API helpers in a component

```tsx
// Example: fetch lessee dashboard data
import { lesseeApi } from "@/lib/services/api";
import { useEffect, useState } from "react";

export function useLesseeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lesseeApi
      .dashboard()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
```

### Step 5: CORS Configuration (Django)

In `backend/farmlease/farmlease/settings.py`:

```python
INSTALLED_APPS = [
    ...
    "corsheaders",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",    # Next.js dev server
]

# For production, replace with your actual domain:
# CORS_ALLOWED_ORIGINS = ["https://yourapp.com"]
```

---

## 3. Lessee Dashboard Endpoints

All lessee endpoints require `Authorization: Bearer <token>` and the user must have `role = "lessee"`.

---

### 3.1 Dashboard Summary

| Method | Endpoint             | Description                                                  |
| ------ | -------------------- | ------------------------------------------------------------ |
| `GET`  | `/lessee/dashboard/` | Stats: leased acres, expenditure, lease count, notifications |

**Response:**

```json
{
  "leased_acres": 24.5,
  "active_leases": 3,
  "monthly_expenditure": 85000,
  "escrow_balance": 150000,
  "upcoming_payment_date": "2024-07-01",
  "ai_recommendations": 2,
  "lease_health_score": 88
}
```

---

### 3.2 Land Browse & Search

| Method | Endpoint                                   | Description                         |
| ------ | ------------------------------------------ | ----------------------------------- |
| `GET`  | `/lands/listings/`                         | All verified land listings (public) |
| `GET`  | `/lands/listings/?region=Nakuru&soil=Loam` | Filtered listings                   |
| `GET`  | `/lands/{id}/`                             | Single land detail                  |

**Query Parameters:**

| Param       | Type   | Example                     |
| ----------- | ------ | --------------------------- |
| `region`    | string | `Nakuru`                    |
| `soil`      | string | `Loam`, `Clay`, `Sandy`     |
| `water`     | string | `River`, `Borehole`, `Rain` |
| `min_acres` | number | `5`                         |
| `max_acres` | number | `100`                       |
| `max_price` | number | `50000`                     |
| `search`    | string | `rift valley`               |
| `page`      | number | `1`                         |

**Response (listing item):**

```json
{
  "id": 1,
  "name": "Green Valley Plot A",
  "location": "Nakuru, Rift Valley",
  "acres": 20,
  "monthly_price": 45000,
  "soil_type": "Loam",
  "water_source": "River",
  "slope": "Flat",
  "owner_name": "James Mwangi",
  "ai_match_score": 98,
  "photos": ["url1", "url2"],
  "verified": true
}
```

---

### 3.3 Lease Requests & Agreements

| Method | Endpoint                                 | Description                   |
| ------ | ---------------------------------------- | ----------------------------- |
| `POST` | `/contracts/lease-requests/`             | Submit a new lease request    |
| `GET`  | `/contracts/lease-requests/`             | All my lease requests         |
| `GET`  | `/contracts/lease-requests/{id}/`        | Request details               |
| `POST` | `/contracts/lease-requests/{id}/cancel/` | Cancel a pending request      |
| `GET`  | `/contracts/leases/`                     | All my active leases          |
| `GET`  | `/contracts/leases/{id}/`                | Lease details + agreement PDF |
| `POST` | `/contracts/leases/{id}/sign/`           | Digitally sign a lease        |
| `POST` | `/contracts/leases/{id}/terminate/`      | Request early termination     |

**Create Lease Request Body:**

```json
{
  "land": 5,
  "proposed_start_date": "2024-08-01",
  "proposed_end_date": "2025-07-31",
  "message": "Interested in maize farming on this plot."
}
```

**Lease Response:**

```json
{
  "id": 12,
  "land_name": "Plot A4-North",
  "lessor_name": "James Mwangi",
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "monthly_rent": 37500,
  "status": "active",
  "progress": 75,
  "next_payment_date": "2024-07-01",
  "agreement_pdf_url": "/media/contracts/lease_12.pdf"
}
```

---

### 3.4 Financials & Payments

| Method | Endpoint                                  | Description                       |
| ------ | ----------------------------------------- | --------------------------------- |
| `GET`  | `/payments/my-payments/`                  | All transactions                  |
| `GET`  | `/payments/my-payments/?status=completed` | Filter by status                  |
| `POST` | `/payments/initiate/`                     | Initiate M-Pesa or Escrow payment |
| `GET`  | `/payments/escrow/balance/`               | Current escrow wallet balance     |
| `POST` | `/payments/escrow/{id}/release/`          | Release funds to landlord         |

**Initiate Payment Body:**

```json
{
  "lease": 12,
  "amount": 37500,
  "method": "mpesa",
  "phone_number": "254712345678"
}
```

**Transaction Response:**

```json
{
  "id": "TXN-0041",
  "description": "Plot A4-North — Monthly Lease Payment",
  "date": "2024-06-01",
  "amount": 37500,
  "method": "Escrow",
  "status": "completed",
  "receipt_url": "/media/receipts/TXN-0041.pdf"
}
```

---

### 3.5 AI Crop Predictor

| Method | Endpoint                      | Description         |
| ------ | ----------------------------- | ------------------- |
| `POST` | `/lessee/ai-predict/`         | Get crop prediction |
| `GET`  | `/lessee/ai-predict/history/` | Past predictions    |

**Predict (Regional Mode) Body:**

```json
{
  "mode": "regional",
  "region": "Nakuru, Rift Valley"
}
```

**Predict (Manual Mode) Body:**

```json
{
  "mode": "manual",
  "ph": 6.5,
  "nitrogen": 140,
  "phosphorus": 45,
  "potassium": 60,
  "rainfall": 800,
  "temperature": 22
}
```

**Response:**

```json
{
  "top_recommendation": {
    "crop": "Arabica Coffee",
    "match_score": 94,
    "icon": "coffee",
    "rationale": "Excellent match based on soil pH and altitude."
  },
  "alternatives": [
    { "crop": "Hybrid Maize", "match_score": 88 },
    { "crop": "Irish Potato", "match_score": 81 }
  ],
  "soil_health": "Good",
  "warnings": []
}
```

---

### 3.6 Agro-Dealer Shop (Lessee View)

| Method   | Endpoint                       | Description         |
| -------- | ------------------------------ | ------------------- |
| `GET`    | `/productplace/products/`      | Browse all products |
| `GET`    | `/productplace/products/{id}/` | Product detail      |
| `POST`   | `/productplace/cart/`          | Add item to cart    |
| `GET`    | `/productplace/cart/`          | View current cart   |
| `DELETE` | `/productplace/cart/{id}/`     | Remove cart item    |
| `POST`   | `/productplace/orders/`        | Place order         |
| `GET`    | `/productplace/orders/my/`     | My order history    |

---

### 3.7 Lessee Notifications

| Method  | Endpoint                               | Description         |
| ------- | -------------------------------------- | ------------------- |
| `GET`   | `/lessee/notifications/`               | All notifications   |
| `PATCH` | `/lessee/notifications/{id}/`          | Mark single as read |
| `POST`  | `/lessee/notifications/mark-all-read/` | Mark all as read    |

---

## 4. Agro-Dealer Dashboard Endpoints

All dealer endpoints require `Authorization: Bearer <token>` and `role = "dealer"`.

---

### 4.1 Dashboard Summary

| Method | Endpoint             | Description                        |
| ------ | -------------------- | ---------------------------------- |
| `GET`  | `/dealer/dashboard/` | KPIs: sales, orders, stock, rating |

**Response:**

```json
{
  "total_sales": 1200000,
  "total_sales_trend": "+18%",
  "active_orders": 42,
  "low_stock_count": 8,
  "store_rating": 4.8,
  "unread_queries": 3,
  "recent_orders": [...],
  "top_products": [...]
}
```

---

### 4.2 Products Management

| Method   | Endpoint                                                | Description                   |
| -------- | ------------------------------------------------------- | ----------------------------- |
| `GET`    | `/productplace/dealer/products/`                        | All my listed products        |
| `POST`   | `/productplace/dealer/products/`                        | Add a new product (multipart) |
| `GET`    | `/productplace/dealer/products/{id}/`                   | Product detail                |
| `PATCH`  | `/productplace/dealer/products/{id}/`                   | Update product                |
| `DELETE` | `/productplace/dealer/products/{id}/`                   | Delete product                |
| `POST`   | `/productplace/dealer/products/{id}/toggle-visibility/` | Show/hide product             |

**Create Product Body (multipart/form-data):**

| Field            | Type   | Required                  |
| ---------------- | ------ | ------------------------- |
| `name`           | string | ✓                         |
| `category`       | string | ✓                         |
| `price`          | number | ✓                         |
| `description`    | string | ✓                         |
| `unit`           | string | ✓ (`kg`, `litre`, `unit`) |
| `stock_quantity` | number | ✓                         |
| `reorder_level`  | number | ✓                         |
| `photos`         | files  | Optional                  |
| `sku`            | string | Optional                  |

---

### 4.3 Inventory Management

| Method | Endpoint                                         | Description                 |
| ------ | ------------------------------------------------ | --------------------------- |
| `GET`  | `/productplace/dealer/inventory/`                | Full stock list with status |
| `POST` | `/productplace/dealer/inventory/{id}/add-stock/` | Add stock quantity          |
| `GET`  | `/productplace/dealer/inventory/alerts/`         | Low/out-of-stock alerts     |

**Add Stock Body:**

```json
{ "quantity": 50 }
```

---

### 4.4 Orders

| Method  | Endpoint                                      | Description         |
| ------- | --------------------------------------------- | ------------------- |
| `GET`   | `/productplace/dealer/orders/`                | All incoming orders |
| `GET`   | `/productplace/dealer/orders/?status=Pending` | Filter by status    |
| `GET`   | `/productplace/dealer/orders/{id}/`           | Order detail        |
| `PATCH` | `/productplace/dealer/orders/{id}/`           | Update status       |
| `POST`  | `/productplace/dealer/orders/{id}/notes/`     | Add internal note   |

**Order Status Values:** `Pending` · `Processing` · `Ready` · `Delivered` · `Collected` · `Cancelled` · `Dispute`

**Update Status Body:**

```json
{ "status": "Processing" }
```

**Order Response:**

```json
{
  "id": "#ORD-2489",
  "customer": "Grace N.",
  "phone": "0712345678",
  "address": "Nakuru, Rift Valley",
  "type": "delivery",
  "items": [
    { "product": "DAP Fertilizer 50kg", "qty": 10, "unit_price": 3500 }
  ],
  "total": 35000,
  "status": "Pending",
  "created_at": "2024-10-24T10:30:00Z"
}
```

---

### 4.5 Customer Queries

| Method  | Endpoint                                   | Description                        |
| ------- | ------------------------------------------ | ---------------------------------- |
| `GET`   | `/productplace/dealer/queries/`            | All customer queries               |
| `GET`   | `/productplace/dealer/queries/{id}/`       | Query thread                       |
| `POST`  | `/productplace/dealer/queries/{id}/reply/` | Reply to a query                   |
| `PATCH` | `/productplace/dealer/queries/{id}/`       | Update status (Resolved/Escalated) |

**Reply Body:**

```json
{ "message": "Yes, we have 20 bags of DAP in stock." }
```

---

### 4.6 Transactions / Financials

| Method | Endpoint                                           | Description            |
| ------ | -------------------------------------------------- | ---------------------- |
| `GET`  | `/payments/dealer/transactions/`                   | All sales transactions |
| `GET`  | `/payments/dealer/transactions/?period=this_month` | Filter by period       |
| `GET`  | `/payments/dealer/transactions/{id}/`              | Transaction detail     |
| `GET`  | `/payments/dealer/earnings/`                       | Earnings summary       |
| `POST` | `/payments/dealer/withdraw/`                       | Withdraw to M-Pesa     |

**Period Values:** `all_time` · `this_month` · `last_month` · `custom`

**Earnings Summary Response:**

```json
{
  "total_earnings": 1452300,
  "direct_mpesa": 1410150,
  "platform_fees": 42150,
  "pending_withdrawal": 75000
}
```

---

### 4.7 Sales Analytics

| Method | Endpoint                                            | Description                     |
| ------ | --------------------------------------------------- | ------------------------------- |
| `GET`  | `/productplace/dealer/analytics/`                   | Revenue, orders, AOV, retention |
| `GET`  | `/productplace/dealer/analytics/?period=this_month` | Period filter                   |
| `GET`  | `/productplace/dealer/analytics/top-products/`      | Best-selling products           |
| `GET`  | `/productplace/dealer/analytics/customers/`         | Customer retention stats        |

**Analytics Response:**

```json
{
  "period": "August 2024",
  "total_revenue": 2400000,
  "total_orders": 856,
  "avg_order_value": 2803,
  "customer_retention": 68,
  "revenue_by_category": [
    { "category": "Fertilizers", "value": 850000, "pct": 35 },
    { "category": "Seeds", "value": 620000, "pct": 26 }
  ],
  "revenue_chart": [
    { "label": "Mon", "value": 85 },
    ...
  ]
}
```

---

### 4.8 Market Trends

| Method | Endpoint                                     | Description                 |
| ------ | -------------------------------------------- | --------------------------- |
| `GET`  | `/productplace/dealer/trends/`               | AI-powered market insights  |
| `GET`  | `/productplace/dealer/trends/?region=Nakuru` | Region-specific trends      |
| `GET`  | `/productplace/dealer/trends/demand/`        | Regional demand per product |

**Response:**

```json
{
  "region": "Nakuru, Rift Valley",
  "alerts": [
    {
      "type": "surge",
      "message": "Fertilizer demand up 40% — planting season starting",
      "product_category": "Fertilizers"
    }
  ],
  "top_demanded": ["DAP Fertilizer", "Hybrid Maize Seeds"],
  "seasonal_outlook": "High demand expected Q4",
  "price_trends": [...]
}
```

---

### 4.9 Dealer Notifications

| Method  | Endpoint                               | Description         |
| ------- | -------------------------------------- | ------------------- |
| `GET`   | `/dealer/notifications/`               | All notifications   |
| `PATCH` | `/dealer/notifications/{id}/`          | Mark single as read |
| `POST`  | `/dealer/notifications/mark-all-read/` | Mark all as read    |

---

### 4.10 Store Profile

| Method  | Endpoint           | Description                   |
| ------- | ------------------ | ----------------------------- |
| `GET`   | `/dealer/profile/` | Store details                 |
| `PATCH` | `/dealer/profile/` | Update store info (multipart) |

---

## 5. Shared Endpoints

| Method  | Endpoint                 | Description                |
| ------- | ------------------------ | -------------------------- |
| `POST`  | `/auth/login/`           | Login (all roles)          |
| `POST`  | `/auth/register/`        | Register new account       |
| `POST`  | `/auth/logout/`          | Invalidate refresh token   |
| `POST`  | `/auth/refresh/`         | Get new access token       |
| `GET`   | `/auth/me/`              | Get current user data      |
| `GET`   | `/auth/profile/`         | Extended profile           |
| `PATCH` | `/auth/profile/`         | Update profile (multipart) |
| `POST`  | `/auth/change-password/` | Change password            |

---

## 6. Backend Implementation Checklist

### Django Apps Required

| App              | Purpose                         | Status             |
| ---------------- | ------------------------------- | ------------------ |
| `accounts`       | Auth, user roles, profiles      | ✅ Exists          |
| `landmanagement` | Land listings, owner dashboard  | ✅ Exists          |
| `contracts`      | Lease requests, agreements      | ⚠️ Needs endpoints |
| `payments`       | M-Pesa, escrow, transactions    | ⚠️ Needs endpoints |
| `productplace`   | Products, orders, queries, cart | ⚠️ Needs endpoints |

### Endpoints to Implement in Django

**`contracts` app** — `urls.py`:

```python
urlpatterns = [
    path("lease-requests/", LeaseRequestListCreateView.as_view()),
    path("lease-requests/<int:pk>/", LeaseRequestDetailView.as_view()),
    path("lease-requests/<int:pk>/cancel/", CancelLeaseRequestView.as_view()),
    path("leases/", LeaseListView.as_view()),
    path("leases/<int:pk>/", LeaseDetailView.as_view()),
    path("leases/<int:pk>/sign/", SignLeaseView.as_view()),
    path("leases/<int:pk>/terminate/", TerminateLeaseView.as_view()),
]
```

**`payments` app** — `urls.py`:

```python
urlpatterns = [
    path("initiate/", InitiatePaymentView.as_view()),
    path("my-payments/", MyPaymentsView.as_view()),
    path("escrow/balance/", EscrowBalanceView.as_view()),
    path("escrow/<int:pk>/release/", ReleaseEscrowView.as_view()),
    path("dealer/transactions/", DealerTransactionsView.as_view()),
    path("dealer/earnings/", DealerEarningsView.as_view()),
    path("dealer/withdraw/", DealerWithdrawView.as_view()),
]
```

**`productplace` app** — `urls.py`:

```python
urlpatterns = [
    # Public (lessee)
    path("products/", ProductListView.as_view()),
    path("products/<int:pk>/", ProductDetailView.as_view()),
    path("cart/", CartView.as_view()),
    path("cart/<int:pk>/", CartItemView.as_view()),
    path("orders/", PlaceOrderView.as_view()),
    path("orders/my/", MyOrdersView.as_view()),

    # Dealer
    path("dealer/products/", DealerProductListCreateView.as_view()),
    path("dealer/products/<int:pk>/", DealerProductDetailView.as_view()),
    path("dealer/products/<int:pk>/toggle-visibility/", ToggleVisibilityView.as_view()),
    path("dealer/inventory/", DealerInventoryView.as_view()),
    path("dealer/inventory/<int:pk>/add-stock/", AddStockView.as_view()),
    path("dealer/inventory/alerts/", InventoryAlertsView.as_view()),
    path("dealer/orders/", DealerOrderListView.as_view()),
    path("dealer/orders/<str:pk>/", DealerOrderDetailView.as_view()),
    path("dealer/orders/<str:pk>/notes/", OrderNoteView.as_view()),
    path("dealer/queries/", DealerQueryListView.as_view()),
    path("dealer/queries/<int:pk>/", DealerQueryDetailView.as_view()),
    path("dealer/queries/<int:pk>/reply/", QueryReplyView.as_view()),
    path("dealer/analytics/", DealerAnalyticsView.as_view()),
    path("dealer/analytics/top-products/", TopProductsView.as_view()),
    path("dealer/analytics/customers/", CustomerStatsView.as_view()),
    path("dealer/trends/", MarketTrendsView.as_view()),
    path("dealer/trends/demand/", RegionalDemandView.as_view()),
]
```

**`farmlease/urls.py`** — include the new apps:

```python
urlpatterns = [
    ...
    path("api/contracts/", include("contracts.urls")),
    path("api/payments/", include("payments.urls")),
    path("api/productplace/", include("productplace.urls")),
    path("api/lessee/", include("lessee_views.urls")),
    path("api/dealer/", include("dealer_views.urls")),
]
```

### User Role Authentication (Django)

In each view, restrict access by role using a custom permission:

```python
# accounts/permissions.py (add to existing)
class IsLessee(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "lessee"

class IsDealer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == "dealer"

# Usage in views:
class DealerProductListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, IsDealer]
    ...
```

---

## Quick Integration Example

```tsx
// frontend/src/app/(main)/dealer/products/page.tsx
"use client";
import { useEffect, useState } from "react";
import { dealerApi } from "@/lib/services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dealerApi
      .myProducts()
      .then((res) => setProducts(res.data.results || res.data))
      .catch((err) =>
        setError(err.response?.data?.detail || "Failed to load products"),
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      {products.map((p: any) => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
```

---

_Generated for FarmLease · Last updated: February 2026_
