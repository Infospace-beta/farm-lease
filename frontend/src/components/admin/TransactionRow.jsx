import React from 'react';

/**
 * TransactionRow Component
 * Renders a single row in the payments & escrow transaction table
 * Displays transaction details, beneficiary info, amounts, and status
 */
const TransactionRow = ({ transaction, onAction }) => {
  // Format amount with thousand separators
  const formatAmount = (amount) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Get type badge styling
  const getTypeBadge = (type) => {
    if (type === 'lease') {
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        icon: 'landscape'
      };
    }
    return {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      icon: 'card-membership'
    };
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const badges = {
      'held': {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        icon: null,
        hasPulse: true
      },
      'active': {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        icon: 'verified',
        hasPulse: false
      },
      'released': {
        bg: 'bg-green-100',
        text: 'text-green-700',
        icon: 'check',
        hasPulse: false
      }
    };
    return badges[status] || badges.held;
  };

  const typeBadge = getTypeBadge(transaction.type);
  const statusBadge = getStatusBadge(transaction.status);

  // Get action icon based on transaction type
  const getActionIcon = () => {
    if (transaction.status === 'released') return 'description';
    if (transaction.status === 'active') return 'history';
    return 'more-vert';
  };

  return (
    <div className="border-b border-gray-50 px-6 py-4 hover:bg-green-50/30">
      <div className="flex-row items-start">
        {/* Transaction ID / Date */}
        <div className="flex-[0.15] pr-4">
          <p className="font-mono text-gray-800 font-bold text-sm">{transaction.id}</p>
          <p className="text-xs text-gray-400 mt-1">{transaction.date}</p>
        </div>

        {/* Beneficiary / Payer */}
        <div className="flex-[0.18] pr-4">
          <div className="flex-row items-center gap-3">
            {transaction.beneficiary.hasImage ? (
              <img
                src={transaction.beneficiary.imageUrl}
                className="w-8 h-8 rounded-full border border-gray-200"
                alt={transaction.beneficiary.name}
              />
            ) : (
              <div className={`w-8 h-8 rounded-full ${transaction.beneficiary.avatarBg} items-center justify-center`}>
                <span className="text-white font-bold text-xs">
                  {transaction.beneficiary.initials}
                </span>
              </div>
            )}
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm truncate">
                {transaction.beneficiary.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {transaction.beneficiary.from}
              </p>
            </div>
          </div>
        </div>

        {/* Type & Details */}
        <div className="flex-[0.18] pr-4">
          <div className={`flex-row items-center gap-1.5 px-2.5 py-1 rounded-md ${typeBadge.bg} self-start mb-1`}>
            <span className="material-icons-round text-[14px]" style={{ color: typeBadge.text.includes('blue') ? '#1D4ED8' : '#7E22CE' }}>{typeBadge.icon}</span>
            <span className={`${typeBadge.text} text-xs font-bold`}>
              {transaction.typeLabel}
            </span>
          </div>
          <p className="text-xs text-gray-600 truncate">
            {transaction.details}
          </p>
        </div>

        {/* Amount */}
        <div className="flex-[0.13] pr-4">
          <p className="font-bold text-gray-800 text-base text-right">
            {formatAmount(transaction.amount)}
          </p>
        </div>

        {/* Platform Fee */}
        <div className="flex-[0.12] pr-4">
          {transaction.feeIncluded ? (
            <p className="text-xs text-gray-400 text-center font-semibold">Included</p>
          ) : (
            <div className="items-center">
              <p className="text-xs font-semibold text-green-600">
                {formatAmount(transaction.platformFee)}
              </p>
              <p className="text-xs text-gray-500">({transaction.feePercentage}%)</p>
            </div>
          )}
        </div>

        {/* Status & Conditions */}
        <div className="flex-[0.18] pr-4">
          <div className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full ${statusBadge.bg} self-start ${statusBadge.border || ''}`}>
            {statusBadge.hasPulse && (
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500">
                <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping" />
              </div>
            )}
            {statusBadge.icon && (
              <span 
                className="material-icons-round text-[12px]" 
                style={{ color: statusBadge.text.includes('emerald') ? '#047857' : statusBadge.text.includes('green') ? '#15803D' : '#C2410C' }}
              >{statusBadge.icon}</span>
            )}
            <span className={`${statusBadge.text} text-[10px] font-bold uppercase tracking-wide`}>
              {transaction.statusLabel}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
            {transaction.statusNote}
          </p>
        </div>

        {/* Action */}
        <div className="flex-[0.06] items-end">
          <button
            onClick={() => onAction(transaction, 'view')}
            className="p-1 rounded hover:bg-gray-100"
          >
            <span className="material-icons-round text-[20px]" style={{ color: '#9CA3AF' }}>{getActionIcon()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionRow;
