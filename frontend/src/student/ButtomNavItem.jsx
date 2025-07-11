/* eslint-disable no-unused-vars */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, BookIcon, NotificationIcon, ProfileIcon } from '../common/compnent/Icons';

const navItems = [
  { label: 'Home', icon: HomeIcon, to: '/home' },
  { label: 'My Program', icon: BookIcon, to: '/my-program' },
  { label: 'Notification', icon: NotificationIcon, to: '/notification' },
  { label: 'Profile', icon: ProfileIcon, to: '/profile' },
];

const BottomNavBar = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-[#f5f5f5] z-50">
      <div className="flex justify-between px-2 py-2">
        {navItems.map(({ label, icon: Icon, to }) => {
          const active = label === 'My Program' 
            ? location.pathname.includes('program')
            : location.pathname.startsWith(to);
          return (
            <Link
              key={label}
              to={to}
              className={`flex flex-col items-center gap-1 flex-1 ${
                active ? 'text-[#704ee7]' : 'text-[#757575]'
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <Icon active={active} />
              </div>
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
