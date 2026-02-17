import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';

const Sidebar = ({ menuItems, isMobile, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="w-64 bg-black shadow-lg h-screen sticky top-0 flex flex-col">
      {/* User Info */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <p className="font-medium text-white">{user?.name || 'User'}</p>
              <p className="text-sm text-gray-400">{user?.role}</p>
            </div>
          </div>
          {/* Close button for mobile */}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="md:hidden text-white hover:bg-gray-700 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-200 transform
                    ${isActive 
                      ? 'bg-primary-600 text-white font-medium shadow-lg shadow-gray-500/50 scale-105' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white hover:scale-105 hover:shadow-lg hover:shadow-gray-500/40 hover:pl-5'
                    }
                  `}
                >
                  {item.icon && <span className="text-xl">{item.icon}</span>}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full px-4 py-2 text-red-400 hover:bg-red-900 hover:text-red-300 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
