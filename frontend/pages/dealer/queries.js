import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import CustomerQueriesPageComponent from '../../src/pages/Agro-Dealer/CustomerQueriesPage';

export default function CustomerQueriesPage() {
  return (
    <ProtectedRoute allowedRoles={['dealer']}>
      <CustomerQueriesPageComponent />
    </ProtectedRoute>
  );
}
