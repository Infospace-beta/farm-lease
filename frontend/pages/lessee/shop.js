import ProtectedRoute from '../../src/components/common/ProtectedRoute';
import AgroDealerShopComponent from '../../src/pages/Lessee/AgroDealerShop';

export default function AgroDealerShop() {
  return (
    <ProtectedRoute allowedRoles={['farmer']}>
      <AgroDealerShopComponent />
    </ProtectedRoute>
  );
}
