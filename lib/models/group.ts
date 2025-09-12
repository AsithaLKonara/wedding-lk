import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  description: string;
  type: 'location' | 'theme' | 'vendor' | 'general' | 'wedding_planner';
  privacy: 'public' | 'private' | 'secret';
  coverImage?: string;
  avatar?: string;
  members: {
    user: mongoose.Types.ObjectId;
    role: 'admin' | 'moderator' | 'member';
    joinedAt: Date;
    permissions?: {
      canPost: boolean;
      canComment: boolean;
      canInvite: boolean;
      canModerate: boolean;
    };
  }[];
  posts: mongoose.Types.ObjectId[];
  events: mongoose.Types.ObjectId[];
  marketplace: mongoose.Types.ObjectId[];
  rules: {
    title: string;
    description: string;
    isActive: boolean;
  }[];
  settings: {
    allowMemberPosts: boolean;
    requireApproval: boolean;
    allowMarketplace: boolean;
    allowEvents: boolean;
    maxMembers?: number;
  };
  analytics: {
    totalMembers: number;
    totalPosts: number;
    totalEvents: number;
    totalMarketplaceItems: number;
    engagementRate: number;
    lastActivity: Date;
  };
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const GroupSchema = new Schema<IGroup>({
  name: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['location', 'theme', 'vendor', 'general', 'wedding_planner'],
    required: true
  },
  privacy: {
    type: String,
    enum: ['public', 'private', 'secret'],
    default: 'public'
  },
  coverImage: String,
  avatar: String,
  members: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    permissions: {
      canPost: { type: Boolean, default: true },
      canComment: { type: Boolean, default: true },
      canInvite: { type: Boolean, default: false },
      canModerate: { type: Boolean, default: false }
    }
  }],
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'EnhancedPost'
  }],
  events: [{
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }],
  marketplace: [{
    type: Schema.Types.ObjectId,
    ref: 'MarketplaceItem'
  }],
  rules: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  settings: {
    allowMemberPosts: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    allowMarketplace: { type: Boolean, default: true },
    allowEvents: { type: Boolean, default: true },
    maxMembers: Number
  },
  analytics: {
    totalMembers: { type: Number, default: 0 },
    totalPosts: { type: Number, default: 0 },
    totalEvents: { type: Number, default: 0 },
    totalMarketplaceItems: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
GroupSchema.index({ name: 'text', description: 'text' });
GroupSchema.index({ type: 1, privacy: 1 });
GroupSchema.index({ 'members.user': 1 });
GroupSchema.index({ createdBy: 1 });
GroupSchema.index({ isActive: 1, createdAt: -1 });
GroupSchema.index({ 'analytics.totalMembers': -1 });

// Auto-update analytics
GroupSchema.pre('save', function(next) {
  this.analytics.totalMembers = this.members.length;
  this.analytics.lastActivity = new Date();
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);
