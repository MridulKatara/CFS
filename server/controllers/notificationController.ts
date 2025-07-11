import { messaging, sendNotificationToWeb } from '../config/firebase';
import User from '../models/User';
import Notification from '../models/Notification';

// Save FCM token for a user - update to replace token instead of adding to array
export const saveNotificationToken = async ({ body, user }: any) => {
  try {
    const { token } = body;
    if (!token) {
      throw new Error('No token provided');
    }

    console.log('Saving FCM token for user:', user._id, 'Token:', token);

    // Update user's FCM token - replace instead of addToSet
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { fcmToken: token }, // Store as single token instead of array
      { new: true }
    );

    console.log('Updated user FCM token:', updatedUser?.fcmToken);

    return { success: true, message: 'Token saved successfully' };
  } catch (error: any) {
    console.error('Error saving FCM token:', error);
    throw new Error(error.message || 'Error saving notification token');
  }
};

// Get user's notifications
export const getUserNotifications = async ({ user }: any) => {
  try {
    const notifications = await Notification.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return { success: true, notifications };
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching notifications');
  }
};

// Mark notification as read
export const markNotificationAsRead = async ({ params, user }: any) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: params.id, userId: user._id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new Error('Notification not found');
    }

    return { success: true, notification };
  } catch (error: any) {
    throw new Error(error.message || 'Error marking notification as read');
  }
};

// Admin: Send notification to users
export const sendNotification = async ({ body }: any) => {
  try {
    console.log('🚀 sendNotification called with:', body);
    const { userIds, title, message, type, details = {} } = body;
    
    if (!userIds || !Array.isArray(userIds) || !title || !message) {
      throw new Error('Invalid notification data');
    }

    // Find users and their FCM tokens
    const users = await User.find({ _id: { $in: userIds } });
    console.log('Found users:', users.length);
    
    // Extract single tokens from users
    const tokens = users.map(u => u.fcmToken).filter(Boolean);
    console.log('Valid tokens found:', tokens.length);
    
    if (tokens.length === 0) {
      const userDetails = users.map(u => `${u.fullName} (${u.personalEmail}): ${u.fcmToken ? 'Has token' : 'No token'}`).join(', ');
      throw new Error(`No FCM tokens found for the selected users. Found ${users.length} users but no tokens. Users: ${userDetails}. Make sure users have visited the application and granted notification permissions.`);
    }

    // Create notification records in the database
    const notificationData = {
      title,
      message,
      type: type || 'System Maintenance',
      details,
      timestamp: new Date()
    };
    
    console.log('Creating notification with data:', notificationData);
    
    // First create all notifications in the database
    try {
      const notificationPromises = users.map(user => {
        const userNotificationData = {
          ...notificationData,
          userId: user._id
        };
        console.log('Creating notification for user:', user._id, 'with data:', userNotificationData);
        return Notification.create(userNotificationData);
      });
      
      await Promise.all(notificationPromises);
      console.log('✅ All notifications created successfully');
    } catch (dbError: any) {
      console.error('❌ Database error creating notifications:', dbError);
      throw new Error(`Failed to create notifications: ${dbError.message || 'Unknown database error'}`);
    }

    // Then attempt to send push notifications using the new function
    try {
      // Send push notification via Firebase using the new function
      const clickActionUrl = '/notification';
      const response = await sendNotificationToWeb(tokens, title, message, clickActionUrl);

      console.log(`Push notification results: ${response.successCount} successful, ${response.failureCount} failed`);
      
      if (response.successCount === 0 && tokens.length > 0) {
        console.warn('⚠️ No notifications were sent successfully despite having tokens');
      }

      return { 
        success: true, 
        message: `Notification sent successfully to ${response.successCount} devices`,
        failureCount: response.failureCount,
        totalTokens: tokens.length
      };
    } catch (pushError: any) {
      console.error('❌ Error sending push notifications:', pushError);
      
      // Return partial success since database notifications were created
      return { 
        success: true, 
        message: `Notifications saved to database but push delivery failed: ${pushError.message}`,
        failureCount: tokens.length,
        totalTokens: tokens.length,
        pushError: pushError.message
      };
    }
  } catch (error: any) {
    console.error('❌ Error in sendNotification:', error);
    throw new Error(error.message || 'Error sending notification');
  }
};

// Admin: Get recent unique notifications (for dashboard)
export const getRecentNotifications = async () => {
  try {
    // Aggregate to get unique notifications by title, message, and type
    // Sort by timestamp in descending order and limit to 5 most recent
    const recentNotifications = await Notification.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            title: "$title",
            message: "$message",
            type: "$type"
          },
          timestamp: { $first: "$timestamp" },
          details: { $first: "$details" },
          id: { $first: "$_id" }
        }
      },
      {
        $project: {
          _id: 0,
          id: "$id",
          title: "$_id.title",
          message: "$_id.message",
          type: "$_id.type",
          timestamp: 1,
          details: 1
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $limit: 5
      }
    ]);

    return { success: true, notifications: recentNotifications };
  } catch (error: any) {
    console.error('Error fetching recent notifications:', error);
    throw new Error(error.message || 'Error fetching recent notifications');
  }
};
