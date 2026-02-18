import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import DealerDashboardComponent from '../../src/pages/Agro-Dealer/DealerDashboard';

export default function DealerDashboard() {
  return (
    <ProtectedRoute allowedRoles={['dealer']}>
      <DealerDashboardComponent />
    </ProtectedRoute>
  );
}
