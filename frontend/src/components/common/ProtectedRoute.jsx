import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, allowedRoles = [], requireAdmin = false }) => {
  // Development mode bypass - allow all access
  const isDev = true; // Set to false when backend is ready
  
  if (isDev) {
    return children;
  }

  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If admin access is required, check is_staff flag
  if (requireAdmin && !user.is_staff) {
    // Redirect to appropriate dashboard based on user role
    const dashboardRoutes = {
      landowner: '/owner/dashboard',
      farmer: '/lessee/dashboard',
      dealer: '/dealer/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={dashboardRoutes[user.role] || '/'} replace />;
  }

  // Check role authorization (admins can access all roles)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role) && !user.is_staff) {
    // Redirect to appropriate dashboard based on user role
    const dashboardRoutes = {
      landowner: '/owner/dashboard',
      farmer: '/lessee/dashboard',
      dealer: '/dealer/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={dashboardRoutes[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
