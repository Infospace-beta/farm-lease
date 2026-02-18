import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import FinancialsPageComponent from '../../src/pages/Farm-Owner/FinancialsPage';

export default function FinancialsPage() {
  return (
    <ProtectedRoute allowedRoles={['landowner']}>
      <FinancialsPageComponent />
    </ProtectedRoute>
  );
}
