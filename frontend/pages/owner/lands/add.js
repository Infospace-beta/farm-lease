import ProtectedRoute from '../../../src/components/common/ProtectedRoute';
import AddLandPageComponent from '../../../src/pages/Farm-Owner/AddLandPage';

export default function AddLandPage() {
  return (
    <ProtectedRoute allowedRoles={['landowner']}>
      <AddLandPageComponent />
    </ProtectedRoute>
  );
}
