import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorPackage extends Document {
  vendor: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  services: {
    service: mongoose.Types.ObjectId;
    name: string;
    description: string;
    quantity: number;
    unit: string;
    price: number;
    isIncluded: boolean;
    isOptional: boolean;
    customizations?: {
      name: string;
      type: 'text' | 'number' | 'boolean' | 'select';
      options?: string[];
      required: boolean;
      price?: number;
    }[];
  }[];
  pricing: {
    basePrice: number;
    discountedPrice?: number;
    discountPercentage?: number;
    currency: string;
    isNegotiable: boolean;
    paymentTerms: {
      depositPercentage: number;
      paymentSchedule: {
        stage: string;
        percentage: number;
        dueDate: string;
      }[];
    };
  };
  availability: {
    isAvailable: boolean;
    availableFrom: Date;
    availableUntil?: Date;
    maxBookings: number;
    currentBookings: number;
    advanceBookingDays: number;
    blackoutDates: Date[];
  };
  requirements: {
    minGuests: number;
    maxGuests: number;
    venueRequirements: string[];
    equipmentProvided: string[];
    equipmentRequired: string[];
    setupTime: number; // in hours
    breakdownTime: number; // in hours
  };
  media: {
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail?: string;
    caption?: string;
    isPrimary: boolean;
  }[];
  features: {
    name: string;
    description: string;
    icon?: string;
  }[];
  reviews: {
    averageRating: number;
    totalReviews: number;
    ratingBreakdown: {
      five: number;
      four: number;
      three: number;
      two: number;
      one: number;
    };
  };
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const VendorPackageSchema = new Schema<IVendorPackage>({
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: [
      'photography', 'videography', 'catering', 'venue', 'decorations',
      'music', 'flowers', 'transportation', 'makeup', 'dress', 'jewelry',
      'planning', 'entertainment', 'photobooth', 'lighting', 'sound',
      'security', 'cleaning', 'other'
    ]
  },
  subcategory: String,
  services: [{
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    unit: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    isIncluded: {
      type: Boolean,
      default: true
    },
    isOptional: {
      type: Boolean,
      default: false
    },
    customizations: [{
      name: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['text', 'number', 'boolean', 'select'],
        required: true
      },
      options: [String],
      required: {
        type: Boolean,
        default: false
      },
      price: Number
    }]
  }],
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    discountedPrice: {
      type: Number,
      min: 0
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100
    },
    currency: {
      type: String,
      default: 'LKR'
    },
    isNegotiable: {
      type: Boolean,
      default: false
    },
    paymentTerms: {
      depositPercentage: {
        type: Number,
        default: 50,
        min: 0,
        max: 100
      },
      paymentSchedule: [{
        stage: {
          type: String,
          required: true
        },
        percentage: {
          type: Number,
          required: true,
          min: 0,
          max: 100
        },
        dueDate: {
          type: String,
          required: true
        }
      }]
    }
  },
  availability: {
    isAvailable: {
      type: Boolean,
      default: true
    },
    availableFrom: {
      type: Date,
      default: Date.now
    },
    availableUntil: Date,
    maxBookings: {
      type: Number,
      default: 1,
      min: 1
    },
    currentBookings: {
      type: Number,
      default: 0,
      min: 0
    },
    advanceBookingDays: {
      type: Number,
      default: 30,
      min: 1
    },
    blackoutDates: [Date]
  },
  requirements: {
    minGuests: {
      type: Number,
      default: 1,
      min: 1
    },
    maxGuests: {
      type: Number,
      default: 1000,
      min: 1
    },
    venueRequirements: [String],
    equipmentProvided: [String],
    equipmentRequired: [String],
    setupTime: {
      type: Number,
      default: 2,
      min: 0
    },
    breakdownTime: {
      type: Number,
      default: 1,
      min: 0
    }
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'document'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    thumbnail: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  features: [{
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    icon: String
  }],
  reviews: {
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0
    },
    ratingBreakdown: {
      five: { type: Number, default: 0, min: 0 },
      four: { type: Number, default: 0, min: 0 },
      three: { type: Number, default: 0, min: 0 },
      two: { type: Number, default: 0, min: 0 },
      one: { type: Number, default: 0, min: 0 }
    }
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
VendorPackageSchema.index({ vendor: 1, isActive: 1 });
VendorPackageSchema.index({ category: 1, isActive: 1 });
VendorPackageSchema.index({ 'pricing.basePrice': 1 });
VendorPackageSchema.index({ isFeatured: 1, isActive: 1 });
VendorPackageSchema.index({ isPopular: 1, isActive: 1 });
VendorPackageSchema.index({ tags: 1 });
VendorPackageSchema.index({ 'reviews.averageRating': -1 });
VendorPackageSchema.index({ createdAt: -1 });

// Text search index
VendorPackageSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text'
});

// Auto-update updatedAt
VendorPackageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Validation: Ensure currentBookings doesn't exceed maxBookings
VendorPackageSchema.pre('save', function(next) {
  if (this.availability.currentBookings > this.availability.maxBookings) {
    this.availability.currentBookings = this.availability.maxBookings;
  }
  next();
});

export default mongoose.models.VendorPackage || mongoose.model<IVendorPackage>('VendorPackage', VendorPackageSchema);
