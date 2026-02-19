# React Native Setup Guide for My Lands Page

This guide helps you set up the React Native version of the My Lands page with NativeWind (Tailwind CSS for React Native).

## Prerequisites

Make sure you have a React Native project set up with Expo or React Native CLI.

## Installation Steps

### 1. Install NativeWind and Dependencies

```bash
npm install nativewind
npm install --save-dev tailwindcss@3.3.2
npm install react-native-svg
```

### 2. Install Expo Vector Icons (if using Expo)

```bash
npx expo install @expo/vector-icons
```

Or for bare React Native:

```bash
npm install react-native-vector-icons
```

### 3. Configure Tailwind CSS

The `tailwind.config.native.js` file is already set up with the FarmLease color scheme.

### 4. Configure Babel

Update your `babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['nativewind/babel'],
  };
};
```

### 5. Import NativeWind

In your main App.js or App.tsx file, import NativeWind:

```javascript
import 'react-native-gesture-handler'; // If using navigation
import { StatusBar } from 'expo-status-bar';
```

### 6. Configure Metro Bundler (if needed)

Create or update `metro.config.js`:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  };
  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...resolver.sourceExts, 'svg'],
  };

  return config;
})();
```

## File Structure

```
frontend/src/
├── pages/
│   └── Farm-Owner/
│       └── MyLandsPage.jsx      # Main lands page component
└── components/
    └── Farm-Owner/
        └── LandCard.jsx          # Reusable land card component
```

## Components Included

### 1. MyLandsPage.jsx
The main page component that displays:
- Page header with title and description
- Action buttons (Export, Bulk Actions, Add New Plot)
- Search and filter controls
- Grid of land cards
- Add new property card
- Pagination

### 2. LandCard.jsx
A reusable card component that displays:
- Land plot image with map pattern
- Status badge (Leased, Pending, Under Review, Vacant)
- Plot ID
- Land name and location
- Size and soil type
- Tenant/bidder/applicant information
- Revenue or pricing information
- Action button

## Styling

The components use NativeWind (Tailwind CSS) classes with the following color scheme:
- **Primary**: `#047857` (Emerald green)
- **Accent**: `#d97706` (Earthy amber)
- **Earth**: `#5D4037` (Brown for typography)
- **Background Light**: `#f8fafc`
- **Background Dark**: `#0f172a`

## Usage Example

```jsx
import MyLandsPage from './src/pages/Farm-Owner/MyLandsPage';

function App() {
  return <MyLandsPage />;
}
```

## Features

✅ Responsive mobile-first design
✅ Dark mode support
✅ Search functionality
✅ Filter by status and soil type
✅ Land status badges with color coding
✅ Avatar display for tenants/bidders
✅ Revenue tracking
✅ Pagination
✅ Add new property CTA

## Customization

### Adding Navigation

To integrate with React Navigation:

```jsx
import { useNavigation } from '@react-navigation/native';

const MyLandsPage = () => {
  const navigation = useNavigation();

  const handleAddPlot = () => {
    navigation.navigate('AddLand');
  };

  // Use handleAddPlot in your TouchableOpacity
};
```

### Fetching Real Data

Replace the static `landsData` array with an API call:

```jsx
import { useState, useEffect } from 'react';
import { landService } from '../../services/landService';

const MyLandsPage = () => {
  const [landsData, setLandsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const response = await landService.getMyLands();
      setLandsData(response.data);
    } catch (error) {
      console.error('Error fetching lands:', error);
    } finally {
      setLoading(false);
    }
  };

  // ...rest of component
};
```

## Notes

- The components use `className` prop with Tailwind classes (NativeWind syntax)
- Icons are from `@expo/vector-icons` (Ionicons and MaterialCommunityIcons)
- Images use the React Native `Image` component with `source={{ uri: ... }}`
- Status colors are dynamically applied based on land status
- The map pattern background should be replaced with actual map images or custom patterns

## Troubleshooting

### NativeWind classes not working
1. Make sure you've installed NativeWind correctly
2. Check that `nativewind/babel` is in your babel.config.js plugins
3. Clear Metro bundler cache: `npx expo start -c` or `npx react-native start --reset-cache`

### Icons not displaying
1. For Expo: Run `npx expo install @expo/vector-icons`
2. For bare RN: Link vector icons and rebuild the app

### Gap property not working
The `gap` utility in React Native requires RN 0.71+. For older versions, use margin utilities instead.

## Next Steps

1. Integrate with React Navigation
2. Connect to backend API
3. Add real map images for each land plot
4. Implement filter and search functionality
5. Add pull-to-refresh for data updates
6. Implement pagination logic
