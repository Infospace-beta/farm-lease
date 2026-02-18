/* 
 * FarmLease Admin Dashboard - Component Tree
 * React Native with NativeWind (Tailwind CSS)
 */

/*
┌─────────────────────────────────────────────────────────────────────┐
│                        UserManagementPage                           │
│                     (Main Container Component)                      │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
        ┌────────▼────────┐            ┌────────▼────────┐
        │  AdminSidebar   │            │  Main Content   │
        │   (Fixed Left)  │            │  (Scrollable)   │
        └─────────────────┘            └────────┬────────┘
                │                               │
                │                               │
     ┌──────────┼──────────┐         ┌─────────┼─────────────────┐
     │          │          │         │         │                 │
  ┌──▼──┐   ┌──▼──┐   ┌───▼───┐  ┌──▼──┐  ┌───▼──┐      ┌──────▼──────┐
  │Logo │   │Menu │   │Profile│  │Header│ │Stats │      │Search/Filter│
  │     │   │Items│   │Logout │  │      │ │Cards │      │   Section   │
  └─────┘   └─────┘   └───────┘  └──────┘ └──┬───┘      └─────────────┘
                                              │                  │
                                    ┌─────────┴────────┐         │
                                    │                  │         │
                              ┌─────▼─────┐     ┌─────▼─────┐   │
                              │ StatCard  │ x4  │           │   │
                              │           │     │           │   │
                              └───────────┘     └───────────┘   │
                                                                 │
                                                        ┌────────▼────────┐
                                                        │   User List     │
                                                        │   (FlatList)    │
                                                        └────────┬────────┘
                                                                 │
                                                        ┌────────▼────────┐
                                                        │ UserListItem x5 │
                                                        │                 │
                                                        └─────────────────┘
                                                                 │
                                                        ┌────────▼────────┐
                                                        │   Pagination    │
                                                        └─────────────────┘

COMPONENT BREAKDOWN:

1. UserManagementPage (Main Container)
   ├── SafeAreaView (Status bar handling)
   └── View (Flex row layout)
       ├── AdminSidebar (Left panel - 288px)
       │   ├── Logo & Title
       │   ├── Navigation Menu (9 items)
       │   │   ├── Dashboard
       │   │   ├── User Management (Active)
       │   │   ├── Land Verifications (Badge: 12)
       │   │   ├── Agro-Dealer Oversight
       │   │   ├── Payments & Escrow
       │   │   ├── Dispute Resolution (Badge: 3)
       │   │   ├── Agreements & Contracts
       │   │   ├── Reports
       │   │   └── System Settings
       │   └── Bottom Section
       │       ├── Admin Profile Card
       │       └── Logout Button
       │
       └── ScrollView (Main content - flex-1)
           ├── Header
           │   ├── Title: "User Management"
           │   ├── Description
           │   └── Export Button
           │
           ├── Statistics Grid (4 cards)
           │   ├── StatCard (Total Active Users - 11,425)
           │   ├── StatCard (Farmers - 8,320)
           │   ├── StatCard (Landowners - 3,105)
           │   └── StatCard (Suspended - 38)
           │
           ├── Search & Filters Panel
           │   ├── Search Input (with icon)
           │   ├── Role Filter Dropdown
           │   ├── Status Filter Dropdown
           │   └── Reset Button
           │
           └── User List Container
               ├── Table Header Row
               │   ├── User Name
               │   ├── Role
               │   ├── Join Date
               │   ├── Account Status
               │   └── Actions
               │
               ├── FlatList (User rows)
               │   └── UserListItem (x5)
               │       ├── Avatar/Initials
               │       ├── Name & Email
               │       ├── Role Badge (Farmer/Landowner)
               │       ├── Join Date
               │       ├── Status Badge (Active/Suspended)
               │       └── Action Buttons
               │           ├── View Profile (eye icon)
               │           └── Suspend/Unsuspend (block/unlock icon)
               │
               └── Pagination Footer
                   ├── Results Counter
                   └── Page Navigation
                       ├── Previous Button
                       ├── Page Numbers (1, 2, 3, ..., 12)
                       └── Next Button

KEY FEATURES:

✅ Layout
- Sidebar + Main content layout
- Fixed sidebar (288px)
- Scrollable main content
- Responsive grid for stats

✅ Components
- AdminSidebar: Reusable navigation
- StatCard: Reusable metric display
- UserListItem: Reusable user row
- FilterButton: Reusable filter control

✅ Styling
- NativeWind (Tailwind CSS for RN)
- Custom color palette
- Material Icons (@expo/vector-icons)
- Rounded corners & shadows
- Hover states (via activeOpacity)

✅ Interactions
- Touch feedback on all buttons
- Search input
- Filter dropdowns (placeholder)
- Pagination controls
- Suspend/Unsuspend actions
- Profile view actions

✅ Data Structure

User Object:
{
  id: string,
  name: string,
  email: string,
  role: 'farmer' | 'landowner',
  status: 'active' | 'suspended',
  joinDate: string,
  avatar?: string,  // Optional image URL
  initials?: string // Optional: fallback if no avatar
}

Stat Object:
{
  id: string,
  title: string,
  value: string,
  change: string,  // e.g., "+12%"
  icon: string,    // Material icon name
  color: 'blue' | 'emerald' | 'amber' | 'red',
  isNegative?: boolean
}

PROPS REFERENCE:

AdminSidebar:
  - activeRoute: string (current route name)

StatCard:
  - title: string
  - value: string
  - change: string
  - icon: string (Material icon name)
  - color: 'blue' | 'emerald' | 'amber' | 'red'
  - isNegative?: boolean

UserListItem:
  - user: UserObject
  - onViewProfile: (userId: string) => void
  - onSuspend: (userId: string) => void
  - onUnsuspend: (userId: string) => void

COLOR PALETTE:

Primary Colors:
  - primary: '#13ec80'      (Bright green)
  - primary-dark: '#047857' (Dark green)
  - forest-green: '#0f392b' (Sidebar bg)
  - earth: '#5D4037'        (Text headings)

Status Colors:
  - Active: green-500 (#10B981)
  - Suspended: red-500 (#EF4444)
  - Farmer: emerald-600 (#059669)
  - Landowner: amber-600 (#D97706)

DEPENDENCIES:

Core:
  - react-native
  - react

UI:
  - nativewind (Tailwind for RN)
  - tailwindcss@3.3.2
  - @expo/vector-icons

Navigation (Optional):
  - @react-navigation/native
  - @react-navigation/native-stack
  - react-native-screens
  - react-native-safe-area-context

FILES CREATED:

Components:
  src/pages/admin/UserManagementPage.jsx
  src/components/admin/AdminSidebar.jsx
  src/components/admin/StatCard.jsx
  src/components/admin/UserListItem.jsx

Configuration:
  tailwind.config.native.js (updated)
  App.example.admin.jsx

Documentation:
  ADMIN_USER_MANAGEMENT_RN.md
  ADMIN_QUICK_START.md
  setup-admin-rn.sh

*/

// This file serves as documentation only
// See the actual component files in src/pages/admin/ and src/components/admin/
