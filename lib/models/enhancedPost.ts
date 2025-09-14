import mongoose, { Schema, Document } from 'mongoose';

export interface IEnhancedPost extends Document {
  content: string;
  media: {
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    thumbnail?: string;
    metadata?: {
      duration?: number;
      size?: number;
      format?: string;
      dimensions?: {
        width: number;
        height: number;
      };
    };
  }[];
  author: {
    type: 'user' | 'vendor' | 'admin' | 'wedding_planner';
    id: mongoose.Types.ObjectId;
    name: string;
    avatar?: string;
    verified: boolean;
    role: string;
  };
  engagement: {
    reactions: {
      like: number;
      love: number;
      wow: number;
      laugh: number;
      angry: number;
      sad: number;
    };
    comments: number;
    shares: number;
    views: number;
    bookmarks: number;
  };
  userInteractions: {
    reactions: string[];
    isBookmarked: boolean;
    isShared: boolean;
  };
  visibility: {
    type: 'public' | 'followers' | 'private' | 'group';
    groupId?: mongoose.Types.ObjectId;
    allowedRoles?: string[];
  };
  boost: {
    isBoosted: boolean;
    boostType?: 'paid' | 'featured' | 'sponsored';
    boostDuration?: Date;
    boostTarget?: {
      demographics?: string[];
      locations?: string[];
      interests?: string[];
    };
  };
  tags: string[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
    venue?: string;
  };
  groupId?: mongoose.Types.ObjectId;
  eventId?: mongoose.Types.ObjectId;
  isStory: boolean;
  storyExpiresAt?: Date;
  isReel: boolean;
  reelData?: {
    music?: string;
    effects?: string[];
    duration: number;
    originalPostId?: mongoose.Types.ObjectId;
  };
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

const EnhancedPostSchema = new Schema<IEnhancedPost>({
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'audio', 'document'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    thumbnail: String,
    metadata: {
      duration: Number,
      size: Number,
      format: String,
      dimensions: {
        width: Number,
        height: Number
      }
    }
  }],
  author: {
    type: {
      type: String,
      enum: ['user', 'vendor', 'admin', 'wedding_planner'],
      required: true
    },
    id: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'author.type'
    },
    name: {
      type: String,
      required: true
    },
    avatar: String,
    verified: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      required: true
    }
  },
  engagement: {
    reactions: {
      like: { type: Number, default: 0 },
      love: { type: Number, default: 0 },
      wow: { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
      angry: { type: Number, default: 0 },
      sad: { type: Number, default: 0 }
    },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 }
  },
  userInteractions: {
    reactions: [String],
    isBookmarked: { type: Boolean, default: false },
    isShared: { type: Boolean, default: false }
  },
  visibility: {
    type: {
      type: String,
      enum: ['public', 'followers', 'private', 'group'],
      default: 'public'
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group'
    },
    allowedRoles: [String]
  },
  boost: {
    isBoosted: { type: Boolean, default: false },
    boostType: {
      type: String,
      enum: ['paid', 'featured', 'sponsored']
    },
    boostDuration: Date,
    boostTarget: {
      demographics: [String],
      locations: [String],
      interests: [String]
    }
  },
  tags: [String],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    },
    address: String,
    venue: String
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  },
  isStory: {
    type: Boolean,
    default: false
  },
  storyExpiresAt: Date,
  isReel: {
    type: Boolean,
    default: false
  },
  reelData: {
    music: String,
    effects: [String],
    duration: Number,
    originalPostId: {
      type: Schema.Types.ObjectId,
      ref: 'EnhancedPost'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
EnhancedPostSchema.index({ 'author.id': 1, createdAt: -1 });
EnhancedPostSchema.index({ 'author.type': 1, createdAt: -1 });
EnhancedPostSchema.index({ tags: 1 });
EnhancedPostSchema.index({ 'location.coordinates': '2dsphere' });
EnhancedPostSchema.index({ isStory: 1, storyExpiresAt: 1 });
EnhancedPostSchema.index({ isReel: 1, createdAt: -1 });
EnhancedPostSchema.index({ 'boost.isBoosted': 1, 'boost.boostDuration': 1 });
EnhancedPostSchema.index({ groupId: 1, createdAt: -1 });
EnhancedPostSchema.index({ eventId: 1, createdAt: -1 });
EnhancedPostSchema.index({ isActive: 1, createdAt: -1 });

// Text search index
EnhancedPostSchema.index({
  content: 'text',
  tags: 'text',
  'author.name': 'text'
});

// Auto-update updatedAt
EnhancedPostSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Auto-delete expired stories
EnhancedPostSchema.pre('find', function() {
  if (this.getQuery().isStory) {
    this.where({ storyExpiresAt: { $gt: new Date() } });
  }
});

export default mongoose.models.EnhancedPost || mongoose.model<IEnhancedPost>('EnhancedPost', EnhancedPostSchema);
