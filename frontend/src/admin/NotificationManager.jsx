import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';
import Snackbar from '../components/Snackbar';
import AdminNavBar from './AdminNavBar';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  });
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'System Maintenance',
    selectedUsers: []
  });

  const notificationTypes = [
    'System Maintenance',
    'Fee Payment Reminder',
    'New Course Announcement',
    'Assignment',
    'Exam',
    'General'
  ];

  const fetchNotifications = async (page = 1) => {
    try {
      setLoading(true);
      
      // Fetch notifications with pagination
      const notificationsResponse = await ApiService.getRecentNotifications(page, pagination.limit);
      
      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.notifications || []);
        setPagination(notificationsResponse.pagination || pagination);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setSnackbar({
        message: 'Failed to load notifications',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch notifications with pagination
        await fetchNotifications(1);
        
        // Fetch all users
        const usersResponse = await ApiService.getAllUsers();
        if (usersResponse.success) {
          setUsers(usersResponse.users || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbar({
          message: 'Failed to load data',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUserCheckboxChange = (userId) => {
    setFormData(prev => {
      const selectedUsers = [...prev.selectedUsers];
      
      if (selectedUsers.includes(userId)) {
        // Remove user if already selected
        return {
          ...prev,
          selectedUsers: selectedUsers.filter(id => id !== userId)
        };
      } else {
        // Add user if not selected
        return {
          ...prev,
          selectedUsers: [...selectedUsers, userId]
        };
      }
    });
  };

  const handleSelectAll = () => {
    const allUserIds = users.map(user => user._id);
    setFormData(prev => ({ ...prev, selectedUsers: allUserIds }));
  };

  const handleClearSelection = () => {
    setFormData(prev => ({ ...prev, selectedUsers: [] }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchNotifications(newPage);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setSnackbar({
        message: 'Please enter a notification title',
        type: 'error'
      });
      return;
    }

    if (!formData.message.trim()) {
      setSnackbar({
        message: 'Please enter a notification message',
        type: 'error'
      });
      return;
    }

    if (formData.selectedUsers.length === 0) {
      setSnackbar({
        message: 'Please select at least one user',
        type: 'error'
      });
      return;
    }
    
    try {
      setSending(true);
      
      const response = await ApiService.sendNotification({
        userIds: formData.selectedUsers,
        title: formData.title,
        message: formData.message,
        type: formData.type
      });

      if (response.success) {
        // Add the new notification to the list
        const newNotification = {
          _id: response.notificationId,
          title: formData.title,
          message: formData.message,
          type: formData.type,
          timestamp: new Date().toISOString()
        };
        
        setNotifications(prev => [newNotification, ...prev]);
        
        // Reset form
        setFormData({
          title: '',
          message: '',
          type: 'System Maintenance',
          selectedUsers: []
        });
        
        setSnackbar({
          message: `Notification sent successfully to ${response.successCount || 0} devices`,
          type: 'success'
        });
        
        // Refresh notifications to include the new one
        fetchNotifications(1);
      } else {
        setSnackbar({
          message: response.message || 'Failed to send notification',
          type: 'error'
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setSnackbar({
        message: error.message || 'Failed to send notification',
        type: 'error'
      });
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavBar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-2xl font-bold mb-6">Notification Manager</h1>
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Send Notification Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Send New Notification</h2>
      
            <form onSubmit={handleSubmit}>
        <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
            Notification Type
          </label>
          <select
            name="type"
                  value={formData.type}
            onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
                  {notificationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
          </select>
        </div>
        
        <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title"
                  value={formData.title}
            onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter notification title"
          />
        </div>
        
        <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            name="message"
                  value={formData.message}
            onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter notification message"
            rows="4"
          ></textarea>
        </div>
        
        <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipients
          </label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSelection}
                    className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded"
                  >
                    Clear
                  </button>
          </div>
          
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {users.length === 0 ? (
                    <p className="text-gray-500 text-center py-2">No users found</p>
                  ) : (
                    users.map(user => (
                      <div key={user._id} className="flex items-center py-1 border-b border-gray-100 last:border-b-0">
                <input
                  type="checkbox"
                  id={`user-${user._id}`}
                          checked={formData.selectedUsers.includes(user._id)}
                          onChange={() => handleUserCheckboxChange(user._id)}
                          className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 rounded"
                />
                        <label htmlFor={`user-${user._id}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                  {user.fullName} ({user.personalEmail})
                </label>
                      </div>
                    ))
                  )}
                </div>
                
                <p className="text-sm text-gray-500 mt-1">
                  {formData.selectedUsers.length} users selected
                </p>
              </div>
              
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {sending ? 'Sending...' : 'Send Notification'}
              </button>
            </form>
          </div>
          
          {/* Notification History */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Notification History</h2>
            
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No notifications yet
              </div>
            ) : (
              <>
                <div className="space-y-4 max-h-[500px] overflow-y-auto mb-4">
                  {notifications.map(notification => (
                    <div 
                      key={notification._id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{notification.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          notification.type === 'Fee Payment Reminder' 
                            ? 'bg-red-100 text-red-800' 
                            : notification.type === 'New Course Announcement'
                            ? 'bg-green-100 text-green-800'
                            : notification.type === 'Assignment'
                            ? 'bg-yellow-100 text-yellow-800'
                            : notification.type === 'Exam'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {notification.type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {formatDate(notification.timestamp)}
                      </div>
                    </div>
                  ))}
        </div>
        
                {/* Pagination Controls */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-500">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} notifications
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <div className="flex items-center space-x-1">
                      {[...Array(pagination.totalPages).keys()].map(i => {
                        const pageNum = i + 1;
                        // Show first, last, current and 1 page before and after current
                        if (
                          pageNum === 1 || 
                          pageNum === pagination.totalPages || 
                          (pageNum >= pagination.page - 1 && pageNum <= pagination.page + 1)
                        ) {
                          return (
          <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-8 h-8 flex items-center justify-center rounded-md ${
                                pageNum === pagination.page 
                                  ? 'bg-indigo-600 text-white' 
                                  : 'border border-gray-300 text-gray-700'
                              }`}
          >
                              {pageNum}
          </button>
                          );
                        } else if (
                          (pageNum === 2 && pagination.page > 3) || 
                          (pageNum === pagination.totalPages - 1 && pagination.page < pagination.totalPages - 2)
                        ) {
                          return <span key={pageNum} className="text-gray-500">...</span>;
                        }
                        return null;
                      })}
                    </div>
          <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
                      Next
          </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
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

export default NotificationManager;