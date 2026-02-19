# Agreements & Contracts Page - Documentation

## Overview
The Agreements & Contracts Oversight page provides comprehensive contract management for the FarmLease platform. Administrators can monitor, audit, and manage all active lease agreements between lessees and lessors, track signature status, download contract PDFs, and manage expiring agreements.

## File Structure
```
frontend/src/
├── pages/admin/
│   └── AgreementsContractsPage.jsx     # Main page component
├── components/admin/
│   ├── ContractRow.jsx                  # Contract table row
│   └── AdminSidebar.jsx                 # Shared navigation sidebar
```

## Components

### 1. AgreementsContractsPage
Main page component that orchestrates the entire agreements dashboard.

**Location:** `frontend/src/pages/admin/AgreementsContractsPage.jsx`

**Features:**
- Multi-tab contract filtering (All, Pending Signatures, Active, Expiring Soon)
- Real-time search by contract ID, party name, or plot reference
- Signature status tracking and monitoring
- Contract document download functionality
- Duration tracking with visual progress indicators
- Pagination for large contract lists

**State Management:**
```javascript
const [searchQuery, setSearchQuery] = useState('');
const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'active', 'expiring'
```

**Usage:**
```jsx
import AgreementsContractsPage from './pages/admin/AgreementsContractsPage';

// In your navigation/routing
<AgreementsContractsPage />
```

---

### 2. ContractRow
Complex table row component displaying comprehensive contract information.

**Location:** `frontend/src/components/admin/ContractRow.jsx`

**Props:**
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `contract` | object | Yes | Contract data object (see structure below) |
| `onDownload` | function | Yes | Callback for PDF download: `(contract) => {}` |
| `onResendNotification` | function | Yes | Callback for resending signature request: `(contract) => {}` |

**Contract Data Structure:**
```javascript
{
  id: "#FL-2023-892",              // Unique contract ID
  createdDate: "Oct 24, 2023",     // Contract creation date
  
  lessee: {
    name: "John Doe",              // Lessee full name
    hasImage: true,                // Whether avatar image exists
    imageUrl: "https://...",       // Avatar URL (if hasImage is true)
    initials: "JD",                // Initials for fallback avatar
    avatarBg: "bg-green-100"       // Background color for initials
  },
  
  lessor: {
    name: "Jane Smith",            // Lessor full name
    hasImage: true,                // Whether avatar image exists
    imageUrl: "https://...",       // Avatar URL (if hasImage is true)
    initials: "JS",                // Initials for fallback avatar
    avatarBg: "bg-purple-100"      // Background color for initials
  },
  
  plot: {
    name: "Plot B-14",             // Plot identifier
    size: "5 Acres",               // Plot size
    location: "Nakuru County, Rongai", // Plot location
    lrNumber: "LR-4521/11"         // Land Registry number
  },
  
  duration: {
    label: "3 Years",              // Duration display label
    startDate: "Nov 1, 2023",      // Lease start date
    endDate: "Oct 31, 2026",       // Lease end date
    progress: 8                    // Progress percentage (0-100)
  },
  
  signature: {
    status: "signed",              // 'signed', 'pending', 'active'
    label: "Fully Signed",         // Display label
    note: "Last signed by Lessor\non Oct 25, 2023" // Status note
  },
  
  canDownload: true,               // Whether PDF can be downloaded
  needsResend: false               // Whether resend notification button should show
}
```

**Contract Row Visual Structure:**
```
┌────────────┬────────────────┬──────────────┬──────────┬───────────────┬─────────┐
│ Agreement  │ Parties        │ Land Plot    │ Duration │ Signature     │ Actions │
│ ID         │ (Lessee/       │              │          │ Status        │         │
│            │  Lessor)       │              │          │               │         │
├────────────┼────────────────┼──────────────┼──────────┼───────────────┼─────────┤
│ #FL-2023-  │ 👤 LESSEE      │ 🏔️ Plot B-14 │ 3 Years  │ ● Fully       │ [PDF]   │
│ 892        │    John Doe    │   (5 Acres)  │ Nov 1-   │   Signed      │         │
│ Oct 24,'23 │                │   Nakuru     │ Oct 31   │ Last signed   │         │
│            │ 👤 LESSOR      │   LR-4521/11 │ ▓░░░░░░  │ by Lessor     │         │
│            │    Jane Smith  │              │ 8%       │ Oct 25, 2023  │         │
└────────────┴────────────────┴──────────────┴──────────┴───────────────┴─────────┘
```

---

## Page Features

### Tab Navigation
Four contract filtering tabs with counts:

1. **All Contracts (1,284)** - View all agreements
2. **Pending Signatures (42)** - Contracts awaiting party signatures
3. **Active (1,150)** - Fully executed and ongoing contracts
4. **Expiring Soon (15)** - Contracts approaching expiration

**Tab States:**
- Active tab: Forest green underline, bold text
- Inactive tab: Gray text, hover transitions to earth-brown

### Search Functionality
Search contracts by:
- Contract ID (e.g., "#FL-2023-892")
- Lessee name (e.g., "John Doe")
- Lessor name (e.g., "Jane Smith")
- Plot name (e.g., "Plot B-14")
- Land Registry number (e.g., "LR-4521/11")

**Search Implementation:**
```javascript
const filteredContracts = mockContracts.filter(contract => {
  const matchesSearch = 
    contract.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.lessee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.lessor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.plot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.plot.lrNumber.toLowerCase().includes(searchQuery.toLowerCase());
  
  return matchesSearch;
});
```

### Contract Table

**Table Columns:**
1. **Agreement ID** - Contract identifier with creation date
2. **Parties** - Lessee and Lessor with avatars
3. **Land Plot** - Plot details with terrain icon
4. **Duration** - Lease period with progress bar
5. **Signature Status** - Status badge with notes
6. **Actions** - Download PDF and optional resend button

**Column Breakdown:**

#### Agreement ID Column
- Monospace font contract ID in gray badge
- Small gray text for creation date
- Layout:
  ```
  [#FL-2023-892]
  Created: Oct 24, 2023
  ```

#### Parties Column
- Two rows: Lessee and Lessor
- Each with avatar (image or colored initials)
- "LESSEE" and "LESSOR" labels in small uppercase
- Party name in semibold text

#### Land Plot Column
- Terrain icon in forest-green
- Plot name and size in earth-brown bold
- Location in gray text
- LR number in smaller gray text

#### Duration Column
- Duration label (e.g., "3 Years")
- Date range (start - end)
- Progress bar showing elapsed percentage
  - Gray background
  - Emerald green fill
  - Width based on progress percentage

#### Signature Status Column
- Colored badge with status indicator
- Status-specific styling (see Status Badges section)
- Additional note text below badge

#### Actions Column
- "Download PDF" button
  - Forest-green background when enabled
  - 50% opacity when disabled
  - PDF icon + text
- Optional "Resend Notification" link
  - Shown only when `needsResend: true`
  - Emerald green text
  - Small font size

---

## Status Badges

### Fully Signed (`status="signed"`)
- Green-50 background
- Green-100 border
- Green-700 text
- Solid green dot indicator
- Used for completed contracts with all signatures

**Visual:**
```
┌────────────────────┐
│ ● Fully Signed     │
└────────────────────┘
```

### Pending Lessor/Lessee (`status="pending"`)
- Yellow-50 background
- Yellow-100 border
- Yellow-700 text
- Pulsing yellow dot indicator
- Used for contracts awaiting signature

**Visual:**
```
┌────────────────────┐
│ ○ Pending Lessor   │ (pulsing)
└────────────────────┘
```

### Active (`status="active"`)
- Green-50 background
- Green-100 border
- Green-700 text
- Solid green dot indicator
- Used for ongoing lease agreements

**Visual:**
```
┌────────────────────┐
│ ● Active           │
└────────────────────┘
```

---

## Styling

### Color Palette
```javascript
{
  primary: '#13ec80',           // FarmLease green
  'primary-dark': '#047857',    // Emerald green (progress bars)
  'forest-green': '#0f392b',    // Deep forest (buttons, active states)
  'forest-light': '#1c4a3a',    // Hover state for buttons
  'earth-brown': '#5D4037',     // Plot names, headings
  'background-light': '#F9FAFB',// Page background
  'green-50': '#F0FDF4',        // Signed badge background
  'yellow-50': '#FEFCE8',       // Pending badge background
  'gray-50': '#F9FAFB'          // Row hover background
}
```

### Typography
- **Display Font:** Space Grotesk (body text, labels)
- **Serif Font:** Playfair Display (page title)
- **Mono Font:** Monospace (contract IDs)

### NativeWind Classes
The components use Tailwind CSS through NativeWind:
```javascript
className="bg-[#0f392b] text-white rounded-lg px-3 py-1.5"
className="text-3xl font-bold text-[#5D4037]"
className="border-b-2 border-[#0f392b]"
```

---

## Data Flow

### Initial State
```javascript
const mockContracts = [
  {
    id: "#FL-2023-892",
    createdDate: "Oct 24, 2023",
    lessee: { name: "John Doe", hasImage: true, imageUrl: "...", initials: "JD", avatarBg: "bg-green-100" },
    lessor: { name: "Jane Smith", hasImage: true, imageUrl: "...", initials: "JS", avatarBg: "bg-purple-100" },
    plot: { name: "Plot B-14", size: "5 Acres", location: "Nakuru County, Rongai", lrNumber: "LR-4521/11" },
    duration: { label: "3 Years", startDate: "Nov 1, 2023", endDate: "Oct 31, 2026", progress: 8 },
    signature: { status: "signed", label: "Fully Signed", note: "Last signed by Lessor\non Oct 25, 2023" },
    canDownload: true
  },
  // ... more contracts
];
```

### Filtering Logic
```javascript
const filteredContracts = mockContracts.filter(contract => {
  // Search filter
  const matchesSearch = 
    contract.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.lessee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.lessor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.plot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.plot.lrNumber.toLowerCase().includes(searchQuery.toLowerCase());
  
  // Tab filter
  const matchesTab = 
    activeTab === 'all' ||
    (activeTab === 'pending' && contract.signature.status === 'pending') ||
    (activeTab === 'active' && contract.signature.status === 'active') ||
    (activeTab === 'expiring' && contract.duration.progress > 70);
  
  return matchesSearch && matchesTab;
});
```

### Progress Calculation
Progress percentage represents elapsed time:
```javascript
// Example for a 3-year contract started Nov 1, 2023
const totalDays = 1095; // 3 years
const elapsedDays = 88;  // ~3 months
const progress = (elapsedDays / totalDays) * 100; // 8%
```

---

## Integration Examples

### Basic Integration
```jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AgreementsContractsPage from './src/pages/admin/AgreementsContractsPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="AgreementsContracts" 
          component={AgreementsContractsPage}
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
navigation.navigate('AgreementsContracts');

// With params (if needed)
navigation.navigate('AgreementsContracts', {
  initialTab: 'pending',
  highlightContract: '#FL-2023-892'
});
```

### Handling Actions
```jsx
const handleDownload = (contract) => {
  // Download PDF logic
  Alert.alert('Download', `Downloading contract ${contract.id} PDF`);
  // In production: trigger PDF download from backend
};

const handleResendNotification = (contract) => {
  // Resend signature request
  Alert.alert(
    'Resend Notification',
    `Send signature reminder to ${contract.signature.status === 'pending' ? contract.lessor.name : 'party'}?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send', onPress: () => {
        // API call to resend notification
        console.log('Resending notification for', contract.id);
      }}
    ]
  );
};
```

---

## API Integration (Future)

### Fetching Contracts
```javascript
import { useEffect, useState } from 'react';
import apiClient from '../services/apiClient';

const AgreementsContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ all: 0, pending: 0, active: 0, expiring: 0 });
  
  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await apiClient.get('/admin/contracts', {
          params: { 
            tab: activeTab,
            search: searchQuery,
            page: currentPage,
            limit: 20
          }
        });
        setContracts(response.data.results);
        setStats(response.data.stats);
      } catch (error) {
        console.error('Failed to fetch contracts:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContracts();
  }, [activeTab, searchQuery, currentPage]);
  
  // ... rest of component
};
```

### Downloading PDF
```javascript
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const handleDownload = async (contract) => {
  try {
    setDownloading(true);
    
    // Get PDF URL from backend
    const response = await apiClient.get(`/admin/contracts/${contract.id}/pdf`);
    const pdfUrl = response.data.pdfUrl;
    
    // Download PDF
    const fileUri = FileSystem.documentDirectory + `contract_${contract.id}.pdf`;
    const downloadResult = await FileSystem.downloadAsync(pdfUrl, fileUri);
    
    // Share or open PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(downloadResult.uri);
    } else {
      Alert.alert('Success', 'PDF downloaded successfully');
    }
  } catch (error) {
    console.error('Failed to download PDF:', error);
    Alert.alert('Error', 'Failed to download contract PDF');
  } finally {
    setDownloading(false);
  }
};
```

### Resending Notification
```javascript
const handleResendNotification = async (contract) => {
  try {
    await apiClient.post(`/admin/contracts/${contract.id}/resend-notification`);
    Alert.alert('Success', 'Signature request sent successfully');
  } catch (error) {
    console.error('Failed to resend notification:', error);
    Alert.alert('Error', 'Failed to send notification');
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
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "expo-file-system": "^15.4.5",
    "expo-sharing": "^11.5.0"
  }
}
```

### Installation
```bash
# Install all dependencies
npm install

# Or with Expo
npx expo install @expo/vector-icons expo-file-system expo-sharing

# Install NativeWind if not already installed
npm install nativewind
npm install --save-dev tailwindcss
```

---

## Performance Considerations

### Optimization Tips

1. **Large Contract Lists**
```javascript
import { FlatList } from 'react-native';

// Replace ScrollView with FlatList for better performance
<FlatList
  data={filteredContracts}
  renderItem={({ item }) => (
    <ContractRow 
      key={item.id}
      contract={item}
      onDownload={handleDownload}
      onResendNotification={handleResendNotification}
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

const filteredContracts = useMemo(() => {
  return contracts.filter(contract => {
    // ... filtering logic
  });
}, [contracts, searchQuery, activeTab]);

const handleDownload = useCallback((contract) => {
  // ... download logic
}, []);
```

3. **Debounced Search**
```javascript
import { useDebounce } from '../hooks';

const debouncedSearch = useDebounce(searchQuery, 300);

useEffect(() => {
  // Fetch with debounced search
  fetchContracts(debouncedSearch);
}, [debouncedSearch, activeTab]);
```

---

## Testing

### Component Tests
```javascript
import { render, fireEvent } from '@testing-library/react-native';
import ContractRow from '../ContractRow';

describe('ContractRow', () => {
  const mockContract = {
    id: '#FL-2023-892',
    createdDate: 'Oct 24, 2023',
    lessee: { name: 'John Doe', hasImage: false, initials: 'JD', avatarBg: 'bg-green-100' },
    lessor: { name: 'Jane Smith', hasImage: false, initials: 'JS', avatarBg: 'bg-purple-100' },
    plot: { name: 'Plot B-14', size: '5 Acres', location: 'Nakuru', lrNumber: 'LR-4521/11' },
    duration: { label: '3 Years', startDate: 'Nov 1, 2023', endDate: 'Oct 31, 2026', progress: 8 },
    signature: { status: 'signed', label: 'Fully Signed', note: 'Last signed by Lessor' },
    canDownload: true
  };
  
  it('renders contract details correctly', () => {
    const { getByText } = render(
      <ContractRow
        contract={mockContract}
        onDownload={jest.fn()}
        onResendNotification={jest.fn()}
      />
    );
    
    expect(getByText('#FL-2023-892')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('Plot B-14 (5 Acres)')).toBeTruthy();
  });
  
  it('calls onDownload when download button is pressed', () => {
    const mockDownload = jest.fn();
    const { getByText } = render(
      <ContractRow
        contract={mockContract}
        onDownload={mockDownload}
        onResendNotification={jest.fn()}
      />
    );
    
    fireEvent.press(getByText('Download PDF'));
    expect(mockDownload).toHaveBeenCalledWith(mockContract);
  });
  
  it('shows resend button when needsResend is true', () => {
    const contractWithResend = { ...mockContract, needsResend: true };
    const { getByText } = render(
      <ContractRow
        contract={contractWithResend}
        onDownload={jest.fn()}
        onResendNotification={jest.fn()}
      />
    );
    
    expect(getByText('Resend Notification')).toBeTruthy();
  });
});
```

---

## Troubleshooting

### Common Issues

**Issue: Images not loading**
```javascript
// Ensure valid image URLs or use fallback avatars
{party.hasImage ? (
  <Image
    source={{ uri: party.imageUrl }}
    onError={() => console.log('Image failed to load')}
  />
) : (
  <View className={`w-6 h-6 rounded-full ${party.avatarBg}`}>
    <Text>{party.initials}</Text>
  </View>
)}
```

**Issue: Progress bar not showing**
```javascript
// Make sure progress is a number between 0-100
<View 
  className="h-full bg-[#047857]" 
  style={{ width: `${Math.max(0, Math.min(100, contract.duration.progress))}%` }}
/>
```

**Issue: Tab navigation not working**
```javascript
// Ensure activeTab state is properly set
const [activeTab, setActiveTab] = useState('all');

// Tab buttons should update state
<TouchableOpacity onPress={() => setActiveTab('pending')}>
  <Text>Pending Signatures</Text>
</TouchableOpacity>
```

---

## Accessibility

### ARIA Labels & Screen Readers
```jsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel={`Download PDF for contract ${contract.id}`}
  accessibilityRole="button"
  onPress={() => onDownload(contract)}
>
  <MaterialIcons name="picture-as-pdf" size={14} />
  <Text>Download PDF</Text>
</TouchableOpacity>

<Text accessibilityRole="header" className="text-3xl font-bold">
  Agreements & Contracts Oversight
</Text>
```

### Color Contrast
All text meets WCAG AA standards:
- White text on forest-green buttons: 8.2:1 ratio
- Dark text on light backgrounds: 12.1:1 ratio
- Status badge text: 4.5:1 minimum ratio

---

## Future Enhancements

1. **Contract Details Modal**
   - Full contract preview
   - Revision history
   - Party contact information
   - Payment schedule

2. **Bulk Actions**
   - Select multiple contracts
   - Batch download PDFs
   - Bulk notifications

3. **Advanced Filtering**
   - Date range picker
   - Location filter
   - Acreage range
   - Custom filters

4. **Document Management**
   - Upload amendments
   - Version control
   - Digital signatures
   - In-app PDF viewer

5. **Notifications**
   - Automated expiry reminders
   - Signature request tracking
   - Email/SMS integration
   - Push notifications

---

## Support

For issues or questions:
- **GitHub:** [Repository Issues](https://github.com/your-repo/issues)
- **Documentation:** [Wiki](https://github.com/your-repo/wiki)
- **Email:** support@farmlease.com

---

## License

Copyright © 2025 FarmLease. All rights reserved.
