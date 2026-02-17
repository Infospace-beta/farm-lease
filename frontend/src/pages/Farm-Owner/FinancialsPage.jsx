import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const FinancialsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('This Year');

  // Sample data for revenue trends (6 months)
  const revenueData = [
    { month: 'May', actual: 45000, projected: 40000 },
    { month: 'Jun', actual: 52000, projected: 48000 },
    { month: 'Jul', actual: 48000, projected: 50000 },
    { month: 'Aug', actual: 62000, projected: 55000 },
    { month: 'Sep', actual: 58000, projected: 60000 },
    { month: 'Oct', actual: 75000, projected: 65000 },
  ];

  // Sample transaction data
  const transactions = [
    {
      id: 1,
      type: 'Lease Payment',
      description: '- Plot B2',
      from: 'Jane Smith',
      date: 'Oct 24, 2023',
      status: 'Completed',
      statusColor: 'emerald',
      amount: 45000,
      icon: 'payments',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 2,
      type: 'Withdrawal to Bank',
      description: 'Ref: WD-90283',
      from: '',
      date: 'Oct 20, 2023',
      status: 'Processed',
      statusColor: 'slate',
      amount: -20000,
      icon: 'account_balance',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      id: 3,
      type: 'Escrow Deposit',
      description: '- Plot C1',
      from: 'Michael K.',
      date: 'Oct 18, 2023',
      status: 'Held in Escrow',
      statusColor: 'amber',
      amount: 60000,
      icon: 'lock',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    {
      id: 4,
      type: 'Lease Payment',
      description: '- Plot A4',
      from: 'John Doe',
      date: 'Oct 12, 2023',
      status: 'Completed',
      statusColor: 'emerald',
      amount: 50000,
      icon: 'payments',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
  ];

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      {/* Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#047857_0.5px,transparent_0.5px)] [background-size:10px_10px] opacity-5 pointer-events-none"></div>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-earth font-serif">
              Financials &amp; Revenue
            </h2>
            <p className="mt-2 text-slate-500 max-w-2xl">
              Track earnings, manage withdrawals, and view transaction history.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              {selectedYear}
            </button>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-all">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Export Report
            </button>
          </div>
        </div>

        {/* Revenue Trends Chart */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Revenue Trends (Ksh)</h3>
              <p className="text-sm text-slate-500">Monthly income over last 6 months</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-slate-600">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <span className="text-slate-600">Projected</span>
              </div>
            </div>
          </div>

          {/* Simple Area Chart Visualization */}
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#e2e8f0" strokeWidth="1" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="#e2e8f0" strokeWidth="1" />

              {/* Projected area */}
              <path
                d="M 0,150 L 100,125 L 200,120 L 300,100 L 400,90 L 500,75 L 500,200 L 0,200 Z"
                fill="#e2e8f0"
                opacity="0.3"
              />

              {/* Actual area */}
              <path
                d="M 0,138 L 100,112 L 200,120 L 300,80 L 400,90 L 500,42 L 500,200 L 0,200 Z"
                fill="#047857"
                opacity="0.1"
              />

              {/* Actual line */}
              <path
                d="M 0,138 L 100,112 L 200,120 L 300,80 L 400,90 L 500,42"
                fill="none"
                stroke="#047857"
                strokeWidth="2"
              />

              {/* Data points */}
              <circle cx="0" cy="138" r="4" fill="#047857" />
              <circle cx="100" cy="112" r="4" fill="#047857" />
              <circle cx="200" cy="120" r="4" fill="#047857" />
              <circle cx="300" cy="80" r="4" fill="#047857" />
              <circle cx="400" cy="90" r="4" fill="#047857" />
              <circle cx="500" cy="42" r="4" fill="#047857" />
            </svg>

            {/* Month labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-slate-500">
              {revenueData.map((data) => (
                <span key={data.month}>{data.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Pending Escrow Payouts */}
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Pending Escrow Payouts
            </h3>
            <h4 className="text-3xl font-bold text-earth mb-2">Ksh 125,000</h4>
            <p className="text-xs text-slate-500 mb-6">Held securely for active leases</p>

            {/* Escrow Item */}
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-slate-900">Plot A4 (James K.)</span>
                </div>
                <span className="text-lg font-bold text-accent">Ksh 50k</span>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Est. Release: 15 Nov</span>
                  <span>75% Complete</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 text-sm font-medium text-primary border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                View Escrow Details
              </button>
            </div>
          </div>

          {/* Available for Withdrawal */}
          <div className="rounded-2xl bg-primary text-white p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/70 mb-4">
                Available for Withdrawal
              </h3>
              <h4 className="text-4xl font-bold mb-6">Ksh 85,400</h4>

              <div className="flex items-center justify-between mb-6 text-sm">
                <div>
                  <p className="text-white/70 text-xs mb-1">Last Payout</p>
                  <p className="font-medium">Oct 15, 2023</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-xs mb-1">Scheduled</p>
                  <p className="font-medium">Nov 1, 2023</p>
                </div>
              </div>

              <button className="w-full px-4 py-3 bg-white text-primary text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-lg">
                Request Withdrawal
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-xl font-bold text-slate-900">Transaction History</h3>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              {/* Filter button */}
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-slate-600 text-[20px]">
                  tune
                </span>
              </button>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Transaction Details
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="pb-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="pb-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="pb-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <TransactionRow key={transaction.id} transaction={transaction} />
                ))}
              </tbody>
            </table>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-slate-300 text-5xl mb-2">
                  search_off
                </span>
                <p className="text-slate-500">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// TransactionRow Component
const TransactionRow = ({ transaction }) => {
  const statusColorMap = {
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-600',
  };

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
      <td className="py-4">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-lg ${transaction.iconBg} flex items-center justify-center shrink-0`}>
            <span className={`material-symbols-outlined text-lg ${transaction.iconColor}`}>
              {transaction.icon}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">{transaction.type}</p>
            <p className="text-xs text-slate-500">
              {transaction.description}
              {transaction.from && (
                <>
                  <br />
                  <span className="text-slate-600">From: {transaction.from}</span>
                </>
              )}
            </p>
          </div>
        </div>
      </td>
      <td className="py-4">
        <p className="text-sm text-slate-600">{transaction.date}</p>
      </td>
      <td className="py-4">
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${statusColorMap[transaction.statusColor]}`}>
          {transaction.status}
        </span>
      </td>
      <td className="py-4 text-right">
        <p className={`text-sm font-bold ${transaction.amount > 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
          {transaction.amount > 0 ? '+' : ''} Ksh {Math.abs(transaction.amount).toLocaleString()}
        </p>
      </td>
      <td className="py-4 text-right">
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <span className="material-symbols-outlined text-slate-400 text-[20px]">
            download
          </span>
        </button>
      </td>
    </tr>
  );
};

export default FinancialsPage;
