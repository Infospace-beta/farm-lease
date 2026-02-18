import React from 'react';

const StatCard = ({ title, value, change, icon, color, isNegative = false }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
    },
    red: {
      bg: 'bg-red-50',
      text: 'text-red-600',
    },
  };

  const selectedColor = colorClasses[color] || colorClasses.blue;
  const changeColor = isNegative ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50';

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      {/* Icon and Change Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${selectedColor.bg}`}>
          <span className="material-icons-round text-2xl" style={{ color: getIconColor(color) }}>{icon}</span>
        </div>
        <div className={`px-2 py-1 rounded-full ${changeColor}`}>
          <span className={`text-xs font-bold ${changeColor}`}>
            {change}
          </span>
        </div>
      </div>

      {/* Value */}
      <h3 className="text-2xl font-bold text-gray-800 mb-1">
        {value}
      </h3>

      {/* Title */}
      <p className="text-sm text-gray-500 font-medium">
        {title}
      </p>
    </div>
  );
};

// Helper function to get icon color
const getIconColor = (color) => {
  const colors = {
    blue: '#2563EB',
    emerald: '#059669',
    amber: '#D97706',
    red: '#DC2626',
  };
  return colors[color] || colors.blue;
};

export default StatCard;
