import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import LeaseRequestsPageComponent from '../../src/pages/Farm-Owner/LeaseRequestsPageWeb';

export default function LeaseRequestsPage() {
  return (
    <ProtectedRoute allowedRoles={['landowner']}>
      <LeaseRequestsPageComponent />
    </ProtectedRoute>
  );
}
