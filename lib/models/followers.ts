import mongoose, { Schema, Document } from 'mongoose';

export interface IFollower extends Document {
  // User Information
  followerId: mongoose.Types.ObjectId; // User who is following
  followingId: mongoose.Types.ObjectId; // User being followed
  
  // Follow Type
  followType: 'user' | 'vendor' | 'venue' | 'wedding_planner';
  
  // Follow Status
  status: 'active' | 'blocked' | 'muted';
  
  // Notification Preferences
  notifications: {
    newPosts: boolean;
    newStories: boolean;
    newReels: boolean;
    newServices: boolean;
    promotions: boolean;
    availabilityUpdates: boolean;
  };
  
  // Follow Metadata
  metadata: {
    followSource?: 'search' | 'recommendation' | 'mutual_friend' | 'advertisement' | 'direct';
    deviceType?: 'mobile' | 'desktop' | 'tablet';
    userAgent?: string;
    ipAddress?: string;
  };
  
  // Timestamps
  followedAt: Date;
  lastInteraction?: Date;
  unfollowedAt?: Date;
}

const FollowerSchema = new Schema<IFollower>({
  followerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followingId: {
    type: Schema.Types.ObjectId,
    refPath: 'followingModel',
    required: true
  },
  
  followType: {
    type: String,
    enum: ['user', 'vendor', 'venue', 'wedding_planner'],
    required: true
  },
  
  status: {
    type: String,
    enum: ['active', 'blocked', 'muted'],
    default: 'active'
  },
  
  notifications: {
    newPosts: { type: Boolean, default: true },
    newStories: { type: Boolean, default: true },
    newReels: { type: Boolean, default: true },
    newServices: { type: Boolean, default: true },
    promotions: { type: Boolean, default: false },
    availabilityUpdates: { type: Boolean, default: true }
  },
  
  metadata: {
    followSource: {
      type: String,
      enum: ['search', 'recommendation', 'mutual_friend', 'advertisement', 'direct']
    },
    deviceType: {
      type: String,
      enum: ['mobile', 'desktop', 'tablet']
    },
    userAgent: String,
    ipAddress: String
  },
  
  followedAt: {
    type: Date,
    default: Date.now
  },
  lastInteraction: Date,
  unfollowedAt: Date
}, {
  timestamps: false
});

// Indexes
FollowerSchema.index({ followerId: 1 });
FollowerSchema.index({ followingId: 1 });
FollowerSchema.index({ followType: 1 });
FollowerSchema.index({ status: 1 });
FollowerSchema.index({ followedAt: -1 });
FollowerSchema.index({ lastInteraction: -1 });

// Compound indexes for common queries
FollowerSchema.index({ followerId: 1, followType: 1 });
FollowerSchema.index({ followingId: 1, followType: 1 });
FollowerSchema.index({ followerId: 1, status: 1 });
FollowerSchema.index({ followingId: 1, status: 1 });

// Unique constraint to prevent duplicate follows
FollowerSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

// Virtual for following model reference
FollowerSchema.virtual('followingModel').get(function() {
  switch (this.followType) {
    case 'user':
      return 'User';
    case 'vendor':
      return 'Vendor';
    case 'venue':
      return 'Venue';
    case 'wedding_planner':
      return 'WeddingPlannerProfile';
    default:
      return 'User';
  }
});

// Instance methods
FollowerSchema.methods.unfollow = function() {
  this.status = 'blocked';
  this.unfollowedAt = new Date();
  return this.save();
};

FollowerSchema.methods.mute = function() {
  this.status = 'muted';
  return this.save();
};

FollowerSchema.methods.unmute = function() {
  this.status = 'active';
  return this.save();
};

FollowerSchema.methods.updateInteraction = function() {
  this.lastInteraction = new Date();
  return this.save();
};

// Static methods
FollowerSchema.statics.getFollowers = function(userId: string, followType?: string) {
  const query: any = { followingId: userId, status: 'active' };
  if (followType) {
    query.followType = followType;
  }
  return this.find(query).populate('followerId', 'name email avatar');
};

FollowerSchema.statics.getFollowing = function(userId: string, followType?: string) {
  const query: any = { followerId: userId, status: 'active' };
  if (followType) {
    query.followType = followType;
  }
  return this.find(query).populate('followingId', 'name email avatar businessName');
};

FollowerSchema.statics.getFollowerCount = function(userId: string, followType?: string) {
  const query: any = { followingId: userId, status: 'active' };
  if (followType) {
    query.followType = followType;
  }
  return this.countDocuments(query);
};

FollowerSchema.statics.getFollowingCount = function(userId: string, followType?: string) {
  const query: any = { followerId: userId, status: 'active' };
  if (followType) {
    query.followType = followType;
  }
  return this.countDocuments(query);
};

FollowerSchema.statics.isFollowing = function(followerId: string, followingId: string) {
  return this.findOne({ followerId, followingId, status: 'active' });
};

export const Follower = mongoose.models.Follower || mongoose.model('Follower', FollowerSchema);
