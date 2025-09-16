import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';
import speakeasy from 'speakeasy';

export interface ITwoFactorAuth extends Document {
  userId: mongoose.Types.ObjectId;
  
  // 2FA Status
  isEnabled: boolean;
  isVerified: boolean;
  enabledAt?: Date;
  verifiedAt?: Date;
  
  // TOTP (Time-based One-Time Password)
  totp: {
    secret: string; // Encrypted secret key
    qrCode?: string; // QR code data URL
    backupCodes: string[]; // Encrypted backup codes
    usedBackupCodes: string[]; // Track used backup codes
  };
  
  // SMS 2FA
  sms: {
    phoneNumber: string; // Encrypted phone number
    isEnabled: boolean;
    lastCodeSent?: Date;
    codeAttempts: number;
    maxAttempts: number;
  };
  
  // Email 2FA
  email: {
    isEnabled: boolean;
    lastCodeSent?: Date;
    codeAttempts: number;
    maxAttempts: number;
  };
  
  // Recovery Options
  recovery: {
    recoveryCodes: string[]; // Encrypted recovery codes
    usedRecoveryCodes: string[]; // Track used recovery codes
    securityQuestions: Array<{
      question: string;
      answer: string; // Encrypted answer
    }>;
  };
  
  // Security Settings
  security: {
    require2FAForLogin: boolean;
    require2FAForSensitiveActions: boolean;
    trustedDevices: Array<{
      deviceId: string;
      deviceName: string;
      trustedAt: Date;
      lastUsed: Date;
      ipAddress: string;
      userAgent: string;
    }>;
    maxTrustedDevices: number;
  };
  
  // Activity Log
  activity: Array<{
    action: 'enabled' | 'disabled' | 'verified' | 'failed_attempt' | 'backup_code_used' | 'recovery_used';
    timestamp: Date;
    ipAddress: string;
    userAgent: string;
    success: boolean;
    details?: string;
  }>;
  
  // Failed Attempts
  failedAttempts: {
    count: number;
    lastAttempt: Date;
    lockedUntil?: Date;
    maxAttempts: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const TwoFactorAuthSchema = new Schema<ITwoFactorAuth>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  isEnabled: {
    type: Boolean,
    default: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  enabledAt: Date,
  verifiedAt: Date,
  
  totp: {
    secret: { type: String, required: true },
    qrCode: String,
    backupCodes: [String],
    usedBackupCodes: [String]
  },
  
  sms: {
    phoneNumber: String,
    isEnabled: { type: Boolean, default: false },
    lastCodeSent: Date,
    codeAttempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 }
  },
  
  email: {
    isEnabled: { type: Boolean, default: false },
    lastCodeSent: Date,
    codeAttempts: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 }
  },
  
  recovery: {
    recoveryCodes: [String],
    usedRecoveryCodes: [String],
    securityQuestions: [{
      question: { type: String, required: true },
      answer: { type: String, required: true }
    }]
  },
  
  security: {
    require2FAForLogin: { type: Boolean, default: true },
    require2FAForSensitiveActions: { type: Boolean, default: true },
    trustedDevices: [{
      deviceId: { type: String, required: true },
      deviceName: { type: String, required: true },
      trustedAt: { type: Date, default: Date.now },
      lastUsed: { type: Date, default: Date.now },
      ipAddress: { type: String, required: true },
      userAgent: { type: String, required: true }
    }],
    maxTrustedDevices: { type: Number, default: 5 }
  },
  
  activity: [{
    action: {
      type: String,
      enum: ['enabled', 'disabled', 'verified', 'failed_attempt', 'backup_code_used', 'recovery_used'],
      required: true
    },
    timestamp: { type: Date, default: Date.now },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
    success: { type: Boolean, required: true },
    details: String
  }],
  
  failedAttempts: {
    count: { type: Number, default: 0 },
    lastAttempt: Date,
    lockedUntil: Date,
    maxAttempts: { type: Number, default: 5 }
  }
}, {
  timestamps: true
});

// Indexes
TwoFactorAuthSchema.index({ userId: 1 });
TwoFactorAuthSchema.index({ isEnabled: 1 });
TwoFactorAuthSchema.index({ 'failedAttempts.lockedUntil': 1 });
TwoFactorAuthSchema.index({ 'security.trustedDevices.deviceId': 1 });

// Instance methods
TwoFactorAuthSchema.methods.generateSecret = function() {
  const secret = speakeasy.generateSecret({
    name: 'WeddingLK',
    length: 32
  });
  
  this.totp.secret = secret.base32;
  this.totp.qrCode = secret.otpauth_url;
  
  return secret;
};

TwoFactorAuthSchema.methods.generateBackupCodes = function() {
  const codes = [];
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  
  this.totp.backupCodes = codes;
  this.totp.usedBackupCodes = [];
  
  return codes;
};

TwoFactorAuthSchema.methods.generateRecoveryCodes = function() {
  const codes = [];
  for (let i = 0; i < 8; i++) {
    codes.push(crypto.randomBytes(6).toString('hex').toUpperCase());
  }
  
  this.recovery.recoveryCodes = codes;
  this.recovery.usedRecoveryCodes = [];
  
  return codes;
};

TwoFactorAuthSchema.methods.verifyTOTP = function(token: string) {
  const secret = this.totp.secret;
  const verified = speakeasy.totp.verify({
    secret,
    token,
    window: 2 // Allow 2 time steps tolerance
  });
  
  if (verified) {
    this.logActivity('verified', true);
    this.resetFailedAttempts();
  } else {
    this.logActivity('failed_attempt', false);
    this.incrementFailedAttempts();
  }
  
  return verified;
};

TwoFactorAuthSchema.methods.verifyBackupCode = function(code: string) {
  const index = this.totp.backupCodes.indexOf(code);
  
  if (index !== -1 && !this.totp.usedBackupCodes.includes(code)) {
    this.totp.usedBackupCodes.push(code);
    this.totp.backupCodes.splice(index, 1);
    this.logActivity('backup_code_used', true);
    this.resetFailedAttempts();
    return true;
  }
  
  this.logActivity('failed_attempt', false);
  this.incrementFailedAttempts();
  return false;
};

TwoFactorAuthSchema.methods.verifyRecoveryCode = function(code: string) {
  const index = this.recovery.recoveryCodes.indexOf(code);
  
  if (index !== -1 && !this.recovery.usedRecoveryCodes.includes(code)) {
    this.recovery.usedRecoveryCodes.push(code);
    this.recovery.recoveryCodes.splice(index, 1);
    this.logActivity('recovery_used', true);
    this.resetFailedAttempts();
    return true;
  }
  
  this.logActivity('failed_attempt', false);
  this.incrementFailedAttempts();
  return false;
};

TwoFactorAuthSchema.methods.addTrustedDevice = function(deviceInfo: any) {
  if (this.security.trustedDevices.length >= this.security.maxTrustedDevices) {
    // Remove oldest trusted device
    this.security.trustedDevices.sort((a, b) => a.trustedAt.getTime() - b.trustedAt.getTime());
    this.security.trustedDevices.shift();
  }
  
  this.security.trustedDevices.push({
    deviceId: deviceInfo.deviceId,
    deviceName: deviceInfo.deviceName,
    trustedAt: new Date(),
    lastUsed: new Date(),
    ipAddress: deviceInfo.ipAddress,
    userAgent: deviceInfo.userAgent
  });
  
  return this.save();
};

TwoFactorAuthSchema.methods.isDeviceTrusted = function(deviceId: string) {
  return this.security.trustedDevices.some(device => device.deviceId === deviceId);
};

TwoFactorAuthSchema.methods.logActivity = function(action: string, success: boolean, details?: string) {
  this.activity.push({
    action,
    timestamp: new Date(),
    ipAddress: '', // Should be passed from request
    userAgent: '', // Should be passed from request
    success,
    details
  });
  
  // Keep only last 100 activities
  if (this.activity.length > 100) {
    this.activity = this.activity.slice(-100);
  }
  
  return this.save();
};

TwoFactorAuthSchema.methods.incrementFailedAttempts = function() {
  this.failedAttempts.count += 1;
  this.failedAttempts.lastAttempt = new Date();
  
  if (this.failedAttempts.count >= this.failedAttempts.maxAttempts) {
    this.failedAttempts.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  }
  
  return this.save();
};

TwoFactorAuthSchema.methods.resetFailedAttempts = function() {
  this.failedAttempts.count = 0;
  this.failedAttempts.lastAttempt = undefined;
  this.failedAttempts.lockedUntil = undefined;
  return this.save();
};

TwoFactorAuthSchema.methods.isLocked = function() {
  return this.failedAttempts.lockedUntil && this.failedAttempts.lockedUntil > new Date();
};

TwoFactorAuthSchema.methods.enable2FA = function() {
  this.isEnabled = true;
  this.enabledAt = new Date();
  this.logActivity('enabled', true);
  return this.save();
};

TwoFactorAuthSchema.methods.disable2FA = function() {
  this.isEnabled = false;
  this.isVerified = false;
  this.totp.secret = '';
  this.totp.backupCodes = [];
  this.totp.usedBackupCodes = [];
  this.recovery.recoveryCodes = [];
  this.recovery.usedRecoveryCodes = [];
  this.security.trustedDevices = [];
  this.logActivity('disabled', true);
  return this.save();
};

export const TwoFactorAuth = mongoose.models.TwoFactorAuth || mongoose.model('TwoFactorAuth', TwoFactorAuthSchema);
