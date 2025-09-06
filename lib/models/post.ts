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
      required: true,
      refPath: 'author.type'
    },
    name: {
      type: String,
      required: true,
      maxlength: [100, 'Author name cannot exceed 100 characters']
    },
    avatar: {
      type: String,
      validate: {
        validator: function(v: string) {
          return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: 'Invalid avatar URL format'
      }
    },
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

// Indexes for performance
PostSchema.index({ 'author.type': 1, 'author.id': 1 });
PostSchema.index({ status: 1, isActive: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ 'engagement.likes': -1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ 'location.city': 1 });

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

// Pre-save middleware
PostSchema.pre('save', function(next) {
  // Ensure engagement numbers are not negative
  if (this.engagement.likes < 0) this.engagement.likes = 0;
  if (this.engagement.comments < 0) this.engagement.comments = 0;
  if (this.engagement.shares < 0) this.engagement.shares = 0;
  if (this.engagement.views < 0) this.engagement.views = 0;
  
  next();
});

// Static methods
PostSchema.statics.findByAuthor = function(authorType: string, authorId: string) {
  return this.find({ 
    'author.type': authorType, 
    'author.id': authorId,
    status: 'active',
    isActive: true 
  }).sort({ createdAt: -1 });
};

PostSchema.statics.findTrending = function(limit: number = 10) {
  return this.find({ 
    status: 'active', 
    isActive: true 
  }).sort({ 
    'engagement.likes': -1, 
    'engagement.comments': -1, 
    createdAt: -1 
  }).limit(limit);
};

PostSchema.statics.findByLocation = function(city: string) {
  return this.find({ 
    'location.city': city,
    status: 'active',
    isActive: true 
  }).sort({ createdAt: -1 });
};

export const Post = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
export default Post;