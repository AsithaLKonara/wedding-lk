// Vendor Subscription Model
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  vendorId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  
  // Subscription details
  planName: string;
  planType: 'free' | 'premium' | 'featured' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'expired' | 'suspended';
  
  // Pricing
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  
  // Dates
  startDate: Date;
  endDate?: Date;
  nextBillingDate?: Date;
  cancelledAt?: Date;
  trialEndsAt?: Date;
  
  // Features and limits
  features: {
    maxListings: number;
    maxImagesPerListing: number;
    maxVideosPerListing: number;
    analyticsAccess: boolean;
    boostCampaigns: boolean;
    prioritySupport: boolean;
    customDomain: boolean;
    apiAccess: boolean;
    whiteLabel: boolean;
    commissionRate: number; // Platform commission rate
  };
  
  // Usage tracking
  usage: {
    currentListings: number;
    currentImages: number;
    currentVideos: number;
    boostCampaignsUsed: number;
    apiCallsUsed: number;
    lastResetDate: Date;
  };
  
  // Payment information
  payment: {
    method: 'stripe' | 'paypal' | 'bank_transfer' | 'manual';
    subscriptionId?: string; // Stripe subscription ID
    customerId?: string; // Stripe customer ID
    lastPaymentDate?: Date;
    nextPaymentDate?: Date;
    paymentHistory: {
      amount: number;
      currency: string;
      status: 'success' | 'failed' | 'pending' | 'refunded';
      transactionId?: string;
      paidAt: Date;
    }[];
  };
  
  // Promotional offers
  promotion?: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    validUntil: Date;
    appliedAt: Date;
  };
  
  // Auto-renewal settings
  autoRenew: boolean;
  renewalReminders: {
    sent: boolean;
    sentAt?: Date;
    reminderType: '7_days' | '3_days' | '1_day' | 'expired';
  }[];
  
  // Cancellation
  cancellation?: {
    reason: string;
    feedback?: string;
    requestedAt: Date;
    processedAt?: Date;
    refundAmount?: number;
    refundStatus?: 'pending' | 'processed' | 'denied';
  };
  
  // Upgrade/Downgrade history
  planHistory: {
    fromPlan: string;
    toPlan: string;
    changedAt: Date;
    reason?: string;
    proratedAmount?: number;
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>({
  vendorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: true,
    index: true 
  },
  planId: { 
    type: Schema.Types.ObjectId, 
    ref: 'SubscriptionPlan', 
    required: true,
    index: true 
  },
  
  planName: { type: String, required: true, maxlength: 100 },
  planType: { 
    type: String, 
    required: true, 
    enum: ['free', 'premium', 'featured', 'enterprise'],
    index: true
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'cancelled', 'expired', 'suspended'],
    default: 'active',
    index: true
  },
  
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'LKR', maxlength: 3 },
  billingCycle: { 
    type: String, 
    enum: ['monthly', 'yearly', 'lifetime'],
    required: true
  },
  
  startDate: { type: Date, required: true, default: Date.now },
  endDate: { type: Date },
  nextBillingDate: { type: Date },
  cancelledAt: { type: Date },
  trialEndsAt: { type: Date },
  
  features: {
    maxListings: { type: Number, required: true, min: 0 },
    maxImagesPerListing: { type: Number, required: true, min: 0 },
    maxVideosPerListing: { type: Number, required: true, min: 0 },
    analyticsAccess: { type: Boolean, default: false },
    boostCampaigns: { type: Boolean, default: false },
    prioritySupport: { type: Boolean, default: false },
    customDomain: { type: Boolean, default: false },
    apiAccess: { type: Boolean, default: false },
    whiteLabel: { type: Boolean, default: false },
    commissionRate: { type: Number, required: true, min: 0, max: 100 }
  },
  
  usage: {
    currentListings: { type: Number, default: 0, min: 0 },
    currentImages: { type: Number, default: 0, min: 0 },
    currentVideos: { type: Number, default: 0, min: 0 },
    boostCampaignsUsed: { type: Number, default: 0, min: 0 },
    apiCallsUsed: { type: Number, default: 0, min: 0 },
    lastResetDate: { type: Date, default: Date.now }
  },
  
  payment: {
    method: { 
      type: String, 
      enum: ['stripe', 'paypal', 'bank_transfer', 'manual'],
      required: true
    },
    subscriptionId: { type: String },
    customerId: { type: String },
    lastPaymentDate: { type: Date },
    nextPaymentDate: { type: Date },
    paymentHistory: [{
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, required: true, maxlength: 3 },
      status: { 
        type: String, 
        enum: ['success', 'failed', 'pending', 'refunded'],
        required: true
      },
      transactionId: { type: String },
      paidAt: { type: Date, required: true }
    }]
  },
  
  promotion: {
    code: { type: String, maxlength: 50 },
    discountType: { type: String, enum: ['percentage', 'fixed'] },
    discountValue: { type: Number, min: 0 },
    validUntil: { type: Date },
    appliedAt: { type: Date }
  },
  
  autoRenew: { type: Boolean, default: true },
  renewalReminders: [{
    sent: { type: Boolean, required: true },
    sentAt: { type: Date },
    reminderType: { 
      type: String, 
      enum: ['7_days', '3_days', '1_day', 'expired'],
      required: true
    }
  }],
  
  cancellation: {
    reason: { type: String, maxlength: 500 },
    feedback: { type: String, maxlength: 1000 },
    requestedAt: { type: Date },
    processedAt: { type: Date },
    refundAmount: { type: Number, min: 0 },
    refundStatus: { 
      type: String, 
      enum: ['pending', 'processed', 'denied'] 
    }
  },
  
  planHistory: [{
    fromPlan: { type: String, required: true },
    toPlan: { type: String, required: true },
    changedAt: { type: Date, required: true },
    reason: { type: String, maxlength: 200 },
    proratedAmount: { type: Number, min: 0 }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
SubscriptionSchema.index({ vendorId: 1, status: 1 });
SubscriptionSchema.index({ planType: 1, status: 1 });
SubscriptionSchema.index({ nextBillingDate: 1, status: 1 });
SubscriptionSchema.index({ 'payment.subscriptionId': 1 });

// Pre-save middleware
SubscriptionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate next billing date
  if (this.billingCycle && this.status === 'active') {
    const now = new Date();
    if (this.billingCycle === 'monthly') {
      this.nextBillingDate = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
    } else if (this.billingCycle === 'yearly') {
      this.nextBillingDate = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
    }
  }
  
  // Check if subscription is expired
  if (this.endDate && this.endDate < new Date() && this.status === 'active') {
    this.status = 'expired';
  }
  
  next();
});

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);


