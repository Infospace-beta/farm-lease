# FarmLease Platform - Application Flow

## 🗺️ User Journey Maps

### 1. Farm Owner Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                         FARM OWNER FLOW                          │
└─────────────────────────────────────────────────────────────────┘

Landing Page → Register (Owner) → Login → Owner Dashboard
                                            │
                                            ├─→ My Lands
                                            │   ├─→ View Lands List
                                            │   ├─→ Add New Land
                                            │   │   ├─→ Fill Details
                                            │   │   ├─→ Upload Images
                                            │   │   ├─→ Upload Documents
                                            │   │   └─→ Submit for Verification
                                            │   └─→ Edit/Delete Land
                                            │
                                            ├─→ Leases
                                            │   ├─→ Active Leases
                                            │   ├─→ Lease History
                                            │   └─→ Lease Details
                                            │
                                            ├─→ Payments
                                            │   ├─→ Payment History
                                            │   ├─→ Escrow Status
                                            │   └─→ Revenue Analytics
                                            │
                                            └─→ Profile
                                                └─→ Edit Profile
```

### 2. Lessee/Farmer Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                       LESSEE/FARMER FLOW                         │
└─────────────────────────────────────────────────────────────────┘

Landing Page → Register (Lessee) → Login → Lessee Dashboard
                                             │
                                             ├─→ Browse Lands
                                             │   ├─→ Search & Filter
                                             │   │   ├─→ By Location
                                             │   │   ├─→ By Size
                                             │   │   ├─→ By Price
                                             │   │   └─→ By Soil Type
                                             │   ├─→ View Land Details
                                             │   │   ├─→ View Images
                                             │   │   ├─→ View Map
                                             │   │   ├─→ Read Reviews
                                             │   │   └─→ Lease Land
                                             │   │       ├─→ Select Duration
                                             │   │       ├─→ Review Terms
                                             │   │       └─→ Pay (M-Pesa)
                                             │   └─→ Save for Later
                                             │
                                             ├─→ My Leases
                                             │   ├─→ Active Leases
                                             │   ├─→ Payment Tracking
                                             │   └─→ Leave Review
                                             │
                                             ├─→ Crop Recommendations
                                             │   ├─→ Input Soil Data
                                             │   ├─→ View Weather Data
                                             │   ├─→ Get AI Suggestions
                                             │   └─→ Save Recommendations
                                             │
                                             ├─→ Agro Products
                                             │   ├─→ Browse Products
                                             │   ├─→ View Product Details
                                             │   └─→ Contact Dealer
                                             │
                                             └─→ Profile
                                                 └─→ Edit Profile
```

### 3. Agro-Dealer Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                       AGRO-DEALER FLOW                           │
└─────────────────────────────────────────────────────────────────┘

Landing Page → Register (Dealer) → Login → Dealer Dashboard
                                             │
                                             ├─→ My Products
                                             │   ├─→ View Products List
                                             │   ├─→ Add New Product
                                             │   │   ├─→ Fill Details
                                             │   │   ├─→ Upload Images
                                             │   │   └─→ Submit
                                             │   └─→ Edit/Delete Product
                                             │
                                             ├─→ Orders/Inquiries
                                             │   ├─→ View Inquiries
                                             │   └─→ Respond to Customers
                                             │
                                             ├─→ Analytics
                                             │   ├─→ Product Views
                                             │   ├─→ Inquiries
                                             │   └─→ Ratings
                                             │
                                             └─→ Profile
                                                 └─→ Edit Business Profile
```

### 4. Admin Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                          ADMIN FLOW                              │
└─────────────────────────────────────────────────────────────────┘

Login (Admin) → Admin Dashboard
                 │
                 ├─→ Pending Lands
                 │   ├─→ View Pending Lands
                 │   ├─→ Review Documents
                 │   │   ├─→ Verify ID
                 │   │   ├─→ Verify Title Deed
                 │   │   └─→ Check ArdhiSasa
                 │   ├─→ Approve Land
                 │   └─→ Reject Land (with reason)
                 │
                 ├─→ User Management
                 │   ├─→ View All Users
                 │   ├─→ Search/Filter Users
                 │   ├─→ View User Details
                 │   ├─→ Suspend User
                 │   ├─→ Ban User
                 │   └─→ View Activity Logs
                 │
                 ├─→ Revenue Management
                 │   ├─→ View Total Revenue
                 │   ├─→ Escrow Transactions
                 │   ├─→ Commission Breakdown
                 │   └─→ Export Reports
                 │
                 ├─→ Reports & Moderation
                 │   ├─→ View Reports
                 │   ├─→ Investigate Reports
                 │   ├─→ Resolve Disputes
                 │   └─→ Take Action
                 │
                 └─→ Platform Settings
                     ├─→ System Configuration
                     └─→ Platform Policies
```

---

## 🔄 Key Interaction Flows

### Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                        │
└──────────────────────────────────────────────────────────────┘

User Visit
   │
   ├─→ Has Account? 
   │   ├─→ Yes → Login
   │   │         ├─→ Enter Email & Password
   │   │         ├─→ Submit
   │   │         ├─→ Receive JWT Token
   │   │         └─→ Redirect to Role Dashboard
   │   │
   │   └─→ No → Register
   │             ├─→ Step 1: Select Role
   │             │   └─→ Owner/Lessee/Dealer
   │             ├─→ Step 2: Personal Info
   │             │   ├─→ Name, Email, Phone
   │             │   └─→ Password
   │             ├─→ Submit
   │             └─→ Redirect to Login
   │
   └─→ Forgot Password?
       ├─→ Enter Email
       ├─→ Receive Reset Link
       ├─→ Set New Password
       └─→ Redirect to Login
```

### Land Leasing Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    LAND LEASING FLOW                          │
└──────────────────────────────────────────────────────────────┘

Owner Posts Land               Lessee Leases Land
      │                              │
      ├─→ Fill Land Details          ├─→ Browse Lands
      ├─→ Upload Images              ├─→ Apply Filters
      ├─→ Upload Documents           ├─→ View Land Details
      ├─→ Submit                     ├─→ Click "Lease"
      │                              ├─→ Select Duration
      │                              ├─→ Review Terms
      ↓                              ├─→ Initiate M-Pesa Payment
Admin Verifies                       │   ├─→ Enter Phone
      │                              │   ├─→ STK Push
      ├─→ Check Documents            │   └─→ Enter PIN
      ├─→ Verify with ArdhiSasa      │
      ├─→ Approve/Reject             ↓
      │                         Payment to Escrow
      ↓                              │
Land Status: AVAILABLE               ├─→ Funds Held
      │                              └─→ Lease Activated
      │                                   │
      │                                   ↓
      └─────────────────────────────→ Lease Active
                                          │
                                          ├─→ Lessee Uses Land
                                          ├─→ Owner Receives Payment
                                          └─→ Platform Gets Commission
```

### Payment & Escrow Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   PAYMENT & ESCROW FLOW                       │
└──────────────────────────────────────────────────────────────┘

Lessee Initiates Payment
   │
   ├─→ Total Amount Calculated
   │   ├─→ Land Price
   │   └─→ + Platform Commission (%)
   │
   ├─→ M-Pesa Integration
   │   ├─→ STK Push to Lessee Phone
   │   ├─→ Lessee Enters M-Pesa PIN
   │   └─→ Payment Confirmed
   │
   ├─→ Funds Go to Escrow
   │   └─→ Status: HELD
   │
   ├─→ Conditions Met?
   │   ├─→ Lease Terms Accepted
   │   ├─→ Land Verified
   │   └─→ Both Parties Agree
   │
   └─→ Release Funds
       ├─→ Owner Receives Payment
       ├─→ Platform Takes Commission
       └─→ Receipt Generated
```

### AI Crop Recommendation Flow

```
┌──────────────────────────────────────────────────────────────┐
│               AI CROP RECOMMENDATION FLOW                     │
└──────────────────────────────────────────────────────────────┘

Lessee Requests Recommendations
   │
   ├─→ Input Data
   │   ├─→ Select Location
   │   ├─→ Soil Type (from land or manual)
   │   └─→ Land Size
   │
   ├─→ System Gathers Data
   │   ├─→ Fetch Weather Data (API)
   │   │   ├─→ Temperature
   │   │   ├─→ Rainfall
   │   │   └─→ Climate Patterns
   │   ├─→ Soil Properties
   │   └─→ Location Data
   │
   ├─→ Gemini AI Processes
   │   ├─→ Analyze Conditions
   │   ├─→ Match with Crop Database
   │   └─→ Generate Recommendations
   │
   └─→ Display Results
       ├─→ Recommended Crops
       │   ├─→ Suitability Score
       │   ├─→ Expected Yield
       │   ├─→ Growing Season
       │   └─→ Tips & Advice
       └─→ Save Recommendations
```

---

## 📊 Data Flow Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                      DATA FLOW ARCHITECTURE                     │
└────────────────────────────────────────────────────────────────┘

Frontend (React)
   │
   ├─→ User Action (Click, Submit, etc.)
   │
   ├─→ Component Event Handler
   │
   ├─→ Service Layer (services/*.js)
   │   ├─→ API Client (apiClient.js)
   │   │   ├─→ Add JWT Token
   │   │   └─→ Set Headers
   │   │
   │   └─→ HTTP Request
   │       │
   │       ↓
   │   Backend API (Django)
   │       │
   │       ├─→ Authenticate
   │       ├─→ Validate Data
   │       ├─→ Process Request
   │       ├─→ Database Operations
   │       └─→ Return Response
   │           │
   │           ↓
   ├─→ Response Received
   │   ├─→ Success? → Update State
   │   └─→ Error? → Show Error
   │
   └─→ Re-render Component
       └─→ Display Updated UI
```

---

## 🔐 Authentication State Flow

```
┌────────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION STATE FLOW                     │
└────────────────────────────────────────────────────────────────┘

App Loads
   │
   ├─→ Check localStorage
   │   ├─→ Token Exists?
   │   │   ├─→ Yes → Validate Token
   │   │   │         ├─→ Valid → Set User State
   │   │   │         └─→ Invalid → Clear Storage
   │   │   └─→ No → User = null
   │   │
   │   └─→ AuthContext Provides:
   │       ├─→ user (object or null)
   │       ├─→ isAuthenticated (boolean)
   │       ├─→ login() function
   │       ├─→ logout() function
   │       └─→ userRole (string)
   │
   └─→ Route Protection
       ├─→ Public Routes → Allow All
       ├─→ Auth Routes → Redirect if logged in
       └─→ Protected Routes
           ├─→ Check isAuthenticated
           │   ├─→ No → Redirect to Login
           │   └─→ Yes → Check Role
           │       ├─→ Allowed → Render Page
           │       └─→ Not Allowed → Redirect
```

---

**This flow diagram helps understand the complete user journey and system interactions.**

*For implementation details, see DEVELOPER_GUIDE.md*
