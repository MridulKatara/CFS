import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, NotificationIcon, ProfileIcon } from '../common/compnent/Icons';

// University icon component
const UniversityIcon = ({ active }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3L2 8.5L12 14L22 8.5L12 3Z"
      stroke={active ? "#704ee7" : "#757575"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 13.5L12 19L22 13.5"
      stroke={active ? "#704ee7" : "#757575"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 10.8V16.8"
      stroke={active ? "#704ee7" : "#757575"}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18 10.8V16.8"
      stroke={active ? "#704ee7" : "#757575"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const navItems = [
  { label: 'Dashboard', icon: HomeIcon, to: '/admin/dashboard' },
  { label: 'Notifications', icon: NotificationIcon, to: '/admin/notifications' },
  { label: 'Universities', icon: UniversityIcon, to: '/admin/universities' },
  { label: 'Profile', icon: ProfileIcon, to: '/admin/profile' },
];

const AdminNavBar = () => {
  const location = useLocation();

  return (
    <div className="bg-white border-b border-[#f5f5f5] shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="font-bold text-xl text-[#704ee7]">Admin Panel</div>
          <div className="flex space-x-6">
            {navItems.map(({ label, icon: Icon, to }) => {
              const active = location.pathname.startsWith(to);
              return (
                <Link
                  key={label}
                  to={to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    active ? 'text-[#704ee7] bg-[#f8f5ff]' : 'text-[#757575] hover:bg-gray-100'
                  }`}
                >
                  <Icon active={active} />
                  <span className="font-medium">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavBar; 