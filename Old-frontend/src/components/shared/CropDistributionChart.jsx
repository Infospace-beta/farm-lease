import React from 'react';

/**
 * CropDistributionChart Component
 * Displays crop distribution as a donut chart with legend
 */
const CropDistributionChart = ({ data, totalYield }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-bold text-[#5D4037] mb-1" style={{ fontFamily: 'Playfair Display' }}>
          Top Performing Crops
        </h3>
        <p className="text-xs text-gray-500">
          Based on yield tonnage and market value.
        </p>
      </div>

      {/* Donut Chart (Simplified representation) */}
      <div className="flex items-center justify-center my-4">
        <div className="relative w-48 h-48 rounded-full overflow-hidden">
          {/* Outer ring segments */}
          <div className="absolute inset-0 rounded-full" style={{ backgroundColor: '#E2E8F0' }}>
            {/* Create segments using rotation and clipping */}
            {data.map((crop, index) => {
              const startAngle = data.slice(0, index).reduce((sum, c) => sum + (c.percentage * 3.6), 0);
              const sweepAngle = crop.percentage * 3.6;
              
              return (
                <div
                  key={index}
                  className="absolute inset-0"
                  style={{
                    transform: `rotate(${startAngle}deg)`
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{ 
                      backgroundColor: crop.color,
                      clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Simplified visual representation using quadrants */}
          <div className="absolute inset-0 flex flex-wrap">
            <div className="w-1/2 h-1/2 bg-[#0f392b] rounded-tl-full" />
            <div className="w-1/2 h-1/2 bg-[#5D4037]" />
            <div className="w-1/2 h-1/2 bg-[#13ec80]" />
            <div className="w-1/2 h-1/2 bg-[#E2E8F0] rounded-br-full" />
          </div>

          {/* Center circle with total */}
          <div className="absolute inset-8 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-widest">Total</span>
            <span className="text-xl font-bold text-gray-800">{totalYield}</span>
            <span className="text-[10px] text-gray-400">Tons</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4">
        {data.map((crop, index) => (
          <div key={index} className="flex items-center gap-2 w-[45%]">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: crop.color }}
            />
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-700">{crop.name}</p>
              <span className="text-[10px] text-gray-400">{crop.percentage}% Share</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CropDistributionChart;