import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * AnalyticsStatCard Component
 * Displays a key metric with icon, trend indicator, and value
 */
const AnalyticsStatCard = ({ 
  icon, 
  iconBg, 
  iconColor, 
  trend, 
  trendPositive, 
  label, 
  value 
}) => {
  return (
    <View className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
      {/* Icon and Trend */}
      <View className="flex-row justify-between items-start mb-4">
        <View className={`p-2 rounded-lg ${iconBg}`}>
          <MaterialIcons name={icon} size={20} color={iconColor} />
        </View>
        <View className={`px-2 py-1 rounded-full ${trendPositive ? 'bg-green-100' : 'bg-red-100'}`}>
          <Text className={`text-xs font-bold ${trendPositive ? 'text-green-700' : 'text-red-700'}`}>
            {trend}
          </Text>
        </View>
      </View>

      {/* Label and Value */}
      <Text className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">
        {label}
      </Text>
      <Text className="text-2xl font-bold text-[#5D4037]">
        {value}
      </Text>
    </View>
  );
};

export default AnalyticsStatCard;