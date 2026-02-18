import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import InventoryPageComponent from '../../src/pages/Agro-Dealer/InventoryPage';

export default function InventoryPage() {
  return (
    <ProtectedRoute allowedRoles={['dealer']}>
      <InventoryPageComponent />
    </ProtectedRoute>
  );
}
