import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import AgreementsPageComponent from '../../src/pages/Farm-Owner/AgreementsPage';

export default function AgreementsPage() {
  return (
    <ProtectedRoute allowedRoles={['landowner']}>
      <AgreementsPageComponent />
    </ProtectedRoute>
  );
}
