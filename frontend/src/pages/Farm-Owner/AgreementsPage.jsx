import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const AgreementsPage = () => {
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
    <DashboardLayout>
      {/* Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#047857_0.5px,transparent_0.5px)] [background-size:10px_10px] opacity-5 pointer-events-none"></div>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight text-earth font-serif">
            Lease Agreements
          </h2>
          <p className="mt-2 text-slate-500 max-w-2xl">
            View, manage, and download all your signed and pending lease agreements.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-4">
          <StatCard title="Total Agreements" value={stats.total} icon="description" color="slate" />
          <StatCard title="Active Leases" value={stats.active} icon="check_circle" color="emerald" />
          <StatCard
            title="Pending Signature"
            value={stats.pending}
            icon="edit_document"
            color="amber"
          />
          <StatCard title="Expired" value={stats.expired} icon="history" color="slate" />
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full sm:max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search agreements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filterStatus === 'active'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {/* Agreements List */}
        <div className="space-y-4">
          {filteredAgreements.map((agreement) => (
            <AgreementCard key={agreement.id} agreement={agreement} />
          ))}

          {filteredAgreements.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">
                description
              </span>
              <p className="text-slate-500 text-lg">No agreements found</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, color }) => {
  const colorMap = {
    slate: 'bg-slate-100 text-slate-600',
    amber: 'bg-amber-100 text-amber-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="mt-2 text-3xl font-bold text-earth">{value}</h3>
        </div>
        <div className={`h-12 w-12 rounded-xl ${colorMap[color]} flex items-center justify-center`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
};

// AgreementCard Component
const AgreementCard = ({ agreement }) => {
  const statusColorMap = {
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Section: Agreement Info */}
        <div className="flex items-start gap-4 flex-1">
          <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">description</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-lg font-bold text-slate-900">{agreement.agreementId}</h4>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  statusColorMap[agreement.statusColor]
                }`}
              >
                {agreement.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-3">{agreement.plot.name}</p>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              {agreement.tenant.avatar ? (
                <div
                  className="h-8 w-8 rounded-full bg-slate-100 bg-cover bg-center border border-slate-200"
                  style={{ backgroundImage: `url('${agreement.tenant.avatar}')` }}
                ></div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                  {agreement.tenant.initials}
                </div>
              )}
              <span className="font-medium text-slate-700">{agreement.tenant.name}</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Terms */}
        <div className="flex-1 border-l border-slate-100 pl-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Agreement Terms
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-500">Amount</p>
              <p className="font-bold text-slate-900">Ksh {agreement.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-slate-500">Duration</p>
              <p className="font-medium text-slate-900">{agreement.duration}</p>
            </div>
            <div>
              <p className="text-slate-500">Start Date</p>
              <p className="font-medium text-slate-900">{agreement.startDate}</p>
            </div>
            <div>
              <p className="text-slate-500">End Date</p>
              <p className="font-medium text-slate-900">{agreement.endDate}</p>
            </div>
          </div>
          {agreement.status === 'Active' && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Lease Progress</span>
                <span>{agreement.progress}% Complete</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
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
            <p className="text-xs text-slate-500">
              {agreement.signedDate ? `Signed on ${agreement.signedDate}` : 'Not yet signed'}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full sm:w-auto">
            {agreement.status === 'Active' && (
              <>
                <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap">
                  <span className="material-symbols-outlined text-[16px] mr-1 align-middle">
                    download
                  </span>
                  Download PDF
                </button>
                <button className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                  View Details
                </button>
              </>
            )}
            {agreement.status === 'Pending Signature' && (
              <>
                <button className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap">
                  Send Reminder
                </button>
                <button className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
                  View Draft
                </button>
              </>
            )}
            {agreement.status === 'Expired' && (
              <button className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap">
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
