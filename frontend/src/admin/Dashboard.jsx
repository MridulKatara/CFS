import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-blue-900 mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-blue-600">1,234</p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-green-900 mb-2">Active Programs</h3>
              <p className="text-3xl font-bold text-green-600">15</p>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-purple-900 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-purple-600">₹45.2M</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors">
                Manage Students
              </button>
              <button className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors">
                Add Programs
              </button>
              <button className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition-colors">
                View Reports
              </button>
              <button className="bg-orange-500 text-white p-4 rounded-lg hover:bg-orange-600 transition-colors">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
