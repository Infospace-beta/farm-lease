/**
 * Agreements & Contracts Page Integration Example
 * 
 * This file demonstrates how to integrate the AgreementsContractsPage component
 * into your React Native Expo app with proper navigation setup.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Copy this file to your app's root directory (or replace App.jsx)
 * 2. Ensure all dependencies are installed (see below)
 * 3. Run: npx expo start
 * 4. Navigate to /admin/agreements-contracts
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AgreementsContractsPage from './src/pages/admin/AgreementsContractsPage';

const Stack = createStackNavigator();

/**
 * Main App Component with Navigation
 * 
 * ARCHITECTURE:
 * - Stack Navigator for screen management
 * - Header hidden for custom layouts (AdminSidebar provides navigation)
 * - Single admin page example (extend with more screens as needed)
 */
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AgreementsContracts"
        screenOptions={{
          headerShown: false, // We use custom AdminSidebar for navigation
          cardStyle: { backgroundColor: '#F9FAFB' } // Match page background
        }}
      >
        {/* Agreements & Contracts Dashboard */}
        <Stack.Screen 
          name="AgreementsContracts" 
          component={AgreementsContractsPage}
          options={{
            title: 'Agreements & Contracts - FarmLease Admin'
          }}
        />
        
        {/* Add other admin pages here */}
        {/* 
        <Stack.Screen 
          name="LandVerifications" 
          component={LandVerificationsPage}
        />
        <Stack.Screen 
          name="PaymentsEscrow" 
          component={PaymentsEscrowPage}
        />
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REQUIRED DEPENDENCIES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Install these packages to run the Agreements & Contracts page:
 * 
 * npm install react-native
 * npm install @react-navigation/native @react-navigation/stack
 * npx expo install react-native-screens react-native-safe-area-context
 * npm install @expo/vector-icons
 * npm install nativewind
 * npm install --save-dev tailwindcss
 * 
 * Optional (for PDF functionality):
 * npx expo install expo-file-system expo-sharing
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CUSTOMIZATION: Handling Contract Actions
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * You can pass custom handlers to the AgreementsContractsPage component:
 */

/*
import React, { useState } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const AgreementsContractsScreen = ({ navigation }) => {
  const [contracts, setContracts] = useState([]);
  const [downloading, setDownloading] = useState(false);
  
  const handleDownload = async (contract) => {
    if (!contract.canDownload) {
      Alert.alert('Not Available', 'PDF is not available for incomplete contracts');
      return;
    }
    
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
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download contract PDF');
    } finally {
      setDownloading(false);
    }
  };
  
  const handleResendNotification = async (contract) => {
    const pendingParty = contract.signature.status === 'pending' 
      ? contract.signature.label.includes('Lessor') 
        ? contract.lessor.name 
        : contract.lessee.name
      : 'party';
    
    Alert.alert(
      'Resend Signature Request',
      `Send reminder to ${pendingParty}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send', 
          onPress: async () => {
            try {
              await apiClient.post(`/admin/contracts/${contract.id}/resend-notification`);
              Alert.alert('Success', 'Signature request sent successfully');
            } catch (error) {
              console.error('Resend error:', error);
              Alert.alert('Error', 'Failed to send notification');
            }
          }
        }
      ]
    );
  };
  
  return (
    <AgreementsContractsPage 
      onDownload={handleDownload}
      onResendNotification={handleResendNotification}
    />
  );
};
*/

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ADVANCED: Multi-Page Admin Dashboard
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Complete admin dashboard with all admin pages:
 */

/*
import LandVerificationsPage from './src/pages/admin/LandVerificationsPage';
import AgroDealerOversightPage from './src/pages/admin/AgroDealerOversightPage';
import PaymentsEscrowPage from './src/pages/admin/PaymentsEscrowPage';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="AgreementsContracts"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F9FAFB' }
        }}
      >
        <Stack.Screen 
          name="AgreementsContracts" 
          component={AgreementsContractsPage}
        />
        <Stack.Screen 
          name="LandVerifications" 
          component={LandVerificationsPage}
        />
        <Stack.Screen 
          name="AgroDealerOversight" 
          component={AgroDealerOversightPage}
        />
        <Stack.Screen 
          name="PaymentsEscrow" 
          component={PaymentsEscrowPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
*/

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API INTEGRATION EXAMPLE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Replace mock data with real API calls:
 */

/*
import { useEffect, useState } from 'react';
import apiClient from './src/services/apiClient';

const AgreementsContractsScreen = () => {
  const [contracts, setContracts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    expiring: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchContracts();
  }, [activeTab, searchQuery]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      
      const response = await apiClient.get('/admin/contracts', {
        params: {
          tab: activeTab,
          search: searchQuery,
          page: 1,
          limit: 20
        }
      });

      setContracts(response.data.results);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      Alert.alert('Error', 'Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (contract) => {
    // See download implementation above
  };

  const handleResendNotification = async (contract) => {
    // See resend implementation above
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F9FAFB]">
        <ActivityIndicator size="large" color="#0f392b" />
      </View>
    );
  }

  return (
    <AgreementsContractsPage
      contracts={contracts}
      stats={stats}
      onDownload={handleDownload}
      onResendNotification={handleResendNotification}
      onRefresh={fetchContracts}
    />
  );
};
*/

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FEATURES INCLUDED
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ✅ Contract Management
 *    - All contracts overview (1,284 total)
 *    - Pending signatures tracking (42)
 *    - Active contracts monitoring (1,150)
 *    - Expiring soon alerts (15)
 * 
 * ✅ Search & Filter
 *    - Search by contract ID
 *    - Search by party names (lessee/lessor)
 *    - Search by plot name or LR number
 *    - Tab-based filtering
 * 
 * ✅ Contract Details
 *    - Agreement ID with creation date
 *    - Lessee and Lessor information with avatars
 *    - Land plot details (name, size, location, LR number)
 *    - Lease duration with progress bar
 *    - Signature status badges
 * 
 * ✅ Actions
 *    - Download PDF (when available)
 *    - Resend signature notifications
 *    - Export functionality
 *    - Pagination support
 * 
 * ✅ Visual Elements
 *    - Avatar support with fallback initials
 *    - Progress bars for lease duration
 *    - Status badges (Fully Signed, Pending, Active)
 *    - Color-coded UI elements
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVIGATION FLOW
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * From AdminSidebar:
 * - Click "Agreements & Contracts" menu item → navigates to AgreementsContractsPage
 * - activeRoute="agreements" highlights the menu item
 * 
 * From other admin pages:
 * - navigation.navigate('AgreementsContracts');
 * 
 * To contract details:
 * - navigation.navigate('ContractDetails', { contractId: '#FL-2023-892' });
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CONTRACT DATA STRUCTURE
 * ═══════════════════════════════════════════════════════════════════════════
 */

/*
const contractExample = {
  id: "#FL-2023-892",
  createdDate: "Oct 24, 2023",
  lessee: {
    name: "John Doe",
    hasImage: true,
    imageUrl: "https://...",
    initials: "JD",
    avatarBg: "bg-green-100"
  },
  lessor: {
    name: "Jane Smith",
    hasImage: true,
    imageUrl: "https://...",
    initials: "JS",
    avatarBg: "bg-purple-100"
  },
  plot: {
    name: "Plot B-14",
    size: "5 Acres",
    location: "Nakuru County, Rongai",
    lrNumber: "LR-4521/11"
  },
  duration: {
    label: "3 Years",
    startDate: "Nov 1, 2023",
    endDate: "Oct 31, 2026",
    progress: 8  // percentage (0-100)
  },
  signature: {
    status: "signed",  // 'signed', 'pending', 'active'
    label: "Fully Signed",
    note: "Last signed by Lessor\non Oct 25, 2023"
  },
  canDownload: true,
  needsResend: false
};
*/

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TROUBLESHOOTING
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Issue: Images not loading
 * Solution: Check image URLs are valid HTTPS URLs
 *           Use fallback avatars with initials if images fail
 * 
 * Issue: Progress bars not visible
 * Solution: Ensure progress values are between 0-100
 *           Check that View has proper width style applied
 * 
 * Issue: Navigation error
 * Solution: Ensure @react-navigation packages are installed
 *           Check that NavigationContainer wraps the entire app
 * 
 * Issue: Icons not displaying
 * Solution: npm install @expo/vector-icons
 *           Verify icon names at https://icons.expo.fyi/
 * 
 * Issue: Tailwind classes not working
 * Solution: Ensure NativeWind is configured in babel.config.js:
 *           plugins: ['nativewind/babel']
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NOTES
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * - Mock data is included in AgreementsContractsPage.jsx for demonstration
 * - Replace with API integration in production (see examples above)
 * - AdminSidebar provides navigation between admin pages
 * - All components use NativeWind for styling (Tailwind CSS)
 * - Supports both iOS and Android platforms via Expo
 * - PDF download requires expo-file-system and expo-sharing packages
 * 
 * For full documentation, see: frontend/AGREEMENTS_CONTRACTS_PAGE.md
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */