import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentMethod extends Document {
  // User Information
  userId: mongoose.Types.ObjectId;
  
  // Payment Method Details
  methodType: 'credit_card' | 'debit_card' | 'bank_account' | 'digital_wallet' | 'mobile_payment';
  
  // Card Information (for credit/debit cards)
  cardDetails?: {
    last4: string; // Last 4 digits
    brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'jcb' | 'diners' | 'unionpay';
    expiryMonth: number;
    expiryYear: number;
    cardholderName: string;
    fingerprint: string; // Unique card fingerprint
  };
  
  // Bank Account Information
  bankAccount?: {
    bankName: string;
    accountType: 'checking' | 'savings' | 'business';
    last4: string; // Last 4 digits
    routingNumber?: string; // Encrypted
    accountNumber?: string; // Encrypted
    accountHolderName: string;
  };
  
  // Digital Wallet Information
  digitalWallet?: {
    provider: 'paypal' | 'apple_pay' | 'google_pay' | 'samsung_pay' | 'stripe_wallet';
    walletId: string; // Encrypted
    email?: string;
    phone?: string;
  };
  
  // Mobile Payment Information
  mobilePayment?: {
    provider: 'dialog' | 'mobitel' | 'hutch' | 'airtel';
    phoneNumber: string; // Encrypted
    accountName: string;
  };
  
  // Payment Provider Information
  provider: {
    name: 'stripe' | 'paypal' | 'razorpay' | 'square' | 'local_bank';
    paymentMethodId: string; // Provider's payment method ID
    customerId: string; // Provider's customer ID
  };
  
  // Security Information
  security: {
    isVerified: boolean;
    verificationMethod?: 'micro_deposit' | 'instant_verification' | 'manual_review';
    verifiedAt?: Date;
    verificationAttempts: number;
    maxVerificationAttempts: number;
    isDefault: boolean;
    isActive: boolean;
  };
  
  // Usage Information
  usage: {
    totalTransactions: number;
    totalAmount: number;
    lastUsed?: Date;
    firstUsed?: Date;
    currency: string;
    successRate: number; // Percentage of successful transactions
  };
  
  // Billing Information
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  
  // Metadata
  metadata: {
    deviceType?: 'mobile' | 'desktop' | 'tablet';
    userAgent?: string;
    ipAddress?: string;
    location?: {
      city: string;
      state: string;
      country: string;
    };
  };
  
  // Status
  status: 'active' | 'inactive' | 'suspended' | 'expired' | 'failed_verification';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  methodType: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_account', 'digital_wallet', 'mobile_payment'],
    required: true
  },
  
  cardDetails: {
    last4: { type: String, required: true },
    brand: {
      type: String,
      enum: ['visa', 'mastercard', 'amex', 'discover', 'jcb', 'diners', 'unionpay']
    },
    expiryMonth: { type: Number, min: 1, max: 12 },
    expiryYear: { type: Number },
    cardholderName: { type: String, required: true },
    fingerprint: { type: String, required: true }
  },
  
  bankAccount: {
    bankName: String,
    accountType: {
      type: String,
      enum: ['checking', 'savings', 'business']
    },
    last4: String,
    routingNumber: String, // Should be encrypted in production
    accountNumber: String, // Should be encrypted in production
    accountHolderName: { type: String, required: true }
  },
  
  digitalWallet: {
    provider: {
      type: String,
      enum: ['paypal', 'apple_pay', 'google_pay', 'samsung_pay', 'stripe_wallet']
    },
    walletId: String, // Should be encrypted in production
    email: String,
    phone: String
  },
  
  mobilePayment: {
    provider: {
      type: String,
      enum: ['dialog', 'mobitel', 'hutch', 'airtel']
    },
    phoneNumber: String, // Should be encrypted in production
    accountName: { type: String, required: true }
  },
  
  provider: {
    name: {
      type: String,
      enum: ['stripe', 'paypal', 'razorpay', 'square', 'local_bank'],
      required: true
    },
    paymentMethodId: { type: String, required: true },
    customerId: { type: String, required: true }
  },
  
  security: {
    isVerified: { type: Boolean, default: false },
    verificationMethod: {
      type: String,
      enum: ['micro_deposit', 'instant_verification', 'manual_review']
    },
    verifiedAt: Date,
    verificationAttempts: { type: Number, default: 0 },
    maxVerificationAttempts: { type: Number, default: 3 },
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  
  usage: {
    totalTransactions: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    lastUsed: Date,
    firstUsed: Date,
    currency: { type: String, default: 'LKR' },
    successRate: { type: Number, default: 100, min: 0, max: 100 }
  },
  
  billingAddress: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'Sri Lanka' }
  },
  
  metadata: {
    deviceType: {
      type: String,
      enum: ['mobile', 'desktop', 'tablet']
    },
    userAgent: String,
    ipAddress: String,
    location: {
      city: String,
      state: String,
      country: String
    }
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'expired', 'failed_verification'],
    default: 'active'
  },
  
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
PaymentMethodSchema.index({ userId: 1 });
PaymentMethodSchema.index({ methodType: 1 });
PaymentMethodSchema.index({ 'security.isDefault': 1 });
PaymentMethodSchema.index({ 'security.isActive': 1 });
PaymentMethodSchema.index({ 'security.isVerified': 1 });
PaymentMethodSchema.index({ status: 1 });
PaymentMethodSchema.index({ 'provider.paymentMethodId': 1 });
PaymentMethodSchema.index({ 'provider.customerId': 1 });
PaymentMethodSchema.index({ 'usage.lastUsed': -1 });
PaymentMethodSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Compound indexes
PaymentMethodSchema.index({ userId: 1, 'security.isDefault': 1 });
PaymentMethodSchema.index({ userId: 1, methodType: 1 });
PaymentMethodSchema.index({ userId: 1, status: 1 });
PaymentMethodSchema.index({ methodType: 1, status: 1 });

// Unique constraint for default payment method per user
PaymentMethodSchema.index({ userId: 1, 'security.isDefault': 1 }, { 
  unique: true, 
  partialFilterExpression: { 'security.isDefault': true, status: 'active' }
});

// Instance methods
PaymentMethodSchema.methods.setAsDefault = async function() {
  // Remove default status from other payment methods
  await this.constructor.updateMany(
    { userId: this.userId, 'security.isDefault': true },
    { $set: { 'security.isDefault': false } }
  );
  
  // Set this as default
  this.security.isDefault = true;
  return this.save();
};

PaymentMethodSchema.methods.verify = function(verificationMethod: string) {
  this.security.isVerified = true;
  this.security.verificationMethod = verificationMethod;
  this.security.verifiedAt = new Date();
  this.security.verificationAttempts = 0;
  return this.save();
};

PaymentMethodSchema.methods.failVerification = function() {
  this.security.verificationAttempts += 1;
  
  if (this.security.verificationAttempts >= this.security.maxVerificationAttempts) {
    this.status = 'failed_verification';
  }
  
  return this.save();
};

PaymentMethodSchema.methods.updateUsage = function(amount: number, success: boolean = true) {
  this.usage.totalTransactions += 1;
  this.usage.totalAmount += amount;
  this.usage.lastUsed = new Date();
  
  if (!this.usage.firstUsed) {
    this.usage.firstUsed = new Date();
  }
  
  // Update success rate
  const totalAttempts = this.usage.totalTransactions;
  const successfulTransactions = Math.round((this.usage.successRate / 100) * (totalAttempts - 1));
  const newSuccessfulTransactions = success ? successfulTransactions + 1 : successfulTransactions;
  this.usage.successRate = (newSuccessfulTransactions / totalAttempts) * 100;
  
  return this.save();
};

PaymentMethodSchema.methods.suspend = function() {
  this.status = 'suspended';
  this.security.isActive = false;
  return this.save();
};

PaymentMethodSchema.methods.activate = function() {
  this.status = 'active';
  this.security.isActive = true;
  return this.save();
};

PaymentMethodSchema.methods.expire = function() {
  this.status = 'expired';
  this.security.isActive = false;
  this.expiresAt = new Date();
  return this.save();
};

// Static methods
PaymentMethodSchema.statics.getDefaultPaymentMethod = function(userId: string) {
  return this.findOne({
    userId,
    'security.isDefault': true,
    status: 'active',
    'security.isActive': true
  });
};

PaymentMethodSchema.statics.getActivePaymentMethods = function(userId: string) {
  return this.find({
    userId,
    status: 'active',
    'security.isActive': true,
    'security.isVerified': true
  }).sort({ 'security.isDefault': -1, 'usage.lastUsed': -1 });
};

PaymentMethodSchema.statics.getPaymentMethodsByType = function(userId: string, methodType: string) {
  return this.find({
    userId,
    methodType,
    status: 'active',
    'security.isActive': true
  });
};

export const PaymentMethod = mongoose.models.PaymentMethod || mongoose.model('PaymentMethod', PaymentMethodSchema);
