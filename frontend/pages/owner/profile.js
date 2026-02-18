import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import ProfileSettingsPageComponent from '../../src/pages/Farm-Owner/ProfileSettingsPage';

export default function ProfileSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={['landowner']}>
      <ProfileSettingsPageComponent />
    </ProtectedRoute>
  );
}
