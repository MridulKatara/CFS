import mongoose from 'mongoose';

const userNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  notificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
    required: true
  },
  notificationTitle: {
    type: String,
    required: true
  },
  notificationType: {
    type: String,
    required: true,
    enum: ['Fee Payment Reminder', 'New Course Announcement', 'System Maintenance', 'Assignment', 'Exam', 'General']
  },
  deliveryStatus: {
    type: String,
    required: true,
    enum: ['success', 'failed'],
    default: 'success'
  },
  deliveryError: {
    type: String
  },
  deliveredAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Create indexes for faster queries
userNotificationSchema.index({ userId: 1, isRead: 1 });
userNotificationSchema.index({ deliveredAt: -1 });

const UserNotification = mongoose.model('UserNotification', userNotificationSchema);
export default UserNotification; 