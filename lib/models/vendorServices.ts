import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorService extends Document {
  vendorId: mongoose.Types.ObjectId;
  
  // Service Basic Information
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  
  // Service Details
  serviceType: 'individual' | 'package' | 'addon';
  duration: {
    value: number;
    unit: 'minutes' | 'hours' | 'days' | 'weeks';
  };
  
  // Pricing
  pricing: {
    type: 'fixed' | 'hourly' | 'per_person' | 'custom';
    basePrice: number;
    currency: string;
    pricePerPerson?: number;
    minimumPrice?: number;
    maximumPrice?: number;
    customPricing?: Array<{
      condition: string;
      price: number;
      description: string;
    }>;
  };
  
  // Availability
  availability: {
    isAvailable: boolean;
    advanceBookingDays: number;
    workingHours: Array<{
      day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
      startTime: string; // HH:MM format
      endTime: string; // HH:MM format
      isAvailable: boolean;
    }>;
    blackoutDates: Array<{
      startDate: Date;
      endDate: Date;
      reason: string;
    }>;
    seasonalAvailability?: Array<{
      season: 'spring' | 'summer' | 'autumn' | 'winter';
      isAvailable: boolean;
      priceMultiplier?: number;
    }>;
  };
  
  // Service Requirements
  requirements: {
    minimumGuests?: number;
    maximumGuests?: number;
    setupTime: number; // in minutes
    breakdownTime: number; // in minutes
    equipmentProvided: string[];
    clientRequirements: string[];
    specialRequirements: string[];
    permitsRequired: string[];
  };
  
  // Service Features
  features: {
    includes: string[];
    excludes: string[];
    addons: Array<{
      name: string;
      description: string;
      price: number;
      isRequired: boolean;
    }>;
    customizationOptions: Array<{
      name: string;
      description: string;
      priceImpact: number;
      isAvailable: boolean;
    }>;
  };
  
  // Media & Portfolio
  media: {
    images: Array<{
      url: string;
      caption?: string;
      isPrimary: boolean;
      order: number;
    }>;
    videos: Array<{
      url: string;
      thumbnail: string;
      caption?: string;
      duration: number;
    }>;
    portfolio: Array<{
      projectName: string;
      description: string;
      images: string[];
      date: Date;
      clientFeedback?: string;
    }>;
  };
  
  // Service Location
  location: {
    type: 'vendor_location' | 'client_location' | 'both';
    serviceAreas: Array<{
      city: string;
      state: string;
      radius: number; // in kilometers
      additionalCharges?: number;
    }>;
    travelCharges: {
      withinCity: number;
      outsideCity: number;
      perKilometer: number;
    };
  };
  
  // Booking & Cancellation
  booking: {
    advanceBookingRequired: boolean;
    minimumAdvanceBookingDays: number;
    maximumAdvanceBookingDays: number;
    cancellationPolicy: {
      freeCancellationDays: number;
      cancellationCharges: Array<{
        daysBeforeEvent: number;
        chargePercentage: number;
      }>;
    };
    reschedulingPolicy: {
      allowed: boolean;
      freeReschedulingDays: number;
      reschedulingCharges: number;
    };
  };
  
  // Reviews & Ratings
  reviews: {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: {
      '5': number;
      '4': number;
      '3': number;
      '2': number;
      '1': number;
    };
    recentReviews: Array<{
      userId: mongoose.Types.ObjectId;
      rating: number;
      comment: string;
      date: Date;
      images?: string[];
    }>;
  };
  
  // Service Status
  status: 'active' | 'inactive' | 'suspended' | 'pending_approval';
  isFeatured: boolean;
  isPopular: boolean;
  viewCount: number;
  bookingCount: number;
  
  // SEO & Discovery
  seo: {
    keywords: string[];
    metaDescription: string;
    slug: string;
  };
  
  // Analytics
  analytics: {
    views: number;
    inquiries: number;
    bookings: number;
    conversionRate: number;
    lastViewed?: Date;
    lastInquired?: Date;
    lastBooked?: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const VendorServiceSchema = new Schema<IVendorService>({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true
  },
  subcategory: String,
  
  serviceType: {
    type: String,
    enum: ['individual', 'package', 'addon'],
    default: 'individual'
  },
  duration: {
    value: { type: Number, required: true },
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days', 'weeks'],
      default: 'hours'
    }
  },
  
  pricing: {
    type: {
      type: String,
      enum: ['fixed', 'hourly', 'per_person', 'custom'],
      default: 'fixed'
    },
    basePrice: { type: Number, required: true },
    currency: { type: String, default: 'LKR' },
    pricePerPerson: Number,
    minimumPrice: Number,
    maximumPrice: Number,
    customPricing: [{
      condition: String,
      price: Number,
      description: String
    }]
  },
  
  availability: {
    isAvailable: { type: Boolean, default: true },
    advanceBookingDays: { type: Number, default: 7 },
    workingHours: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        required: true
      },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      isAvailable: { type: Boolean, default: true }
    }],
    blackoutDates: [{
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      reason: String
    }],
    seasonalAvailability: [{
      season: {
        type: String,
        enum: ['spring', 'summer', 'autumn', 'winter']
      },
      isAvailable: { type: Boolean, default: true },
      priceMultiplier: Number
    }]
  },
  
  requirements: {
    minimumGuests: Number,
    maximumGuests: Number,
    setupTime: { type: Number, default: 0 },
    breakdownTime: { type: Number, default: 0 },
    equipmentProvided: [String],
    clientRequirements: [String],
    specialRequirements: [String],
    permitsRequired: [String]
  },
  
  features: {
    includes: [String],
    excludes: [String],
    addons: [{
      name: { type: String, required: true },
      description: String,
      price: { type: Number, required: true },
      isRequired: { type: Boolean, default: false }
    }],
    customizationOptions: [{
      name: { type: String, required: true },
      description: String,
      priceImpact: { type: Number, default: 0 },
      isAvailable: { type: Boolean, default: true }
    }]
  },
  
  media: {
    images: [{
      url: { type: String, required: true },
      caption: String,
      isPrimary: { type: Boolean, default: false },
      order: { type: Number, default: 0 }
    }],
    videos: [{
      url: { type: String, required: true },
      thumbnail: { type: String, required: true },
      caption: String,
      duration: Number
    }],
    portfolio: [{
      projectName: { type: String, required: true },
      description: String,
      images: [String],
      date: { type: Date, required: true },
      clientFeedback: String
    }]
  },
  
  location: {
    type: {
      type: String,
      enum: ['vendor_location', 'client_location', 'both'],
      default: 'client_location'
    },
    serviceAreas: [{
      city: { type: String, required: true },
      state: { type: String, required: true },
      radius: { type: Number, default: 50 },
      additionalCharges: Number
    }],
    travelCharges: {
      withinCity: { type: Number, default: 0 },
      outsideCity: { type: Number, default: 0 },
      perKilometer: { type: Number, default: 0 }
    }
  },
  
  booking: {
    advanceBookingRequired: { type: Boolean, default: true },
    minimumAdvanceBookingDays: { type: Number, default: 7 },
    maximumAdvanceBookingDays: { type: Number, default: 365 },
    cancellationPolicy: {
      freeCancellationDays: { type: Number, default: 7 },
      cancellationCharges: [{
        daysBeforeEvent: { type: Number, required: true },
        chargePercentage: { type: Number, required: true }
      }]
    },
    reschedulingPolicy: {
      allowed: { type: Boolean, default: true },
      freeReschedulingDays: { type: Number, default: 7 },
      reschedulingCharges: { type: Number, default: 0 }
    }
  },
  
  reviews: {
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    ratingBreakdown: {
      '5': { type: Number, default: 0 },
      '4': { type: Number, default: 0 },
      '3': { type: Number, default: 0 },
      '2': { type: Number, default: 0 },
      '1': { type: Number, default: 0 }
    },
    recentReviews: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: String,
      date: { type: Date, default: Date.now },
      images: [String]
    }]
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending_approval'],
    default: 'pending_approval'
  },
  isFeatured: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  bookingCount: { type: Number, default: 0 },
  
  seo: {
    keywords: [String],
    metaDescription: String,
    slug: { type: String, unique: true, sparse: true }
  },
  
  analytics: {
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    lastViewed: Date,
    lastInquired: Date,
    lastBooked: Date
  }
}, {
  timestamps: true
});

// Indexes
VendorServiceSchema.index({ vendorId: 1 });
VendorServiceSchema.index({ category: 1 });
VendorServiceSchema.index({ subcategory: 1 });
VendorServiceSchema.index({ status: 1 });
VendorServiceSchema.index({ isFeatured: 1 });
VendorServiceSchema.index({ 'pricing.basePrice': 1 });
VendorServiceSchema.index({ 'location.serviceAreas.city': 1 });
VendorServiceSchema.index({ 'location.serviceAreas.state': 1 });
VendorServiceSchema.index({ 'reviews.averageRating': -1 });
VendorServiceSchema.index({ 'analytics.views': -1 });
VendorServiceSchema.index({ 'seo.slug': 1 });
VendorServiceSchema.index({ createdAt: -1 });

// Text search index
VendorServiceSchema.index({
  name: 'text',
  description: 'text',
  category: 'text',
  subcategory: 'text',
  'features.includes': 'text',
  'seo.keywords': 'text'
});

export const VendorService = mongoose.models.VendorService || mongoose.model('VendorService', VendorServiceSchema);
