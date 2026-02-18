import React from 'react';

/**
 * DealerViolationRow Component
 * Renders a single row in the compliance violations table
 * Displays dealer info, ratings, violations, and action buttons
 */
const DealerViolationRow = ({ dealer, onInvestigate, onSuspend, onMessage }) => {
  // Flag frequency badge styles
  const getFlagBadgeStyle = (type) => {
    const styles = {
      'red': 'bg-red-100 text-red-700',
      'yellow': 'bg-yellow-100 text-yellow-700',
      'gray': 'bg-gray-100 text-gray-600',
      'red-severe': 'bg-red-800 text-red-100'
    };
    return styles[type] || styles.gray;
  };

  // Status badge styles
  const getStatusBadgeStyle = (status) => {
    const styles = {
      'under-review': 'bg-red-50 text-red-700 border-red-100',
      'warning-sent': 'bg-orange-50 text-orange-700 border-orange-100',
      'suspended': 'bg-gray-100 text-gray-600 border-gray-200',
      'severe-violation': 'bg-red-100 text-red-700 border-red-200'
    };
    return styles[status] || styles['under-review'];
  };

  // Violation text color
  const getViolationColor = (type) => {
    const colors = {
      'severe': 'text-red-500',
      'warning': 'text-orange-500',
      'minor': 'text-gray-400'
    };
    return colors[type] || colors.minor;
  };

  // Row background color
  const getRowBgColor = (highlighted) => {
    if (!highlighted) return 'bg-white';
    if (dealer.violationType === 'severe') return 'bg-red-50/20';
    if (dealer.violationType === 'warning') return 'bg-yellow-50/10';
    return 'bg-white';
  };

  return (
    <div className={`border-b border-gray-50 py-4 ${getRowBgColor(dealer.highlighted)}`}>
      <div className="flex-row items-center">
        {/* Dealer Name */}
        <div className="flex-[0.22] pl-2 pr-4">
          <div className="flex-row items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${dealer.avatarBg} items-center justify-center relative`}>
              <span className="text-white font-bold text-sm">
                {dealer.initials}
              </span>
              {dealer.hasAlert && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="absolute inset-0 w-3 h-3 rounded-full bg-red-400 opacity-75 animate-ping" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">{dealer.name}</p>
              <p className="text-xs text-gray-500">{dealer.dealerId}</p>
              <p className={`text-[10px] mt-1 font-semibold ${getViolationColor(dealer.violationType)}`}>
                {dealer.violation ? `Violation: ${dealer.violation}` : dealer.violation}
              </p>
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="flex-[0.12] pr-4">
          <div className="flex-row items-center gap-1">
            <span className="material-icons-round text-[14px]" style={{ color: '#EAB308' }}>star</span>
            <span className="font-bold text-gray-700 text-sm">{dealer.rating}</span>
            <span className="text-xs text-gray-400">({dealer.ratingCount})</span>
          </div>
        </div>

        {/* Flag Frequency */}
        <div className="flex-[0.12] items-center pr-4">
          <div className={`px-2 py-0.5 rounded-full ${getFlagBadgeStyle(dealer.flagType)}`}>
            <span className="text-[10px] font-bold uppercase tracking-wide">
              {dealer.flagFrequency}
            </span>
          </div>
        </div>

        {/* Total Products */}
        <div className="flex-[0.12] items-center pr-4">
          <span className="font-medium text-gray-600 text-sm">{dealer.totalProducts}</span>
        </div>

        {/* Flagged Items */}
        <div className="flex-[0.12] items-center pr-4">
          {dealer.flaggedItems > 0 ? (
            <button className="px-3 py-1 rounded-lg border border-emerald-600 bg-white">
              <span className="text-xs font-bold text-emerald-600">
                {dealer.flaggedItems} Active
              </span>
            </button>
          ) : (
            <div className="px-2.5 py-0.5 rounded-full bg-gray-100">
              <span className="text-xs font-medium text-gray-600">0</span>
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex-[0.10] items-center pr-2">
          <div className={`px-3 py-1 rounded-lg border ${getStatusBadgeStyle(dealer.status)}`}>
            <span className={`text-xs font-bold ${getStatusBadgeStyle(dealer.status).includes('text-') ? '' : 'text-gray-700'}`}>
              {dealer.statusLabel}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-[0.20] pr-2">
          <div className="flex-row justify-end gap-2">
            {/* Message Button */}
            <button
              onClick={() => onMessage(dealer)}
              className="p-1.5 bg-white border border-gray-200 rounded-lg"
            >
              <span className="material-icons-round text-[18px]" style={{ color: '#6B7280' }}>mail</span>
            </button>

            {/* Investigate Button */}
            <button
              onClick={() => onInvestigate(dealer)}
              className="px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg"
            >
              <span className="text-xs font-bold text-[#047857]">Investigate</span>
            </button>

            {/* Suspend Button */}
            <button
              onClick={() => onSuspend(dealer, dealer.status === 'suspended' ? 'dealer' : 'product')}
              className={`px-3 py-1.5 rounded-lg border ${
                dealer.status === 'suspended' 
                  ? 'bg-white border-gray-100 opacity-50' 
                  : 'bg-white border-gray-200'
              }`}
              disabled={dealer.status === 'suspended'}
            >
              <span className={`text-xs font-bold ${
                dealer.status === 'suspended' ? 'text-gray-400' : 'text-red-600'
              }`}>
                {dealer.flaggedItems === dealer.totalProducts ? 'Suspend Dealer' : 'Suspend Product'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerViolationRow;
