# Admin User Management Page - React Native with NativeWind

This is a React Native implementation of the Admin User Management dashboard using NativeWind (Tailwind CSS for React Native).

## 📋 Overview

The User Management page allows administrators to:
- View all registered users (Farmers and Landowners)
- Search and filter users by role and status
- View user statistics and metrics
- Suspend/unsuspend user accounts
- Export user data
- Navigate through pagination

## 🎨 Features

- **Responsive Design**: Optimized for tablets and large screens
- **Glass-morphism Effects**: Modern UI with backdrop blur effects
- **Icon Integration**: Material Icons via @expo/vector-icons
- **Smooth Interactions**: TouchableOpacity for all interactive elements
- **Custom Components**: Reusable sidebar, stat cards, and user list items

## 📁 File Structure

```
frontend/src/
├── pages/
│   └── admin/
│       └── UserManagementPage.jsx    # Main page component
└── components/
    └── admin/
        ├── AdminSidebar.jsx           # Sidebar navigation
        ├── StatCard.jsx               # Statistics card component
        └── UserListItem.jsx           # User list row component
```

## 🚀 Installation

### Prerequisites

1. **React Native Project**: Set up with Expo or React Native CLI
2. **Node.js**: Version 14 or higher

### Step 1: Install NativeWind and Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install NativeWind
npm install nativewind

# Install Tailwind CSS (specific version for compatibility)
npm install --save-dev tailwindcss@3.3.2

# Install Expo Vector Icons (if using Expo)
npx expo install @expo/vector-icons

# For bare React Native, use:
# npm install react-native-vector-icons
```

### Step 2: Configure Tailwind CSS

The `tailwind.config.native.js` file is already configured with FarmLease colors:

```javascript
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#13ec80',
        'primary-dark': '#047857',
        'forest-green': '#0f392b',
        earth: '#5D4037',
        'background-light': '#f8fafc',
      },
    },
  },
  plugins: [],
};
```

### Step 3: Configure Babel

Update your `babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
```

### Step 4: Update Your App Entry Point

```javascript
// App.jsx or App.tsx
import React from 'react';
import UserManagementPage from './src/pages/admin/UserManagementPage';

export default function App() {
  return <UserManagementPage />;
}
```

## 🎯 Component Usage

### UserManagementPage

The main page component that includes:
- Admin sidebar navigation
- Statistics cards
- Search and filter functionality
- User list with pagination

```javascript
import UserManagementPage from './src/pages/admin/UserManagementPage';

// Use in your navigation or app entry
<UserManagementPage />
```

### AdminSidebar

Reusable sidebar with navigation items and admin profile:

```javascript
import AdminSidebar from './src/components/admin/AdminSidebar';

<AdminSidebar activeRoute="user-management" />
```

**Props:**
- `activeRoute` (string): Current active route to highlight

### StatCard

Display statistics with icon and percentage change:

```javascript
import StatCard from './src/components/admin/StatCard';

<StatCard
  title="Total Active Users"
  value="11,425"
  change="+12%"
  icon="people"
  color="blue"
  isNegative={false}
/>
```

**Props:**
- `title` (string): Card title
- `value` (string): Main statistic value
- `change` (string): Percentage change
- `icon` (string): Material icon name
- `color` (string): Color theme - 'blue', 'emerald', 'amber', 'red'
- `isNegative` (boolean): Whether change is negative

### UserListItem

Individual user row in the list:

```javascript
import UserListItem from './src/components/admin/UserListItem';

<UserListItem
  user={{
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'farmer', // or 'landowner'
    joinDate: 'Oct 24, 2023',
    status: 'active', // or 'suspended'
    avatar: 'https://...',
    // OR
    initials: 'JD', // if no avatar
  }}
  onViewProfile={(userId) => console.log('View', userId)}
  onSuspend={(userId) => console.log('Suspend', userId)}
  onUnsuspend={(userId) => console.log('Unsuspend', userId)}
/>
```

**Props:**
- `user` (object): User data object
- `onViewProfile` (function): Callback when view icon is pressed
- `onSuspend` (function): Callback when suspend icon is pressed
- `onUnsuspend` (function): Callback when unsuspend icon is pressed

## 🎨 Color Scheme

The design uses the FarmLease color palette:

```javascript
colors: {
  primary: '#13ec80',          // Bright green - primary actions
  'primary-dark': '#047857',   // Dark green - hover states
  'forest-green': '#0f392b',   // Deep green - sidebar background
  earth: '#5D4037',            // Brown - text headings
  'background-light': '#f8fafc', // Light gray - page background
}
```

## 📱 Screen Layout

The page is divided into two main sections:

1. **Sidebar (Left)**: 
   - Width: 288px (w-72)
   - Fixed navigation menu
   - Admin profile at bottom

2. **Main Content (Right)**:
   - Flexible width (flex-1)
   - Scrollable content area
   - Header, stats, filters, and user table

## 🔧 Customization

### Adding New Menu Items

Edit `AdminSidebar.jsx`:

```javascript
const menuItems = [
  // ... existing items
  { 
    id: 'new-feature', 
    label: 'New Feature', 
    icon: 'star', 
    route: 'new-feature',
    badge: 5, // optional
    badgeColor: 'red' // optional
  },
];
```

### Modifying Statistics Cards

Edit the `stats` array in `UserManagementPage.jsx`:

```javascript
const stats = [
  {
    id: '1',
    title: 'Your Custom Metric',
    value: '1,234',
    change: '+10%',
    icon: 'trending-up',
    color: 'blue',
  },
  // ... more stats
];
```

### Changing Icon Set

To use a different icon library:

1. Install the library (e.g., `react-native-vector-icons`)
2. Replace `MaterialIcons` imports
3. Update icon names accordingly

## 🚀 Running the App

### For Expo:

```bash
# Start the development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android

# Run on Web (if configured)
npx expo start --web
```

### For React Native CLI:

```bash
# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
```

## 📊 Data Integration

To connect with your backend API:

1. **Create a Users Service**:

```javascript
// src/services/adminService.js
import axios from 'axios';

export const fetchUsers = async (page = 1, search = '', role = '', status = '') => {
  const response = await axios.get('/api/admin/users', {
    params: { page, search, role, status }
  });
  return response.data;
};

export const suspendUser = async (userId) => {
  const response = await axios.post(`/api/admin/users/${userId}/suspend`);
  return response.data;
};

export const unsuspendUser = async (userId) => {
  const response = await axios.post(`/api/admin/users/${userId}/unsuspend`);
  return response.data;
};
```

2. **Update UserManagementPage** to use real data:

```javascript
import { useEffect, useState } from 'react';
import { fetchUsers, suspendUser, unsuspendUser } from '../../services/adminService';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

## 🎯 Navigation Integration

### Using React Navigation

```javascript
// App.jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserManagementPage from './src/pages/admin/UserManagementPage';
import DashboardPage from './src/pages/admin/DashboardPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DashboardPage} />
        <Stack.Screen name="UserManagement" component={UserManagementPage} />
        {/* Add more admin screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 🐛 Troubleshooting

### Issue: Icons Not Showing

**Solution**: Make sure @expo/vector-icons is installed:
```bash
npx expo install @expo/vector-icons
```

### Issue: Tailwind Classes Not Working

**Solution**: 
1. Check `babel.config.js` has the NativeWind plugin
2. Clear Metro cache: `npx expo start -c`
3. Restart the development server

### Issue: Images Not Loading

**Solution**: 
1. Use valid image URLs with HTTPS
2. Add image domains to your app's configuration
3. For local images, use `require()` instead of URI

## 📝 Notes

- **Tablet Optimized**: This layout is best viewed on tablets or devices with wider screens
- **Web Support**: With Expo, this can also run on web browsers
- **Performance**: FlatList is used for efficient rendering of large user lists
- **Accessibility**: Add accessibility labels for screen readers in production

## 🔗 Related Documentation

- [NativeWind Documentation](https://www.nativewind.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
- [React Navigation](https://reactnavigation.org/)

## 📧 Support

For issues or questions, refer to:
- Project README: `frontend/README.md`
- Developer Guide: `frontend/DEVELOPER_GUIDE.md`
- React Native Setup: `frontend/REACT_NATIVE_SETUP.md`

---

**Created for FarmLease Admin Dashboard**  
Version 1.0.0 | February 2026
