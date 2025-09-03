import mongoose, { Schema, Document } from 'mongoose';

export interface IVenueBoost extends Document {
  venue: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  boostType: 'basic' | 'premium' | 'featured' | 'trending';
  status: 'pending' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget: {
    amount: number;
    spent: number;
    remaining: number;
    currency: string;
  };
  duration: {
    startDate: Date;
    endDate: Date;
    days: number;
  };
  targeting: {
    locations: string[];
    guestCount: {
      min: number;
      max: number;
    };
    eventTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
    seasons: string[];
    daysOfWeek: string[];
  };
  performance: {
    impressions: number;
    clicks: number;
    views: number;
    inquiries: number;
    bookings: number;
    ctr: number;
    cpc: number;
    cpm: number;
    roi: number;
  };
  dailyStats: Array<{
    date: Date;
    impressions: number;
    clicks: number;
    views: number;
    inquiries: number;
    bookings: number;
    spend: number;
  }>;
  autoRenew: boolean;
  bidAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const VenueBoostSchema = new Schema<IVenueBoost>({
  venue: {
    type: Schema.Types.ObjectId,
    ref: 'Venue',
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  boostType: {
    type: String,
    enum: ['basic', 'premium', 'featured', 'trending'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'paused', 'completed', 'cancelled'],
    default: 'pending',
  },
  budget: {
    amount: {
      type: Number,
      required: true,
      min: 1000,
    },
    spent: {
      type: Number,
      default: 0,
    },
    remaining: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'LKR',
    },
  },
  duration: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    days: {
      type: Number,
      required: true,
    },
  },
  targeting: {
    locations: [{
      type: String,
      required: true,
    }],
    guestCount: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 1000,
      },
    },
    eventTypes: [{
      type: String,
      enum: ['wedding', 'reception', 'engagement', 'anniversary', 'other'],
    }],
    priceRange: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 1000000,
      },
    },
    seasons: [{
      type: String,
      enum: ['spring', 'summer', 'autumn', 'winter', 'monsoon'],
    }],
    daysOfWeek: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    }],
  },
  performance: {
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
    bookings: {
      type: Number,
      default: 0,
    },
    ctr: {
      type: Number,
      default: 0,
    },
    cpc: {
      type: Number,
      default: 0,
    },
    cpm: {
      type: Number,
      default: 0,
    },
    roi: {
      type: Number,
      default: 0,
    },
  },
  dailyStats: [{
    date: {
      type: Date,
      required: true,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
    bookings: {
      type: Number,
      default: 0,
    },
    spend: {
      type: Number,
      default: 0,
    },
  }],
  autoRenew: {
    type: Boolean,
    default: false,
  },
  bidAmount: {
    type: Number,
    required: true,
    min: 100,
  },
}, {
  timestamps: true,
});

// Indexes for performance
VenueBoostSchema.index({ venue: 1, status: 1 });
VenueBoostSchema.index({ owner: 1, status: 1 });
VenueBoostSchema.index({ boostType: 1, status: 1 });
VenueBoostSchema.index({ 'duration.startDate': 1, 'duration.endDate': 1 });
VenueBoostSchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware to calculate remaining budget
VenueBoostSchema.pre('save', function(next) {
  if (this.isModified('budget.spent')) {
    this.budget.remaining = this.budget.amount - this.budget.spent;
  }
  next();
});

// Method to calculate performance metrics
VenueBoostSchema.methods.calculateMetrics = function() {
  if (this.performance.impressions > 0) {
    this.performance.ctr = (this.performance.clicks / this.performance.impressions) * 100;
    this.performance.cpc = this.budget.spent / this.performance.clicks;
    this.performance.cpm = (this.budget.spent / this.performance.impressions) * 1000;
  }
  
  if (this.budget.spent > 0 && this.performance.bookings > 0) {
    // Calculate ROI based on average booking value
    const avgBookingValue = 50000; // This should come from actual booking data
    this.performance.roi = ((this.performance.bookings * avgBookingValue - this.budget.spent) / this.budget.spent) * 100;
  }
  
  return this;
};

// Method to add daily stats
VenueBoostSchema.methods.addDailyStats = function(date: Date, stats: any) {
  const existingStat = this.dailyStats.find((stat: any) => 
    stat.date.toDateString() === date.toDateString()
  );
  
  if (existingStat) {
    existingStat.impressions += stats.impressions || 0;
    existingStat.clicks += stats.clicks || 0;
    existingStat.views += stats.views || 0;
    existingStat.inquiries += stats.inquiries || 0;
    existingStat.bookings += stats.bookings || 0;
    existingStat.spend += stats.spend || 0;
  } else {
    this.dailyStats.push({
      date,
      impressions: stats.impressions || 0,
      clicks: stats.clicks || 0,
      views: stats.views || 0,
      inquiries: stats.inquiries || 0,
      bookings: stats.bookings || 0,
      spend: stats.spend || 0,
    });
  }
  
  return this;
};

// Method to update performance totals
VenueBoostSchema.methods.updatePerformanceTotals = function() {
  this.performance.impressions = this.dailyStats.reduce((sum: number, stat: any) => sum + stat.impressions, 0);
  this.performance.clicks = this.dailyStats.reduce((sum: number, stat: any) => sum + stat.clicks, 0);
  this.performance.views = this.dailyStats.reduce((sum: number, stat: any) => sum + stat.views, 0);
  this.performance.inquiries = this.dailyStats.reduce((sum: number, stat: any) => sum + stat.inquiries, 0);
  this.performance.bookings = this.dailyStats.reduce((sum: number, stat: any) => sum + stat.bookings, 0);
  this.budget.spent = this.dailyStats.reduce((sum: number, stat: any) => sum + stat.spend, 0);
  
  this.calculateMetrics();
  return this;
};

// Static method to get active boosts
VenueBoostSchema.statics.getActiveBoosts = function() {
  return this.find({
    status: 'active',
    'duration.startDate': { $lte: new Date() },
    'duration.endDate': { $gte: new Date() },
    'budget.remaining': { $gt: 0 },
  }).populate('venue', 'name images location pricing');
};

// Static method to get boosts by venue
VenueBoostSchema.statics.getBoostsByVenue = function(venueId: string) {
  return this.find({ venue: venueId }).sort({ createdAt: -1 });
};

// Static method to get boosts by owner
VenueBoostSchema.statics.getBoostsByOwner = function(ownerId: string) {
  return this.find({ owner: ownerId }).sort({ createdAt: -1 });
};

export default mongoose.models.VenueBoost || mongoose.model<IVenueBoost>('VenueBoost', VenueBoostSchema); 