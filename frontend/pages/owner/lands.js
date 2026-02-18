import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import MyLandsPageComponent from '../../src/pages/Farm-Owner/MyLandsPage';

export default function MyLandsPage() {
  return (
    <ProtectedRoute allowedRoles={['landowner']}>
      <MyLandsPageComponent />
    </ProtectedRoute>
  );
}
