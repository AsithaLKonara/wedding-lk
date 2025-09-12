import mongoose, { Schema, Document } from 'mongoose';

export interface IAvailability extends Document {
  vendor: mongoose.Types.ObjectId;
  venue?: mongoose.Types.ObjectId;
  service?: mongoose.Types.ObjectId;
  date: Date;
  timeSlots: {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    price: number;
    maxBookings: number;
    currentBookings: number;
    capacity?: number;
    resources: {
      resourceId: mongoose.Types.ObjectId;
      resourceName: string;
      quantity: number;
      available: number;
    }[];
  }[];
  blackoutDates: Date[];
  recurringAvailability: {
    daysOfWeek: number[]; // 0-6 (Sunday-Saturday)
    startTime: string;
    endTime: string;
    isActive: boolean;
    exceptions: {
      date: Date;
      isAvailable: boolean;
      reason?: string;
    }[];
  };
  specialPricing: {
    startTime: string;
    endTime: string;
    multiplier: number;
    reason: string;
    isActive: boolean;
  }[];
  bufferTime: {
    before: number; // minutes
    after: number; // minutes
  };
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const AvailabilitySchema = new Schema<IAvailability>({
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  venue: {
    type: Schema.Types.ObjectId,
    ref: 'Venue'
  },
  service: {
    type: Schema.Types.ObjectId,
    ref: 'Service'
  },
  date: {
    type: Date,
    required: true
  },
  timeSlots: [{
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
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
    capacity: Number,
    resources: [{
      resourceId: {
        type: Schema.Types.ObjectId,
        ref: 'Resource',
        required: true
      },
      resourceName: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      available: {
        type: Number,
        required: true,
        min: 0
      }
    }]
  }],
  blackoutDates: [Date],
  recurringAvailability: {
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6
    }],
    startTime: String,
    endTime: String,
    isActive: {
      type: Boolean,
      default: false
    },
    exceptions: [{
      date: {
        type: Date,
        required: true
      },
      isAvailable: {
        type: Boolean,
        required: true
      },
      reason: String
    }]
  },
  specialPricing: [{
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
    reason: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  bufferTime: {
    before: {
      type: Number,
      default: 0,
      min: 0
    },
    after: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
AvailabilitySchema.index({ vendor: 1, date: 1 });
AvailabilitySchema.index({ venue: 1, date: 1 });
AvailabilitySchema.index({ service: 1, date: 1 });
AvailabilitySchema.index({ date: 1, isActive: 1 });
AvailabilitySchema.index({ 'recurringAvailability.isActive': 1 });
AvailabilitySchema.index({ 'timeSlots.isAvailable': 1 });
AvailabilitySchema.index({ isActive: 1, createdAt: -1 });

// Compound indexes
AvailabilitySchema.index({ 
  vendor: 1, 
  date: 1, 
  'timeSlots.isAvailable': 1 
});

AvailabilitySchema.index({ 
  venue: 1, 
  date: 1, 
  'timeSlots.isAvailable': 1 
});

// Auto-update updatedAt
AvailabilitySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Validation: Ensure currentBookings doesn't exceed maxBookings
AvailabilitySchema.pre('save', function(next) {
  this.timeSlots.forEach(slot => {
    if (slot.currentBookings > slot.maxBookings) {
      slot.currentBookings = slot.maxBookings;
    }
  });
  next();
});

export default mongoose.models.Availability || mongoose.model<IAvailability>('Availability', AvailabilitySchema);