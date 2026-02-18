import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

const FarmOwnerSidebar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/owner/dashboard', icon: 'dashboard', filled: true },
    { label: 'Upload Land', path: '/owner/lands/add', icon: 'upload_file' },
    { label: 'My Lands', path: '/owner/lands', icon: 'map' },
    { label: 'Lease Requests', path: '/owner/lease-requests', icon: 'pending_actions' },
    { label: 'Financials', path: '/owner/financials', icon: 'account_balance_wallet' },
    { label: 'Escrow Status', path: '/owner/escrow', icon: 'verified_user' },
    { label: 'Agreements', path: '/owner/agreements', icon: 'handshake' },
  ];

  return (
    <aside className={`flex flex-col border-r border-slate-800 bg-sidebar-bg overflow-y-auto z-20 shadow-sm text-white h-screen transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Header with Toggle Button */}
      <div className="flex items-center justify-between px-4 py-6 border-b border-white/10">
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${
          isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
        }`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-black/20">
            <span className="material-symbols-outlined text-2xl">agriculture</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold font-serif text-white tracking-tight">FarmLease</h1>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-300/70">
              Land Management
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/10 transition-all duration-300 flex-shrink-0 group"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <IoChevronForwardOutline className="text-xl text-white group-hover:scale-110 transition-transform" />
          ) : (
            <IoChevronBackOutline className="text-xl text-white group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {menuItems.map((item, index) => {
          const isActive = router.pathname === item.path;
          return (
            <Link
              key={index}
              href={item.path}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors relative group
                ${isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }
              `}
              title={isCollapsed ? item.label : ''}
            >
              <span 
                className="material-symbols-outlined flex-shrink-0"
                style={{ fontVariationSettings: isActive && item.filled ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className={`transition-opacity duration-300 whitespace-nowrap ${
                isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
              }`}>
                {item.label}
              </span>
              {/* Tooltip on hover when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="mt-auto border-t border-white/10 p-4">
        <Link
          href="/owner/profile"
          className="flex items-center gap-3 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer group mb-2 relative"
          title={isCollapsed ? user?.name || 'Profile' : ''}
        >
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary shadow-sm bg-slate-200 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-semibold text-lg">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'J'}
            </span>
          </div>
          <div className={`flex flex-col flex-1 transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          }`}>
            <span className="text-sm font-semibold text-white">
              {user?.name || 'James M.'}
            </span>
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
              Premium Owner
            </span>
          </div>
          {/* Tooltip on hover when collapsed */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
              {user?.name || 'Profile'}
            </div>
          )}
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors relative group"
          title={isCollapsed ? 'Logout' : ''}
        >
          <span className="material-symbols-outlined text-lg flex-shrink-0">logout</span>
          <span className={`transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          }`}>
            Logout
          </span>
          {/* Tooltip on hover when collapsed */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};

export default FarmOwnerSidebar;
