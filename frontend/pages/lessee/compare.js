import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import CompareFarmAssetsComponent from '../../src/pages/Lessee/CompareFarmAssets';

export default function CompareFarmAssets() {
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <CompareFarmAssetsComponent />
    </ProtectedRoute>
  );
}
