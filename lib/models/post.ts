import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  // Basic Information
  content: string;
  images?: string[];
  tags?: string[];
  
  // Author Information
  author: {
    type: 'user' | 'vendor' | 'venue';
    id: mongoose.Types.ObjectId;
    name: string;
    avatar?: string;
    verified?: boolean;
  };
  
  // Location Information
  location?: {
    name: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Engagement Metrics
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  
  // User Interactions (for tracking)
  userInteractions: {
    likedBy: mongoose.Types.ObjectId[];
    bookmarkedBy: mongoose.Types.ObjectId[];
    sharedBy: mongoose.Types.ObjectId[];
  };
  
  // Post Status
  status: 'active' | 'hidden' | 'deleted';
  isActive: boolean;
  isVerified: boolean;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    images: [{
      type: String,
      validate: {
        validator: function(v: string) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: 'Invalid image URL'
      }
    }],
    tags: [{
      type: String,
      maxlength: 50
    }],
    
    // Author Information
    author: {
      type: {
        type: String,
        enum: ['user', 'vendor', 'venue'],
        required: true,
      },
      id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      avatar: String,
      verified: {
        type: Boolean,
        default: false,
      },
    },
    
    // Location Information
    location: {
      name: String,
      address: String,
      city: String,
      state: String,
      country: String,
      coordinates: {
        latitude: {
          type: Number,
          min: -90,
          max: 90,
        },
        longitude: {
          type: Number,
          min: -180,
          max: 180,
        },
      },
    },
    
    // Engagement Metrics
    engagement: {
      likes: {
        type: Number,
        default: 0,
        min: 0,
      },
      comments: {
        type: Number,
        default: 0,
        min: 0,
      },
      shares: {
        type: Number,
        default: 0,
        min: 0,
      },
      views: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    
    // User Interactions
    userInteractions: {
      likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      bookmarkedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      sharedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
    },
    
    // Post Status
    status: {
      type: String,
      enum: ['active', 'hidden', 'deleted'],
      default: 'active',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
PostSchema.index({ 'author.id': 1, createdAt: -1 });
PostSchema.index({ status: 1, isActive: 1, createdAt: -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ 'location.city': 1, 'location.state': 1 });
PostSchema.index({ 'engagement.likes': -1 });
PostSchema.index({ 'engagement.comments': -1 });

// Virtual for formatted date
PostSchema.virtual('formattedDate').get(function() {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - this.createdAt.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return this.createdAt.toLocaleDateString();
});

// Instance methods
PostSchema.methods.toggleLike = function(userId: mongoose.Types.ObjectId) {
  const isLiked = this.userInteractions.likedBy.includes(userId);
  
  if (isLiked) {
    this.userInteractions.likedBy.pull(userId);
    this.engagement.likes = Math.max(0, this.engagement.likes - 1);
  } else {
    this.userInteractions.likedBy.push(userId);
    this.engagement.likes += 1;
  }
  
  return !isLiked;
};

PostSchema.methods.toggleBookmark = function(userId: mongoose.Types.ObjectId) {
  const isBookmarked = this.userInteractions.bookmarkedBy.includes(userId);
  
  if (isBookmarked) {
    this.userInteractions.bookmarkedBy.pull(userId);
  } else {
    this.userInteractions.bookmarkedBy.push(userId);
  }
  
  return !isBookmarked;
};

PostSchema.methods.addShare = function(userId: mongoose.Types.ObjectId) {
  if (!this.userInteractions.sharedBy.includes(userId)) {
    this.userInteractions.sharedBy.push(userId);
    this.engagement.shares += 1;
  }
};

PostSchema.methods.incrementViews = function() {
  this.engagement.views += 1;
};

export const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
export default Post;
