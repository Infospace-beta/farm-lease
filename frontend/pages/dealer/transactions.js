import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import TransactionsPageComponent from '../../src/pages/Agro-Dealer/TransactionsPage';

export default function TransactionsPage() {
  return (
    <ProtectedRoute allowedRoles={['dealer']}>
      <TransactionsPageComponent />
    </ProtectedRoute>
  );
}
