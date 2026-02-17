import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Map, 
  Brain, 
  Store, 
  FolderOpen, 
  Wallet,
  Bell,
  LogOut,
  Sprout,
  X
} from 'lucide-react';

const LesseeSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const displayName = user?.name || user?.username || 'User';
  const displayRole = user?.role || 'lessee';

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`fixed lg:sticky top-0 w-64 bg-forest-green h-screen flex flex-col justify-between py-6 px-6 shadow-xl z-40 transition-transform duration-300 border-r border-white/5 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      <div>
        {/* Close Button - Mobile Only */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(19,236,128,0.2)]">
            <Sprout className="text-forest-green" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none font-serif">
              Farm<span className="text-gray-300 font-normal font-display">Lease</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">Asset Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          <Link 
            to="/lessee/dashboard" 
            onClick={() => setIsSidebarOpen(false)} 
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
              isActive('/lessee/dashboard')
                ? 'bg-white/10 text-white shadow-sm backdrop-blur-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">Dashboard</span>
          </Link>
          
          <Link 
            to="/lessee/browse" 
            onClick={() => setIsSidebarOpen(false)} 
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
              isActive('/lessee/browse')
                ? 'bg-white/10 text-white shadow-sm backdrop-blur-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Map size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">Find Land</span>
          </Link>
          
          <Link 
            to="/lessee/recommendations" 
            onClick={() => setIsSidebarOpen(false)} 
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
              isActive('/lessee/recommendations') || isActive('/lessee/recommendations/history')
                ? 'bg-white/10 text-white shadow-sm backdrop-blur-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">AI Predictor</span>
          </Link>
          
          <Link 
            to="/lessee/shop" 
            onClick={() => setIsSidebarOpen(false)} 
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
              isActive('/lessee/shop')
                ? 'bg-white/10 text-white shadow-sm backdrop-blur-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Store size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">Agro-Dealer Shop</span>
          </Link>
          
          <Link 
            to="/lessee/leases" 
            onClick={() => setIsSidebarOpen(false)} 
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
              isActive('/lessee/leases')
                ? 'bg-white/10 text-white shadow-sm backdrop-blur-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FolderOpen size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">My Leases</span>
          </Link>
          
          <Link 
            to="/lessee/financials" 
            onClick={() => setIsSidebarOpen(false)} 
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${
              isActive('/lessee/financials')
                ? 'bg-white/10 text-white shadow-sm backdrop-blur-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wallet size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">Financials</span>
          </Link>
          
          <Link 
            to="/lessee/notifications" 
            onClick={() => setIsSidebarOpen(false)} 
            className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all group relative ${
              isActive('/lessee/notifications')
                ? 'bg-white/10 text-white shadow-sm backdrop-blur-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bell size={20} className="group-hover:scale-110 transition-transform" />
            <span className="font-medium text-sm">Notifications</span>
            <span className="w-2 h-2 rounded-full bg-red-500 ml-auto"></span>
          </Link>
        </nav>
      </div>

      {/* User Profile & Logout */}
      <div className="mt-auto space-y-4">
        <div className="bg-black/20 rounded-xl p-3 flex items-center gap-3 cursor-pointer hover:bg-black/30 transition-colors">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=13ec80&color=0f392b&bold=true`} 
            alt="User profile" 
            className="w-10 h-10 rounded-full object-cover border-2 border-primary/20"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white">{displayName}</p>
            <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider">{displayRole}</p>
          </div>
        </div>
        <div className="h-px bg-white/10 w-full"></div>
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-2 py-1 text-gray-400 hover:text-white transition-all w-full group pl-3"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-xs uppercase tracking-wide">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default LesseeSidebar;
