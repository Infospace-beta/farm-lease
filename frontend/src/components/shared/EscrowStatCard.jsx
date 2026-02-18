import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

/**
 * EscrowStatCard Component
 * Displays financial statistics for the Payments & Escrow dashboard
 * Supports different card types with unique styling
 */
const EscrowStatCard = ({ 
  type, 
  title, 
  value, 
  subtitle, 
  trend, 
  trendLabel,
  icon,
  feePercentage,
  onFeeChange
}) => {
  // Render Escrow Total Card (gradient background)
  if (type === 'escrow-total') {
    return (
      <View className="flex-1 min-w-[240px] max-w-[280px]">
        <View className="bg-gradient-to-br from-[#0f392b] to-[#0a261c] p-6 rounded-2xl shadow-xl relative overflow-hidden">
          {/* Background blur effect */}
          <View className="absolute right-0 top-0 h-32 w-32 bg-white opacity-5 rounded-full -mr-10 -mt-10" />
          
          <View className="relative z-10 min-h-[140px] justify-between">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">
                  {title}
                </Text>
                <View className="flex-row items-center gap-2 bg-white/10 self-start px-2 py-0.5 rounded-full">
                  <MaterialIcons name="lock" size={12} color="#13ec80" />
                  <Text className="text-primary text-xs">{subtitle}</Text>
                </View>
              </View>
              <View className="w-10 h-10 rounded-xl bg-white/10 items-center justify-center border border-white/10">
                <MaterialIcons name={icon} size={24} color="#13ec80" />
              </View>
            </View>
            
            <View>
              <Text className="text-3xl font-bold text-white tracking-tight">
                {value}
              </Text>
              {trend && (
                <View className="flex-row items-center gap-2 mt-2">
                  <View className="flex-row items-center">
                    <MaterialIcons name="trending-up" size={14} color="#13ec80" />
                    <Text className="text-primary text-xs ml-1">{trend}</Text>
                  </View>
                  <Text className="text-white/60 text-xs">{trendLabel}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Render Fee Settings Card (with slider)
  if (type === 'fee-settings') {
    return (
      <View className="flex-1 min-w-[240px] max-w-[280px]">
        <View className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
          {/* Background decoration */}
          <View className="absolute right-0 bottom-0 h-24 w-24 bg-purple-50 rounded-full -mr-8 -mb-8" />
          
          <View className="min-h-[140px] justify-between">
            <View className="flex-row justify-between items-start mb-4">
              <Text className="text-gray-600 text-xs font-bold uppercase tracking-widest">
                {title}
              </Text>
              <View className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center">
                <MaterialIcons name={icon} size={24} color="#6B7280" />
              </View>
            </View>
            
            <View className="mt-auto">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-sm font-semibold text-gray-800">{subtitle}</Text>
                <Text className="text-lg font-bold text-[#0f392b]">{value}</Text>
              </View>
              
              {/* Slider */}
              <Slider
                style={{ width: '100%', height: 20 }}
                minimumValue={0}
                maximumValue={20}
                step={1}
                value={feePercentage}
                onValueChange={onFeeChange}
                minimumTrackTintColor="#0f392b"
                maximumTrackTintColor="#E2E8F0"
                thumbTintColor="#0f392b"
              />
              
              <View className="flex-row justify-between mt-1">
                <Text className="text-[10px] text-gray-400">0%</Text>
                <Text className="text-[10px] text-gray-400">20%</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Render standard stat cards (Released Funds, Platform Revenue)
  const bgDecorationColor = type === 'released' ? 'bg-[#5D4037]/5' : 'bg-primary/10';
  const iconBgColor = type === 'released' ? 'bg-[#5D4037]/10' : 'bg-primary/20';
  const iconColor = type === 'released' ? '#5D4037' : '#047857';
  const trendColor = type === 'released' ? 'text-[#0f392b]' : 'text-[#047857]';

  return (
    <View className="flex-1 min-w-[240px] max-w-[280px]">
      <View className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
        {/* Background decoration */}
        <View className={`absolute right-0 bottom-0 h-24 w-24 ${bgDecorationColor} rounded-full -mr-8 -mb-8`} />
        
        <View className="min-h-[140px] justify-between">
          <View className="flex-row justify-between items-start mb-4">
            <Text className={`${type === 'released' ? 'text-[#5D4037]' : 'text-[#0f392b]'} text-xs font-bold uppercase tracking-widest`}>
              {title}
            </Text>
            <View className={`w-10 h-10 rounded-xl ${iconBgColor} items-center justify-center`}>
              <MaterialIcons name={icon} size={24} color={iconColor} />
            </View>
          </View>
          
          <View>
            <Text className="text-3xl font-bold text-gray-800 tracking-tight">
              {value}
            </Text>
            <View className="flex-row items-center gap-2 mt-2">
              {trend && (
                <View className="flex-row items-center">
                  <MaterialIcons name={type === 'released' ? 'check-circle' : 'trending-up'} size={14} color={iconColor} />
                  <Text className={`${trendColor} text-xs font-semibold ml-1`}>{trend}</Text>
                </View>
              )}
              <Text className="text-gray-500 text-xs">{subtitle}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EscrowStatCard;
