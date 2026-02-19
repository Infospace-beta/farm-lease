# Land Verifications Page - React Native

This is a comprehensive **Land Verifications** page for the FarmLease Admin Console, built with **React Native** and styled using **NativeWind (Tailwind CSS)**.

## 📁 Files Created

### Main Page
- **`frontend/src/pages/admin/LandVerificationsPage.jsx`** - Main page component

### Supporting Components
- **`frontend/src/components/admin/VerificationStatCard.jsx`** - Stats card component for displaying verification metrics
- **`frontend/src/components/admin/StatusBadge.jsx`** - Badge component for showing verification status
- **`frontend/src/components/admin/VerificationTableRow.jsx`** - Table row component for displaying verification entries

## 🎨 Design Features

### Layout
- **Sidebar Navigation** - Uses existing `AdminSidebar` component with "Land Verifications" as active route
- **Responsive Design** - Optimized for various screen sizes
- **Scrollable Content** - Main content area with vertical scrolling

### Key Sections

#### 1. **Header Section**
- Title with icon
- Description text
- Search input field
- Filter button

#### 2. **Statistics Cards** (3 cards)
- **Pending Verification** - Shows count of pending verifications (Orange theme)
- **Verified Today** - Shows count of today's verified properties (Green theme)
- **Flagged Discrepancies** - Shows count of flagged items (Red theme)

#### 3. **Verification Queue Table**
Displays land verification entries with:
- **Owner Name** - Name and profile picture/initials
- **Plot ID** - Land registry plot identifier
- **Title Deed Number** - Property title deed number (highlighted column)
- **Region** - Geographic region/county
- **Status** - Verification status badge (Pending/Verified/Flagged)
- **Actions** - Verify and Flag buttons (or View Details for verified items)

#### 4. **Manual Verification Protocol Card**
- Dark green background
- Guidelines for manual verification
- Download PDF button

#### 5. **Quick Filters Panel**
Three checkbox filters:
- Show Pending Only
- High Priority Plots
- Flagged for Fraud

## 🎨 Color Scheme

The page uses the FarmLease color palette:

```javascript
{
  primary: '#13ec80',           // Bright green
  'primary-dark': '#047857',    // Emerald green
  'forest-green': '#0f392b',    // Deep forest green
  'earth': '#5D4037',           // Earthy brown
  'background-light': '#f8fafc' // Light background
}
```

## 🔧 Component Props

### VerificationStatCard
```jsx
<VerificationStatCard
  title="Pending Verification"
  value="12"
  subtitle="Requires manual check"
  icon="pending-actions"
  iconBg="bg-orange-50"
  iconColor="#EA580C"
/>
```

### StatusBadge
```jsx
<StatusBadge 
  status="pending"           // 'pending' | 'verified' | 'flagged'
  isOwnerUpdated={false}     // Shows "Owner Updated" label
/>
```

### VerificationTableRow
```jsx
<VerificationTableRow
  item={verificationData}
  onVerify={(item) => { /* handle verify */ }}
  onFlag={(item) => { /* handle flag */ }}
  onViewDetails={(item) => { /* handle view details */ }}
/>
```

## 📊 Data Structure

Each verification item should have the following structure:

```javascript
{
  id: 1,
  ownerName: "John Doe",
  ownerImage: "https://...",  // Optional, uses initials if not provided
  initials: "JD",            // Used if no image
  avatarBg: "bg-purple-100", // Custom avatar background
  avatarText: "text-purple-600",
  avatarBorder: "border-purple-200",
  submittedTime: "Submitted 2 hrs ago",
  plotId: "LR-4521/11",
  titleDeedNumber: "KJI-9928-XX",
  region: "Kiambu County",
  status: "pending",         // 'pending' | 'verified' | 'flagged'
  isInvalid: false,          // Shows error icon
  isOwnerUpdated: false      // Shows "Owner Updated" badge
}
```

## 🚀 Usage

### Basic Implementation

```jsx
import LandVerificationsPage from './pages/admin/LandVerificationsPage';

// In your navigation or main app
<LandVerificationsPage />
```

### With Navigation

```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="LandVerifications" 
        component={LandVerificationsPage} 
      />
    </Stack.Navigator>
  );
}
```

## 🔌 API Integration

To connect with your backend, modify the page to fetch real data:

```jsx
import { useState, useEffect } from 'react';
import { fetchVerifications } from '../../services/landService';

const LandVerificationsPage = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVerifications();
  }, []);

  const loadVerifications = async () => {
    try {
      const data = await fetchVerifications();
      setVerifications(data);
    } catch (error) {
      console.error('Failed to load verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rest of component...
};
```

## 🎯 Features

### Implemented
- ✅ Sidebar navigation
- ✅ Statistics cards
- ✅ Verification table with all columns
- ✅ Status badges (Pending, Verified, Flagged)
- ✅ Action buttons (Verify, Flag, View Details)
- ✅ Search input
- ✅ Filter button
- ✅ Manual verification protocol card
- ✅ Quick filters panel
- ✅ Pagination controls
- ✅ Responsive layout

### To Be Implemented
- ⏳ Search functionality
- ⏳ Filter logic
- ⏳ API integration
- ⏳ Modal dialogs for verify/flag actions
- ⏳ Copy to clipboard for title deed numbers
- ⏳ Export list functionality
- ⏳ Real-time updates
- ⏳ PDF download for guidelines

## 📱 Icons

The page uses **@expo/vector-icons** MaterialIcons:

- `verified-user` - Main page icon
- `search` - Search icon
- `filter-list` - Filter icon
- `pending-actions` - Pending stat icon
- `check-circle` - Verified stat icon
- `report-problem` - Flagged stat icon
- `refresh` - Refresh button
- `content-copy` - Copy deed number
- `error` - Invalid deed indicator
- `arrow-forward` - View details arrow
- `chevron-left`, `chevron-right` - Pagination

## 🎨 Custom Styling

To customize colors, modify the NativeWind config:

```javascript
// tailwind.config.native.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Add your custom colors here
      }
    }
  }
}
```

## 📝 Notes

1. **Performance**: The table uses `ScrollView` with `nestedScrollEnabled` for smooth scrolling
2. **Images**: Profile images are loaded from URLs with fallback to initials
3. **Touch Feedback**: All interactive elements use `activeOpacity={0.7}` for better UX
4. **Typography**: Uses system fonts with fallback to Playfair Display for headers
5. **Accessibility**: Color contrast ratios meet WCAG AA standards

## 🔗 Related Files

- `frontend/src/components/admin/AdminSidebar.jsx` - Navigation sidebar
- `frontend/tailwind.config.native.js` - NativeWind configuration
- `frontend/src/services/landService.js` - API service (to be created)

## 🛠️ Development

### Adding New Filters

```jsx
const [filters, setFilters] = useState({
  pendingOnly: false,
  highPriority: false,
  flaggedFraud: false,
  newFilter: false  // Add new filter
});

// In the Quick Filters section, add:
<TouchableOpacity 
  className="flex-row items-center gap-2 py-2"
  onPress={() => toggleFilter('newFilter')}
>
  {/* Checkbox UI */}
  <Text>New Filter</Text>
</TouchableOpacity>
```

### Customizing Table Columns

Edit the `VerificationTableRow` component to add/remove/modify columns. Make sure to update both the header row and data row.

## 📦 Dependencies

- `react-native` - Core framework
- `@expo/vector-icons` - Icon library
- `nativewind` - Tailwind CSS for React Native

## 🤝 Contributing

When modifying this page:
1. Maintain the existing color scheme
2. Follow the component structure
3. Keep the stat cards consistent
4. Use the existing `StatusBadge` component for status indicators
5. Test on both iOS and Android if possible

---

**Created for:** FarmLease Admin Console  
**Version:** 1.0.0  
**Last Updated:** February 2026
