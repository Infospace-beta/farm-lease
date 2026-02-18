import ProtectedRoute from '../../../src/components/common/ProtectedRoute';
import AIPredictorHistoryComponent from '../../../src/pages/Lessee/AIPredictorHistory';

export default function AIPredictorHistory() {
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <AIPredictorHistoryComponent />
    </ProtectedRoute>
  );
}
