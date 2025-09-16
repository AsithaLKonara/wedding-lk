import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorAvailability extends Document {
  vendorId: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId; // Optional: specific service availability
  
  // General Availability Settings
  isAvailable: boolean;
  advanceBookingDays: number; // Minimum days in advance
  maxAdvanceBookingDays: number; // Maximum days in advance
  
  // Working Hours
  workingHours: Array<{
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    isWorking: boolean;
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
    breakStart?: string; // HH:MM format
    breakEnd?: string; // HH:MM format
  }>;
  
  // Specific Date Availability
  specificDates: Array<{
    date: Date;
    isAvailable: boolean;
    startTime?: string;
    endTime?: string;
    reason?: string; // Why unavailable or special hours
    priceMultiplier?: number; // Special pricing for this date
  }>;
  
  // Blackout Periods
  blackoutPeriods: Array<{
    startDate: Date;
    endDate: Date;
    reason: string;
    isRecurring: boolean; // Annual recurring blackout
    recurringMonth?: number; // Month for recurring blackout
    recurringDay?: number; // Day for recurring blackout
  }>;
  
  // Seasonal Availability
  seasonalAvailability: Array<{
    season: 'spring' | 'summer' | 'autumn' | 'winter';
    months: number[]; // 1-12
    isAvailable: boolean;
    priceMultiplier?: number;
    specialHours?: {
      startTime: string;
      endTime: string;
    };
  }>;
  
  // Holiday Availability
  holidayAvailability: Array<{
    holidayName: string;
    date: Date;
    isAvailable: boolean;
    priceMultiplier?: number;
    specialHours?: {
      startTime: string;
      endTime: string;
    };
  }>;
  
  // Capacity Management
  capacity: {
    maxBookingsPerDay: number;
    maxBookingsPerTimeSlot: number;
    timeSlotDuration: number; // in minutes
    bufferTime: number; // in minutes between bookings
    currentBookings: Array<{
      bookingId: mongoose.Types.ObjectId;
      date: Date;
      startTime: string;
      endTime: string;
      status: 'confirmed' | 'pending' | 'cancelled';
    }>;
  };
  
  // Location-based Availability
  locationAvailability: Array<{
    location: {
      city: string;
      state: string;
      radius: number; // in kilometers
    };
    isAvailable: boolean;
    additionalCharges?: number;
    travelTime: number; // in minutes
  }>;
  
  // Emergency Availability
  emergencyAvailability: {
    isEnabled: boolean;
    advanceNoticeHours: number; // Minimum hours notice required
    priceMultiplier: number;
    conditions: string[]; // Conditions for emergency booking
  };
  
  // Availability Rules
  rules: {
    requireDeposit: boolean;
    minimumBookingDuration: number; // in hours
    maximumBookingDuration: number; // in hours
    allowSameDayBooking: boolean;
    allowWeekendBooking: boolean;
    allowHolidayBooking: boolean;
    cancellationPolicy: {
      freeCancellationHours: number;
      cancellationCharges: Array<{
        hoursBeforeBooking: number;
        chargePercentage: number;
      }>;
    };
  };
  
  // Availability Status
  status: 'active' | 'inactive' | 'suspended';
  lastUpdated: Date;
  updatedBy: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

const VendorAvailabilitySchema = new Schema<IVendorAvailability>({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'VendorService'
  },
  
  isAvailable: {
    type: Boolean,
    default: true
  },
  advanceBookingDays: {
    type: Number,
    default: 7
  },
  maxAdvanceBookingDays: {
    type: Number,
    default: 365
  },
  
  workingHours: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true
    },
    isWorking: { type: Boolean, default: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    breakStart: String,
    breakEnd: String
  }],
  
  specificDates: [{
    date: { type: Date, required: true },
    isAvailable: { type: Boolean, required: true },
    startTime: String,
    endTime: String,
    reason: String,
    priceMultiplier: Number
  }],
  
  blackoutPeriods: [{
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    isRecurring: { type: Boolean, default: false },
    recurringMonth: Number,
    recurringDay: Number
  }],
  
  seasonalAvailability: [{
    season: {
      type: String,
      enum: ['spring', 'summer', 'autumn', 'winter']
    },
    months: [Number],
    isAvailable: { type: Boolean, default: true },
    priceMultiplier: Number,
    specialHours: {
      startTime: String,
      endTime: String
    }
  }],
  
  holidayAvailability: [{
    holidayName: { type: String, required: true },
    date: { type: Date, required: true },
    isAvailable: { type: Boolean, default: true },
    priceMultiplier: Number,
    specialHours: {
      startTime: String,
      endTime: String
    }
  }],
  
  capacity: {
    maxBookingsPerDay: { type: Number, default: 10 },
    maxBookingsPerTimeSlot: { type: Number, default: 1 },
    timeSlotDuration: { type: Number, default: 60 }, // minutes
    bufferTime: { type: Number, default: 30 }, // minutes
    currentBookings: [{
      bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
      date: { type: Date, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled'],
        default: 'pending'
      }
    }]
  },
  
  locationAvailability: [{
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      radius: { type: Number, default: 50 }
    },
    isAvailable: { type: Boolean, default: true },
    additionalCharges: Number,
    travelTime: Number
  }],
  
  emergencyAvailability: {
    isEnabled: { type: Boolean, default: false },
    advanceNoticeHours: { type: Number, default: 24 },
    priceMultiplier: { type: Number, default: 1.5 },
    conditions: [String]
  },
  
  rules: {
    requireDeposit: { type: Boolean, default: true },
    minimumBookingDuration: { type: Number, default: 1 },
    maximumBookingDuration: { type: Number, default: 12 },
    allowSameDayBooking: { type: Boolean, default: false },
    allowWeekendBooking: { type: Boolean, default: true },
    allowHolidayBooking: { type: Boolean, default: false },
    cancellationPolicy: {
      freeCancellationHours: { type: Number, default: 24 },
      cancellationCharges: [{
        hoursBeforeBooking: { type: Number, required: true },
        chargePercentage: { type: Number, required: true }
      }]
    }
  },
  
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
VendorAvailabilitySchema.index({ vendorId: 1 });
VendorAvailabilitySchema.index({ serviceId: 1 });
VendorAvailabilitySchema.index({ vendorId: 1, serviceId: 1 });
VendorAvailabilitySchema.index({ 'specificDates.date': 1 });
VendorAvailabilitySchema.index({ 'blackoutPeriods.startDate': 1, 'blackoutPeriods.endDate': 1 });
VendorAvailabilitySchema.index({ 'holidayAvailability.date': 1 });
VendorAvailabilitySchema.index({ 'capacity.currentBookings.date': 1 });
VendorAvailabilitySchema.index({ 'capacity.currentBookings.bookingId': 1 });
VendorAvailabilitySchema.index({ status: 1 });
VendorAvailabilitySchema.index({ isAvailable: 1 });

// Compound indexes for availability queries
VendorAvailabilitySchema.index({ vendorId: 1, isAvailable: 1 });
VendorAvailabilitySchema.index({ vendorId: 1, status: 1 });
VendorAvailabilitySchema.index({ 'locationAvailability.location.city': 1, 'locationAvailability.location.state': 1 });

export const VendorAvailability = mongoose.models.VendorAvailability || mongoose.model('VendorAvailability', VendorAvailabilitySchema);
