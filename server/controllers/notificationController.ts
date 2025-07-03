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

    // Update user's FCM tokens (add if not exists)
    await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { fcmTokens: token } },
      { new: true }
    );

    return { success: true, message: 'Token saved successfully' };
  } catch (error: any) {
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
    const { userIds, title, message, type, details = {} } = body;
    
    if (!userIds || !Array.isArray(userIds) || !title || !message) {
      throw new Error('Invalid notification data');
    }

    // Find users and their FCM tokens
    const users = await User.find({ _id: { $in: userIds } });
    const tokens = users.flatMap(user => user.fcmTokens || []);

    if (tokens.length === 0) {
      throw new Error('No FCM tokens found for the selected users');
    }

    // Create notification records in the database
    const notificationPromises = users.map(user => 
      Notification.create({
        userId: user._id,
        title,
        message,
        type: type || 'General',
        details
      })
    );
    
    await Promise.all(notificationPromises);

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

    return { 
      success: true, 
      message: `Notification sent successfully to ${response.successCount} devices`,
      failureCount: response.failureCount
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error sending notification');
  }
};
