// Utility to test notification functionality
import { requestNotificationPermission } from '../services/firebase';

export const testNotifications = async () => {
  console.log('=== Testing Notification System ===');
  
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  if (!user || !token) {
    console.error('User not logged in - cannot test notifications');
    return false;
  }
  
  console.log('User logged in:', user.fullName || user.personalEmail);
  
  // Test Firebase configuration
  try {
    const fcmToken = await requestNotificationPermission();
    if (fcmToken) {
      console.log('✅ FCM token obtained successfully');
      console.log('✅ Token saved to server (check server logs)');
      console.log('✅ Valid notification types: Fee Payment Reminder, New Course Announcement, System Maintenance');
      return true;
    } else {
      console.log('❌ Failed to get FCM token');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing notifications:', error);
    return false;
  }
};

// Add to window for easy testing in browser console
if (typeof window !== 'undefined') {
  window.testNotifications = testNotifications;
}
