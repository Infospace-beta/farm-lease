import DashboardLayout from '../../components/layout/DashboardLayout';
import Sidebar from '../../components/layout/Sidebar';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';

const UsersListPage = () => {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Users</h1>

        {/* Search Bar */}
        <Card className="mb-6">
          <Input
            placeholder="Search users by name, email, or role..."
          />
        </Card>

        {/* Users Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-600">
                    No users found.
                  </td>
                </tr>
                {/* TODO: Implement user rows with manage actions */}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UsersListPage;
