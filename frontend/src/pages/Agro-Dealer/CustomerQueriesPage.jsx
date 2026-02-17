import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const CustomerQueriesPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('queries');
  const [selectedConversation, setSelectedConversation] = useState('grace');
  const [filterTab, setFilterTab] = useState('all');
  const [messageInput, setMessageInput] = useState('');

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

  const conversations = [
    {
      id: 'grace',
      name: 'Grace N.',
      subject: 'Re: DAP Fertilizer - 50kg inquiry',
      message: 'Is the 50kg DAP fertilizer available for bulk order? I need about 20 bags for my maize field.',
      time: '10m ago',
      status: 'Awaiting Response',
      statusColor: 'bg-amber-800 text-white',
      isOnline: true,
      isActive: true,
      isUnread: true,
      isPending: true,
      isOrder: false
    },
    {
      id: 'samuel',
      name: 'Samuel K.',
      subject: 'Re: Fall Armyworm Pesticides',
      message: 'Do you have pesticides for fall armyworm in stock? My crop is under attack.',
      time: '1h ago',
      status: 'Inquiry',
      statusColor: 'bg-gray-100 text-gray-500',
      isOnline: false,
      isActive: false,
      isUnread: true,
      isPending: false,
      isOrder: false
    },
    {
      id: 'farmcorp',
      name: 'FarmCorp Ltd.',
      subject: 'Re: Solar Pump Quotation',
      message: 'Requesting quotation for solar water pump installation kit for 5 acres.',
      time: '3h ago',
      status: 'Quote Sent',
      statusColor: 'bg-emerald-100 text-emerald-700',
      isOnline: false,
      isActive: false,
      isUnread: false,
      isPending: false,
      isOrder: false
    },
    {
      id: 'john',
      name: 'John D.',
      subject: 'Order #4492 Status',
      message: 'Thanks for the delivery. The seeds arrived in good condition.',
      time: 'Yesterday',
      status: 'Resolved',
      statusColor: 'bg-green-100 text-green-700',
      isOnline: false,
      isActive: false,
      isResolved: true,
      isUnread: false,
      isPending: false,
      isOrder: true
    },
    {
      id: 'mary',
      name: 'Mary W.',
      subject: 'Re: Animal Feeds',
      message: 'When will you restock the dairy meal premium sacks?',
      time: '2d ago',
      status: null,
      isOnline: false,
      isActive: false,
      isUnread: true,
      isPending: false,
      isOrder: false
    },
    {
      id: 'peter',
      name: 'Peter K.',
      subject: 'Order #4488 Delivery',
      message: 'My order was supposed to arrive yesterday. Can you check the status?',
      time: '3d ago',
      status: 'Awaiting Response',
      statusColor: 'bg-amber-800 text-white',
      isOnline: false,
      isActive: false,
      isUnread: true,
      isPending: true,
      isOrder: true
    },
    {
      id: 'alice',
      name: 'Alice M.',
      subject: 'Order #4475 Received',
      message: 'Order received in good condition. Thank you!',
      time: '1 week ago',
      status: 'Resolved',
      statusColor: 'bg-green-100 text-green-700',
      isOnline: false,
      isActive: false,
      isResolved: true,
      isUnread: false,
      isPending: false,
      isOrder: true
    },
  ];

  // Filter conversations based on active tab
  const filteredConversations = conversations.filter(conv => {
    switch (filterTab) {
      case 'unread':
        return conv.isUnread;
      case 'orders':
        return conv.isOrder;
      case 'pending':
        return conv.isPending;
      case 'all':
      default:
        return true;
    }
  });

  // Get counts for each filter
  const filterCounts = {
    all: conversations.length,
    unread: conversations.filter(c => c.isUnread).length,
    orders: conversations.filter(c => c.isOrder).length,
    pending: conversations.filter(c => c.isPending).length
  };

  const quickReplies = [
    'Yes, it\'s available.',
    'We offer bulk discounts.',
    'When do you need it delivered?',
    'Send Invoice'
  ];

  const currentCustomer = {
    name: 'Grace N.',
    initials: 'G',
    role: 'Farmer',
    location: 'Nakuru Region',
    memberSince: 'Jan 2023',
    isVerified: true,
    details: {
      location: 'Nakuru, KE',
      totalOrders: 14,
      totalSpent: 45200,
      lastOrder: '2 weeks ago'
    },
    recentOrders: [
      {
        id: '#ORD-4921',
        items: '2x Hybrid Maize Seeds',
        amount: 4000,
        status: 'Delivered'
      },
      {
        id: '#ORD-3810',
        items: '1x Drip Irrigation Kit',
        amount: 15000,
        status: 'Delivered'
      }
    ]
  };

  const productContext = {
    name: 'DAP Fertilizer - 50kg',
    price: 3500,
    stock: 124,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBP-azLMzvokNkzokvWwtDAMPaAzyqBM1e4HpllgEiLWPsF9SPXz4jh_U35KfhmqaGC8c3RElRiVy4ruiAFJRb3kn0Q0YwmY9Oc8VS7dR-6ciuLVHdCYBzxFZlCAsxDTJmg9mAME5jUZLwj6cfCIhhejjUsyY7Ik76-uKbtoTG7eqLmi_Khdr7lOo2kAi7i7AmsyEdM8GQR-xhG1ZYsDnXcL3vE2JMgBk8oxw9QpcMiCDeKPGmXtb4pm9CJJAfEQ1Wf1VfDu_hI-tt'
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
      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {/* Header */}
        <div className="h-20 border-b border-gray-100 bg-white flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Customer Queries</h2>
            <p className="text-gray-500 text-xs">Manage farmer inquiries and product questions.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search conversations..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none w-64"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-emerald-700 transition bg-gray-50 rounded-lg border border-gray-200">
              ⚙️
            </button>
            <button className="flex px-4 py-2 bg-emerald-700 text-white rounded-lg items-center gap-2 hover:bg-emerald-800 transition shadow-lg">
              <span>➕</span>
              <span className="font-medium text-sm">New Message</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Conversations List */}
          <div className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-100 flex flex-col h-full shrink-0">
            <div className="p-4 border-b border-gray-100">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                    filterTab === 'all'
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>All</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    filterTab === 'all' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {filterCounts.all}
                  </span>
                </button>
                <button
                  onClick={() => setFilterTab('unread')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                    filterTab === 'unread'
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>Unread</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    filterTab === 'unread' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {filterCounts.unread}
                  </span>
                </button>
                <button
                  onClick={() => setFilterTab('orders')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                    filterTab === 'orders'
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>Orders</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    filterTab === 'orders' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {filterCounts.orders}
                  </span>
                </button>
                <button
                  onClick={() => setFilterTab('pending')}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                    filterTab === 'pending'
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>Pending</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    filterTab === 'pending' ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {filterCounts.pending}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer relative ${
                    selectedConversation === conv.id
                      ? 'bg-emerald-50/50 border-l-4 border-l-emerald-700'
                      : conv.isResolved
                      ? 'bg-gray-50/50'
                      : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${selectedConversation === conv.id ? 'text-gray-800' : 'text-gray-600'}`}>
                        {conv.name}
                      </h4>
                      {conv.isOnline && (
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">{conv.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-1">{conv.subject}</p>
                  <p className={`text-xs line-clamp-2 mb-2 ${selectedConversation === conv.id ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                    {conv.message}
                  </p>
                  {conv.status && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${conv.statusColor}`}>
                        {conv.status}
                      </span>
                    </div>
                  )}
                </div>
              ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-400 text-sm">No conversations found for this filter.</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-50 relative">
            {/* Chat Header */}
            <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                  {currentCustomer.initials}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    {currentCustomer.name}
                    {currentCustomer.isVerified && (
                      <span className="text-emerald-700 text-sm" title="Verified Buyer">✓</span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {currentCustomer.role} • {currentCustomer.location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link to="/dealer/orders" className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                  <span>🛒</span>
                  View Orders
                </Link>
                <button className="p-2 text-gray-400 hover:text-amber-800 rounded-full hover:bg-amber-800/10 transition">
                  <span className="text-lg">⋮</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Date Separator */}
              <div className="flex justify-center">
                <span className="text-[10px] uppercase tracking-wide text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  Today
                </span>
              </div>

              {/* Product Context Card */}
              <div className="mx-auto max-w-md bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-lg shrink-0 overflow-hidden border border-gray-100">
                  <img
                    src={productContext.image}
                    alt="Product"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">
                    Inquiry About
                  </p>
                  <h4 className="text-xs font-bold text-gray-800 truncate">{productContext.name}</h4>
                  <p className="text-[10px] text-emerald-700 font-bold">
                    Ksh {productContext.price.toLocaleString()}{' '}
                    <span className="text-gray-400 font-normal">• {productContext.stock} in stock</span>
                  </p>
                </div>
                <a href="#" className="text-xs text-emerald-700 font-medium hover:underline">
                  View Item
                </a>
              </div>

              {/* Customer Message */}
              <div className="flex items-end gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {currentCustomer.initials}
                </div>
                <div className="max-w-[80%]">
                  <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-100 text-sm text-gray-700 leading-relaxed">
                    <p>
                      Hello, I hope you are well. Is the 50kg DAP fertilizer available for bulk order? I
                      need about 20 bags for my maize field.
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block ml-1">10:42 AM</span>
                </div>
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-100 p-4 shrink-0">
              {/* Quick Replies */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => setMessageInput(reply)}
                    className="shrink-0 text-xs bg-gray-50 hover:bg-emerald-50 text-gray-600 hover:text-emerald-700 border border-gray-200 hover:border-emerald-200 px-3 py-1.5 rounded-full transition"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="relative">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pr-12 focus:ring-2 focus:ring-emerald-500 focus:border-transparent focus:bg-white transition resize-none text-sm outline-none"
                  placeholder="Type your reply..."
                  rows="3"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button className="text-gray-400 hover:text-amber-800 transition p-1">
                    <span className="text-xl">📎</span>
                  </button>
                  <button className="text-gray-400 hover:text-amber-800 transition p-1">
                    <span className="text-xl">🖼️</span>
                  </button>
                  <button className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg p-2 transition shadow-md flex items-center justify-center">
                    <span className="text-lg">📤</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Sidebar */}
          <div className="hidden xl:flex w-80 bg-white border-l border-gray-100 flex-col overflow-y-auto p-6 shrink-0">
            {/* Customer Profile */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 text-2xl font-bold mx-auto mb-3">
                {currentCustomer.initials}
              </div>
              <h3 className="text-lg font-bold text-gray-800">{currentCustomer.name}</h3>
              <p className="text-xs text-gray-500 mb-2">Member since {currentCustomer.memberSince}</p>
              <div className="flex justify-center gap-2">
                <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-emerald-700 hover:text-white transition">
                  <span className="text-sm">📞</span>
                </button>
                <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-emerald-700 hover:text-white transition">
                  <span className="text-sm">✉️</span>
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="border-t border-gray-100 pt-6 mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                Customer Details
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium text-gray-800">{currentCustomer.details.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Orders</span>
                  <span className="font-medium text-gray-800">{currentCustomer.details.totalOrders}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Spent</span>
                  <span className="font-medium text-gray-800">
                    Ksh {currentCustomer.details.totalSpent.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Order</span>
                  <span className="font-medium text-gray-800">{currentCustomer.details.lastOrder}</span>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Recent Orders
                </h4>
                <a href="#" className="text-[10px] text-emerald-700 font-bold hover:underline">
                  View All
                </a>
              </div>
              <div className="space-y-3">
                {currentCustomer.recentOrders.map((order) => (
                  <div key={order.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-gray-800">{order.id}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-100 text-green-700 font-bold">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{order.items}</p>
                    <p className="text-xs text-amber-800 font-bold">Ksh {order.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Block Customer Button */}
            <div className="mt-auto pt-6">
              <button className="w-full py-2 bg-white border border-red-200 text-red-500 text-xs font-bold rounded-lg hover:bg-red-50 transition">
                Block Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerQueriesPage;
