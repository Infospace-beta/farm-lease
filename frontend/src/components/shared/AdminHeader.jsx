import React from 'react';

/**
 * AdminHeader Component
 * Reusable header for admin pages with hamburger menu, title, and optional content
 * 
 * @param {String} title - Page title
 * @param {String} subtitle - Optional subtitle/description
 * @param {Boolean} isSidebarOpen - Sidebar open state
 * @param {Function} setIsSidebarOpen - Function to toggle sidebar
 * @param {ReactNode} rightContent - Optional content for right side (search, buttons, etc.)
 * @param {Boolean} showSearch - Show search input (default: false)
 * @param {String} searchQuery - Search query value
 * @param {Function} onSearchChange - Search change handler
 * @param {String} searchPlaceholder - Search placeholder text
 */
const AdminHeader = ({ 
  title, 
  subtitle,
  isSidebarOpen,
  setIsSidebarOpen,
  rightContent,
  showSearch = false,
  searchQuery = '',
  onSearchChange,
  searchPlaceholder = 'Search...'
}) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 flex-shrink-0">
      <div className="flex justify-between items-end">
        {/* Left Section - Hamburger + Title */}
        <div className="flex items-center gap-4 flex-1">
          {/* Hamburger Menu Button - Mobile Only */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-[#0f392b]"
          >
            <span className="material-icons-round text-2xl">menu</span>
          </button>

          {/* Title & Subtitle */}
          <div className="flex-1">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#5D4037] mb-1 font-serif">
              {title}
            </h2>
            {subtitle && (
              <p className="text-gray-500 text-sm max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Section - Search/Custom Content */}
        <div className="flex items-center gap-4">
          {/* Search Input */}
          {showSearch && (
            <div className="relative">
              <span className="material-icons-round absolute left-3 top-2.5 text-gray-400 text-xl">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-forest-green/20 focus:border-forest-green"
              />
            </div>
          )}

          {/* Custom Right Content */}
          {rightContent}

          {/* Notifications Bell */}
          <button className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
            <span className="material-icons-round text-gray-600 text-xl">notifications</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
