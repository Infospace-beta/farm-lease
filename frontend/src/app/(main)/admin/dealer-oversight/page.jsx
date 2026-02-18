import React, { useState } from 'react';
import { AdminSidebar, AdminHeader } from '../../components/admin';
import ComplianceStatCard from '../../components/admin/ComplianceStatCard';
import DealerViolationRow from '../../components/admin/DealerViolationRow';

// Main Component
const AgroDealerOversightPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'

  // Mock data for dealers with violations
  const dealers = [
    {
      id: 1,
      name: 'GreenHarvest Supplies',
      dealerId: '#DL-4402',
      initials: 'GH',
      avatarBg: 'bg-[#8d6e63]',
      violation: 'Counterfeit Report',
      violationType: 'severe',
      rating: 3.2,
      ratingCount: 45,
      flagFrequency: '3rd Violation',
      flagType: 'red',
      totalProducts: 12,
      flaggedItems: 3,
      status: 'under-review',
      statusLabel: 'Under Review',
      hasAlert: true,
      highlighted: true
    },
    {
      id: 2,
      name: 'Vuna Zona',
      dealerId: '#DL-1109',
      initials: 'VZ',
      avatarBg: 'bg-[#5D4037]',
      violation: 'Price Fixing',
      violationType: 'warning',
      rating: 4.1,
      ratingCount: 89,
      flagFrequency: '1st Warning',
      flagType: 'yellow',
      totalProducts: 62,
      flaggedItems: 1,
      status: 'warning-sent',
      statusLabel: 'Warning Sent',
      hasAlert: false,
      highlighted: false
    },
    {
      id: 3,
      name: 'Savanna Agrochemicals',
      dealerId: '#DL-3391',
      initials: 'SA',
      avatarBg: 'bg-gray-500',
      violation: 'Expired License',
      violationType: 'minor',
      rating: 3.9,
      ratingCount: 12,
      flagFrequency: 'Repeat',
      flagType: 'gray',
      totalProducts: 18,
      flaggedItems: 0,
      status: 'suspended',
      statusLabel: 'Suspended',
      hasAlert: false,
      highlighted: false
    },
    {
      id: 4,
      name: 'TopPest Control',
      dealerId: '#DL-9221',
      initials: 'TP',
      avatarBg: 'bg-red-800',
      violation: 'Banned Substance',
      violationType: 'severe',
      rating: 2.1,
      ratingCount: 8,
      flagFrequency: 'Severe',
      flagType: 'red-severe',
      totalProducts: 5,
      flaggedItems: 5,
      status: 'severe-violation',
      statusLabel: 'Severe Violation',
      hasAlert: false,
      highlighted: true
    }
  ];

  const handleInvestigate = (dealer) => {
    console.log('Investigate:', dealer);
  };

  const handleSuspend = (dealer, type) => {
    console.log('Suspend:', type, dealer);
  };

  const handleMessage = (dealer) => {
    console.log('Message:', dealer);
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
        activeRoute="agro-dealer" 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminHeader
          title="Agro-Dealer Compliance Oversight"
          subtitle="Monitor flagged dealers, manage compliance violations, and enforce network quality standards."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          showSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search dealers by name or ID..."
        />
        
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#5D4037] mb-1" style={{ fontFamily: 'Playfair Display' }}>
                Agro-Dealer Compliance Oversight
              </h1>
              <p className="text-gray-500 text-sm max-w-xl">
                Monitor flagged dealers, manage compliance violations, and enforce network quality standards.
              </p>
            </div>

            {/* Search and Export */}
            <div className="flex flex-row items-center gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none md:w-64">
                <span className="material-icons-round text-[20px] text-[#9CA3AF] absolute left-3 top-2.5 z-10">search</span>
                <input
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full"
                  placeholder="Search violations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="flex flex-row px-4 py-2 bg-white border border-gray-200 rounded-lg items-center gap-2">
                <span className="material-icons-round text-[18px] text-[#4B5563]">file_download</span>
                <span className="text-sm font-medium text-gray-600">Export Compliance Log</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-row items-center gap-1 mb-8 border-b border-gray-200">
            <button 
              className={`px-6 py-3 ${activeTab === 'active' ? 'border-b-2 border-[#047857]' : 'border-b-2 border-transparent'}`}
              onClick={() => setActiveTab('active')}
            >
              <span className={`text-sm font-bold ${activeTab === 'active' ? 'text-[#047857]' : 'text-gray-500'}`}>
                Active Violations
              </span>
            </button>
            <button 
              className={`px-6 py-3 ${activeTab === 'history' ? 'border-b-2 border-[#047857]' : 'border-b-2 border-transparent'}`}
              onClick={() => setActiveTab('history')}
            >
              <span className={`text-sm font-medium ${activeTab === 'history' ? 'text-[#047857]' : 'text-gray-500'}`}>
                Compliance History
              </span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-row flex-wrap gap-6 mb-10">
            <ComplianceStatCard
              title="Active Dealers"
              value="142"
              subtitle="138 Fully Compliant"
              icon="store"
              iconBg="bg-green-50"
              iconColor="#047857"
              subtitleIcon="check-circle"
              subtitleBg="bg-green-50"
              subtitleColor="text-[#047857]"
            />
            <ComplianceStatCard
              title="Avg Compliance Score"
              value="94%"
              subtitle="Target: 90% minimum"
              icon="verified"
              iconBg="bg-blue-50"
              iconColor="#2563EB"
              subtitleColor="text-gray-500"
            />
            <ComplianceStatCard
              title="Under Investigation"
              value="4"
              subtitle="Requires immediate review"
              icon="manage-search"
              iconBg="bg-yellow-50"
              iconColor="#CA8A04"
              subtitleBg="bg-yellow-50"
              subtitleColor="text-yellow-700"
            />
            <ComplianceStatCard
              title="Flagged Listings"
              value="7"
              subtitle="Investigate now"
              icon="report-problem"
              iconBg="bg-red-50"
              iconColor="#DC2626"
              subtitleIcon="priority-high"
              subtitleBg="bg-red-50"
              subtitleColor="text-red-600"
            />
          </div>

          {/* Violations Table */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-row justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#5D4037]" style={{ fontFamily: 'Playfair Display' }}>
                Compliance Violations
              </h2>
              <button className="px-4 py-1.5 bg-red-50 border border-red-100 rounded-lg">
                <span className="text-xs font-semibold text-red-700">
                  Flagged Dealers & Violations
                </span>
              </button>
            </div>

            {/* Table Header */}
            <div className="border-b border-gray-100 pb-4 mb-4">
              <div className="flex flex-row">
                <span className="flex-[0.22] text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">
                  Dealer Name
                </span>
                <span className="flex-[0.12] text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Ratings
                </span>
                <span className="flex-[0.12] text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                  Flag Frequency
                </span>
                <span className="flex-[0.12] text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                  Total Products
                </span>
                <span className="flex-[0.12] text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                  Flagged Items
                </span>
                <span className="flex-[0.10] text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                  Status
                </span>
                <span className="flex-[0.20] text-xs font-bold text-gray-400 uppercase tracking-widest text-right pr-2">
                  Actions
                </span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="max-h-96 overflow-y-auto">
              {dealers.map((dealer) => (
                <DealerViolationRow
                  key={dealer.id}
                  dealer={dealer}
                  onInvestigate={handleInvestigate}
                  onSuspend={handleSuspend}
                  onMessage={handleMessage}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgroDealerOversightPage;
