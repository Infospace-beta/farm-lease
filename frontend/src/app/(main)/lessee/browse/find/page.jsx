import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';
import LesseeSidebar from '../../components/layout/LesseeSidebar';
import LesseeHeader from '../../components/layout/LesseeHeader';
import { 
  Search,
  Bell,
  Sliders,
  Sparkles,
  Plus,
  X,
  ChevronDown,
  Heart,
  MapPin,
  ArrowRight,
  Menu
} from 'lucide-react';
import { useState } from 'react';

const FindLandPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [minAcres, setMinAcres] = useState(0);
  const [maxAcres, setMaxAcres] = useState(100);
  const [soilType, setSoilType] = useState('Any Soil Type');
  const [customCropInput, setCustomCropInput] = useState('');
  const [showCustomCropInput, setShowCustomCropInput] = useState(false);
  const [filterApplied, setFilterApplied] = useState(false);
  
  // Sample notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'New Listings Added',
      message: '5 verified plots in Nakuru match your search criteria.',
      timestamp: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Price Reduced',
      message: 'Plot K-42 in Naivasha now Ksh 15,000/acre (was Ksh 18,000).',
      timestamp: new Date(Date.now() - 3 * 60 * 60000), // 3 hours ago
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'High Demand Area',
      message: 'Plots in Eldoret are booking fast. Only 2 left.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60000), // 1 day ago
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Saved Search Alert',
      message: 'New plot matching "Maize farming, Nakuru" available.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
      read: true
    }
  ]);
  
  // Region autocomplete states
  const [regionInput, setRegionInput] = useState('');
  const [showRegionSuggestions, setShowRegionSuggestions] = useState(false);
  
  // Crop autocomplete states
  const [showCropSuggestions, setShowCropSuggestions] = useState(false);
  
  // Header search autocomplete states
  const [searchInput, setSearchInput] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  // Available options for suggestions - Comprehensive Kenyan Locations
  const availableRegions = [
    // Major Regions
    'Rift Valley', 'Central Kenya', 'Coastal Region', 'Eastern Region', 'Western Region',
    'Nyanza Region', 'North Eastern Region', 'Mount Kenya Region', 'Lake Victoria Basin',
    
    // All 47 Counties
    'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Naivasha',
    'Kiambu', 'Thika', 'Nyeri', 'Nanyuki', 'Meru', 'Embu', 'Kirinyaga',
    'Murang\'a', 'Laikipia', 'Nyandarua', 'Makueni', 'Machakos', 'Kitui',
    'Kakamega', 'Bungoma', 'Busia', 'Vihiga', 'Kisii', 'Nyamira',
    'Migori', 'Homa Bay', 'Siaya', 'Garissa', 'Wajir', 'Mandera',
    'Marsabit', 'Isiolo', 'Samburu', 'Turkana', 'West Pokot',
    'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi', 'Baringo',
    'Narok', 'Kajiado', 'Kericho', 'Bomet', 'Kwale', 'Kilifi',
    'Tana River', 'Lamu', 'Taita Taveta',
    
    // Major Sub-Counties and Towns
    'Ruiru', 'Limuru', 'Kikuyu', 'Juja', 'Gatundu', 'Githunguri',
    'Kangema', 'Kiharu', 'Mathira', 'Mukurweini', 'Othaya', 'Tetu',
    'Tigania', 'Igembe', 'Imenti', 'Gichugu', 'Ndia', 'Mwea',
    'Mumias', 'Lugari', 'Malava', 'Teso', 'Malaba', 'Butere',
    'Rachuonyo', 'Gucha', 'Kitutu', 'Rongo', 'Awendo', 'Uriri',
    'Narok South', 'Narok North', 'Transmara', 'Kajiado North', 'Kajiado South',
    'Kuresoi', 'Molo', 'Rongai', 'Subukia', 'Gilgil', 'Njoro',
    'Londiani', 'Kipkelion', 'Sotik', 'Konoin', 'Bureti',
    'Mwingi', 'Mutomo', 'Kibwezi', 'Wote', 'Kathiani', 'Kangundo',
    'Yatta', 'Tharaka', 'Mbeere', 'Runyenjes', 'Chuka'
  ];
  
  const availableCrops = [
    // Cereals
    'Maize', 'Wheat', 'Rice', 'Sorghum', 'Millet', 'Barley', 'Oats',
    
    // Legumes
    'Beans', 'Peas', 'Green Grams', 'Cowpeas', 'Pigeon Peas', 'Lentils', 'Chickpeas',
    
    // Root Crops
    'Potatoes', 'Sweet Potatoes', 'Cassava', 'Arrowroots', 'Yams',
    
    // Vegetables
    'Cabbage', 'Kale (Sukuma Wiki)', 'Spinach', 'Tomatoes', 'Onions', 'Carrots',
    'Capsicum', 'Cauliflower', 'Broccoli', 'Lettuce', 'Cucumber', 'Pumpkin',
    'Zucchini', 'Eggplant', 'Green Beans', 'Snow Peas', 'Beetroot', 'Leeks',
    
    // Fruits
    'Avocado', 'Mangoes', 'Bananas', 'Oranges', 'Pineapples', 'Passion Fruit',
    'Watermelon', 'Papaya', 'Guava', 'Apples', 'Strawberries', 'Tree Tomatoes',
    'Grapes', 'Melons', 'Lemons', 'Tangerines',
    
    // Cash Crops
    'Coffee', 'Tea', 'Sugarcane', 'Cotton', 'Pyrethrum', 'Tobacco', 'Macadamia',
    'Cashew Nuts', 'Coconuts', 'Sisal', 'Sunflower',
    
    // Herbs & Spices
    'Chili', 'Ginger', 'Garlic', 'Coriander', 'Basil', 'Mint',
    
    // Other
    'Groundnuts', 'Bambara Nuts', 'Sesame', 'French Beans', 'Runner Beans',
    'Snap Peas', 'Baby Corn', 'Fodder Crops', 'Napier Grass', 'Rhodes Grass'
  ];
  
  const aiRecommendedCrops = ['Maize', 'Wheat', 'Avocado'];
  
  // Comprehensive search suggestions (locations + crops + features)
  const searchKeywords = [
    // Soil Types
    'Loam Soil', 'Volcanic Soil', 'Red Clay', 'Sandy Loam', 'Black Cotton Soil',
    'Clay Soil', 'Alluvial Soil', 'Laterite Soil',
    
    // Water Sources
    'River Water', 'Borehole', 'Dam', 'Piped Water', 'Rain Fed', 'Irrigation',
    'Well Water', 'Spring Water',
    
    // Terrain
    'Flat Land', 'Gentle Slope', 'Hilly', 'Valley', 'Highland', 'Lowland',
    
    // Land Features
    'Fenced', 'Title Deed', 'Access Road', 'Electricity', 'Near Market',
    'Water Access', 'Fertile Land', 'Virgin Land', 'Previously Farmed',
    
    // Farm Types
    'Dairy Farm', 'Poultry Farm', 'Mixed Farming', 'Horticulture',
    'Commercial Farm', 'Subsistence Farm', 'Greenhouse Ready',
    
    // Size Categories
    'Small Scale (1-5 acres)', 'Medium Scale (5-20 acres)', 
    'Large Scale (20+ acres)', 'Smallholder', 'Commercial Scale'
  ];
  
  // Combine all search options
  const allSearchOptions = [
    ...availableRegions.map(r => ({ type: 'location', value: r })),
    ...availableCrops.map(c => ({ type: 'crop', value: c })),
    ...searchKeywords.map(k => ({ type: 'feature', value: k }))
  ];

  const lands = [
    {
      id: 1,
      name: 'Green Valley Plot A',
      location: 'Nakuru, Rift Valley',
      acres: 20,
      price: '45k',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500',
      badge: 'Ideal for Maize',
      badgeColor: 'bg-emerald-500',
      soil: 'Loam',
      water: 'River',
      slope: 'Flat',
      match: '98%',
      matchColor: 'bg-green-100 text-green-700'
    },
    {
      id: 2,
      name: 'Highland Wheat Farm',
      location: 'Narok, Rift Valley',
      acres: 15,
      price: '30k',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500',
      badge: 'Wheat Ready',
      badgeColor: 'bg-yellow-600',
      soil: 'Volcanic',
      water: 'Borehole',
      slope: 'Gentle',
      match: '85%',
      matchColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: 3,
      name: 'Nyeri Mixed Farm',
      location: 'Nyeri, Central',
      acres: 50,
      price: '60k',
      image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=500',
      badge: 'Mixed Crop',
      badgeColor: 'bg-teal-600',
      soil: 'Red Clay',
      water: 'Rain/Dam',
      slope: 'Hilly',
      match: '92%',
      matchColor: 'bg-orange-100 text-orange-700'
    },
    {
      id: 4,
      name: 'Thika Road Plot',
      location: 'Kiambu, Central',
      acres: 12,
      price: '80k',
      image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500',
      badge: 'Horticulture',
      badgeColor: 'bg-gray-500',
      soil: 'Loam',
      water: 'Piped',
      slope: 'Flat',
      pending: true
    }
  ];

  // Filter regions based on input
  const getRegionSuggestions = () => {
    if (!regionInput.trim()) return [];
    return availableRegions.filter(region => 
      region.toLowerCase().includes(regionInput.toLowerCase()) &&
      !selectedRegions.includes(region)
    );
  };
  
  // Filter crops based on input
  const getCropSuggestions = () => {
    if (!customCropInput.trim()) return [];
    return availableCrops.filter(crop => 
      crop.toLowerCase().includes(customCropInput.toLowerCase()) &&
      !selectedCrops.includes(crop)
    );
  };
  
  const addRegion = (region) => {
    if (!selectedRegions.includes(region)) {
      setSelectedRegions([...selectedRegions, region]);
      setRegionInput('');
      setShowRegionSuggestions(false);
    }
  };
  
  const removeRegion = (region) => {
    setSelectedRegions(selectedRegions.filter(r => r !== region));
  };

  const toggleRegion = (region) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const addCrop = (crop) => {
    if (!selectedCrops.includes(crop)) {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const removeCrop = (crop) => {
    setSelectedCrops(selectedCrops.filter(c => c !== crop));
  };

  const handleAddCustomCrop = (cropName = customCropInput) => {
    const trimmedCrop = cropName.trim();
    if (trimmedCrop && !selectedCrops.includes(trimmedCrop)) {
      setSelectedCrops([...selectedCrops, trimmedCrop]);
      setCustomCropInput('');
      setShowCustomCropInput(false);
      setShowCropSuggestions(false);
    }
  };

  // Get search suggestions
  const getSearchSuggestions = () => {
    if (!searchInput.trim()) return [];
    return allSearchOptions.filter(option => 
      option.value.toLowerCase().includes(searchInput.toLowerCase())
    ).slice(0, 8); // Limit to 8 suggestions
  };
  
  const handleSearchSelect = (value, type) => {
    setSearchInput(value);
    setShowSearchSuggestions(false);
    // Apply search filter based on type
    if (type === 'location' && !selectedRegions.includes(value)) {
      setSelectedRegions([...selectedRegions, value]);
    } else if (type === 'crop' && !selectedCrops.includes(value)) {
      setSelectedCrops([...selectedCrops, value]);
    }
    // For features, just set the search (will be used when backend is ready)
    console.log('Search applied:', { query: value, type });
  };

  const handleReset = () => {
    setSelectedRegions([]);
    setSelectedCrops([]);
    setMinAcres(0);
    setMaxAcres(100);
    setSoilType('Any Soil Type');
    setFilterApplied(false);
    setRegionInput('');
    setCustomCropInput('');
    setSearchInput('');
    setShowRegionSuggestions(false);
    setShowCropSuggestions(false);
    setShowSearchSuggestions(false);
  };

  const handleUpdateResults = () => {
    setFilterApplied(true);
    // In the future, this will trigger an API call with the filter parameters
    console.log('Filters Applied:', {
      regions: selectedRegions,
      crops: selectedCrops,
      minAcres,
      maxAcres,
      soilType
    });
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
          title="Find Land"
          subtitle="Browse available leasing opportunities matched to your preferences"
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
            <div className="relative w-64 lg:w-80 hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
              <input 
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                onFocus={() => setShowSearchSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/20 focus:border-primary-dark transition-colors text-gray-700 placeholder-gray-400" 
                placeholder="Search location, crop, or keyword..." 
                type="text"
              />
              
              {/* Search Suggestions Dropdown */}
              {showSearchSuggestions && getSearchSuggestions().length > 0 && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto">
                  {getSearchSuggestions().map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearchSelect(option.value, option.type)}
                      className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 group-hover:text-primary-dark font-medium">
                          {option.value}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          option.type === 'location' 
                            ? 'bg-blue-100 text-blue-700' 
                            : option.type === 'crop'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {option.type === 'location' ? '📍 Location' : option.type === 'crop' ? '🌾 Crop' : '⚡ Feature'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          }
        />

        <div className="flex-1 overflow-hidden flex">
          {/* Filter Sidebar */}
          <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto p-6 flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-lg">
                <Sliders className="text-primary-dark" size={20} />
                Farm Preferences
              </h3>
              <button 
                onClick={handleReset}
                className="text-xs font-semibold text-primary-dark hover:text-emerald-700 transition-colors"
              >
                Reset
              </button>
            </div>
            <p className="text-xs text-gray-500 -mt-4 leading-relaxed">
              Adjust these settings to filter the land listings automatically.
            </p>

            {/* Preferred Regions */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Preferred Regions</label>
              
              {/* Selected Regions */}
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedRegions.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No regions selected yet. Start typing below to add regions.</p>
                ) : (
                  selectedRegions.map(region => (
                    <div key={region} className="inline-flex items-center bg-emerald-50 text-primary-dark px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-200/50">
                      {region}
                      <button onClick={() => removeRegion(region)} className="ml-1.5 hover:text-emerald-800">
                        <X size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              {/* Region Input with Autocomplete */}
              <div className="relative">
                <input
                  type="text"
                  value={regionInput}
                  onChange={(e) => {
                    setRegionInput(e.target.value);
                    setShowRegionSuggestions(true);
                  }}
                  onFocus={() => setShowRegionSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowRegionSuggestions(false), 200)}
                  placeholder="Type to add region (e.g., Rift Valley)..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/20 focus:border-primary-dark"
                />
                
                {/* Suggestions Dropdown */}
                {showRegionSuggestions && getRegionSuggestions().length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {getRegionSuggestions().map(region => (
                      <button
                        key={region}
                        onClick={() => addRegion(region)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-primary-dark transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* AI Recommended Crops */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">AI Recommended Crops</label>
                <span className="flex items-center text-[10px] text-earth-brown bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Sparkles size={14} className="mr-1 text-amber-600" />
                  Gemini AI
                </span>
              </div>
              <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/50 rounded-xl p-3 border border-amber-100">
                <p className="text-[10px] text-gray-500 mb-2.5">
                  {selectedRegions.length > 0 ? (
                    <>
                      Based on soil data & climate history for <span className="font-semibold text-earth-brown">{selectedRegions.join(', ')}</span>:
                    </>
                  ) : (
                    'Select preferred regions above to get AI-powered crop recommendations'
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {aiRecommendedCrops.map(crop => (
                    <div 
                      key={crop}
                      className="inline-flex items-center bg-white text-earth-brown px-3 py-1.5 rounded-full text-xs font-medium border border-gray-200 shadow-sm"
                    >
                      <Sparkles size={14} className="mr-1.5 text-amber-600" />
                      {crop}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Acreage */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Target Acreage</label>
              
              {/* Visual Range Display */}
              <div className="relative pt-1 pb-2">
                <div className="h-1.5 bg-gray-200 rounded-full w-full"></div>
                <div 
                  className="absolute top-1 h-1.5 bg-emerald-200 rounded-full"
                  style={{
                    left: `${minAcres}%`,
                    right: `${100 - maxAcres}%`
                  }}
                ></div>
              </div>
              
              {/* Range Sliders */}
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-2">Min Acres: {minAcres}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={minAcres}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value <= maxAcres) {
                        setMinAcres(value);
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-dark"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-2">Max Acres: {maxAcres}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={maxAcres}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= minAcres) {
                        setMaxAcres(value);
                      }
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-dark"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between gap-4">
                <div className="w-full">
                  <label className="text-[10px] text-gray-400 block mb-1">Min (Acres)</label>
                  <input 
                    className="w-full text-center py-1.5 px-2 text-sm border border-gray-200 bg-white rounded-lg text-gray-700 focus:border-primary-dark focus:ring-0" 
                    type="number" 
                    min="0"
                    value={minAcres}
                    onChange={(e) => setMinAcres(Number(e.target.value))}
                  />
                </div>
                <span className="text-gray-300 font-light">—</span>
                <div className="w-full">
                  <label className="text-[10px] text-gray-400 block mb-1">Max (Acres)</label>
                  <input 
                    className="w-full text-center py-1.5 px-2 text-sm border border-gray-200 bg-white rounded-lg text-gray-700 focus:border-primary-dark focus:ring-0" 
                    type="number" 
                    min="0"
                    value={maxAcres}
                    onChange={(e) => setMaxAcres(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            {/* Soil Type */}
            <div className="space-y-3 mb-6">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Soil Type Preference</label>
              <div className="relative">
                <select 
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-sm focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark cursor-pointer"
                >
                  <option>Any Soil Type</option>
                  <option>Volcanic Loam</option>
                  <option>Red Clay</option>
                  <option>Sandy Loam</option>
                  <option>Black Cotton</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" size={20} />
              </div>
            </div>

            <button 
              onClick={handleUpdateResults}
              className="mt-auto w-full bg-primary-dark hover:bg-emerald-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-forest-green/10 transition-all hover:shadow-xl active:scale-[0.98]"
            >
              {filterApplied ? '✓ Filters Applied' : 'Update Results'}
            </button>
          </aside>

          {/* Land Listings */}
          <div className="flex-1 bg-background-light p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">14 Land Listings Found</h3>
                {filterApplied && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Active filters applied
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Sort by:</span>
                <div className="relative group">
                  <button className="flex items-center space-x-1 text-sm font-medium text-gray-700 bg-white px-3 py-1.5 rounded-lg border border-transparent hover:border-gray-200 transition-all">
                    <span>Recommended</span>
                    <ChevronDown size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Land Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {lands.map(land => (
                <div key={land.id} className="bg-white rounded-2xl shadow-card overflow-hidden group hover:shadow-xl transition-all duration-300 border border-transparent hover:border-primary-dark/20 flex flex-col">
                  <div className="relative h-48">
                    <img alt={land.name} className="w-full h-full object-cover" src={land.image} />
                    <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start bg-gradient-to-b from-black/40 to-transparent">
                      <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-gray-800">{land.acres} Acres</span>
                      <button className="bg-white/20 hover:bg-white/40 backdrop-blur-md p-1.5 rounded-full text-white transition-colors">
                        <Heart size={18} />
                      </button>
                    </div>
                    {land.id === 1 && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
                        <img 
                          alt="Land Owner" 
                          className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover" 
                          src="https://ui-avatars.com/api/?name=John+Doe&background=047857&color=fff&bold=true"
                        />
                      </div>
                    )}
                    <span className={`absolute bottom-3 left-3 ${land.badgeColor} text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide shadow-sm`}>
                      {land.badge}
                    </span>
                  </div>
                  <div className={`${land.id === 1 ? 'pt-10' : 'pt-4'} px-5 pb-5 flex flex-col flex-1`}>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">{land.name}</h4>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin size={14} className="mr-1" />
                        {land.location}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 font-medium">KES</div>
                        <div className="text-sm font-bold text-primary-dark">{land.price}<span className="text-[10px] font-normal text-gray-400">/acre/yr</span></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 mb-4">
                      <div className="text-center">
                        <div className="text-[10px] text-earth-brown uppercase tracking-wide">Soil</div>
                        <div className="text-xs font-semibold text-gray-700">{land.soil}</div>
                      </div>
                      <div className="text-center border-l border-r border-gray-100">
                        <div className="text-[10px] text-earth-brown uppercase tracking-wide">Water</div>
                        <div className="text-xs font-semibold text-gray-700">{land.water}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] text-earth-brown uppercase tracking-wide">Slope</div>
                        <div className="text-xs font-semibold text-gray-700">{land.slope}</div>
                      </div>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      {land.pending ? (
                        <div className="bg-orange-50 px-2 py-1 rounded">
                          <span className="text-[10px] text-orange-600 font-medium">Pending Verification</span>
                        </div>
                      ) : (
                        <div className={`w-8 h-8 rounded-full ${land.matchColor} flex items-center justify-center`}>
                          <span className="text-[10px] font-bold">{land.match}</span>
                        </div>
                      )}
                      <a href="#" className="text-xs font-bold text-primary-dark flex items-center hover:text-emerald-700 transition-colors">
                        View Details 
                        <ArrowRight size={14} className="ml-1" />
                      </a>
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

export default FindLandPage;
