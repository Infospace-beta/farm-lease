import DashboardLayout from '../../components/layout/DashboardLayout';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const PendingLandsPage = () => {
  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { label: 'Pending Lands', path: '/admin/lands/pending', icon: '⏳' },
    { label: 'All Users', path: '/admin/users', icon: '👥' },
    { label: 'Reports', path: '/admin/reports', icon: '⚠️' },
    { label: 'Revenue', path: '/admin/revenue', icon: '💰' },
    { label: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  return (
    <DashboardLayout sidebar={<Sidebar menuItems={menuItems} />}>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pending Land Verifications</h1>

        <Card>
          <div className="space-y-4">
            <p className="text-gray-600 text-center py-8">
              No pending land verifications at the moment.
            </p>
            {/* TODO: Implement pending lands list with verification interface */}
            {/* Each item should have: */}
            {/* - Land details */}
            {/* - Document viewer */}
            {/* - Approve/Reject buttons */}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PendingLandsPage;
