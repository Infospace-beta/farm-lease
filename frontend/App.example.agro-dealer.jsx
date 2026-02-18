/**
 * Example App.jsx - Agro-Dealer Oversight Page Integration
 * 
 * This example shows how to integrate the AgroDealerOversightPage
 * into your React Native / Expo application with navigation.
 */

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator } from 'react-native';
import AgroDealerOversightPage from './src/pages/admin/AgroDealerOversightPage';

const Stack = createNativeStackNavigator();

/**
 * Basic Integration - No Navigation
 * Use this if you want to display the page directly
 */
export function BasicExample() {
  return <AgroDealerOversightPage />;
}

/**
 * With Stack Navigation
 * Use this for a complete navigation setup
 */
export function NavigationExample() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,  // Hide header since we have sidebar
          animation: 'slide_from_right'
        }}
      >
        <Stack.Screen 
          name="AgroDealerOversight" 
          component={AgroDealerOversightPage}
          options={{
            title: 'Agro-Dealer Compliance Oversight'
          }}
        />
        {/* Add other admin screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * Complete Admin Panel with Multiple Pages
 */
export function AdminPanelExample() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="UserManagement" component={UserManagementScreen} />
        <Stack.Screen name="LandVerifications" component={LandVerificationsPage} />
        <Stack.Screen name="AgroDealerOversight" component={AgroDealerOversightPage} />
        <Stack.Screen name="Payments" component={PaymentsScreen} />
        <Stack.Screen name="Disputes" component={DisputesScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        
        {/* Detail/Action Screens */}
        <Stack.Screen 
          name="DealerDetails" 
          component={DealerDetailsScreen}
          options={{ title: 'Dealer Details' }}
        />
        <Stack.Screen 
          name="InvestigateDealer" 
          component={InvestigateDealerScreen}
          options={{ title: 'Investigation' }}
        />
        <Stack.Screen 
          name="DealerMessage" 
          component={DealerMessageScreen}
          options={{ title: 'Message Dealer' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * With Real-Time Data Updates
 */
import { useEffect } from 'react';

export function RealtimeExample() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial load
    loadDealers();

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      loadDealers();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const loadDealers = async () => {
    try {
      const response = await fetch('YOUR_API_ENDPOINT/dealers/violations');
      const data = await response.json();
      setDealers(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load dealers:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#13ec80" />
      </View>
    );
  }

  return <AgroDealerOversightPage dealers={dealers} />;
}

/**
 * With Actions Handler
 */
export function ActionsExample() {
  const handleInvestigate = async (dealer) => {
    console.log('Investigating dealer:', dealer.name);
    
    // Navigate to investigation screen
    navigation.navigate('InvestigateDealer', {
      dealerId: dealer.id,
      dealerName: dealer.name,
      violation: dealer.violation
    });
  };

  const handleSuspend = async (dealer, type) => {
    try {
      const response = await fetch('YOUR_API_ENDPOINT/dealers/suspend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerId: dealer.id,
          suspensionType: type, // 'dealer' or 'product'
          reason: dealer.violation
        })
      });

      if (response.ok) {
        alert(`${dealer.name} has been suspended`);
        // Reload dealers
        loadDealers();
      }
    } catch (error) {
      console.error('Failed to suspend:', error);
      alert('Failed to suspend dealer');
    }
  };

  const handleMessage = async (dealer) => {
    navigation.navigate('DealerMessage', {
      dealerId: dealer.id,
      dealerName: dealer.name
    });
  };

  return (
    <AgroDealerOversightPage
      onInvestigate={handleInvestigate}
      onSuspend={handleSuspend}
      onMessage={handleMessage}
    />
  );
}

/**
 * With Search and Filter
 */
export function SearchFilterExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'severe', 'warning', 'suspended'
  const [dealers, setDealers] = useState([]);

  const filteredDealers = dealers.filter(dealer => {
    // Search filter
    const matchesSearch = 
      dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.dealerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dealer.violation.toLowerCase().includes(searchQuery.toLowerCase());

    // Type filter
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'severe' && dealer.violationType === 'severe') ||
      (filterType === 'warning' && dealer.violationType === 'warning') ||
      (filterType === 'suspended' && dealer.status === 'suspended');

    return matchesSearch && matchesFilter;
  });

  return (
    <AgroDealerOversightPage
      dealers={filteredDealers}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      filterType={filterType}
      onFilterChange={setFilterType}
    />
  );
}

/**
 * With Export Functionality
 */
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export function ExportExample() {
  const handleExport = async (dealers) => {
    try {
      // Generate CSV
      const csv = generateComplianceCSV(dealers);
      
      // Save to file
      const fileUri = FileSystem.documentDirectory + 'compliance-log.csv';
      await FileSystem.writeAsStringAsync(fileUri, csv);
      
      // Share file
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export Compliance Log'
      });
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export compliance log');
    }
  };

  const generateComplianceCSV = (dealers) => {
    const headers = [
      'Dealer Name',
      'Dealer ID',
      'Violation',
      'Rating',
      'Flag Frequency',
      'Total Products',
      'Flagged Items',
      'Status'
    ].join(',');

    const rows = dealers.map(dealer => [
      dealer.name,
      dealer.dealerId,
      dealer.violation,
      dealer.rating,
      dealer.flagFrequency,
      dealer.totalProducts,
      dealer.flaggedItems,
      dealer.statusLabel
    ].join(','));

    return [headers, ...rows].join('\n');
  };

  return <AgroDealerOversightPage onExport={handleExport} />;
}

/**
 * With Notifications
 */
import * as Notifications from 'expo-notifications';

export function NotificationsExample() {
  useEffect(() => {
    // Set up notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Listen for new violations
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const data = notification.request.content.data;
      if (data.type === 'new-violation') {
        // Reload dealers
        loadDealers();
      }
    });

    return () => subscription.remove();
  }, []);

  const sendNotification = async (dealer) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'New Violation Reported',
        body: `${dealer.name} has been flagged for ${dealer.violation}`,
        data: { dealerId: dealer.id, type: 'new-violation' },
      },
      trigger: null, // Send immediately
    });
  };

  return <AgroDealerOversightPage onNewViolation={sendNotification} />;
}

/**
 * Full App Example with Context
 */
import { createContext, useContext } from 'react';

const ComplianceContext = createContext();

export function ComplianceProvider({ children }) {
  const [dealers, setDealers] = useState([]);
  const [stats, setStats] = useState({
    activeDealers: 0,
    avgScore: 0,
    underInvestigation: 0,
    flaggedListings: 0
  });

  const loadDealers = async () => {
    // Fetch dealers and update state
  };

  const suspendDealer = async (dealerId, type) => {
    // Suspend dealer and update state
  };

  return (
    <ComplianceContext.Provider value={{ dealers, stats, loadDealers, suspendDealer }}>
      {children}
    </ComplianceContext.Provider>
  );
}

export function useCompliance() {
  return useContext(ComplianceContext);
}

export default function App() {
  return (
    <ComplianceProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AgroDealerOversight" component={AgroDealerOversightPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </ComplianceProvider>
  );
}

// Placeholder components (replace with actual implementations)
const DashboardScreen = () => null;
const UserManagementScreen = () => null;
const LandVerificationsPage = () => null;
const PaymentsScreen = () => null;
const DisputesScreen = () => null;
const ReportsScreen = () => null;
const SettingsScreen = () => null;
const DealerDetailsScreen = () => null;
const InvestigateDealerScreen = () => null;
const DealerMessageScreen = () => null;

/**
 * INSTALLATION NOTES:
 * 
 * 1. Install required dependencies:
 *    npm install @react-navigation/native @react-navigation/native-stack
 *    
 *    For Expo:
 *    npx expo install react-native-screens react-native-safe-area-context
 *    npx expo install expo-file-system expo-sharing
 *    npx expo install expo-notifications
 * 
 * 2. Make sure NativeWind is configured:
 *    - tailwind.config.native.js exists
 *    - babel.config.js includes NativeWind plugin
 * 
 * 3. Import the page in your main App file
 * 
 * 4. Add to your navigation structure
 * 
 * 5. Set up API endpoints for data fetching
 */
