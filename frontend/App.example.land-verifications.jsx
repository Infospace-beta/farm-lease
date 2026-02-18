/**
 * Example App.jsx - Land Verifications Page Integration
 * 
 * This example shows how to integrate the LandVerificationsPage
 * into your React Native / Expo application with navigation.
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandVerificationsPage from './src/pages/admin/LandVerificationsPage';

const Stack = createNativeStackNavigator();

/**
 * Basic Integration - No Navigation
 * Use this if you want to display the page directly
 */
export function BasicExample() {
  return <LandVerificationsPage />;
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
          name="LandVerifications" 
          component={LandVerificationsPage}
          options={{
            title: 'Land Verifications'
          }}
        />
        {/* Add other admin screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * With Tab Navigation (for multi-page admin panel)
 */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export function TabNavigationExample() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#13ec80',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarStyle: {
            backgroundColor: '#0f392b',
            borderTopColor: 'rgba(255,255,255,0.05)',
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
          },
        }}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="dashboard" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Verifications" 
          component={LandVerificationsPage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="verified-user" size={size} color={color} />
            ),
            tabBarBadge: 12, // Shows notification badge
          }}
        />
        <Tab.Screen 
          name="Users" 
          component={UsersScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="group" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

/**
 * Full App Example with Authentication Flow
 */
import { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Your auth logic here
      const authenticated = await checkAuthStatus();
      setIsAuthenticated(authenticated);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#f8fafc]">
        <ActivityIndicator size="large" color="#13ec80" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <AdminNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

/**
 * Admin Navigator
 */
function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LandVerifications" component={LandVerificationsPage} />
      <Stack.Screen name="UserManagement" component={UserManagementPage} />
      <Stack.Screen name="Dashboard" component={DashboardPage} />
      {/* Add more admin screens */}
    </Stack.Navigator>
  );
}

/**
 * Auth Navigator
 */
function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

// Placeholder components (replace with actual implementations)
const DashboardScreen = () => null;
const UsersScreen = () => null;
const UserManagementPage = () => null;
const DashboardPage = () => null;
const LoginScreen = () => null;
const ForgotPasswordScreen = () => null;
const checkAuthStatus = async () => true;

/**
 * INSTALLATION NOTES:
 * 
 * 1. Install required dependencies:
 *    npm install @react-navigation/native @react-navigation/native-stack
 *    npm install @react-navigation/bottom-tabs
 *    
 *    For Expo:
 *    npx expo install react-native-screens react-native-safe-area-context
 * 
 * 2. Make sure NativeWind is configured:
 *    - tailwind.config.native.js exists
 *    - babel.config.js includes NativeWind plugin
 * 
 * 3. Import the page in your main App file
 * 
 * 4. Add to your navigation structure
 */
