import React from 'react';

/**
 * RegionalHotspot Component
 * Displays regional activity with heatmap grid and top regions list
 */
const RegionalHotspot = ({ data }) => {
  // Generate heatmap grid data (simplified representation)
  const generateHeatmapGrid = () => {
    const grid = [];
    const intensities = [
      [10, 20, 5, 60, 30, 20],
      [5, 80, 40, 30, 10, 5],
      [20, 30, 10, 60, 50, 10]
    ];

    intensities.forEach((row, rowIndex) => {
      row.forEach((intensity, colIndex) => {
        grid.push({ rowIndex, colIndex, intensity });
      });
    });

    return grid;
  };

  const heatmapGrid = generateHeatmapGrid();

  const getHeatmapColor = (intensity) => {
    if (intensity >= 70) return 'bg-[#0f392b]/80';
    if (intensity >= 50) return 'bg-[#0f392b]/60';
    if (intensity >= 30) return 'bg-[#0f392b]/40';
    if (intensity >= 20) return 'bg-[#0f392b]/20';
    return 'bg-[#0f392b]/10';
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#5D4037]" style={{ fontFamily: 'Playfair Display' }}>
          Regional Activity Hotspots
        </h3>
        <div className="flex gap-2">
          <div className="px-3 py-1 bg-gray-100 rounded">
            <span className="text-xs text-gray-500 font-medium">Rift Valley</span>
          </div>
          <div className="px-3 py-1 bg-[#0f392b] rounded">
            <span className="text-xs text-white font-medium">Central</span>
          </div>
          <div className="px-3 py-1 bg-gray-100 rounded">
            <span className="text-xs text-gray-500 font-medium">Coastal</span>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Heatmap Grid */}
        <div className="flex-1 bg-blue-50/30 rounded-xl border border-gray-100 p-4 min-h-[250px]">
          <div className="flex flex-wrap">
            {heat mapGrid.map((cell, index) => (
              <button
                key={index}
                className={`${getHeatmapColor(cell.intensity)} rounded m-1 hover:opacity-80`}
                style={{ width: '14%', aspectRatio: 1 }}
              />
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center py-2">
            <span className="text-xs text-gray-400 italic">
              Interactive Region Grid Representation
            </span>
          </div>
        </div>

        {/* Top Regions List */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          {data.map((region) => (
            <div 
              key={region.rank} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: region.color }}
                >
                  <span className="text-white text-xs font-bold">{region.rank}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{region.name}</p>
                  <span className="text-[10px] text-gray-500">{region.leases} Active Leases</span>
                </div>
              </div>
              <span 
                className="font-bold text-sm"
                style={{ color: region.color }}
              >
                {region.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionalHotspot;