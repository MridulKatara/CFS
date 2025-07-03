import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Fee Payment Reminder', 'New Course Announcement', 'System Maintenance'],
  },
  timestamp: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  details: {
    type: mongoose.Schema.Types.Mixed, // Allows flexible structure per type
    required: false,
  },
}, {
  timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
