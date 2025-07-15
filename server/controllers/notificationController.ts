import { sendNotificationToWeb } from '../config/firebase';
import User from '../models/User';
import Notification from '../models/Notification';
import UserNotification from '../models/UserNotification';

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

// Get user's notifications with pagination
export const getUserNotifications = async ({ user, query }: any) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await UserNotification.countDocuments({ userId: user._id });
    
    const userNotifications = await UserNotification.find({ userId: user._id })
      .sort({ deliveredAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return { 
      success: true, 
      notifications: userNotifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching notifications');
  }
};

// Mark notification as read
export const markNotificationAsRead = async ({ params, user }: any) => {
  try {
    const now = new Date();
    const userNotification = await UserNotification.findOneAndUpdate(
      { _id: params.id, userId: user._id },
      { 
        isRead: true,
        readAt: now 
      },
      { new: true }
    );

    if (!userNotification) {
      throw new Error('Notification not found');
    }

    return { success: true, notification: userNotification };
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
    const tokens = users.map(u => u.fcmToken).filter(Boolean) as string[];
    console.log('Valid tokens found:', tokens.length);

    // Create a global notification record
    const notification = await Notification.create({
      userId: userIds[0], // Just need a reference user
      title,
      message,
      type: type || 'System Maintenance',
      details,
      timestamp: new Date()
    });
    
    console.log('Created global notification:', notification._id);
    
    // Create user-specific notification records
    const userNotificationPromises = users.map(async (user) => {
      try {
        return await UserNotification.create({
          userId: user._id,
          notificationId: notification._id,
          notificationTitle: title,
          notificationType: type || 'System Maintenance',
          deliveryStatus: user.fcmToken ? 'success' : 'failed',
          deliveryError: user.fcmToken ? undefined : 'No FCM token available',
          deliveredAt: new Date(),
          isRead: false
        });
      } catch (err) {
        console.error(`Failed to create user notification for user ${user._id}:`, err);
        return null;
      }
    });
    
    const userNotifications = await Promise.all(userNotificationPromises);
    console.log('Created user notifications:', userNotifications.filter(Boolean).length);
    
    if (tokens.length === 0) {
      return { 
        success: true, 
        message: 'Notifications saved to database but no FCM tokens available for push delivery',
        notificationId: notification._id,
        userNotificationsCreated: userNotifications.filter(Boolean).length
      };
    }

    // Send push notification via Firebase
    try {
      const clickActionUrl = '/notification';
      const response = await sendNotificationToWeb(tokens, title, message, clickActionUrl);

      console.log(`Push notification results: ${response.successCount} successful, ${response.failureCount} failed`);
      
      // Update delivery status for failed notifications
      if (response.failureCount > 0 && 'responses' in response) {
        const updatePromises: Promise<any>[] = [];
        
        for (let i = 0; i < response.responses.length; i++) {
          const result = response.responses[i];
          if (!result.success && tokens[i]) {
            // Find the user with this token
            const user = users.find(u => u.fcmToken === tokens[i]);
            if (user) {
              updatePromises.push(
                UserNotification.updateOne(
                  { userId: user._id, notificationId: notification._id },
                  { 
                    deliveryStatus: 'failed',
                    deliveryError: result.error?.message || 'Unknown error'
                  }
                )
              );
            }
          }
        }
        
        if (updatePromises.length > 0) {
          await Promise.all(updatePromises);
          console.log(`Updated delivery status for ${updatePromises.length} failed notifications`);
        }
      }

      return { 
        success: true, 
        message: `Notification sent successfully to ${response.successCount} devices`,
        failureCount: response.failureCount,
        totalTokens: tokens.length,
        notificationId: notification._id
      };
    } catch (pushError: any) {
      console.error('❌ Error sending push notifications:', pushError);
      
      // Update all delivery statuses to failed
      await UserNotification.updateMany(
        { notificationId: notification._id },
        { 
          deliveryStatus: 'failed',
          deliveryError: pushError.message || 'Push notification delivery failed'
        }
      );
      
      // Return partial success since database notifications were created
      return { 
        success: true, 
        message: `Notifications saved to database but push delivery failed: ${pushError.message}`,
        failureCount: tokens.length,
        totalTokens: tokens.length,
        pushError: pushError.message,
        notificationId: notification._id
      };
    }
  } catch (error: any) {
    console.error('❌ Error in sendNotification:', error);
    throw new Error(error.message || 'Error sending notification');
  }
};

// Admin: Get notifications with pagination
export const getRecentNotifications = async ({ query }: any) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await Notification.countDocuments();
    
    // Get paginated notifications
    const notifications = await Notification.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return { 
      success: true, 
      notifications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error: any) {
    console.error('Error fetching recent notifications:', error);
    throw new Error(error.message || 'Error fetching recent notifications');
  }
};

// Get unread notification count for a user
export const getUnreadNotificationCount = async ({ user }: any) => {
  try {
    const count = await UserNotification.countDocuments({ 
      userId: user._id,
      isRead: false
    });

    return { success: true, count };
  } catch (error: any) {
    throw new Error(error.message || 'Error fetching unread notification count');
  }
};

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = async ({ user }: any) => {
  try {
    const now = new Date();
    const result = await UserNotification.updateMany(
      { userId: user._id, isRead: false },
      { isRead: true, readAt: now }
    );

    return { 
      success: true, 
      message: `Marked ${result.modifiedCount} notifications as read` 
    };
  } catch (error: any) {
    throw new Error(error.message || 'Error marking all notifications as read');
  }
};
