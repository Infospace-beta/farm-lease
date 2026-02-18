import React from 'react';
import StatusBadge from './StatusBadge';

/**
 * VerificationTableRow Component
 * Renders a single row in the land verification table
 * Displays owner info, plot details, title deed number, and action buttons
 */
const VerificationTableRow = ({ item, onVerify, onFlag, onViewDetails }) => {
  return (
    <div className="border-b border-gray-50 bg-white py-4 px-6">
      <div className="flex-row items-start">
        {/* Owner Name */}
        <div className="w-1/5 pr-2">
          <div className="flex-row items-center gap-3">
            {item.ownerImage ? (
              <img
                src={item.ownerImage}
                className="w-9 h-9 rounded-full border border-gray-200"
                alt={item.ownerName}
              />
            ) : (
              <div className={`w-9 h-9 rounded-full ${item.avatarBg || 'bg-purple-100'} items-center justify-center border ${item.avatarBorder || 'border-purple-200'}`}>
                <span className={`text-xs font-bold ${item.avatarText || 'text-purple-600'}`}>
                  {item.initials}
                </span>
              </div>
            )}
            <div>
              <p className="font-bold text-gray-800 text-sm">{item.ownerName}</p>
              <p className="text-xs text-gray-500">{item.submittedTime}</p>
            </div>
          </div>
        </div>

        {/* Plot ID */}
        <div className="w-1/6 pr-2">
          <div className="bg-gray-100 px-2 py-1 rounded self-start">
            <span className="font-mono text-gray-600 text-xs">{item.plotId}</span>
          </div>
        </div>

        {/* Title Deed Number */}
        <div className="w-1/5 px-2 bg-emerald-50/10 border-l border-r border-gray-50">
          <button className="flex-row items-center gap-2">
            <span className="font-bold text-lg text-[#0f392b] tracking-wide">
              {item.titleDeedNumber}
            </span>
            {item.isInvalid ? (
              <span className="material-icons-round text-[16px]" style={{ color: '#EF4444' }}>error</span>
            ) : (
              <span className="material-icons-round text-[14px]" style={{ color: '#047857', opacity: 0.5 }}>content_copy</span>
            )}
          </button>
        </div>

        {/* Region */}
        <div className="w-1/6 px-2">
          <span className="text-gray-600 text-sm">{item.region}</span>
        </div>

        {/* Status */}
        <div className="w-1/12 px-2">
          <StatusBadge status={item.status} isOwnerUpdated={item.isOwnerUpdated} />
        </div>

        {/* Actions */}
        <div className="w-1/4 pl-2">
          {item.status === 'verified' ? (
            <button 
              onClick={() => onViewDetails(item)}
              className="flex-row items-center justify-end gap-1 ml-auto"
            >
              <span className="text-sm font-medium text-gray-400">View Details</span>
              <span className="material-icons-round text-[14px]" style={{ color: '#9CA3AF' }}>arrow_forward</span>
            </button>
          ) : (
            <div className="flex-row justify-end gap-2">
              <button
                onClick={() => onFlag(item)}
                className="px-3 py-1.5 border border-[#5D4037] rounded-lg items-center justify-center"
                style={{ minWidth: 120 }}
              >
                <span className="text-xs font-bold text-[#5D4037]">Flag/Correction</span>
              </button>
              <button
                onClick={() => onVerify(item)}
                className="px-3 py-1.5 bg-[#047857] rounded-lg items-center justify-center"
                style={{ minWidth: 120 }}
              >
                <span className="text-xs font-bold text-white">Verify Property</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationTableRow;
