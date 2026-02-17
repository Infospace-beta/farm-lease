import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AddProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('add-product');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: null
  });

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

  const categories = [
    { value: 'seeds', label: 'Seeds' },
    { value: 'fertilizers', label: 'Fertilizers' },
    { value: 'pesticides', label: 'Pesticides' },
    { value: 'tools', label: 'Tools & Equipment' },
    { value: 'machinery', label: 'Machinery' },
    { value: 'irrigation', label: 'Irrigation Systems' },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Product data:', formData);
    // Handle product creation
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
      <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Add New Product</h2>
            <p className="text-gray-600 text-sm">Fill in the details to add a new product to your inventory</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Card className="bg-white p-6 shadow-md">
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Hybrid Maize Seeds - DH04"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (KES) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Initial Stock Quantity *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        required
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Description</h3>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your product, its features, benefits, and usage..."
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                  ></textarea>
                </div>

                {/* Image Upload */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Image</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                    <div className="space-y-2">
                      <div className="text-6xl">📷</div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <span className="text-emerald-700 font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-lg font-medium shadow-md"
                  >
                    <span className="mr-2">➕</span> Add Product
                  </Button>
                  <Link to="/dealer/products" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </form>

          {/* Tips Card */}
          <Card className="bg-blue-50 border-blue-200 p-6">
            <div className="flex gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Tips for Adding Products</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Use clear, descriptive product names</li>
                  <li>• High-quality images increase sales by up to 40%</li>
                  <li>• Include detailed descriptions with key features</li>
                  <li>• Set competitive pricing based on market research</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
