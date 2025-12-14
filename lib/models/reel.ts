// Reels Model (Short-form vertical videos)
import mongoose, { Schema, Document } from 'mongoose';

export interface IReel extends Document {
  author: {
    type: 'user' | 'vendor' | 'venue' | 'planner';
    id: mongoose.Types.ObjectId;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  
  // Reel content
  video: {
    url: string;
    thumbnail: string;
    duration: number; // in seconds
    size: number;
    resolution: {
      width: number;
      height: number;
    };
    aspectRatio: string; // "9:16" for vertical
  };
  
  // Audio
  audio?: {
    track: string; // audio track name
    artist?: string;
    duration: number;
    startTime?: number; // where audio starts in video
  };
  
  // Caption and description
  caption: string;
  description?: string;
  hashtags: string[];
  mentions: string[]; // @mentions
  
  // Visual effects
  effects?: {
    filters: string[];
    transitions: string[];
    stickers: {
      type: string;
      position: { x: number; y: number };
      rotation?: number;
      scale?: number;
    }[];
  };
  
  // Engagement
  likes: {
    userId: mongoose.Types.ObjectId;
    likedAt: Date;
  }[];
  
  comments: {
    userId: mongoose.Types.ObjectId;
    userName: string;
    userAvatar?: string;
    content: string;
    likes: number;
    likedBy: mongoose.Types.ObjectId[];
    replies: {
      userId: mongoose.Types.ObjectId;
      userName: string;
      userAvatar?: string;
      content: string;
      likes: number;
      likedBy: mongoose.Types.ObjectId[];
      createdAt: Date;
    }[];
    createdAt: Date;
  }[];
  
  shares: {
    userId: mongoose.Types.ObjectId;
    sharedAt: Date;
    method: 'story' | 'dm' | 'post' | 'external';
  }[];
  
  bookmarks: {
    userId: mongoose.Types.ObjectId;
    bookmarkedAt: Date;
  }[];
  
  // Reel settings
  settings: {
    allowComments: boolean;
    allowDuets: boolean;
    allowStitches: boolean;
    allowDownloads: boolean;
    isPublic: boolean;
    location?: {
      name: string;
      coordinates: {
        lat: number;
        lng: number;
      };
    };
  };
  
  // Performance metrics
  metrics: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    bookmarkCount: number;
    playCount: number;
    completionRate: number; // average completion percentage
    engagementRate: number; // (likes + comments + shares) / views
  };
  
  // Content categorization
  category: string;
  tags: string[];
  isTrending: boolean;
  trendingScore: number;
  
  // Moderation
  status: 'draft' | 'published' | 'hidden' | 'removed';
  moderationFlags: {
    inappropriate: boolean;
    copyright: boolean;
    spam: boolean;
    violence: boolean;
    other: string[];
  };
  
  // Remix/Duet features
  originalReelId?: mongoose.Types.ObjectId;
  remixType?: 'duet' | 'stitch' | 'reaction';
  remixData?: {
    startTime: number;
    endTime: number;
    side: 'left' | 'right'; // for duets
  };
  
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReelSchema = new Schema<IReel>({
  author: {
    type: { 
      type: String, 
      required: true, 
      enum: ['user', 'vendor', 'venue', 'planner'] 
    },
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, maxlength: 100 },
    avatar: { type: String },
    verified: { type: Boolean, default: false }
  },
  
  video: {
    url: { type: String, required: true },
    thumbnail: { type: String, required: true },
    duration: { type: Number, required: true, min: 1, max: 300 }, // 1-300 seconds
    size: { type: Number, required: true },
    resolution: {
      width: { type: Number, required: true },
      height: { type: Number, required: true }
    },
    aspectRatio: { type: String, default: '9:16' }
  },
  
  audio: {
    track: { type: String, maxlength: 100 },
    artist: { type: String, maxlength: 100 },
    duration: { type: Number, min: 0 },
    startTime: { type: Number, min: 0 }
  },
  
  caption: { type: String, required: true, maxlength: 2000 },
  description: { type: String, maxlength: 500 },
  hashtags: [{ type: String, maxlength: 50 }],
  mentions: [{ type: String, maxlength: 50 }],
  
  effects: {
    filters: [{ type: String, maxlength: 50 }],
    transitions: [{ type: String, maxlength: 50 }],
    stickers: [{
      type: { type: String, required: true },
      position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
      },
      rotation: { type: Number, default: 0 },
      scale: { type: Number, default: 1 }
    }]
  },
  
  likes: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likedAt: { type: Date, required: true, default: Date.now }
  }],
  
  comments: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true, maxlength: 100 },
    userAvatar: { type: String },
    content: { type: String, required: true, maxlength: 500 },
    likes: { type: Number, default: 0, min: 0 },
    likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    replies: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      userName: { type: String, required: true, maxlength: 100 },
      userAvatar: { type: String },
      content: { type: String, required: true, maxlength: 500 },
      likes: { type: Number, default: 0, min: 0 },
      likedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      createdAt: { type: Date, required: true, default: Date.now }
    }],
    createdAt: { type: Date, required: true, default: Date.now }
  }],
  
  shares: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sharedAt: { type: Date, required: true, default: Date.now },
    method: { 
      type: String, 
      required: true, 
      enum: ['story', 'dm', 'post', 'external'] 
    }
  }],
  
  bookmarks: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookmarkedAt: { type: Date, required: true, default: Date.now }
  }],
  
  settings: {
    allowComments: { type: Boolean, default: true },
    allowDuets: { type: Boolean, default: true },
    allowStitches: { type: Boolean, default: true },
    allowDownloads: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: true },
    location: {
      name: { type: String, maxlength: 100 },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number }
      }
    }
  },
  
  metrics: {
    viewCount: { type: Number, default: 0, min: 0 },
    likeCount: { type: Number, default: 0, min: 0 },
    commentCount: { type: Number, default: 0, min: 0 },
    shareCount: { type: Number, default: 0, min: 0 },
    bookmarkCount: { type: Number, default: 0, min: 0 },
    playCount: { type: Number, default: 0, min: 0 },
    completionRate: { type: Number, default: 0, min: 0, max: 100 },
    engagementRate: { type: Number, default: 0, min: 0, max: 100 }
  },
  
  category: { type: String, required: true, maxlength: 50 },
  tags: [{ type: String, maxlength: 30 }],
  isTrending: { type: Boolean, default: false},
  trendingScore: { type: Number, default: 0, min: 0 },
  
  status: { 
    type: String, 
    enum: ['draft', 'published', 'hidden', 'removed'],
    default: 'draft'},
  moderationFlags: {
    inappropriate: { type: Boolean, default: false },
    copyright: { type: Boolean, default: false },
    spam: { type: Boolean, default: false },
    violence: { type: Boolean, default: false },
    other: [{ type: String, maxlength: 100 }]
  },
  
  originalReelId: { type: Schema.Types.ObjectId, ref: 'Reel' },
  remixType: { 
    type: String, 
    enum: ['duet', 'stitch', 'reaction'] 
  },
  remixData: {
    startTime: { type: Number, min: 0 },
    endTime: { type: Number, min: 0 },
    side: { 
      type: String, 
      enum: ['left', 'right'] 
    }
  },
  
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
ReelSchema.index({ 'author.id': 1, status: 1 });
ReelSchema.index({ publishedAt: -1, status: 1 });
ReelSchema.index({ category: 1, status: 1 });
ReelSchema.index({ hashtags: 1 });
ReelSchema.index({ isTrending: 1, trendingScore: -1 });
ReelSchema.index({ 'metrics.viewCount': -1 });

// Pre-save middleware
ReelSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Update metrics
  this.metrics.likeCount = this.likes.length;
  this.metrics.commentCount = this.comments.length;
  this.metrics.shareCount = this.shares.length;
  this.metrics.bookmarkCount = this.bookmarks.length;
  
  // Calculate engagement rate
  if (this.metrics.viewCount > 0) {
    const totalEngagement = this.metrics.likeCount + this.metrics.commentCount + this.metrics.shareCount;
    this.metrics.engagementRate = (totalEngagement / this.metrics.viewCount) * 100;
  }
  
  // Set published date when status changes to published
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

export default mongoose.models.Reel || mongoose.model<IReel>('Reel', ReelSchema);


