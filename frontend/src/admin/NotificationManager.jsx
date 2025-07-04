import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import { testNotifications } from '../utils/notificationTest';

const NotificationManager = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'System Maintenance'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiService.getAllUsers();
        if (response.success) {
          setUsers(response.users);
        }
      } catch {
        setError('Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user._id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!notification.title || !notification.message) {
      setError('Title and message are required');
      return;
    }

    if (selectedUsers.length === 0) {
      setError('Please select at least one user');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await apiService.sendNotification({
        userIds: selectedUsers,
        title: notification.title,
        message: notification.message,
        type: notification.type
      });

      if (response.success) {
        setSuccess(`Notification sent successfully to ${response.successCount} devices`);
        setNotification({
          title: '',
          message: '',
          type: 'System Maintenance'
        });
        setSelectedUsers([]);
      } else {
        setError('Failed to send notification');
      }
    } catch (err) {
      setError(err.message || 'Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotifications = async () => {
    setError(null);
    setSuccess(null);
    
    try {
      const result = await testNotifications();
      if (result) {
        setSuccess('Notification test passed! Check browser console for details.');
      } else {
        setError('Notification test failed! Check browser console for details.');
      }
    } catch (err) {
      setError('Error running notification test: ' + err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-6">Notification Manager</h1>
      
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Notification Type
          </label>
          <select
            name="type"
            value={notification.type}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="Fee Payment Reminder">Fee Payment Reminder</option>
            <option value="New Course Announcement">New Course Announcement</option>
            <option value="System Maintenance">System Maintenance</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={notification.title}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Notification Title"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Message
          </label>
          <textarea
            name="message"
            value={notification.message}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Notification Message"
            rows="4"
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Recipients
          </label>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectedUsers.length === users.length && users.length > 0}
              onChange={handleSelectAll}
              className="mr-2"
            />
            <label htmlFor="selectAll">Select All</label>
          </div>
          
          <div className="max-h-60 overflow-y-auto border rounded p-2">
            {users.map(user => (
              <div key={user._id} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id={`user-${user._id}`}
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => handleUserSelection(user._id)}
                  className="mr-2"
                />
                <label htmlFor={`user-${user._id}`}>
                  {user.fullName} ({user.personalEmail})
                </label>
              </div>
            ))}
            {users.length === 0 && <p className="text-gray-500">No users found</p>}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
          <button
            type="button"
            onClick={handleTestNotifications}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Test Notifications
          </button>
        </div>
      </form>
    </div>
  );
};

export default NotificationManager;