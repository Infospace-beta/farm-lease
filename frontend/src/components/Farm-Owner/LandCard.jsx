import React from 'react';
import { IoCheckmarkCircle, IoTimeOutline, IoDocumentTextOutline, IoSquareOutline, IoEllipseOutline } from 'react-icons/io5';

const LandCard = ({ land }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Leased':
        return IoCheckmarkCircle;
      case 'Pending':
        return IoTimeOutline;
      case 'Under Review':
        return IoDocumentTextOutline;
      case 'Vacant':
        return IoSquareOutline;
      default:
        return IoEllipseOutline;
    }
  };

  const getStatusColors = (status) => {
    switch (status) {
      case 'Leased':
        return { bg: '#10b981', text: '#ffffff' };
      case 'Pending':
        return { bg: '#f59e0b', text: '#ffffff' };
      case 'Under Review':
        return { bg: '#3b82f6', text: '#ffffff' };
      case 'Vacant':
        return { bg: '#64748b', text: '#ffffff' };
      default:
        return { bg: '#64748b', text: '#ffffff' };
    }
  };

  const statusColors = getStatusColors(land.status);
  const StatusIcon = getStatusIcon(land.status);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg hover:border-primary/40 dark:border-slate-700 dark:bg-surface-dark">
      {/* Header Image with Map Pattern */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 mini-map-pattern">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
        
        {/* Plot ID Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="rounded-md bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-bold text-slate-700 shadow-sm">
            ID: {land.id}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            style={{ backgroundColor: statusColors.bg }}
            className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-sm ring-1 ring-white/20"
          >
            <StatusIcon className="text-xs mr-1" style={{ color: statusColors.text }} />
            {land.status}
          </span>
        </div>

        {/* Land Name and Location */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
          <div>
            <h3 className="text-lg font-bold font-serif">{land.name}</h3>
            <p className="text-xs font-medium opacity-90">{land.location}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Info Grid */}
        <div className="mb-4 grid grid-cols-2 gap-4 border-b border-slate-100 pb-4 dark:border-slate-700">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Size</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{land.size}</p>
          </div>
          
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Soil Type</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{land.soilType}</p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {land.tenant ? 'Tenant' : land.topBidder ? 'Top Bidder' : land.applicant ? 'Applicant' : 'Last Crop'}
            </p>
            {(land.tenant || land.topBidder || land.applicant) ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                {(land.tenant?.avatar || land.topBidder?.avatar) ? (
                  <div
                    className="h-5 w-5 rounded-full bg-slate-200 bg-cover bg-center"
                    style={{ backgroundImage: `url("${land.tenant?.avatar || land.topBidder?.avatar}")` }}
                  ></div>
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                    {land.applicant?.initials || land.tenant?.initials}
                  </div>
                )}
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[80px]">
                  {land.tenant?.name || land.topBidder?.name || land.applicant?.name}
                </p>
              </div>
            ) : (
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{land.lastCrop}</p>
            )}
          </div>
          
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {land.expires ? 'Expires' : land.bids ? 'Bids' : land.stage ? 'Stage' : 'Listed'}
            </p>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {land.expires || land.bids || land.stage || land.listed}
            </p>
          </div>
        </div>

        {/* Revenue and Action */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">{land.revenueLabel}</p>
            <p className={`text-lg font-bold ${
              land.status === 'Leased' ? 'text-primary' :
              land.status === 'Pending' ? 'text-accent' :
              land.status === 'Under Review' ? 'text-blue-600' :
              'text-slate-700 dark:text-slate-300'
            }`}>
              {land.revenue}
            </p>
          </div>

          <button className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            land.actionColor === 'bg-amber-500'
              ? 'bg-accent text-white hover:bg-amber-700 shadow-sm shadow-accent/20'
              : land.actionColor === 'bg-blue-50'
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-700'
              : land.actionColor === 'bg-slate-900'
              ? 'bg-slate-900 text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-primary dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}>
            {land.actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandCard;
