import ProtectedRoute from '../../../src/components/common/ProtectedRoute';
import LandDetailPageComponent from '../../../src/pages/Lessee/LandDetailPage';

export default function LandDetailPage() {
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <LandDetailPageComponent />
    </ProtectedRoute>
  );
}
