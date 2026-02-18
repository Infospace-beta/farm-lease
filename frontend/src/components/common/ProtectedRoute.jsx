import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, allowedRoles = [], requireAdmin = false }) => {
  // Development mode bypass - allow all access
  const isDev = false; // Set to false when backend is ready
  
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (isDev || loading) return;

    // Redirect to login if not authenticated
    if (!user) {
      router.replace('/login');
      return;
    }

    // If admin access is required, check is_staff flag
    if (requireAdmin && !user.is_staff) {
      const dashboardRoutes = {
        landowner: '/owner/dashboard',
        farmer: '/lessee/dashboard',
        dealer: '/dealer/dashboard',
        admin: '/admin/dashboard',
      };
      router.replace(dashboardRoutes[user.role] || '/');
      return;
    }

    // Check role authorization (admins can access all roles)
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role) && !user.is_staff) {
      const dashboardRoutes = {
        landowner: '/owner/dashboard',
        farmer: '/lessee/dashboard',
        dealer: '/dealer/dashboard',
        admin: '/admin/dashboard',
      };
      router.replace(dashboardRoutes[user.role] || '/');
    }
  }, [user, loading, router, allowedRoles, requireAdmin, isDev]);
  
  if (isDev) {
    return children;
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Only render children if authenticated and authorized
  if (!user) return null;

  if (requireAdmin && !user.is_staff) return null;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role) && !user.is_staff) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
