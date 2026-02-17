import DashboardLayout from "../../components/layout/DashboardLayout";
import Sidebar from "../../components/layout/Sidebar";
import Card from "../../components/common/Card";

const AdminDashboard = () => {
  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { label: "Pending Lands", path: "/admin/lands/pending", icon: "⏳" },
    { label: "All Users", path: "/admin/users", icon: "👥" },
    { label: "Reports", path: "/admin/reports", icon: "⚠️" },
    { label: "Revenue", path: "/admin/revenue", icon: "💰" },
    { label: "Settings", path: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <DashboardLayout sidebar={<Sidebar menuItems={menuItems} />}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Admin Dashboard
        </h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600">150</div>
              <div className="text-gray-600 mt-2">Total Users</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">8</div>
              <div className="text-gray-600 mt-2">Pending Verifications</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">45</div>
              <div className="text-gray-600 mt-2">Active Leases</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">KES 2.5M</div>
              <div className="text-gray-600 mt-2">Platform Revenue</div>
            </div>
          </Card>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
            <p className="text-gray-600">No recent activities.</p>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Pending Actions</h2>
            <p className="text-gray-600">8 lands awaiting verification</p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
