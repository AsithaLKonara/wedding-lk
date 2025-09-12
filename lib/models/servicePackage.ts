// Service Package Model
import mongoose, { Schema, Document } from 'mongoose';

export interface IServicePackage extends Document {
  vendorId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  
  // Package details
  type: 'basic' | 'premium' | 'custom' | 'addon';
  basePrice: number;
  currency: string;
  
  // Service components
  services: {
    name: string;
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    isIncluded: boolean;
    isRequired: boolean;
    category: string;
  }[];
  
  // Add-ons
  addons: {
    name: string;
    description: string;
    price: number;
    isPopular: boolean;
    category: string;
  }[];
  
  // Pricing tiers
  pricingTiers: {
    name: string;
    description: string;
    price: number;
    features: string[];
    isPopular: boolean;
    maxBookings?: number;
    validityDays?: number;
  }[];
  
  // Package settings
  settings: {
    isActive: boolean;
    isPublic: boolean;
    allowCustomization: boolean;
    requiresApproval: boolean;
    maxAdvanceBooking: number; // days
    minAdvanceBooking: number; // days
    cancellationPolicy: {
      freeCancellationHours: number;
      partialRefundHours: number;
      noRefundHours: number;
    };
  };
  
  // Availability
  availability: {
    daysOfWeek: number[]; // [0,1,2,3,4,5,6] for Sunday to Saturday
    timeSlots: {
      start: string;
      end: string;
      isAvailable: boolean;
    }[];
    blackoutDates: Date[];
    seasonalPricing?: {
      startDate: Date;
      endDate: Date;
      multiplier: number; // 1.5 for 50% increase
      reason: string;
    }[];
  };
  
  // Requirements
  requirements: {
    guestCount: {
      min: number;
      max: number;
    };
    venueRequirements: string[];
    equipmentProvided: string[];
    equipmentRequired: string[];
    setupTime: number; // minutes
    breakdownTime: number; // minutes
  };
  
  // Media
  images: {
    url: string;
    caption?: string;
    isPrimary: boolean;
    order: number;
  }[];
  
  videos: {
    url: string;
    thumbnail: string;
    duration: number;
    caption?: string;
  }[];
  
  // SEO and discovery
  tags: string[];
  keywords: string[];
  location: {
    name: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    radius: number; // km
  };
  
  // Performance metrics
  metrics: {
    viewCount: number;
    inquiryCount: number;
    bookingCount: number;
    conversionRate: number;
    averageRating: number;
    totalReviews: number;
    lastBookedAt?: Date;
  };
  
  // Status and moderation
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';
  moderationNotes?: string;
  approvedAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

const ServicePackageSchema = new Schema<IServicePackage>({
  vendorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: true,
    index: true 
  },
  name: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 2000 },
  category: { type: String, required: true, maxlength: 100 },
  
  type: { 
    type: String, 
    required: true, 
    enum: ['basic', 'premium', 'custom', 'addon'],
    index: true
  },
  basePrice: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'LKR', maxlength: 3 },
  
  services: [{
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    isIncluded: { type: Boolean, default: true },
    isRequired: { type: Boolean, default: true },
    category: { type: String, maxlength: 50 }
  }],
  
  addons: [{
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    isPopular: { type: Boolean, default: false },
    category: { type: String, maxlength: 50 }
  }],
  
  pricingTiers: [{
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    features: [{ type: String, maxlength: 200 }],
    isPopular: { type: Boolean, default: false },
    maxBookings: { type: Number, min: 1 },
    validityDays: { type: Number, min: 1 }
  }],
  
  settings: {
    isActive: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: true },
    allowCustomization: { type: Boolean, default: true },
    requiresApproval: { type: Boolean, default: false },
    maxAdvanceBooking: { type: Number, default: 365, min: 1 },
    minAdvanceBooking: { type: Number, default: 1, min: 0 },
    cancellationPolicy: {
      freeCancellationHours: { type: Number, default: 48, min: 0 },
      partialRefundHours: { type: Number, default: 24, min: 0 },
      noRefundHours: { type: Number, default: 12, min: 0 }
    }
  },
  
  availability: {
    daysOfWeek: [{ type: Number, min: 0, max: 6 }],
    timeSlots: [{
      start: { type: String, required: true },
      end: { type: String, required: true },
      isAvailable: { type: Boolean, default: true }
    }],
    blackoutDates: [{ type: Date }],
    seasonalPricing: [{
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      multiplier: { type: Number, required: true, min: 0.1 },
      reason: { type: String, maxlength: 200 }
    }]
  },
  
  requirements: {
    guestCount: {
      min: { type: Number, default: 1, min: 1 },
      max: { type: Number, default: 1000, min: 1 }
    },
    venueRequirements: [{ type: String, maxlength: 200 }],
    equipmentProvided: [{ type: String, maxlength: 200 }],
    equipmentRequired: [{ type: String, maxlength: 200 }],
    setupTime: { type: Number, default: 60, min: 0 },
    breakdownTime: { type: Number, default: 30, min: 0 }
  },
  
  images: [{
    url: { type: String, required: true },
    caption: { type: String, maxlength: 200 },
    isPrimary: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  }],
  
  videos: [{
    url: { type: String, required: true },
    thumbnail: { type: String, required: true },
    duration: { type: Number, required: true, min: 0 },
    caption: { type: String, maxlength: 200 }
  }],
  
  tags: [{ type: String, maxlength: 50 }],
  keywords: [{ type: String, maxlength: 50 }],
  location: {
    name: { type: String, maxlength: 200 },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    },
    radius: { type: Number, default: 50, min: 1 }
  },
  
  metrics: {
    viewCount: { type: Number, default: 0, min: 0 },
    inquiryCount: { type: Number, default: 0, min: 0 },
    bookingCount: { type: Number, default: 0, min: 0 },
    conversionRate: { type: Number, default: 0, min: 0, max: 100 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0, min: 0 },
    lastBookedAt: { type: Date }
  },
  
  status: { 
    type: String, 
    enum: ['draft', 'pending', 'approved', 'rejected', 'suspended'],
    default: 'draft',
    index: true
  },
  moderationNotes: { type: String, maxlength: 1000 },
  approvedAt: { type: Date },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
ServicePackageSchema.index({ vendorId: 1, status: 1 });
ServicePackageSchema.index({ category: 1, status: 1 });
ServicePackageSchema.index({ 'location.name': 1 });
ServicePackageSchema.index({ tags: 1 });
ServicePackageSchema.index({ 'metrics.bookingCount': -1 });
ServicePackageSchema.index({ createdAt: -1 });

// Pre-save middleware
ServicePackageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate conversion rate
  if (this.metrics.viewCount > 0) {
    this.metrics.conversionRate = (this.metrics.bookingCount / this.metrics.viewCount) * 100;
  }
  
  next();
});

export default mongoose.models.ServicePackage || mongoose.model<IServicePackage>('ServicePackage', ServicePackageSchema);


