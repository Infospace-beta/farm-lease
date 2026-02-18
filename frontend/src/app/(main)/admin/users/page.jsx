import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import UserListItem from '../../components/admin/UserListItem';

const UserManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock user data
  const users = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'landowner',
      joinDate: 'Oct 24, 2023',
      status: 'active',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRVyxqsOBdCwyGJzPHbq1FhOlzVMHyoh1E0OPOu-llapkq0U3jYW1Rwg2C1Ugmbc7LW8iCf3H63pb_v9DP0GHt7k5WVWz-KfzcOqt2Cj5IVJDE4f62-oluZlqbFJok2b5rctP84eeFDrehPcMd_Zbu44IB2yGCJghAUU_ufV_QAdGLcx9W_Mh5R48riUTKiv558YHftJaE5LbQfTu1CPVeQWPHjB_5oRhIQAX2VV5nHKhInf3zQ51eITb0P3DkQfxyt0yLIbaYfC3r',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@farmlease.co.ke',
      role: 'farmer',
      joinDate: 'Nov 12, 2023',
      status: 'active',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOHhWmxwYhxgNaHTPSreYBjkWVcAqf3byBu_UtW6A4PBvA3qVdPk-AjtGl28zsWQSvZxflkjvxZUoPb_tYqyvxz0sRXkYm-ntmW9sEYNz56BEXN3FyHT78WfUhM90X3SpiYraeJm-ZiknSB8ReIH9vlUT2E1yskS9Hpeq61BI6HoD992od2rN6ipciwK2JZPSsJTzDcKd8-6KGBVw67v8eGrYN_8FxXm1ST1guaj0IQdQfE5hDtxa-HhY26HoM_eKf0NxRtqP6reHl',
    },
    {
      id: '3',
      name: 'Alice Wanjiku',
      email: 'alice.w@example.com',
      role: 'farmer',
      joinDate: 'Jan 10, 2024',
      status: 'active',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1X7ksMAnix_oyIMmvb32pBsvwu-5HCHYIGVp5Ig1IAkpjNqjIa3iA8hp8k4rkt-k2rCOgCy-AXHWm7Fc98eveNup9noSkgU2aL3dSLTO8Eh8i2n9g7Mhm0phcFJOJXv-piRUz0JH_Iw5X2uYa16gDNfAfcfU8QioR39h-glLqfFwtb_qqXGbfEAnB8MYhXGgtmczxCFOuG_Moulp_QG7GXZ1xALpiykXswKnEoc2kwUgIQ9e8HNr6txSB2SYqUtN0h4eaoNAH0yzV',
    },
    {
      id: '4',
      name: 'David Kamau',
      email: 'david.k@landholdings.co.ke',
      role: 'landowner',
      joinDate: 'Feb 28, 2024',
      status: 'active',
      initials: 'DK',
    },
    {
      id: '5',
      name: 'Peter Omondi',
      email: 'peter.omondi@farmers.co.ke',
      role: 'farmer',
      joinDate: 'Mar 15, 2024',
      status: 'suspended',
      initials: 'PO',
    },
  ];

  const stats = [
    {
      id: '1',
      title: 'Total Active Users',
      value: '11,425',
      change: '+12%',
      icon: 'people',
      color: 'blue',
    },
    {
      id: '2',
      title: 'Farmers',
      value: '8,320',
      change: '+5%',
      icon: 'agriculture',
      color: 'emerald',
    },
    {
      id: '3',
      title: 'Landowners',
      value: '3,105',
      change: '+2%',
      icon: 'landscape',
      color: 'amber',
    },
    {
      id: '4',
      title: 'Suspended Accounts',
      value: '38',
      change: '+1',
      icon: 'block',
      color: 'red',
      isNegative: true,
    },
  ];

  const handleViewProfile = (userId) => {
    console.log('View profile:', userId);
  };

  const handleSuspendUser = (userId) => {
    console.log('Suspend user:', userId);
  };

  const handleUnsuspendUser = (userId) => {
    console.log('Unsuspend user:', userId);
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRole('all');
    setSelectedStatus('all');
  };

  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <StatusBar barStyle="light-content" backgroundColor="#0f392b" />
      <View className="flex-1 flex-row">
        {/* Sidebar */}
        <AdminSidebar activeRoute="user-management" />

        {/* Main Content */}
        <View className="flex-1">
          <ScrollView className="flex-1 px-4 py-6">
            {/* Header */}
            <View className="mb-6">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-3xl font-bold text-earth mb-1">
                    User Management
                  </Text>
                  <Text className="text-sm text-gray-500 max-w-xl">
                    Manage Farmers and Landowners accounts, review profiles, and handle suspensions.
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleExport}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 flex-row items-center gap-2 shadow-sm"
                >
                  <MaterialIcons name="file-download" size={20} color="#6B7280" />
                  <Text className="text-sm font-medium text-gray-600">Export</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Statistics Cards */}
            <View className="flex-row flex-wrap gap-4 mb-6">
              {stats.map((stat) => (
                <View key={stat.id} className="flex-1 min-w-[45%]">
                  <StatCard {...stat} />
                </View>
              ))}
            </View>

            {/* Search and Filters */}
            <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm">
              {/* Search Input */}
              <View className="relative mb-4">
                <View className="absolute left-3 top-3 z-10">
                  <MaterialIcons name="search" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search by name, email, or ID..."
                  placeholderTextColor="#9CA3AF"
                  className="bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm"
                />
              </View>

              {/* Filters */}
              <View className="flex-row gap-3">
                {/* Role Filter */}
                <FilterButton
                  label="All Roles"
                  icon="expand-more"
                  onPress={() => {/* Open role picker */}}
                  className="flex-1"
                />

                {/* Status Filter */}
                <FilterButton
                  label="All Status"
                  icon="expand-more"
                  onPress={() => {/* Open status picker */}}
                  className="flex-1"
                />

                {/* Reset Button */}
                <TouchableOpacity
                  onPress={handleResetFilters}
                  className="bg-white border border-gray-200 rounded-lg p-2.5"
                >
                  <MaterialIcons name="refresh" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            {/* User List */}
            <View className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
              {/* Table Header */}
              <View className="bg-gray-50/50 border-b border-gray-100 px-4 py-3 flex-row">
                <Text className="flex-[2] text-xs font-bold text-gray-500 uppercase">
                  User Name
                </Text>
                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase">
                  Role
                </Text>
                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase">
                  Join Date
                </Text>
                <Text className="flex-1 text-xs font-bold text-gray-500 uppercase">
                  Status
                </Text>
                <Text className="w-20 text-xs font-bold text-gray-500 uppercase text-right">
                  Actions
                </Text>
              </View>

              {/* User List Items */}
              <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <UserListItem
                    user={item}
                    onViewProfile={handleViewProfile}
                    onSuspend={handleSuspendUser}
                    onUnsuspend={handleUnsuspendUser}
                  />
                )}
                scrollEnabled={false}
              />

              {/* Pagination */}
              <View className="px-4 py-4 border-t border-gray-100 flex-row justify-between items-center">
                <Text className="text-sm text-gray-500">
                  Showing <Text className="font-bold text-gray-800">1</Text> to{' '}
                  <Text className="font-bold text-gray-800">5</Text> of{' '}
                  <Text className="font-bold text-gray-800">11,425</Text> results
                </Text>

                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    disabled
                    className="p-2 border border-gray-200 rounded-lg opacity-50"
                  >
                    <MaterialIcons name="chevron-left" size={20} color="#9CA3AF" />
                  </TouchableOpacity>

                  <TouchableOpacity className="w-8 h-8 bg-[#0f392b] rounded-lg items-center justify-center">
                    <Text className="text-sm font-bold text-white">1</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="w-8 h-8 rounded-lg items-center justify-center">
                    <Text className="text-sm font-medium text-gray-600">2</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="w-8 h-8 rounded-lg items-center justify-center">
                    <Text className="text-sm font-medium text-gray-600">3</Text>
                  </TouchableOpacity>

                  <Text className="px-2 text-gray-400">...</Text>

                  <TouchableOpacity className="w-8 h-8 rounded-lg items-center justify-center">
                    <Text className="text-sm font-medium text-gray-600">12</Text>
                  </TouchableOpacity>

                  <TouchableOpacity className="p-2 border border-gray-200 rounded-lg">
                    <MaterialIcons name="chevron-right" size={20} color="#4B5563" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

// Filter Button Component
const FilterButton = ({ label, icon, onPress, className }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`bg-white border border-gray-200 rounded-lg px-3 py-2.5 flex-row items-center justify-between ${className}`}
  >
    <Text className="text-sm text-gray-600">{label}</Text>
    <MaterialIcons name={icon} size={18} color="#9CA3AF" />
  </TouchableOpacity>
);

export default UserManagementPage;
