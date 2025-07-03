import React from 'react';
import NotificationManager from './NotificationManager';

const Dashboard = () => {

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
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
    </div>
  );
};

export default Dashboard;
