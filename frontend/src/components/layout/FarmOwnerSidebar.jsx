import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FarmOwnerSidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Dashboard', path: '/owner/dashboard', icon: 'dashboard', filled: true },
    { label: 'My Lands', path: '/owner/lands', icon: 'map' },
    { label: 'Upload Land', path: '/owner/lands/add', icon: 'upload_file' },
    { label: 'Lease Requests', path: '/owner/lease-requests', icon: 'pending_actions' },
    { label: 'Financials', path: '/owner/financials', icon: 'account_balance_wallet' },
    { label: 'Escrow Status', path: '/owner/escrow', icon: 'verified_user' },
    { label: 'Agreements', path: '/owner/agreements', icon: 'handshake' },
  ];

  return (
    <aside className="flex w-64 flex-col border-r border-slate-800 bg-sidebar-bg overflow-y-auto z-20 shadow-sm text-white h-screen">
      {/* Logo & Brand */}
      <div className="flex items-center gap-3 px-6 py-8">
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

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-4">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={index}
              to={item.path}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors
                ${isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <span 
                className="material-symbols-outlined"
                style={{ fontVariationSettings: isActive && item.filled ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="mt-auto border-t border-white/10 p-4">
        <Link
          to="/owner/profile"
          className="flex items-center gap-3 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer group mb-2"
        >
          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary shadow-sm bg-slate-200 flex items-center justify-center">
            <span className="text-primary font-semibold text-lg">
              {user?.name?.charAt(0) || user?.email?.charAt(0) || 'J'}
            </span>
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-sm font-semibold text-white">
              {user?.name || 'James M.'}
            </span>
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
              Premium Owner
            </span>
          </div>
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default FarmOwnerSidebar;
