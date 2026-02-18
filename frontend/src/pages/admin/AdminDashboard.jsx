import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const router = useRouter();
  const { logout, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard', active: true },
    { label: 'User Management', path: '/admin/users', icon: 'group' },
    { label: 'Land Verifications', path: '/admin/lands/pending', icon: 'verified_user', badge: '12' },
    { label: 'Agro-Dealer Oversight', path: '/admin/dealers', icon: 'storefront' },
    { label: 'Payments & Escrow', path: '/admin/payments', icon: 'payments' },
    { label: 'Dispute Resolution', path: '/admin/disputes', icon: 'gavel', badge: '3', badgeColor: 'red' },
    { label: 'Agreements & Contracts', path: '/admin/contracts', icon: 'history_edu' },
    { label: 'Reports', path: '/admin/reports', icon: 'bar_chart' },
    { label: 'System Settings', path: '/admin/settings', icon: 'settings' },
  ];

  const verificationQueue = [
    {
      id: 1,
      owner: 'John Doe',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRVyxqsOBdCwyGJzPHbq1FhOlzVMHyoh1E0OPOu-llapkq0U3jYW1Rwg2C1Ugmbc7LW8iCf3H63pb_v9DP0GHt7k5WVWz-KfzcOqt2Cj5IVJDE4f62-oluZlqbFJok2b5rctP84eeFDrehPcMd_Zbu44IB2yGCJghAUU_ufV_QAdGLcx9W_Mh5R48riUTKiv558YHftJaE5LbQfTu1CPVeQWPHjB_5oRhIQAX2VV5nHKhInf3zQ51eITb0P3DkQfxyt0yLIbaYfC3r',
      plotId: 'LR-4521/11',
      submitted: '2 hrs ago',
      status: 'Validated',
      statusColor: 'green',
    },
    {
      id: 2,
      owner: 'Jane Smith',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOHhWmxwYhxgNaHTPSreYBjkWVcAqf3byBu_UtW6A4PBvA3qVdPk-AjtGl28zsWQSvZxflkjvxZUoPb_tYqyvxz0sRXkYm-ntmW9sEYNz56BEXN3FyHT78WfUhM90X3SpiYraeJm-ZiknSB8ReIH9vlUT2E1yskS9Hpeq61BI6HoD992od2rN6ipciwK2JZPSsJTzDcKd8-6KGBVw67v8eGrYN_8FxXm1ST1guaj0IQdQfE5hDtxa-HhY26HoM_eKf0NxRtqP6reHl',
      plotId: 'LR-8829/04',
      submitted: '5 hrs ago',
      status: 'Pending Check',
      statusColor: 'yellow',
    },
    {
      id: 3,
      owner: 'Michael Kimani',
      initials: 'MK',
      plotId: 'LR-1029/99',
      submitted: '1 day ago',
      status: 'Discrepancy',
      statusColor: 'red',
    },
    {
      id: 4,
      owner: 'Alice Wanjiku',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1X7ksMAnix_oyIMmvb32pBsvwu-5HCHYIGVp5Ig1IAkpjNqjIa3iA8hp8k4rkt-k2rCOgCy-AXHWm7Fc98eveNup9noSkgU2aL3dSLTO8Eh8i2n9g7Mhm0phcFJOJXv-piRUz0JH_Iw5X2uYa16gDNfAfcfU8QioR39h-glLqfFwtb_qqXGbfEAnB8MYhXGgtmczxCFOuG_Moulp_QG7GXZ1xALpiykXswKnEoc2kwUgIQ9e8HNr6txSB2SYqUtN0h4eaoNAH0yzV',
      plotId: 'LR-3310/12',
      submitted: '1 day ago',
      status: 'Validated',
      statusColor: 'green',
    },
  ];

  const activityFeed = [
    {
      id: 1,
      time: 'Just now',
      title: 'New User Registration',
      description: 'Samuel K. registered as a Lessee. Awaiting email verification.',
      color: 'bg-emerald-700',
    },
    {
      id: 2,
      time: '15 mins ago',
      title: 'Escrow Payout Released',
      description: 'Released Ksh 120,000 to Agro-Input Ltd for Order #9921.',
      color: 'bg-amber-700',
    },
    {
      id: 3,
      time: '1 hour ago',
      title: 'Dispute Flagged',
      description: 'Dispute raised on Lease ID #5529 by Tenant regarding soil quality.',
      color: 'bg-red-400',
      hasLink: true,
    },
    {
      id: 4,
      time: '3 hours ago',
      title: 'System Backup',
      description: 'Daily database backup completed successfully (4.2GB).',
      color: 'bg-blue-400',
    },
    {
      id: 5,
      time: '5 hours ago',
      title: 'Land Listing Approved',
      description: 'Plot B12 (5 Acres) approved for listing after successful verification.',
      color: 'bg-gray-400',
    },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-20 lg:w-72 bg-[#0f392b] h-full flex flex-col justify-between py-6 px-4 lg:px-6 shadow-xl z-20 transition-all duration-300 border-r border-white/5 shrink-0">
        <div className="overflow-y-auto no-scrollbar flex-1">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2 mt-2">
            <div className="w-10 h-10 rounded-lg bg-[#13ec80] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(19,236,128,0.2)]">
              <span className="material-icons-round text-[#0f392b] text-2xl">admin_panel_settings</span>
            </div>
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                Farm<span className="text-gray-300 font-normal">Lease</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">Admin Console</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
                  item.active
                    ? 'text-white font-bold bg-white/5'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="material-icons-round text-xl group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className={`hidden lg:block text-sm ${item.active ? '' : 'font-medium'}`}>
                  {item.label}
                </span>
                {item.badge && (
                  <span
                    className={`hidden lg:flex ml-auto ${
                      item.badgeColor === 'red' ? 'bg-red-500/80' : 'bg-[#5D4037]'
                    } text-white text-[10px] px-2 py-0.5 rounded-full font-bold`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* User Profile & Logout */}
        <div className="mt-auto space-y-4 pt-4">
          <div className="bg-black/20 rounded-xl p-3 flex items-center gap-3">
            <img
              alt="Admin profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#13ec80]/20"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7ZvmzxVv274-pe6FUZP8OHwCRgvrDzdEbABqYgGD3L2tZOE3EEZiEp_yonq1ctrQNXjE9q4X76GFxHLqBi5-Ki-i3A2jd9RZs_2lH5WtHZgNDwN2iLUbkVFE2T3ZuhAMmG1D9fLHbgWSeHtj_xvnBFCMcio2tim33FEGeydQbDScGWL17IyW19HcGpydoFYNre_N-qBMdcfgMExDLg5LAlwAZx978N7hJgCi6dru1egRdHooOSxMCiJ4LIgPPgKcyMajv-IU2YzLW"
            />
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm font-semibold text-white">{user?.username || 'David M.'}</p>
              <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider">Super Admin</p>
            </div>
          </div>
          <div className="h-px bg-white/10 w-full my-2"></div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-2 py-1 text-gray-300 hover:text-white transition-all w-full group pl-3"
          >
            <span className="material-icons-round text-lg group-hover:-translate-x-1 transition-transform">
              logout
            </span>
            <span className="font-medium hidden lg:block text-xs uppercase tracking-wide">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
          {/* Header */}
          <header className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-[#5D4037] mb-1">Admin Control Center</h2>
              <p className="text-gray-500 text-sm max-w-xl">
                Operational oversight, user verification queues, and system-wide financial monitoring.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-icons-round text-gray-400">search</span>
                </span>
                <input
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0f392b]/20 focus:border-[#0f392b] w-64 shadow-sm"
                  placeholder="Search system..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="flex px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 transition shadow-sm">
                <span className="material-icons-round text-lg">notifications</span>
              </button>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
            {[
              { label: 'Total Users', value: '12,450', trend: '+8.5%', icon: 'group', color: 'green' },
              { label: 'Pending Land Docs', value: '48', trend: '+12 new', icon: 'assignment_late', color: 'green' },
              { label: 'Escrow Total (Ksh)', value: '24.5M', trend: '+3.2%', icon: 'lock', color: 'green' },
              { label: 'Revenue (Ksh)', value: '1.8M', trend: '+15%', icon: 'account_balance_wallet', color: 'green' },
              { label: 'Active Disputes', value: '3', trend: '-2', icon: 'gavel', color: 'red', trendDown: true },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group flex flex-col justify-between h-32"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">{stat.label}</h3>
                  <span
                    className={`w-8 h-8 rounded-full ${
                      stat.color === 'red' ? 'bg-red-50' : 'bg-green-50'
                    } flex items-center justify-center ${
                      stat.color === 'red' ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    <span className="material-icons-round text-lg">{stat.icon}</span>
                  </span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                  <div
                    className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                      stat.trendDown ? 'text-green-600' : 'text-emerald-700'
                    }`}
                  >
                    <span className="material-icons-round text-[14px]">
                      {stat.trendDown ? 'trending_down' : 'trending_up'}
                    </span>
                    <span>{stat.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-6 lg:gap-8 max-w-[1600px] mx-auto pb-8">
            {/* Left Column - Main Content */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-9 space-y-8 flex flex-col min-w-0">
              {/* Verification Queue */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-[#5D4037]">Verification Queue</h3>
                  <button className="text-xs font-bold text-[#0f392b] hover:underline flex items-center gap-1">
                    View All Pending <span className="material-icons-round text-sm">arrow_forward</span>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Owner</th>
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Plot ID</th>
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Submitted</th>
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Ardhisasa Status
                        </th>
                        <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {verificationQueue.map((item) => (
                        <tr
                          key={item.id}
                          className="group hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0"
                        >
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              {item.avatar ? (
                                <img
                                  alt={item.owner}
                                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                  src={item.avatar}
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs border border-purple-200">
                                  {item.initials}
                                </div>
                              )}
                              <span className="font-semibold text-gray-700">{item.owner}</span>
                            </div>
                          </td>
                          <td className="py-4 pr-4 text-gray-600">{item.plotId}</td>
                          <td className="py-4 pr-4 text-gray-500">{item.submitted}</td>
                          <td className="py-4 pr-4">
                            <span
                              className={`px-2 py-1 text-xs font-bold rounded-full ${
                                item.statusColor === 'green'
                                  ? 'bg-green-100 text-green-700'
                                  : item.statusColor === 'yellow'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <button
                              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition shadow-sm ${
                                item.statusColor === 'red'
                                  ? 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                                  : 'bg-[#0f392b] text-white hover:bg-opacity-90'
                              }`}
                            >
                              {item.statusColor === 'red' ? 'Investigate' : 'Review Title'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Agro-Dealer Compliance & Dispute Resolution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Agro-Dealer Compliance */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-[#5D4037]">Agro-Dealer Compliance</h3>
                    <button className="text-xs text-[#0f392b] font-bold hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'Agro-Input Ltd', initial: 'A', rating: 4.2, flagged: 0 },
                      { name: 'Kenya Seeds Co', initial: 'K', rating: 4.9, flagged: 0 },
                      { name: 'GreenHarvest', initial: 'G', rating: 2.8, flagged: 2 },
                    ].map((dealer, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between ${
                          index < 2 ? 'border-b border-gray-50 pb-2' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs">
                            {dealer.initial}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{dealer.name}</p>
                            <div className="flex items-center text-xs text-yellow-500">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                  key={star}
                                  className={`material-icons-round text-[12px] ${
                                    star <= Math.floor(dealer.rating) ? 'text-yellow-500' : 'text-gray-300'
                                  }`}
                                >
                                  star
                                </span>
                              ))}
                              <span className="text-gray-400 ml-1">{dealer.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-xs text-gray-400 uppercase font-bold">Flagged</span>
                          <span
                            className={`block text-sm font-bold ${
                              dealer.flagged > 0 ? 'text-red-500' : 'text-gray-300'
                            }`}
                          >
                            {dealer.flagged}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dispute Resolution Center */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-[#5D4037] mb-2">Dispute Resolution Center</h3>
                    <p className="text-xs text-gray-500">Overview of recent high-priority tickets.</p>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="bg-red-50 border border-red-100 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-red-800">Lease #5529</p>
                        <p className="text-[10px] text-red-600">Soil Quality Dispute</p>
                      </div>
                      <span className="px-2 py-1 bg-red-200 text-red-800 text-[10px] font-bold rounded uppercase">
                        High
                      </span>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold text-yellow-800">Lease #9921</p>
                        <p className="text-[10px] text-yellow-600">Delayed Payment</p>
                      </div>
                      <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-[10px] font-bold rounded uppercase">
                        Medium
                      </span>
                    </div>
                  </div>
                  <button className="w-full py-2.5 bg-[#0f392b] text-white text-sm font-bold rounded-lg hover:bg-opacity-90 transition shadow-sm flex items-center justify-center gap-2">
                    <span>View All Cases</span>
                    <span className="material-icons-round text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Activity Pulse */}
            <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-full">
                <div className="flex items-center gap-2 mb-6">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0f392b] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0f392b]"></span>
                  </span>
                  <h3 className="font-bold text-lg text-[#5D4037]">Activity Pulse</h3>
                </div>
                <div className="relative border-l border-gray-200 ml-1.5 space-y-8 pb-2">
                  {activityFeed.map((activity) => (
                    <div key={activity.id} className="ml-6 relative">
                      <span
                        className={`absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full ${activity.color} ring-4 ring-white`}
                      ></span>
                      <span className="text-xs text-gray-400 block mb-1">{activity.time}</span>
                      <h4 className="text-sm font-bold text-gray-800">{activity.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{activity.description}</p>
                      {activity.hasLink && (
                        <a className="text-xs font-bold text-red-600 mt-2 inline-block hover:underline" href="#">
                          View Details
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
