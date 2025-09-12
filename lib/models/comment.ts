import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  author: {
    type: 'user' | 'vendor' | 'admin' | 'wedding_planner';
    id: mongoose.Types.ObjectId;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  content: string;
  parentComment?: mongoose.Types.ObjectId; // For replies
  replies: mongoose.Types.ObjectId[];
  likes: {
    user: mongoose.Types.ObjectId;
    likedAt: Date;
  }[];
  dislikes: {
    user: mongoose.Types.ObjectId;
    dislikedAt: Date;
  }[];
  mentions: {
    user: mongoose.Types.ObjectId;
    username: string;
  }[];
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: mongoose.Types.ObjectId;
  moderation: {
    isReported: boolean;
    reportCount: number;
    reportedBy: mongoose.Types.ObjectId[];
    isApproved: boolean;
    moderatedBy?: mongoose.Types.ObjectId;
    moderatedAt?: Date;
    moderationReason?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const CommentSchema = new Schema<IComment>({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'EnhancedPost',
    required: true
  },
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
    }
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  parentComment: {
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  },
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    likedAt: {
      type: Date,
      default: Date.now
    }
  }],
  dislikes: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    dislikedAt: {
      type: Date,
      default: Date.now
    }
  }],
  mentions: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  moderation: {
    isReported: {
      type: Boolean,
      default: false
    },
    reportCount: {
      type: Number,
      default: 0
    },
    reportedBy: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    isApproved: {
      type: Boolean,
      default: true
    },
    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date,
    moderationReason: String
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
CommentSchema.index({ postId: 1, createdAt: -1 });
CommentSchema.index({ 'author.id': 1, createdAt: -1 });
CommentSchema.index({ parentComment: 1, createdAt: 1 });
CommentSchema.index({ 'likes.user': 1 });
CommentSchema.index({ 'mentions.user': 1 });
CommentSchema.index({ isDeleted: 1, isActive: 1 });
CommentSchema.index({ 'moderation.isReported': 1 });

// Auto-update updatedAt
CommentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Soft delete
CommentSchema.pre('find', function() {
  this.where({ isDeleted: false, isActive: true });
});

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
