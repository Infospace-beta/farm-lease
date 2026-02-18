import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import AdminDashboardComponent from '../../src/pages/admin/AdminDashboard';

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboardComponent />
    </ProtectedRoute>
  );
}
