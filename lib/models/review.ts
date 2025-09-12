import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  // Basic Information
  vendorId: mongoose.Types.ObjectId;
  venueId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  
  // Rating Details
  overallRating: number; // 1-5 stars
  categoryRatings: {
    service: number;
    quality: number;
    value: number;
    communication: number;
    timeliness: number;
  };
  
  // Review Content
  title: string;
  comment: string;
  pros: string[];
  cons: string[];
  
  // Media
  images: string[];
  videos: string[];
  
  // Verification
  isVerified: boolean;
  verifiedAt?: Date;
  isAnonymous: boolean;
  
  // Engagement
  helpful: mongoose.Types.ObjectId[];
  notHelpful: mongoose.Types.ObjectId[];
  reportCount: number;
  
  // Response
  vendorResponse?: {
    comment: string;
    respondedAt: Date;
    respondedBy: mongoose.Types.ObjectId;
  };
  
  // Moderation
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderationNotes?: string;
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema({
  // Basic Information
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true,
    index: true
  },
  venueId: {
    type: Schema.Types.ObjectId,
    ref: 'Venue',
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    index: true
  },
  
  // Rating Details
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    index: true
  },
  categoryRatings: {
    service: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    quality: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    value: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    timeliness: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    }
  },
  
  // Review Content
  title: {
    type: String,
    required: true,
    maxlength: 100,
    trim: true
  },
  comment: {
    type: String,
    required: true,
    maxlength: 2000,
    trim: true
  },
  pros: [{
    type: String,
    maxlength: 200,
    trim: true
  }],
  cons: [{
    type: String,
    maxlength: 200,
    trim: true
  }],
  
  // Media
  images: [{
    type: String,
    validate: {
      validator: function(v: string[]) {
        return v.length <= 10; // Max 10 images per review
      },
      message: 'Maximum 10 images allowed per review'
    }
  }],
  videos: [{
    type: String,
    validate: {
      validator: function(v: string[]) {
        return v.length <= 3; // Max 3 videos per review
      },
      message: 'Maximum 3 videos allowed per review'
    }
  }],
  
  // Verification
  isVerified: {
    type: Boolean,
    default: false,
    index: true
  },
  verifiedAt: {
    type: Date
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  
  // Engagement
  helpful: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  notHelpful: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  reportCount: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Response
  vendorResponse: {
    comment: {
      type: String,
      maxlength: 1000,
      trim: true
    },
    respondedAt: {
      type: Date
    },
    respondedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Moderation
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending',
    index: true
  },
  moderationNotes: {
    type: String,
    maxlength: 500
  },
  moderatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
ReviewSchema.index({ vendorId: 1, status: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ overallRating: 1, status: 1 });
ReviewSchema.index({ isVerified: 1, status: 1 });

// Prevent duplicate reviews from same user for same vendor
ReviewSchema.index({ vendorId: 1, userId: 1 }, { unique: true });

// Virtual for average category rating
ReviewSchema.virtual('averageCategoryRating').get(function() {
  const ratings = this.categoryRatings;
  return (ratings.service + ratings.quality + ratings.value + ratings.communication + ratings.timeliness) / 5;
});

// Virtual for helpful score
ReviewSchema.virtual('helpfulScore').get(function() {
  const total = this.helpful.length + this.notHelpful.length;
  return total > 0 ? (this.helpful.length / total) * 100 : 0;
});

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema); 