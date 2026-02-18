import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import LesseeFinancialsComponent from '../../src/pages/Lessee/LesseeFinancials';

export default function LesseeFinancials() {
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <LesseeFinancialsComponent />
    </ProtectedRoute>
  );
}
