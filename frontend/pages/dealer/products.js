import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import MyProductsPageComponent from '../../src/pages/Agro-Dealer/MyProductsPage';

export default function MyProductsPage() {
  return (
    <ProtectedRoute allowedRoles={['dealer']}>
      <MyProductsPageComponent />
    </ProtectedRoute>
  );
}
