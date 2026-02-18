import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import LesseeNotificationsComponent from '../../src/pages/Lessee/LesseeNotifications';

export default function LesseeNotifications() {
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <LesseeNotificationsComponent />
    </ProtectedRoute>
  );
}
