import mongoose, { Schema, Document } from 'mongoose';

export interface IStory extends Document {
  author: {
    type: 'user' | 'vendor' | 'admin' | 'wedding_planner';
    id: mongoose.Types.ObjectId;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  content: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
    duration?: number;
    metadata?: {
      size: number;
      format: string;
      dimensions?: {
        width: number;
        height: number;
      };
    };
  };
  interactiveElements: {
    type: 'poll' | 'question' | 'quiz' | 'countdown' | 'sticker' | 'music';
    data: {
      question?: string;
      options?: string[];
      correctAnswer?: string;
      endTime?: Date;
      stickerType?: string;
      musicTrack?: string;
      position: {
        x: number;
        y: number;
      };
    };
    isActive: boolean;
  }[];
  views: {
    user: mongoose.Types.ObjectId;
    viewedAt: Date;
  }[];
  reactions: {
    user: mongoose.Types.ObjectId;
    type: 'like' | 'love' | 'wow' | 'laugh' | 'angry' | 'sad';
    reactedAt: Date;
  }[];
  interactions: {
    user: mongoose.Types.ObjectId;
    elementId: string;
    response: any;
    interactedAt: Date;
  }[];
  location?: {
    type: 'Point';
    coordinates: [number, number];
    address?: string;
    venue?: string;
  };
  tags: string[];
  groupId?: mongoose.Types.ObjectId;
  isHighlight: boolean;
  highlightTitle?: string;
  highlightCover?: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
}

const StorySchema = new Schema<IStory>({
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
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    thumbnail: String,
    duration: Number,
    metadata: {
      size: Number,
      format: String,
      dimensions: {
        width: Number,
        height: Number
      }
    }
  },
  interactiveElements: [{
    type: {
      type: String,
      enum: ['poll', 'question', 'quiz', 'countdown', 'sticker', 'music'],
      required: true
    },
    data: {
      question: String,
      options: [String],
      correctAnswer: String,
      endTime: Date,
      stickerType: String,
      musicTrack: String,
      position: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  views: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  reactions: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: ['like', 'love', 'wow', 'laugh', 'angry', 'sad'],
      required: true
    },
    reactedAt: {
      type: Date,
      default: Date.now
    }
  }],
  interactions: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    elementId: {
      type: String,
      required: true
    },
    response: Schema.Types.Mixed,
    interactedAt: {
      type: Date,
      default: Date.now
    }
  }],
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
  tags: [String],
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group'
  },
  isHighlight: {
    type: Boolean,
    default: false
  },
  highlightTitle: String,
  highlightCover: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
StorySchema.index({ 'author.id': 1, createdAt: -1 });
StorySchema.index({ 'author.type': 1, createdAt: -1 });
StorySchema.index({ expiresAt: 1 });
StorySchema.index({ isHighlight: 1, 'author.id': 1 });
StorySchema.index({ groupId: 1, createdAt: -1 });
StorySchema.index({ tags: 1 });
StorySchema.index({ 'location.coordinates': '2dsphere' });
StorySchema.index({ isActive: 1, expiresAt: 1 });

// Auto-delete expired stories
StorySchema.pre('find', function() {
  this.where({ expiresAt: { $gt: new Date() } });
});

// Auto-update expiresAt for new stories
StorySchema.pre('save', function(next) {
  if (this.isNew && !this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  }
  next();
});

export default mongoose.models.Story || mongoose.model<IStory>('Story', StorySchema);