import { messaging, sendMulticast } from '../config/firebase';
import User from '../models/User';
import Notification from '../models/Notification';

// Save FCM token for a user
export const saveNotificationToken = async ({ body, user }: any) => {
  try {
    const { token } = body;
    if (!token) {
      throw new Error('No token provided');
    }

    console.log('Saving FCM token for user:', user._id, 'Token:', token);

    // Update user's FCM tokens (add if not exists)
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { fcmTokens: token } },
      { new: true }
    );

    console.log('Updated user FCM tokens:', updatedUser?.fcmTokens);

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
    console.log('Users FCM tokens:', users.map(u => ({ id: u._id, tokens: u.fcmTokens || [] })));
    
    const tokens = users.flatMap(user => user.fcmTokens || []);
    console.log('Total tokens found:', tokens.length);

    if (tokens.length === 0) {
      const userDetails = users.map(u => `${u.fullName} (${u.personalEmail}): ${u.fcmTokens?.length || 0} tokens`).join(', ');
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
    
    const notificationPromises = users.map(user => {
      const userNotificationData = {
        ...notificationData,
        userId: user._id
      };
      console.log('Creating notification for user:', user._id, 'with data:', userNotificationData);
      return Notification.create(userNotificationData);
    });
    
    try {
      await Promise.all(notificationPromises);
      console.log('✅ All notifications created successfully');
    } catch (dbError: any) {
      console.error('❌ Database error creating notifications:', dbError);
      throw new Error(`Failed to create notifications: ${dbError.message || 'Unknown database error'}`);
    }

    // Send push notification via Firebase
    const response = await sendMulticast({
      tokens,
      notification: {
        title,
        body: message
      },
      data: {
        type,
        ...details,
        url: '/notification'
      }
    });

    if (response.successCount === 0 && tokens.length > 0) {
      console.warn('⚠️ No notifications were sent successfully despite having tokens');
    }

    return { 
      success: true, 
      message: `Notification sent successfully to ${response.successCount} devices`,
      failureCount: response.failureCount,
      totalTokens: tokens.length
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error sending notification');
  }
};
