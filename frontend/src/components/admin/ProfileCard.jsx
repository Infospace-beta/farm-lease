import React from 'react';

/**
 * ProfileCard Component
 * Displays admin profile overview with avatar, role, status, and account details
 * 
 * @param {Object} data - Profile information (name, role, avatar, etc.)
 * @param {Function} onAvatarChange - Handler for avatar change action
 */
const ProfileCard = ({ data, onAvatarChange }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm overflow-hidden">
      {/* Header Gradient */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-[#0f392b]" />

      {/* Avatar Section */}
      <div className="relative mt-8 mb-4 flex justify-center">
        <div className="w-28 h-28 rounded-full p-1 bg-white shadow-lg">
          <img
            src={data?.avatar || 'https://via.placeholder.com/150'}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
          <button 
            onClick={onAvatarChange}
            className="absolute bottom-1 right-1 bg-[#5D4037] p-2 rounded-full shadow-md hover:bg-[#8d6e63] transition-colors"
          >
            <span className="material-icons-round text-white text-sm">camera_alt</span>
          </button>
        </div>
      </div>

      {/* Name & Role */}
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-1 font-serif">
          {data?.fullName || 'Admin User'}
        </h3>
        <p className="text-xs text-[#047857] font-bold uppercase tracking-widest">
          {data?.role || 'Administrator'}
        </p>
      </div>

      {/* Status Badges */}
      <div className="flex justify-center gap-3 mb-6">
        {data?.status && (
          <span className="px-3 py-1 bg-green-50 border border-green-100 rounded-full text-green-700 text-xs font-medium">
            {data.status}
          </span>
        )}
        {data?.verified && (
          <span className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-medium">
            Verified
          </span>
        )}
      </div>

      {/* Account Details */}
      <div className="border-t border-gray-100 pt-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Joined</span>
          <span className="text-gray-800 font-medium text-sm">
            {data?.joinedDate || 'N/A'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">Last Login</span>
          <span className="text-gray-800 font-medium text-sm">
            {data?.lastLogin || 'N/A'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-sm">IP Address</span>
          <span className="text-gray-800 font-medium text-sm font-mono">
            {data?.ipAddress || '0.0.0.0'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
