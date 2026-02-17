import React, { useState } from 'react';
import { 
  IoDownloadOutline, 
  IoCheckboxOutline, 
  IoAdd, 
  IoSearch, 
  IoChevronDown, 
  IoFilter,
  IoMenu,
  IoClose
} from 'react-icons/io5';
import { MdAddLocationAlt } from 'react-icons/md';
import FarmOwnerSidebar from '../../components/layout/FarmOwnerSidebar';
import LandCard from '../../components/Farm-Owner/LandCard';

const MyLandsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [soilTypeFilter, setSoilTypeFilter] = useState('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const landsData = [
    {
      id: 'PL-A401',
      name: 'Highland North',
      location: 'Nairobi County, Zone 4',
      size: '3.5 Acres',
      soilType: 'Loam (Rich)',
      status: 'Leased',
      statusColor: 'bg-emerald-500',
      tenant: {
        name: 'John Doe',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEeNaQ9ipY6hAWWDXUwBn_KT5iX0Xx6_qbKyAQKAGY5cKJrFkEEpGY8aZIJZewYzN9XKiSk_Bu75ATzV5jPRjwG4RrCJ8DaRtXbEs9gMFmh_kH-TV9Z0wlF200GtFOMO2yGGfavlW3vwurJyi85G52zDef_1NGPd46LZJ7JvsQcRpHAvWc78c4Tc6AQ5tuvf9GBGwI38AhBLDRdYl3e1tY9Zij3apSb5VGUvMQrLrdiYMEfsJlTEvwbPwiscC33L4HaPJMa4mYYPAV',
      },
      expires: 'Dec 2024',
      revenue: 'Ksh 50,000',
      revenueLabel: 'Monthly Revenue',
      actionLabel: 'Manage',
      actionColor: 'bg-slate-50',
    },
    {
      id: 'PL-B205',
      name: 'Eastern Ridge',
      location: 'Machakos County, Zone 2',
      size: '2.0 Acres',
      soilType: 'Red Clay',
      status: 'Pending',
      statusColor: 'bg-amber-500',
      topBidder: {
        name: 'Jane Smith',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrxrphhwqUHyCR0IxEQ_HDv3R9z3CDNvg51eW7CsOusce7YRYRwNyJPkR8akl-FZtjjwN0r3G0tjmdYEEvElAZ4EAJkaET-4gbBLZnf_dFp7-DAc3E5vz1Gexp46w68bvmUuC3Y7Sblw-h6p9HeJEhNCwJfDhKN1psyCOGzYzhCsb-5uSeBFVPCkL02DZzl5uOG_WlxRtwX1kfBZVo-bJNuKq9NRS-PyBlHtMMrqW0i2IaZfJoiGOXnfriDpbKXCFZQuxv5FA7o8JK',
      },
      bids: '3 Active',
      revenue: 'Ksh 45,000',
      revenueLabel: 'Current Top Offer',
      actionLabel: 'Review',
      actionColor: 'bg-amber-500',
    },
    {
      id: 'PL-C109',
      name: 'Valley Farms',
      location: 'Nakuru County, Zone 1',
      size: '5.0 Acres',
      soilType: 'Volcanic Silt',
      status: 'Under Review',
      statusColor: 'bg-blue-500',
      applicant: {
        name: 'Michael K.',
        initials: 'MK',
      },
      stage: 'Doc Check',
      revenue: 'Ksh 60,000',
      revenueLabel: 'Proposed Revenue',
      actionLabel: 'Docs',
      actionColor: 'bg-blue-50',
    },
    {
      id: 'PL-D450',
      name: 'River Side Plot',
      location: 'Kisumu County, Zone 7',
      size: '1.2 Acres',
      soilType: 'Alluvial',
      status: 'Vacant',
      statusColor: 'bg-slate-500',
      lastCrop: 'Rice',
      listed: '2 days ago',
      revenue: 'Ksh 25,000',
      revenueLabel: 'Listing Price',
      actionLabel: 'Boost',
      actionColor: 'bg-slate-900',
    },
    {
      id: 'PL-E220',
      name: 'Sunset Orchards',
      location: 'Kiambu County, Zone 5',
      size: '8.0 Acres',
      soilType: 'Red Loam',
      status: 'Leased',
      statusColor: 'bg-emerald-500',
      tenant: {
        name: 'GreenLeaf',
        initials: 'GL',
      },
      expires: 'Jun 2025',
      revenue: 'Ksh 120,000',
      revenueLabel: 'Monthly Revenue',
      actionLabel: 'Manage',
      actionColor: 'bg-slate-50',
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <div className={`fixed lg:relative z-30 h-full transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden'
      }`}>
        {isSidebarOpen && <FarmOwnerSidebar />}
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <div className="px-6 lg:px-10 py-6">
          {/* Toggle Button & Header */}
          <div className="flex items-start gap-4 mb-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700"
            >
              {isSidebarOpen ? <IoClose className="text-xl text-slate-700 dark:text-slate-200" /> : <IoMenu className="text-xl text-slate-700 dark:text-slate-200" />}
            </button>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[#5D4037] font-serif dark:text-white mb-2">
                My Lands
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Manage your land plots, track soil health, and monitor leasing status.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
              <IoDownloadOutline className="text-lg" />
              Export
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
              <IoCheckboxOutline className="text-lg" />
              Bulk Actions
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all">
              <IoAdd className="text-lg" />
              Add New Plot
            </button>
          </div>

          {/* Search and Filters */}
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200 lg:flex-row lg:items-center lg:justify-between dark:bg-surface-dark dark:border-slate-700 mb-6">
            {/* Search Input */}
            <div className="relative mb-4">
              <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-slate-500"
                placeholder="Search by Plot ID, Tenant, or Location..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Row */}
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200">
                  <option>Status: All</option>
                  <option>Leased</option>
                  <option>Pending</option>
                  <option>Reviewing</option>
                  <option>Vacant</option>
                </select>
                <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
              </div>
              
              <div className="relative">
                <select className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2.5 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-primary focus:ring-1 focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-slate-200">
                  <option>Soil Type: All</option>
                  <option>Loam</option>
                  <option>Clay</option>
                  <option>Silt</option>
                  <option>Sandy</option>
                </select>
                <IoChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
              </div>

              <button className="flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-500 hover:border-primary hover:text-primary transition-colors dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400">
                <IoFilter />
              </button>
            </div>
          </div>

          {/* Land Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mt-6">
            {landsData.map((land) => (
              <LandCard key={land.id} land={land} />
            ))}

            {/* Add New Property Card */}
            <div className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-6 text-center transition-all hover:border-primary hover:bg-primary/5 dark:border-slate-700 dark:bg-slate-800/30">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform dark:bg-slate-800">
                <MdAddLocationAlt className="text-3xl text-primary" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">List New Property</h3>
              <p className="mt-2 max-w-xs text-sm text-slate-500">
                Upload ownership documents, map coordinates, and soil reports to start earning.
              </p>
              <button className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 hover:bg-primary-dark transition-colors">
                Start Listing
              </button>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6 dark:border-slate-700">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900 dark:text-white">1</span> to{' '}
              <span className="font-medium text-slate-900 dark:text-white">5</span> of{' '}
              <span className="font-medium text-slate-900 dark:text-white">12</span> results
            </p>
            <div className="flex gap-2">
              <button className="flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400">
                Previous
              </button>
              <button className="flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyLandsPage;
