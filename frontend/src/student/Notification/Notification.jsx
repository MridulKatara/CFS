import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavBar from '../ButtomNavItem';
import ApiService from '../../services/api';
import Snackbar from '../../components/Snackbar';

const Notification = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState(null);
    
    // Pagination state
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1
    });

    const fetchNotifications = async (page = 1) => {
        try {
            setLoading(true);
            const response = await ApiService.getUserNotifications(page, pagination.limit);
            
            if (response.success) {
                setNotifications(response.notifications || []);
                setPagination(response.pagination || pagination);
            } else {
                setError('Failed to load notifications');
                setSnackbar({
                    message: 'Failed to load notifications',
                    type: 'error'
                });
            }
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to load notifications');
            setSnackbar({
                message: 'Failed to load notifications',
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications(1);
    }, []);

    const handleNotificationClick = async (notification) => {
        try {
            // Mark notification as read when clicked
            if (!notification.isRead) {
                await ApiService.markNotificationAsRead(notification._id);
                
                // Update the notification in the local state
                setNotifications(prev => 
                    prev.map(n => 
                        n._id === notification._id 
                            ? { ...n, isRead: true, readAt: new Date() } 
                            : n
                    )
                );
            }
            
            // Navigate to notification detail
            navigate(`/notification/${notification._id}`);
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const response = await ApiService.markAllNotificationsAsRead();
            
            if (response.success) {
                // Update all notifications in the local state
                setNotifications(prev => 
                    prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
                );
                
                setSnackbar({
                    message: 'All notifications marked as read',
                    type: 'success'
                });
            }
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
            setSnackbar({
                message: 'Failed to mark all notifications as read',
                type: 'error'
            });
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchNotifications(newPage);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        try {
            const date = new Date(dateString);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return '';
            }
            
            return date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#f5f5f5] pb-20">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-4 py-5 flex items-center">
                <button 
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 flex items-center justify-center"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z" fill="#202124"/>
                    </svg>
                </button>
                <h1 className="text-[#202124] text-2xl font-semibold flex-1 text-center">Notifications</h1>
                {notifications.some(n => !n.isRead) && (
                    <button 
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-[#704ee7] font-medium"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Notifications List */}
            <div className="px-4 py-6 space-y-4">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#704ee7]"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-gray-500">
                        Failed to load notifications. Please try again later.
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                        No notifications yet.
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {notifications.map((notification) => (
                                <div 
                                    key={notification._id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`rounded-2xl bg-white p-4 shadow-sm ${
                                        !notification.isRead 
                                            ? 'border-l-[3px] border-[#704ee7]' 
                                            : ''
                                    }`}
                                >
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-base font-medium text-[#202124]">
                                                {notification.notificationTitle || "Notification"}
                                            </h3>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(notification.deliveredAt) || ""}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                notification.notificationType === 'Fee Payment Reminder' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : notification.notificationType === 'New Course Announcement'
                                                    ? 'bg-green-100 text-green-800'
                                                    : notification.notificationType === 'Assignment'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : notification.notificationType === 'Exam'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {notification.notificationType || "General"}
                                            </span>
                                            
                                            {!notification.isRead && (
                                                <span className="w-2 h-2 rounded-full bg-[#704ee7]"></span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Pagination Controls */}
                        {pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center mt-6 space-x-2">
                                <button
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor"/>
                                    </svg>
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
                                                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                                                        pageNum === pagination.page 
                                                            ? 'bg-[#704ee7] text-white' 
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
                                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 6L8.59 7.41L13.17 12L8.59 16.59L10 18L16 12L10 6Z" fill="currentColor"/>
                                    </svg>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <BottomNavBar />
            
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

export default Notification;
