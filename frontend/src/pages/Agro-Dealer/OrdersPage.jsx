import { useState } from 'react';
import { useRouter } from 'next/router';
import { Search, Settings, Download, Truck, Store, Clipboard, X, MessageSquare, MapPin, Package, Check } from 'lucide-react';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import DealerSidebar from '../../components/layout/DealerSidebar';
import DealerHeader from '../../components/layout/DealerHeader';

const OrdersPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [orderFilter, setOrderFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    {
      id: '#ORD-2489',
      customer: { name: 'Grace N.', initials: 'GN', color: 'orange' },
      type: 'Delivery',
      amount: 72500,
      status: 'Pending',
      date: 'Oct 24, 2023',
      time: '10:45 AM',
      phone: '+254 712 345 678',
      address: 'Green Valley Farm, Plot 45B, Nakuru County',
      items: [
        { name: 'DAP Fertilizer - 50kg', qty: 20, price: 3500, total: 70000, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBP-azLMzvokNkzokvWwtDAMPaAzyqBM1e4HpllgEiLWPsF9SPXz4jh_U35KfhmqaGC8c3RElRiVy4ruiAFJRb3kn0Q0YwmY9Oc8VS7dR-6ciuLVHdCYBzxFZlCAsxDTJmg9mAME5jUZLwj6cfCIhhejjUsyY7Ik76-uKbtoTG7eqLmi_Khdr7lOo2kAi7i7AmsyEdM8GQR-xhG1ZYsDnXcL3vE2JMgBk8oxw9QpcMiCDeKPGmXtb4pm9CJJAfEQ1Wf1VfDu_hI-tt' },
        { name: 'Delivery Fee', qty: 1, price: 2500, total: 2500, icon: '🚚' }
      ]
    },
    {
      id: '#ORD-2488',
      customer: { name: 'Samuel K.', initials: 'SK', color: 'blue' },
      type: 'Pick-up',
      amount: 3500,
      status: 'Ready',
      date: 'Oct 24, 2023',
      time: '09:30 AM',
      phone: '+254 723 456 789',
      address: 'Store Pick-up',
      items: [
        { name: 'Tomato Seeds F1 Hybrid', qty: 1, price: 3500, total: 3500 }
      ]
    },
    {
      id: '#ORD-2487',
      customer: { name: 'FarmCorp Ltd.', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBP-azLMzvokNkzokvWwtDAMPaAzyqBM1e4HpllgEiLWPsF9SPXz4jh_U35KfhmqaGC8c3RElRiVy4ruiAFJRb3kn0Q0YwmY9Oc8VS7dR-6ciuLVHdCYBzxFZlCAsxDTJmg9mAME5jUZLwj6cfCIhhejjUsyY7Ik76-uKbtoTG7eqLmi_Khdr7lOo2kAi7i7AmsyEdM8GQR-xhG1ZYsDnXcL3vE2JMgBk8oxw9QpcMiCDeKPGmXtb4pm9CJJAfEQ1Wf1VfDu_hI-tt' },
      type: 'Delivery',
      amount: 145200,
      status: 'Dispatched',
      date: 'Oct 23, 2023',
      time: '08:15 AM',
      phone: '+254 734 567 890',
      address: 'Industrial Area, Nairobi',
      items: [
        { name: 'NPK 17-17-17 Fertilizer 50kg', qty: 50, price: 2850, total: 142500 },
        { name: 'Delivery Fee', qty: 1, price: 2700, total: 2700, icon: '🚚' }
      ]
    },
    {
      id: '#ORD-2486',
      customer: { name: 'John D.', initials: 'JD', color: 'purple' },
      type: 'Pick-up',
      amount: 12000,
      status: 'Collected',
      date: 'Oct 23, 2023',
      time: '02:20 PM',
      phone: '+254 745 678 901',
      address: 'Store Pick-up',
      items: [
        { name: 'Herbicide Roundup 1L', qty: 10, price: 1200, total: 12000 }
      ]
    },
    {
      id: '#ORD-2485',
      customer: { name: 'Mary W.', initials: 'MW', color: 'emerald' },
      type: 'Delivery',
      amount: 45600,
      status: 'Pending',
      date: 'Oct 22, 2023',
      time: '11:40 AM',
      phone: '+254 756 789 012',
      address: 'Kiambu Road, Plot 89A',
      items: [
        { name: 'Drip Irrigation Kit - 1 Acre', qty: 3, price: 12500, total: 37500 },
        { name: 'Delivery Fee', qty: 1, price: 8100, total: 8100, icon: '🚚' }
      ]
    },
  ];

  // Filter orders based on active filter
  const filteredOrders = orders.filter(order => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'delivery') return order.type === 'Delivery';
    if (orderFilter === 'pickup') return order.type === 'Pick-up';
    if (orderFilter === 'pending') return order.status === 'Pending';
    if (orderFilter === 'completed') return order.status === 'Collected' || order.status === 'Dispatched';
    return true;
  });

  const filterCounts = {
    all: orders.length,
    delivery: orders.filter(o => o.type === 'Delivery').length,
    pickup: orders.filter(o => o.type === 'Pick-up').length,
    pending: orders.filter(o => o.status === 'Pending').length,
    completed: orders.filter(o => o.status === 'Collected' || o.status === 'Dispatched').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Ready': return 'bg-green-100 text-green-700 border-green-200';
      case 'Dispatched': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Collected': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Pending': return 'bg-orange-500';
      case 'Ready': return 'bg-green-500';
      case 'Dispatched': return 'bg-blue-500';
      case 'Collected': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-background-light flex">
      <DealerSidebar />
      
      {/* Main Content */}
      <main className="flex-1 h-screen overflow-hidden">
        <DealerHeader 
          title="Orders"
          subtitle="Manage fulfillment and track order status"
        />
        
        <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
          {/* Orders List */}
          <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none w-64"
                    />
                  </div>
                  <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <Settings className="w-5 h-5 text-gray-400" />
                  </button>
                  <Button className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2">
                    <Download className="w-4 h-4" />
                    <span className="text-sm font-medium">Export</span>
                  </Button>
                </div>
              </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 pb-1">
              <button 
                onClick={() => setOrderFilter('all')}
                className={`px-4 py-2 text-sm font-medium ${orderFilter === 'all' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                All Orders
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${orderFilter === 'all' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {filterCounts.all}
                </span>
              </button>
              <button 
                onClick={() => setOrderFilter('delivery')}
                className={`px-4 py-2 text-sm font-medium ${orderFilter === 'delivery' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Delivery
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${orderFilter === 'delivery' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {filterCounts.delivery}
                </span>
              </button>
              <button 
                onClick={() => setOrderFilter('pickup')}
                className={`px-4 py-2 text-sm font-medium ${orderFilter === 'pickup' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Pick-up
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${orderFilter === 'pickup' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {filterCounts.pickup}
                </span>
              </button>
              <button 
                onClick={() => setOrderFilter('pending')}
                className={`px-4 py-2 text-sm font-medium ${orderFilter === 'pending' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Pending
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${orderFilter === 'pending' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {filterCounts.pending}
                </span>
              </button>
              <button 
                onClick={() => setOrderFilter('completed')}
                className={`px-4 py-2 text-sm font-medium ${orderFilter === 'completed' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Completed
                <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${orderFilter === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                  {filterCounts.completed}
                </span>
              </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4 font-semibold">Order ID</th>
                    <th className="px-6 py-4 font-semibold">Customer</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, index) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`hover:bg-emerald-50/30 transition-colors cursor-pointer border-l-4 ${
                        selectedOrder?.id === order.id
                          ? 'bg-emerald-50/40 border-l-emerald-700'
                          : 'border-l-transparent'
                      }`}
                    >
                      <td className={`px-6 py-4 font-medium ${selectedOrder?.id === order.id ? 'text-emerald-700' : 'text-gray-600'}`}>
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {order.customer.avatar ? (
                            <img src={order.customer.avatar} alt={order.customer.name} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className={`w-8 h-8 rounded-full bg-${order.customer.color}-100 text-${order.customer.color}-700 flex items-center justify-center font-bold text-xs`}>
                              {order.customer.initials}
                            </div>
                          )}
                          <span className="font-medium text-gray-800">{order.customer.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          {order.type === 'Delivery' ? <Truck className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                          {order.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-800">Ksh {order.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(order.status)}`}></span>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">{order.date}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-emerald-700 transition">
                          <span className="text-lg">→</span>
                        </button>
                      </td>
                    </tr>
                  ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-12 text-center">
                        <p className="text-gray-400 text-sm">No orders found for this filter.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-800">1</span> to{' '}
                <span className="font-semibold text-gray-800">{orders.length}</span> of{' '}
                <span className="font-semibold text-gray-800">124</span> results
              </p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 bg-emerald-700 text-white rounded-md text-sm hover:bg-emerald-800">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                  3
                </button>
                <span className="text-gray-400">...</span>
                <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details Sidebar */}
        {selectedOrder && (
          <div className="w-96 bg-white border-l border-gray-200 shadow-2xl flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-800">Order {selectedOrder.id}</h3>
                  <span className="text-emerald-700 text-sm cursor-pointer hover:scale-110 transition"><Clipboard className="w-4 h-4" /></span>
                </div>
                <p className="text-xs text-gray-500">
                  Placed on {selectedOrder.date} at {selectedOrder.time}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Order Status Timeline */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                  Order Status
                </h4>
                <div className="relative pl-4 border-l-2 border-emerald-700 space-y-6">
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-emerald-700 ring-4 ring-white"></span>
                    <p className="text-sm font-bold text-gray-800">Order Received</p>
                    <p className="text-xs text-gray-500">{selectedOrder.time}</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-orange-500 ring-4 ring-white animate-pulse"></span>
                    <p className="text-sm font-bold text-orange-600">Processing ({selectedOrder.status})</p>
                    <p className="text-xs text-gray-500">Current Status</p>
                  </div>
                  <div className="relative opacity-50">
                    <span className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white"></span>
                    <p className="text-sm font-medium text-gray-500">Ready for Dispatch</p>
                  </div>
                  <div className="relative opacity-50">
                    <span className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white"></span>
                    <p className="text-sm font-medium text-gray-500">Delivered</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Customer</h4>
                <div className="flex items-center gap-3 mb-3">
                  {selectedOrder.customer.avatar ? (
                    <img src={selectedOrder.customer.avatar} alt={selectedOrder.customer.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full bg-${selectedOrder.customer.color}-100 text-${selectedOrder.customer.color}-700 flex items-center justify-center font-bold text-sm shadow-sm`}>
                      {selectedOrder.customer.initials}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-800">{selectedOrder.customer.name}</p>
                    <p className="text-xs text-emerald-700">{selectedOrder.phone}</p>
                  </div>
                  <button className="ml-auto p-1.5 bg-white border border-gray-200 rounded-lg hover:text-emerald-700 transition">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-500">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{selectedOrder.address}</span>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 p-1 shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                        ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.qty} {item.qty > 1 ? 'x' : ''} Ksh {item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-gray-800">Ksh {item.total.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
                  <p className="text-sm font-bold text-gray-600">Total</p>
                  <p className="text-lg font-bold text-gray-800">Ksh {selectedOrder.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-3">
              <Button className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-medium shadow-md flex justify-center items-center gap-2">
                <Check className="w-4 h-4" />
                Mark as Ready
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="py-2.5 text-sm">
                  Print Invoice
                </Button>
                <Button variant="outline" className="py-2.5 text-sm text-red-600 hover:bg-red-50 hover:border-red-200">
                  Cancel Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  </div>
  );
};

export default OrdersPage;
