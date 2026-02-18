import { useState } from 'react';
import { Link } from 'react-router-dom';
import FarmOwnerSidebar from '../../components/layout/FarmOwnerSidebar';

const AddLandPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    plotTitle: '',
    totalArea: '',
    description: '',
    leasePrice: '',
    leaseDuration: '',
    titleDeedNumber: '',
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
    // Soil & Climate Data
    soilPH: 6.5,
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    soilMoisture: 40,
    avgTemperature: '',
    avgRainfall: '',
    isClimateAutofilled: false,
  });

  const [uploadedPhotos, setUploadedPhotos] = useState([
    {
      id: `photo-${Date.now()}-1`,
      url: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      alt: 'Land view 1',
      isCover: true,
    },
    {
      id: `photo-${Date.now()}-2`,
      url: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400',
      alt: 'Soil detail',
      isCover: false,
    },
    {
      id: `photo-${Date.now()}-3`,
      url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
      alt: 'Irrigation',
      isCover: false,
    },
  ]);
  const [photoIdCounter, setPhotoIdCounter] = useState(4);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAmenityChange = (amenity) => {
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
      handleSubmit();
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAutoFillClimate = () => {
    if (!formData.isClimateAutofilled) {
      // Simulate fetching climate data based on location
      setFormData((prev) => ({
        ...prev,
        avgTemperature: '26.5',
        avgRainfall: '940',
        isClimateAutofilled: true,
      }));
    } else {
      // Clear autofilled data
      setFormData((prev) => ({
        ...prev,
        avgTemperature: '',
        avgRainfall: '',
        isClimateAutofilled: false,
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const newPhotos = files.map((file, index) => ({
        id: `photo-${Date.now()}-${photoIdCounter + index}`,
        url: URL.createObjectURL(file),
        alt: file.name,
        isCover: false,
      }));
      setUploadedPhotos((prev) => [...prev, ...newPhotos]);
      setPhotoIdCounter((prev) => prev + files.length);
      setIsUploading(false);
    }, 2000);
  };

  const handleRemovePhoto = (photoId) => {
    setUploadedPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  const handleSetCover = (photoId) => {
    setUploadedPhotos((prev) =>
      prev.map((photo) => ({
        ...photo,
        isCover: photo.id === photoId,
      }))
    );
  };

  const handleSubmit = () => {
    // TODO: Submit all form data to backend
    console.log('Form Data:', formData);
    console.log('Photos:', uploadedPhotos);
    alert('Land submitted for verification! (To be implemented)');
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
      window.history.back();
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Sidebar */}
      <FarmOwnerSidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background-light p-6 lg:p-10 dark:bg-background-dark">
        <div className="mx-auto max-w-5xl">
          {/* Page Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold tracking-tight text-earth font-serif dark:text-white">
              {currentStep === 1 && 'Upload New Land'}
              {currentStep === 2 && 'Soil & Climate Data'}
              {currentStep === 3 && 'Upload Photos'}
            </h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">
              {currentStep === 1 && 'Provide details about your land to attract the best tenants.'}
              {currentStep === 2 && 'Provide environmental data for accurate AI crop suggestions.'}
              {currentStep === 3 && 'Add photos to showcase your land\'s potential to prospective lessees.'}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="relative flex justify-between">
              {/* Step 1 - Basic Info */}
              <div className="flex flex-col items-center relative z-10">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  currentStep >= 1 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
                } ring-4 ring-background-light dark:ring-background-dark shadow-md transition-all`}>
                  <span className="material-symbols-outlined text-lg">
                    {currentStep > 1 ? 'check' : 'edit_note'}
                  </span>
                </div>
                <span className={`mt-2 text-xs ${currentStep === 1 ? 'font-bold' : 'font-medium'} ${
                  currentStep >= 1 ? 'text-primary' : 'text-slate-500'
                }`}>
                  Basic Info
                </span>
              </div>

              {/* Progress Line */}
              <div className="absolute top-5 left-0 h-[2px] w-full bg-slate-200 dark:bg-slate-700 -z-0">
                <div 
                  className="h-full bg-primary transition-all duration-500" 
                  style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                />
              </div>

              {/* Step 2 - Soil/Climate */}
              <div className="flex flex-col items-center relative z-10 group">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  currentStep >= 2 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
                } ring-4 ring-background-light dark:ring-background-dark dark:bg-slate-700 dark:text-slate-400 group-hover:bg-slate-300 transition-colors shadow-md`}>
                  <span className="material-symbols-outlined text-lg">
                    {currentStep > 2 ? 'check' : 'water_drop'}
                  </span>
                </div>
                <span className={`mt-2 text-xs ${currentStep === 2 ? 'font-bold' : 'font-medium'} ${
                  currentStep >= 2 ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  Soil/Climate
                </span>
              </div>

              {/* Step 3 - Photos */}
              <div className="flex flex-col items-center relative z-10 group">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  currentStep >= 3 ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'
                } ring-4 ring-background-light dark:ring-background-dark dark:bg-slate-700 dark:text-slate-400 group-hover:bg-slate-300 transition-colors shadow-md`}>
                  <span className="material-symbols-outlined text-lg">photo_camera</span>
                </div>
                <span className={`mt-2 text-xs ${currentStep === 3 ? 'font-bold' : 'font-medium'} ${
                  currentStep >= 3 ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  Photos
                </span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Property Details */}
              <div className="lg:col-span-2 space-y-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-surface-dark">
                  <h3 className="text-lg font-bold text-earth mb-6 flex items-center gap-2 dark:text-white">
                    <span className="material-symbols-outlined text-primary">info</span>
                    Property Details
                  </h3>

                  <div className="space-y-6">
                    {/* Plot Title & Total Area */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="plotTitle">
                          Plot Title / Name
                        </label>
                        <input
                          className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-slate-500 transition-shadow"
                          id="plotTitle"
                          name="plotTitle"
                          placeholder="e.g. North Valley Acreage"
                          type="text"
                          value={formData.plotTitle}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="totalArea">
                          Total Area (Acres)
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-slate-500 transition-shadow pr-16"
                            id="totalArea"
                            name="totalArea"
                            placeholder="0.0"
                            type="number"
                            value={formData.totalArea}
                            onChange={handleInputChange}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-slate-500 sm:text-sm">Acres</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="description">
                        Description
                      </label>
                      <textarea
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-slate-500 transition-shadow resize-none"
                        id="description"
                        name="description"
                        placeholder="Describe the terrain, access to water, previous crops grown, etc."
                        rows="4"
                        maxLength="500"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                      <p className="mt-1 text-xs text-slate-500 text-right">
                        {formData.description.length}/500 characters
                      </p>
                    </div>

                    {/* Title Deed Number */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="titleDeedNumber">
                        Title Deed Number
                        <span className="ml-2 text-xs text-amber-600 dark:text-amber-500 font-normal">
                          (For Admin Verification Only)
                        </span>
                      </label>
                      <input
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-slate-500 transition-shadow"
                        id="titleDeedNumber"
                        name="titleDeedNumber"
                        placeholder="e.g. CR/12345/6789"
                        type="text"
                        value={formData.titleDeedNumber}
                        onChange={handleInputChange}
                      />
                      <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-amber-600">lock</span>
                        This information is confidential and will only be visible to administrators for verification purposes.
                      </p>
                    </div>

                    {/* Lease Price & Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="leasePrice">
                          Desired Lease Price (Monthly)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-slate-500 sm:text-sm">Ksh</span>
                          </div>
                          <input
                            className="w-full rounded-lg border-slate-300 pl-12 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-slate-500 transition-shadow"
                            id="leasePrice"
                            name="leasePrice"
                            placeholder="0.00"
                            type="number"
                            value={formData.leasePrice}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="leaseDuration">
                          Preferred Duration
                        </label>
                        <select
                          className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white transition-shadow"
                          id="leaseDuration"
                          name="leaseDuration"
                          value={formData.leaseDuration}
                          onChange={handleInputChange}
                        >
                          <option value="">Select duration</option>
                          <option value="6">6 Months</option>
                          <option value="12">1 Year</option>
                          <option value="24">2 Years</option>
                          <option value="60">5+ Years</option>
                        </select>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Amenities &amp; Features
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { key: 'irrigationSystem', label: 'Irrigation System' },
                          { key: 'storageFacility', label: 'Storage Facility' },
                          { key: 'fencing', label: 'Fencing' },
                          { key: 'electricity', label: 'Electricity' },
                          { key: 'roadAccess', label: 'Road Access' },
                          { key: 'security', label: 'Security' },
                        ].map((amenity) => (
                          <label
                            key={amenity.key}
                            className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all dark:border-slate-700 dark:hover:border-primary/50 dark:hover:bg-slate-800"
                          >
                            <input
                              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600"
                              type="checkbox"
                              checked={formData.amenities[amenity.key]}
                              onChange={() => handleAmenityChange(amenity.key)}
                            />
                            <span className="text-sm text-slate-700 dark:text-slate-300">
                              {amenity.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all hover:translate-x-1"
                    type="button"
                    onClick={handleNextStep}
                  >
                    Next Step
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Right Column - Location */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-surface-dark h-fit">
                  <h3 className="text-lg font-bold text-earth mb-4 flex items-center gap-2 dark:text-white">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    Location
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    Pinpoint your land's location. This helps us suggest suitable crops.
                  </p>

                  {/* Map Placeholder */}
                  <div className="relative w-full h-64 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-slate-200 dark:bg-slate-700 group cursor-crosshair">
                    <div className="absolute inset-0 bg-slate-500/10 group-hover:bg-transparent transition-colors"></div>
                    <div className="absolute top-1/4 left-1/3 h-3 w-3 rounded-full bg-slate-400 opacity-50"></div>
                    <div className="absolute bottom-1/3 right-1/4 h-3 w-3 rounded-full bg-slate-400 opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <span className="material-symbols-outlined text-4xl text-red-500 drop-shadow-md animate-bounce">
                        location_on
                      </span>
                      <span className="bg-white text-xs font-bold px-2 py-0.5 rounded shadow-sm text-slate-800 whitespace-nowrap -mt-1 dark:bg-slate-800 dark:text-white">
                        Drag to adjust
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 flex flex-col gap-1">
                      <button className="bg-white p-1.5 rounded-md shadow-sm text-slate-600 hover:text-primary hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300">
                        <span className="material-symbols-outlined text-lg">add</span>
                      </button>
                      <button className="bg-white p-1.5 rounded-md shadow-sm text-slate-600 hover:text-primary hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300">
                        <span className="material-symbols-outlined text-lg">remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="mt-4 space-y-3">
                    <div className="flex gap-2">
                      <input
                        className="w-1/2 rounded-lg border-slate-300 text-sm bg-slate-50 text-slate-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300"
                        placeholder="Latitude"
                        readOnly
                        type="text"
                        value={formData.latitude}
                      />
                      <input
                        className="w-1/2 rounded-lg border-slate-300 text-sm bg-slate-50 text-slate-600 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300"
                        placeholder="Longitude"
                        readOnly
                        type="text"
                        value={formData.longitude}
                      />
                    </div>
                    <button className="w-full py-2 border border-dashed border-primary/50 rounded-lg text-primary text-sm font-medium hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-lg">my_location</span>
                      Use Current Location
                    </button>
                  </div>

                  {/* AI Tip */}
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                      <span className="material-symbols-outlined text-amber-500 mt-0.5">lightbulb</span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">AI Tip</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Ensure accurate coordinates. We use satellite data to analyze soil health and water retention automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Soil/Climate */}
          {currentStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Soil & Climate Forms */}
              <div className="lg:col-span-2 space-y-8">
                {/* Soil Properties */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-surface-dark relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <div className="group relative inline-block cursor-help">
                      <span className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">info</span>
                      <div className="invisible group-hover:visible absolute z-10 bg-slate-800 text-white text-xs p-3 rounded shadow-lg -mt-8 -ml-40 w-64 transform -translate-x-1/2 dark:bg-slate-700 border border-slate-600">
                        Don&apos;t have exact soil data? Leave fields blank. Our AI will use regional climate data for general recommendations, though less precise.
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-earth mb-6 flex items-center gap-2 dark:text-white">
                    <span className="material-symbols-outlined text-primary">compost</span>
                    Soil Properties
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-full ml-2 border border-slate-200 dark:border-slate-700">
                      Optional
                    </span>
                  </h3>

                  <div className="space-y-8">
                    {/* Soil pH Level */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="ph-level">
                          Soil pH Level
                        </label>
                        <span className="text-sm font-bold text-primary">{formData.soilPH}</span>
                      </div>
                      <input
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                        id="ph-level"
                        name="soilPH"
                        max="14"
                        min="0"
                        step="0.1"
                        type="range"
                        value={formData.soilPH}
                        onChange={handleInputChange}
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>Acidic (0)</span>
                        <span>Neutral (7)</span>
                        <span>Alkaline (14)</span>
                      </div>
                    </div>

                    {/* NPK Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="nitrogen">
                          Nitrogen (N)
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-slate-500 transition-shadow"
                            id="nitrogen"
                            name="nitrogen"
                            placeholder="0"
                            type="number"
                            value={formData.nitrogen}
                            onChange={handleInputChange}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-slate-500 text-xs">mg/kg</span>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-slate-400 italic">Optional</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="phosphorus">
                          Phosphorus (P)
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-slate-500 transition-shadow"
                            id="phosphorus"
                            name="phosphorus"
                            placeholder="0"
                            type="number"
                            value={formData.phosphorus}
                            onChange={handleInputChange}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-slate-500 text-xs">mg/kg</span>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-slate-400 italic">Optional</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="potassium">
                          Potassium (K)
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-slate-500 transition-shadow"
                            id="potassium"
                            name="potassium"
                            placeholder="0"
                            type="number"
                            value={formData.potassium}
                            onChange={handleInputChange}
                          />
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span className="text-slate-500 text-xs">mg/kg</span>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-slate-400 italic">Optional</p>
                      </div>
                    </div>

                    {/* Soil Moisture */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="moisture">
                          Soil Moisture Content
                        </label>
                        <span className="text-sm font-bold text-primary">{formData.soilMoisture}%</span>
                      </div>
                      <input
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer dark:bg-slate-700 accent-primary"
                        id="moisture"
                        name="soilMoisture"
                        max="100"
                        min="0"
                        step="1"
                        type="range"
                        value={formData.soilMoisture}
                        onChange={handleInputChange}
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>Dry (0%)</span>
                        <span>Saturated (100%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Climate Data */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-surface-dark">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <h3 className="text-lg font-bold text-earth flex items-center gap-2 dark:text-white">
                      <span className="material-symbols-outlined text-primary">cloud</span>
                      Climate Data
                    </h3>
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md ${
                        formData.isClimateAutofilled
                          ? 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          : 'bg-primary hover:bg-primary-dark text-white shadow-primary/20'
                      }`}
                      type="button"
                      onClick={handleAutoFillClimate}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {formData.isClimateAutofilled ? 'check' : 'magic_button'}
                      </span>
                      {formData.isClimateAutofilled ? 'Data Autofilled' : 'Auto-fill from Location'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Temperature */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="temperature">
                        Avg. Annual Temperature
                      </label>
                      <div className="relative">
                        <input
                          className={`w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-slate-500 transition-shadow pl-10 ${
                            formData.isClimateAutofilled ? 'bg-slate-50 text-slate-500' : ''
                          }`}
                          id="temperature"
                          name="avgTemperature"
                          placeholder="24"
                          type="number"
                          value={formData.avgTemperature}
                          onChange={handleInputChange}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="material-symbols-outlined text-slate-400 text-lg">thermostat</span>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-slate-500 text-sm">°C</span>
                        </div>
                      </div>
                      {formData.isClimateAutofilled && (
                        <p className="text-[10px] text-primary mt-1">Fetched from regional station</p>
                      )}
                    </div>

                    {/* Rainfall */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5" htmlFor="rainfall">
                        Avg. Annual Rainfall
                      </label>
                      <div className="relative">
                        <input
                          className={`w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-slate-800 dark:border-slate-600 dark:text-white dark:placeholder-slate-500 transition-shadow pl-10 ${
                            formData.isClimateAutofilled ? 'bg-slate-50 text-slate-500' : ''
                          }`}
                          id="rainfall"
                          name="avgRainfall"
                          placeholder="800"
                          type="number"
                          value={formData.avgRainfall}
                          onChange={handleInputChange}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <span className="material-symbols-outlined text-slate-400 text-lg">rainy</span>
                        </div>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-slate-500 text-sm">mm</span>
                        </div>
                      </div>
                      {formData.isClimateAutofilled && (
                        <p className="text-[10px] text-primary mt-1">Fetched from regional station</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                    type="button"
                    onClick={handleBackStep}
                  >
                    Back
                  </button>
                  <button
                    className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all hover:translate-x-1"
                    type="button"
                    onClick={handleNextStep}
                  >
                    Next: Photos
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>

              {/* Right Column - AI Crop Prediction */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 rounded-2xl border border-blue-100 bg-blue-50 p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 h-fit">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
                      <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">psychology</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                      AI Crop Prediction
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-6 dark:text-slate-300 leading-relaxed">
                    This data is crucial for <span className="font-semibold text-blue-700 dark:text-blue-300">Gemini</span> to analyze and predict the most viable crops for your land. Accurate soil and climate inputs can increase lease value by up to <span className="font-bold">25%</span>.
                  </p>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 dark:bg-amber-900/20 dark:border-amber-800/50">
                    <div className="flex gap-2">
                      <span className="material-symbols-outlined text-amber-600 text-sm mt-0.5 dark:text-amber-500">lightbulb</span>
                      <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                        No soil data? No problem.
                      </p>
                    </div>
                    <p className="text-xs text-amber-700/80 mt-1 pl-6 dark:text-amber-300/70">
                      The AI can still provide general recommendations based solely on regional climate data, though less precise than with full soil analysis.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-blue-100 shadow-sm dark:bg-slate-900 dark:border-slate-700">
                      <span className="material-symbols-outlined text-green-500 mt-0.5 text-lg">check_circle</span>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-white">Soil pH Impact</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Determines nutrient availability.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-blue-100 shadow-sm dark:bg-slate-900 dark:border-slate-700">
                      <span className="material-symbols-outlined text-green-500 mt-0.5 text-lg">check_circle</span>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-800 dark:text-white">NPK Balance</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Key for fertilizer recommendations.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-blue-200 dark:border-slate-600">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Powered by Gemini AI</span>
                      <span className="material-symbols-outlined text-base">auto_awesome</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 - Photos */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Photo Upload */}
              <div className="lg:col-span-2 space-y-8">
                {/* Photo Gallery Upload */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-surface-dark">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-earth flex items-center gap-2 dark:text-white">
                      <span className="material-symbols-outlined text-primary">add_photo_alternate</span>
                      Photo Gallery
                    </h3>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      Required
                    </span>
                  </div>

                  {/* Upload Area */}
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-10 text-center hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer group">
                    <input
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      multiple
                      type="file"
                      onChange={handleFileUpload}
                    />
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                        <span className="material-symbols-outlined text-4xl">cloud_upload</span>
                      </div>
                      <div>
                        <p className="text-base font-medium text-slate-700 dark:text-slate-200">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                          SVG, PNG, JPG or GIF (max. 800x400px)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-sm">info</span>
                    Minimum 3 photos required for verification.
                  </div>
                </div>

                {/* Uploaded Photos Grid */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Uploaded Photos ({uploadedPhotos.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {uploadedPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                      >
                        <img
                          alt={photo.alt}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          src={photo.url}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            className="p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded text-white transition-colors"
                            title="Set as Cover"
                            type="button"
                            onClick={() => handleSetCover(photo.id)}
                          >
                            <span className="material-symbols-outlined text-lg">star</span>
                          </button>
                          <button
                            className="p-1.5 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm rounded text-white transition-colors"
                            title="Remove"
                            type="button"
                            onClick={() => handleRemovePhoto(photo.id)}
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                        {photo.isCover && (
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/50 backdrop-blur-sm rounded text-[10px] text-white font-medium">
                            Cover
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Loading State */}
                    {isUploading && (
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-50 border border-dashed border-slate-300 dark:bg-slate-800/50 dark:border-slate-600 flex flex-col items-center justify-center p-4">
                        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
                        <span className="text-xs text-slate-500 font-medium animate-pulse">
                          Uploading...
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 mt-8">
                  <button
                    className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-600 font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
                    type="button"
                    onClick={handleBackStep}
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back
                  </button>
                  <button
                    className="flex items-center gap-2 px-8 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all hover:translate-x-0.5 transform"
                    type="button"
                    onClick={handleNextStep}
                    disabled={uploadedPhotos.length < 3}
                  >
                    <span className="material-symbols-outlined text-lg">verified</span>
                    Submit for Verification
                  </button>
                </div>
              </div>

              {/* Right Column - Photo Guidelines */}
              <div className="lg:col-span-1 space-y-6">
                <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-surface-dark h-fit">
                  <h3 className="text-lg font-bold text-earth mb-4 flex items-center gap-2 dark:text-white">
                    <span className="material-symbols-outlined text-primary">lightbulb</span>
                    Photo Guidelines
                  </h3>
                  <div className="space-y-4">
                    {/* Do's */}
                    <div className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <strong className="font-semibold text-slate-800 dark:text-white">
                          Wide Angles:
                        </strong>{' '}
                        Capture the full extent of the plot including boundaries.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <strong className="font-semibold text-slate-800 dark:text-white">
                          Soil Quality:
                        </strong>{' '}
                        Include close-ups of the soil to show texture and color.
                      </p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        <strong className="font-semibold text-slate-800 dark:text-white">
                          Water Sources:
                        </strong>{' '}
                        Show any nearby rivers, wells, or irrigation infrastructure.
                      </p>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 my-4"></div>

                    {/* Don'ts */}
                    <div className="flex gap-3 items-start">
                      <div className="h-6 w-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-sm font-bold">close</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Avoid blurry or dark photos taken at night.
                      </p>
                    </div>
                  </div>

                  {/* Why Photos Matter */}
                  <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Why photos matter
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Listings with at least 5 high-quality photos get{' '}
                      <span className="font-bold text-primary">3x more inquiries</span> from serious
                      tenants.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddLandPage;
