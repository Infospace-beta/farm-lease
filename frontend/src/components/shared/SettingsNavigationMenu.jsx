import React from 'react';

/**
 * SettingsNavigationMenu Component
 * Navigation menu for settings sections with active state highlighting
 * 
 * @param {String} activeSection - Currently active section ID
 * @param {Function} onSectionChange - Handler for section change
 */
const SettingsNavigationMenu = ({ activeSection, onSectionChange }) => {
  const menuItems = [
    {
      id: 'personal',
      icon: 'person',
      label: 'Personal Information'
    },
    {
      id: 'security',
      icon: 'lock',
      label: 'Security & Password'
    },
    {
      id: 'notifications',
      icon: 'notifications_active',
      label: 'Notifications'
    },
    {
      id: 'activity',
      icon: 'history',
      label: 'Activity Logs'
    }
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {menuItems.map((item, index) => {
        const isActive = activeSection === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`
              flex items-center gap-3 px-6 py-4 w-full text-left transition-colors
              ${isActive ? 'bg-green-50/50 border-l-4 border-[#0f392b] text-[#0f392b] font-medium' : 'border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800'}
              ${index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}
            `}
          >
            <span className="material-icons-round text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SettingsNavigationMenu;
