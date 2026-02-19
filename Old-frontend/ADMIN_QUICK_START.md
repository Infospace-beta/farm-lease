# FarmLease Admin User Management - Quick Start

## 🎯 What's Included

Complete React Native implementation of the Admin User Management dashboard with:
- ✅ Sidebar navigation with Material Icons
- ✅ Statistics cards (Total Users, Farmers, Landowners, Suspended)
- ✅ Search and filter functionality
- ✅ User list with role badges and status indicators
- ✅ Pagination controls
- ✅ Suspend/Unsuspend user actions
- ✅ Export functionality
- ✅ Fully styled with NativeWind (Tailwind CSS)

## 📁 Files Created

```
frontend/
├── src/
│   ├── pages/
│   │   └── admin/
│   │       └── UserManagementPage.jsx       ← Main page
│   └── components/
│       └── admin/
│           ├── AdminSidebar.jsx              ← Navigation sidebar
│           ├── StatCard.jsx                  ← Statistics card
│           └── UserListItem.jsx              ← User row component
├── App.example.admin.jsx                     ← Example integration
├── tailwind.config.native.js                 ← Updated with colors
├── setup-admin-rn.sh                         ← Installation script
├── ADMIN_USER_MANAGEMENT_RN.md              ← Full documentation
└── ADMIN_QUICK_START.md                      ← This file
```

## ⚡ Quick Installation

### Option 1: Automated (macOS/Linux)

```bash
cd frontend
chmod +x setup-admin-rn.sh
./setup-admin-rn.sh
```

### Option 2: Manual

```bash
cd frontend

# Install dependencies
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
npx expo install @expo/vector-icons
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

## 🔧 Configuration

### 1. Update babel.config.js

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'], // ← Add this line
  };
};
```

### 2. Use the Component

**Simple Usage (No Navigation):**
```javascript
// App.jsx
import UserManagementPage from './src/pages/admin/UserManagementPage';

export default function App() {
  return <UserManagementPage />;
}
```

**With Navigation:**
```javascript
// App.jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserManagementPage from './src/pages/admin/UserManagementPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UserManagement" component={UserManagementPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 🚀 Run the App

```bash
# Start development server
npx expo start

# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Press 'w' for web browser (if configured)
```

## 🎨 Component Overview

### UserManagementPage
Main page with sidebar, stats, filters, and user list.

```javascript
<UserManagementPage />
```

### AdminSidebar
Reusable admin navigation sidebar.

```javascript
<AdminSidebar activeRoute="user-management" />
```

### StatCard
Display statistics with icons and percentage changes.

```javascript
<StatCard
  title="Total Active Users"
  value="11,425"
  change="+12%"
  icon="people"
  color="blue"
/>
```

### UserListItem
Individual user row in the list.

```javascript
<UserListItem
  user={{
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'farmer',
    status: 'active',
    joinDate: 'Oct 24, 2023',
    avatar: 'https://...',
  }}
  onViewProfile={(id) => console.log('View', id)}
  onSuspend={(id) => console.log('Suspend', id)}
  onUnsuspend={(id) => console.log('Unsuspend', id)}
/>
```

## 🎯 Features

### ✅ Implemented
- [x] Responsive layout with sidebar
- [x] Statistics cards with icons
- [x] Search input
- [x] Role and status filters
- [x] User list with avatars/initials
- [x] Role badges (Farmer/Landowner)
- [x] Status indicators (Active/Suspended)
- [x] Action buttons (View, Suspend/Unsuspend)
- [x] Pagination controls
- [x] Export button
- [x] Admin profile section
- [x] Logout button

### 🔄 To Implement
- [ ] Connect to backend API
- [ ] Implement actual search functionality
- [ ] Implement filter dropdowns (Picker component)
- [ ] Add loading states
- [ ] Add error handling
- [ ] Implement pagination logic
- [ ] Add user detail modal
- [ ] Add confirmation dialogs

## 🔌 Backend Integration Example

```javascript
// src/services/adminService.js
import axios from 'axios';

const API_BASE = 'http://your-api-url.com/api';

export const adminAPI = {
  // Fetch users with filters
  getUsers: async (page = 1, search = '', role = '', status = '') => {
    const response = await axios.get(`${API_BASE}/admin/users`, {
      params: { page, search, role, status, limit: 10 }
    });
    return response.data;
  },

  // Suspend a user
  suspendUser: async (userId) => {
    const response = await axios.post(`${API_BASE}/admin/users/${userId}/suspend`);
    return response.data;
  },

  // Unsuspend a user
  unsuspendUser: async (userId) => {
    const response = await axios.post(`${API_BASE}/admin/users/${userId}/unsuspend`);
    return response.data;
  },

  // Get statistics
  getStats: async () => {
    const response = await axios.get(`${API_BASE}/admin/stats`);
    return response.data;
  },

  // Export users
  exportUsers: async (format = 'csv') => {
    const response = await axios.get(`${API_BASE}/admin/users/export`, {
      params: { format }
    });
    return response.data;
  },
};
```

Then update `UserManagementPage.jsx`:

```javascript
import { useEffect, useState } from 'react';
import { adminAPI } from '../../services/adminService';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData] = await Promise.all([
        adminAPI.getUsers(),
        adminAPI.getStats(),
      ]);
      setUsers(usersData.users);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of component
};
```

## 🎨 Customization

### Change Colors

Edit [tailwind.config.native.js](tailwind.config.native.js):

```javascript
colors: {
  primary: '#13ec80',      // Your primary color
  'forest-green': '#0f392b', // Sidebar background
  earth: '#5D4037',        // Heading color
}
```

### Add Menu Items

Edit `AdminSidebar.jsx` menuItems array:

```javascript
const menuItems = [
  // ... existing items
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: 'analytics', 
    route: 'analytics' 
  },
];
```

### Modify Stats Cards

Edit `UserManagementPage.jsx` stats array to add/remove cards.

## 📱 Screen Requirements

- **Minimum Width**: 768px (tablet)
- **Recommended**: 1024px or larger
- **Orientation**: Landscape preferred

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Icons not showing | Run: `npx expo install @expo/vector-icons` |
| Tailwind not working | Add `nativewind/babel` to babel.config.js |
| Metro bundler error | Run: `npx expo start -c` (clear cache) |
| Navigation error | Install React Navigation dependencies |

## 📖 Full Documentation

For complete details, see [ADMIN_USER_MANAGEMENT_RN.md](ADMIN_USER_MANAGEMENT_RN.md)

## 🔗 Resources

- [NativeWind Docs](https://www.nativewind.dev/)
- [Expo Vector Icons](https://icons.expo.fyi/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Docs](https://reactnative.dev/)

## ✨ What's Next?

1. **Connect to Backend**: Integrate with your Django API
2. **Add More Pages**: Dashboard, Reports, Settings, etc.
3. **Implement Filters**: Add Picker components for dropdowns
4. **Add Modals**: User detail view, confirmation dialogs
5. **State Management**: Consider Redux or Context API
6. **Testing**: Add unit and integration tests

---

**Need Help?** Check the full documentation in `ADMIN_USER_MANAGEMENT_RN.md`

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Platform**: React Native with NativeWind
