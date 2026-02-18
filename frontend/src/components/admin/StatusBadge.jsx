import React from 'react';

/**
 * StatusBadge Component
 * Displays the verification status with appropriate colors and styling
 * Supports multiple statuses: pending, verified, flagged
 */
const StatusBadge = ({ status, isOwnerUpdated = false }) => {
  const statusConfig = {
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      dot: 'bg-yellow-600',
      label: 'Pending'
    },
    verified: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      dot: 'bg-green-600',
      label: 'Verified'
    },
    flagged: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      dot: 'bg-red-600',
      label: 'Flagged'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div>
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg} ${config.text} border ${config.border} inline-flex`}>
        <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        <span className={`text-xs font-bold ${config.text}`}>{config.label}</span>
      </div>
      {isOwnerUpdated && (
        <div className="mt-1 px-1.5 py-0.5 rounded border border-blue-100 bg-blue-50 inline-flex">
          <span className="text-[10px] font-semibold text-blue-600">Owner Updated</span>
        </div>
      )}
    </div>
  );
};

export default StatusBadge;
