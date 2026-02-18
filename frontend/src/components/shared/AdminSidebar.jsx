import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const AdminSidebar = ({ activeRoute = 'dashboard', isSidebarOpen = true, setIsSidebarOpen }) => {
  const router = useRouter();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', route: 'dashboard' },
    { id: 'user-management', label: 'User Management', icon: 'group', route: 'user-management' },
    { id: 'land-verifications', label: 'Land Verifications', icon: 'verified-user', route: 'land-verifications', badge: 12 },
    { id: 'agro-dealer', label: 'Agro-Dealer Oversight', icon: 'storefront', route: 'agro-dealer' },
    { id: 'payments', label: 'Payments & Escrow', icon: 'payments', route: 'payments' },
    { id: 'agreements', label: 'Agreements & Contracts', icon: 'history-edu', route: 'agreements' },
    { id: 'reports', label: 'Reports', icon: 'bar-chart', route: 'reports' },
  ];

  const isActive = (route) => activeRoute === route;

  const handleProfileClick = () => {
    router.push('/admin/profile');
    if (setIsSidebarOpen) setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    // Implement logout logic
    console.log('Logout pressed');
  };

  return (
    <aside className={`w-72 bg-[#0f392b] h-screen border-r border-white/5 fixed lg:relative z-30 transition-transform duration-300 ${
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    }`}>
      <div className="flex-1 overflow-y-auto px-6 py-6 no-scrollbar">
        {/* Close Button - Mobile Only */}
        <button
          onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
        >
          <span className="material-icons-round">close</span>
        </button>

        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-lg">
            <span className="material-icons-round text-[#0f392b] text-2xl">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-tight">
              Farm<span className="text-gray-300 font-normal">Lease</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">
              Admin Console
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              href={`/admin/${item.route}`}
              className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.route)
                  ? 'bg-white/10 text-primary'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-icons-round text-xl">{item.icon}</span>
              <span className={`flex-1 text-sm ${
                  isActive(item.route)
                    ? 'font-bold'
                    : 'font-medium'
                }`}>
                {item.label}
              </span>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${
                    item.badgeColor === 'red' ? 'bg-red-500/80' : 'bg-[#5D4037]'
                  }`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom Section - Profile & Logout */}
      <div className="px-6 pb-6 space-y-4 border-t border-white/10 mt-auto">
        {/* Admin Profile - Clickable */}
        <button 
          onClick={handleProfileClick}
          className="bg-black/20 rounded-xl p-3 flex items-center gap-3 w-full hover:bg-black/30 transition-colors"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7ZvmzxVv274-pe6FUZP8OHwCRgvrDzdEbABqYgGD3L2tZOE3EEZiEp_yonq1ctrQNXjE9q4X76GFxHLqBi5-Ki-i3A2jd9RZs_2lH5WtHZgNDwN2iLUbkVFE2T3ZuhAMmG1D9fLHbgWSeHtj_xvnBFCMcio2tim33FEGeydQbDScGWL17IyW19HcGpydoFYNre_N-qBMdcfgMExDLg5LAlwAZx978N7hJgCi6dru1egRdHooOSxMCiJ4LIgPPgKcyMajv-IU2YzLW"
            alt="Admin"
            className="w-10 h-10 rounded-full border-2 border-primary/20 object-cover"
          />
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-white">David M.</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">
              Super Admin
            </p>
          </div>
        </button>

        {/* Divider */}
        <div className="h-px bg-white/10 w-full" />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-gray-300 hover:text-white transition-colors"
        >
          <span className="material-icons-round text-lg">logout</span>
          <span className="text-xs font-medium uppercase tracking-wide">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
