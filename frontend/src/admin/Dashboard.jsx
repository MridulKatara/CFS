import React, { useState } from 'react';
import NotificationManager from './NotificationManager';
import LogoutModal from '../common/profile/LogoutModal';
import { FiLogOut } from 'react-icons/fi';

const Dashboard = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={() => setShowLogoutModal(true)} 
          className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 flex items-center gap-2"
        >
          <FiLogOut className="w-5 h-5 text-red-500" />
          <span className="text-gray-700">Logout</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          {/* Add your admin stats here */}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          {/* Add recent activity here */}
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow">
        <NotificationManager />
      </div>

      {showLogoutModal && <LogoutModal onClose={() => setShowLogoutModal(false)} />}
    </div>
  );
};

export default Dashboard;
