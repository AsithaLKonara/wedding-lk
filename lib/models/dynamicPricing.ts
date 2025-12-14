import mongoose, { Schema, Document } from 'mongoose';

export interface IDynamicPricing extends Document {
  vendor: mongoose.Types.ObjectId;
  service?: mongoose.Types.ObjectId;
  venue?: mongoose.Types.ObjectId;
  basePrice: number;
  pricingRules: {
    name: string;
    condition: {
      type: 'demand' | 'time' | 'season' | 'day_of_week' | 'weather' | 'competition' | 'inventory' | 'custom';
      operator: 'greater_than' | 'less_than' | 'equals' | 'between' | 'contains';
      value: any;
      secondaryValue?: any;
    };
    adjustment: {
      type: 'percentage' | 'fixed' | 'multiplier';
      value: number;
      minPrice?: number;
      maxPrice?: number;
    };
    priority: number; // Higher number = higher priority
    isActive: boolean;
    validFrom?: Date;
    validUntil?: Date;
  }[];
  seasonalPricing: {
    season: 'spring' | 'summer' | 'fall' | 'winter' | 'holiday' | 'peak' | 'off_peak';
    multiplier: number;
    startDate: string; // MM-DD format
    endDate: string; // MM-DD format
    isActive: boolean;
  }[];
  timeBasedPricing: {
    dayOfWeek: number[]; // 0-6 (Sunday-Saturday)
    startTime: string;
    endTime: string;
    multiplier: number;
    isActive: boolean;
  }[];
  demandPricing: {
    threshold: number; // Booking percentage threshold
    multiplier: number;
    isActive: boolean;
  };
  weatherPricing: {
    condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy';
    multiplier: number;
    isActive: boolean;
  }[];
  competitionPricing: {
    competitorCount: {
      min: number;
      max: number;
    };
    multiplier: number;
    isActive: boolean;
  };
  inventoryPricing: {
    availabilityThreshold: number; // Percentage of availability
    multiplier: number;
    isActive: boolean;
  };
  customPricing: {
    name: string;
    condition: string; // Custom logic expression
    multiplier: number;
    isActive: boolean;
  }[];
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DynamicPricingSchema = new Schema<IDynamicPricing>({
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  },
  venue: {
    type: Schema.Types.ObjectId,
    ref: 'Venue'
  },
  basePrice: {
    type: Number,
    required: true,
    min: 0
  },
  pricingRules: [{
    name: {
      type: String,
      required: true
    },
    condition: {
      type: {
        type: String,
        enum: ['demand', 'time', 'season', 'day_of_week', 'weather', 'competition', 'inventory', 'custom'],
        required: true
      },
      operator: {
        type: String,
        enum: ['greater_than', 'less_than', 'equals', 'between', 'contains'],
        required: true
      },
      value: Schema.Types.Mixed,
      secondaryValue: Schema.Types.Mixed
    },
    adjustment: {
      type: {
        type: String,
        enum: ['percentage', 'fixed', 'multiplier'],
        required: true
      },
      value: {
        type: Number,
        required: true
      },
      minPrice: Number,
      maxPrice: Number
    },
    priority: {
      type: Number,
      default: 1
    },
    isActive: {
      type: Boolean,
      default: true
    },
    validFrom: Date,
    validUntil: Date
  }],
  seasonalPricing: [{
    season: {
      type: String,
      enum: ['spring', 'summer', 'fall', 'winter', 'holiday', 'peak', 'off_peak'],
      required: true
    },
    multiplier: {
      type: Number,
      required: true,
      min: 0
    },
    startDate: {
      type: String,
      required: true,
      match: /^\d{2}-\d{2}$/
    },
    endDate: {
      type: String,
      required: true,
      match: /^\d{2}-\d{2}$/
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  timeBasedPricing: [{
    dayOfWeek: [{
      type: Number,
      min: 0,
      max: 6
    }],
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    multiplier: {
      type: Number,
      required: true,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  demandPricing: {
    threshold: {
      type: Number,
      min: 0,
      max: 100
    },
    multiplier: {
      type: Number,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  weatherPricing: [{
    condition: {
      type: String,
      enum: ['sunny', 'cloudy', 'rainy', 'stormy', 'snowy'],
      required: true
    },
    multiplier: {
      type: Number,
      required: true,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  competitionPricing: {
    competitorCount: {
      min: {
        type: Number,
        default: 0
      },
      max: {
        type: Number,
        default: 100
      }
    },
    multiplier: {
      type: Number,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  inventoryPricing: {
    availabilityThreshold: {
      type: Number,
      min: 0,
      max: 100
    },
    multiplier: {
      type: Number,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  customPricing: [{
    name: {
      type: String,
      required: true
    },
    condition: {
      type: String,
      required: true
    },
    multiplier: {
      type: Number,
      required: true,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  currency: {
    type: String,
    default: 'LKR'
  },
  isActive: {
    type: Boolean,
    default: true
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
DynamicPricingSchema.index({ vendor: 1, isActive: 1 });
DynamicPricingSchema.index({ service: 1, isActive: 1 });
DynamicPricingSchema.index({ venue: 1, isActive: 1 });
DynamicPricingSchema.index({ 'pricingRules.isActive': 1 });
DynamicPricingSchema.index({ 'seasonalPricing.isActive': 1 });
DynamicPricingSchema.index({ 'timeBasedPricing.isActive': 1 });
DynamicPricingSchema.index({ createdAt: -1 });

// Auto-update updatedAt
DynamicPricingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Validation: Ensure pricing rules are valid
DynamicPricingSchema.pre('save', function(next) {
  // Sort pricing rules by priority (highest first)
  this.pricingRules.sort((a, b) => b.priority - a.priority);
  
  // Validate date ranges for seasonal pricing
  this.seasonalPricing.forEach(season => {
    if (season.startDate && season.endDate) {
      const start = new Date(`2024-${season.startDate}`);
      const end = new Date(`2024-${season.endDate}`);
      if (start >= end) {
        throw new Error('Seasonal pricing start date must be before end date');
      }
    }
  });
  
  next();
});

export default mongoose.models.DynamicPricing || mongoose.model<IDynamicPricing>('DynamicPricing', DynamicPricingSchema);
