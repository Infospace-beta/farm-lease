import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import NotificationsPageComponent from '../../src/pages/Agro-Dealer/NotificationsPage';

export default function NotificationsPage() {
  return (
    <ProtectedRoute allowedRoles={['dealer']}>
      <NotificationsPageComponent />
    </ProtectedRoute>
  );
}
