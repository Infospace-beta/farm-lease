import { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import FarmOwnerSidebar from '../../components/layout/FarmOwnerSidebar';

const AgreementsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample agreements data
  const agreements = [
    {
      id: 1,
      agreementId: 'AGR-2024-001',
      tenant: {
        name: 'Sarah Johnson',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEeNaQ9ipY6hAWWDXUwBn_KT5iX0Xx6_qbKyAQKAGY5cKJrFkEEpGY8aZIJZewYzN9XKiSk_Bu75ATzV5jPRjwG4RrCJ8DaRtXbEs9gMFmh_kH-TV9Z0wlF200GtFOMO2yGGfavlW3vwurJyi85G52zDef_1NGPd46LZJ7JvsQcRpHAvWc78c4Tc6AQ5tuvf9GBGwI38AhBLDRdYl3e1tY9Zij3apSb5VGUvMQrLrdiYMEfsJlTEvwbPwiscC33L4HaPJMa4mYYPAV',
      },
      plot: {
        name: 'Plot A4 - North Sector',
        acres: 3.5,
      },
      amount: 65000,
      duration: '18 Months',
      startDate: 'Nov 15, 2024',
      endDate: 'May 15, 2026',
      status: 'Active',
      statusColor: 'emerald',
      signedDate: 'Oct 25, 2023',
      progress: 85,
    },
    {
      id: 2,
      agreementId: 'AGR-2023-045',
      tenant: {
        name: 'Michael K.',
        initials: 'MK',
      },
      plot: {
        name: 'Plot C1 - Valley',
        acres: 5.0,
      },
      amount: 100000,
      duration: '24 Months',
      startDate: 'Dec 01, 2023',
      endDate: 'Nov 30, 2025',
      status: 'Active',
      statusColor: 'emerald',
      signedDate: 'Nov 20, 2023',
      progress: 92,
    },
    {
      id: 3,
      agreementId: 'AGR-2024-010',
      tenant: {
        name: 'Jane Smith',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrxrphhwqUHyCR0IxEQ_HDv3R9z3CDNvg51eW7CsOusce7YRYRwNyJPkR8akl-FZtjjwN0r3G0tjmdYEEvElAZ4EAJkaET-4gbBLZnf_dFp7-DAc3E5vz1Gexp46w68bvmUuC3Y7Sblw-h6p9HeJEhNCwJfDhKN1psyCOGzYzhCsb-5uSeBFVPCkL02DZzl5uOG_WlxRtwX1kfBZVo-bJNuKq9NRS-PyBlHtMMrqW0i2IaZfJoiGOXnfriDpbKXCFZQuxv5FA7o8JK',
      },
      plot: {
        name: 'Plot B2 - East',
        acres: 2.0,
      },
      amount: 45000,
      duration: '12 Months',
      startDate: 'Jan 10, 2025',
      endDate: 'Jan 10, 2026',
      status: 'Pending Signature',
      statusColor: 'amber',
      signedDate: null,
      progress: 0,
    },
    {
      id: 4,
      agreementId: 'AGR-2023-020',
      tenant: {
        name: 'Robert Kimani',
        initials: 'RK',
      },
      plot: {
        name: 'Plot D3 - South Field',
        acres: 4.2,
      },
      amount: 80000,
      duration: '12 Months',
      startDate: 'Jan 01, 2023',
      endDate: 'Dec 31, 2023',
      status: 'Expired',
      statusColor: 'slate',
      signedDate: 'Dec 15, 2022',
      progress: 100,
    },
  ];

  const filteredAgreements = agreements.filter((agreement) => {
    const matchesSearch =
      agreement.agreementId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agreement.tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agreement.plot.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || agreement.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: agreements.length,
    active: agreements.filter((a) => a.status === 'Active').length,
    pending: agreements.filter((a) => a.status === 'Pending Signature').length,
    expired: agreements.filter((a) => a.status === 'Expired').length,
  };

  return (
    <DashboardLayout sidebar={<FarmOwnerSidebar />}>
      <>
        <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight text-earth font-serif dark:text-white">
            Agreements
          </h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            View, manage, and download all your signed and pending lease agreements.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <StatCard title="Total Agreements" value={stats.total} icon="description" iconColor="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" />
          <StatCard title="Active Leases" value={stats.active} icon="check_circle" iconColor="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" />
          <StatCard
            title="Pending Signature"
            value={stats.pending}
            icon="edit_document"
            iconColor="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
          />
          <StatCard title="Expired" value={stats.expired} icon="history" iconColor="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" />
        </div>

        {/* Search and Filter */}
        <div className="mb-6 bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          {/* Tab Filters */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setFilterStatus('all')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
                filterStatus === 'all'
                  ? 'text-primary dark:text-primary'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              All Agreements
              {filterStatus === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
                filterStatus === 'active'
                  ? 'text-primary dark:text-primary'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              Active
              <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {stats.active}
              </span>
              {filterStatus === 'active' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
                filterStatus === 'pending'
                  ? 'text-primary dark:text-primary'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
              }`}
            >
              Pending
              <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                {stats.pending}
              </span>
              {filterStatus === 'pending' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search agreements by ID, tenant, or plot..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
              />
            </div>
          </div>
        </div>

        {/* Agreements List */}
        <div className="space-y-4">
          {filteredAgreements.map((agreement) => (
            <AgreementCard key={agreement.id} agreement={agreement} />
          ))}

          {filteredAgreements.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-6xl mb-4 block">
                description
              </span>
              <p className="text-slate-500 dark:text-slate-400 text-lg">No agreements found</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                {filterStatus !== 'all' ? 'Try adjusting your filters' : 'New agreements will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
      </>
    </DashboardLayout>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, iconColor }) => {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-earth dark:text-white">{value}</h3>
        </div>
        <div className={`h-12 w-12 rounded-xl ${iconColor} flex items-center justify-center`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

// AgreementCard Component
const AgreementCard = ({ agreement }) => {
  const statusColorMap = {
    emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section: Agreement Info */}
        <div className="flex items-start gap-4 flex-1">
          <div className="h-14 w-14 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">description</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{agreement.agreementId}</h4>
              <span
                className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                  statusColorMap[agreement.statusColor]
                }`}
              >
                {agreement.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{agreement.plot.name}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              {agreement.tenant.avatar ? (
                <div
                  className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 bg-cover bg-center border border-slate-200 dark:border-slate-600"
                  style={{ backgroundImage: `url('${agreement.tenant.avatar}')` }}
                ></div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                  {agreement.tenant.initials}
                </div>
              )}
              <span className="font-medium text-slate-700 dark:text-slate-300">{agreement.tenant.name}</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Terms */}
        <div className="flex-1 border-l border-slate-200 dark:border-slate-700 pl-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Agreement Terms
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Amount</p>
              <p className="font-bold text-slate-900 dark:text-white">Ksh {agreement.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Duration</p>
              <p className="font-medium text-slate-900 dark:text-white">{agreement.duration}</p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">Start Date</p>
              <p className="font-medium text-slate-900 dark:text-white">{agreement.startDate}</p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">End Date</p>
              <p className="font-medium text-slate-900 dark:text-white">{agreement.endDate}</p>
            </div>
          </div>
          {agreement.status === 'Active' && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Lease Progress</span>
                <span>{agreement.progress}% Complete</span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${agreement.progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Actions */}
        <div className="flex flex-col justify-between gap-4 items-end">
          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {agreement.signedDate ? `Signed on ${agreement.signedDate}` : 'Not yet signed'}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            {agreement.status === 'Active' && (
              <>
                <button 
                  onClick={() => {
                    // TODO: Implement PDF download
                    console.log('Downloading agreement:', agreement.agreementId);
                    alert('PDF download functionality will be implemented');
                  }}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px] mr-1 align-middle">
                    download
                  </span>
                  Download PDF
                </button>
                <button 
                  onClick={() => {
                    // Navigate to agreement details
                    router.push(`/owner/agreements/${agreement.id}`);
                  }}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                >
                  View Details
                </button>
              </>
            )}
            {agreement.status === 'Pending Signature' && (
              <>
                <button 
                  onClick={() => {
                    // TODO: Implement send reminder
                    console.log('Sending reminder for:', agreement.agreementId);
                    alert('Reminder sent! (functionality will be implemented)');
                  }}
                  className="px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap shadow-sm"
                >
                  Send Reminder
                </button>
                <button 
                  onClick={() => {
                    // Navigate to draft view
                    router.push(`/owner/agreements/${agreement.id}/draft`);
                  }}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                >
                  View Draft
                </button>
              </>
            )}
            {agreement.status === 'Expired' && (
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[16px] mr-1 align-middle">
                  archive
                  </span>
                Archive
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgreementsPage;
