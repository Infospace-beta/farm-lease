import React from 'react';

/**
 * ContractRow Component
 * Displays a single contract row in the agreements table
 * Shows contract details, parties, plot info, duration, signature status, and actions
 */
const ContractRow = ({ contract, onDownload, onResendNotification }) => {
  // Get signature status badge styling
  const getSignatureBadge = (status) => {
    const badges = {
      signed: {
        bg: 'bg-green-50',
        border: 'border-green-100',
        text: 'text-green-700',
        dotColor: 'bg-green-500',
        hasPulse: false
      },
      pending: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-100',
        text: 'text-yellow-700',
        dotColor: 'bg-yellow-500',
        hasPulse: true
      },
      active: {
        bg: 'bg-green-50',
        border: 'border-green-100',
        text: 'text-green-700',
        dotColor: 'bg-green-500',
        hasPulse: false
      }
    };
    return badges[status] || badges.signed;
  };

  const signatureBadge = getSignatureBadge(contract.signature.status);

  // Render party (lessee or lessor) with avatar
  const renderParty = (party, label) => {
    return (
      <div className="flex-row items-center gap-2 mb-3">
        {party.hasImage ? (
          <img
            src={party.imageUrl}
            className="w-6 h-6 rounded-full border border-gray-200"
            alt={party.name}
          />
        ) : (
          <div className={`w-6 h-6 rounded-full ${party.avatarBg} items-center justify-center border ${party.avatarBg.replace('100', '200')}`}>
            <span className={`${party.avatarBg.replace('bg-', 'text-').replace('100', '600')} font-bold text-[10px]`}>
              {party.initials}
            </span>
          </div>
        )}
        <div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none mb-0.5">
            {label}
          </p>
          <p className="font-semibold text-gray-700 text-sm">
            {party.name}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="border-b border-gray-50 px-4 py-4 hover:bg-gray-50/50">
      <div className="flex-row">
        {/* Agreement ID Column */}
        <div className="flex-[0.15] pr-4">
          <div className="bg-gray-100 px-2 py-1 rounded self-start">
            <span className="font-mono text-gray-500 font-bold text-xs">
              {contract.id}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            Created: {contract.createdDate}
          </p>
        </div>

        {/* Parties Column */}
        <div className="flex-[0.20] pr-4">
          {renderParty(contract.lessee, 'Lessee')}
          {renderParty(contract.lessor, 'Lessor')}
        </div>

        {/* Land Plot Column */}
        <div className="flex-[0.18] pr-4">
          <div className="flex-row items-start gap-2">
            <span className="material-icons-round text-[18px] mt-0.5" style={{ color: '#0f392b' }}>terrain</span>
            <div className="flex-1">
              <p className="font-bold text-[#5D4037] text-sm">
                {contract.plot.name} ({contract.plot.size})
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {contract.plot.location}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {contract.plot.lrNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Duration Column */}
        <div className="flex-[0.15] pr-4">
          <p className="text-gray-700 font-medium text-sm">
            {contract.duration.label}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {contract.duration.startDate} - {contract.duration.endDate}
          </p>
          
          {/* Progress Bar */}
          <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-[#047857]" 
              style={{ width: `${contract.duration.progress}%` }}
            />
          </div>
        </div>

        {/* Signature Status Column */}
        <div className="flex-[0.17] pr-4">
          <div className={`flex-row items-center gap-1.5 px-2.5 py-1 ${signatureBadge.bg} ${signatureBadge.border} border rounded-full self-start`}>
            <div className={`w-1.5 h-1.5 rounded-full ${signatureBadge.dotColor} ${signatureBadge.hasPulse ? 'animate-pulse' : ''}`} />
            <span className={`${signatureBadge.text} text-xs font-bold`}>
              {contract.signature.label}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2">
            {contract.signature.note}
          </p>
        </div>

        {/* Actions Column */}
        <div className="flex-[0.15] items-end">
          <button
            onClick={() => onDownload(contract)}
            disabled={!contract.canDownload}
            className={`flex-row items-center gap-2 px-3 py-1.5 rounded-lg shadow-sm ${
              contract.canDownload 
                ? 'bg-[#0f392b] hover:bg-[#1c4a3a]' 
                : 'bg-[#0f392b]/50 cursor-not-allowed'
            }`}
          >
            <span className="material-icons-round text-[14px]" style={{ color: '#FFFFFF' }}>picture_as_pdf</span>
            <span className="text-white text-xs font-bold">
              Download PDF
            </span>
          </button>

          {contract.needsResend && (
            <button 
              onClick={() => onResendNotification(contract)}
              className="mt-2"
            >
              <span className="text-[10px] text-[#047857] font-bold hover:underline">
                Resend Notification
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractRow;
