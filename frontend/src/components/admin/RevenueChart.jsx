import React from 'react';

/**
 * RevenueChart Component
 * Displays revenue trends in a simplified line chart representation
 */
const RevenueChart = ({ data }) => {
  // Calculate max value for scaling
  const maxValue = Math.max(...data.map(d => d.platformFees));

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#5D4037]" style={{ fontFamily: 'Playfair Display' }}>
          Revenue Trends (Ksh)
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#0f392b]" />
            <span className="text-xs text-gray-500">Platform Fees</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-[#13ec80]" />
            <span className="text-xs text-gray-500">Escrow Holds</span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-64 relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2">
          <span className="text-[10px] text-gray-400">2M</span>
          <span className="text-[10px] text-gray-400">1.5M</span>
          <span className="text-[10px] text-gray-400">1M</span>
          <span className="text-[10px] text-gray-400">0.5M</span>
          <span className="text-[10px] text-gray-400">0</span>
        </div>

        {/* Chart bars/lines representation */}
        <div className="flex-1 pl-12 pt-2 pb-8">
          <div className="overflow-x-auto">
            <div className="flex items-end gap-8 h-full">
              {data.map((item, index) => {
                const heightPercentage = (item.platformFees / maxValue) * 100;
                return (
                  <div key={index} className="flex flex-col items-center gap-2">
                    {/* Bar representation */}
                    <div className="w-12 flex items-end justify-end" style={{ height: '85%' }}>
                      <div 
                        className="w-full bg-[#0f392b]/20 rounded-t-lg relative"
                        style={{ height: `${heightPercentage}%` }}
                      >
                        <div 
                          className="absolute bottom-0 w-full bg-[#0f392b] rounded-t-lg"
                          style={{ height: '100%' }}
                        />
                      </div>
                    </div>
                    {/* Month label */}
                    <span className="text-[10px] text-gray-400 font-medium">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 pl-12">
          {[0, 25, 50, 75, 100].map((line, index) => (
            <div 
              key={index} 
              className="absolute left-12 right-0 h-px bg-gray-100"
              style={{ bottom: `${line}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;