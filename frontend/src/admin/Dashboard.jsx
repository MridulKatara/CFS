import React, { useState, useEffect } from 'react';
import NotificationManager from './NotificationManager';
import LogoutModal from '../common/profile/LogoutModal';
import { FiLogOut, FiUsers, FiBookOpen, FiBook, FiBriefcase } from 'react-icons/fi';
import AdminNavBar from './AdminNavBar';
import ApiService from '../services/api';

const Dashboard = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [stats, setStats] = useState({
    universities: 0,
    users: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch university count
        const universities = await ApiService.getUniversities();
        
        // Fetch user count
        const userResponse = await ApiService.getAllUsers();

        setStats({
          universities: universities ? universities.length : 0,
          users: userResponse?.users?.length || 0,
          loading: false
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
      <div className={`rounded-full p-4 mr-4 text-white ${color}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold">
          {stats.loading ? (
            <span className="animate-pulse">...</span>
          ) : (
            value
          )}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavBar />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 flex items-center gap-2"
          >
            <FiLogOut className="w-5 h-5 text-red-500" />
            <span className="text-gray-700">Logout</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            icon={FiBriefcase} 
            title="Universities" 
            value={stats.universities} 
            color="bg-[#704ee7]" 
          />
          <StatCard 
            icon={FiUsers} 
            title="Users" 
            value={stats.users} 
            color="bg-blue-500" 
          />
          <StatCard 
            icon={FiBookOpen} 
            title="Programs" 
            value="--" 
            color="bg-green-500" 
          />
          <StatCard 
            icon={FiBook} 
            title="Enrollments" 
            value="--" 
            color="bg-orange-500" 
          />
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-500">No recent activity to display.</p>
        </div>

        {showLogoutModal && <LogoutModal onClose={() => setShowLogoutModal(false)} />}
      </div>
    </div>
  );
};

export default Dashboard;
