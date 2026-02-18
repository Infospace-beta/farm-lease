import React, { useState } from 'react';
import { 
  AdminSidebar,
  AdminHeader,
  AnalyticsStatCard, 
  RevenueChart, 
  UserGrowthChart,
  RegionalHotspot,
  CropDistributionChart 
} from '../../components/admin';

/**
 * PlatformAnalyticsPage Component
 * Admin dashboard for viewing platform analytics, financial performance,
 * user demographics, and regional crop distribution
 * 
 * Features:
 * - Key metrics overview (Revenue, Users, Leases, Yield)
 * - Revenue trends visualization
 * - User growth bar chart
 * - Regional activity heatmap
 * - Top performing crops distribution
 * - Export report functionality
 */
const PlatformAnalyticsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Mock statistics data
  const stats = [
    {
      icon: 'payments',
      iconBg: 'bg-green-50',
      iconColor: '#0f392b',
      trend: '+12.5%',
      trendPositive: true,
      label: 'Total Revenue',
      value: 'Ksh 4.2M'
    },
    {
      icon: 'person-add',
      iconBg: 'bg-blue-50',
      iconColor: '#2563EB',
      trend: '+8.2%',
      trendPositive: true,
      label: 'New Users',
      value: '1,240'
    },
    {
      icon: 'landscape',
      iconBg: 'bg-orange-50',
      iconColor: '#EA580C',
      trend: '+5.4%',
      trendPositive: true,
      label: 'Active Leases',
      value: '856'
    },
    {
      icon: 'agriculture',
      iconBg: 'bg-purple-50',
      iconColor: '#9333EA',
      trend: '-2.1%',
      trendPositive: false,
      label: 'Yield Estimates',
      value: '12.5k Tons'
    }
  ];

  // Mock revenue data for chart
  const revenueData = [
    { month: 'Jan', platformFees: 450000, escrowHolds: 280000 },
    { month: 'Feb', platformFees: 520000, escrowHolds: 350000 },
    { month: 'Mar', platformFees: 480000, escrowHolds: 320000 },
    { month: 'Apr', platformFees: 680000, escrowHolds: 380000 },
    { month: 'May', platformFees: 750000, escrowHolds: 420000 },
    { month: 'Jun', platformFees: 890000, escrowHolds: 480000 }
  ];

  // Mock user growth data
  const userGrowthData = [
    { month: 'Jan', farmers: 180, landOwners: 220 },
    { month: 'Feb', farmers: 220, landOwners: 250 },
    { month: 'Mar', farmers: 160, landOwners: 200 },
    { month: 'Apr', farmers: 260, landOwners: 280 },
    { month: 'May', farmers: 300, landOwners: 320 },
    { month: 'Jun', farmers: 360, landOwners: 380 }
  ];

  // Mock regional data
  const regionalData = [
    { name: 'Kiambu County', leases: 452, percentage: 32, rank: 1, color: '#0f392b' },
    { name: 'Nakuru County', leases: 318, percentage: 24, rank: 2, color: '#5D4037' },
    { name: 'Uasin Gishu', leases: 189, percentage: 15, rank: 3, color: '#9CA3AF' }
  ];

  // Mock crop distribution data
  const cropData = [
    { name: 'Maize', percentage: 35, color: '#0f392b' },
    { name: 'Wheat', percentage: 25, color: '#5D4037' },
    { name: 'Beans', percentage: 20, color: '#13ec80' },
    { name: 'Others', percentage: 20, color: '#E2E8F0' }
  ];

  const handleExportReport = () => {
    console.log('Exporting analytics report...');
    // Implement export logic
  };

  const handleDateRangeChange = () => {
    console.log('Opening date range picker...');
    // Implement date range picker
  };

  return (
    <div className="flex-1 flex-row bg-[#F9FAFB]">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 bg-black/50 z-20 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <AdminSidebar 
        activeRoute="reports" 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex-col">
        <AdminHeader
          title="Platform Analytics"
          subtitle="Deep dive into financial performance, user demographics, and regional crop distribution."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          rightContent={
            <div className="flex-row items-center gap-4">
              <div className="flex-row items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Last 30 Days</span>
                <button 
                  onClick={handleDateRangeChange}
                  className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <span className="material-icons-round" style={{ fontSize: 18, color: '#0f392b' }}>calendar_today</span>
                </button>
              </div>

              <button 
                onClick={handleExportReport}
                className="flex-row items-center gap-2 px-4 py-2 bg-[#0f392b] rounded-lg shadow-lg"
              >
                <span className="material-icons-round" style={{ fontSize: 18, color: '#FFFFFF' }}>download</span>
                <span className="text-white text-sm font-bold">Export Report</span>
              </button>
            </div>
          }
        />
        
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">

          {/* Stats Cards Grid */}
          <div className="flex-row flex-wrap gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex-1 min-w-[240px]">
                <AnalyticsStatCard {...stat} />
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div className="gap-6 mb-8">
            {/* Revenue Trends & User Growth Row */}
            <div className="flex-row flex-wrap gap-6">
              {/* Revenue Trends Chart */}
              <div className="flex-[2] min-w-[400px]">
                <RevenueChart data={revenueData} />
              </div>

              {/* User Growth Chart */}
              <div className="flex-1 min-w-[300px]">
                <UserGrowthChart data={userGrowthData} />
              </div>
            </div>

            {/* Regional Hotspots & Crop Distribution Row */}
            <div className="flex-row flex-wrap gap-6">
              {/* Regional Activity Hotspots */}
              <div className="flex-[2] min-w-[400px]">
                <RegionalHotspot data={regionalData} />
              </div>

              {/* Top Performing Crops */}
              <div className="flex-1 min-w-[300px]">
                <CropDistributionChart data={cropData} totalYield="12.5k" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalyticsPage;
