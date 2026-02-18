import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import LesseeDashboardComponent from '../../src/pages/Lessee/LesseeDashboard';

export default function LesseeDashboard() {
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <LesseeDashboardComponent />
    </ProtectedRoute>
  );
}
