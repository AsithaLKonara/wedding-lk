import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmark extends Document {
  // User Information
  userId: mongoose.Types.ObjectId;
  
  // Content Information
  contentType: 'post' | 'story' | 'reel' | 'vendor' | 'venue' | 'service' | 'portfolio' | 'review' | 'article' | 'event';
  contentId: mongoose.Types.ObjectId;
  
  // Bookmark Details
  bookmarkType: 'personal' | 'shared' | 'collaborative';
  category?: string; // User-defined category
  tags?: string[]; // User-defined tags
  
  // Bookmark Content
  bookmarkData: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    excerpt?: string; // For articles/posts
    price?: number; // For services/vendors
    location?: string; // For venues/vendors
    rating?: number; // For reviews/services
  };
  
  // Organization
  collections: mongoose.Types.ObjectId[]; // Bookmark collections this belongs to
  
  // Notes
  notes?: string; // User's personal notes
  reminder?: {
    enabled: boolean;
    date?: Date;
    message?: string;
  };
  
  // Privacy
  privacy: {
    isPublic: boolean;
    sharedWith: mongoose.Types.ObjectId[]; // Users this bookmark is shared with
    allowComments: boolean;
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
    source?: string; // Where the bookmark was created from
  };
  
  // Status
  status: 'active' | 'archived' | 'deleted';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  contentType: {
    type: String,
    enum: ['post', 'story', 'reel', 'vendor', 'venue', 'service', 'portfolio', 'review', 'article', 'event'],
    required: true
  },
  contentId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  
  bookmarkType: {
    type: String,
    enum: ['personal', 'shared', 'collaborative'],
    default: 'personal'
  },
  category: String,
  tags: [String],
  
  bookmarkData: {
    title: String,
    description: String,
    image: String,
    url: String,
    excerpt: String,
    price: Number,
    location: String,
    rating: Number
  },
  
  collections: [{
    type: Schema.Types.ObjectId,
    ref: 'BookmarkCollection'
  }],
  
  notes: String,
  reminder: {
    enabled: { type: Boolean, default: false },
    date: Date,
    message: String
  },
  
  privacy: {
    isPublic: { type: Boolean, default: false },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    allowComments: { type: Boolean, default: false }
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
    },
    source: String
  },
  
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
BookmarkSchema.index({ userId: 1 });
BookmarkSchema.index({ contentType: 1, contentId: 1 });
BookmarkSchema.index({ bookmarkType: 1 });
BookmarkSchema.index({ category: 1 });
BookmarkSchema.index({ status: 1 });
BookmarkSchema.index({ createdAt: -1 });
BookmarkSchema.index({ 'privacy.isPublic': 1 });
BookmarkSchema.index({ 'reminder.enabled': 1, 'reminder.date': 1 });

// Compound indexes
BookmarkSchema.index({ userId: 1, contentType: 1 });
BookmarkSchema.index({ userId: 1, category: 1 });
BookmarkSchema.index({ userId: 1, status: 1 });
BookmarkSchema.index({ contentType: 1, contentId: 1, userId: 1 }, { unique: true }); // Prevent duplicate bookmarks
BookmarkSchema.index({ userId: 1, 'privacy.isPublic': 1 });
BookmarkSchema.index({ 'collections': 1 });

// Text search index
BookmarkSchema.index({
  'bookmarkData.title': 'text',
  'bookmarkData.description': 'text',
  'bookmarkData.excerpt': 'text',
  'notes': 'text',
  'tags': 'text'
});

// Instance methods
BookmarkSchema.methods.addToCollection = function(collectionId: string) {
  if (!this.collections.includes(collectionId)) {
    this.collections.push(collectionId);
  }
  return this.save();
};

BookmarkSchema.methods.removeFromCollection = function(collectionId: string) {
  this.collections = this.collections.filter(id => id.toString() !== collectionId);
  return this.save();
};

BookmarkSchema.methods.setReminder = function(date: Date, message?: string) {
  this.reminder = {
    enabled: true,
    date,
    message
  };
  return this.save();
};

BookmarkSchema.methods.removeReminder = function() {
  this.reminder = {
    enabled: false
  };
  return this.save();
};

BookmarkSchema.methods.shareWith = function(userIds: string[]) {
  this.privacy.sharedWith = [...new Set([...this.privacy.sharedWith, ...userIds])];
  this.bookmarkType = 'shared';
  return this.save();
};

BookmarkSchema.methods.unshareWith = function(userId: string) {
  this.privacy.sharedWith = this.privacy.sharedWith.filter(id => id.toString() !== userId);
  if (this.privacy.sharedWith.length === 0) {
    this.bookmarkType = 'personal';
  }
  return this.save();
};

BookmarkSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

BookmarkSchema.methods.unarchive = function() {
  this.status = 'active';
  return this.save();
};

BookmarkSchema.methods.delete = function() {
  this.status = 'deleted';
  return this.save();
};

BookmarkSchema.methods.addTag = function(tag: string) {
  if (!this.tags.includes(tag)) {
    this.tags.push(tag);
  }
  return this.save();
};

BookmarkSchema.methods.removeTag = function(tag: string) {
  this.tags = this.tags.filter(t => t !== tag);
  return this.save();
};

// Static methods
BookmarkSchema.statics.getUserBookmarks = function(userId: string, options: any = {}) {
  const query: any = { userId, status: 'active' };
  
  if (options.contentType) {
    query.contentType = options.contentType;
  }
  
  if (options.category) {
    query.category = options.category;
  }
  
  if (options.tags && options.tags.length > 0) {
    query.tags = { $in: options.tags };
  }
  
  return this.find(query)
    .populate('contentId')
    .sort({ createdAt: -1 })
    .limit(options.limit || 20)
    .skip(options.skip || 0);
};

BookmarkSchema.statics.getBookmarksByCollection = function(collectionId: string) {
  return this.find({
    collections: collectionId,
    status: 'active'
  }).populate('contentId').sort({ createdAt: -1 });
};

BookmarkSchema.statics.getPublicBookmarks = function(options: any = {}) {
  const query: any = { 
    'privacy.isPublic': true, 
    status: 'active' 
  };
  
  if (options.contentType) {
    query.contentType = options.contentType;
  }
  
  if (options.category) {
    query.category = options.category;
  }
  
  return this.find(query)
    .populate('userId', 'name avatar')
    .populate('contentId')
    .sort({ createdAt: -1 })
    .limit(options.limit || 20)
    .skip(options.skip || 0);
};

BookmarkSchema.statics.getSharedBookmarks = function(userId: string) {
  return this.find({
    'privacy.sharedWith': userId,
    status: 'active'
  }).populate('userId', 'name avatar').populate('contentId').sort({ createdAt: -1 });
};

BookmarkSchema.statics.getBookmarksWithReminders = function(userId: string) {
  return this.find({
    userId,
    'reminder.enabled': true,
    'reminder.date': { $lte: new Date() },
    status: 'active'
  }).populate('contentId');
};

BookmarkSchema.statics.getBookmarkStats = function(userId: string) {
  return this.aggregate([
    { $match: { userId, status: 'active' } },
    {
      $group: {
        _id: '$contentType',
        count: { $sum: 1 }
      }
    }
  ]);
};

BookmarkSchema.statics.searchBookmarks = function(userId: string, searchTerm: string) {
  return this.find({
    userId,
    status: 'active',
    $text: { $search: searchTerm }
  }).populate('contentId').sort({ score: { $meta: 'textScore' } });
};

BookmarkSchema.statics.getTrendingBookmarks = function(limit: number = 10) {
  return this.aggregate([
    { $match: { 'privacy.isPublic': true, status: 'active' } },
    {
      $group: {
        _id: { contentType: '$contentType', contentId: '$contentId' },
        bookmarkCount: { $sum: 1 },
        categories: { $addToSet: '$category' },
        tags: { $addToSet: '$tags' }
      }
    },
    { $sort: { bookmarkCount: -1 } },
    { $limit: limit }
  ]);
};

export const Bookmark = mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);
