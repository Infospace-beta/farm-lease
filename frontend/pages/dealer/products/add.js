import ProtectedRoute from '../../../src/components/common/ProtectedRoute';
import AddProductPageComponent from '../../../src/pages/Agro-Dealer/AddProductPage';

export default function AddProductPage() {
  return (
    <ProtectedRoute allowedRoles={['dealer']}>
      <AddProductPageComponent />
    </ProtectedRoute>
  );
}
