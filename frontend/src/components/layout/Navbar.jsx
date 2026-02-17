import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const { isAuthenticated, user, logout, isStaff } = useAuth();

  // Format role for display
  const getRoleDisplay = (role, isAdmin) => {
    if (isAdmin) return 'Admin';
    switch (role) {
      case 'OWNER':
        return 'Farm Owner';
      case 'LESSEE':
        return 'Farmer/Lessee';
      case 'DEALER':
        return 'Agro-Dealer';
      default:
        return role;
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600">🚜</span>
              <span className="text-xl font-bold text-gray-900">FarmLease</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex flex-col items-end">
                  <span className="text-gray-700">
                    Welcome, <span className="font-medium">{user?.username || user?.email}</span>
                  </span>
                  <span className="text-xs text-gray-500">
                    {getRoleDisplay(user?.role, isStaff)}
                  </span>
                </div>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
