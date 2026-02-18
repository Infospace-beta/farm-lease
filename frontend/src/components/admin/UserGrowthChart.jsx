import React from 'react';

/**
 * UserGrowthChart Component
 * Displays user growth with stacked bar chart (farmers vs land owners)
 */
const UserGrowthChart = ({ data }) => {
  // Calculate max total for scaling
  const maxTotal = Math.max(...data.map(d => d.farmers + d.landOwners));

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#5D4037]" style={{ fontFamily: 'Playfair Display' }}>
          User Growth
        </h3>
        <div className="bg-green-50 px-2 py-1 rounded">
          <span className="text-xs font-bold text-green-600">+240 this month</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end justify-between gap-2 pb-2">
        {data.map((item, index) => {
          const total = item.farmers + item.landOwners;
          const heightPercentage = (total / maxTotal) * 100;
          const farmersPercentage = (item.farmers / total) * 100;
          const isLatest = index === data.length - 1;

          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              {/* Stacked Bar */}
              <div 
                className="w-full bg-[#0f392b]/10 rounded-t-md relative overflow-hidden"
                style={{ height: '85%' }}
              >
                {/* Total height bar */}
                <div 
                  className={`absolute bottom-0 w-full ${isLatest ? 'bg-[#047857]' : 'bg-[#5D4037]'} rounded-t-md`}
                  style={{ height: `${heightPercentage}%` }}
                >
                  {/* Farmers portion (bottom) */}
                  <div 
                    className={`absolute bottom-0 w-full ${isLatest ? 'bg-[#047857]' : 'bg-[#5D4037]'} rounded-t-md`}
                    style={{ height: `${farmersPercentage}%` }}
                  />
                </div>
              </div>
              {/* Month label */}
              <span className={`text-[10px] font-bold ${isLatest ? 'text-gray-800' : 'text-gray-400'}`}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#5D4037] rounded" />
          <span className="text-xs text-gray-500">Farmers</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#047857] rounded" />
          <span className="text-xs text-gray-500">Land Owners</span>
        </div>
      </div>
    </div>
  );
};

export default UserGrowthChart;