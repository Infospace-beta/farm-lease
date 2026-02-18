import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import FindLandPageComponent from '../../src/pages/Lessee/FindLandPage';

export default function FindLandPage() {
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <FindLandPageComponent />
    </ProtectedRoute>
  );
}
