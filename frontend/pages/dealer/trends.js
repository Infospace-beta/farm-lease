import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import MarketTrendsPageComponent from '../../src/pages/Agro-Dealer/MarketTrendsPage';

export default function MarketTrendsPage() {
  return (
    <ProtectedRoute allowedRoles={['dealer']}>
      <MarketTrendsPageComponent />
    </ProtectedRoute>
  );
}
