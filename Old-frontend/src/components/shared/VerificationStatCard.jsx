import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * VerificationStatCard Component
 * Displays statistics for land verifications with an icon
 * Used in the Land Verifications dashboard
 */
const VerificationStatCard = ({ title, value, subtitle, icon, iconBg, iconColor }) => {
  return (
    <View className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex-row items-center justify-between flex-1">
      <View>
        <Text className="text-[#5D4037] text-xs font-bold uppercase tracking-widest mb-1">
          {title}
        </Text>
        <Text className="text-3xl font-bold text-gray-800">
          {value}
        </Text>
        <Text className="text-xs text-gray-400 mt-1">
          {subtitle}
        </Text>
      </View>
      <View className={`w-12 h-12 rounded-full ${iconBg} items-center justify-center`}>
        <MaterialIcons name={icon} size={24} color={iconColor} />
      </View>
    </View>
  );
};

export default VerificationStatCard;
