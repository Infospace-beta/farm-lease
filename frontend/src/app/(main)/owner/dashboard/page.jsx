"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FarmOwnerSidebar from '../../../../components/shared/FarmOwnerSidebar';

const FarmOwnerDashboard = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Sample data - replace with actual API data
  const stats = {
    totalValuation: { value: 'Ksh 45.2M', change: '+12.5%', trend: 'up', compareText: 'vs last year' },
    monthlyRevenue: { value: 'Ksh 450k', change: '+8.2%', trend: 'up', compareText: 'vs last month' },
    occupancyRate: { value: '92%', change: '0.0%', trend: 'neutral', compareText: 'vs last month' },
  };

  const lands = [
    {
      id: 1,
      name: 'Plot A4 - North',
      size: '3.5 Acres',
      soilType: 'Soil: Loam',
      status: 'Leased',
      statusColor: 'emerald',
      tenant: {
        name: 'John Doe',
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=047857&color=fff'
      },
      leaseValue: 'Ksh 50k',
      period: '/yr',
      endDate: 'Dec 2024',
      action: 'Manage Land',
      svgPath: 'M10,10 L90,20 L80,80 L20,90 Z'
    },
    {
      id: 2,
      name: 'Plot B2 - East',
      size: '2.0 Acres',
      soilType: 'Soil: Clay',
      status: 'Pending',
      statusColor: 'amber',
      tenant: {
        name: 'Jane Smith',
        avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=d97706&color=fff'
      },
      leaseValue: 'Ksh 45k',
      period: '/yr',
      actionRequired: 'Action Required',
      action: 'Review',
      actionStyle: 'dark',
      svgPath: 'M15,15 L85,10 L95,70 L25,85 Z'
    },
    {
      id: 3,
      name: 'Plot C1 - Valley',
      size: '5.0 Acres',
      soilType: 'Soil: Silt',
      status: 'Reviewing',
      statusColor: 'blue',
      tenant: {
        name: 'Michael K.',
        initials: 'MK'
      },
      leaseValue: 'Ksh 60k',
      period: '/yr',
      actionRequired: 'Docs Submitted',
      action: 'View Docs',
      svgPath: 'M30,10 L80,10 L90,90 L10,80 Z'
    }
  ];

  const activities = [
    {
      id: 1,
      time: '10 mins ago',
      title: 'Escrow Payment Released',
      description: 'Payment of Ksh 50,000 for Plot A4 released to your wallet.',
      color: 'primary',
      highlightAmount: 'Ksh 50,000'
    },
    {
      id: 2,
      time: '2 hours ago',
      title: 'New Bid Received',
      color: 'amber',
      hasCard: true,
      cardData: {
        avatar: 'https://ui-avatars.com/api/?name=Sarah+L&background=047857&color=fff',
        name: 'Sarah L.',
        description: 'Bid placed on Plot B2 - East'
      }
    },
    {
      id: 3,
      time: 'Yesterday',
      title: 'Agreement Draft Ready',
      description: 'AI-generated lease agreement for Michael K. is ready for review.',
      color: 'blue',
      action: 'Review PDF'
    },
    {
      id: 4,
      time: '2 days ago',
      title: 'Soil Report Updated',
      description: 'New nitrogen levels detected for Plot C1.',
      color: 'slate',
      isLast: true
    }
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      <FarmOwnerSidebar />
      
      <main className="flex-1 overflow-y-auto bg-background-light p-6 lg:p-10 dark:bg-background-dark">
        <div className="mx-auto max-w-7xl">
            {/* Header */}
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-earth font-serif dark:text-white">
                Dashboard
              </h2>
              <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
                Monitor your land portfolio performance, manage lease agreements, and track escrow payments in real-time.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  // TODO: Implement report download functionality
                  console.log('Downloading report...');
                }}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
                Report
              </button>
              <button 
                onClick={() => router.push('/owner/lands/add')}
                className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-dark transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">add_location_alt</span>
                List New Land
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-10 grid gap-6 sm:grid-cols-3">
            {/* Total Valuation */}
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm dark:bg-surface-dark border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Total Valuation
                  </p>
                  <h3 className="mt-2 text-3xl font-bold text-earth dark:text-white">
                    {stats.totalValuation.value}
                  </h3>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <span className="flex items-center text-primary font-bold bg-primary/10 px-2 py-1 rounded text-xs w-fit">
                      <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                      {stats.totalValuation.change}
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {stats.totalValuation.compareText}
                    </span>
                  </div>
                  <svg className="h-10 w-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 100 40">
                    <path d="M0 35 Q 25 35 35 20 T 70 25 T 100 5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    <path d="M0 35 Q 25 35 35 20 T 70 25 T 100 5 V 40 H 0 Z" fill="currentColor" opacity="0.1" stroke="none" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Monthly Revenue */}
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm dark:bg-surface-dark border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Monthly Revenue
                  </p>
                  <h3 className="mt-2 text-3xl font-bold text-earth dark:text-white">
                    {stats.monthlyRevenue.value}
                  </h3>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <span className="flex items-center text-primary font-bold bg-primary/10 px-2 py-1 rounded text-xs w-fit">
                      <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                      {stats.monthlyRevenue.change}
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {stats.monthlyRevenue.compareText}
                    </span>
                  </div>
                  <svg className="h-10 w-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 100 40">
                    <path d="M0 30 L 20 25 L 40 32 L 60 15 L 80 20 L 100 5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Occupancy Rate */}
            <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm dark:bg-surface-dark border border-slate-200 dark:border-slate-700">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Occupancy Rate
                  </p>
                  <h3 className="mt-2 text-3xl font-bold text-earth dark:text-white">
                    {stats.occupancyRate.value}
                  </h3>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <span className="flex items-center text-slate-500 font-bold bg-slate-100 px-2 py-1 rounded text-xs w-fit dark:bg-slate-800 dark:text-slate-300">
                      <span className="material-symbols-outlined text-sm mr-1">remove</span>
                      {stats.occupancyRate.change}
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {stats.occupancyRate.compareText}
                    </span>
                  </div>
                  <svg className="h-10 w-24 text-primary" fill="none" stroke="currentColor" viewBox="0 0 100 40">
                    <path d="M0 20 H 100" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Land Portfolio */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-earth font-serif dark:text-white">
                  My Land Portfolio
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded border transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-white border-slate-200 text-slate-500 hover:text-primary hover:border-primary dark:bg-slate-800 dark:border-slate-700'
                        : 'bg-transparent border-transparent text-slate-400 hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">grid_view</span>
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded border transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-white border-slate-200 text-slate-500 hover:text-primary hover:border-primary dark:bg-slate-800 dark:border-slate-700'
                        : 'bg-transparent border-transparent text-slate-400 hover:text-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">list</span>
                  </button>
                </div>
              </div>

              {/* Land Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lands.map((land) => (
                  <DashboardLandCard key={land.id} land={land} />
                ))}

                {/* Add New Land Card */}
                <div 
                  onClick={() => router.push('/owner/lands/add')}
                  className="group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-4 transition-all hover:border-primary hover:bg-primary/5 dark:border-slate-700 dark:bg-slate-800/30 cursor-pointer"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm dark:bg-slate-800 mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-primary text-3xl">add</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">Add New Land</h4>
                  <p className="text-xs text-slate-500 text-center mt-2 max-w-[200px]">
                    Upload deeds, soil reports, and map coordinates.
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Pulse */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-surface-dark">
                <div className="mb-6 flex items-center gap-2">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </div>
                  <h3 className="text-lg font-bold text-earth dark:text-white">Activity Pulse</h3>
                </div>

                <div className="space-y-8">
                  {activities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} router={router} />
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

// Land Card Component
const DashboardLandCard = ({ land }) => {
  const router = useRouter();
  
  const statusColors = {
    emerald: 'bg-emerald-500/90',
    amber: 'bg-amber-500/90',
    blue: 'bg-blue-500/90'
  };

  const statusFillColors = {
    emerald: 'fill-emerald-500/30',
    amber: 'fill-amber-500/30',
    blue: 'fill-blue-500/30'
  };

  return (
    <div className="group relative rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-primary/30 dark:border-slate-700 dark:bg-surface-dark dark:hover:border-primary/50">
      {/* Map Visualization */}
      <div className="relative h-40 w-full overflow-hidden rounded-xl bg-slate-200" style={{
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239ca3af' fill-opacity='0.2' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")"
      }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute bottom-3 left-3 text-white">
          <p className="font-bold text-lg">{land.name}</p>
          <p className="text-xs opacity-90">{land.size} • {land.soilType}</p>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center rounded-full ${statusColors[land.statusColor]} backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-white shadow-sm`}>
            {land.status}
          </span>
        </div>
        <svg className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-24 stroke-white ${statusFillColors[land.statusColor]} drop-shadow-lg`} viewBox="0 0 100 100">
          <path d={land.svgPath} strokeWidth="2" />
        </svg>
      </div>

      {/* Land Info */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500">{land.status === 'Leased' ? 'Tenant' : land.status === 'Pending' ? 'Highest Bidder' : 'Potential Tenant'}</p>
          <div className="flex items-center gap-2 mt-1">
            {land.tenant.avatar ? (
              <div 
                className="h-6 w-6 rounded-full bg-slate-200 bg-cover bg-center"
                style={{ backgroundImage: `url(${land.tenant.avatar})` }}
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-600 text-[10px]">
                {land.tenant.initials}
              </div>
            )}
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {land.tenant.name}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">{land.status === 'Leased' ? 'Lease Value' : 'Offer'}</p>
          <p className={`text-sm font-bold ${
            land.status === 'Leased' ? 'text-primary' : 
            land.status === 'Pending' ? 'text-amber-600' : 
            'text-blue-600'
          }`}>
            {land.leaseValue}<span className="text-slate-400 font-normal">{land.period}</span>
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
        {land.endDate ? (
          <span className="text-xs text-slate-400">Ends: {land.endDate}</span>
        ) : (
          <span className={`text-xs font-medium ${
            land.status === 'Pending' ? 'text-amber-600' : 'text-blue-600'
          }`}>
            {land.actionRequired}
          </span>
        )}
        {land.actionStyle === 'dark' ? (
          <button 
            onClick={() => {
              if (land.action === 'View Agreement') {
                router.push(`/owner/agreements/${land.id}`);
              } else if (land.action === 'View Offer') {
                router.push(`/owner/lease-requests/${land.id}`);
              } else if (land.action === 'View Docs') {
                router.push(`/owner/lease-requests/${land.id}`);
              }
            }}
            className="rounded bg-slate-900 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"
          >
            {land.action}
          </button>
        ) : (
          <button 
            onClick={() => {
              if (land.action === 'View Agreement') {
                router.push(`/owner/agreements/${land.id}`);
              } else if (land.action === 'View Offer') {
                router.push(`/owner/lease-requests/${land.id}`);
              } else if (land.action === 'View Docs') {
                router.push(`/owner/lease-requests/${land.id}`);
              }
            }}
            className="text-xs font-semibold text-primary hover:text-primary-dark hover:underline"
          >
            {land.action}
          </button>
        )}
      </div>
    </div>
  );
};

// Activity Item Component
const ActivityItem = ({ activity, router }) => {
  const colorClasses = {
    primary: 'bg-primary',
    amber: 'bg-amber-500',
    blue: 'bg-blue-500',
    slate: 'bg-slate-300'
  };

  return (
    <div className={`relative pl-6 ${!activity.isLast ? 'before:absolute before:left-0 before:top-2 before:h-full before:w-px before:bg-slate-200 dark:before:bg-slate-700' : ''}`}>
      <div className={`absolute left-[-5px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-surface-dark ${colorClasses[activity.color]}`}></div>
      <p className="text-xs font-medium text-slate-400">{activity.time}</p>
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
        {activity.title}
      </p>
      {activity.description && (
        <p className="text-xs text-slate-500 mt-1">
          {activity.highlightAmount ? (
            <>
              Payment of <span className="text-emerald-600 font-bold">{activity.highlightAmount}</span> for Plot A4 released to your wallet.
            </>
          ) : (
            activity.description
          )}
        </p>
      )}
      {activity.hasCard && activity.cardData && (
        <div className="mt-2 rounded bg-slate-50 p-2 dark:bg-slate-800">
          <div className="flex items-center gap-2">
            <div 
              className="h-6 w-6 rounded-full bg-slate-200 bg-cover bg-center"
              style={{ backgroundImage: `url(${activity.cardData.avatar})` }}
            />
            <span className="text-xs font-medium">{activity.cardData.name}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">{activity.cardData.description}</p>
        </div>
      )}
      {activity.action && (
        <button 
          onClick={() => {
            if (activity.action === 'Review PDF') {
              router.push('/owner/agreements');
            }
          }}
          className="mt-2 text-xs font-bold text-primary hover:underline"
        >
          {activity.action}
        </button>
      )}
    </div>
  );
};

export default FarmOwnerDashboard;
