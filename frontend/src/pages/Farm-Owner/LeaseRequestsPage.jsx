import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const LeaseRequestsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for lease requests
  const leaseRequests = [
    {
      id: '1',
      farmer: {
        name: 'Jane Smith',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrxrphhwqUHyCR0IxEQ_HDv3R9z3CDNvg51eW7CsOusce7YRYRwNyJPkR8akl-FZtjjwN0r3G0tjmdYEEvElAZ4EAJkaET-4gbBLZnf_dFp7-DAc3E5vz1Gexp46w68bvmUuC3Y7Sblw-h6p9HeJEhNCwJfDhKN1psyCOGzYzhCsb-5uSeBFVPCkL02DZzl5uOG_WlxRtwX1kfBZVo-bJNuKq9NRS-PyBlHtMMrqW0i2IaZfJoiGOXnfriDpbKXCFZQuxv5FA7o8JK',
        rating: '4.9',
        leaseCount: '24',
      },
      plot: {
        id: 'Plot B2 - East',
        acres: '2.0',
        soil: 'Clay',
      },
      offerAmount: '45,000',
      duration: '12 Months',
      startDate: 'Jan 2025',
      status: 'Pending Review',
      statusColor: 'amber',
    },
    {
      id: '2',
      farmer: {
        name: 'Michael K.',
        initials: 'MK',
        rating: '4.2',
        leaseCount: '8',
      },
      plot: {
        id: 'Plot C1 - Valley',
        acres: '5.0',
        soil: 'Silt',
      },
      offerAmount: '60,000',
      duration: '24 Months',
      startDate: 'Dec 2024',
      status: 'Docs Submitted',
      statusColor: 'blue',
    },
    {
      id: '3',
      farmer: {
        name: 'John Doe',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEeNaQ9ipY6hAWWDXUwBn_KT5iX0Xx6_qbKyAQKAGY5cKJrFkEEpGY8aZIJZewYzN9XKiSk_Bu75ATzV5jPRjwG4RrCJ8DaRtXbEs9gMFmh_kH-TV9Z0wlF200GtFOMO2yGGfavlW3vwurJyi85G52zDef_1NGPd46LZJ7JvsQcRpHAvWc78c4Tc6AQ5tuvf9GBGwI38AhBLDRdYl3e1tY9Zij3apSb5VGUvMQrLrdiYMEfsJlTEvwbPwiscC33L4HaPJMa4mYYPAV',
        rating: '5.0',
        leaseCount: '32',
      },
      plot: {
        id: 'Plot A4 - North',
        acres: '3.5',
        soil: 'Loam',
      },
      offerAmount: '50,000',
      duration: '12 Months',
      startDate: 'Dec 2024',
      status: 'Active Lease',
      statusColor: 'emerald',
      isActive: true,
    },
    {
      id: '4',
      farmer: {
        name: 'Robert S.',
        initials: 'RS',
        rating: '4.5',
        leaseCount: '12',
      },
      plot: {
        id: 'Plot D8 - South',
        acres: '1.5',
        soil: 'Sandy',
      },
      offerAmount: '35,000',
      duration: '6 Months',
      startDate: 'Feb 2025',
      status: 'New Offer',
      statusColor: 'earth',
    },
    {
      id: '5',
      farmer: {
        name: 'Sarah L.',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUlri6LmxpQdCxo4ud48rC3MKDlQAAhzxJMPZo5Mzmu0TugUuGcbBj1qrw-fevFCmUi6z-LfL2oBLFqQ6BdLFH8fLUkI7Mr3b39Q33hWmt0rgtxCNyczC5n-WR3tqCLi2Y-fj7-yOXDcie25avBYbQr20XGXi8hOmh5-bA-EuWuevgCIruNVh2ZAc6hNd-sEcN56CNqWcW3VZgz9yY1BlwmePk_ZqGI4wfxHViaQ-kxxEFU9YrfZ1C_6rM21jSL8T7hGkrDbBaaiwO',
        rating: '4.8',
        leaseCount: '15',
      },
      plot: {
        id: 'Plot B2 - East',
        acres: '2.0',
        soil: 'Clay',
      },
      offerAmount: '42,000',
      duration: '12 Months',
      startDate: 'Jan 2025',
      status: 'Negotiating',
      statusColor: 'slate',
    },
  ];

  const stats = [
    { label: 'Total Requests', value: '24', icon: 'inbox', color: 'blue' },
    { label: 'Pending Review', value: '8', icon: 'hourglass-empty', color: 'amber' },
    { label: 'Approved', value: '12', icon: 'check-circle', color: 'emerald' },
    { label: 'Avg. Offer', value: 'Ksh 52k', icon: 'payments', color: 'purple' },
  ];

  const renderStatCard = ({ item }) => {
    const colorClasses = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600' },
    };

    return (
      <View className="flex-1 rounded-xl bg-white p-5 shadow-sm border border-slate-100 mx-1">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {item.label}
            </Text>
            <Text className={`mt-1 text-2xl font-bold ${item.color === 'amber' ? 'text-amber-600' : item.color === 'emerald' ? 'text-emerald-600' : 'text-slate-800'}`}>
              {item.value}
            </Text>
          </View>
          <View className={`h-10 w-10 items-center justify-center rounded-lg ${colorClasses[item.color].bg}`}>
            <MaterialIcons name={item.icon} size={24} className={colorClasses[item.color].text} />
          </View>
        </View>
      </View>
    );
  };

  const getStatusBadgeStyle = (color) => {
    const styles = {
      amber: 'bg-amber-100 text-amber-800',
      blue: 'bg-blue-100 text-blue-800',
      emerald: 'bg-emerald-100 text-emerald-800',
      earth: 'bg-orange-100 text-orange-800',
      slate: 'bg-slate-100 text-slate-600',
    };
    return styles[color] || styles.slate;
  };

  const renderLeaseRequest = ({ item }) => (
    <View className={`bg-white border-b border-slate-100 p-4 ${item.isActive ? 'bg-slate-50/30' : ''}`}>
      {/* Farmer Info */}
      <View className="flex-row items-center mb-3">
        {item.farmer.avatar ? (
          <Image
            source={{ uri: item.farmer.avatar }}
            className="h-12 w-12 rounded-full ring-2 ring-white"
          />
        ) : (
          <View className="h-12 w-12 rounded-full bg-blue-100 items-center justify-center ring-2 ring-white">
            <Text className="font-bold text-blue-600">{item.farmer.initials}</Text>
          </View>
        )}
        <View className="ml-3 flex-1">
          <Text className="font-semibold text-slate-900">{item.farmer.name}</Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={12} color="#f59e0b" />
            <Text className="text-xs text-slate-600 ml-1">
              {item.farmer.rating} ({item.farmer.leaseCount} Leases)
            </Text>
          </View>
        </View>
      </View>

      {/* Plot Info */}
      <View className="flex-row mb-2">
        <View className="flex-1">
          <Text className="text-xs text-slate-500 mb-1">Plot ID</Text>
          <Text className="font-medium text-slate-900">{item.plot.id}</Text>
          <Text className="text-xs text-slate-500">
            {item.plot.acres} Acres • {item.plot.soil}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs text-slate-500 mb-1">Offered Value</Text>
          <Text className="font-bold text-emerald-600">
            Ksh {item.offerAmount}
            <Text className="text-xs font-normal text-slate-500">/yr</Text>
          </Text>
        </View>
      </View>

      {/* Duration & Status */}
      <View className="flex-row items-center justify-between mb-3">
        <View>
          <Text className="text-xs text-slate-500 mb-1">Duration</Text>
          <Text className="text-slate-700">{item.duration}</Text>
          <Text className="text-xs text-slate-500">Starts {item.startDate}</Text>
        </View>
        <View className={`rounded-full px-3 py-1 ${getStatusBadgeStyle(item.statusColor)}`}>
          <Text className="text-xs font-bold">{item.status}</Text>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row gap-2">
        {item.status === 'Pending Review' || item.status === 'New Offer' ? (
          <>
            <TouchableOpacity className="flex-1 rounded-lg bg-emerald-600 p-3 items-center">
              <Text className="text-white font-semibold">Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-lg bg-red-100 p-3 items-center px-4">
              <Ionicons name="close" size={20} color="#dc2626" />
            </TouchableOpacity>
            <TouchableOpacity className="rounded-lg border border-slate-200 bg-white p-3 items-center px-4">
              <Ionicons name="chatbubble-outline" size={20} color="#64748b" />
            </TouchableOpacity>
          </>
        ) : item.status === 'Docs Submitted' ? (
          <>
            <TouchableOpacity className="flex-1 rounded-lg border border-slate-200 bg-white p-3 items-center">
              <Text className="text-slate-700 font-medium">View Docs</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-lg border border-slate-200 bg-white p-3 items-center px-4">
              <Ionicons name="chatbubble-outline" size={20} color="#64748b" />
            </TouchableOpacity>
          </>
        ) : item.status === 'Active Lease' ? (
          <TouchableOpacity className="flex-1 rounded-lg border border-emerald-600 bg-white p-3 items-center">
            <Text className="text-emerald-600 font-medium">View Agreement</Text>
          </TouchableOpacity>
        ) : item.status === 'Negotiating' ? (
          <>
            <TouchableOpacity className="flex-1 rounded-lg border border-slate-200 bg-white p-3 items-center">
              <Text className="text-slate-700 font-medium">Reply Offer</Text>
            </TouchableOpacity>
            <TouchableOpacity className="rounded-lg border border-slate-200 bg-white p-3 items-center px-4">
              <Ionicons name="chatbubble-outline" size={20} color="#64748b" />
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      
      <View className="flex-1 flex-row">
        {/* Sidebar */}
        <View className="w-64 bg-[#0f392b] border-r border-slate-800">
          {/* Logo */}
          <View className="flex-row items-center gap-3 px-6 py-8">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 shadow-lg">
              <MaterialIcons name="agriculture" color="white" size={24} />
            </View>
            <View>
              <Text className="text-xl font-bold text-white tracking-tight">FarmLease</Text>
              <Text className="text-[10px] font-semibold uppercase tracking-wider text-slate-300/70">
                Land Management
              </Text>
            </View>
          </View>

          {/* Navigation */}
          <ScrollView className="flex-1 px-4 py-4">
            <TouchableOpacity className="flex-row items-center gap-3 rounded-lg px-3 py-3 mb-1">
              <MaterialIcons name="dashboard" color="#cbd5e1" size={20} />
              <Text className="text-sm font-medium text-slate-300">Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center gap-3 rounded-lg px-3 py-3 mb-1">
              <MaterialIcons name="map" color="#cbd5e1" size={20} />
              <Text className="text-sm font-medium text-slate-300">My Lands</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center gap-3 rounded-lg px-3 py-3 mb-1">
              <MaterialIcons name="upload-file" color="#cbd5e1" size={20} />
              <Text className="text-sm font-medium text-slate-300">Upload Land</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center gap-3 rounded-lg bg-white/10 px-3 py-3 mb-1">
              <MaterialIcons name="pending-actions" color="white" size={20} />
              <Text className="text-sm font-medium text-white">Lease Requests</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center gap-3 rounded-lg px-3 py-3 mb-1">
              <MaterialIcons name="account-balance-wallet" color="#cbd5e1" size={20} />
              <Text className="text-sm font-medium text-slate-300">Financials</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center gap-3 rounded-lg px-3 py-3 mb-1">
              <MaterialIcons name="verified-user" color="#cbd5e1" size={20} />
              <Text className="text-sm font-medium text-slate-300">Escrow Status</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center gap-3 rounded-lg px-3 py-3 mb-1">
              <MaterialIcons name="handshake" color="#cbd5e1" size={20} />
              <Text className="text-sm font-medium text-slate-300">Agreements</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* User Profile */}
          <View className="mt-auto border-t border-white/10 p-4">
            <TouchableOpacity className="flex-row items-center gap-3 rounded-xl bg-white/5 p-3 mb-2">
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT6nH4nkwO8i4jHFK5OJrAVEUaX9KPD_3gQi9czBmAGggy60DZQqZZyqYfwKCSK6enG4geS-t5bUGzong4mgCJVYb-Rt85Mh3qTMguTY07o62eyGxoTFfLvC84usaEynp4Vpqs1iUZJTZg-3qhhFE73W8KGmfH8JIvaB-kgMw8EvMqUfh18UkKlBnIhTeTx4MhbOl3MSyD6lTb_0pTqdqN3O8Es4fGjvNpFA5QFqcmSXtQenx2B-heQbKC5IqtfVkyzgKndRfmhRp_' }}
                className="h-10 w-10 rounded-full border-2 border-emerald-600"
              />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-white">James M.</Text>
                <Text className="text-xs text-slate-400">Premium Owner</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center gap-3 rounded-lg px-3 py-2">
              <MaterialIcons name="logout" color="#f87171" size={18} />
              <Text className="text-sm font-medium text-red-400">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <ScrollView className="flex-1 bg-slate-50">
          <View className="p-6 lg:p-10">
            {/* Header */}
            <View className="mb-8">
              <View className="flex-row items-end justify-between mb-6">
                <View className="flex-1">
                  <Text className="text-3xl font-bold tracking-tight text-[#5D4037] mb-2">
                    Lease Requests
                  </Text>
                  <Text className="text-slate-500 max-w-2xl">
                    Manage incoming offers from prospective farmers. Review terms, negotiate, or accept leases securely.
                  </Text>
                </View>
              </View>

              {/* Search & Filter */}
              <View className="flex-row gap-3">
                <View className="flex-1 relative">
                  <Ionicons
                    name="search"
                    size={20}
                    color="#94a3b8"
                    style={{ position: 'absolute', left: 12, top: 12, zIndex: 1 }}
                  />
                  <TextInput
                    className="rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-700 shadow-sm"
                    placeholder="Search by farmer or plot..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <TouchableOpacity className="flex-row items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <MaterialIcons name="filter-list" size={20} color="#334155" />
                  <Text className="text-sm font-semibold text-slate-700">Filter</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Stats Cards */}
            <View className="mb-8">
              <FlatList
                data={stats}
                renderItem={renderStatCard}
                keyExtractor={(item) => item.label}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-4"
              />
            </View>

            {/* Lease Requests List */}
            <View className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <FlatList
                data={leaseRequests}
                renderItem={renderLeaseRequest}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />

              {/* Pagination */}
              <View className="flex-row items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
                <Text className="text-sm text-slate-500">
                  Showing <Text className="font-medium text-slate-900">1</Text> to{' '}
                  <Text className="font-medium text-slate-900">5</Text> of{' '}
                  <Text className="font-medium text-slate-900">24</Text> results
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="rounded-lg border border-slate-200 px-4 py-2 opacity-50"
                    disabled
                  >
                    <Text className="text-sm font-medium text-slate-600">Previous</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="rounded-lg border border-slate-200 px-4 py-2">
                    <Text className="text-sm font-medium text-slate-600">Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default LeaseRequestsPage;
