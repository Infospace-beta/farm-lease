import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('notifications');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dealer/dashboard' },
    { id: 'inventory', label: 'Inventory', icon: '📦', path: '/dealer/inventory' },
    { id: 'orders', label: 'Orders', icon: '🛒', badge: 5, path: '/dealer/orders' },
    { id: 'products', label: 'My Products', icon: '📋', path: '/dealer/products' },
    { id: 'add-product', label: 'Add New Products', icon: '➕', path: '/dealer/products/add' },
    { id: 'queries', label: 'Customer Queries', icon: '💬', path: '/dealer/queries' },
    { id: 'transactions', label: 'Transactions', icon: '💳', path: '/dealer/transactions' },
    { id: 'analytics', label: 'Sales Analytics', icon: '📈', path: '/dealer/analytics' },
    { id: 'trends', label: 'Market Trends', icon: '📉', path: '/dealer/trends' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/dealer/notifications' },
  ];

  const todayNotifications = [
    {
      id: 1,
      type: 'warning',
      icon: '⚠️',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      title: 'Low Stock Alert: Hybrid Maize Seeds',
      description: 'Stock levels for Hybrid Maize Seeds (10kg) have dropped below the threshold of 15 units. Current stock: 12 units.',
      time: '2 hrs ago',
      isUnread: true,
      actions: [
        { label: 'Restock Now', style: 'primary' },
        { label: 'Dismiss', style: 'text' }
      ]
    },
    {
      id: 2,
      type: 'success',
      icon: '✓',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
      title: 'Order #4492 Completed',
      description: 'Successfully delivered 20 bags of DAP Fertilizer to FarmCorp Ltd. Payment has been processed.',
      time: '4 hrs ago',
      isUnread: true,
      actions: [
        { label: 'View Receipt', style: 'secondary' }
      ]
    },
    {
      id: 3,
      type: 'info',
      icon: 'ℹ️',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-800',
      title: 'Platform Maintenance Scheduled',
      description: 'The FarmLease dealer portal will undergo scheduled maintenance on Saturday, 24th Aug from 2:00 AM to 4:00 AM EAT.',
      time: '5 hrs ago',
      isUnread: true,
      actions: []
    }
  ];

  const yesterdayNotifications = [
    {
      id: 4,
      type: 'dispute',
      icon: '⚖️',
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-800',
      title: 'New Dispute Report: Order #4480',
      description: 'Customer claims "Incorrect product delivered". Review the order details and provide feedback within 24 hours.',
      time: 'Yesterday, 4:30 PM',
      isUnread: false,
      actions: [
        { label: 'Resolve Dispute', style: 'warning' },
        { label: 'Contact Buyer', style: 'text' }
      ]
    },
    {
      id: 5,
      type: 'inventory',
      icon: '📦',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
      title: 'New Inventory Added',
      description: 'Successfully added 50 units of Solar Water Pump Kit to your catalog.',
      time: 'Yesterday, 10:15 AM',
      isUnread: false,
      actions: []
    }
  ];

  const olderNotifications = [
    {
      id: 6,
      type: 'payment',
      icon: '💰',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
      title: 'Direct Payment Received',
      description: 'Ksh 4,500 received via M-Pesa for Order #4495.',
      time: 'Mon, 14 Aug',
      isUnread: false,
      actions: []
    }
  ];

  const handleMarkAllAsRead = () => {
    console.log('Marking all as read');
  };

  const getActionButtonStyles = (style) => {
    switch (style) {
      case 'primary':
        return 'text-xs font-bold text-white bg-emerald-700 px-4 py-2 rounded-lg hover:bg-emerald-800 transition shadow-sm';
      case 'secondary':
        return 'text-xs font-bold text-emerald-700 border border-emerald-200 bg-emerald-50/50 px-4 py-2 rounded-lg hover:bg-emerald-50 transition';
      case 'warning':
        return 'text-xs font-bold text-white bg-amber-800 px-4 py-2 rounded-lg hover:bg-amber-900 transition shadow-sm';
      case 'text':
        return 'text-xs font-bold text-gray-500 hover:text-gray-700 px-2 py-2';
      default:
        return 'text-xs font-bold text-gray-500 hover:text-gray-700 px-2 py-2';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-emerald-900 to-emerald-950 text-white p-6 flex flex-col shadow-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-emerald-100">FarmLease</h1>
          <p className="text-emerald-300 text-sm">Agro-Dealer Hub</p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-emerald-700 text-white shadow-lg'
                  : 'text-emerald-200 hover:bg-emerald-800/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium text-sm">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-emerald-700">
          <Link
            to="/dealer/profile"
            className="flex items-center gap-3 cursor-pointer hover:bg-emerald-800/50 rounded-xl p-3 transition-colors"
          >
            <img
              src="https://ui-avatars.com/api/?name=David+M&background=10b981&color=fff"
              alt="User"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-medium text-sm text-emerald-100">David M.</p>
              <p className="text-xs text-emerald-300">Store Manager</p>
            </div>
          </Link>
          <button className="mt-3 w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 overflow-hidden">
        <div className="h-full overflow-y-auto p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-1">Notifications</h2>
                <p className="text-gray-500 text-sm max-w-xl">
                  Manage your store alerts, order updates, and system messages.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-emerald-700 font-bold hover:underline"
                >
                  Mark all as read
                </button>
                <div className="h-6 w-px bg-gray-200"></div>
                <button className="flex px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 transition shadow-sm">
                  <span className="text-lg">⚙️</span>
                  <span className="font-medium text-sm">Filter</span>
                </button>
              </div>
            </div>

            {/* Today Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-800 tracking-wide">Today</h3>
                <span className="text-xs bg-white border border-gray-200 text-gray-500 px-2 py-1 rounded-md">
                  3 New
                </span>
              </div>

              {todayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row gap-4 relative"
                >
                  <div className={`w-12 h-12 rounded-full ${notification.iconBg} flex items-center justify-center shrink-0`}>
                    <span className="text-xl">{notification.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800 text-base">{notification.title}</h4>
                      <span className="text-xs text-gray-400">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 mb-3">{notification.description}</p>
                    {notification.actions.length > 0 && (
                      <div className="flex gap-3">
                        {notification.actions.map((action, index) => (
                          <button key={index} className={getActionButtonStyles(action.style)}>
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {notification.isUnread && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-700"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Yesterday Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-gray-800 tracking-wide">Yesterday</h3>

              {yesterdayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row gap-4 opacity-75 hover:opacity-100"
                >
                  <div className={`w-12 h-12 rounded-full ${notification.iconBg} flex items-center justify-center shrink-0`}>
                    <span className="text-xl">{notification.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800 text-base">{notification.title}</h4>
                      <span className="text-xs text-gray-400">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 mb-3">{notification.description}</p>
                    {notification.actions.length > 0 && (
                      <div className="flex gap-3">
                        {notification.actions.map((action, index) => (
                          <button key={index} className={getActionButtonStyles(action.style)}>
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Earlier This Week Section */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-gray-800 tracking-wide">Earlier This Week</h3>

              {olderNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all group flex flex-col sm:flex-row gap-4 opacity-60 hover:opacity-100"
                >
                  <div className={`w-12 h-12 rounded-full ${notification.iconBg} flex items-center justify-center shrink-0`}>
                    <span className="text-xl">{notification.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800 text-base">{notification.title}</h4>
                      <span className="text-xs text-gray-400">{notification.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 mb-2">{notification.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="flex justify-center pt-8 pb-4">
              <button className="text-sm font-medium text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-colors">
                Load older notifications
                <span className="text-base">▼</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
