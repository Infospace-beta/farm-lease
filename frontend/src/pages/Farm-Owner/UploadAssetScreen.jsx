import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const UploadAssetScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    plotTitle: '',
    totalArea: '',
    description: '',
    leasePrice: '',
    leaseDuration: '',
    latitude: '-1.2921',
    longitude: '36.8219',
    amenities: {
      irrigationSystem: false,
      storageFacility: false,
      fencing: false,
      electricity: false,
      roadAccess: false,
      security: false,
    },
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [amenity]: !prev.amenities[amenity],
      },
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      Alert.alert('Success', 'Asset uploaded successfully!');
    }
  };

  const handleCancel = () => {
    Alert.alert('Cancel', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => navigation.goBack() },
    ]);
  };

  const renderStepIndicator = () => {
    const steps = [
      { icon: 'create-outline', label: 'Basic Info' },
      { icon: 'water-outline', label: 'Soil/Climate' },
      { icon: 'camera-outline', label: 'Photos' },
    ];

    return (
      <View className="mb-6">
        <View className="flex-row justify-between items-center px-4">
          {steps.map((step, index) => (
            <View key={index} className="flex-1 items-center">
              <View
                className={`w-10 h-10 rounded-full items-center justify-center ${
                  index + 1 <= currentStep
                    ? 'bg-primary'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                <Ionicons
                  name={step.icon}
                  size={20}
                  color={index + 1 <= currentStep ? '#ffffff' : '#64748b'}
                />
              </View>
              <Text
                className={`text-xs font-semibold mt-2 ${
                  index + 1 <= currentStep
                    ? 'text-primary'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {step.label}
              </Text>
              {index < steps.length - 1 && (
                <View
                  className={`absolute top-5 left-1/2 h-0.5 w-full ${
                    index + 1 < currentStep
                      ? 'bg-primary'
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`}
                  style={{ zIndex: -1 }}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderBasicInfoStep = () => (
    <View className="space-y-6">
      {/* Property Details Card */}
      <View className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
        <View className="flex-row items-center gap-2 mb-5">
          <Ionicons name="information-circle-outline" size={24} color="#047857" />
          <Text className="text-lg font-bold text-earth dark:text-white">
            Property Details
          </Text>
        </View>

        {/* Plot Title */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Plot Title / Name
          </Text>
          <TextInput
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-white"
            placeholder="e.g. North Valley Acreage"
            placeholderTextColor="#94a3b8"
            value={formData.plotTitle}
            onChangeText={(text) => updateFormData('plotTitle', text)}
          />
        </View>

        {/* Total Area */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Total Area (Acres)
          </Text>
          <View className="relative">
            <TextInput
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 pr-20 text-slate-800 dark:text-white"
              placeholder="0.0"
              placeholderTextColor="#94a3b8"
              keyboardType="decimal-pad"
              value={formData.totalArea}
              onChangeText={(text) => updateFormData('totalArea', text)}
            />
            <Text className="absolute right-4 top-3.5 text-slate-500 text-sm">
              Acres
            </Text>
          </View>
        </View>

        {/* Description */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Description
          </Text>
          <TextInput
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-slate-800 dark:text-white"
            placeholder="Describe the terrain, access to water, previous crops grown, etc."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={formData.description}
            onChangeText={(text) => updateFormData('description', text)}
            maxLength={500}
          />
          <Text className="text-xs text-slate-500 text-right mt-1">
            {formData.description.length}/500 characters
          </Text>
        </View>

        {/* Lease Price */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Desired Lease Price (Monthly)
          </Text>
          <View className="relative">
            <Text className="absolute left-4 top-3.5 text-slate-500 text-sm z-10">
              Ksh
            </Text>
            <TextInput
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 pl-14 pr-4 py-3 text-slate-800 dark:text-white"
              placeholder="0.00"
              placeholderTextColor="#94a3b8"
              keyboardType="decimal-pad"
              value={formData.leasePrice}
              onChangeText={(text) => updateFormData('leasePrice', text)}
            />
          </View>
        </View>

        {/* Preferred Duration */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Preferred Duration
          </Text>
          <TouchableOpacity className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 flex-row justify-between items-center">
            <Text className="text-slate-800 dark:text-white">
              {formData.leaseDuration || 'Select duration'}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Amenities */}
        <View>
          <Text className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
            Amenities & Features
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {[
              { key: 'irrigationSystem', label: 'Irrigation System' },
              { key: 'storageFacility', label: 'Storage Facility' },
              { key: 'fencing', label: 'Fencing' },
              { key: 'electricity', label: 'Electricity' },
              { key: 'roadAccess', label: 'Road Access' },
              { key: 'security', label: 'Security' },
            ].map((amenity) => (
              <TouchableOpacity
                key={amenity.key}
                onPress={() => updateAmenity(amenity.key)}
                className={`flex-row items-center gap-2 px-4 py-3 rounded-lg border ${
                  formData.amenities[amenity.key]
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
                style={{ width: '48%' }}
              >
                <View
                  className={`w-5 h-5 rounded border-2 items-center justify-center ${
                    formData.amenities[amenity.key]
                      ? 'border-primary bg-primary'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}
                >
                  {formData.amenities[amenity.key] && (
                    <Ionicons name="checkmark" size={14} color="#ffffff" />
                  )}
                </View>
                <Text className="text-sm text-slate-700 dark:text-slate-300 flex-shrink">
                  {amenity.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Location Card */}
      <View className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
        <View className="flex-row items-center gap-2 mb-4">
          <Ionicons name="location-outline" size={24} color="#047857" />
          <Text className="text-lg font-bold text-earth dark:text-white">
            Location
          </Text>
        </View>
        <Text className="text-sm text-slate-500 mb-4">
          Pinpoint your land's location. This helps us suggest suitable crops.
        </Text>

        {/* Map Placeholder */}
        <View className="w-full h-64 rounded-xl bg-slate-200 dark:bg-slate-700 items-center justify-center mb-4 border border-slate-300 dark:border-slate-600">
          <Ionicons name="location" size={48} color="#ef4444" />
          <Text className="text-xs font-bold text-slate-800 dark:text-white mt-2 bg-white dark:bg-slate-800 px-3 py-1 rounded-full">
            Drag to adjust
          </Text>
        </View>

        {/* Coordinates */}
        <View className="flex-row gap-2 mb-3">
          <TextInput
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300"
            placeholder="Latitude"
            value={formData.latitude}
            editable={false}
          />
          <TextInput
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-600 dark:text-slate-300"
            placeholder="Longitude"
            value={formData.longitude}
            editable={false}
          />
        </View>

        <TouchableOpacity className="w-full py-3 border border-dashed border-primary/50 rounded-lg flex-row items-center justify-center gap-2">
          <Ionicons name="navigate-circle-outline" size={20} color="#047857" />
          <Text className="text-primary text-sm font-medium">
            Use Current Location
          </Text>
        </TouchableOpacity>

        {/* AI Tip */}
        <View className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
          <View className="flex-row gap-3">
            <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
            <View className="flex-1">
              <Text className="text-sm font-bold text-slate-800 dark:text-slate-200">
                AI Tip
              </Text>
              <Text className="text-xs text-slate-500 mt-1 leading-relaxed">
                Ensure accurate coordinates. We use satellite data to analyze soil
                health and water retention automatically.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSoilClimateStep = () => (
    <View className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
      <Text className="text-lg font-bold text-earth dark:text-white mb-4">
        Soil & Climate Information
      </Text>
      <Text className="text-sm text-slate-500">
        This step will contain soil type, climate data, and environmental factors.
      </Text>
    </View>
  );

  const renderPhotosStep = () => (
    <View className="bg-white dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700">
      <Text className="text-lg font-bold text-earth dark:text-white mb-4">
        Upload Photos
      </Text>
      <Text className="text-sm text-slate-500">
        This step will allow you to upload photos of your land.
      </Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white dark:bg-surface-dark px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#047857" />
          </TouchableOpacity>
          <View className="flex-row items-center gap-1">
            <Text className="text-sm text-slate-500">Assets</Text>
            <Ionicons name="chevron-forward" size={16} color="#64748b" />
            <Text className="text-sm text-slate-800 dark:text-slate-200 font-medium">
              New Listing
            </Text>
          </View>
        </View>
        <Text className="text-2xl font-bold text-earth dark:text-white">
          Upload New Asset
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Provide details about your land to attract the best tenants.
        </Text>
      </View>

      {/* Step Indicator */}
      <View className="bg-white dark:bg-surface-dark px-5 py-6 border-b border-slate-200 dark:border-slate-700">
        {renderStepIndicator()}
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-5 py-6">
        {currentStep === 1 && renderBasicInfoStep()}
        {currentStep === 2 && renderSoilClimateStep()}
        {currentStep === 3 && renderPhotosStep()}
      </ScrollView>

      {/* Footer Buttons */}
      <View className="bg-white dark:bg-surface-dark px-5 py-4 border-t border-slate-200 dark:border-slate-700 flex-row justify-between items-center">
        <TouchableOpacity
          onPress={handleCancel}
          className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-600"
        >
          <Text className="text-slate-600 dark:text-slate-300 font-medium">
            Cancel
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNextStep}
          className="px-8 py-3 rounded-lg bg-primary flex-row items-center gap-2 shadow-lg"
        >
          <Text className="text-white font-medium">
            {currentStep === 3 ? 'Submit' : 'Next Step'}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UploadAssetScreen;
