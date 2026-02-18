import React, { useState } from 'react';
import { AdminSidebar, AdminHeader } from '../../components/admin';
import VerificationStatCard from '../../components/admin/VerificationStatCard';
import VerificationTableRow from '../../components/admin/VerificationTableRow';

// Main Component
const LandVerificationsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    pendingOnly: false,
    highPriority: false,
    flaggedFraud: false
  });

  // Mock data
  const verifications = [
    {
      id: 1,
      ownerName: 'John Doe',
      ownerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRVyxqsOBdCwyGJzPHbq1FhOlzVMHyoh1E0OPOu-llapkq0U3jYW1Rwg2C1Ugmbc7LW8iCf3H63pb_v9DP0GHt7k5WVWz-KfzcOqt2Cj5IVJDE4f62-oluZlqbFJok2b5rctP84eeFDrehPcMd_Zbu44IB2yGCJghAUU_ufV_QAdGLcx9W_Mh5R48riUTKiv558YHftJaE5LbQfTu1CPVeQWPHjB_5oRhIQAX2VV5nHKhInf3zQ51eITb0P3DkQfxyt0yLIbaYfC3r',
      submittedTime: 'Submitted 2 hrs ago',
      plotId: 'LR-4521/11',
      titleDeedNumber: 'KJI-9928-XX',
      region: 'Kiambu County',
      status: 'pending',
      isInvalid: false
    },
    {
      id: 2,
      ownerName: 'Jane Smith',
      ownerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOHhWmxwYhxgNaHTPSreYBjkWVcAqf3byBu_UtW6A4PBvA3qVdPk-AjtGl28zsWQSvZxflkjvxZUoPb_tYqyvxz0sRXkYm-ntmW9sEYNz56BEXN3FyHT78WfUhM90X3SpiYraeJm-ZiknSB8ReIH9vlUT2E1yskS9Hpeq61BI6HoD992od2rN6ipciwK2JZPSsJTzDcKd8-6KGBVw67v8eGrYN_8FxXm1ST1guaj0IQdQfE5hDtxa-HhY26HoM_eKf0NxRtqP6reHl',
      submittedTime: 'Submitted 5 hrs ago',
      plotId: 'LR-8829/04',
      titleDeedNumber: 'NBI-2210-AB',
      region: 'Nairobi',
      status: 'verified',
      isInvalid: false
    },
    {
      id: 3,
      ownerName: 'Michael Kimani',
      initials: 'MK',
      avatarBg: 'bg-purple-100',
      avatarText: 'text-purple-600',
      avatarBorder: 'border-purple-200',
      submittedTime: 'Submitted 1 day ago',
      plotId: 'LR-1029/99',
      titleDeedNumber: 'KJI-INVALID',
      region: 'Nakuru',
      status: 'flagged',
      isInvalid: true,
      isOwnerUpdated: true
    },
    {
      id: 4,
      ownerName: 'Alice Wanjiku',
      ownerImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1X7ksMAnix_oyIMmvb32pBsvwu-5HCHYIGVp5Ig1IAkpjNqjIa3iA8hp8k4rkt-k2rCOgCy-AXHWm7Fc98eveNup9noSkgU2aL3dSLTO8Eh8i2n9g7Mhm0phcFJOJXv-piRUz0JH_Iw5X2uYa16gDNfAfcfU8QioR39h-glLqfFwtb_qqXGbfEAnB8MYhXGgtmczxCFOuG_Moulp_QG7GXZ1xALpiykXswKnEoc2kwUgIQ9e8HNr6txSB2SYqUtN0h4eaoNAH0yzV',
      submittedTime: 'Submitted 2 days ago',
      plotId: 'LR-3310/12',
      titleDeedNumber: 'MRU-5541-XY',
      region: 'Meru',
      status: 'pending',
      isInvalid: false
    }
  ];

  const handleVerify = (item) => {
    console.log('Verify:', item);
    // Implement verification logic
  };

  const handleFlag = (item) => {
    console.log('Flag:', item);
    // Implement flag logic
  };

  const handleViewDetails = (item) => {
    console.log('View Details:', item);
    // Navigate to details page
  };

  const toggleFilter = (filterKey) => {
    setFilters(prev => ({ ...prev, [filterKey]: !prev[filterKey] }));
  };

  return (
    <div className="flex flex-row bg-[#f8fafc] min-h-screen">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 bg-black/50 z-20 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <AdminSidebar 
        activeRoute="land-verifications" 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminHeader
          title="Land Verifications"
          subtitle="Review and validate land title deeds, ownership documents, and property boundaries before approving listings."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          showSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by Name, ID, or Plot Number..."
        />
        
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex flex-row justify-between items-end mb-8">
            <div className="flex-1">
              <div className="flex flex-row items-center gap-2 mb-1">
                <span className="material-icons-round text-[24px] text-[#5D4037]">verified_user</span>
                <h1 className="text-3xl font-bold text-[#5D4037]" style={{ fontFamily: 'Playfair Display' }}>
                  Land Verifications
                </h1>
              </div>
              <p className="text-gray-500 text-sm max-w-xl">
                Manual validation of property titles. Cross-reference the Title Deed Numbers below with the national land registry to approve or flag listings.
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-row items-center gap-4">
              <div className="relative">
                <span className="material-icons-round text-[20px] text-[#9CA3AF] absolute left-3 top-2.5 z-10">search</span>
                <input
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-64"
                  placeholder="Search by Plot ID or Title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="flex flex-row px-4 py-2 bg-white border border-gray-200 rounded-lg items-center gap-2">
                <span className="material-icons-round text-[18px] text-[#4B5563]">filter_list</span>
                <span className="text-sm font-medium text-gray-600">Filter</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-row gap-6 mb-8">
            <VerificationStatCard
              title="Pending Verification"
              value="12"
              subtitle="Requires manual check"
              icon="pending-actions"
              iconBg="bg-orange-50"
              iconColor="#EA580C"
            />
            <VerificationStatCard
              title="Verified Today"
              value="48"
              subtitle="Approved manually"
              icon="check-circle"
              iconBg="bg-emerald-50"
              iconColor="#047857"
            />
            <VerificationStatCard
              title="Flagged Discrepancies"
              value="3"
              subtitle="Issues with Title Deed Numbers"
              icon="report-problem"
              iconBg="bg-red-50"
              iconColor="#DC2626"
            />
          </div>

          {/* Verification Queue Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/30 flex flex-row justify-between items-center">
              <h2 className="text-lg font-bold text-[#5D4037]" style={{ fontFamily: 'Playfair Display' }}>
                Title Deed Verification Queue
              </h2>
              <div className="flex flex-row gap-2">
                <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-md">
                  <span className="text-xs font-medium text-gray-600">Export List</span>
                </button>
                <button className="px-3 py-1.5 bg-[#0f392b] rounded-md flex flex-row items-center gap-1">
                  <span className="material-icons-round text-[14px] text-white">refresh</span>
                  <span className="text-xs font-medium text-white">Refresh Data</span>
                </button>
              </div>
            </div>

            {/* Table Column Headers */}
            <div className="bg-gray-50 border-b border-gray-100 py-4 px-6 flex flex-row">
              <span className="w-1/5 text-xs font-bold text-[#5D4037] uppercase tracking-widest">
                Owner Name
              </span>
              <span className="w-1/6 text-xs font-bold text-[#5D4037] uppercase tracking-widest">
                Plot ID
              </span>
              <span className="w-1/5 text-xs font-bold text-[#047857] uppercase tracking-widest bg-emerald-50/30 px-2">
                Title Deed Number
              </span>
              <span className="w-1/6 text-xs font-bold text-[#5D4037] uppercase tracking-widest">
                Region
              </span>
              <span className="w-1/12 text-xs font-bold text-[#5D4037] uppercase tracking-widest">
                Status
              </span>
              <span className="w-1/4 text-xs font-bold text-[#5D4037] uppercase tracking-widest text-right">
                Action
              </span>
            </div>

            {/* Table Rows */}
            <div className="max-h-96 overflow-y-auto">
              {verifications.map((item) => (
                <VerificationTableRow
                  key={item.id}
                  item={item}
                  onVerify={handleVerify}
                  onFlag={handleFlag}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Table Footer - Pagination */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex flex-row items-center justify-between">
              <p className="text-xs text-gray-500">
                Showing <span className="font-bold text-gray-700">1-4</span> of{' '}
                <span className="font-bold text-gray-700">12</span> pending verifications
              </p>
              <div className="flex flex-row gap-2">
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white"
                  disabled
                >
                  <span className="material-icons-round text-[14px] text-[#9CA3AF]">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white">
                  <span className="material-icons-round text-[14px] text-[#4B5563]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Section - Protocol & Filters */}
          <div className="mt-8 flex flex-row gap-6">
            {/* Manual Verification Protocol */}
            <div className="flex-1 bg-[#0f392b] rounded-xl p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10" style={{ transform: 'translate(50px, -50px)' }}>
                <span className="material-icons-round text-[150px] text-white">verified</span>
              </div>
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Playfair Display' }}>
                  Manual Verification Protocol
                </h3>
                <div className="flex flex-row items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <span className="text-xs font-medium text-yellow-200 uppercase tracking-wider">
                    Review Required
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-green-100/80 mb-2">
                    • Cross-check the <span className="font-bold">Title Deed Number</span> with the physical land registry ledger or government portal.
                  </p>
                  <p className="text-sm text-green-100/80 mb-2">
                    • Verify the <span className="font-bold">Owner Name</span> matches the deed holder exactly.
                  </p>
                  <p className="text-sm text-green-100/80 mb-2">
                    • Confirm the <span className="font-bold">Plot ID</span> corresponds to the correct region.
                  </p>
                </div>
                <button className="border border-white/30 px-3 py-1.5 rounded self-start">
                  <span className="text-xs font-bold text-white">Download Guidelines PDF</span>
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="w-1/3 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-[#5D4037] mb-4 text-sm uppercase tracking-widest">
                Quick Filters
              </h3>
              <div className="space-y-2">
                <button 
                  className="flex flex-row items-center gap-2 py-2"
                  onClick={() => toggleFilter('pendingOnly')}
                >
                  <div className={`w-5 h-5 rounded border ${filters.pendingOnly ? 'bg-[#0f392b] border-[#0f392b]' : 'bg-white border-gray-300'} flex items-center justify-center`}>
                    {filters.pendingOnly && (
                      <span className="material-icons-round text-[14px] text-white">check</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">Show Pending Only</span>
                </button>

                <button 
                  className="flex flex-row items-center gap-2 py-2"
                  onClick={() => toggleFilter('highPriority')}
                >
                  <div className={`w-5 h-5 rounded border ${filters.highPriority ? 'bg-[#0f392b] border-[#0f392b]' : 'bg-white border-gray-300'} flex items-center justify-center`}>
                    {filters.highPriority && (
                      <span className="material-icons-round text-[14px] text-white">check</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">High Priority Plots</span>
                </button>

                <button 
                  className="flex flex-row items-center gap-2 py-2"
                  onClick={() => toggleFilter('flaggedFraud')}
                >
                  <div className={`w-5 h-5 rounded border ${filters.flaggedFraud ? 'bg-[#0f392b] border-[#0f392b]' : 'bg-white border-gray-300'} flex items-center justify-center`}>
                    {filters.flaggedFraud && (
                      <span className="material-icons-round text-[14px] text-white">check</span>
                    )}
                  </div>
                  <span className="text-sm text-gray-600">Flagged for Fraud</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LandVerificationsPage;
