import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  content: string;
  images: string[];
  tags: string[];
  author: {
    type: 'user' | 'vendor' | 'venue' | 'planner';
    id: mongoose.Types.ObjectId;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  location?: {
    city: string;
    venue?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  userInteractions: {
    likedBy: mongoose.Types.ObjectId[];
    bookmarkedBy: mongoose.Types.ObjectId[];
    sharedBy: mongoose.Types.ObjectId[];
  };
  status: 'active' | 'inactive' | 'deleted';
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  content: {
    type: String,
    required: [true, 'Post content is required'],
    maxlength: [2000, 'Post content cannot exceed 2000 characters']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Invalid image URL format'
    }
  }],
  tags: [{
    type: String,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  author: {
    type: {
      type: String,
      required: true,
      enum: ['user', 'vendor', 'venue', 'planner']
    },
    id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    avatar: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  location: {
    city: {
      type: String,
      maxlength: [100, 'City name cannot exceed 100 characters']
    },
    venue: {
      type: String,
      maxlength: [200, 'Venue name cannot exceed 200 characters']
    },
    coordinates: {
      lat: {
        type: Number,
        min: -90,
        max: 90
      },
      lng: {
        type: Number,
        min: -180,
        max: 180
      }
    }
  },
  engagement: {
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    comments: {
      type: Number,
      default: 0,
      min: 0
    },
    shares: {
      type: Number,
      default: 0,
      min: 0
    },
    views: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  userInteractions: {
    likedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    bookmarkedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    sharedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deleted'],
    default: 'active'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
PostSchema.index({ 'author.id': 1, createdAt: -1 });
PostSchema.index({ 'location.city': 1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ status: 1, isActive: 1 });
PostSchema.index({ 'engagement.likes': -1 });
PostSchema.index({ createdAt: -1 });

// Virtual for time ago
PostSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - this.createdAt.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return this.createdAt.toLocaleDateString();
});

// Virtual for formatted date
PostSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Method to update engagement
PostSchema.methods.updateEngagement = function() {
  if (this.engagement.likes < 0) this.engagement.likes = 0;
  if (this.engagement.comments < 0) this.engagement.comments = 0;
  if (this.engagement.shares < 0) this.engagement.shares = 0;
  if (this.engagement.views < 0) this.engagement.views = 0;
  return this.save();
};

// Method to add like
PostSchema.methods.addLike = function(userId: mongoose.Types.ObjectId) {
  if (!this.userInteractions.likedBy.includes(userId)) {
    this.userInteractions.likedBy.push(userId);
    this.engagement.likes += 1;
  }
  return this.save();
};

// Method to remove like
PostSchema.methods.removeLike = function(userId: mongoose.Types.ObjectId) {
  const index = this.userInteractions.likedBy.indexOf(userId);
  if (index > -1) {
    this.userInteractions.likedBy.splice(index, 1);
    this.engagement.likes = Math.max(0, this.engagement.likes - 1);
  }
  return this.save();
};

// Method to add bookmark
PostSchema.methods.addBookmark = function(userId: mongoose.Types.ObjectId) {
  if (!this.userInteractions.bookmarkedBy.includes(userId)) {
    this.userInteractions.bookmarkedBy.push(userId);
  }
  return this.save();
};

// Method to remove bookmark
PostSchema.methods.removeBookmark = function(userId: mongoose.Types.ObjectId) {
  const index = this.userInteractions.bookmarkedBy.indexOf(userId);
  if (index > -1) {
    this.userInteractions.bookmarkedBy.splice(index, 1);
  }
  return this.save();
};

// Method to add share
PostSchema.methods.addShare = function(userId: mongoose.Types.ObjectId) {
  if (!this.userInteractions.sharedBy.includes(userId)) {
    this.userInteractions.sharedBy.push(userId);
    this.engagement.shares += 1;
  }
  return this.save();
};

// Method to increment views
PostSchema.methods.incrementViews = function() {
  this.engagement.views += 1;
  return this.save();
};

// Static method to get trending posts
PostSchema.statics.getTrending = function(limit = 10) {
  return this.find({ status: 'active', isActive: true })
    .sort({ 'engagement.likes': -1, 'engagement.views': -1, createdAt: -1 })
    .limit(limit)
    .populate('author.id', 'name avatar verified')
    .lean();
};

// Static method to get posts by location
PostSchema.statics.getByLocation = function(city: string, limit = 20) {
  return this.find({ 
    'location.city': new RegExp(city, 'i'), 
    status: 'active', 
    isActive: true 
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('author.id', 'name avatar verified')
    .lean();
};

// Static method to get posts by tags
PostSchema.statics.getByTags = function(tags: string[], limit = 20) {
  return this.find({ 
    tags: { $in: tags }, 
    status: 'active', 
    isActive: true 
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('author.id', 'name avatar verified')
    .lean();
};

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);