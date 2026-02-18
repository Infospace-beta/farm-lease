import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import OwnerDashboardComponent from '../../src/pages/Farm-Owner/FarmOwnerDashboard';

export default function OwnerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['landowner']}>
      <OwnerDashboardComponent />
    </ProtectedRoute>
  );
}
