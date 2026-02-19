# FarmLease Frontend - Developer Guide

## 📋 Table of Contents
1. [Project Structure](#project-structure)
2. [Setup & Installation](#setup--installation)
3. [Development Workflow](#development-workflow)
4. [Component Guidelines](#component-guidelines)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Styling Guidelines](#styling-guidelines)
8. [Testing](#testing)
9. [Deployment](#deployment)

## 📁 Project Structure

```
frontend/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Images, fonts, icons
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layout/          # Layout components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── DashboardLayout.jsx
│   │   └── features/        # Feature-specific components (TODO)
│   ├── pages/
│   │   ├── public/          # Public pages
│   │   │   └── LandingPage.jsx
│   │   ├── auth/            # Authentication pages
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── owner/           # Farm owner pages
│   │   │   ├── OwnerDashboard.jsx
│   │   │   ├── MyLandsPage.jsx
│   │   │   └── AddLandPage.jsx
│   │   ├── lessee/          # Lessee/farmer pages
│   │   │   ├── LesseeDashboard.jsx
│   │   │   ├── BrowseLandsPage.jsx
│   │   │   ├── LandDetailPage.jsx
│   │   │   └── CropRecommendationPage.jsx
│   │   ├── dealer/          # Agro-dealer pages
│   │   │   ├── DealerDashboard.jsx
│   │   │   ├── MyProductsPage.jsx
│   │   │   └── AddProductPage.jsx
│   │   └── admin/           # Admin pages
│   │       ├── AdminDashboard.jsx
│   │       ├── PendingLandsPage.jsx
│   │       └── UsersListPage.jsx
│   ├── services/            # API service layer
│   │   ├── apiClient.js     # Axios instance with interceptors
│   │   ├── authService.js   # Authentication API calls
│   │   └── landService.js   # Land-related API calls
│   ├── hooks/               # Custom React hooks
│   │   ├── useFetch.jsx     # Data fetching hook
│   │   └── useDebounce.jsx  # Debounce hook
│   ├── context/             # React Context providers
│   │   └── AuthContext.jsx  # Authentication context
│   ├── utils/               # Utility functions
│   │   ├── formatters.js    # Formatting functions
│   │   └── validators.js    # Validation functions
│   ├── constants/           # App constants
│   │   └── index.js         # All constants and enums
│   ├── App.jsx              # Main app with routing
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── README.md                # Project documentation
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+ 
- npm or yarn
- Git

### Initial Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your API keys

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

## 💻 Development Workflow

### 1. Working on a New Feature

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
# Test locally

# Commit with meaningful messages
git add .
git commit -m "feat: add land search functionality"

# Push to remote
git push origin feature/your-feature-name

# Create Pull Request to frontend-dev
```

### 2. Commit Message Convention

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Build process or auxiliary tool changes

### 3. Code Review Checklist
- [ ] Code follows project structure
- [ ] Components are reusable and well-named
- [ ] No console.logs in production code
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Responsive design tested
- [ ] No prop-types warnings

## 🧩 Component Guidelines

### Creating a New Component

```jsx
// ComponentName.jsx
const ComponentName = ({ prop1, prop2, className = '' }) => {
  // State and hooks at the top
  const [state, setState] = useState(initialValue);
  
  // Event handlers
  const handleClick = () => {
    // Handle logic
  };
  
  // Render
  return (
    <div className={`base-classes ${className}`}>
      {/* Component content */}
    </div>
  );
};

export default ComponentName;
```

### Component Best Practices

1. **Single Responsibility**: Each component should do one thing well
2. **Props**: Keep props interface simple and clear
3. **Naming**: Use PascalCase for components, camelCase for functions
4. **File Organization**: One component per file
5. **Reusability**: Make components generic and reusable
6. **Composition**: Use composition over inheritance

### Common Components Usage

```jsx
// Button
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>

// Input
<Input
  label="Email"
  name="email"
  type="email"
  value={email}
  onChange={handleChange}
  error={errors.email}
  required
/>

// Select
<Select
  label="Role"
  name="role"
  options={roleOptions}
  value={role}
  onChange={handleChange}
/>

// Modal
<Modal isOpen={isOpen} onClose={handleClose} title="Modal Title">
  <p>Modal content</p>
</Modal>

// Card
<Card hover padding>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

## 🔐 State Management

### Authentication State (AuthContext)

```jsx
import { useAuth } from '@/context/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // Use auth state
};
```

### Local Component State

```jsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
});

const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};
```

### API Data Fetching

```jsx
import { useFetch } from '@/hooks';
import { landService } from '@/services';

const MyComponent = () => {
  const { data, loading, error, refetch } = useFetch(
    () => landService.getAllLands(),
    []
  );
  
  if (loading) return <Spinner />;
  if (error) return <div>Error: {error}</div>;
  
  return <div>{/* Render data */}</div>;
};
```

## 🌐 API Integration

### Making API Calls

```jsx
import { landService } from '@/services';

// In your component
const handleSubmit = async () => {
  try {
    const result = await landService.createLand(landData);
    toast.success('Land created successfully!');
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Creating New Service

```javascript
// src/services/newService.js
import apiClient from './apiClient';
import { API_ENDPOINTS } from '../constants';

const newService = {
  create: async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.NEW, data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.NEW);
    return response.data;
  },
};

export default newService;
```

### API Error Handling

The `apiClient` handles:
- JWT token refresh automatically
- 401 errors (redirects to login)
- Request/response interceptors
- Error formatting

## 🎨 Styling Guidelines

### Tailwind CSS Classes

Use Tailwind utility classes for styling:

```jsx
// Spacing
<div className="p-4 m-2 space-y-4">

// Layout
<div className="flex items-center justify-between">

// Colors
<div className="bg-primary-600 text-white">

// Responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// Hover states
<button className="hover:bg-primary-700 transition-colors">
```

### Custom Classes

Defined in `index.css`:

```css
.btn-primary
.btn-secondary
.btn-outline
.input-field
.card
```

### Color Palette

```javascript
primary: green shades (agricultural theme)
secondary: yellow/amber shades
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test all form validations
- [ ] Test error states
- [ ] Test loading states
- [ ] Test protected routes
- [ ] Test authentication flows

### Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📦 Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build outputs to `dist/` directory.

## 🚀 Deployment

### Environment Variables

Ensure all environment variables are set in production:
- `VITE_API_BASE_URL`
- `VITE_GEMINI_API_KEY`
- `VITE_WEATHER_API_KEY`
- `VITE_MPESA_CONSUMER_KEY`
- `VITE_MPESA_CONSUMER_SECRET`

### Deploy to Vercel/Netlify

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Build command: `npm run build`
4. Output directory: `dist`

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

## 🤝 Contributing

1. Follow the project structure
2. Write clean, readable code
3. Comment complex logic
4. Test before pushing
5. Keep commits atomic
6. Write meaningful commit messages

## 🆘 Troubleshooting

### Common Issues

**Issue**: Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Port 3000 already in use
```bash
# Change port in vite.config.js or use different port
npm run dev -- --port 3001
```

**Issue**: API calls failing
- Check `.env` file has correct `VITE_API_BASE_URL`
- Ensure backend is running
- Check browser console for CORS errors

---

**Happy Coding! 🚜🌾**
