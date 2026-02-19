// Example App.jsx for Admin User Management Page
// This demonstrates how to integrate the UserManagementPage into your React Native app

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserManagementPage from './src/pages/admin/UserManagementPage';

// If you don't have navigation set up yet, you can use this simple version:
// import UserManagementPage from './src/pages/admin/UserManagementPage';
// export default function App() {
//   return <UserManagementPage />;
// }

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="UserManagement" 
          component={UserManagementPage}
          options={{ title: 'User Management' }}
        />
        {/* Add more admin screens here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
