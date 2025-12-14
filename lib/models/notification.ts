import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  // Basic Information
  userId: mongoose.Types.ObjectId;
  type: 'booking' | 'message' | 'review' | 'system' | 'promotion' | 'payment' | 'vendor' | 'wedding' | 'guest' | 'referral';
  category: 'info' | 'success' | 'warning' | 'error' | 'reminder';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Content
  title: string;
  message: string;
  shortMessage?: string; // For push notifications
  actionText?: string; // e.g., "View Booking", "Reply"
  actionUrl?: string; // Deep link or URL
  
  // Data and Context
  data?: {
    bookingId?: mongoose.Types.ObjectId;
    vendorId?: mongoose.Types.ObjectId;
    messageId?: mongoose.Types.ObjectId;
    reviewId?: mongoose.Types.ObjectId;
    paymentId?: mongoose.Types.ObjectId;
    weddingId?: mongoose.Types.ObjectId;
    guestId?: string;
    referralId?: mongoose.Types.ObjectId;
    amount?: number;
    currency?: string;
    [key: string]: any;
  };
  
  // Delivery Channels
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  
  // Delivery Status
  deliveryStatus: {
    inApp: 'pending' | 'delivered' | 'failed';
    email: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
    sms: 'pending' | 'sent' | 'delivered' | 'failed';
    push: 'pending' | 'sent' | 'delivered' | 'failed';
  };
  
  // Read Status
  read: boolean;
  readAt?: Date;
  
  // Interaction
  clicked: boolean;
  clickedAt?: Date;
  actionTaken?: string;
  actionTakenAt?: Date;
  
  // Scheduling
  scheduledFor?: Date; // For delayed notifications
  expiresAt?: Date; // Auto-expire notifications
  
  // Grouping
  groupKey?: string; // For grouping similar notifications
  parentNotificationId?: mongoose.Types.ObjectId; // For threaded notifications
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  // Basic Information
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['booking', 'message', 'review', 'system', 'promotion', 'payment', 'vendor', 'wedding', 'guest', 'referral']
  },
  category: {
    type: String,
    required: true,
    enum: ['info', 'success', 'warning', 'error', 'reminder'],
    default: 'info'
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Content
  title: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 500,
    trim: true
  },
  shortMessage: {
    type: String,
    maxlength: 100,
    trim: true
  },
  actionText: {
    type: String,
    maxlength: 50,
    trim: true
  },
  actionUrl: {
    type: String,
    maxlength: 500,
    trim: true
  },
  
  // Data and Context
  data: {
    type: Schema.Types.Mixed,
    default: {}
  },
  
  // Delivery Channels
  channels: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  
  // Delivery Status
  deliveryStatus: {
    inApp: {
      type: String,
      enum: ['pending', 'delivered', 'failed'],
      default: 'pending'
    },
    email: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed', 'bounced'],
      default: 'pending'
    },
    sms: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed'],
      default: 'pending'
    },
    push: {
      type: String,
      enum: ['pending', 'sent', 'delivered', 'failed'],
      default: 'pending'
    }
  },
  
  // Read Status
  read: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  
  // Interaction
  clicked: {
    type: Boolean,
    default: false
  },
  clickedAt: {
    type: Date
  },
  actionTaken: {
    type: String,
    maxlength: 100,
    trim: true
  },
  actionTakenAt: {
    type: Date
  },
  
  // Scheduling
  scheduledFor: {
    type: Date
  },
  expiresAt: {
    type: Date
  },
  
  // Grouping
  groupKey: {
    type: String
  },
  parentNotificationId: {
    type: Schema.Types.ObjectId,
    ref: 'Notification'
  }
}, {
  timestamps: true
});

// Indexes for performance
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, type: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, priority: 1, createdAt: -1 });
NotificationSchema.index({ scheduledFor: 1 }, { expireAfterSeconds: 0 }); // TTL for scheduled notifications
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL for expiring notifications

// Virtual for delivery status summary
NotificationSchema.virtual('deliverySummary').get(function() {
  const statuses = Object.values(this.deliveryStatus);
  const delivered = statuses.filter(status => status === 'delivered').length;
  const failed = statuses.filter(status => status === 'failed').length;
  const pending = statuses.filter(status => status === 'pending').length;
  
  return {
    delivered,
    failed,
    pending,
    total: statuses.length
  };
});

// Method to mark as read
NotificationSchema.methods.markAsRead = function() {
  this.read = true;
  this.readAt = new Date();
  return this.save();
};

// Method to mark as clicked
NotificationSchema.methods.markAsClicked = function(actionTaken?: string) {
  this.clicked = true;
  this.clickedAt = new Date();
  if (actionTaken) {
    this.actionTaken = actionTaken;
    this.actionTakenAt = new Date();
  }
  return this.save();
};

// Static method to create notification
NotificationSchema.statics.createNotification = async function(
  userId: mongoose.Types.ObjectId,
  type: string,
  title: string,
  message: string,
  options: any = {}
) {
  const notification = new this({
    userId,
    type,
    title,
    message,
    shortMessage: options.shortMessage || message.substring(0, 100),
    actionText: options.actionText,
    actionUrl: options.actionUrl,
    data: options.data || {},
    channels: {
      inApp: options.channels?.inApp !== false,
      email: options.channels?.email || false,
      sms: options.channels?.sms || false,
      push: options.channels?.push !== false
    },
    priority: options.priority || 'medium',
    category: options.category || 'info',
    scheduledFor: options.scheduledFor,
    expiresAt: options.expiresAt,
    groupKey: options.groupKey
  });

  await notification.save();
  
  // Trigger delivery (implement notification service)
  // await NotificationService.deliver(notification);
  
  return notification;
};

export const Notification = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);