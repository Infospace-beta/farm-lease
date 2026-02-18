import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * ComplianceStatCard Component
 * Displays compliance statistics with an icon and optional subtitle icon
 * Used in the Agro-Dealer Oversight dashboard
 */
const ComplianceStatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  iconBg, 
  iconColor,
  subtitleIcon,
  subtitleBg,
  subtitleColor = 'text-gray-500'
}) => {
  return (
    <View className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex-1 min-w-[200px] max-w-[280px] h-36">
      {/* Header with icon */}
      <View className="flex-row justify-between items-start mb-3">
        <Text className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">
          {title}
        </Text>
        <View className={`w-10 h-10 rounded-full ${iconBg} items-center justify-center`}>
          <MaterialIcons name={icon} size={20} color={iconColor} />
        </View>
      </View>

      {/* Value */}
      <Text className="text-3xl font-bold text-gray-800 mb-2">
        {value}
      </Text>

      {/* Subtitle with optional icon */}
      {subtitleBg ? (
        <View className={`flex-row items-center gap-1 ${subtitleBg} self-start px-2 py-0.5 rounded-full`}>
          {subtitleIcon && (
            <MaterialIcons name={subtitleIcon} size={14} color={iconColor} />
          )}
          <Text className={`text-xs font-medium ${subtitleColor}`}>
            {subtitle}
          </Text>
        </View>
      ) : (
        <Text className={`text-xs font-medium ${subtitleColor}`}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

export default ComplianceStatCard;
