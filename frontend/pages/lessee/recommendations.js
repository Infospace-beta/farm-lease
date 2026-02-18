import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import AIPredictorComponent from '../../src/pages/Lessee/AIPredictor';

export default function AIPredictor() {
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <AIPredictorComponent />
    </ProtectedRoute>
  );
}
