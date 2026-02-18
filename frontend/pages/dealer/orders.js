import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import OrdersPageComponent from '../../src/pages/Agro-Dealer/OrdersPage';

export default function OrdersPage() {
  return (
    <ProtectedRoute allowedRoles={['dealer']}>
      <OrdersPageComponent />
    </ProtectedRoute>
  );
}
