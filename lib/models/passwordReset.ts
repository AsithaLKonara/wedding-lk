import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface IPasswordReset extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  usedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  attempts: number;
  lastAttempt?: Date;
  createdAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  },
  used: {
    type: Boolean,
    default: false
  },
  usedAt: Date,
  ipAddress: String,
  userAgent: String,
  attempts: {
    type: Number,
    default: 0
  },
  lastAttempt: Date
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
PasswordResetSchema.index({ token: 1 });
PasswordResetSchema.index({ userId: 1 });
PasswordResetSchema.index({ email: 1 });
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
PasswordResetSchema.index({ used: 1 });

// Static method to generate reset token
PasswordResetSchema.statics.generateResetToken = function() {
  return crypto.randomBytes(32).toString('hex');
};

// Static method to create reset request
PasswordResetSchema.statics.createResetRequest = async function(userId: string, email: string, ipAddress?: string, userAgent?: string) {
  // Invalidate any existing reset tokens for this user
  await this.updateMany(
    { userId, used: false },
    { used: true, usedAt: new Date() }
  );
  
  // Create new reset request
  const token = this.generateResetToken();
  const resetRequest = new this({
    userId,
    email,
    token,
    ipAddress,
    userAgent
  });
  
  return await resetRequest.save();
};

// Instance method to mark as used
PasswordResetSchema.methods.markAsUsed = function(ipAddress?: string, userAgent?: string) {
  this.used = true;
  this.usedAt = new Date();
  if (ipAddress) this.ipAddress = ipAddress;
  if (userAgent) this.userAgent = userAgent;
  return this.save();
};

// Instance method to increment attempts
PasswordResetSchema.methods.incrementAttempts = function() {
  this.attempts += 1;
  this.lastAttempt = new Date();
  return this.save();
};

// Instance method to check if token is valid
PasswordResetSchema.methods.isValid = function() {
  return !this.used && this.expiresAt > new Date() && this.attempts < 5;
};

export const PasswordReset = mongoose.models.PasswordReset || mongoose.model('PasswordReset', PasswordResetSchema);
