# Agro-Dealer Compliance Oversight Page - React Native

This is a comprehensive **Agro-Dealer Compliance Oversight** page for the FarmLease Admin Console, built with **React Native** and styled using **NativeWind (Tailwind CSS)**.

## 📁 Files Created

### Main Page
- **`frontend/src/pages/admin/AgroDealerOversightPage.jsx`** - Main page component

### Supporting Components
- **`frontend/src/components/admin/ComplianceStatCard.jsx`** - Stats card component for displaying compliance metrics
- **`frontend/src/components/admin/DealerViolationRow.jsx`** - Table row component for displaying dealer violations

## 🎨 Design Features

### Layout
- **Sidebar Navigation** - Uses existing `AdminSidebar` component with "Agro-Dealer Oversight" as active route
- **Responsive Design** - Optimized for various screen sizes
- **Scrollable Content** - Main content area with vertical scrolling
- **Tab Navigation** - Switch between "Active Violations" and "Compliance History"

### Key Sections

#### 1. **Header Section**
- Title with description
- Search input field
- Export Compliance Log button

#### 2. **Tab Navigation**
- Active Violations (default)
- Compliance History

#### 3. **Statistics Cards** (4 cards)
- **Active Dealers** - Shows total dealers and compliant count (Green theme)
- **Avg Compliance Score** - Shows percentage with target (Blue theme)
- **Under Investigation** - Shows count with warning (Yellow theme)
- **Flagged Listings** - Shows count with urgency indicator (Red theme)

#### 4. **Compliance Violations Table**
Displays dealer violations with:
- **Dealer Name** - Avatar, name, ID, and violation type
- **Ratings** - Star rating with review count
- **Flag Frequency** - Badge showing violation severity (3rd Violation, 1st Warning, Repeat, Severe)
- **Total Products** - Count of products
- **Flagged Items** - Active button or count
- **Status** - Status badge (Under Review, Warning Sent, Suspended, Severe Violation)
- **Actions** - Message, Investigate, and Suspend buttons

## 🎨 Color Scheme

The page uses the FarmLease color palette with compliance-specific colors:

```javascript
{
  primary: '#13ec80',           // Bright green
  'primary-dark': '#047857',    // Emerald green
  'forest-green': '#0f392b',    // Deep forest green
  'earth-brown': '#5D4037',     // Earthy brown
  'background-light': '#f8fafc', // Light background
  
  // Compliance-specific colors
  green: '#047857',  // Compliant
  blue: '#2563EB',   // Score
  yellow: '#CA8A04', // Warning
  red: '#DC2626',    // Violations
  orange: '#EA580C', // Alert
  gray: '#6B7280'    // Suspended
}
```

## 🔧 Component Props

### ComplianceStatCard
```jsx
<ComplianceStatCard
  title="Active Dealers"
  value="142"
  subtitle="138 Fully Compliant"
  icon="store"
  iconBg="bg-green-50"
  iconColor="#047857"
  subtitleIcon="check-circle"     // Optional
  subtitleBg="bg-green-50"        // Optional
  subtitleColor="text-[#047857]"
/>
```

### DealerViolationRow
```jsx
<DealerViolationRow
  dealer={dealerData}
  onInvestigate={(dealer) => { /* handle investigate */ }}
  onSuspend={(dealer, type) => { /* handle suspend */ }}
  onMessage={(dealer) => { /* handle message */ }}
/>
```

## 📊 Data Structure

Each dealer item should have the following structure:

```javascript
{
  id: 1,
  name: "GreenHarvest Supplies",
  dealerId: "#DL-4402",
  initials: "GH",
  avatarBg: "bg-[#8d6e63]",
  violation: "Counterfeit Report",
  violationType: "severe",        // 'severe' | 'warning' | 'minor'
  rating: 3.2,
  ratingCount: 45,
  flagFrequency: "3rd Violation",
  flagType: "red",                // 'red' | 'yellow' | 'gray' | 'red-severe'
  totalProducts: 12,
  flaggedItems: 3,
  status: "under-review",         // 'under-review' | 'warning-sent' | 'suspended' | 'severe-violation'
  statusLabel: "Under Review",
  hasAlert: true,                 // Shows pulsing red dot
  highlighted: true               // Shows background color
}
```

## 🚀 Usage

### Basic Implementation

```jsx
import AgroDealerOversightPage from './pages/admin/AgroDealerOversightPage';

// In your navigation or main app
<AgroDealerOversightPage />
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
        name="AgroDealerOversight" 
        component={AgroDealerOversightPage} 
      />
    </Stack.Navigator>
  );
}
```

## 🔌 API Integration

To connect with your backend, modify the page to fetch real data:

```jsx
import { useState, useEffect } from 'react';
import { fetchDealerViolations, updateDealerStatus } from '../../services/complianceService';

const AgroDealerOversightPage = () => {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDealers();
  }, []);

  const loadDealers = async () => {
    try {
      const data = await fetchDealerViolations();
      setDealers(data);
    } catch (error) {
      console.error('Failed to load dealers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (dealer, type) => {
    try {
      await updateDealerStatus(dealer.id, 'suspended', type);
      await loadDealers(); // Reload data
    } catch (error) {
      console.error('Failed to suspend:', error);
    }
  };

  // Rest of component...
};
```

## 🎯 Features

### Implemented
- ✅ Sidebar navigation
- ✅ Tab navigation (Active Violations / Compliance History)
- ✅ 4 Statistics cards
- ✅ Compliance violations table with all columns
- ✅ Multiple violation status badges
- ✅ Action buttons (Message, Investigate, Suspend)
- ✅ Search input
- ✅ Export button
- ✅ Pulsing alert indicators
- ✅ Responsive layout
- ✅ Color-coded violation severity

### To Be Implemented
- ⏳ Search functionality
- ⏳ Tab switching logic (Compliance History view)
- ⏳ API integration
- ⏳ Modal dialogs for actions
- ⏳ Messaging system
- ⏳ Export functionality
- ⏳ Real-time updates
- ⏳ Pagination

## 📱 Icons

The page uses **@expo/vector-icons** MaterialIcons:

- `store` - Active dealers icon
- `verified` - Compliance score icon
- `manage-search` - Investigation icon
- `report-problem` - Flagged listings icon
- `search` - Search icon
- `file-download` - Export icon
- `star` - Rating icon
- `mail` - Message icon
- `check-circle` - Compliant indicator
- `priority-high` - Urgent indicator

## 🎨 Violation Severity Levels

### Severe (Red)
- Red background highlight
- Red avatar background
- Pulsing alert indicator
- Critical actions required

### Warning (Yellow/Orange)
- Yellow background tint
- Orange/yellow badges
- Moderate urgency

### Minor (Gray)
- No background highlight
- Gray badges
- Suspended or resolved

## 🔄 Action Buttons

### Message Button
- Opens communication with dealer
- Icon-only button
- Available for all dealers

### Investigate Button
- Opens investigation modal/page
- Green accent color
- Available for all dealers

### Suspend Button
- **Suspend Product** - For partial violations
- **Suspend Dealer** - For severe violations
- Red color
- Disabled when already suspended

## 📝 Status Badges

| Status | Color | Description |
|--------|-------|-------------|
| Under Review | Red | Currently being investigated |
| Warning Sent | Orange | Dealer has been warned |
| Suspended | Gray | Account or products suspended |
| Severe Violation | Red | Critical compliance breach |

## 🎨 Flag Frequency Badges

| Type | Color | Examples |
|------|-------|----------|
| Red | Red 100 | "3rd Violation" |
| Yellow | Yellow 100 | "1st Warning" |
| Gray | Gray 100 | "Repeat" |
| Red Severe | Red 800 | "Severe" |

## 🔗 Related Files

- `frontend/src/components/admin/AdminSidebar.jsx` - Navigation sidebar
- `frontend/tailwind.config.native.js` - NativeWind configuration
- `frontend/src/services/complianceService.js` - API service (to be created)

## 🛠️ Development

### Adding New Status Types

```jsx
// In DealerViolationRow.jsx
const getStatusBadgeStyle = (status) => {
  const styles = {
    'under-review': 'bg-red-50 text-red-700 border-red-100',
    'warning-sent': 'bg-orange-50 text-orange-700 border-orange-100',
    'suspended': 'bg-gray-100 text-gray-600 border-gray-200',
    'severe-violation': 'bg-red-100 text-red-700 border-red-200',
    'your-new-status': 'bg-blue-50 text-blue-700 border-blue-100' // Add here
  };
  return styles[status] || styles['under-review'];
};
```

### Customizing Table Columns

Edit the `DealerViolationRow` component to add/remove/modify columns. Make sure to update both the header row and data row in `AgroDealerOversightPage.jsx`.

### Adding Tab Content

```jsx
const AgroDealerOversightPage = () => {
  const [activeTab, setActiveTab] = useState('active');
  
  return (
    <View>
      {activeTab === 'active' && (
        <View>{/* Active Violations Content */}</View>
      )}
      {activeTab === 'history' && (
        <View>{/* Compliance History Content */}</View>
      )}
    </View>
  );
};
```

## 📦 Dependencies

- `react-native` - Core framework
- `@expo/vector-icons` - Icon library
- `nativewind` - Tailwind CSS for React Native

## 🤝 Contributing

When modifying this page:
1. Maintain the existing color scheme
2. Follow the component structure
3. Keep the stat cards consistent
4. Use proper violation severity indicators
5. Test on both iOS and Android if possible

## 🔐 Security Considerations

- Implement proper authorization checks
- Validate all actions server-side
- Log all suspension and investigation actions
- Implement audit trail
- Secure messaging system

## 📊 Performance Tips

1. **Virtualized Lists** - For large dealer lists, consider using `FlatList`:
```jsx
<FlatList
  data={dealers}
  renderItem={({ item }) => (
    <DealerViolationRow dealer={item} {...handlers} />
  )}
  keyExtractor={(item) => item.id.toString()}
/>
```

2. **Memoization** - Use `React.memo` for row components:
```jsx
export default React.memo(DealerViolationRow);
```

3. **Pagination** - Load dealers in batches for better performance

## 🎓 Learning Resources

- [React Native Docs](https://reactnative.dev/)
- [NativeWind Docs](https://www.nativewind.dev/)
- [Expo Docs](https://docs.expo.dev/)

---

**Created for:** FarmLease Admin Console  
**Version:** 1.0.0  
**Last Updated:** February 2026
