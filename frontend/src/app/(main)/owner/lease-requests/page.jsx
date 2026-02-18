 import { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import FarmOwnerSidebar from '../../components/layout/FarmOwnerSidebar';

const LeaseRequestsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Sample data for lease requests
  const leaseRequests = [
    {
      id: 1,
      farmer: {
        name: 'Jane Smith',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrxrphhwqUHyCR0IxEQ_HDv3R9z3CDNvg51eW7CsOusce7YRYRwNyJPkR8akl-FZtjjwN0r3G0tjmdYEEvElAZ4EAJkaET-4gbBLZnf_dFp7-DAc3E5vz1Gexp46w68bvmUuC3Y7Sblw-h6p9HeJEhNCwJfDhKN1psyCOGzYzhCsb-5uSeBFVPCkL02DZzl5uOG_WlxRtwX1kfBZVo-bJNuKq9NRS-PyBlHtMMrqW0i2IaZfJoiGOXnfriDpbKXCFZQuxv5FA7o8JK',
        rating: 4.9,
        leaseCount: 24,
      },
      plot: {
        id: 'Plot B2 - East',
        acres: 2.0,
        soil: 'Clay',
      },
      offerAmount: 45000,
      duration: '12 Months',
      startDate: 'Jan 2025',
      status: 'Pending Review',
      statusColor: 'amber',
      requestDate: 'Oct 20, 2023',
    },
    {
      id: 2,
      farmer: {
        name: 'Michael K.',
        initials: 'MK',
        rating: 4.2,
        leaseCount: 8,
      },
      plot: {
        id: 'Plot C1 - Valley',
        acres: 5.0,
        soil: 'Silt',
      },
      offerAmount: 100000,
      duration: '24 Months',
      startDate: 'Dec 2024',
      status: 'Under Negotiation',
      statusColor: 'blue',
      requestDate: 'Oct 15, 2023',
    },
    {
      id: 3,
      farmer: {
        name: 'Sarah Johnson',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEeNaQ9ipY6hAWWDXUwBn_KT5iX0Xx6_qbKyAQKAGY5cKJrFkEEpGY8aZIJZewYzN9XKiSk_Bu75ATzV5jPRjwG4RrCJ8DaRtXbEs9gMFmh_kH-TV9Z0wlF200GtFOMO2yGGfavlW3vwurJyi85G52zDef_1NGPd46LZJ7JvsQcRpHAvWc78c4Tc6AQ5tuvf9GBGwI38AhBLDRdYl3e1tY9Zij3apSb5VGUvMQrLrdiYMEfsJlTEvwbPwiscC33L4HaPJMa4mYYPAV',
        rating: 5.0,
        leaseCount: 32,
      },
      plot: {
        id: 'Plot A4 - North Sector',
        acres: 3.5,
        soil: 'Loam',
      },
      offerAmount: 65000,
      duration: '18 Months',
      startDate: 'Nov 2024',
      status: 'Approved',
      statusColor: 'emerald',
      requestDate: 'Oct 10, 2023',
    },
  ];

  const filteredRequests = leaseRequests.filter((request) => {
    const matchesSearch =
      request.farmer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.plot.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'all' || request.status.toLowerCase().includes(filterStatus.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: leaseRequests.length,
    pending: leaseRequests.filter((r) => r.status === 'Pending Review').length,
    negotiating: leaseRequests.filter((r) => r.status === 'Under Negotiation').length,
    approved: leaseRequests.filter((r) => r.status === 'Approved').length,
  };

  return (
    <DashboardLayout sidebar={<FarmOwnerSidebar />}>
      <>
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-earth font-serif dark:text-white">
              Lease Requests
            </h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              Review and manage incoming lease requests from potential tenants.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Requests" 
              value={stats.total} 
              icon="inbox" 
              iconColor="bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
            />
            <StatCard
              title="Pending Review"
              value={stats.pending}
              icon="pending_actions"
              iconColor="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
            />
            <StatCard
              title="Negotiating"
              value={stats.negotiating}
              icon="handshake"
              iconColor="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
            />
            <StatCard 
              title="Approved" 
              value={stats.approved} 
              icon="check_circle" 
              iconColor="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            />
          </div>

          {/* Filters and Search */}
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
                All Requests
                {filterStatus === 'all' && (
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
              <button
                onClick={() => setFilterStatus('negotiating')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
                  filterStatus === 'negotiating'
                    ? 'text-primary dark:text-primary'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                Negotiating
                <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  {stats.negotiating}
                </span>
                {filterStatus === 'negotiating' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
              <button
                onClick={() => setFilterStatus('approved')}
                className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
                  filterStatus === 'approved'
                    ? 'text-primary dark:text-primary'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                Approved
                <span className="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  {stats.approved}
                </span>
                {filterStatus === 'approved' && (
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
                  placeholder="Search by farmer name or plot ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-shadow"
                />
              </div>
            </div>
          </div>

          {/* Requests Table */}
          <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {filteredRequests.length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-6xl mb-4 block">
                  inbox
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-lg">No lease requests found</p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
                  {filterStatus !== 'all' ? 'Try adjusting your filters' : 'New requests will appear here'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Tenant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Plot Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Lease Terms
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Offer Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredRequests.map((request) => (
                      <RequestRow key={request.id} request={request} />
                    ))}
                  </tbody>
                </table>
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

// RequestRow Component
const RequestRow = ({ request }) => {
  const router = useRouter();
  const [showActions, setShowActions] = useState(false);

  const handleDecline = (requestId) => {
    // TODO: Implement decline functionality
    console.log('Declining request:', requestId);
    alert('Decline functionality will be implemented');
  };

  const handleReview = (requestId) => {
    // Navigate to detailed review page
    router.push(`/owner/lease-requests/${requestId}`);
  };

  const handleContinueNegotiation = (requestId) => {
    // Navigate to negotiation page
    router.push(`/owner/lease-requests/${requestId}/negotiate`);
  };

  const handleViewAgreement = (requestId) => {
    // Navigate to agreement page
    router.push(`/owner/agreements/${requestId}`);
  };

  const statusConfig = {
    'Pending Review': {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-400',
      icon: 'schedule',
    },
    'Under Negotiation': {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-400',
      icon: 'handshake',
    },
    'Approved': {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      icon: 'check_circle',
    },
  };

  const status = statusConfig[request.status];

  return (
    <tr 
      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Tenant Column */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {request.farmer.avatar ? (
            <div
              className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 bg-cover bg-center border-2 border-slate-200 dark:border-slate-600 flex-shrink-0"
              style={{ backgroundImage: `url('${request.farmer.avatar}')` }}
            ></div>
          ) : (
            <div className="h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm border-2 border-primary/20 flex-shrink-0">
              {request.farmer.initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {request.farmer.name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-0.5">
                <span className="material-symbols-outlined text-amber-500 text-xs">star</span>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{request.farmer.rating}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {request.farmer.leaseCount} leases
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Plot Details Column */}
      <td className="px-6 py-4">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">{request.plot.id}</p>
        <div className="mt-1 space-y-0.5">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            <span className="font-medium">{request.plot.acres}</span> acres • {request.plot.soil} soil
          </p>
        </div>
      </td>

      {/* Lease Terms Column */}
      <td className="px-6 py-4">
        <div className="space-y-0.5">
          <p className="text-sm text-slate-900 dark:text-white">
            <span className="font-semibold">{request.duration}</span>
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Start: {request.startDate}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Requested: {request.requestDate}
          </p>
        </div>
      </td>

      {/* Offer Amount Column */}
      <td className="px-6 py-4">
        <p className="text-lg font-bold text-primary dark:text-primary">
          Ksh {request.offerAmount.toLocaleString()}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">per month</p>
      </td>

      {/* Status Column */}
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full ${status.bg} ${status.text}`}
        >
          <span className="material-symbols-outlined text-sm">{status.icon}</span>
          {request.status}
        </span>
      </td>

      {/* Actions Column */}
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          {request.status === 'Pending Review' && (
            <>
              <button
                onClick={() => handleDecline(request.id)}
                className={`px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all ${
                  showActions ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Decline
              </button>
              <button
                onClick={() => handleReview(request.id)}
                className={`px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-dark transition-all shadow-sm ${
                  showActions ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Review
              </button>
            </>
          )}
          {request.status === 'Under Negotiation' && (
            <button
              onClick={() => handleContinueNegotiation(request.id)}
              className={`px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm ${
                showActions ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Continue
            </button>
          )}
          {request.status === 'Approved' && (
            <button
              onClick={() => handleViewAgreement(request.id)}
              className={`px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-all shadow-sm ${
                showActions ? 'opacity-100' : 'opacity-0'
              }`}
            >
              View Agreement
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default LeaseRequestsPage;
