import React, { useState } from 'react';
import { AdminSidebar, AdminHeader, ProfileCard, SettingsNavigationMenu } from '../../components/admin';

/**
 * AdminProfileSettingsPage Component
 * Admin profile management page for personal information, security, and preferences
 * 
 * Features:
 * - Profile overview with avatar, status, and account info
 * - Settings navigation (Personal Info, Security, Notifications, Activity Logs)
 * - Edit profile form (name, email, phone, bio)
 * - Password change functionality
 * - Save/discard changes
 */
const AdminProfileSettingsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Profile data
  const [profileData, setProfileData] = useState({
    fullName: 'David M.',
    adminId: 'ADM-2021-001',
    email: 'david.m@farmlease.co.ke',
    phone: '+254 712 345 678',
    bio: '',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7ZvmzxVv274-pe6FUZP8OHwCRgvrDzdEbABqYgGD3L2tZOE3EEZiEp_yonq1ctrQNXjE9q4X76GFxHLqBi5-Ki-i3A2jd9RZs_2lH5WtHZgNDwN2iLUbkVFE2T3ZuhAMmG1D9fLHbgWSeHtj_xvnBFCMcio2tim33FEGeydQbDScGWL17IyW19HcGpydoFYNre_N-qBMdcfgMExDLg5LAlwAZx978N7hJgCi6dru1egRdHooOSxMCiJ4LIgPPgKcyMajv-IU2YzLW',
    role: 'Super Admin',
    status: 'Active',
    verified: true,
    joinedDate: 'Aug 24, 2021',
    lastLogin: 'Today, 09:41 AM',
    ipAddress: '192.168.0.1'
  });

  // Password data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveChanges = () => {
    console.log('Saving changes...', profileData, passwordData);
    // Implement save logic
  };

  const handleDiscardChanges = () => {
    console.log('Discarding changes...');
    // Reset form
  };

  const handleAvatarChange = () => {
    console.log('Change avatar...');
    // Implement image picker
  };

  return (
    <div className="flex-1 flex-row bg-[#F9FAFB]">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 bg-black/50 z-20 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <AdminSidebar 
        activeRoute="settings" 
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex-col">
        <AdminHeader
          title="Admin Profile Settings"
          subtitle="Manage your personal information, security preferences, and system access levels."
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          showSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search settings..."
        />
        
        <div className="flex-1 p-6 lg:p-8 overflow-y-auto">

          {/* Content Grid */}
          <div className="flex-row gap-8 max-w-7xl mx-auto">
            {/* Left Column - Profile Card & Navigation */}
            <div className="w-80 gap-6">
              <ProfileCard 
                data={profileData}
                onAvatarChange={handleAvatarChange}
              />
              
              <SettingsNavigationMenu 
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>

            {/* Right Column - Forms */}
            <div className="flex-1 gap-6">
              {/* Edit Profile Section */}
              {activeSection === 'personal' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-[#5D4037]" style={{ fontFamily: 'Playfair Display' }}>
                      Edit Profile
                    </h2>
                    <p className="text-sm text-gray-500">
                      Update your personal details and contact information.
                    </p>
                  </div>

                  <div className="gap-6">
                    {/* Full Name & Admin ID Row */}
                    <div className="flex-row gap-6">
                      <div className="flex-1 gap-2">
                        <label className="text-sm font-semibold text-gray-700">Full Name</label>
                        <div className="relative">
                          <span 
                            className="material-icons-round" 
                            style={{ position: 'absolute', left: 12, top: 12, zIndex: 1, fontSize: 16, color: '#9CA3AF' }}
                          >
                            badge
                          </span>
                          <input
                            type="text"
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="flex-1 gap-2">
                        <label className="text-sm font-semibold text-gray-700">Admin ID</label>
                        <div className="relative">
                          <span 
                            className="material-icons-round" 
                            style={{ position: 'absolute', left: 12, top: 12, zIndex: 1, fontSize: 16, color: '#9CA3AF' }}
                          >
                            fingerprint
                          </span>
                          <input
                            type="text"
                            value={profileData.adminId}
                            disabled
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email & Phone Row */}
                    <div className="flex-row gap-6">
                      <div className="flex-1 gap-2">
                        <label className="text-sm font-semibold text-gray-700">Email Address</label>
                        <div className="relative">
                          <span 
                            className="material-icons-round" 
                            style={{ position: 'absolute', left: 12, top: 12, zIndex: 1, fontSize: 16, color: '#9CA3AF' }}
                          >
                            mail
                          </span>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="flex-1 gap-2">
                        <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                        <div className="relative">
                          <span 
                            className="material-icons-round" 
                            style={{ position: 'absolute', left: 12, top: 12, zIndex: 1, fontSize: 16, color: '#9CA3AF' }}
                          >
                            phone
                          </span>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm shadow-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Bio / Notes */}
                    <div className="gap-2">
                      <label className="text-sm font-semibold text-gray-700">Bio / Notes</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="Brief description of role..."
                        rows={3}
                        className="w-full p-3 rounded-lg border border-gray-200 text-gray-800 text-sm shadow-sm"
                        style={{ minHeight: 80, resize: 'vertical' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings Section */}
              {activeSection === 'security' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-[#5D4037]" style={{ fontFamily: 'Playfair Display' }}>
                      Security Settings
                    </h2>
                    <p className="text-sm text-gray-500">
                      Update password and secure your account.
                    </p>
                  </div>

                  <div className="gap-6">
                    {/* Current Password */}
                    <div className="gap-2">
                      <label className="text-sm font-semibold text-gray-700">Current Password</label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm shadow-sm"
                      />
                    </div>

                    {/* New Password Row */}
                    <div className="border-t border-gray-50 pt-6">
                      <div className="flex-row gap-6">
                        <div className="flex-1 gap-2">
                          <label className="text-sm font-semibold text-gray-700">New Password</label>
                          <input
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm shadow-sm"
                          />
                        </div>

                        <div className="flex-1 gap-2">
                          <label className="text-sm font-semibold text-gray-700">Confirm New Password</label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 text-sm shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  <h2 className="text-lg font-bold text-[#5D4037] mb-2" style={{ fontFamily: 'Playfair Display' }}>
                    Notifications
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Configure your notification preferences.
                  </p>
                  <p className="text-gray-400 text-center py-12">
                    Notification settings coming soon...
                  </p>
                </div>
              )}

              {/* Activity Logs Section */}
              {activeSection === 'activity' && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                  <h2 className="text-lg font-bold text-[#5D4037] mb-2" style={{ fontFamily: 'Playfair Display' }}>
                    Activity Logs
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    View your recent system activities.
                  </p>
                  <p className="text-gray-400 text-center py-12">
                    Activity logs coming soon...
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex-row items-center justify-end gap-4 pt-4">
                <button 
                  onClick={handleDiscardChanges}
                  className="px-6 py-2.5 border border-[#5D4037] rounded-lg shadow-sm"
                >
                  <span className="text-[#5D4037] font-bold">Discard Changes</span>
                </button>

                <button 
                  onClick={handleSaveChanges}
                  className="flex-row items-center gap-2 px-8 py-2.5 bg-[#047857] rounded-lg shadow-lg"
                >
                  <span className="material-icons-round" style={{ fontSize: 16, color: '#FFFFFF' }}>save</span>
                  <span className="text-white font-bold">Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileSettingsPage;
