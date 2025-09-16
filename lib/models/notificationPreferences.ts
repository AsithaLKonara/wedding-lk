import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationPreferences extends Document {
  // User Information
  userId: mongoose.Types.ObjectId;
  
  // Email Notifications
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'daily' | 'weekly' | 'never';
    types: {
      bookingUpdates: boolean;
      newMessages: boolean;
      vendorResponses: boolean;
      paymentConfirmations: boolean;
      eventReminders: boolean;
      marketing: boolean;
      security: boolean;
      weeklyDigest: boolean;
      socialActivity: boolean;
      systemUpdates: boolean;
    };
    digestSettings: {
      includeBookings: boolean;
      includeMessages: boolean;
      includeSocialActivity: boolean;
      includeRecommendations: boolean;
      maxItems: number;
    };
  };
  
  // SMS Notifications
  sms: {
    enabled: boolean;
    phoneNumber?: string; // Encrypted
    types: {
      bookingReminders: boolean;
      paymentConfirmations: boolean;
      securityAlerts: boolean;
      urgentMessages: boolean;
    };
    quietHours: {
      enabled: boolean;
      startTime: string; // HH:MM format
      endTime: string; // HH:MM format
      timezone: string;
    };
  };
  
  // Push Notifications
  push: {
    enabled: boolean;
    types: {
      newMessages: boolean;
      bookingUpdates: boolean;
      vendorResponses: boolean;
      socialActivity: boolean;
      marketing: boolean;
      security: boolean;
      recommendations: boolean;
      eventReminders: boolean;
    };
    sound: boolean;
    vibration: boolean;
    badge: boolean;
    quietHours: {
      enabled: boolean;
      startTime: string; // HH:MM format
      endTime: string; // HH:MM format
      timezone: string;
    };
  };
  
  // In-App Notifications
  inApp: {
    enabled: boolean;
    showBanner: boolean;
    showToast: boolean;
    showBadge: boolean;
    types: {
      newMessages: boolean;
      bookingUpdates: boolean;
      vendorResponses: boolean;
      socialActivity: boolean;
      marketing: boolean;
      security: boolean;
      recommendations: boolean;
      systemUpdates: boolean;
    };
    position: 'top' | 'bottom' | 'center';
    duration: number; // Seconds
    autoHide: boolean;
  };
  
  // Social Notifications
  social: {
    likes: boolean;
    comments: boolean;
    shares: boolean;
    mentions: boolean;
    follows: boolean;
    friendRequests: boolean;
    groupInvites: boolean;
    eventInvites: boolean;
  };
  
  // Booking Notifications
  booking: {
    confirmations: boolean;
    reminders: boolean;
    modifications: boolean;
    cancellations: boolean;
    payments: boolean;
    reviews: boolean;
    vendorResponses: boolean;
    advanceReminderDays: number; // Days before event
  };
  
  // Vendor Notifications
  vendor: {
    newBookings: boolean;
    bookingModifications: boolean;
    cancellations: boolean;
    payments: boolean;
    reviews: boolean;
    inquiries: boolean;
    availabilityUpdates: boolean;
    performanceReports: boolean;
  };
  
  // Marketing Notifications
  marketing: {
    promotions: boolean;
    newFeatures: boolean;
    tips: boolean;
    surveys: boolean;
    newsletters: boolean;
    partnerOffers: boolean;
    seasonalCampaigns: boolean;
    frequency: 'daily' | 'weekly' | 'monthly' | 'never';
  };
  
  // Security Notifications
  security: {
    loginAttempts: boolean;
    passwordChanges: boolean;
    twoFactorAuth: boolean;
    suspiciousActivity: boolean;
    dataBreaches: boolean;
    accountChanges: boolean;
    deviceChanges: boolean;
  };
  
  // Advanced Settings
  advanced: {
    batchNotifications: boolean;
    batchInterval: number; // Minutes
    maxNotificationsPerBatch: number;
    priorityLevels: {
      high: string[]; // Notification types with high priority
      medium: string[]; // Notification types with medium priority
      low: string[]; // Notification types with low priority
    };
    customRules: Array<{
      condition: string;
      action: string;
      enabled: boolean;
    }>;
  };
  
  // Delivery Preferences
  delivery: {
    preferredChannels: string[]; // Order of preference
    fallbackChannels: string[]; // Fallback if primary fails
    retryAttempts: number;
    retryInterval: number; // Minutes
    maxRetryAttempts: number;
  };
  
  // Analytics
  analytics: {
    totalNotifications: number;
    deliveredNotifications: number;
    openedNotifications: number;
    clickedNotifications: number;
    deliveryRate: number; // Percentage
    openRate: number; // Percentage
    clickRate: number; // Percentage
    lastUpdated: Date;
  };
  
  // Status
  status: 'active' | 'inactive' | 'suspended';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const NotificationPreferencesSchema = new Schema<INotificationPreferences>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  email: {
    enabled: { type: Boolean, default: true },
    frequency: {
      type: String,
      enum: ['immediate', 'daily', 'weekly', 'never'],
      default: 'immediate'
    },
    types: {
      bookingUpdates: { type: Boolean, default: true },
      newMessages: { type: Boolean, default: true },
      vendorResponses: { type: Boolean, default: true },
      paymentConfirmations: { type: Boolean, default: true },
      eventReminders: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
      security: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
      socialActivity: { type: Boolean, default: true },
      systemUpdates: { type: Boolean, default: true }
    },
    digestSettings: {
      includeBookings: { type: Boolean, default: true },
      includeMessages: { type: Boolean, default: true },
      includeSocialActivity: { type: Boolean, default: true },
      includeRecommendations: { type: Boolean, default: true },
      maxItems: { type: Number, default: 10 }
    }
  },
  
  sms: {
    enabled: { type: Boolean, default: false },
    phoneNumber: String, // Should be encrypted in production
    types: {
      bookingReminders: { type: Boolean, default: true },
      paymentConfirmations: { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true },
      urgentMessages: { type: Boolean, default: true }
    },
    quietHours: {
      enabled: { type: Boolean, default: false },
      startTime: { type: String, default: '22:00' },
      endTime: { type: String, default: '08:00' },
      timezone: { type: String, default: 'Asia/Colombo' }
    }
  },
  
  push: {
    enabled: { type: Boolean, default: true },
    types: {
      newMessages: { type: Boolean, default: true },
      bookingUpdates: { type: Boolean, default: true },
      vendorResponses: { type: Boolean, default: true },
      socialActivity: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
      security: { type: Boolean, default: true },
      recommendations: { type: Boolean, default: true },
      eventReminders: { type: Boolean, default: true }
    },
    sound: { type: Boolean, default: true },
    vibration: { type: Boolean, default: true },
    badge: { type: Boolean, default: true },
    quietHours: {
      enabled: { type: Boolean, default: false },
      startTime: { type: String, default: '22:00' },
      endTime: { type: String, default: '08:00' },
      timezone: { type: String, default: 'Asia/Colombo' }
    }
  },
  
  inApp: {
    enabled: { type: Boolean, default: true },
    showBanner: { type: Boolean, default: true },
    showToast: { type: Boolean, default: true },
    showBadge: { type: Boolean, default: true },
    types: {
      newMessages: { type: Boolean, default: true },
      bookingUpdates: { type: Boolean, default: true },
      vendorResponses: { type: Boolean, default: true },
      socialActivity: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
      security: { type: Boolean, default: true },
      recommendations: { type: Boolean, default: true },
      systemUpdates: { type: Boolean, default: true }
    },
    position: {
      type: String,
      enum: ['top', 'bottom', 'center'],
      default: 'top'
    },
    duration: { type: Number, default: 5 },
    autoHide: { type: Boolean, default: true }
  },
  
  social: {
    likes: { type: Boolean, default: true },
    comments: { type: Boolean, default: true },
    shares: { type: Boolean, default: true },
    mentions: { type: Boolean, default: true },
    follows: { type: Boolean, default: true },
    friendRequests: { type: Boolean, default: true },
    groupInvites: { type: Boolean, default: true },
    eventInvites: { type: Boolean, default: true }
  },
  
  booking: {
    confirmations: { type: Boolean, default: true },
    reminders: { type: Boolean, default: true },
    modifications: { type: Boolean, default: true },
    cancellations: { type: Boolean, default: true },
    payments: { type: Boolean, default: true },
    reviews: { type: Boolean, default: true },
    vendorResponses: { type: Boolean, default: true },
    advanceReminderDays: { type: Number, default: 7 }
  },
  
  vendor: {
    newBookings: { type: Boolean, default: true },
    bookingModifications: { type: Boolean, default: true },
    cancellations: { type: Boolean, default: true },
    payments: { type: Boolean, default: true },
    reviews: { type: Boolean, default: true },
    inquiries: { type: Boolean, default: true },
    availabilityUpdates: { type: Boolean, default: true },
    performanceReports: { type: Boolean, default: true }
  },
  
  marketing: {
    promotions: { type: Boolean, default: false },
    newFeatures: { type: Boolean, default: true },
    tips: { type: Boolean, default: true },
    surveys: { type: Boolean, default: false },
    newsletters: { type: Boolean, default: false },
    partnerOffers: { type: Boolean, default: false },
    seasonalCampaigns: { type: Boolean, default: false },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'never'],
      default: 'weekly'
    }
  },
  
  security: {
    loginAttempts: { type: Boolean, default: true },
    passwordChanges: { type: Boolean, default: true },
    twoFactorAuth: { type: Boolean, default: true },
    suspiciousActivity: { type: Boolean, default: true },
    dataBreaches: { type: Boolean, default: true },
    accountChanges: { type: Boolean, default: true },
    deviceChanges: { type: Boolean, default: true }
  },
  
  advanced: {
    batchNotifications: { type: Boolean, default: false },
    batchInterval: { type: Number, default: 15 }, // minutes
    maxNotificationsPerBatch: { type: Number, default: 5 },
    priorityLevels: {
      high: [String],
      medium: [String],
      low: [String]
    },
    customRules: [{
      condition: String,
      action: String,
      enabled: { type: Boolean, default: true }
    }]
  },
  
  delivery: {
    preferredChannels: [String],
    fallbackChannels: [String],
    retryAttempts: { type: Number, default: 3 },
    retryInterval: { type: Number, default: 5 }, // minutes
    maxRetryAttempts: { type: Number, default: 5 }
  },
  
  analytics: {
    totalNotifications: { type: Number, default: 0 },
    deliveredNotifications: { type: Number, default: 0 },
    openedNotifications: { type: Number, default: 0 },
    clickedNotifications: { type: Number, default: 0 },
    deliveryRate: { type: Number, default: 0 },
    openRate: { type: Number, default: 0 },
    clickRate: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
NotificationPreferencesSchema.index({ userId: 1 });
NotificationPreferencesSchema.index({ status: 1 });
NotificationPreferencesSchema.index({ 'email.enabled': 1 });
NotificationPreferencesSchema.index({ 'sms.enabled': 1 });
NotificationPreferencesSchema.index({ 'push.enabled': 1 });
NotificationPreferencesSchema.index({ 'inApp.enabled': 1 });

// Instance methods
NotificationPreferencesSchema.methods.updateAnalytics = function(delivered: boolean, opened: boolean, clicked: boolean) {
  this.analytics.totalNotifications += 1;
  
  if (delivered) {
    this.analytics.deliveredNotifications += 1;
  }
  
  if (opened) {
    this.analytics.openedNotifications += 1;
  }
  
  if (clicked) {
    this.analytics.clickedNotifications += 1;
  }
  
  // Calculate rates
  if (this.analytics.totalNotifications > 0) {
    this.analytics.deliveryRate = (this.analytics.deliveredNotifications / this.analytics.totalNotifications) * 100;
  }
  
  if (this.analytics.deliveredNotifications > 0) {
    this.analytics.openRate = (this.analytics.openedNotifications / this.analytics.deliveredNotifications) * 100;
  }
  
  if (this.analytics.openedNotifications > 0) {
    this.analytics.clickRate = (this.analytics.clickedNotifications / this.analytics.openedNotifications) * 100;
  }
  
  this.analytics.lastUpdated = new Date();
  return this.save();
};

NotificationPreferencesSchema.methods.isNotificationEnabled = function(type: string, channel: string) {
  switch (channel) {
    case 'email':
      return this.email.enabled && this.email.types[type];
    case 'sms':
      return this.sms.enabled && this.sms.types[type];
    case 'push':
      return this.push.enabled && this.push.types[type];
    case 'inApp':
      return this.inApp.enabled && this.inApp.types[type];
    default:
      return false;
  }
};

NotificationPreferencesSchema.methods.enableChannel = function(channel: string) {
  switch (channel) {
    case 'email':
      this.email.enabled = true;
      break;
    case 'sms':
      this.sms.enabled = true;
      break;
    case 'push':
      this.push.enabled = true;
      break;
    case 'inApp':
      this.inApp.enabled = true;
      break;
  }
  return this.save();
};

NotificationPreferencesSchema.methods.disableChannel = function(channel: string) {
  switch (channel) {
    case 'email':
      this.email.enabled = false;
      break;
    case 'sms':
      this.sms.enabled = false;
      break;
    case 'push':
      this.push.enabled = false;
      break;
    case 'inApp':
      this.inApp.enabled = false;
      break;
  }
  return this.save();
};

NotificationPreferencesSchema.methods.setQuietHours = function(channel: string, startTime: string, endTime: string, timezone: string) {
  switch (channel) {
    case 'sms':
      this.sms.quietHours = {
        enabled: true,
        startTime,
        endTime,
        timezone
      };
      break;
    case 'push':
      this.push.quietHours = {
        enabled: true,
        startTime,
        endTime,
        timezone
      };
      break;
  }
  return this.save();
};

NotificationPreferencesSchema.methods.disableQuietHours = function(channel: string) {
  switch (channel) {
    case 'sms':
      this.sms.quietHours.enabled = false;
      break;
    case 'push':
      this.push.quietHours.enabled = false;
      break;
  }
  return this.save();
};

NotificationPreferencesSchema.methods.isInQuietHours = function(channel: string) {
  const now = new Date();
  const currentTime = now.toLocaleTimeString('en-US', { 
    hour12: false, 
    timeZone: 'Asia/Colombo' 
  }).substring(0, 5);
  
  switch (channel) {
    case 'sms':
      if (!this.sms.quietHours.enabled) return false;
      return this.isTimeInRange(currentTime, this.sms.quietHours.startTime, this.sms.quietHours.endTime);
    case 'push':
      if (!this.push.quietHours.enabled) return false;
      return this.isTimeInRange(currentTime, this.push.quietHours.startTime, this.push.quietHours.endTime);
    default:
      return false;
  }
};

NotificationPreferencesSchema.methods.isTimeInRange = function(currentTime: string, startTime: string, endTime: string) {
  const current = this.timeToMinutes(currentTime);
  const start = this.timeToMinutes(startTime);
  const end = this.timeToMinutes(endTime);
  
  if (start <= end) {
    return current >= start && current <= end;
  } else {
    // Overnight range
    return current >= start || current <= end;
  }
};

NotificationPreferencesSchema.methods.timeToMinutes = function(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Static methods
NotificationPreferencesSchema.statics.getUserPreferences = function(userId: string) {
  return this.findOne({ userId, status: 'active' });
};

NotificationPreferencesSchema.statics.createDefaultPreferences = function(userId: string) {
  return this.create({ userId });
};

NotificationPreferencesSchema.statics.getUsersForNotification = function(type: string, channel: string) {
  const query: any = { status: 'active' };
  
  switch (channel) {
    case 'email':
      query['email.enabled'] = true;
      query[`email.types.${type}`] = true;
      break;
    case 'sms':
      query['sms.enabled'] = true;
      query[`sms.types.${type}`] = true;
      break;
    case 'push':
      query['push.enabled'] = true;
      query[`push.types.${type}`] = true;
      break;
    case 'inApp':
      query['inApp.enabled'] = true;
      query[`inApp.types.${type}`] = true;
      break;
  }
  
  return this.find(query).populate('userId', 'name email phone');
};

export const NotificationPreferences = mongoose.models.NotificationPreferences || mongoose.model('NotificationPreferences', NotificationPreferencesSchema);
