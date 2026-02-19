import React, { useState } from 'react';
import { AdminSidebar, AdminHeader, ContractRow } from '../../components/admin';

/**
 * AgreementsContractsPage Component
 * Admin dashboard for monitoring and managing lease agreements between parties
 * 
 * Features:
 * - Contract status overview with filter tabs
 * - Search by contract ID, party name, or plot
 * - Signature status tracking
 * - Document download functionality
 * - Duration and expiry monitoring
 */
const AgreementsContractsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'active', 'expiring'

  // Mock contracts data
  const mockContracts = [
    {
      id: '#FL-2023-892',
      createdDate: 'Oct 24, 2023',
      lessee: {
        name: 'John Doe',
        hasImage: true,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRVyxqsOBdCwyGJzPHbq1FhOlzVMHyoh1E0OPOu-llapkq0U3jYW1Rwg2C1Ugmbc7LW8iCf3H63pb_v9DP0GHt7k5WVWz-KfzcOqt2Cj5IVJDE4f62-oluZlqbFJok2b5rctP84eeFDrehPcMd_Zbu44IB2yGCJghAUU_ufV_QAdGLcx9W_Mh5R48riUTKiv558YHftJaE5LbQfTu1CPVeQWPHjB_5oRhIQAX2VV5nHKhInf3zQ51eITb0P3DkQfxyt0yLIbaYfC3r',
        initials: 'JD',
        avatarBg: 'bg-green-100'
      },
      lessor: {
        name: 'Jane Smith',
        hasImage: true,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOHhWmxwYhxgNaHTPSreYBjkWVcAqf3byBu_UtW6A4PBvA3qVdPk-AjtGl28zsWQSvZxflkjvxZUoPb_tYqyvxz0sRXkYm-ntmW9sEYNz56BEXN3FyHT78WfUhM90X3SpiYraeJm-ZiknSB8ReIH9vlUT2E1yskS9Hpeq61BI6HoD992od2rN6ipciwK2JZPSsJTzDcKd8-6KGBVw67v8eGrYN_8FxXm1ST1guaj0IQdQfE5hDtxa-HhY26HoM_eKf0NxRtqP6reHl',
        initials: 'JS',
        avatarBg: 'bg-purple-100'
      },
      plot: {
        name: 'Plot B-14',
        size: '5 Acres',
        location: 'Nakuru County, Rongai',
        lrNumber: 'LR-4521/11'
      },
      duration: {
        label: '3 Years',
        startDate: 'Nov 1, 2023',
        endDate: 'Oct 31, 2026',
        progress: 8 // percentage
      },
      signature: {
        status: 'signed', // 'signed', 'pending', 'active'
        label: 'Fully Signed',
        note: 'Last signed by Lessor\non Oct 25, 2023'
      },
      canDownload: true
    },
    {
      id: '#FL-2023-895',
      createdDate: 'Nov 02, 2023',
      lessee: {
        name: 'Michael Kimani',
        hasImage: false,
        initials: 'MK',
        avatarBg: 'bg-purple-100'
      },
      lessor: {
        name: 'Alice Wanjiku',
        hasImage: true,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1X7ksMAnix_oyIMmvb32pBsvwu-5HCHYIGVp5Ig1IAkpjNqjIa3iA8hp8k4rkt-k2rCOgCy-AXHWm7Fc98eveNup9noSkgU2aL3dSLTO8Eh8i2n9g7Mhm0phcFJOJXv-piRUz0JH_Iw5X2uYa16gDNfAfcfU8QioR39h-glLqfFwtb_qqXGbfEAnB8MYhXGgtmczxCFOuG_Moulp_QG7GXZ1xALpiykXswKnEoc2kwUgIQ9e8HNr6txSB2SYqUtN0h4eaoNAH0yzV',
        initials: 'AW',
        avatarBg: 'bg-blue-100'
      },
      plot: {
        name: 'Plot K-22',
        size: '12 Acres',
        location: 'Uasin Gishu, Eldoret',
        lrNumber: 'LR-1029/99'
      },
      duration: {
        label: '1 Year',
        startDate: 'Jan 1, 2024',
        endDate: 'Dec 31, 2024',
        progress: 0
      },
      signature: {
        status: 'pending',
        label: 'Pending Lessor',
        note: 'Lessee signed on Nov 03, 2023\nAwaiting Alice Wanjiku'
      },
      canDownload: false,
      needsResend: true
    },
    {
      id: '#FL-2022-104',
      createdDate: 'Jun 15, 2022',
      lessee: {
        name: 'Samuel K.',
        hasImage: false,
        initials: 'SK',
        avatarBg: 'bg-blue-100'
      },
      lessor: {
        name: 'Cooperative Land',
        hasImage: false,
        initials: 'CL',
        avatarBg: 'bg-orange-100'
      },
      plot: {
        name: 'Plot M-05',
        size: '2 Acres',
        location: 'Muranga, Makuyu',
        lrNumber: 'LR-3310/12'
      },
      duration: {
        label: '2 Years',
        startDate: 'Jul 1, 2022',
        endDate: 'Jun 30, 2024',
        progress: 75
      },
      signature: {
        status: 'active',
        label: 'Active',
        note: 'Expiring in 7 months'
      },
      canDownload: true
    }
  ];

  // Filter contracts based on search query and active tab
  const filteredContracts = mockContracts.filter(contract => {
    const matchesSearch = 
      contract.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.lessee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.lessor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.plot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contract.plot.lrNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'pending' && contract.signature.status === 'pending') ||
      (activeTab === 'active' && contract.signature.status === 'active') ||
      (activeTab === 'expiring' && contract.duration.progress > 70);
    
    return matchesSearch && matchesTab;
  });

  const handleDownload = (contract) => {
    console.log('Download PDF:', contract.id);
    // Implement PDF download logic
  };

  const handleResendNotification = (contract) => {
    console.log('Resend notification for:', contract.id);
    // Implement notification resend logic
  };

  // Tab counts (in real app, these would come from API)
  const tabs = [
    { key: 'all', label: 'All Contracts', count: 1284 },
    { key: 'pending', label: 'Pending Signatures', count: 42 },
    { key: 'active', label: 'Active', count: 1150 },
    { key: 'expiring', label: 'Expiring Soon', count: 15 }
  ];

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
        activeRoute="agreements" 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex-col">
        <AdminHeader
          title="Agreements & Contracts Oversight"
          subtitle="Monitor, audit, and manage all active lease agreements between parties."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          showSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search contracts by ID, party, or plot..."
        />
        
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex-row justify-between items-end mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-[#5D4037] mb-1" style={{ fontFamily: 'Playfair Display' }}>
                  Agreements & Contracts Oversight
                </h1>
                <p className="text-gray-500 text-sm max-w-xl">
                  Monitor, audit, and manage all active lease agreements between parties.
                </p>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex-row items-center gap-4 flex-wrap">
              <div className="flex-1 min-w-[250px] relative">
                <span 
                  className="material-icons-round" 
                  style={{ position: 'absolute', left: 12, top: 12, zIndex: 1, fontSize: 20, color: '#9CA3AF' }}
                >
                  search
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ID, name or plot..."
                  className="bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm shadow-sm w-full"
                />
              </div>

              <div className="flex-row gap-2">
                <button 
                  className="flex-row items-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <span className="material-icons-round" style={{ fontSize: 18, color: '#6B7280' }}>filter_list</span>
                  <span className="text-sm text-gray-600 hidden sm:flex">Filter</span>
                </button>

                <button 
                  className="flex-row items-center gap-2 px-3 py-3 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <span className="material-icons-round" style={{ fontSize: 18, color: '#6B7280' }}>download</span>
                  <span className="text-sm text-gray-600 hidden sm:flex">Export</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            {/* Tab Navigation */}
            <div className="flex-row flex-wrap gap-4 mb-6 border-b border-gray-100 pb-4">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-1 px-1 ${activeTab === tab.key ? 'border-b-2 border-[#0f392b]' : ''}`}
                >
                  <span className={`text-sm ${activeTab === tab.key ? 'font-bold text-[#0f392b]' : 'font-medium text-gray-500'}`}>
                    {tab.label} ({tab.count})
                  </span>
                </button>
              ))}
            </div>

            {/* Table Header */}
            <div className="bg-gray-50/50 rounded-lg px-4 py-3 mb-2">
              <div className="flex-row">
                <div className="flex-[0.15]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Agreement ID
                  </span>
                </div>
                <div className="flex-[0.20]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Parties (Lessee & Lessor)
                  </span>
                </div>
                <div className="flex-[0.18]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Land Plot
                  </span>
                </div>
                <div className="flex-[0.15]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Duration
                  </span>
                </div>
                <div className="flex-[0.17]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Signature Status
                  </span>
                </div>
                <div className="flex-[0.15]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">
                    Actions
                  </span>
                </div>
              </div>
            </div>

            {/* Contract Rows */}
            <div className="min-h-[600px]">
              {filteredContracts.map((contract, index) => (
                <ContractRow
                  key={contract.id}
                  contract={contract}
                  onDownload={handleDownload}
                  onResendNotification={handleResendNotification}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex-row justify-between items-center py-4 border-t border-gray-100 mt-4 px-4">
              <p className="text-xs text-gray-500">
                Showing <span className="font-bold text-gray-800">1-4</span> of{' '}
                <span className="font-bold text-gray-800">1,284</span> contracts
              </p>

              <div className="flex-row gap-2">
                <button 
                  className="w-8 h-8 items-center justify-center rounded-lg border border-gray-200"
                  disabled
                >
                  <span className="material-icons-round" style={{ fontSize: 16, color: '#D1D5DB' }}>chevron_left</span>
                </button>

                <button className="w-8 h-8 items-center justify-center rounded-lg bg-[#0f392b]">
                  <span className="text-white font-bold text-xs">1</span>
                </button>

                <button className="w-8 h-8 items-center justify-center rounded-lg border border-gray-200">
                  <span className="text-gray-600 font-bold text-xs">2</span>
                </button>

                <button className="w-8 h-8 items-center justify-center rounded-lg border border-gray-200">
                  <span className="text-gray-600 font-bold text-xs">3</span>
                </button>

                <div className="w-8 h-8 items-center justify-center">
                  <span className="text-gray-400">...</span>
                </div>

                <button className="w-8 h-8 items-center justify-center rounded-lg border border-gray-200">
                  <span className="text-gray-600 font-bold text-xs">32</span>
                </button>

                <button 
                  className="w-8 h-8 items-center justify-center rounded-lg border border-gray-200"
                >
                  <span className="material-icons-round" style={{ fontSize: 16, color: '#6B7280' }}>chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementsContractsPage;
