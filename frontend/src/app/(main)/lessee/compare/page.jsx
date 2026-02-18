import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from '../../context/AuthContext';
import LesseeSidebar from '../../components/layout/LesseeSidebar';
import LesseeHeader from '../../components/layout/LesseeHeader';
import {  ArrowLeft,
  Download,
  X,
  MapPin,
  Droplets,
  Sun,
  SquareIcon,
  ArrowRight,
  CheckCircle,
  Menu
} from "lucide-react";

const CompareFarmAssets = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'Comparison Saved',
      message: 'Your asset comparison has been saved to your dashboard.',
      timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Best Match Updated',
      message: 'Plot A42 is now the top recommendation based on your needs.',
      timestamp: new Date(Date.now() - 1 * 60 * 60000), // 1 hour ago
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Limited Availability',
      message: 'Plot B18 has high interest. 3 others are viewing.',
      timestamp: new Date(Date.now() - 4 * 60 * 60000), // 4 hours ago
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Export Ready',
      message: 'Your comparison PDF is ready to download.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000), // 1 day ago
      read: true
    }
  ]);

  // Sample comparison data - would come from props/state in real app
  const [comparisonAssets, setComparisonAssets] = useState([
    {
      id: 1,
      name: "Rift Valley - Plot A42",
      location: "Nakuru County, Kenya",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      isBestMatch: true,
      soilMatch: 94,
      soilMatchDescription: "Excellent pH balance for Maize & Wheat",
      leasePrice: "15,000",
      acreage: 50,
      acreageScale: "Large Scale",
      acreageScaleClass: "bg-green-100 text-green-700",
      waterAvailability: "High Reliability",
      waterDescription: "Borehole on site + Seasonal River",
      waterIcon: "water",
      crops: [
        { name: "Maize", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
        { name: "Wheat", color: "bg-amber-100 text-amber-800 border-amber-200" },
        { name: "Peas", color: "bg-green-100 text-green-800 border-green-200" }
      ],
      verifiedDate: "Oct 12, 2023"
    },
    {
      id: 2,
      name: "Narok Prime - Plot B18",
      location: "Narok County, Kenya",
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800",
      isBestMatch: false,
      soilMatch: 89,
      soilMatchDescription: "Slightly alkaline, good for Barley",
      leasePrice: "12,000",
      acreage: 12,
      acreageScale: "Small Scale",
      acreageScaleClass: "bg-blue-100 text-blue-700",
      waterAvailability: "Moderate",
      waterDescription: "Rain-fed dependence, no borehole",
      waterIcon: "sun",
      crops: [
        { name: "Barley", color: "bg-amber-100 text-amber-800 border-amber-200" },
        { name: "Beans", color: "bg-red-100 text-red-800 border-red-200" }
      ],
      verifiedDate: "Nov 05, 2023"
    },
    {
      id: 3,
      name: "Kericho Highlands - Plot C27",
      location: "Kericho County, Kenya",
      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800",
      isBestMatch: false,
      soilMatch: 82,
      soilMatchDescription: "Well-drained acidic soil, ideal for Tea & Avocado",
      leasePrice: "10,500",
      acreage: 25,
      acreageScale: "Medium Scale",
      acreageScaleClass: "bg-amber-100 text-amber-700",
      waterAvailability: "High Reliability",
      waterDescription: "Natural spring + High rainfall region",
      waterIcon: "water",
      crops: [
        { name: "Purple Tea", color: "bg-purple-100 text-purple-800 border-purple-200" },
        { name: "Avocado", color: "bg-green-100 text-green-800 border-green-200" },
        { name: "Coffee", color: "bg-orange-100 text-orange-800 border-orange-200" }
      ],
      verifiedDate: "Oct 28, 2023"
    }
  ]);

  const handleRemoveAsset = (id) => {
    setComparisonAssets(comparisonAssets.filter(asset => asset.id !== id));
  };

  const handleBackToResults = () => {
    // Preserve the inputMode query param when navigating back
    const inputMode = router.query?.inputMode || 'regional';
    router.push(`/lessee/recommendations?inputMode=${inputMode}`);
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
          title="Compare Farm Assets"
          subtitle="Side-by-side analysis of AI-recommended land plots based on your crop preferences."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          notifications={notifications}
          onMarkNotificationAsRead={(id) => {
            setNotifications(notifications.map(n => 
              n.id === id ? { ...n, read: true } : n
            ));
          }}
          onViewAllNotifications={() => router.push('/lessee/notifications')}
          rightContent={
            <button className="px-3 lg:px-5 py-2 lg:py-2.5 bg-forest-green text-white rounded-lg text-xs lg:text-sm font-bold shadow-lg shadow-forest-green/30 hover:bg-forest-light flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden lg:inline">Export PDF</span>
            </button>
          }
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={handleBackToResults}
              className="text-gray-500 hover:text-forest-green transition-colors flex items-center gap-2 text-sm font-medium hover:gap-3"
            >
              <ArrowLeft className="w-4 h-4" /> 
              <span>Back to Recommendations</span>
            </button>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-[1600px] mx-auto pb-12">
            {comparisonAssets.map((asset) => (
              <div 
                key={asset.id}
                className={`bg-white rounded-2xl border ${
                  asset.isBestMatch 
                    ? 'border-[#13ec80]/30 ring-4 ring-[#13ec80]/10' 
                    : 'border-gray-200'
                } shadow-xl overflow-hidden flex flex-col relative h-full`}
              >
                {/* Top Green Line for Best Match */}
                {asset.isBestMatch && (
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#13ec80] to-[#047857] z-20"></div>
                )}

                {/* Best Match Badge */}
                {asset.isBestMatch && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-forest-green text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Best Match
                    </span>
                  </div>
                )}

                {/* Image Section */}
                <div className="relative h-64 bg-gray-200 group cursor-pointer overflow-hidden">
                  <img 
                    src={asset.image} 
                    alt={asset.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Close Button */}
                  <button 
                    onClick={() => handleRemoveAsset(asset.id)}
                    className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-white transition-all shadow-sm z-20"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Bottom Gradient Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-20">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-white text-2xl font-serif font-bold mb-1">
                          {asset.name}
                        </h3>
                        <p className="text-gray-300 text-sm flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {asset.location}
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm p-2 rounded-lg border border-white/20">
                        {asset.waterIcon === 'water' ? (
                          <Droplets className="text-[#13ec80] w-6 h-6" />
                        ) : (
                          <Sun className="text-white w-6 h-6" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="flex-1 flex flex-col">
                  <div className="divide-y divide-gray-100">
                    {/* Soil Match */}
                    <div className="p-5 grid grid-cols-3 items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Soil Match
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className={`h-2.5 rounded-full ${
                                asset.soilMatch >= 90 ? 'bg-primary-dark' : 'bg-earth-light'
                              }`}
                              style={{ width: `${asset.soilMatch}%` }}
                            ></div>
                          </div>
                          <span className={`font-bold text-lg font-display ${
                            asset.soilMatch >= 90 ? 'text-primary-dark' : 'text-earth-light'
                          }`}>
                            {asset.soilMatch}%
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{asset.soilMatchDescription}</p>
                      </div>
                    </div>

                    {/* Lease Price */}
                    <div className="p-5 grid grid-cols-3 items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Lease Price
                      </div>
                      <div className="col-span-2">
                        <span className="text-2xl font-bold text-earth-brown font-display">
                          Ksh {asset.leasePrice}
                        </span>
                        <span className="text-sm text-gray-500"> / acre / year</span>
                      </div>
                    </div>

                    {/* Acreage */}
                    <div className="p-5 grid grid-cols-3 items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Acreage
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <SquareIcon className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-gray-700">{asset.acreage} Acres</span>
                        <span className={`${asset.acreageScaleClass} text-[10px] px-2 py-0.5 rounded font-bold uppercase ml-auto`}>
                          {asset.acreageScale}
                        </span>
                      </div>
                    </div>

                    {/* Water Availability */}
                    <div className="p-5 grid grid-cols-3 items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Water Availability
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-700">{asset.waterAvailability}</span>
                        </div>
                        <p className="text-xs text-gray-500">{asset.waterDescription}</p>
                      </div>
                    </div>

                    {/* Crop Suitability */}
                    <div className="p-5 grid grid-cols-3 items-center gap-4 hover:bg-gray-50 transition-colors">
                      <div className="col-span-1 text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Crop Suitability
                      </div>
                      <div className="col-span-2 flex flex-wrap gap-2">
                        {asset.crops.map((crop, idx) => (
                          <span 
                            key={idx}
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${crop.color} border`}
                          >
                            {crop.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Request Lease Button */}
                  <div className="p-6 mt-auto border-t border-gray-100 bg-gray-50/50">
                    <button className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider group ${
                      asset.isBestMatch
                        ? 'bg-forest-green text-white shadow-lg shadow-forest-green/20 hover:bg-forest-light'
                        : 'bg-white border-2 border-forest-green text-forest-green hover:bg-forest-green hover:text-white'
                    }`}>
                      Request Lease
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-[10px] text-gray-400 mt-3">
                      Verified by FarmLease Agents on {asset.verifiedDate}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompareFarmAssets;
