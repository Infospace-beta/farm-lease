import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import LesseeMyLeasesComponent from '../../src/pages/Lessee/LesseeMyLeases';

export default function LesseeMyLeases() {
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <LesseeMyLeasesComponent />
    </ProtectedRoute>
  );
}
