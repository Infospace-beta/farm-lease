import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../../components/common/Button';

const MyProductsPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('products');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    { id: 'notifications', label: 'Notifications', icon: '🔔', badge: 2, path: '/dealer/notifications' },
  ];

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'Seeds', label: 'Seeds' },
    { id: 'Fertilizers', label: 'Fertilizers' },
    { id: 'Pesticides', label: 'Pesticides' },
    { id: 'Tools & Equipment', label: 'Equipment' },
  ];

  const products = [
    {
      id: 1,
      name: 'Hybrid Maize Seeds - DH04',
      category: 'Seeds',
      description: 'High-quality hybrid maize seeds suitable for various climatic conditions. High yield potential.',
      price: 4800,
      stock: 35,
      status: 'Active',
      image: 'https://assets.agropests.com/Products/1e64f0b4068a83031897b5f4f3ac2a4245c87adeb8e868f0f34e9a46ec00444c?format=auto&width=3840&quality=75'
    },
    {
      id: 2,
      name: 'Tomato Seeds F1 Hybrid',
      category: 'Seeds',
      description: 'Premium F1 hybrid tomato seeds with excellent disease resistance and high productivity.',
      price: 3500,
      stock: 0,
      status: 'Out of Stock',
      image: 'https://storage.googleapis.com/stateless-lionfarm-co-ke/2022/03/0fb286ae-tropika_tomato-maxim-f1.jpg'
    },
    {
      id: 3,
      name: 'NPK 17-17-17 Fertilizer 50kg',
      category: 'Fertilizers',
      description: 'Balanced NPK fertilizer ideal for all crops. Contains nitrogen, phosphorus, and potassium in equal ratios.',
      price: 2850,
      stock: 45,
      status: 'Active',
      image: 'https://agrijibu.co.ke/wp-content/uploads/2025/06/Falcon-NPK-17-17.webp'
    },
    {
      id: 4,
      name: 'Organic Cattle Manure 25kg',
      category: 'Fertilizers',
      description: '100% organic cattle manure. Rich in nutrients and improves soil structure naturally.',
      price: 800,
      stock: 120,
      status: 'Active',
      image: 'https://greensouq.ae/cdn/shop/files/cow-manure-organic-100-natural-fertilizer-1016-25kg-smad-albkr-9807716.jpg?v=1763455024&width=800'
    },
    {
      id: 5,
      name: 'Dursban Insecticide 500ml',
      category: 'Pesticides',
      description: 'Broad-spectrum insecticide for effective pest control. Safe when used as directed.',
      price: 950,
      stock: 89,
      status: 'Active',
      image: 'https://agroorbit.s3.ap-south-1.amazonaws.com/uploads/all/wLO7umlUkcx0EETkamobiPCwFlH6NzqXxywikT7T.jpg'
    },
    {
      id: 6,
      name: 'Herbicide Roundup 1L',
      category: 'Pesticides',
      description: 'Fast-acting herbicide for weed control. Effective on a wide range of weeds.',
      price: 1200,
      stock: 56,
      status: 'Active',
      image: 'https://images.prismic.io/roundup/d1fea328-097d-4675-b28b-b583b330b74d_Roundup+1L+Herbicide+Concentrate+BOTTLE.jpg?auto=compress,format'
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      'Active': 'bg-green-100 text-green-800 border-green-200',
      'Low Stock': 'bg-orange-100 text-orange-800 border-orange-200',
      'Out of Stock': 'bg-red-100 text-red-800 border-red-200',
      'Hidden': 'bg-gray-100 text-gray-500 border-gray-200',
    };
    return badges[status] || badges['Active'];
  };

  const getStockColor = (stock, status) => {
    if (status === 'Out of Stock' || stock === 0) return 'text-red-600';
    if (status === 'Low Stock' || stock < 20) return 'text-orange-600';
    return 'text-gray-800';
  };

  // Filter products based on category
  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

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
                <h2 className="text-3xl font-bold text-gray-800 mb-1">My Products</h2>
                <p className="text-gray-600 text-sm">
                  Manage your product catalog, update stock levels, and organize inventory.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none w-64"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
                <Button className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 shadow-lg">
                  <span>➕</span>
                  <span className="text-sm font-medium">New Product</span>
                </Button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                    selectedCategory === category.id
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-800 hover:text-amber-800'
                  }`}
                >
                  {category.label}
                </button>
              ))}
              <button className="ml-auto px-4 py-1.5 bg-white border border-gray-200 text-gray-600 hover:border-gray-300 text-xs font-medium rounded-full transition-all flex items-center gap-1">
                <span className="text-sm">⚙️</span> Filters
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  {/* Product Image */}
                  <div className="relative h-48 w-full bg-gray-50 overflow-hidden border-b border-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                        {product.icon}
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`inline-flex text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border ${getStatusBadge(
                          product.status
                        )}`}
                      >
                        {product.status}
                      </span>
                    </div>
                    <button className="absolute top-3 right-3 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-amber-800 hover:bg-white transition shadow-sm opacity-0 group-hover:opacity-100">
                      <span className="text-lg">⋮</span>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-2">
                      <p className="text-xs text-amber-700 font-medium uppercase tracking-wide mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-bold text-lg text-gray-800 leading-tight group-hover:text-emerald-700 transition-colors">
                        {product.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                      {product.description}
                    </p>

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                          Price
                        </p>
                        <p className="text-lg font-bold text-amber-800">
                          Ksh {product.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                          Stock
                        </p>
                        <p className={`text-sm font-bold ${getStockColor(product.stock, product.status)}`}>
                          {product.stock} Units
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <button className="flex-1 py-2 px-3 bg-emerald-700/10 text-emerald-700 hover:bg-emerald-700 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-1">
                        <span className="text-sm">✏️</span> Edit
                      </button>
                      <button className="py-2 px-3 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-lg transition-colors">
                        <span className="text-lg">🗑️</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4 pb-8">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-bold text-amber-800">1</span> to{' '}
                  <span className="font-bold text-amber-800">6</span> of{' '}
                  <span className="font-bold text-amber-800">48</span> results
                </p>
              </div>
              <div className="flex-1 flex justify-between sm:justify-end gap-2">
                <button
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-50 text-sm font-medium disabled:opacity-50"
                  disabled
                >
                  Previous
                </button>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProductsPage;
