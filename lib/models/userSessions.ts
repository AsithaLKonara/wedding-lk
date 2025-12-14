import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSession extends Document {
  // Session Information
  sessionId: string; // Unique session identifier
  userId: mongoose.Types.ObjectId;
  
  // Session Details
  sessionData: {
    isActive: boolean;
    loginTime: Date;
    lastActivity: Date;
    expiresAt: Date;
    ipAddress: string;
    userAgent: string;
    deviceType: 'mobile' | 'desktop' | 'tablet';
    browser: string;
    os: string;
    location?: {
      city: string;
      state: string;
      country: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
  };
  
  // Authentication Details
  authentication: {
    method: 'password' | 'google' | 'facebook' | 'apple' | 'two_factor';
    loginSource: 'web' | 'mobile_app' | 'api';
    rememberMe: boolean;
    twoFactorVerified: boolean;
    twoFactorMethod?: 'sms' | 'email' | 'totp' | 'backup_codes';
  };
  
  // Security Information
  security: {
    isSecure: boolean; // HTTPS connection
    isTrustedDevice: boolean;
    riskScore: number; // 0-100
    suspiciousActivity: boolean;
    blocked: boolean;
    blockReason?: string;
  };
  
  // Session Management
  management: {
    autoLogout: boolean;
    logoutTime?: Date;
    logoutReason?: 'user' | 'timeout' | 'security' | 'admin' | 'system';
    refreshToken?: string;
    refreshTokenExpires?: Date;
    concurrentSessions: number;
  };
  
  // Activity Tracking
  activity: {
    pageViews: number;
    actions: Array<{
      action: string;
      timestamp: Date;
      details?: any;
    }>;
    lastPage?: string;
    referrer?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const UserSessionSchema = new Schema<IUserSession>({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  sessionData: {
    isActive: { type: Boolean, default: true },
    loginTime: { type: Date, default: Date.now },
    lastActivity: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    deviceType: {
      type: String,
      enum: ['mobile', 'desktop', 'tablet'],
      default: 'desktop'
    },
    browser: String,
    os: String,
    location: {
      city: String,
      state: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    }
  },
  
  authentication: {
    method: {
      type: String,
      enum: ['password', 'google', 'facebook', 'apple', 'two_factor'],
      required: true
    },
    loginSource: {
      type: String,
      enum: ['web', 'mobile_app', 'api'],
      default: 'web'
    },
    rememberMe: { type: Boolean, default: false },
    twoFactorVerified: { type: Boolean, default: false },
    twoFactorMethod: {
      type: String,
      enum: ['sms', 'email', 'totp', 'backup_codes']
    }
  },
  
  security: {
    isSecure: { type: Boolean, default: true },
    isTrustedDevice: { type: Boolean, default: false },
    riskScore: { type: Number, default: 0, min: 0, max: 100 },
    suspiciousActivity: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    blockReason: String
  },
  
  management: {
    autoLogout: { type: Boolean, default: false },
    logoutTime: Date,
    logoutReason: {
      type: String,
      enum: ['user', 'timeout', 'security', 'admin', 'system']
    },
    refreshToken: String,
    refreshTokenExpires: Date,
    concurrentSessions: { type: Number, default: 1 }
  },
  
  activity: {
    pageViews: { type: Number, default: 0 },
    actions: [{
      action: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      details: Schema.Types.Mixed
    }],
    lastPage: String,
    referrer: String
  }
}, {
  timestamps: true
});

// Indexes
UserSessionSchema.index({ sessionId: 1 });
UserSessionSchema.index({ userId: 1 });
UserSessionSchema.index({ 'sessionData.isActive': 1 });
UserSessionSchema.index({ 'sessionData.expiresAt': 1 }, { expireAfterSeconds: 0 }); // TTL index
UserSessionSchema.index({ 'sessionData.lastActivity': -1 });
UserSessionSchema.index({ 'sessionData.ipAddress': 1 });
UserSessionSchema.index({ 'security.blocked': 1 });
UserSessionSchema.index({ 'security.riskScore': -1 });

// Compound indexes
UserSessionSchema.index({ userId: 1, 'sessionData.isActive': 1 });
UserSessionSchema.index({ 'sessionData.ipAddress': 1, 'sessionData.lastActivity': -1 });
UserSessionSchema.index({ 'authentication.method': 1, 'sessionData.isActive': 1 });

// Instance methods
UserSessionSchema.methods.updateActivity = function(action?: string, details?: any) {
  this.sessionData.lastActivity = new Date();
  this.activity.pageViews += 1;
  
  if (action) {
    this.activity.actions.push({
      action,
      timestamp: new Date(),
      details
    });
  }
  
  return this.save();
};

UserSessionSchema.methods.logout = function(reason: string = 'user') {
  this.sessionData.isActive = false;
  this.management.logoutTime = new Date();
  this.management.logoutReason = reason;
  return this.save();
};

UserSessionSchema.methods.extendSession = function(additionalTime: number = 24 * 60 * 60 * 1000) {
  this.sessionData.expiresAt = new Date(Date.now() + additionalTime);
  return this.save();
};

UserSessionSchema.methods.blockSession = function(reason: string) {
  this.security.blocked = true;
  this.security.blockReason = reason;
  this.sessionData.isActive = false;
  this.management.logoutTime = new Date();
  this.management.logoutReason = 'security';
  return this.save();
};

// Static methods
UserSessionSchema.statics.createSession = async function(userId: string, sessionData: any) {
  const sessionId = require('crypto').randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  const session = new this({
    sessionId,
    userId,
    sessionData: {
      ...sessionData,
      expiresAt
    }
  });
  
  return await session.save();
};

UserSessionSchema.statics.getActiveSessions = function(userId: string) {
  return this.find({
    userId,
    'sessionData.isActive': true,
    'sessionData.expiresAt': { $gt: new Date() }
  }).sort({ 'sessionData.lastActivity': -1 });
};

UserSessionSchema.statics.cleanupExpiredSessions = function() {
  return this.updateMany(
    {
      'sessionData.expiresAt': { $lt: new Date() },
      'sessionData.isActive': true
    },
    {
      $set: {
        'sessionData.isActive': false,
        'management.logoutTime': new Date(),
        'management.logoutReason': 'timeout'
      }
    }
  );
};

export const UserSession = mongoose.models.UserSession || mongoose.model('UserSession', UserSessionSchema);
