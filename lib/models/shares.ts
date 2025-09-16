import mongoose, { Schema, Document } from 'mongoose';

export interface IShare extends Document {
  // Content Information
  contentType: 'post' | 'story' | 'reel' | 'vendor' | 'venue' | 'service' | 'portfolio' | 'review';
  contentId: mongoose.Types.ObjectId;
  
  // User Information
  sharedBy: mongoose.Types.ObjectId; // User who shared
  sharedWith?: mongoose.Types.ObjectId; // User who received the share (for direct shares)
  
  // Share Details
  shareType: 'public' | 'private' | 'direct' | 'group' | 'story';
  shareMethod: 'copy_link' | 'social_media' | 'email' | 'sms' | 'whatsapp' | 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'pinterest';
  
  // Share Content
  shareData: {
    title?: string;
    description?: string;
    image?: string;
    url: string;
    customMessage?: string;
    hashtags?: string[];
    mentions?: mongoose.Types.ObjectId[];
  };
  
  // Platform Information
  platform?: {
    name: string;
    platformId?: string; // Platform-specific ID if shared to external platform
    platformUrl?: string; // URL of the shared content on external platform
  };
  
  // Engagement Tracking
  engagement: {
    views: number;
    clicks: number;
    conversions: number; // Bookings/inquiries generated
    shares: number; // Re-shares
    likes: number;
    comments: number;
  };
  
  // Analytics
  analytics: {
    clickThroughRate: number; // Percentage
    conversionRate: number; // Percentage
    engagementRate: number; // Percentage
    demographics: {
      ageGroups: Array<{
        range: string;
        count: number;
      }>;
      locations: Array<{
        city: string;
        state: string;
        count: number;
      }>;
      devices: Array<{
        type: string;
        count: number;
      }>;
    };
  };
  
  // Metadata
  metadata: {
    deviceType?: 'mobile' | 'desktop' | 'tablet';
    userAgent?: string;
    ipAddress?: string;
    location?: {
      city: string;
      state: string;
      country: string;
    };
    referrer?: string;
    campaignId?: string; // If part of a marketing campaign
  };
  
  // Status
  status: 'active' | 'expired' | 'deleted' | 'moderated';
  
  // Expiration (for story shares)
  expiresAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ShareSchema = new Schema<IShare>({
  contentType: {
    type: String,
    enum: ['post', 'story', 'reel', 'vendor', 'venue', 'service', 'portfolio', 'review'],
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  
  sharedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sharedWith: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  shareType: {
    type: String,
    enum: ['public', 'private', 'direct', 'group', 'story'],
    default: 'public'
  },
  shareMethod: {
    type: String,
    enum: ['copy_link', 'social_media', 'email', 'sms', 'whatsapp', 'facebook', 'twitter', 'instagram', 'linkedin', 'pinterest'],
    required: true
  },
  
  shareData: {
    title: String,
    description: String,
    image: String,
    url: { type: String, required: true },
    customMessage: String,
    hashtags: [String],
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  
  platform: {
    name: String,
    platformId: String,
    platformUrl: String
  },
  
  engagement: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },
  
  analytics: {
    clickThroughRate: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    demographics: {
      ageGroups: [{
        range: String,
        count: { type: Number, default: 0 }
      }],
      locations: [{
        city: String,
        state: String,
        count: { type: Number, default: 0 }
      }],
      devices: [{
        type: String,
        count: { type: Number, default: 0 }
      }]
    }
  },
  
  metadata: {
    deviceType: {
      type: String,
      enum: ['mobile', 'desktop', 'tablet']
    },
    userAgent: String,
    ipAddress: String,
    location: {
      city: String,
      state: String,
      country: String
    },
    referrer: String,
    campaignId: String
  },
  
  status: {
    type: String,
    enum: ['active', 'expired', 'deleted', 'moderated'],
    default: 'active'
  },
  
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes
ShareSchema.index({ contentType: 1, contentId: 1 });
ShareSchema.index({ sharedBy: 1 });
ShareSchema.index({ sharedWith: 1 });
ShareSchema.index({ shareType: 1 });
ShareSchema.index({ shareMethod: 1 });
ShareSchema.index({ status: 1 });
ShareSchema.index({ createdAt: -1 });
ShareSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index
ShareSchema.index({ 'engagement.views': -1 });
ShareSchema.index({ 'engagement.clicks': -1 });
ShareSchema.index({ 'engagement.conversions': -1 });

// Compound indexes
ShareSchema.index({ contentType: 1, contentId: 1, sharedBy: 1 });
ShareSchema.index({ sharedBy: 1, shareType: 1 });
ShareSchema.index({ shareMethod: 1, status: 1 });
ShareSchema.index({ contentType: 1, status: 1 });

// Text search index
ShareSchema.index({
  'shareData.title': 'text',
  'shareData.description': 'text',
  'shareData.customMessage': 'text',
  'shareData.hashtags': 'text'
});

// Instance methods
ShareSchema.methods.incrementView = function() {
  this.engagement.views += 1;
  this.updateAnalytics();
  return this.save();
};

ShareSchema.methods.incrementClick = function() {
  this.engagement.clicks += 1;
  this.updateAnalytics();
  return this.save();
};

ShareSchema.methods.incrementConversion = function() {
  this.engagement.conversions += 1;
  this.updateAnalytics();
  return this.save();
};

ShareSchema.methods.incrementShare = function() {
  this.engagement.shares += 1;
  return this.save();
};

ShareSchema.methods.incrementLike = function() {
  this.engagement.likes += 1;
  this.updateAnalytics();
  return this.save();
};

ShareSchema.methods.incrementComment = function() {
  this.engagement.comments += 1;
  this.updateAnalytics();
  return this.save();
};

ShareSchema.methods.updateAnalytics = function() {
  // Calculate click-through rate
  if (this.engagement.views > 0) {
    this.analytics.clickThroughRate = (this.engagement.clicks / this.engagement.views) * 100;
  }
  
  // Calculate conversion rate
  if (this.engagement.clicks > 0) {
    this.analytics.conversionRate = (this.engagement.conversions / this.engagement.clicks) * 100;
  }
  
  // Calculate engagement rate
  const totalEngagement = this.engagement.likes + this.engagement.comments + this.engagement.shares;
  if (this.engagement.views > 0) {
    this.analytics.engagementRate = (totalEngagement / this.engagement.views) * 100;
  }
  
  return this.save();
};

ShareSchema.methods.addDemographicData = function(ageGroup: string, location: any, deviceType: string) {
  // Add age group data
  let ageGroupData = this.analytics.demographics.ageGroups.find(ag => ag.range === ageGroup);
  if (!ageGroupData) {
    ageGroupData = { range: ageGroup, count: 0 };
    this.analytics.demographics.ageGroups.push(ageGroupData);
  }
  ageGroupData.count += 1;
  
  // Add location data
  if (location) {
    let locationData = this.analytics.demographics.locations.find(loc => 
      loc.city === location.city && loc.state === location.state
    );
    if (!locationData) {
      locationData = { city: location.city, state: location.state, count: 0 };
      this.analytics.demographics.locations.push(locationData);
    }
    locationData.count += 1;
  }
  
  // Add device data
  let deviceData = this.analytics.demographics.devices.find(dev => dev.type === deviceType);
  if (!deviceData) {
    deviceData = { type: deviceType, count: 0 };
    this.analytics.demographics.devices.push(deviceData);
  }
  deviceData.count += 1;
  
  return this.save();
};

ShareSchema.methods.expire = function() {
  this.status = 'expired';
  this.expiresAt = new Date();
  return this.save();
};

ShareSchema.methods.delete = function() {
  this.status = 'deleted';
  return this.save();
};

// Static methods
ShareSchema.statics.getSharesByContent = function(contentType: string, contentId: string) {
  return this.find({
    contentType,
    contentId,
    status: 'active'
  }).populate('sharedBy', 'name avatar').sort({ createdAt: -1 });
};

ShareSchema.statics.getSharesByUser = function(userId: string, limit: number = 20) {
  return this.find({
    sharedBy: userId,
    status: 'active'
  }).populate('contentId').sort({ createdAt: -1 }).limit(limit);
};

ShareSchema.statics.getTopSharedContent = function(contentType?: string, limit: number = 10) {
  const query: any = { status: 'active' };
  if (contentType) {
    query.contentType = contentType;
  }
  
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: { contentType: '$contentType', contentId: '$contentId' },
        totalShares: { $sum: 1 },
        totalViews: { $sum: '$engagement.views' },
        totalClicks: { $sum: '$engagement.clicks' },
        totalConversions: { $sum: '$engagement.conversions' }
      }
    },
    { $sort: { totalShares: -1 } },
    { $limit: limit }
  ]);
};

ShareSchema.statics.getShareAnalytics = function(shareId: string) {
  return this.findById(shareId).populate('sharedBy', 'name avatar');
};

export const Share = mongoose.models.Share || mongoose.model('Share', ShareSchema);
