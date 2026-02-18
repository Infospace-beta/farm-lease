#!/bin/bash

# FarmLease Admin User Management - React Native Setup Script
# This script installs all dependencies needed for the Admin User Management page

echo "🚀 Setting up Admin User Management Page for React Native..."
echo ""

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the frontend directory."
    exit 1
fi

echo "📦 Installing NativeWind and Tailwind CSS..."
npm install nativewind
npm install --save-dev tailwindcss@3.3.2

echo ""
echo "🎨 Installing Expo Vector Icons..."
npx expo install @expo/vector-icons

echo ""
echo "🧭 Installing React Navigation (if not already installed)..."
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context

echo ""
echo "✅ All dependencies installed successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure tailwind.config.native.js is configured (already done ✓)"
echo "2. Update babel.config.js to include 'nativewind/babel' plugin"
echo "3. Import the UserManagementPage component in your app"
echo "4. Run: npx expo start"
echo ""
echo "📖 For detailed instructions, see: ADMIN_USER_MANAGEMENT_RN.md"
echo ""
echo "🎉 Setup complete! Happy coding!"
