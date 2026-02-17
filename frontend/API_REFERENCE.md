# API Integration Reference

## Base Configuration

```javascript
// Base URL is set in .env
VITE_API_BASE_URL=http://localhost:8000/api

// All requests automatically include JWT token from localStorage
// Token refresh is handled automatically by apiClient interceptor
```

## Authentication Endpoints

### Login
```javascript
POST /auth/login/
Body: { email: string, password: string }
Response: { 
  access: string, 
  refresh: string, 
  user: { id, name, email, role } 
}
```

### Register
```javascript
POST /auth/register/
Body: { 
  name: string, 
  email: string, 
  password: string, 
  role: string,
  phone: string 
}
Response: { message: string, user: object }
```

### Logout
```javascript
POST /auth/logout/
Response: { message: string }
```

### Refresh Token
```javascript
POST /auth/refresh/
Body: { refresh: string }
Response: { access: string }
```

---

## Land Endpoints

### Get All Lands (Public/Browse)
```javascript
GET /lands/
Query params: 
  - county: string
  - min_size: number
  - max_size: number
  - min_price: number
  - max_price: number
  - soil_type: string
  - status: string
  - page: number
Response: { 
  results: Land[], 
  count: number, 
  next: string, 
  previous: string 
}
```

### Get Single Land
```javascript
GET /lands/:id/
Response: { id, title, location, size, price, ... }
```

### Get My Lands (Owner)
```javascript
GET /lands/my-lands/
Response: Land[]
```

### Create Land (Owner)
```javascript
POST /lands/
Body: FormData {
  title: string,
  county: string,
  size: number,
  soil_type: string,
  price: number,
  description: string,
  images: File[],
  documents: File[]
}
Response: { id, ...landData }
```

### Update Land (Owner)
```javascript
PUT /lands/:id/
Body: FormData (same as create)
Response: { id, ...updatedLandData }
```

### Delete Land (Owner)
```javascript
DELETE /lands/:id/
Response: { message: string }
```

### Get Pending Lands (Admin)
```javascript
GET /lands/pending/
Response: Land[]
```

### Verify Land (Admin)
```javascript
POST /lands/:id/verify/
Body: { 
  status: 'APPROVED' | 'REJECTED',
  reason?: string 
}
Response: { message: string, land: object }
```

---

## Lease Endpoints

### Create Lease Request
```javascript
POST /leases/create/
Body: {
  land_id: number,
  duration: number, // months
  start_date: string,
  terms_accepted: boolean
}
Response: { id, ...leaseData, payment_url: string }
```

### Get My Leases
```javascript
GET /leases/my-leases/
Response: Lease[]
```

### Get Lease Details
```javascript
GET /leases/:id/
Response: { id, land, lessee, owner, status, ... }
```

### Update Lease Status
```javascript
PATCH /leases/:id/
Body: { status: string }
Response: { id, ...updatedLease }
```

---

## Product Endpoints (Agro-Dealer)

### Get All Products
```javascript
GET /products/
Query params:
  - category: string
  - search: string
  - min_price: number
  - max_price: number
Response: Product[]
```

### Get Product Details
```javascript
GET /products/:id/
Response: { id, name, price, category, ... }
```

### Get My Products (Dealer)
```javascript
GET /products/my-products/
Response: Product[]
```

### Create Product (Dealer)
```javascript
POST /products/
Body: FormData {
  name: string,
  category: string,
  price: number,
  stock: number,
  description: string,
  images: File[]
}
Response: { id, ...productData }
```

### Update Product (Dealer)
```javascript
PUT /products/:id/
Body: FormData (same as create)
Response: { id, ...updatedProduct }
```

### Delete Product (Dealer)
```javascript
DELETE /products/:id/
Response: { message: string }
```

---

## Payment Endpoints

### Initiate M-Pesa Payment
```javascript
POST /payments/initiate/
Body: {
  lease_id: number,
  phone: string,
  amount: number
}
Response: { 
  payment_id: string,
  checkout_request_id: string,
  message: string 
}
```

### Check Payment Status
```javascript
GET /payments/:id/status/
Response: { 
  status: 'PENDING' | 'COMPLETED' | 'FAILED',
  transaction_id?: string 
}
```

### Get Payment History
```javascript
GET /payments/history/
Response: Payment[]
```

---

## Crop Recommendation Endpoints

### Get Crop Recommendations
```javascript
POST /recommendations/crops/
Body: {
  land_id?: number,
  soil_type: string,
  location: string,
  // Auto-fetches weather data
}
Response: {
  recommendations: [
    { crop: string, suitability: number, reasons: string[] }
  ]
}
```

### Save Recommendation
```javascript
POST /recommendations/save/
Body: {
  land_id: number,
  recommendations: object
}
Response: { id, ...saved }
```

---

## Review Endpoints

### Create Review
```javascript
POST /reviews/
Body: {
  land_id: number,
  rating: number, // 1-5
  comment: string
}
Response: { id, ...reviewData }
```

### Get Land Reviews
```javascript
GET /reviews/land/:landId/
Response: Review[]
```

### Update Review
```javascript
PUT /reviews/:id/
Body: { rating: number, comment: string }
Response: { id, ...updated }
```

### Delete Review
```javascript
DELETE /reviews/:id/
Response: { message: string }
```

---

## User Endpoints

### Get User Profile
```javascript
GET /users/profile/
Response: { id, name, email, role, ... }
```

### Update Profile
```javascript
PUT /users/profile/
Body: { name, phone, bio, ... }
Response: { id, ...updated }
```

### Upload Profile Picture
```javascript
POST /users/profile/picture/
Body: FormData { image: File }
Response: { profile_picture_url: string }
```

---

## Admin Endpoints

### Get All Users
```javascript
GET /users/
Query params: role, search, status
Response: User[]
```

### Get User Details
```javascript
GET /users/:id/
Response: { id, ...userDetails, activity: [] }
```

### Suspend/Ban User
```javascript
PATCH /users/:id/status/
Body: { 
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED',
  reason?: string 
}
Response: { message: string }
```

### Get Reports
```javascript
GET /reports/
Response: Report[]
```

### Resolve Report
```javascript
POST /reports/:id/resolve/
Body: { 
  action: string,
  resolution: string 
}
Response: { message: string }
```

### Get Platform Revenue
```javascript
GET /admin/revenue/
Response: { 
  total: number,
  monthly: number,
  escrow_held: number,
  transactions: []
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```javascript
{
  error: string,
  message: string,
  details?: object
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 401: Unauthorized (not logged in)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

---

## Usage Example

```javascript
// In your component
import { landService } from '@/services';
import { toast } from 'react-toastify';

const MyComponent = () => {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLands = async () => {
      try {
        const data = await landService.getAllLands({ county: 'Nairobi' });
        setLands(data.results);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLands();
  }, []);

  // ... rest of component
};
```

---

## Notes

1. **Authentication**: All protected endpoints require JWT token in header
2. **Pagination**: Use `page` query param for paginated endpoints
3. **File Uploads**: Use `FormData` and appropriate `Content-Type`
4. **Token Refresh**: Automatic via `apiClient` interceptor
5. **Error Handling**: Centralized in `apiClient`

---

**Backend API must implement these endpoints for full functionality**
