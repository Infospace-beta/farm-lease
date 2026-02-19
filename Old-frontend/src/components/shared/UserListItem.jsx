import React from 'react';

const UserListItem = ({ user, onViewProfile, onSuspend, onUnsuspend }) => {
  const isActive = user.status === 'active';
  const isSuspended = user.status === 'suspended';

  const getRoleBadgeStyle = (role) => {
    if (role === 'farmer') {
      return {
        container: 'bg-emerald-50 border-emerald-100',
        text: 'text-emerald-700',
        icon: 'agriculture',
        label: 'Farmer',
      };
    }
    return {
      container: 'bg-amber-50 border-amber-100',
      text: 'text-amber-700',
      icon: 'landscape',
      label: 'Landowner',
    };
  };

  const roleStyle = getRoleBadgeStyle(user.role);

  return (
    <div className="px-4 py-4 border-b border-gray-50 flex items-center">
      {/* User Info - 40% */}
      <div className="flex-[2] flex items-center gap-3">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full border border-gray-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600">
              {user.initials}
            </span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate">
            {user.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user.email}
          </p>
        </div>
      </div>

      {/* Role - 20% */}
      <div className="flex-1">
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${roleStyle.container} inline-flex`}>
          <span className="material-icons-round text-sm" style={{ color: roleStyle.text.includes('emerald') ? '#059669' : '#D97706' }}>{roleStyle.icon}</span>
          <span className={`text-xs font-medium ${roleStyle.text}`}>
            {roleStyle.label}
          </span>
        </div>
      </div>

      {/* Join Date - 20% */}
      <div className="flex-1">
        <span className="text-sm text-gray-600">
          {user.joinDate}
        </span>
      </div>

      {/* Status - 20% */}
      <div className="flex-1">
        {isActive ? (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-green-700">
              Active
            </span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span className="text-xs font-medium text-red-700">
              Suspended
            </span>
          </div>
        )}
      </div>

      {/* Actions - Width: 80px */}
      <div className="w-20 flex justify-end items-center gap-2">
        <button
          onClick={() => onViewProfile(user.id)}
          className="p-1.5 rounded-lg hover:bg-gray-100"
        >
          <span className="material-icons-round text-lg text-gray-400">visibility</span>
        </button>

        {isActive ? (
          <button
            onClick={() => onSuspend(user.id)}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <span className="material-icons-round text-lg text-gray-400">block</span>
          </button>
        ) : (
          <button
            onClick={() => onUnsuspend(user.id)}
            className="p-1.5 bg-red-50 rounded-lg hover:bg-red-100"
          >
            <span className="material-icons-round text-lg text-red-600">lock_open</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default UserListItem;
