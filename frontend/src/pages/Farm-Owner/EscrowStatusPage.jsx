import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

const EscrowStatusPage = () => {
  const escrowTracks = [
    {
      id: 1,
      plotName: 'Plot A4 - North Sector',
      leaseId: '#FL-2024-882',
      tenant: 'John Doe',
      totalAmount: 650000,
      status: 'Conditions Met',
      statusColor: 'emerald',
      lastUpdate: '2 hours ago',
      progress: 75,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAT6nH4nkwO8i4jHFK5OJrAVEUaX9KPD_3gQi9czBmAGggy60DZQqZZyqYfwKCSK6enG4geS-t5bUGzong4mgCJVYb-Rt85Mh3qTMguTY07o62eyGxoTFfLvC84usaEynp4Vpqs1iUZJTZg-3qhhFE73W8KGmfH8JIvaB-kgMw8EvMqUfh18UkKlBnIhTeTx4MhbOl3MSyD6lTb_0pTqdqN3O8Es4fGjvNpFA5QFqcmSXtQenx2B-heQbKC5IqtfVkyzgKndRfmhRp_',
      milestones: [
        { label: 'Deposit Paid', date: 'Oct 12, 2023', completed: true },
        { label: 'Agreement Signed', date: 'Oct 15, 2023', completed: true },
        { label: 'Conditions Met', date: 'In Progress', completed: false, active: true },
        { label: 'Funds Released', date: 'Est. Nov 01', completed: false },
      ],
      actionRequired: true,
      actionMessage: 'Pending Action: Soil Inspection Report approval required.',
      actionButton: 'Approve Report',
      actionType: 'primary',
    },
    {
      id: 2,
      plotName: 'Plot B2 - East',
      leaseId: '#FL-2024-901',
      tenant: 'Jane Smith',
      totalAmount: 450000,
      status: 'Awaiting Signatures',
      statusColor: 'amber',
      lastUpdate: '1 day ago',
      progress: 25,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrxrphhwqUHyCR0IxEQ_HDv3R9z3CDNvg51eW7CsOusce7YRYRwNyJPkR8akl-FZtjjwN0r3G0tjmdYEEvElAZ4EAJkaET-4gbBLZnf_dFp7-DAc3E5vz1Gexp46w68bvmUuC3Y7Sblw-h6p9HeJEhNCwJfDhKN1psyCOGzYzhCsb-5uSeBFVPCkL02DZzl5uOG_WlxRtwX1kfBZVo-bJNuKq9NRS-PyBlHtMMrqW0i2IaZfJoiGOXnfriDpbKXCFZQuxv5FA7o8JK',
      milestones: [
        { label: 'Deposit Paid', date: 'Oct 20, 2023', completed: true },
        { label: 'Agreement Signed', date: 'Waiting...', completed: false, active: true },
        { label: 'Conditions Met', date: '-', completed: false },
        { label: 'Funds Released', date: '-', completed: false },
      ],
      actionRequired: true,
      actionMessage: 'Tenant has downloaded the agreement. Awaiting digital signature.',
      actionButton: 'Send Reminder',
      actionType: 'secondary',
    },
    {
      id: 3,
      plotName: 'Plot C1 - Valley',
      leaseId: '#FL-2023-550',
      tenant: 'Michael K.',
      totalAmount: 100000,
      status: 'Complete',
      statusColor: 'slate',
      lastUpdate: 'Released: Oct 05, 2023',
      progress: 100,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEeNaQ9ipY6hAWWDXUwBn_KT5iX0Xx6_qbKyAQKAGY5cKJrFkEEpGY8aZIJZewYzN9XKiSk_Bu75ATzV5jPRjwG4RrCJ8DaRtXbEs9gMFmh_kH-TV9Z0wlF200GtFOMO2yGGfavlW3vwurJyi85G52zDef_1NGPd46LZJ7JvsQcRpHAvWc78c4Tc6AQ5tuvf9GBGwI38AhBLDRdYl3e1tY9Zij3apSb5VGUvMQrLrdiYMEfsJlTEvwbPwiscC33L4HaPJMa4mYYPAV',
      milestones: [
        { label: 'Deposit Paid', date: 'Sep 10, 2023', completed: true },
        { label: 'Agreement Signed', date: 'Sep 12, 2023', completed: true },
        { label: 'Conditions Met', date: 'Sep 30, 2023', completed: true },
        { label: 'Funds Released', date: 'Oct 05, 2023', completed: true },
      ],
      actionRequired: false,
      completed: true,
    },
  ];

  return (
    <DashboardLayout>
      {/* Pattern Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#047857_0.5px,transparent_0.5px)] [background-size:10px_10px] opacity-5 pointer-events-none"></div>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-earth font-serif">
              Escrow Status
            </h2>
            <p className="mt-2 text-slate-500 max-w-2xl">
              Track payment milestones for all your active land leases. Funds are securely held until conditions are met.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined text-[20px]">history</span>
              Transaction History
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-10 grid gap-6 sm:grid-cols-3">
          <StatCard
            title="Total in Escrow"
            amount="Ksh 1.2M"
            subtitle="Across 3 active deals"
            icon="lock"
            iconColor="primary"
          />
          <StatCard
            title="Pending Release"
            amount="Ksh 450k"
            subtitle="Next release: 2 days"
            icon="hourglass_top"
            iconColor="amber-600"
          />
          <StatCard
            title="Cleared this Month"
            amount="Ksh 210k"
            subtitle="Successfully transferred"
            icon="check_circle"
            iconColor="emerald-600"
          />
        </div>

        {/* Active Escrow Tracks */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-earth font-serif flex items-center gap-2">
            Active Escrow Tracks
            <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full font-sans">
              3
            </span>
          </h3>

          {escrowTracks.map((track) => (
            <EscrowTrackCard key={track.id} track={track} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

// StatCard Component
const StatCard = ({ title, amount, subtitle, icon, iconColor }) => {
  const iconColorClass = iconColor === 'primary' 
    ? 'bg-primary/10 text-primary' 
    : `bg-${iconColor}/10 text-${iconColor}`;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <div className="flex flex-col h-full justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <h3 className="mt-2 text-3xl font-bold text-earth">{amount}</h3>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">{subtitle}</span>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${iconColorClass}`}>
            <span className="material-symbols-outlined text-lg">{icon}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// EscrowTrackCard Component
const EscrowTrackCard = ({ track }) => {
  const statusColorMap = {
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden ${track.completed ? 'opacity-80 hover:opacity-100' : ''} transition-opacity`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-lg bg-slate-100 border border-slate-200 p-1 shrink-0">
              <div
                className="h-full w-full rounded bg-cover bg-center"
                style={{ backgroundImage: `url('${track.imageUrl}')` }}
              ></div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900">{track.plotName}</h4>
              <p className="text-sm text-slate-500">
                Lease ID: {track.leaseId} • Tenant:{' '}
                <span className="text-slate-800 font-medium">{track.tenant}</span>
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusColorMap[track.statusColor]}`}>
                  {track.status}
                </span>
                <span className="text-xs text-slate-400">{track.lastUpdate}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-sm text-slate-500 uppercase font-semibold">
              Total Escrow Amount
            </p>
            <p className={`text-2xl font-bold ${track.completed ? 'text-slate-400 line-through' : 'text-primary'}`}>
              Ksh {track.totalAmount.toLocaleString()}
            </p>
            <button className="text-sm text-primary hover:underline mt-1 font-medium">
              {track.completed ? 'Download Receipt' : 'View Agreement Details'}
            </button>
          </div>
        </div>

        {/* Progress Timeline */}
        <ProgressTimeline milestones={track.milestones} progress={track.progress} completed={track.completed} />

        {/* Action Section */}
        {track.actionRequired && (
          <div className="mt-12 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className={`material-symbols-outlined ${track.actionType === 'primary' ? 'text-amber-500' : 'text-slate-400'}`}>
                {track.actionType === 'primary' ? 'warning' : 'info'}
              </span>
              <span>{track.actionMessage}</span>
            </div>
            <button
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                track.actionType === 'primary'
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {track.actionButton}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ProgressTimeline Component
const ProgressTimeline = ({ milestones, progress, completed }) => {
  return (
    <div className="relative py-4">
      {/* Background Progress Bar */}
      <div className="absolute top-1/2 left-0 w-full h-1.5 bg-slate-100 rounded-full -translate-y-1/2"></div>
      {/* Active Progress Bar */}
      <div
        className={`absolute top-1/2 left-0 h-1.5 rounded-full -translate-y-1/2 transition-all duration-1000 ${completed ? 'bg-emerald-500' : 'bg-primary'}`}
        style={{ width: `${progress}%` }}
      ></div>

      {/* Milestones */}
      <div className="relative flex justify-between w-full">
        {milestones.map((milestone, index) => (
          <div key={index} className="flex flex-col items-center group">
            {/* Milestone Icon */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-sm z-10 ${
                milestone.completed
                  ? completed
                    ? 'bg-emerald-500 text-white'
                    : 'bg-primary text-white'
                  : milestone.active
                  ? 'bg-white border-2 border-primary text-primary'
                  : 'bg-slate-200 text-slate-400'
              }`}
            >
              <span className={`material-symbols-outlined text-sm ${milestone.active && !milestone.completed ? 'animate-pulse' : ''}`}>
                {milestone.completed
                  ? 'check'
                  : milestone.active
                  ? index === 1
                    ? 'edit_document'
                    : 'sync'
                  : index === 2
                  ? 'fact_check'
                  : 'payments'}
              </span>
            </div>

            {/* Milestone Label (shown only for first, last, and active) */}
            {(index === 0 || index === milestones.length - 1 || milestone.active || milestone.completed) && (
              <div className="absolute top-10 flex flex-col items-center w-32 text-center">
                <p
                  className={`text-xs font-bold ${
                    milestone.completed
                      ? completed
                        ? 'text-emerald-600'
                        : 'text-primary'
                      : milestone.active
                      ? 'text-primary'
                      : 'text-slate-400'
                  }`}
                >
                  {milestone.label}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">{milestone.date}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EscrowStatusPage;
