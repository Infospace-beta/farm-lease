import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import SalesAnalyticsPageComponent from '../../src/pages/Agro-Dealer/SalesAnalyticsPage';

export default function SalesAnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['dealer']}>
      <SalesAnalyticsPageComponent />
    </ProtectedRoute>
  );
}
