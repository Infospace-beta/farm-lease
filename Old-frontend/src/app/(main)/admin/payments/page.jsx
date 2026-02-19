import React, { useState } from 'react';
import { AdminSidebar, AdminHeader } from '../../components/admin';
import EscrowStatCard from '../../components/admin/EscrowStatCard';
import TransactionRow from '../../components/admin/TransactionRow';

// Main Component
const PaymentsEscrowPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'lease', 'subscriptions'
  const [feePercentage, setFeePercentage] = useState(10);

  // Mock transaction data
  const transactions = [
    {
      id: 'TXN-8829-LE',
      date: 'Oct 24, 2023, 10:42 AM',
      beneficiary: {
        name: 'John Doe (Lessor)',
        from: 'Alice W. (Lessee)',
        initials: 'JD',
        avatarBg: 'bg-[#0f392b]',
        hasImage: false
      },
      type: 'lease',
      typeLabel: 'Lease Escrow',
      details: 'Land Lease - Plot LR-4521/11 (5 Acres)',
      amount: 450000.00,
      platformFee: 45000.00,
      feePercentage: 10,
      status: 'held',
      statusLabel: 'Held in Escrow',
      statusNote: 'Pending: Lessee confirmation of soil report.'
    },
    {
      id: 'SUB-9921-AD',
      date: 'Oct 23, 2023, 09:00 AM',
      beneficiary: {
        name: 'Agro-Input Ltd',
        from: 'Agro-Dealer',
        hasImage: true,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRVyxqsOBdCwyGJzPHbq1FhOlzVMHyoh1E0OPOu-llapkq0U3jYW1Rwg2C1Ugmbc7LW8iCf3H63pb_v9DP0GHt7k5WVWz-KfzcOqt2Cj5IVJDE4f62-oluZlqbFJok2b5rctP84eeFDrehPcMd_Zbu44IB2yGCJghAUU_ufV_QAdGLcx9W_Mh5R48riUTKiv558YHftJaE5LbQfTu1CPVeQWPHjB_5oRhIQAX2VV5nHKhInf3zQ51eITb0P3DkQfxyt0yLIbaYfC3r'
      },
      type: 'subscription',
      typeLabel: 'Monthly Subscription',
      details: 'Premium Dealer Tier - Oct 2023',
      amount: 5000.00,
      platformFee: 0,
      feeIncluded: true,
      status: 'active',
      statusLabel: 'Active',
      statusNote: 'Auto-renew enabled.'
    },
    {
      id: 'TXN-6610-LE',
      date: 'Oct 22, 2023, 09:00 AM',
      beneficiary: {
        name: 'Michael Kimani',
        from: 'GreenHarvest Co.',
        initials: 'MK',
        avatarBg: 'bg-[#5D4037]',
        hasImage: false
      },
      type: 'lease',
      typeLabel: 'Lease Escrow',
      details: 'Land Lease - Plot LR-1029/99',
      amount: 120000.00,
      platformFee: 12000.00,
      feePercentage: 10,
      status: 'held',
      statusLabel: 'Held in Escrow',
      statusNote: 'Awaiting inspection confirmation.'
    },
    {
      id: 'SUB-8832-KS',
      date: 'Oct 22, 2023, 08:30 AM',
      beneficiary: {
        name: 'Kenya Seeds Co',
        from: 'Agro-Dealer',
        hasImage: true,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOHhWmxwYhxgNaHTPSreYBjkWVcAqf3byBu_UtW6A4PBvA3qVdPk-AjtGl28zsWQSvZxflkjvxZUoPb_tYqyvxz0sRXkYm-ntmW9sEYNz56BEXN3FyHT78WfUhM90X3SpiYraeJm-ZiknSB8ReIH9vlUT2E1yskS9Hpeq61BI6HoD992od2rN6ipciwK2JZPSsJTzDcKd8-6KGBVw67v8eGrYN_8FxXm1ST1guaj0IQdQfE5hDtxa-HhY26HoM_eKf0NxRtqP6reHl'
      },
      type: 'subscription',
      typeLabel: 'Monthly Subscription',
      details: 'Standard Dealer Tier - Oct 2023',
      amount: 5000.00,
      platformFee: 0,
      feeIncluded: true,
      status: 'active',
      statusLabel: 'Active',
      statusNote: 'Next billing: Nov 22, 2023'
    },
    {
      id: 'TXN-4412-LE',
      date: 'Oct 21, 2023, 04:10 PM',
      beneficiary: {
        name: 'Alice Wanjiku',
        from: 'AgriCorp Ltd',
        hasImage: true,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1X7ksMAnix_oyIMmvb32pBsvwu-5HCHYIGVp5Ig1IAkpjNqjIa3iA8hp8k4rkt-k2rCOgCy-AXHWm7Fc98eveNup9noSkgU2aL3dSLTO8Eh8i2n9g7Mhm0phcFJOJXv-piRUz0JH_Iw5X2uYa16gDNfAfcfU8QioR39h-glLqfFwtb_qqXGbfEAnB8MYhXGgtmczxCFOuG_Moulp_QG7GXZ1xALpiykXswKnEoc2kwUgIQ9e8HNr6txSB2SYqUtN0h4eaoNAH0yzV'
      },
      type: 'lease',
      typeLabel: 'Lease Escrow',
      details: 'Land Lease - Plot LR-3310/12 (10 Acres)',
      amount: 850000.00,
      platformFee: 85000.00,
      feePercentage: 10,
      status: 'released',
      statusLabel: 'Funds Released',
      statusNote: 'Contract signed & verified.'
    }
  ];

  const handleExport = () => {
    console.log('Export ledger');
  };

  const handleAction = (transaction, action) => {
    console.log('Action:', action, transaction);
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
        activeRoute="payments" 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminHeader
          title="Escrow & Payments Ledger"
          subtitle="Monitor real-time financial flows, escrow holdings, and subscription revenue across the platform."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          showSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by Transaction ID, Name, etc..."
        />
        
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-row justify-between items-end mb-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[#5D4037] mb-1" style={{ fontFamily: 'Playfair Display' }}>
                Escrow & Payments Ledger
              </h1>
              <p className="text-gray-500 text-sm max-w-xl">
                Monitor real-time financial flows, escrow holdings, and subscription revenue across the platform.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-row items-center gap-4">
              <button 
                onClick={handleExport}
                className="flex flex-row px-4 py-2 bg-[#0f392b] rounded-lg items-center gap-2"
              >
                <span className="material-icons-round text-[18px] text-white">file_download</span>
                <span className="text-sm font-medium text-white">Export Ledger</span>
              </button>

              <div className="relative w-64">
                <span className="material-icons-round text-[20px] text-[#9CA3AF] absolute left-3 top-2.5 z-10">search</span>
                <input
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-full"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button className="p-2 bg-white border border-gray-200 rounded-lg">
                <span className="material-icons-round text-[18px] text-[#4B5563]">notifications</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-row flex-wrap gap-6 mb-10">
            <EscrowStatCard
              type="escrow-total"
              title="Current Escrow Total"
              value="Ksh 24,580,200"
              subtitle="Held Securely"
              trend="+3.2%"
              trendLabel="vs last month"
              icon="account-balance"
            />
            <EscrowStatCard
              type="released"
              title="Released Funds"
              value="Ksh 12,405,000"
              subtitle="85% release rate"
              icon="outbound"
            />
            <EscrowStatCard
              type="revenue"
              title="Platform Revenue"
              value="Ksh 2,350,400"
              subtitle="Subscription + Transaction Fees"
              trend="+15%"
              icon="monetization-on"
            />
            <EscrowStatCard
              type="fee-settings"
              title="Platform Fee Settings"
              value={`${feePercentage}%`}
              subtitle="Lease Service Fee"
              icon="tune"
              feePercentage={feePercentage}
              onFeeChange={setFeePercentage}
            />
          </div>

          {/* Transaction Log */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-row justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#5D4037]" style={{ fontFamily: 'Playfair Display' }}>
                    Transaction Log
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Real-time view of all financial movements including dealer subscriptions & Lease Escrow.
                  </p>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <div className="border border-gray-200 rounded-lg bg-gray-50">
                    <button className="px-3 py-2">
                      <span className="text-sm text-gray-600">All Transactions</span>
                    </button>
                  </div>
                  <button className="p-2 border border-gray-200 rounded-lg">
                    <span className="material-icons-round text-[20px] text-[#9CA3AF]">filter_list</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Table Column Headers */}
            <div className="bg-gray-50/50 border-b border-gray-100 px-6 py-4">
              <div className="flex flex-row">
                <span className="flex-[0.15] text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Transaction ID / Date
                </span>
                <span className="flex-[0.18] text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Beneficiary / Payer
                </span>
                <span className="flex-[0.18] text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Type & Details
                </span>
                <span className="flex-[0.13] text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Amount (Ksh)
                </span>
                <span className="flex-[0.12] text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Platform Fee
                </span>
                <span className="flex-[0.18] text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status & Conditions
                </span>
                <span className="flex-[0.06] text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Action
                </span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="max-h-[500px] overflow-y-auto">
              {transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  onAction={handleAction}
                />
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-row items-center justify-between">
              <p className="text-xs text-gray-500">Showing 5 of 128 transactions</p>
              <div className="flex flex-row gap-2">
                <button className="px-3 py-1 bg-white border border-gray-200 rounded" disabled>
                  <span className="text-xs font-medium text-gray-400">Previous</span>
                </button>
                <button className="px-3 py-1 bg-white border border-gray-200 rounded">
                  <span className="text-xs font-medium text-gray-500">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsEscrowPage;
