# FarmLease Frontend - Project Tree

```
Farm-Lease/
└── frontend/
    ├── 📄 Configuration Files
    │   ├── package.json                 # Dependencies and scripts
    │   ├── vite.config.js              # Vite configuration
    │   ├── tailwind.config.js          # Tailwind CSS configuration
    │   ├── postcss.config.js           # PostCSS configuration
    │   ├── .eslintrc.cjs               # ESLint rules
    │   ├── .env.example                # Environment variables template
    │   └── .gitignore                  # Git ignore rules
    │
    ├── 📄 Documentation Files
    │   ├── README.md                    # Project overview & setup
    │   ├── DEVELOPER_GUIDE.md           # Complete development guide
    │   ├── TODO.md                      # Detailed implementation checklist
    │   ├── API_REFERENCE.md             # Backend API integration guide
    │   ├── SETUP_COMPLETE.md            # Setup summary
    │   └── PROJECT_TREE.md              # This file
    │
    ├── index.html                       # HTML entry point
    │
    └── src/
        ├── 🎯 Entry Points
        │   ├── main.jsx                 # React entry point
        │   ├── App.jsx                  # Main app with routing
        │   └── index.css                # Global styles
        │
        ├── 🎨 Components/
        │   ├── common/                  # Reusable UI components
        │   │   ├── Button.jsx           # ✅ Button component
        │   │   ├── Input.jsx            # ✅ Input field component
        │   │   ├── Select.jsx           # ✅ Dropdown component
        │   │   ├── Modal.jsx            # ✅ Modal dialog
        │   │   ├── Card.jsx             # ✅ Card container
        │   │   ├── Badge.jsx            # ✅ Status badges
        │   │   ├── Spinner.jsx          # ✅ Loading spinner
        │   │   └── ProtectedRoute.jsx   # ✅ Route guard
        │   │
        │   ├── layout/                  # Layout components
        │   │   ├── Navbar.jsx           # ✅ Public navigation
        │   │   ├── Footer.jsx           # ✅ Site footer
        │   │   ├── Sidebar.jsx          # ✅ Dashboard sidebar
        │   │   └── DashboardLayout.jsx  # ✅ Dashboard wrapper
        │   │
        │   └── features/                # Feature-specific components
        │       └── (to be created)
        │
        ├── 📄 Pages/
        │   ├── public/                  # Public pages
        │   │   └── LandingPage.jsx      # ✅ Homepage
        │   │
        │   ├── auth/                    # Authentication pages
        │   │   ├── LoginPage.jsx        # ✅ Login
        │   │   └── RegisterPage.jsx     # ✅ Registration
        │   │
        │   ├── owner/                   # Farm Owner pages
        │   │   ├── OwnerDashboard.jsx   # ✅ Dashboard
        │   │   ├── MyLandsPage.jsx      # ✅ Lands list
        │   │   └── AddLandPage.jsx      # ✅ Add new land
        │   │
        │   ├── lessee/                  # Lessee/Farmer pages
        │   │   ├── LesseeDashboard.jsx         # ✅ Dashboard
        │   │   ├── BrowseLandsPage.jsx         # ✅ Browse lands
        │   │   ├── LandDetailPage.jsx          # ✅ Land details
        │   │   └── CropRecommendationPage.jsx  # ✅ AI recommendations
        │   │
        │   ├── dealer/                  # Agro-Dealer pages
        │   │   ├── DealerDashboard.jsx  # ✅ Dashboard
        │   │   ├── MyProductsPage.jsx   # ✅ Products list
        │   │   └── AddProductPage.jsx   # ✅ Add new product
        │   │
        │   └── admin/                   # Admin pages
        │       ├── AdminDashboard.jsx   # ✅ Dashboard
        │       ├── PendingLandsPage.jsx # ✅ Land verification
        │       └── UsersListPage.jsx    # ✅ User management
        │
        ├── 🔌 Services/                 # API integration layer
        │   ├── index.js                 # ✅ Service exports
        │   ├── apiClient.js             # ✅ Axios instance with interceptors
        │   ├── authService.js           # ✅ Authentication API
        │   └── landService.js           # ✅ Land API
        │
        ├── 🎣 Hooks/                    # Custom React hooks
        │   ├── index.js                 # ✅ Hook exports
        │   ├── useFetch.jsx             # ✅ Data fetching hook
        │   └── useDebounce.jsx          # ✅ Debounce hook
        │
        ├── 🔐 Context/                  # State management
        │   └── AuthContext.jsx          # ✅ Authentication context
        │
        ├── 🛠️ Utils/                    # Utility functions
        │   ├── index.js                 # ✅ Utility exports
        │   ├── formatters.js            # ✅ Formatting functions
        │   └── validators.js            # ✅ Validation functions
        │
        ├── 📊 Constants/                # App-wide constants
        │   └── index.js                 # ✅ All constants & enums
        │
        └── 🖼️ Assets/                   # Static assets
            ├── images/                  # Image files
            └── icons/                   # Icon files


## 📈 Statistics

### Files Created: ~50+
- Configuration: 7 files
- Documentation: 6 files
- Components: 12 files
- Pages: 16 files
- Services: 4 files
- Hooks: 3 files
- Context: 1 file
- Utils: 3 files
- Constants: 1 file

### Code Coverage
- ✅ Project Setup: 100%
- ✅ Base Components: 100%
- ✅ Layout Components: 100%
- ✅ Auth Pages: 100%
- ✅ Dashboard Skeletons: 100%
- ✅ API Layer: 70% (core setup complete)
- ✅ Documentation: 100%

### Next Phase Breakdown
- 🚧 Component Implementation: 0%
- 🚧 API Integration: 30%
- 🚧 Feature Completion: 0%
- 🚧 Testing: 0%

## 🎯 Key Features by Role

### 👨‍🌾 Farm Owner
- ✅ Dashboard with statistics
- ✅ List my lands
- ✅ Add new land (form ready)
- ⏳ Edit land details
- ⏳ Manage leases
- ⏳ View payments

### 🌾 Lessee/Farmer
- ✅ Dashboard with overview
- ✅ Browse available lands
- ✅ View land details
- ✅ AI crop recommendations page
- ⏳ Lease land process
- ⏳ Payment integration
- ⏳ View agro-dealer products

### 🛒 Agro-Dealer
- ✅ Dashboard with business metrics
- ✅ List my products
- ✅ Add new product (form ready)
- ⏳ Edit products
- ⏳ View inquiries
- ⏳ Analytics

### 👨‍💼 Admin
- ✅ System overview dashboard
- ✅ Pending land verifications
- ✅ User management list
- ⏳ Revenue analytics
- ⏳ Reports & moderation
- ⏳ Platform settings

## 📦 Installed Dependencies

### Production
```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.22.0",
  "axios": "^1.6.7",
  "react-hook-form": "^7.50.0",
  "yup": "^1.3.3",
  "react-toastify": "^10.0.4",
  "leaflet": "^1.9.4",
  "react-leaflet": "^4.2.1",
  "lucide-react": "^0.330.0"
}
```

### Development
```json
{
  "@vitejs/plugin-react": "^4.3.1",
  "vite": "^5.3.1",
  "eslint": "^8.57.0",
  "tailwindcss": "^3.4.1",
  "postcss": "^8.4.35",
  "autoprefixer": "^10.4.17"
}
```

## 🚀 Available Scripts

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🌐 Environment Variables

Required in `.env`:
```env
VITE_API_BASE_URL           # Backend API URL
VITE_GEMINI_API_KEY         # Google Gemini API key
VITE_WEATHER_API_KEY        # Weather API key
VITE_MPESA_CONSUMER_KEY     # M-Pesa consumer key
VITE_MPESA_CONSUMER_SECRET  # M-Pesa consumer secret
```

## 🎨 Design Tokens

### Colors
- Primary: Green (#22c55e, #16a34a, #15803d)
- Secondary: Yellow/Amber (#f59e0b, #d97706)
- Success: Green
- Warning: Yellow
- Danger: Red
- Info: Blue

### Spacing Scale
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### Typography
- Font Family: Inter (Google Fonts)
- Headings: Bold, larger sizes
- Body: Regular weight

## 🔄 Git Branches

```
main                    # Production
  └── frontend-dev      # Main development (CURRENT ✓)
      └── feature/*     # Individual features
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ✅ Quality Checks

- [x] ESLint configured
- [x] Responsive design framework
- [x] Component reusability
- [x] Code organization
- [x] Documentation complete
- [x] Git setup
- [ ] Unit tests (to be added)
- [ ] E2E tests (to be added)

## 🎓 Developer Resources

All within this repository:
1. README.md - Quick start
2. DEVELOPER_GUIDE.md - Comprehensive guide
3. TODO.md - Task breakdown
4. API_REFERENCE.md - API documentation
5. SETUP_COMPLETE.md - Summary

---

**Status: ✅ SETUP COMPLETE - READY FOR DEVELOPMENT**

*Last Updated: February 6, 2026*
```
