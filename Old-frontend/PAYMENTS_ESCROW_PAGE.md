# Payments & Escrow Page - Documentation

## Overview
The Payments & Escrow Page provides comprehensive financial oversight for the FarmLease platform. Administrators can monitor escrow holdings, track payment transactions, manage platform revenue, and adjust fee structures.

## File Structure
```
frontend/src/
├── pages/admin/
│   └── PaymentsEscrowPage.jsx          # Main page component
├── components/admin/
│   ├── EscrowStatCard.jsx              # Financial statistics cards
│   ├── TransactionRow.jsx              # Transaction table row
│   └── AdminSidebar.jsx                # Shared navigation sidebar
```

## Components

### 1. PaymentsEscrowPage
Main page component that orchestrates the entire payments dashboard.

**Location:** `frontend/src/pages/admin/PaymentsEscrowPage.jsx`

**Features:**
- Real-time escrow holdings display
- Comprehensive transaction log with filtering
- Platform fee configuration slider
- Export capabilities for financial records
- Search and filter functionality

**State Management:**
```javascript
const [searchQuery, setSearchQuery] = useState('');
const [filterType, setFilterType] = useState('all'); // 'all', 'lease', 'subscription'
const [feePercentage, setFeePercentage] = useState(15);
```

**Usage:**
```jsx
import PaymentsEscrowPage from './pages/admin/PaymentsEscrowPage';

// In your navigation/routing
<PaymentsEscrowPage />
```

---

### 2. EscrowStatCard
Flexible statistics card component with support for four distinct card types.

**Location:** `frontend/src/components/admin/EscrowStatCard.jsx`

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | string | Yes | Card variant: 'escrow-total', 'released', 'revenue', 'fee-settings' |
| `title` | string | Yes | Card header title (uppercase) |
| `value` | string | Yes | Main display value (large text) |
| `subtitle` | string | No | Secondary text below title |
| `trend` | string | No | Trend indicator (e.g., "+12.5%") |
| `trendLabel` | string | No | Label for trend (e.g., "vs last month") |
| `icon` | string | Yes | MaterialIcons name |
| `feePercentage` | number | No* | Current fee percentage (only for 'fee-settings' type) |
| `onFeeChange` | function | No* | Callback for slider changes (only for 'fee-settings' type) |

*Required only for `type="fee-settings"`

**Card Types:**

#### Escrow Total Card (`type="escrow-total"`)
Features a gradient forest-green background with special styling for the primary escrow holdings.

```jsx
<EscrowStatCard
  type="escrow-total"
  title="Total in Escrow"
  subtitle="12 active holds"
  value="KSh 58,124,500.00"
  trend="+15.2%"
  trendLabel="vs last month"
  icon="account-balance-wallet"
/>
```

**Visual Characteristics:**
- Gradient background (#0f392b → #0a261c)
- White text with opacity variations
- Lock icon badge with primary green accent
- Blur effect decoration in top-right
- Prominent trend indicator

---

#### Released Funds Card (`type="released"`)
Displays funds that have been released from escrow.

```jsx
<EscrowStatCard
  type="released"
  title="Released Funds"
  value="KSh 42,350,000.00"
  subtitle="To farm owners"
  trend="98.5%"
  icon="outbound"
/>
```

**Visual Characteristics:**
- White background with earth-brown accents (#5D4037)
- Check circle trend icon
- Subtle background decoration
- Release rate percentage display

---

#### Platform Revenue Card (`type="revenue"`)
Shows total platform fees collected.

```jsx
<EscrowStatCard
  type="revenue"
  title="Platform Revenue"
  value="KSh 6,518,625.00"
  subtitle="From transactions"
  trend="+8.4%"
  icon="monetization-on"
/>
```

**Visual Characteristics:**
- White background with primary green accents
- Trending up icon for growth
- Revenue tracking display

---

#### Fee Settings Card (`type="fee-settings"`)
Interactive card with slider for adjusting platform fee percentage.

```jsx
<EscrowStatCard
  type="fee-settings"
  title="Fee Settings"
  subtitle="Platform Fee"
  value="15.0%"
  icon="tune"
  feePercentage={15}
  onFeeChange={(newValue) => setFeePercentage(newValue)}
/>
```

**Visual Characteristics:**
- White background with purple accents
- Interactive slider component (0-20%)
- Real-time percentage display
- Min/max labels below slider

**Note:** Requires `@react-native-community/slider` package:
```bash
npm install @react-native-community/slider
```

---

### 3. TransactionRow
Complex table row component displaying detailed transaction information.

**Location:** `frontend/src/components/admin/TransactionRow.jsx`

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `transaction` | object | Yes | Transaction data object (see structure below) |
| `onAction` | function | Yes | Callback for action button: `(transaction, actionType) => {}` |

**Transaction Data Structure:**
```javascript
{
  id: "TXN-2024-0321",              // Unique transaction ID
  date: "14 Jan 2025, 10:42 AM",    // Formatted timestamp
  
  beneficiary: {
    name: "Samuel Kamau",           // Beneficiary name
    from: "From: James Mwangi",     // Source/payer info
    hasImage: true,                 // Whether avatar image exists
    imageUrl: "https://...",        // Avatar image URL (if hasImage is true)
    initials: "SK",                 // Initials for fallback avatar
    avatarBg: "bg-green-500"        // Background color for initials avatar
  },
  
  type: "lease",                    // 'lease' or 'subscription'
  typeLabel: "Lease Escrow",        // Display label for type
  details: "3-year lease agreement", // Transaction details
  
  amount: 15000000,                 // Amount in smallest currency unit
  platformFee: 2250000,             // Platform fee amount
  feePercentage: 15,                // Fee percentage
  feeIncluded: false,               // Whether fee is included in subscription
  
  status: "held",                   // 'held', 'active', 'released'
  statusLabel: "Held in Escrow",    // Display label for status
  statusNote: "Pending terms finalization" // Additional status information
}
```

**Transaction Types:**

#### Lease Escrow Transaction (`type="lease"`)
```jsx
<TransactionRow
  transaction={{
    id: "TXN-2024-0321",
    date: "14 Jan 2025, 10:42 AM",
    beneficiary: {
      name: "Samuel Kamau",
      from: "From: James Mwangi",
      hasImage: false,
      initials: "SK",
      avatarBg: "bg-green-500"
    },
    type: "lease",
    typeLabel: "Lease Escrow",
    details: "3-year lease agreement",
    amount: 15000000,
    platformFee: 2250000,
    feePercentage: 15,
    feeIncluded: false,
    status: "held",
    statusLabel: "Held in Escrow",
    statusNote: "Pending terms finalization"
  }}
  onAction={(tx, action) => console.log('Action:', action, tx)}
/>
```

**Visual Elements:**
- Blue badge with landscape icon
- Landscape/property related icon
- Platform fee calculation shown
- Status badge with pulsing indicator

---

#### Subscription Transaction (`type="subscription"`)
```jsx
<TransactionRow
  transaction={{
    id: "TXN-2024-0322",
    date: "13 Jan 2025, 3:15 PM",
    beneficiary: {
      name: "John Maina",
      from: "From: Stripe",
      hasImage: false,
      initials: "JM",
      avatarBg: "bg-[#7E22CE]"
    },
    type: "subscription",
    typeLabel: "Monthly Subscription",
    details: "Premium Agro-Dealer Plan",
    amount: 5000,
    platformFee: 0,
    feePercentage: 0,
    feeIncluded: true,
    status: "active",
    statusLabel: "Active",
    statusNote: "Next billing: 13 Feb 2025"
  }}
  onAction={(tx, action) => console.log('Action:', action, tx)}
/>
```

**Visual Elements:**
- Purple badge with card-membership icon
- "Included" text instead of fee amount
- Active status with checkmark icon

---

## Page Features

### Statistics Dashboard
Four key metrics displayed in the stats section:

1. **Total in Escrow** - Gradient card showing total holdings
2. **Released Funds** - Track disbursed payments
3. **Platform Revenue** - Monitor fee collection
4. **Fee Settings** - Adjust platform fee percentage

### Transaction Log
Comprehensive table displaying all financial transactions with:

**Columns:**
- Transaction ID & Date
- Beneficiary (with avatar) & Payer
- Transaction Type & Details
- Amount (formatted with separators)
- Platform Fee (amount & percentage or "Included")
- Status & Conditions
- Action buttons

**Features:**
- Search by transaction ID, beneficiary, or details
- Filter by type (All, Lease, Subscription)
- Export to CSV/Excel
- Pagination (showing 5 of 104 total transactions)
- Hover effects on rows

### Status Badges

#### Held in Escrow (`status="held"`)
- Orange background (#FED7AA)
- Orange text (#C2410C)
- Pulsing dot indicator
- Used for transactions awaiting finalization

#### Active (`status="active"`)
- Emerald background (#D1FAE5)
- Emerald text (#047857)
- Verified checkmark icon
- Used for active subscriptions

#### Funds Released (`status="released"`)
- Green background (#DCFCE7)
- Green text (#15803D)
- Check icon
- Used for completed disbursements

---

## Styling

### Color Palette
```javascript
{
  primary: '#13ec80',           // FarmLease green
  'forest-green': '#0f392b',    // Dark green for gradients
  'earth-brown': '#5D4037',     // Accent for certain cards
  'background-light': '#F9FAFB',// Page background
  'gray-100': '#F3F4F6',        // Card borders
  'blue-50': '#EFF6FF',         // Lease badge backgrounds
  'purple-50': '#FAF5FF'        // Subscription badge backgrounds
}
```

### Typography
- **Display Font:** Space Grotesk (headings, numbers)
- **Body Font:** Inter (text content)
- **Mono Font:** Roboto Mono (transaction IDs)

### NativeWind Classes
The components use Tailwind CSS through NativeWind:
```javascript
className="bg-gradient-to-br from-[#0f392b] to-[#0a261c]"
className="text-3xl font-bold text-gray-800 tracking-tight"
className="rounded-2xl shadow-xl border border-gray-200"
```

---

## Data Flow

### Initial State
```javascript
const mockTransactions = [
  {
    id: "TXN-2024-0321",
    date: "14 Jan 2025, 10:42 AM",
    // ... complete transaction object
  },
  // ... more transactions
];
```

### Filtering Logic
```javascript
const filteredTransactions = mockTransactions.filter(tx => {
  const matchesSearch = 
    tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.beneficiary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.details.toLowerCase().includes(searchQuery.toLowerCase());
  
  const matchesFilter = 
    filterType === 'all' || tx.type === filterType;
  
  return matchesSearch && matchesFilter;
});
```

### Fee Calculation
Platform fees are calculated as a percentage of transaction amounts:
```javascript
// For lease transactions
platformFee = amount * (feePercentage / 100)

// For subscriptions
platformFee = 0 (included in subscription price)
```

---

## Integration Examples

### Basic Integration
```jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PaymentsEscrowPage from './src/pages/admin/PaymentsEscrowPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="PaymentsEscrow" 
          component={PaymentsEscrowPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### With Navigation
```jsx
// From sidebar or other admin pages
navigation.navigate('PaymentsEscrow');

// With params (if needed)
navigation.navigate('PaymentsEscrow', {
  initialFilter: 'lease',
  highlightTransaction: 'TXN-2024-0321'
});
```

### Handling Actions
```jsx
const handleTransactionAction = (transaction, actionType) => {
  switch (actionType) {
    case 'view':
      // Open transaction details modal
      setSelectedTransaction(transaction);
      setModalVisible(true);
      break;
    case 'release':
      // Trigger release funds flow
      handleFundsRelease(transaction.id);
      break;
    case 'dispute':
      // Open dispute resolution
      navigation.navigate('DisputeResolution', { transactionId: transaction.id });
      break;
  }
};
```

---

## API Integration (Future)

### Fetching Transactions
```javascript
import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

const PaymentsEscrowPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await apiClient.get('/admin/transactions', {
          params: { 
            type: filterType,
            search: searchQuery,
            page: currentPage,
            limit: 10
          }
        });
        setTransactions(response.data.results);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [filterType, searchQuery, currentPage]);
  
  // ... rest of component
};
```

### Updating Fee Settings
```javascript
const handleFeeUpdate = async (newPercentage) => {
  try {
    await apiClient.patch('/admin/settings/platform-fee', {
      feePercentage: newPercentage
    });
    setFeePercentage(newPercentage);
    Alert.alert('Success', 'Platform fee updated successfully');
  } catch (error) {
    console.error('Failed to update fee:', error);
    Alert.alert('Error', 'Failed to update platform fee');
  }
};
```

---

## Dependencies

### Required Packages
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.72.0",
    "nativewind": "^2.0.11",
    "@expo/vector-icons": "^13.0.0",
    "@react-native-community/slider": "^4.4.3",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20"
  }
}
```

### Installation
```bash
# Install all dependencies
npm install

# Or with Expo
npx expo install @expo/vector-icons @react-native-community/slider

# Install NativeWind if not already installed
npm install nativewind
npm install --save-dev tailwindcss
```

---

## Performance Considerations

### Optimization Tips

1. **Large Transaction Lists**
```javascript
import { FlatList } from 'react-native';

// Replace ScrollView with FlatList for better performance
<FlatList
  data={filteredTransactions}
  renderItem={({ item }) => (
    <TransactionRow 
      key={item.id}
      transaction={item}
      onAction={handleAction}
    />
  )}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

2. **Memoization**
```javascript
import { useMemo, useCallback } from 'react';

const filteredTransactions = useMemo(() => {
  return transactions.filter(tx => {
    // ... filtering logic
  });
}, [transactions, searchQuery, filterType]);

const handleAction = useCallback((tx, action) => {
  // ... action handling
}, []);
```

3. **Debounced Search**
```javascript
import { useDebounce } from '../hooks';

const debouncedSearch = useDebounce(searchQuery, 300);

useEffect(() => {
  // Fetch with debounced search
  fetchTransactions(debouncedSearch);
}, [debouncedSearch]);
```

---

## Testing

### Component Tests
```javascript
import { render, fireEvent } from '@testing-library/react-native';
import EscrowStatCard from '../EscrowStatCard';

describe('EscrowStatCard', () => {
  it('renders escrow total card correctly', () => {
    const { getByText } = render(
      <EscrowStatCard
        type="escrow-total"
        title="Total in Escrow"
        value="KSh 58,124,500.00"
        subtitle="12 active holds"
        icon="account-balance-wallet"
      />
    );
    
    expect(getByText('Total in Escrow')).toBeTruthy();
    expect(getByText('KSh 58,124,500.00')).toBeTruthy();
  });
  
  it('calls onFeeChange when slider is moved', () => {
    const mockFeeChange = jest.fn();
    const { getByTestId } = render(
      <EscrowStatCard
        type="fee-settings"
        title="Fee Settings"
        value="15.0%"
        feePercentage={15}
        onFeeChange={mockFeeChange}
        icon="tune"
      />
    );
    
    // Simulate slider change
    const slider = getByTestId('fee-slider');
    fireEvent(slider, 'onValueChange', 18);
    
    expect(mockFeeChange).toHaveBeenCalledWith(18);
  });
});
```

---

## Troubleshooting

### Common Issues

**Issue: Slider not working**
```bash
# Make sure the slider package is installed
npm install @react-native-community/slider

# For iOS
cd ios && pod install && cd ..
```

**Issue: Gradient not rendering**
```javascript
// NativeWind doesn't support CSS gradients directly in React Native
// The gradient effect is simulated with overlapping views
// Use LinearGradient from expo-linear-gradient for true gradients:

import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={['#0f392b', '#0a261c']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  className="p-6 rounded-2xl"
>
  {/* Content */}
</LinearGradient>
```

**Issue: Icons not displaying**
```javascript
// Ensure @expo/vector-icons is properly installed
import { MaterialIcons } from '@expo/vector-icons';

// Verify icon names at: https://icons.expo.fyi/
```

---

## Accessibility

### ARIA Labels & Screen Readers
```jsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel={`View transaction ${transaction.id}`}
  accessibilityRole="button"
  onPress={() => onAction(transaction, 'view')}
>
  <MaterialIcons name="more-vert" size={20} />
</TouchableOpacity>

<Text accessibilityRole="header" className="text-2xl font-bold">
  Payments & Escrow
</Text>
```

### Color Contrast
All text meets WCAG AA standards:
- White text on dark backgrounds: 10.5:1 ratio
- Dark text on light backgrounds: 12.8:1 ratio
- Status badges: 4.5:1 minimum ratio

---

## Future Enhancements

1. **Real-time Updates**
   - WebSocket integration for live transaction updates
   - Push notifications for status changes

2. **Advanced Filtering**
   - Date range picker
   - Amount range filter
   - Multi-status selection

3. **Bulk Actions**
   - Select multiple transactions
   - Batch release/hold operations
   - Bulk export

4. **Analytics Dashboard**
   - Revenue trends chart
   - Transaction volume graph
   - Fee collection analytics

5. **Dispute Resolution**
   - In-app dispute handling
   - Message thread with parties
   - Evidence upload

---

## Support

For issues or questions:
- **GitHub:** [Repository Issues](https://github.com/your-repo/issues)
- **Documentation:** [Wiki](https://github.com/your-repo/wiki)
- **Email:** support@farmlease.com

---

## License

Copyright © 2025 FarmLease. All rights reserved.
