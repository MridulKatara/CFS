/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import LogoutModal from '../common/profile/LogoutModal';
import { FiLogOut, FiUsers, FiBookOpen, FiBook, FiBriefcase, FiBell } from 'react-icons/fi';
import AdminNavBar from './AdminNavBar';
import ApiService from '../services/api';
import { format } from 'date-fns';

const Dashboard = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [stats, setStats] = useState({
    universities: 0,
    users: 0,
    programs: 0,
    loading: true
  });
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch university count
        const universities = await ApiService.getUniversities();
        
        // Fetch user count
        const userResponse = await ApiService.getAllUsers();

        // Fetch programs count
        const programs = await ApiService.getPrograms();

        setStats({
          universities: universities ? universities.length : 0,
          users: userResponse?.users?.length || 0,
          programs: programs ? programs.length : 0,
          loading: false
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    const fetchRecentNotifications = async () => {
      try {
        setNotificationsLoading(true);
        const response = await ApiService.getRecentNotifications();
        if (response && response.success) {
          setRecentNotifications(response.notifications || []);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setNotificationsLoading(false);
      }
    };

    fetchStats();
    fetchRecentNotifications();
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

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
            value={stats.programs} 
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
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          
          {notificationsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#704ee7]"></div>
            </div>
          ) : recentNotifications.length === 0 ? (
            <p className="text-gray-500">No recent notifications to display.</p>
          ) : (
            <ul className="divide-y">
              {recentNotifications.map((notification) => (
                <li key={notification.id} className="py-4">
                  <div className="flex items-start">
                    <div className={`rounded-full p-2 mr-4 text-white ${
                      notification.type === 'Fee Payment Reminder' ? 'bg-blue-500' :
                      notification.type === 'New Course Announcement' ? 'bg-green-500' : 'bg-[#704ee7]'
                    }`}>
                      <FiBell size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-gray-400 text-sm mt-1">{formatDate(notification.timestamp)}</p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      notification.type === 'Fee Payment Reminder' ? 'bg-blue-100 text-blue-800' :
                      notification.type === 'New Course Announcement' ? 'bg-green-100 text-green-800' : 
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {notification.type}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {showLogoutModal && <LogoutModal onClose={() => setShowLogoutModal(false)} />}
      </div>
    </div>
  );
};

export default Dashboard;
