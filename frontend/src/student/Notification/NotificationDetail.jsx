import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../services/api';
import Snackbar from '../../components/Snackbar';

const NotificationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setLoading(true);
        
        // Get all notifications and find the one with matching ID
        const response = await ApiService.getUserNotifications();
        
        if (response.success) {
          const foundNotification = response.notifications.find(n => n._id === id);
          
          if (foundNotification) {
            setNotification(foundNotification);
          } else {
            setSnackbar({
              message: 'Notification not found',
              type: 'error'
            });
            // Navigate back after a delay
            setTimeout(() => navigate('/notification'), 2000);
          }
        } else {
          setSnackbar({
            message: 'Failed to load notification',
            type: 'error'
          });
        }
      } catch (err) {
        console.error('Error fetching notification:', err);
        setSnackbar({
          message: 'Failed to load notification',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNotification();
    }
  }, [id, navigate]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
      
      return date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Fee Payment Reminder':
        return 'bg-red-100 text-red-800';
      case 'New Course Announcement':
        return 'bg-green-100 text-green-800';
      case 'Assignment':
        return 'bg-yellow-100 text-yellow-800';
      case 'Exam':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10 px-4 py-5 flex items-center">
        <button 
          onClick={() => navigate('/notification')}
          className="w-8 h-8 flex items-center justify-center"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#202124"/>
          </svg>
        </button>
        <h1 className="text-[#202124] text-xl font-semibold flex-1 text-center">Notification Details</h1>
        <div className="w-8 h-8"></div>
      </div>

      {/* Notification Content */}
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#704ee7]"></div>
          </div>
        ) : !notification ? (
          <div className="text-center py-10 text-gray-500">
            Notification not found
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="mb-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-[#202124]">
                  {notification.notificationTitle || "Notification"}
                </h2>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${getTypeColor(notification.notificationType)}`}>
                  {notification.notificationType || "General"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formatDate(notification.deliveredAt) || ""}
              </p>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <p className="text-[#454545] whitespace-pre-wrap">
                {notification.message || "No additional details available."}
              </p>
            </div>
          </div>
        )}
      </div>

      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
};

export default NotificationDetail;
