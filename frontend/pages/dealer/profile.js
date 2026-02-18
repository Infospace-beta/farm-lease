import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import ProfilePageComponent from '../../src/pages/Agro-Dealer/ProfilePage';

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['dealer']}>
      <ProfilePageComponent />
    </ProtectedRoute>
  );
}
