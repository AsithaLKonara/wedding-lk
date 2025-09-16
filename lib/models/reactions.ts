import mongoose, { Schema, Document } from 'mongoose';

export interface IReaction extends Document {
  // Content Information
  contentType: 'post' | 'story' | 'reel' | 'comment' | 'review';
  contentId: mongoose.Types.ObjectId;
  
  // User Information
  userId: mongoose.Types.ObjectId;
  
  // Reaction Details
  reactionType: 'like' | 'love' | 'wow' | 'laugh' | 'angry' | 'sad' | 'bookmark' | 'share';
  
  // Additional Information
  metadata?: {
    deviceType?: 'mobile' | 'desktop' | 'tablet';
    userAgent?: string;
    ipAddress?: string;
    location?: {
      city?: string;
      state?: string;
      country?: string;
    };
  };
  
  // Timestamp
  createdAt: Date;
}

const ReactionSchema = new Schema<IReaction>({
  contentType: {
    type: String,
    enum: ['post', 'story', 'reel', 'comment', 'review'],
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  reactionType: {
    type: String,
    enum: ['like', 'love', 'wow', 'laugh', 'angry', 'sad', 'bookmark', 'share'],
    required: true
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
    }
  }
}, {
  timestamps: { createdAt: true, updatedAt: false }
});

// Indexes
ReactionSchema.index({ contentType: 1, contentId: 1 });
ReactionSchema.index({ userId: 1 });
ReactionSchema.index({ reactionType: 1 });
ReactionSchema.index({ createdAt: -1 });

// Compound indexes for common queries
ReactionSchema.index({ contentType: 1, contentId: 1, userId: 1 }, { unique: true });
ReactionSchema.index({ contentType: 1, contentId: 1, reactionType: 1 });
ReactionSchema.index({ userId: 1, reactionType: 1 });
ReactionSchema.index({ userId: 1, contentType: 1 });

// Text index for search
ReactionSchema.index({ 'metadata.location.city': 'text', 'metadata.location.state': 'text' });

export const Reaction = mongoose.models.Reaction || mongoose.model('Reaction', ReactionSchema);
