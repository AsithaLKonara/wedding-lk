import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalytics extends Document {
  // Basic Information
  entityId: mongoose.Types.ObjectId; // User, Vendor, or Platform ID
  entityType: 'user' | 'vendor' | 'platform' | 'booking' | 'venue';
  date: Date;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  
  // User Analytics
  userMetrics?: {
    profileViews: number;
    bookingsMade: number;
    reviewsWritten: number;
    favoritesAdded: number;
    messagesSent: number;
    timeSpent: number; // in minutes
    pagesVisited: number;
    searchQueries: number;
    referralClicks: number;
    socialShares: number;
  };
  
  // Vendor Analytics
  vendorMetrics?: {
    profileViews: number;
    listingViews: number;
    contactClicks: number;
    bookingsReceived: number;
    revenue: number;
    averageRating: number;
    reviewCount: number;
    responseTime: number; // in minutes
    conversionRate: number; // percentage
    topSearchTerms: string[];
    geographicReach: {
      country: string;
      views: number;
    }[];
    deviceBreakdown: {
      device: 'mobile' | 'tablet' | 'desktop';
      views: number;
    }[];
    trafficSources: {
      source: 'organic' | 'paid' | 'social' | 'direct' | 'referral';
      views: number;
    }[];
  };
  
  // Platform Analytics
  platformMetrics?: {
    totalUsers: number;
    totalVendors: number;
    totalBookings: number;
    totalRevenue: number;
    averageBookingValue: number;
    userGrowth: number; // percentage
    vendorGrowth: number; // percentage
    bookingGrowth: number; // percentage
    revenueGrowth: number; // percentage
    activeUsers: number;
    newRegistrations: number;
    userRetention: number; // percentage
    vendorRetention: number; // percentage
    platformCommission: number;
    refundRate: number; // percentage
    disputeRate: number; // percentage
    averageResolutionTime: number; // in hours
  };
  
  // Booking Analytics
  bookingMetrics?: {
    totalBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    pendingBookings: number;
    totalValue: number;
    averageValue: number;
    bookingTrends: {
      category: string;
      count: number;
      value: number;
    }[];
    seasonalTrends: {
      month: string;
      bookings: number;
      revenue: number;
    }[];
    geographicDistribution: {
      location: string;
      bookings: number;
      revenue: number;
    }[];
  };
  
  // Venue Analytics
  venueMetrics?: {
    views: number;
    inquiries: number;
    bookings: number;
    revenue: number;
    averageRating: number;
    reviewCount: number;
    availabilityRate: number; // percentage
    peakHours: {
      hour: number;
      views: number;
    }[];
    popularFeatures: {
      feature: string;
      count: number;
    }[];
  };
  
  // Engagement Metrics
  engagementMetrics?: {
    likes: number;
    shares: number;
    comments: number;
    saves: number;
    clicks: number;
    impressions: number;
    engagementRate: number; // percentage
    clickThroughRate: number; // percentage
    bounceRate: number; // percentage
    sessionDuration: number; // in minutes
    pagesPerSession: number;
    returnVisitorRate: number; // percentage
  };
  
  // Financial Metrics
  financialMetrics?: {
    revenue: number;
    expenses: number;
    profit: number;
    profitMargin: number; // percentage
    averageTransactionValue: number;
    customerLifetimeValue: number;
    costPerAcquisition: number;
    returnOnInvestment: number; // percentage
    cashFlow: number;
    outstandingPayments: number;
    refunds: number;
    chargebacks: number;
  };
  
  // Performance Metrics
  performanceMetrics?: {
    pageLoadTime: number; // in milliseconds
    apiResponseTime: number; // in milliseconds
    errorRate: number; // percentage
    uptime: number; // percentage
    cacheHitRate: number; // percentage
    databaseQueryTime: number; // in milliseconds
    memoryUsage: number; // in MB
    cpuUsage: number; // percentage
    diskUsage: number; // in GB
    bandwidthUsage: number; // in GB
  };
  
  // Custom Metrics
  customMetrics?: {
    [key: string]: any;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSchema: Schema = new Schema({
  // Basic Information
  entityId: {
    type: Schema.Types.ObjectId,
    required: true},
  entityType: {
    type: String,
    required: true,
    enum: ['user', 'vendor', 'platform', 'booking', 'venue']},
  date: {
    type: Date,
    required: true},
  period: {
    type: String,
    required: true,
    enum: ['daily', 'weekly', 'monthly', 'yearly']},
  
  // User Analytics
  userMetrics: {
    profileViews: { type: Number, default: 0 },
    bookingsMade: { type: Number, default: 0 },
    reviewsWritten: { type: Number, default: 0 },
    favoritesAdded: { type: Number, default: 0 },
    messagesSent: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    pagesVisited: { type: Number, default: 0 },
    searchQueries: { type: Number, default: 0 },
    referralClicks: { type: Number, default: 0 },
    socialShares: { type: Number, default: 0 }
  },
  
  // Vendor Analytics
  vendorMetrics: {
    profileViews: { type: Number, default: 0 },
    listingViews: { type: Number, default: 0 },
    contactClicks: { type: Number, default: 0 },
    bookingsReceived: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    topSearchTerms: [{ type: String }],
    geographicReach: [{
      country: String,
      views: Number
    }],
    deviceBreakdown: [{
      device: { type: String, enum: ['mobile', 'tablet', 'desktop'] },
      views: Number
    }],
    trafficSources: [{
      source: { type: String, enum: ['organic', 'paid', 'social', 'direct', 'referral'] },
      views: Number
    }]
  },
  
  // Platform Analytics
  platformMetrics: {
    totalUsers: { type: Number, default: 0 },
    totalVendors: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    averageBookingValue: { type: Number, default: 0 },
    userGrowth: { type: Number, default: 0 },
    vendorGrowth: { type: Number, default: 0 },
    bookingGrowth: { type: Number, default: 0 },
    revenueGrowth: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    newRegistrations: { type: Number, default: 0 },
    userRetention: { type: Number, default: 0 },
    vendorRetention: { type: Number, default: 0 },
    platformCommission: { type: Number, default: 0 },
    refundRate: { type: Number, default: 0 },
    disputeRate: { type: Number, default: 0 },
    averageResolutionTime: { type: Number, default: 0 }
  },
  
  // Booking Analytics
  bookingMetrics: {
    totalBookings: { type: Number, default: 0 },
    completedBookings: { type: Number, default: 0 },
    cancelledBookings: { type: Number, default: 0 },
    pendingBookings: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    averageValue: { type: Number, default: 0 },
    bookingTrends: [{
      category: String,
      count: Number,
      value: Number
    }],
    seasonalTrends: [{
      month: String,
      bookings: Number,
      revenue: Number
    }],
    geographicDistribution: [{
      location: String,
      bookings: Number,
      revenue: Number
    }]
  },
  
  // Venue Analytics
  venueMetrics: {
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    availabilityRate: { type: Number, default: 0 },
    peakHours: [{
      hour: Number,
      views: Number
    }],
    popularFeatures: [{
      feature: String,
      count: Number
    }]
  },
  
  // Engagement Metrics
  engagementMetrics: {
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    clickThroughRate: { type: Number, default: 0 },
    bounceRate: { type: Number, default: 0 },
    sessionDuration: { type: Number, default: 0 },
    pagesPerSession: { type: Number, default: 0 },
    returnVisitorRate: { type: Number, default: 0 }
  },
  
  // Financial Metrics
  financialMetrics: {
    revenue: { type: Number, default: 0 },
    expenses: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    profitMargin: { type: Number, default: 0 },
    averageTransactionValue: { type: Number, default: 0 },
    customerLifetimeValue: { type: Number, default: 0 },
    costPerAcquisition: { type: Number, default: 0 },
    returnOnInvestment: { type: Number, default: 0 },
    cashFlow: { type: Number, default: 0 },
    outstandingPayments: { type: Number, default: 0 },
    refunds: { type: Number, default: 0 },
    chargebacks: { type: Number, default: 0 }
  },
  
  // Performance Metrics
  performanceMetrics: {
    pageLoadTime: { type: Number, default: 0 },
    apiResponseTime: { type: Number, default: 0 },
    errorRate: { type: Number, default: 0 },
    uptime: { type: Number, default: 0 },
    cacheHitRate: { type: Number, default: 0 },
    databaseQueryTime: { type: Number, default: 0 },
    memoryUsage: { type: Number, default: 0 },
    cpuUsage: { type: Number, default: 0 },
    diskUsage: { type: Number, default: 0 },
    bandwidthUsage: { type: Number, default: 0 }
  },
  
  // Custom Metrics
  customMetrics: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Compound indexes for performance
AnalyticsSchema.index({ entityId: 1, entityType: 1, date: -1, period: 1 });
AnalyticsSchema.index({ entityType: 1, date: -1, period: 1 });
AnalyticsSchema.index({ date: -1, period: 1 });

// Virtual for formatted date
AnalyticsSchema.virtual('formattedDate').get(function() {
  return this.date.toISOString().split('T')[0];
});

// Method to get analytics summary
AnalyticsSchema.methods.getSummary = function() {
  const summary: any = {
    entityId: this.entityId,
    entityType: this.entityType,
    date: this.date,
    period: this.period
  };
  
  // Add relevant metrics based on entity type
  switch (this.entityType) {
    case 'user':
      summary.metrics = this.userMetrics;
      break;
    case 'vendor':
      summary.metrics = this.vendorMetrics;
      break;
    case 'platform':
      summary.metrics = this.platformMetrics;
      break;
    case 'booking':
      summary.metrics = this.bookingMetrics;
      break;
    case 'venue':
      summary.metrics = this.venueMetrics;
      break;
  }
  
  return summary;
};

// Static method to create analytics entry
AnalyticsSchema.statics.createAnalytics = async function(
  entityId: mongoose.Types.ObjectId,
  entityType: string,
  date: Date,
  period: string,
  metrics: any
) {
  // Check if entry already exists
  const existing = await this.findOne({
    entityId,
    entityType,
    date,
    period
  });
  
  if (existing) {
    // Update existing entry
    Object.assign(existing, metrics);
    return await existing.save();
  } else {
    // Create new entry
    const analytics = new this({
      entityId,
      entityType,
      date,
      period,
      ...metrics
    });
    return await analytics.save();
  }
};

// Static method to get analytics for date range
AnalyticsSchema.statics.getAnalyticsRange = async function(
  entityId: mongoose.Types.ObjectId,
  entityType: string,
  startDate: Date,
  endDate: Date,
  period: string = 'daily'
) {
  return await this.find({
    entityId,
    entityType,
    date: { $gte: startDate, $lte: endDate },
    period
  }).sort({ date: 1 });
};

// Static method to get aggregated analytics
AnalyticsSchema.statics.getAggregatedAnalytics = async function(
  entityType: string,
  startDate: Date,
  endDate: Date,
  period: string = 'daily',
  groupBy: string[] = []
) {
  const pipeline: any[] = [
    {
      $match: {
        entityType,
        date: { $gte: startDate, $lte: endDate },
        period
      }
    }
  ];
  
  if (groupBy.length > 0) {
    const groupStage: any = { _id: {} };
    groupBy.forEach(field => {
      groupStage._id[field] = `$${field}`;
    });
    
    // Add aggregation for numeric fields
    const numericFields = [
      'userMetrics.profileViews',
      'userMetrics.bookingsMade',
      'vendorMetrics.revenue',
      'platformMetrics.totalUsers',
      'bookingMetrics.totalBookings'
    ];
    
    numericFields.forEach(field => {
      groupStage[field] = { $sum: `$${field}` };
    });
    
    pipeline.push({ $group: groupStage });
  }
  
  return await this.aggregate(pipeline);
};

export const Analytics = mongoose.models.Analytics || mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);

