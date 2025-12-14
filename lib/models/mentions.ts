import mongoose, { Schema, Document } from 'mongoose';

export interface IMention extends Document {
  // Content Information
  contentType: 'post' | 'story' | 'reel' | 'comment' | 'review' | 'message';
  contentId: mongoose.Types.ObjectId;
  
  // Mention Details
  mentionedUser: mongoose.Types.ObjectId; // User who was mentioned
  mentionedBy: mongoose.Types.ObjectId; // User who made the mention
  
  // Mention Context
  context: {
    text: string; // The text containing the mention
    position: number; // Position of mention in text
    length: number; // Length of mention text
    isNotificationSent: boolean;
    notificationSentAt?: Date;
  };
  
  // Content Details
  contentDetails: {
    title?: string;
    excerpt?: string;
    image?: string;
    url?: string;
  };
  
  // Status
  status: 'active' | 'deleted' | 'hidden';
  
  // Engagement
  engagement: {
    viewed: boolean;
    viewedAt?: Date;
    clicked: boolean;
    clickedAt?: Date;
    responded: boolean;
    respondedAt?: Date;
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
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const MentionSchema = new Schema<IMention>({
  contentType: {
    type: String,
    enum: ['post', 'story', 'reel', 'comment', 'review', 'message'],
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  
  mentionedUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentionedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  context: {
    text: { type: String, required: true },
    position: { type: Number, required: true },
    length: { type: Number, required: true },
    isNotificationSent: { type: Boolean, default: false },
    notificationSentAt: Date
  },
  
  contentDetails: {
    title: String,
    excerpt: String,
    image: String,
    url: String
  },
  
  status: {
    type: String,
    enum: ['active', 'deleted', 'hidden'],
    default: 'active'
  },
  
  engagement: {
    viewed: { type: Boolean, default: false },
    viewedAt: Date,
    clicked: { type: Boolean, default: false },
    clickedAt: Date,
    responded: { type: Boolean, default: false },
    respondedAt: Date
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
  timestamps: true
});

// Indexes
MentionSchema.index({ mentionedUser: 1 });
MentionSchema.index({ mentionedBy: 1 });
MentionSchema.index({ contentType: 1, contentId: 1 });
MentionSchema.index({ status: 1 });
MentionSchema.index({ createdAt: -1 });
MentionSchema.index({ 'engagement.viewed': 1 });
MentionSchema.index({ 'context.isNotificationSent': 1 });

// Compound indexes
MentionSchema.index({ mentionedUser: 1, status: 1 });
MentionSchema.index({ mentionedUser: 1, 'engagement.viewed': 1 });
MentionSchema.index({ contentType: 1, contentId: 1, mentionedUser: 1 });
MentionSchema.index({ mentionedBy: 1, createdAt: -1 });

// Instance methods
MentionSchema.methods.markAsViewed = function() {
  this.engagement.viewed = true;
  this.engagement.viewedAt = new Date();
  return this.save();
};

MentionSchema.methods.markAsClicked = function() {
  this.engagement.clicked = true;
  this.engagement.clickedAt = new Date();
  return this.save();
};

MentionSchema.methods.markAsResponded = function() {
  this.engagement.responded = true;
  this.engagement.respondedAt = new Date();
  return this.save();
};

MentionSchema.methods.sendNotification = function() {
  this.context.isNotificationSent = true;
  this.context.notificationSentAt = new Date();
  return this.save();
};

MentionSchema.methods.hide = function() {
  this.status = 'hidden';
  return this.save();
};

MentionSchema.methods.delete = function() {
  this.status = 'deleted';
  return this.save();
};

// Static methods
MentionSchema.statics.getUserMentions = function(userId: string, options: any = {}) {
  const query: any = { mentionedUser: userId, status: 'active' };
  
  if (options.contentType) {
    query.contentType = options.contentType;
  }
  
  if (options.unreadOnly) {
    query['engagement.viewed'] = false;
  }
  
  return this.find(query)
    .populate('mentionedBy', 'name avatar')
    .populate('contentId')
    .sort({ createdAt: -1 })
    .limit(options.limit || 20)
    .skip(options.skip || 0);
};

MentionSchema.statics.getMentionsByContent = function(contentType: string, contentId: string) {
  return this.find({
    contentType,
    contentId,
    status: 'active'
  }).populate('mentionedUser', 'name avatar').sort({ createdAt: -1 });
};

MentionSchema.statics.getUnreadMentionCount = function(userId: string) {
  return this.countDocuments({
    mentionedUser: userId,
    status: 'active',
    'engagement.viewed': false
  });
};

MentionSchema.statics.markAllAsRead = function(userId: string) {
  return this.updateMany(
    {
      mentionedUser: userId,
      status: 'active',
      'engagement.viewed': false
    },
    {
      $set: {
        'engagement.viewed': true,
        'engagement.viewedAt': new Date()
      }
    }
  );
};

MentionSchema.statics.getMentionStats = function(userId: string) {
  return this.aggregate([
    { $match: { mentionedUser: userId, status: 'active' } },
    {
      $group: {
        _id: '$contentType',
        totalMentions: { $sum: 1 },
        viewedMentions: {
          $sum: { $cond: ['$engagement.viewed', 1, 0] }
        },
        clickedMentions: {
          $sum: { $cond: ['$engagement.clicked', 1, 0] }
        },
        respondedMentions: {
          $sum: { $cond: ['$engagement.responded', 1, 0] }
        }
      }
    }
  ]);
};

MentionSchema.statics.extractMentions = function(text: string) {
  const mentionRegex = /@(\w+)/g;
  const mentions = [];
  let match;
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({
      username: match[1],
      position: match.index,
      length: match[0].length
    });
  }
  
  return mentions;
};

export const Mention = mongoose.models.Mention || mongoose.model('Mention', MentionSchema);
