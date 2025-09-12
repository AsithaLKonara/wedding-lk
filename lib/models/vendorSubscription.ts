import mongoose, { Document, Schema } from 'mongoose';

export interface IVendorSubscription extends Document {
  // Basic Information
  vendorId: mongoose.Types.ObjectId;
  planId: mongoose.Types.ObjectId;
  subscriptionId: string; // Stripe subscription ID
  
  // Subscription Details
  planName: string;
  planType: 'free' | 'standard' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'unpaid' | 'trialing';
  
  // Billing Information
  billingCycle: 'monthly' | 'yearly';
  price: number;
  currency: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    reason: string;
    expiresAt?: Date;
  };
  
  // Stripe Integration
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt?: Date;
  
  // Features and Limits
  features: {
    // Profile Features
    maxImages: number;
    maxVideos: number;
    profileHighlight: boolean;
    verifiedBadge: boolean;
    
    // Listing Features
    maxListings: number;
    featuredListings: number;
    boostCredits: number;
    
    // Analytics Features
    basicAnalytics: boolean;
    advancedAnalytics: boolean;
    customReports: boolean;
    
    // Communication Features
    directMessaging: boolean;
    videoCalls: boolean;
    prioritySupport: boolean;
    
    // Marketing Features
    emailMarketing: boolean;
    socialMediaIntegration: boolean;
    customDomain: boolean;
    
    // Booking Features
    onlineBooking: boolean;
    calendarIntegration: boolean;
    paymentProcessing: boolean;
    invoiceGeneration: boolean;
    
    // Custom Features
    customFeatures: string[];
  };
  
  // Usage Tracking
  usage: {
    imagesUsed: number;
    videosUsed: number;
    listingsCreated: number;
    featuredListingsUsed: number;
    boostCreditsUsed: number;
    lastResetDate: Date;
  };
  
  // Payment History
  payments: {
    paymentId: string;
    amount: number;
    currency: string;
    status: 'paid' | 'pending' | 'failed' | 'refunded';
    paidAt: Date;
    invoiceUrl?: string;
  }[];
  
  // Trial Information
  trial: {
    isTrial: boolean;
    trialStart: Date;
    trialEnd: Date;
    trialDays: number;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  activatedAt: Date;
  expiresAt?: Date;
}

const VendorSubscriptionSchema: Schema = new Schema({
  // Basic Information
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  planId: {
    type: Schema.Types.ObjectId,
    ref: 'SubscriptionPlan',
    required: true,
    index: true
  },
  subscriptionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Subscription Details
  planName: {
    type: String,
    required: true,
    maxlength: 100
  },
  planType: {
    type: String,
    required: true,
    enum: ['free', 'standard', 'premium', 'enterprise'],
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'inactive', 'cancelled', 'past_due', 'unpaid', 'trialing'],
    default: 'active',
    index: true
  },
  
  // Billing Information
  billingCycle: {
    type: String,
    required: true,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'LKR',
    maxlength: 3
  },
  discount: {
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    },
    value: {
      type: Number,
      min: 0
    },
    reason: {
      type: String,
      maxlength: 200
    },
    expiresAt: {
      type: Date
    }
  },
  
  // Stripe Integration
  stripeCustomerId: {
    type: String,
    required: true,
    index: true
  },
  stripeSubscriptionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  stripePriceId: {
    type: String,
    required: true
  },
  currentPeriodStart: {
    type: Date,
    required: true
  },
  currentPeriodEnd: {
    type: Date,
    required: true,
    index: true
  },
  cancelAtPeriodEnd: {
    type: Boolean,
    default: false
  },
  canceledAt: {
    type: Date
  },
  
  // Features and Limits
  features: {
    // Profile Features
    maxImages: {
      type: Number,
      default: 10,
      min: 0
    },
    maxVideos: {
      type: Number,
      default: 3,
      min: 0
    },
    profileHighlight: {
      type: Boolean,
      default: false
    },
    verifiedBadge: {
      type: Boolean,
      default: false
    },
    
    // Listing Features
    maxListings: {
      type: Number,
      default: 5,
      min: 0
    },
    featuredListings: {
      type: Number,
      default: 0,
      min: 0
    },
    boostCredits: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Analytics Features
    basicAnalytics: {
      type: Boolean,
      default: true
    },
    advancedAnalytics: {
      type: Boolean,
      default: false
    },
    customReports: {
      type: Boolean,
      default: false
    },
    
    // Communication Features
    directMessaging: {
      type: Boolean,
      default: true
    },
    videoCalls: {
      type: Boolean,
      default: false
    },
    prioritySupport: {
      type: Boolean,
      default: false
    },
    
    // Marketing Features
    emailMarketing: {
      type: Boolean,
      default: false
    },
    socialMediaIntegration: {
      type: Boolean,
      default: false
    },
    customDomain: {
      type: Boolean,
      default: false
    },
    
    // Booking Features
    onlineBooking: {
      type: Boolean,
      default: true
    },
    calendarIntegration: {
      type: Boolean,
      default: false
    },
    paymentProcessing: {
      type: Boolean,
      default: true
    },
    invoiceGeneration: {
      type: Boolean,
      default: false
    },
    
    // Custom Features
    customFeatures: [{
      type: String,
      maxlength: 100
    }]
  },
  
  // Usage Tracking
  usage: {
    imagesUsed: {
      type: Number,
      default: 0,
      min: 0
    },
    videosUsed: {
      type: Number,
      default: 0,
      min: 0
    },
    listingsCreated: {
      type: Number,
      default: 0,
      min: 0
    },
    featuredListingsUsed: {
      type: Number,
      default: 0,
      min: 0
    },
    boostCreditsUsed: {
      type: Number,
      default: 0,
      min: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    }
  },
  
  // Payment History
  payments: [{
    paymentId: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      maxlength: 3
    },
    status: {
      type: String,
      required: true,
      enum: ['paid', 'pending', 'failed', 'refunded']
    },
    paidAt: {
      type: Date,
      required: true
    },
    invoiceUrl: {
      type: String,
      maxlength: 500
    }
  }],
  
  // Trial Information
  trial: {
    isTrial: {
      type: Boolean,
      default: false
    },
    trialStart: {
      type: Date
    },
    trialEnd: {
      type: Date
    },
    trialDays: {
      type: Number,
      default: 14,
      min: 0,
      max: 30
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
VendorSubscriptionSchema.index({ vendorId: 1, status: 1 });
VendorSubscriptionSchema.index({ planType: 1, status: 1 });
VendorSubscriptionSchema.index({ currentPeriodEnd: 1 });
VendorSubscriptionSchema.index({ stripeSubscriptionId: 1 });

// Virtual for days remaining
VendorSubscriptionSchema.virtual('daysRemaining').get(function() {
  const now = new Date();
  const end = new Date(this.currentPeriodEnd);
  const diffTime = end.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for usage percentage
VendorSubscriptionSchema.virtual('usagePercentage').get(function() {
  const total = this.features.maxImages + this.features.maxVideos + this.features.maxListings;
  const used = this.usage.imagesUsed + this.usage.videosUsed + this.usage.listingsCreated;
  return total > 0 ? Math.round((used / total) * 100) : 0;
});

// Method to check if feature is available
VendorSubscriptionSchema.methods.hasFeature = function(feature: string): boolean {
  return this.features[feature] === true;
};

// Method to check if limit is exceeded
VendorSubscriptionSchema.methods.isLimitExceeded = function(limitType: string): boolean {
  const limit = this.features[`max${limitType.charAt(0).toUpperCase() + limitType.slice(1)}`];
  const used = this.usage[`${limitType}Used`];
  return used >= limit;
};

// Method to increment usage
VendorSubscriptionSchema.methods.incrementUsage = function(usageType: string, amount: number = 1) {
  const usageField = `${usageType}Used`;
  if (this.usage[usageField] !== undefined) {
    this.usage[usageField] += amount;
  }
  return this.save();
};

// Method to reset usage (monthly/yearly)
VendorSubscriptionSchema.methods.resetUsage = function() {
  this.usage = {
    imagesUsed: 0,
    videosUsed: 0,
    listingsCreated: 0,
    featuredListingsUsed: 0,
    boostCreditsUsed: 0,
    lastResetDate: new Date()
  };
  return this.save();
};

// Method to upgrade subscription
VendorSubscriptionSchema.methods.upgrade = async function(newPlanId: mongoose.Types.ObjectId, newPlan: any) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    // Update Stripe subscription
    await stripe.subscriptions.update(this.stripeSubscriptionId, {
      items: [{
        id: this.stripePriceId,
        price: newPlan.stripePriceId
      }],
      proration_behavior: 'create_prorations'
    });
    
    // Update local subscription
    this.planId = newPlanId;
    this.planName = newPlan.name;
    this.planType = newPlan.type;
    this.price = newPlan.price;
    this.features = { ...this.features, ...newPlan.features };
    
    await this.save();
    
    return this;
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    throw error;
  }
};

// Method to cancel subscription
VendorSubscriptionSchema.methods.cancel = async function(cancelAtPeriodEnd: boolean = true) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    if (cancelAtPeriodEnd) {
      // Cancel at period end
      await stripe.subscriptions.update(this.stripeSubscriptionId, {
        cancel_at_period_end: true
      });
      this.cancelAtPeriodEnd = true;
    } else {
      // Cancel immediately
      await stripe.subscriptions.cancel(this.stripeSubscriptionId);
      this.status = 'cancelled';
      this.canceledAt = new Date();
    }
    
    await this.save();
    return this;
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

// Static method to create subscription
VendorSubscriptionSchema.statics.createSubscription = async function(
  vendorId: mongoose.Types.ObjectId,
  planId: mongoose.Types.ObjectId,
  plan: any,
  stripeCustomerId: string,
  isTrial: boolean = false
) {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    // Create Stripe subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: plan.stripePriceId }],
      trial_period_days: isTrial ? plan.trialDays || 14 : undefined,
      expand: ['latest_invoice.payment_intent']
    });
    
    // Create local subscription
    const vendorSubscription = new this({
      vendorId,
      planId,
      subscriptionId: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      planName: plan.name,
      planType: plan.type,
      price: plan.price,
      currency: plan.currency || 'LKR',
      stripeCustomerId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: plan.stripePriceId,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      features: plan.features,
      trial: {
        isTrial,
        trialStart: isTrial ? new Date() : undefined,
        trialEnd: isTrial ? new Date(Date.now() + (plan.trialDays || 14) * 24 * 60 * 60 * 1000) : undefined,
        trialDays: plan.trialDays || 14
      }
    });
    
    await vendorSubscription.save();
    return vendorSubscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const VendorSubscription = mongoose.models.VendorSubscription || mongoose.model<IVendorSubscription>('VendorSubscription', VendorSubscriptionSchema);

