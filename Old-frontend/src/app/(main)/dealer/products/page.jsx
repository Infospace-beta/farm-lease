"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Settings, MoreVertical, Edit, Trash2 } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import DealerSidebar from '../../../../components/layout/DealerSidebar';
import DealerHeader from '../../../../components/layout/DealerHeader';

const MyProductsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('products');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="bg-background-light flex">
      <DealerSidebar />
      
      {/* Main Content */}
      <main className="flex-1 h-screen overflow-hidden">
        <DealerHeader 
          title="My Products"
          subtitle="Manage your product catalog, update stock levels, and organize inventory"
        />
        
        <div className="h-[calc(100vh-4rem)] overflow-y-auto p-8 bg-gray-50">
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row justify-end items-start md:items-end gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none w-64"
                  />
                </div>
                <Button className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 shadow-lg">
                  <Plus className="w-4 h-4" />
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
                <Settings className="w-3 h-3" /> Filters
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
                      <MoreVertical className="w-4 h-4" />
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
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button className="py-2 px-3 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
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
      </main>
    </div>
  );
};

export default MyProductsPage;
