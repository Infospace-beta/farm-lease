import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const LeaseRequestsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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
    <DashboardLayout>
      {/* Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#047857_0.5px,transparent_0.5px)] [background-size:10px_10px] opacity-5 pointer-events-none"></div>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight text-earth font-serif">
            Lease Requests
          </h2>
          <p className="mt-2 text-slate-500 max-w-2xl">
            Review and manage incoming lease requests from potential tenants.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-4">
          <StatCard title="Total Requests" value={stats.total} icon="inbox" color="slate" />
          <StatCard
            title="Pending Review"
            value={stats.pending}
            icon="pending_actions"
            color="amber"
          />
          <StatCard
            title="Negotiating"
            value={stats.negotiating}
            icon="handshake"
            color="blue"
          />
          <StatCard title="Approved" value={stats.approved} icon="check_circle" color="emerald" />
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full sm:max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search by farmer name or plot..."
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
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('approved')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filterStatus === 'approved'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Approved
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <LeaseRequestCard key={request.id} request={request} />
          ))}

          {filteredRequests.length === 0 && (
            <div className="text-center py-16">
              <span className="material-symbols-outlined text-slate-300 text-6xl mb-4">
                inbox
              </span>
              <p className="text-slate-500 text-lg">No lease requests found</p>
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
    blue: 'bg-blue-100 text-blue-600',
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

// LeaseRequestCard Component
const LeaseRequestCard = ({ request }) => {
  const statusColorMap = {
    amber: 'bg-amber-100 text-amber-700',
    blue: 'bg-blue-100 text-blue-700',
    emerald: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Farmer Info */}
        <div className="flex items-start gap-4 flex-1">
          {request.farmer.avatar ? (
            <div
              className="h-16 w-16 rounded-full bg-slate-100 bg-cover bg-center border-2 border-slate-200"
              style={{ backgroundImage: `url('${request.farmer.avatar}')` }}
            ></div>
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/20">
              {request.farmer.initials}
            </div>
          )}
          <div>
            <h4 className="text-lg font-bold text-slate-900">{request.farmer.name}</h4>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-500 text-sm">star</span>
                <span className="text-sm font-medium text-slate-600">{request.farmer.rating}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-sm text-slate-500">
                {request.farmer.leaseCount} completed leases
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">Requested on {request.requestDate}</p>
          </div>
        </div>

        {/* Plot Info */}
        <div className="flex-1 border-l border-slate-100 pl-6">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Plot Details
          </p>
          <h5 className="text-base font-bold text-slate-900 mb-2">{request.plot.id}</h5>
          <div className="space-y-1 text-sm text-slate-600">
            <p>
              <span className="font-medium">Size:</span> {request.plot.acres} acres
            </p>
            <p>
              <span className="font-medium">Soil:</span> {request.plot.soil}
            </p>
            <p>
              <span className="font-medium">Duration:</span> {request.duration}
            </p>
            <p>
              <span className="font-medium">Start:</span> {request.startDate}
            </p>
          </div>
        </div>

        {/* Offer & Actions */}
        <div className="flex flex-col justify-between items-end gap-4">
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Offer Amount</p>
            <p className="text-2xl font-bold text-primary mt-1">
              Ksh {request.offerAmount.toLocaleString()}
            </p>
            <span
              className={`inline-block mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                statusColorMap[request.statusColor]
              }`}
            >
              {request.status}
            </span>
          </div>

          <div className="flex gap-2">
            {request.status === 'Pending Review' && (
              <>
                <button className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
                  Decline
                </button>
                <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors">
                  Negotiate
                </button>
              </>
            )}
            {request.status === 'Under Negotiation' && (
              <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors">
                View Details
              </button>
            )}
            {request.status === 'Approved' && (
              <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                View Agreement
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseRequestsPage;
