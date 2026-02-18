import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Search, ShoppingCart, Heart, Star, Plus, MessageCircle } from 'lucide-react';
import LesseeSidebar from '../../components/layout/LesseeSidebar';
import LesseeHeader from '../../components/layout/LesseeHeader';

const AgroDealerShop = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartCount, setCartCount] = useState(2);

  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Order Confirmed',
      message: 'Your fertilizer order #4521 has been confirmed by the dealer.',
      timestamp: new Date(Date.now() - 25 * 60000),
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Price Drop',
      message: 'DK 777 Hybrid Maize seeds now available at 15% discount.',
      timestamp: new Date(Date.now() - 3 * 3600000),
      read: false
    },
    {
      id: 3,
      type: 'success',
      title: 'Delivery Complete',
      message: 'Your order has been delivered successfully.',
      timestamp: new Date(Date.now() - 1 * 86400000),
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'New Products',
      message: 'Check out the latest organic fertilizers in stock.',
      timestamp: new Date(Date.now() - 3 * 86400000),
      read: true
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'fertilizers', name: 'Fertilizers & Soil' },
    { id: 'seeds', name: 'Certified Seeds' },
    { id: 'chemicals', name: 'Agro-Chemicals' },
    { id: 'tools', name: 'Farm Tools' },
    { id: 'machinery', name: 'Machinery' }
  ];

  const products = [
    {
      id: 1,
      name: 'YaraMila Planting Fertilizer',
      category: 'fertilizers',
      categoryLabel: 'Fertilizer',
      description: 'Premium NPK 23:23:0 blend enriched with Zinc and Boron for maize planting. 50kg bag.',
      price: 3500,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
      isTopRated: true
    },
    {
      id: 2,
      name: 'DK 777 Hybrid Maize',
      category: 'seeds',
      categoryLabel: 'Seeds',
      description: 'High yield, drought tolerant variety suitable for medium to high altitude areas. 2kg pack.',
      price: 850,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&q=80',
      isTopRated: false
    },
    {
      id: 3,
      name: 'Roundup Herbicide',
      category: 'chemicals',
      categoryLabel: 'Chemicals',
      description: 'Systemic herbicide for effective weed control. 1 Liter concentrate.',
      price: 1200,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800&q=80',
      isTopRated: false
    },
    {
      id: 4,
      name: 'Knapsack Sprayer 20L',
      category: 'machinery',
      categoryLabel: 'Machinery',
      description: 'Heavy duty manual sprayer with stainless steel lance and multiple nozzle attachments.',
      price: 4800,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80',
      isTopRated: true
    },
    {
      id: 5,
      name: 'CAN Fertilizer Top Dressing',
      category: 'fertilizers',
      categoryLabel: 'Fertilizer',
      description: 'Calcium Ammonium Nitrate for top dressing maize and vegetables. 50kg bag.',
      price: 3200,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&q=80',
      isTopRated: false
    },
    {
      id: 6,
      name: 'Assorted Veg Seeds',
      category: 'seeds',
      categoryLabel: 'Seeds',
      description: 'Pack of 5 including Kale, Spinach, Tomato, Onion, and Coriander. Starter pack.',
      price: 450,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784589?w=800&q=80',
      isTopRated: false
    }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const handleMarkNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleViewAllNotifications = () => {
    router.push('/lessee/notifications');
  };

  const handleAddToCart = (productId) => {
    setCartCount(cartCount + 1);
    console.log('Added product to cart:', productId);
  };

  return (
    <div className="bg-background-light min-h-screen flex relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <LesseeSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <LesseeHeader
          title="Agro-Dealer Marketplace"
          subtitle="Source high-quality inputs directly from certified regional distributors. Bulk discounts available for leaseholders."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onViewAllNotifications={handleViewAllNotifications}
          rightContent={
            <div className="flex items-center gap-3">
              {/* Search Input */}
              <div className="relative w-48 lg:w-64 group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-forest-green transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-green/20 focus:border-forest-green text-sm shadow-sm transition-all"
                />
              </div>
              {/* Cart Button */}
              <button className="relative p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition shadow-sm">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-earth-brown text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          }
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            {/* Category Filters */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full font-medium text-sm transition-all whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-forest-green text-white shadow-lg shadow-forest-green/20'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-forest-green/30 hover:text-forest-green'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden group hover:shadow-xl hover:border-forest-green/20 transition-all duration-300 flex flex-col h-full"
                >
                  {/* Product Image */}
                  <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Top Rated Badge */}
                    {product.isTopRated && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-earth-brown text-white text-[10px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-wide flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> Top Rated
                        </span>
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition shadow-sm opacity-0 group-hover:opacity-100">
                      <Heart size={18} />
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Category & Rating */}
                    <div className="mb-1 flex justify-between items-start">
                      <span className="text-[10px] font-bold text-forest-green bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {product.categoryLabel}
                      </span>
                      <div className="flex items-center gap-0.5 text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-bold text-gray-600 ml-1">
                          {product.rating}
                        </span>
                      </div>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-bold text-lg text-gray-800 leading-tight mb-2 group-hover:text-forest-green transition-colors">
                      {product.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Price & Add to Cart */}
                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold">
                          Unit Price
                        </p>
                        <p className="text-lg font-bold text-earth-brown font-display">
                          Ksh {product.price.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="w-10 h-10 rounded-xl bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-forest-green hover:text-white transition-colors group/btn"
                      >
                        <Plus className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>

                    {/* Connect with Dealer Button */}
                    <div className="mt-4">
                      <button className="w-full py-2.5 bg-forest-green text-white text-sm font-medium rounded-xl hover:bg-forest-green/90 transition shadow-lg shadow-forest-green/20 flex items-center justify-center gap-2">
                        <MessageCircle size={16} className="text-primary" />
                        Connect with Dealer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgroDealerShop;
