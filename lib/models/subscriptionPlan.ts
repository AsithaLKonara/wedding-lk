// Subscription Plan Model
import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscriptionPlan extends Document {
  name: string;
  type: 'free' | 'premium' | 'featured' | 'enterprise';
  description: string;
  
  // Pricing
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly' | 'lifetime';
  
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
    customFeatures: string[];
  };
  
  // Display settings
  display: {
    isPopular: boolean;
    badge?: string;
    color: string;
    icon: string;
    sortOrder: number;
  };
  
  // Availability
  isActive: boolean;
  isPublic: boolean;
  availableFrom?: Date;
  availableUntil?: Date;
  
  // Trial settings
  trialDays: number;
  trialFeatures: string[]; // Features available during trial
  
  // Upgrade/downgrade rules
  upgradeRules: {
    allowedFrom: string[]; // Plan types that can upgrade to this
    allowedTo: string[]; // Plan types this can upgrade to
    prorationMethod: 'full' | 'prorated' | 'none';
  };
  
  // Restrictions
  restrictions: {
    minContractPeriod?: number; // months
    cancellationPolicy: 'immediate' | 'end_of_period' | 'custom';
    customCancellationDays?: number;
    refundPolicy: 'full' | 'prorated' | 'none';
  };
  
  // Marketing
  marketing: {
    headline: string;
    subheadline: string;
    benefits: string[];
    ctaText: string;
    ctaColor: string;
  };
  
  // Analytics
  metrics: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    churnRate: number;
    averageLifetime: number; // days
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>({
  name: { type: String, required: true, maxlength: 100 },
  type: { 
    type: String, 
    required: true, 
    enum: ['free', 'premium', 'featured', 'enterprise'],
    unique: true},
  description: { type: String, required: true, maxlength: 500 },
  
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'LKR', maxlength: 3 },
  billingCycle: { 
    type: String, 
    enum: ['monthly', 'yearly', 'lifetime'],
    required: true
  },
  
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
    commissionRate: { type: Number, required: true, min: 0, max: 100 },
    customFeatures: [{ type: String, maxlength: 200 }]
  },
  
  display: {
    isPopular: { type: Boolean, default: false },
    badge: { type: String, maxlength: 50 },
    color: { type: String, default: '#3B82F6', maxlength: 7 },
    icon: { type: String, default: 'star', maxlength: 50 },
    sortOrder: { type: Number, default: 0 }
  },
  
  isActive: { type: Boolean, default: true},
  isPublic: { type: Boolean, default: true},
  availableFrom: { type: Date },
  availableUntil: { type: Date },
  
  trialDays: { type: Number, default: 0, min: 0 },
  trialFeatures: [{ type: String, maxlength: 200 }],
  
  upgradeRules: {
    allowedFrom: [{ type: String, enum: ['free', 'premium', 'featured', 'enterprise'] }],
    allowedTo: [{ type: String, enum: ['free', 'premium', 'featured', 'enterprise'] }],
    prorationMethod: { 
      type: String, 
      enum: ['full', 'prorated', 'none'],
      default: 'prorated'
    }
  },
  
  restrictions: {
    minContractPeriod: { type: Number, min: 1 },
    cancellationPolicy: { 
      type: String, 
      enum: ['immediate', 'end_of_period', 'custom'],
      default: 'end_of_period'
    },
    customCancellationDays: { type: Number, min: 0 },
    refundPolicy: { 
      type: String, 
      enum: ['full', 'prorated', 'none'],
      default: 'prorated'
    }
  },
  
  marketing: {
    headline: { type: String, required: true, maxlength: 200 },
    subheadline: { type: String, maxlength: 300 },
    benefits: [{ type: String, maxlength: 200 }],
    ctaText: { type: String, default: 'Get Started', maxlength: 50 },
    ctaColor: { type: String, default: '#10B981', maxlength: 7 }
  },
  
  metrics: {
    totalSubscriptions: { type: Number, default: 0, min: 0 },
    activeSubscriptions: { type: Number, default: 0, min: 0 },
    monthlyRevenue: { type: Number, default: 0, min: 0 },
    churnRate: { type: Number, default: 0, min: 0, max: 100 },
    averageLifetime: { type: Number, default: 0, min: 0 }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
SubscriptionPlanSchema.index({ type: 1, isActive: 1 });
SubscriptionPlanSchema.index({ isPublic: 1, isActive: 1 });
SubscriptionPlanSchema.index({ 'display.sortOrder': 1 });

// Pre-save middleware
SubscriptionPlanSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.SubscriptionPlan || mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);


