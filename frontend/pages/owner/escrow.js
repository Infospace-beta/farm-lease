import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import EscrowStatusPageComponent from '../../src/pages/Farm-Owner/EscrowStatusPage';

export default function EscrowStatusPage() {
  return (
    <ProtectedRoute allowedRoles={['landowner']}>
      <EscrowStatusPageComponent />
    </ProtectedRoute>
  );
}
