import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Download, ChevronLeft, ChevronRight, Coffee, Wheat, Leaf, Nut, CupSoda } from 'lucide-react';
import LesseeSidebar from '../../components/layout/LesseeSidebar';
import LesseeHeader from '../../components/layout/LesseeHeader';

const AIPredictorHistory = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Sample notifications (same structure as other pages)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'History Updated',
      message: 'Your prediction history has been updated with latest analysis.',
      timestamp: new Date(Date.now() - 20 * 60000),
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Export Complete',
      message: 'Your CSV export has been downloaded successfully.',
      timestamp: new Date(Date.now() - 4 * 3600000),
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Data Archived',
      message: 'Predictions older than 12 months have been archived.',
      timestamp: new Date(Date.now() - 2 * 86400000),
      read: true
    },
    {
      id: 4,
      type: 'warning',
      title: 'Storage Limit',
      message: 'You are approaching your prediction history storage limit.',
      timestamp: new Date(Date.now() - 5 * 86400000),
      read: true
    }
  ]);

  // Sample history data
  const historyData = [
    {
      id: 1,
      date: 'Oct 24, 2023',
      time: '10:42 AM',
      mode: 'Regional Data',
      modeType: 'regional',
      searchQuery: 'Nakuru, Rift Valley',
      crop: 'Arabica Coffee',
      cropIcon: Coffee,
      cropColor: 'orange',
      match: 94,
      sampleId: null
    },
    {
      id: 2,
      date: 'Oct 20, 2023',
      time: '03:15 PM',
      mode: 'Manual Entry',
      modeType: 'manual',
      searchQuery: 'pH 6.2, N:High, P:Med',
      crop: 'Hybrid Maize 614',
      cropIcon: Wheat,
      cropColor: 'yellow',
      match: 89,
      sampleId: 'Soil Sample #4021'
    },
    {
      id: 3,
      date: 'Oct 12, 2023',
      time: '09:30 AM',
      mode: 'Regional Data',
      modeType: 'regional',
      searchQuery: 'Trans-Nzoia County',
      crop: 'Hass Avocado',
      cropIcon: Leaf,
      cropColor: 'green',
      match: 76,
      sampleId: null
    },
    {
      id: 4,
      date: 'Sep 28, 2023',
      time: '11:15 AM',
      mode: 'Regional Data',
      modeType: 'regional',
      searchQuery: 'Kiambu, Central',
      crop: 'Macadamia Nuts',
      cropIcon: Nut,
      cropColor: 'red',
      match: 91,
      sampleId: null
    },
    {
      id: 5,
      date: 'Sep 15, 2023',
      time: '02:45 PM',
      mode: 'Manual Entry',
      modeType: 'manual',
      searchQuery: 'pH 5.5, N:Low, P:High',
      crop: 'Purple Tea',
      cropIcon: CupSoda,
      cropColor: 'purple',
      match: 85,
      sampleId: 'Soil Sample #3892'
    }
  ];

  const handleMarkNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleViewAllNotifications = () => {
    console.log('View all notifications');
  };

  const handleExportCSV = () => {
    console.log('Exporting CSV...');
    // Add CSV export logic here
  };

  const getColorClasses = (color) => {
    const colorMap = {
      orange: 'bg-orange-100 text-orange-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      green: 'bg-emerald-100 text-emerald-700',
      red: 'bg-rose-100 text-rose-700',
      purple: 'bg-purple-100 text-purple-700'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-700';
  };

  const getMatchColor = (match) => {
    if (match >= 90) return 'text-forest-green';
    if (match >= 80) return 'text-emerald-600';
    if (match >= 70) return 'text-yellow-600';
    return 'text-orange-600';
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
          title="AI Crop Predictor"
          subtitle="Review past soil and climate analysis results to track trends over time."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          notifications={notifications}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onViewAllNotifications={handleViewAllNotifications}
          rightContent={
            <div className="flex bg-gray-50 rounded-lg border border-gray-200 p-1 shadow-sm">
              <button
                onClick={() => navigate('/lessee/recommendations')}
                className="px-3 lg:px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-md text-xs font-bold uppercase tracking-wide transition-all"
              >
                Predictor
              </button>
              <button
                className="px-3 lg:px-4 py-2 bg-forest-green text-white rounded-md text-xs font-bold uppercase tracking-wide shadow-sm"
              >
                History
              </button>
            </div>
          }
        />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1600px] mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-soft overflow-hidden flex flex-col">
        {/* Header Section */}
        <div className="p-6 lg:p-8 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <div>
            <h3 className="font-bold text-2xl text-earth-brown mb-1">Prediction History</h3>
            <p className="text-sm text-gray-500">Showing last 6 months of analysis</p>
          </div>
          
          {/* Filters and Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by crop, region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 text-sm transition-all outline-none"
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Filter by date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full sm:w-48 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-forest-green focus:ring-2 focus:ring-forest-green/20 text-sm transition-all outline-none"
              />
            </div>

            {/* Export Button */}
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-forest-green text-white rounded-xl shadow-md hover:bg-forest-green/90 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-6 lg:px-8 py-4">Date</th>
                <th className="px-6 py-4">Analysis Mode</th>
                <th className="px-6 py-4">Search Query</th>
                <th className="px-6 py-4">Top Recommendation</th>
                <th className="px-6 py-4 text-center">Match %</th>
                <th className="px-6 lg:px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {historyData.map((item) => {
                const CropIcon = item.cropIcon;
                return (
                  <tr key={item.id} className="group hover:bg-emerald-50/30 transition-colors">
                    {/* Date Column */}
                    <td className="px-6 lg:px-8 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{item.date}</span>
                        <span className="text-xs text-gray-400">{item.time}</span>
                      </div>
                    </td>

                    {/* Analysis Mode Column */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        item.modeType === 'regional'
                          ? 'bg-blue-50 text-blue-700 border border-blue-100'
                          : 'bg-purple-50 text-purple-700 border border-purple-100'
                      }`}>
                        <span className="w-3.5 h-3.5 flex items-center justify-center">
                          {item.modeType === 'regional' ? '🌍' : '🧪'}
                        </span>
                        {item.mode}
                      </span>
                    </td>

                    {/* Search Query Column */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-medium">{item.searchQuery}</span>
                        {item.sampleId && (
                          <span className="text-xs text-gray-400">{item.sampleId}</span>
                        )}
                      </div>
                    </td>

                    {/* Top Recommendation Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getColorClasses(item.cropColor)}`}>
                          <CropIcon size={18} />
                        </div>
                        <span className="font-bold text-earth-brown">{item.crop}</span>
                      </div>
                    </td>

                    {/* Match % Column */}
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold font-display ${getMatchColor(item.match)}`}>
                        {item.match}%
                      </span>
                    </td>

                    {/* Action Column */}
                    <td className="px-6 lg:px-8 py-4 text-right">
                      <button
                        onClick={() => console.log('View report', item.id)}
                        className="text-forest-green font-bold text-sm hover:text-emerald-600 transition-colors inline-flex items-center gap-1 hover:gap-2 group-hover:underline"
                      >
                        View Full Report
                        <ChevronRight size={16} className="transition-all" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="mt-auto border-t border-gray-100 p-4 lg:p-6 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">Showing 1-5 of 24 results</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-forest-green hover:border-forest-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border font-bold text-xs transition-colors ${
                currentPage === 1
                  ? 'border-forest-green bg-forest-green text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:text-forest-green hover:border-forest-green'
              }`}
            >
              1
            </button>
            
            <button
              onClick={() => setCurrentPage(2)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border font-bold text-xs transition-colors ${
                currentPage === 2
                  ? 'border-forest-green bg-forest-green text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:text-forest-green hover:border-forest-green'
              }`}
            >
              2
            </button>
            
            <button
              onClick={() => setCurrentPage(3)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border font-bold text-xs transition-colors ${
                currentPage === 3
                  ? 'border-forest-green bg-forest-green text-white shadow-md'
                  : 'border-gray-200 bg-white text-gray-600 hover:text-forest-green hover:border-forest-green'
              }`}
            >
              3
            </button>
            
            <span className="text-gray-400 text-xs">...</span>
            
            <button
              onClick={() => setCurrentPage(5)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:text-forest-green hover:border-forest-green transition-colors font-bold text-xs"
            >
              5
            </button>
            
            <button
              onClick={() => setCurrentPage(Math.min(5, currentPage + 1))}
              disabled={currentPage === 5}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:text-forest-green hover:border-forest-green transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIPredictorHistory;
