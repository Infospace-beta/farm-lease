import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('profile');
  const [activeProfileTab, setActiveProfileTab] = useState('store');

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

  const profileTabs = [
    { id: 'store', label: 'Store Details' },
    { id: 'personal', label: 'Personal Info' },
    { id: 'payments', label: 'Bank & Payments' },
    { id: 'security', label: 'Security' },
  ];

  const documents = [
    {
      name: 'Business Permit',
      size: '2.4 MB',
      type: 'PDF',
      verified: true,
      icon: '📄'
    },
    {
      name: 'Agro-Dealer License',
      size: '1.8 MB',
      type: 'PDF',
      verified: true,
      icon: '🏅'
    }
  ];

  const handleSaveChanges = () => {
    console.log('Saving changes...');
  };

  const handleUploadLogo = () => {
    console.log('Upload logo clicked');
  };

  const handleUploadDocument = () => {
    console.log('Upload document clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-emerald-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-emerald-900 to-emerald-950 text-white p-6 flex flex-col shadow-2xl overflow-y-auto">
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
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  item.label === 'Notifications' ? 'bg-red-500' : 'bg-emerald-600'
                } text-white`}>
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-emerald-700">
          <Link
            to="/dealer/profile"
            className="flex items-center gap-3 bg-emerald-800/50 rounded-xl p-3 border border-emerald-600 cursor-pointer hover:bg-emerald-800 transition-colors"
          >
            <img
              src="https://ui-avatars.com/api/?name=David+M&background=10b981&color=fff"
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-emerald-500"
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
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">Profile Settings</h2>
              <p className="text-gray-500 text-sm max-w-xl">
                Manage your store details, personal information, and payment preferences.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg items-center gap-2 hover:bg-gray-50 transition shadow-sm text-sm">
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="flex px-5 py-2 bg-emerald-700 text-white rounded-lg items-center gap-2 hover:bg-emerald-800 transition shadow-lg text-sm"
              >
                <span className="text-sm">💾</span>
                Save Changes
              </button>
            </div>
          </div>

          <div>
            {/* Profile Tabs */}
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
              {profileTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveProfileTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap focus:outline-none transition-colors border-b-2 ${
                    activeProfileTab === tab.id
                      ? 'text-emerald-700 border-emerald-700'
                      : 'text-gray-500 hover:text-gray-700 border-transparent hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Store Details Tab */}
              {activeProfileTab === 'store' && (
                <>
                  {/* Left Column - Store Identity & Documents */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Store Identity Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-lg text-gray-800 mb-4">Store Identity</h3>
                      <div className="flex flex-col items-center text-center">
                        <div className="relative group cursor-pointer" onClick={handleUploadLogo}>
                          <div className="w-32 h-32 rounded-full border-4 border-emerald-50 bg-gray-50 overflow-hidden mb-4 relative">
                            <img
                              alt="Store Logo"
                              className="w-full h-full object-cover"
                              src="https://ui-avatars.com/api/?name=GreenHarvest+Agro&background=10b981&color=fff&size=200"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-white text-2xl">✏️</span>
                            </div>
                          </div>
                          <button className="absolute bottom-4 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 text-emerald-700 hover:text-emerald-800 transition-colors">
                            <span className="text-lg">📷</span>
                          </button>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">GreenHarvest Agro</h4>
                        <p className="text-sm text-gray-500 mb-4">Dealer ID: #AG-88219</p>
                        <div className="w-full space-y-3">
                          <div className="flex justify-between items-center px-4 py-2 bg-emerald-50 rounded-lg">
                            <span className="text-xs font-semibold text-emerald-700">Status</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                              <span className="w-2 h-2 rounded-full bg-emerald-700"></span> Verified
                            </span>
                          </div>
                          <div className="flex justify-between items-center px-4 py-2 bg-gray-50 rounded-lg">
                            <span className="text-xs font-semibold text-gray-500">Member Since</span>
                            <span className="text-xs font-bold text-gray-700">Aug 2021</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Verification Documents Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                      <h3 className="font-bold text-lg text-gray-800 mb-4">Verification Documents</h3>
                      <div className="space-y-3">
                        {documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{doc.icon}</span>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                                <p className="text-xs text-gray-400">{doc.type} • {doc.size}</p>
                              </div>
                            </div>
                            {doc.verified && (
                              <span className="text-emerald-700 text-xl">✓</span>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={handleUploadDocument}
                          className="w-full py-2 border border-dashed border-gray-300 rounded-xl text-gray-500 text-xs font-medium hover:border-emerald-700 hover:text-emerald-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <span className="text-sm">➕</span> Upload New Document
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Store Information */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Store Information Card */}
                    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-xl text-gray-800">Store Information</h3>
                        <span className="text-xs text-gray-400 italic">Last updated: 2 days ago</span>
                      </div>
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="storeName">
                              Store Name
                            </label>
                            <input
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                              id="storeName"
                              type="text"
                              defaultValue="GreenHarvest Agro Inputs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="regNumber">
                              Registration Number
                            </label>
                            <input
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm bg-gray-50"
                              id="regNumber"
                              type="text"
                              defaultValue="BN-99283-KE"
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="storeDescription">
                            Store Description
                          </label>
                          <textarea
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                            id="storeDescription"
                            rows="3"
                            defaultValue="Leading supplier of quality fertilizers, certified seeds, and modern farming equipment in the Rift Valley region."
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="email">
                              Business Email
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-lg">
                                📧
                              </span>
                              <input
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                                id="email"
                                type="email"
                                defaultValue="sales@greenharvest.co.ke"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="phone">
                              Business Phone
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-lg">
                                📞
                              </span>
                              <input
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                                id="phone"
                                type="tel"
                                defaultValue="+254 712 345 678"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="county">
                              County
                            </label>
                            <select
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                              id="county"
                              defaultValue="Uasin Gishu"
                            >
                              <option>Uasin Gishu</option>
                              <option>Nakuru</option>
                              <option>Trans Nzoia</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="town">
                              Town / Market Center
                            </label>
                            <input
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                              id="town"
                              type="text"
                              defaultValue="Eldoret, Market Street"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </>
              )}

              {/* Personal Info Tab */}
              {activeProfileTab === 'personal' && (
                <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Picture */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">Profile Picture</h3>
                        <div className="flex flex-col items-center text-center">
                          <div className="relative group cursor-pointer">
                            <div className="w-32 h-32 rounded-full border-4 border-emerald-50 bg-gray-50 overflow-hidden mb-4 relative">
                              <img
                                alt="Profile"
                                className="w-full h-full object-cover"
                                src="https://ui-avatars.com/api/?name=David+M&background=10b981&color=fff&size=200"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-2xl">✏️</span>
                              </div>
                            </div>
                            <button className="absolute bottom-4 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 text-emerald-700 hover:text-emerald-800 transition-colors">
                              <span className="text-lg">📷</span>
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    </div>

                    {/* Personal Details Form */}
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-xl text-gray-800 mb-6">Personal Information</h3>
                        <form className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="firstName">
                                First Name
                              </label>
                              <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                                id="firstName"
                                type="text"
                                defaultValue="David"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="lastName">
                                Last Name
                              </label>
                              <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                                id="lastName"
                                type="text"
                                defaultValue="Mwangi"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="idNumber">
                                National ID Number
                              </label>
                              <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm bg-gray-50"
                                id="idNumber"
                                type="text"
                                defaultValue="28****891"
                                readOnly
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="dateOfBirth">
                                Date of Birth
                              </label>
                              <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                                id="dateOfBirth"
                                type="date"
                                defaultValue="1985-06-15"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="personalEmail">
                                Personal Email
                              </label>
                              <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                                id="personalEmail"
                                type="email"
                                defaultValue="david.mwangi@gmail.com"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="personalPhone">
                                Personal Phone
                              </label>
                              <input
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                                id="personalPhone"
                                type="tel"
                                defaultValue="+254 722 456 789"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="address">
                              Physical Address
                            </label>
                            <textarea
                              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                              id="address"
                              rows="2"
                              defaultValue="Plot 42, Uganda Road, Eldoret"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="gender">
                                Gender
                              </label>
                              <select
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                                id="gender"
                                defaultValue="Male"
                              >
                                <option>Male</option>
                                <option>Female</option>
                                <option>Prefer not to say</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="language">
                                Preferred Language
                              </label>
                              <select
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                                id="language"
                                defaultValue="English"
                              >
                                <option>English</option>
                                <option>Kiswahili</option>
                                <option>Both</option>
                              </select>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank & Payments Tab */}
              {activeProfileTab === 'payments' && (
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-bold text-xl text-gray-800">Payment Methods</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage how you receive settlements from sales</p>
                      </div>
                      <button className="text-emerald-700 hover:text-emerald-800 text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                        <span className="text-sm">➕</span> Add Method
                      </button>
                    </div>
                    <div className="space-y-4">
                      {/* M-PESA Payment Method */}
                      <div className="border rounded-xl p-5 flex items-start gap-4 relative bg-emerald-50/30 border-emerald-300">
                        <div className="mt-1">
                          <input
                            type="radio"
                            name="payment_method"
                            defaultChecked
                            className="text-emerald-700 focus:ring-emerald-700 w-4 h-4 border-gray-300"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">📱</span>
                              <h4 className="font-bold text-gray-800">M-PESA Paybill (Business)</h4>
                            </div>
                            <span className="bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              Primary
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">
                            Settlements will be sent to this Paybill number automatically.
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Paybill No</p>
                              <p className="text-sm font-medium text-gray-800">542391</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Account Name</p>
                              <p className="text-sm font-medium text-gray-800">GreenHarvest</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Added On</p>
                              <p className="text-sm font-medium text-gray-800">Aug 15, 2021</p>
                            </div>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-emerald-700">
                          <span className="text-lg">✏️</span>
                        </button>
                      </div>

                      {/* Bank Transfer Payment Method */}
                      <div className="border rounded-xl p-5 flex items-start gap-4 relative border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="mt-1">
                          <input
                            type="radio"
                            name="payment_method"
                            className="text-emerald-700 focus:ring-emerald-700 w-4 h-4 border-gray-300"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🏦</span>
                            <h4 className="font-bold text-gray-800">Bank Transfer (KCB Bank)</h4>
                          </div>
                          <p className="text-xs text-gray-500 mb-3">For settlements above Ksh 100,000.</p>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Account No</p>
                              <p className="text-sm font-medium text-gray-800">1102****891</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Branch</p>
                              <p className="text-sm font-medium text-gray-800">Eldoret West</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Account Name</p>
                              <p className="text-sm font-medium text-gray-800">GreenHarvest Agro</p>
                            </div>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-emerald-700">
                          <span className="text-lg">✏️</span>
                        </button>
                      </div>
                    </div>

                    {/* Settlement Schedule */}
                    <div className="mt-8 pt-8 border-t border-gray-200">
                      <h4 className="font-bold text-lg text-gray-800 mb-4">Settlement Schedule</h4>
                      <div className="bg-gray-50 rounded-xl p-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">Frequency</p>
                            <p className="text-sm font-medium text-gray-800">Daily (Automatic)</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">Processing Time</p>
                            <p className="text-sm font-medium text-gray-800">Within 24 hours</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-1">Last Settlement</p>
                            <p className="text-sm font-medium text-gray-800">Feb 10, 2026 - Ksh 45,200</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeProfileTab === 'security' && (
                <div className="lg:col-span-3 space-y-6">
                  {/* Change Password */}
                  <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-xl text-gray-800 mb-6">Change Password</h3>
                    <form className="space-y-6 max-w-2xl">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="currentPassword">
                          Current Password
                        </label>
                        <input
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                          id="currentPassword"
                          type="password"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="newPassword">
                            New Password
                          </label>
                          <input
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                            id="newPassword"
                            type="password"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide" htmlFor="confirmPassword">
                            Confirm New Password
                          </label>
                          <input
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-5 py-2.5 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition shadow-lg text-sm font-medium"
                      >
                        Update Password
                      </button>
                    </form>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="font-bold text-xl text-gray-800">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">📱</span>
                          <h4 className="font-bold text-gray-800 text-sm">SMS Authentication</h4>
                        </div>
                        <p className="text-xs text-gray-500">Receive codes via SMS to +254 722 *** 789</p>
                      </div>
                      <div className="border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">📧</span>
                          <h4 className="font-bold text-gray-800 text-sm">Email Authentication</h4>
                        </div>
                        <p className="text-xs text-gray-500">Receive codes via email to david.***@gmail.com</p>
                      </div>
                    </div>
                  </div>

                  {/* Login Activity */}
                  <div className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-xl text-gray-800 mb-6">Recent Login Activity</h3>
                    <div className="space-y-3">
                      {[
                        { device: 'Windows PC', browser: 'Chrome 121', location: 'Eldoret, Kenya', time: '2 hours ago', isCurrent: true },
                        { device: 'Android Phone', browser: 'Chrome Mobile', location: 'Eldoret, Kenya', time: 'Yesterday at 6:42 PM', isCurrent: false },
                        { device: 'Windows PC', browser: 'Chrome 121', location: 'Nakuru, Kenya', time: '3 days ago', isCurrent: false },
                      ].map((login, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{login.device.includes('Phone') ? '📱' : '💻'}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-800">{login.device} • {login.browser}</p>
                                {login.isCurrent && (
                                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">{login.location} • {login.time}</p>
                            </div>
                          </div>
                          {!login.isCurrent && (
                            <button className="text-xs text-red-600 hover:text-red-700 font-medium">Revoke</button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
