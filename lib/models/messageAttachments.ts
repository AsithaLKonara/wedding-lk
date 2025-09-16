import mongoose, { Schema, Document } from 'mongoose';

export interface IMessageAttachment extends Document {
  // Message Reference
  messageId: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  
  // Attachment Details
  attachmentType: 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact' | 'sticker' | 'gif';
  
  // File Information
  fileInfo: {
    originalName: string;
    fileName: string; // Stored filename
    filePath: string; // Path to file
    fileSize: number; // Size in bytes
    mimeType: string;
    fileExtension: string;
    checksum: string; // File integrity check
  };
  
  // Media Information (for images/videos/audio)
  mediaInfo?: {
    width?: number;
    height?: number;
    duration?: number; // For video/audio in seconds
    thumbnail?: string; // Path to thumbnail
    preview?: string; // Path to preview image
    format?: string; // Video/audio format
    bitrate?: number;
    fps?: number; // For videos
    channels?: number; // For audio
    sampleRate?: number; // For audio
  };
  
  // Document Information (for documents)
  documentInfo?: {
    title?: string;
    description?: string;
    author?: string;
    pages?: number;
    language?: string;
    isScanned?: boolean;
    ocrText?: string; // Extracted text from scanned documents
  };
  
  // Location Information (for location attachments)
  locationInfo?: {
    latitude: number;
    longitude: number;
    address?: string;
    placeName?: string;
    accuracy?: number; // Location accuracy in meters
  };
  
  // Contact Information (for contact attachments)
  contactInfo?: {
    name: string;
    phone?: string;
    email?: string;
    organization?: string;
    address?: string;
    notes?: string;
  };
  
  // Upload Information
  uploadInfo: {
    uploadedBy: mongoose.Types.ObjectId;
    uploadedAt: Date;
    uploadMethod: 'direct' | 'url' | 'cloud_storage';
    sourceUrl?: string; // If uploaded from URL
    cloudProvider?: 'cloudinary' | 'aws_s3' | 'google_cloud' | 'azure';
    cloudId?: string; // Cloud storage ID
  };
  
  // Processing Status
  processing: {
    status: 'pending' | 'processing' | 'completed' | 'failed';
    progress: number; // 0-100
    errorMessage?: string;
    processedAt?: Date;
    thumbnailGenerated?: boolean;
    previewGenerated?: boolean;
    virusScanned?: boolean;
    virusScanResult?: 'clean' | 'infected' | 'suspicious';
  };
  
  // Access Control
  access: {
    isPublic: boolean;
    accessToken?: string; // For secure access
    expiresAt?: Date; // Token expiration
    downloadCount: number;
    lastDownloaded?: Date;
    allowedUsers?: mongoose.Types.ObjectId[]; // Specific users who can access
  };
  
  // Security
  security: {
    isEncrypted: boolean;
    encryptionKey?: string; // Encrypted encryption key
    isModerated: boolean;
    moderationStatus?: 'pending' | 'approved' | 'rejected';
    moderationReason?: string;
    moderatedBy?: mongoose.Types.ObjectId;
    moderatedAt?: Date;
  };
  
  // Analytics
  analytics: {
    views: number;
    downloads: number;
    shares: number;
    lastViewed?: Date;
    lastShared?: Date;
  };
  
  // Status
  status: 'active' | 'deleted' | 'archived' | 'quarantined';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const MessageAttachmentSchema = new Schema<IMessageAttachment>({
  messageId: {
    type: Schema.Types.ObjectId,
    ref: 'Message',
    required: true
  },
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  
  attachmentType: {
    type: String,
    enum: ['image', 'video', 'audio', 'document', 'location', 'contact', 'sticker', 'gif'],
    required: true
  },
  
  fileInfo: {
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    fileExtension: { type: String, required: true },
    checksum: { type: String, required: true }
  },
  
  mediaInfo: {
    width: Number,
    height: Number,
    duration: Number,
    thumbnail: String,
    preview: String,
    format: String,
    bitrate: Number,
    fps: Number,
    channels: Number,
    sampleRate: Number
  },
  
  documentInfo: {
    title: String,
    description: String,
    author: String,
    pages: Number,
    language: String,
    isScanned: { type: Boolean, default: false },
    ocrText: String
  },
  
  locationInfo: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: String,
    placeName: String,
    accuracy: Number
  },
  
  contactInfo: {
    name: { type: String, required: true },
    phone: String,
    email: String,
    organization: String,
    address: String,
    notes: String
  },
  
  uploadInfo: {
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    uploadedAt: { type: Date, default: Date.now },
    uploadMethod: {
      type: String,
      enum: ['direct', 'url', 'cloud_storage'],
      default: 'direct'
    },
    sourceUrl: String,
    cloudProvider: {
      type: String,
      enum: ['cloudinary', 'aws_s3', 'google_cloud', 'azure']
    },
    cloudId: String
  },
  
  processing: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    errorMessage: String,
    processedAt: Date,
    thumbnailGenerated: { type: Boolean, default: false },
    previewGenerated: { type: Boolean, default: false },
    virusScanned: { type: Boolean, default: false },
    virusScanResult: {
      type: String,
      enum: ['clean', 'infected', 'suspicious']
    }
  },
  
  access: {
    isPublic: { type: Boolean, default: false },
    accessToken: String,
    expiresAt: Date,
    downloadCount: { type: Number, default: 0 },
    lastDownloaded: Date,
    allowedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  
  security: {
    isEncrypted: { type: Boolean, default: false },
    encryptionKey: String,
    isModerated: { type: Boolean, default: false },
    moderationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected']
    },
    moderationReason: String,
    moderatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    moderatedAt: Date
  },
  
  analytics: {
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    lastViewed: Date,
    lastShared: Date
  },
  
  status: {
    type: String,
    enum: ['active', 'deleted', 'archived', 'quarantined'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes
MessageAttachmentSchema.index({ messageId: 1 });
MessageAttachmentSchema.index({ conversationId: 1 });
MessageAttachmentSchema.index({ attachmentType: 1 });
MessageAttachmentSchema.index({ 'uploadInfo.uploadedBy': 1 });
MessageAttachmentSchema.index({ 'processing.status': 1 });
MessageAttachmentSchema.index({ 'security.moderationStatus': 1 });
MessageAttachmentSchema.index({ status: 1 });
MessageAttachmentSchema.index({ createdAt: -1 });
MessageAttachmentSchema.index({ 'access.expiresAt': 1 }, { expireAfterSeconds: 0 }); // TTL index

// Compound indexes
MessageAttachmentSchema.index({ conversationId: 1, attachmentType: 1 });
MessageAttachmentSchema.index({ 'uploadInfo.uploadedBy': 1, status: 1 });
MessageAttachmentSchema.index({ 'processing.status': 1, createdAt: -1 });
MessageAttachmentSchema.index({ 'security.isModerated': 1, 'security.moderationStatus': 1 });

// Text search index
MessageAttachmentSchema.index({
  'fileInfo.originalName': 'text',
  'documentInfo.title': 'text',
  'documentInfo.description': 'text',
  'documentInfo.ocrText': 'text',
  'contactInfo.name': 'text',
  'contactInfo.organization': 'text'
});

// Instance methods
MessageAttachmentSchema.methods.updateProcessingStatus = function(status: string, progress?: number, errorMessage?: string) {
  this.processing.status = status;
  
  if (progress !== undefined) {
    this.processing.progress = progress;
  }
  
  if (errorMessage) {
    this.processing.errorMessage = errorMessage;
  }
  
  if (status === 'completed') {
    this.processing.processedAt = new Date();
    this.processing.progress = 100;
  }
  
  return this.save();
};

MessageAttachmentSchema.methods.generateThumbnail = function(thumbnailPath: string) {
  this.processing.thumbnailGenerated = true;
  this.mediaInfo.thumbnail = thumbnailPath;
  return this.save();
};

MessageAttachmentSchema.methods.generatePreview = function(previewPath: string) {
  this.processing.previewGenerated = true;
  this.mediaInfo.preview = previewPath;
  return this.save();
};

MessageAttachmentSchema.methods.scanForVirus = function(result: string) {
  this.processing.virusScanned = true;
  this.processing.virusScanResult = result;
  
  if (result === 'infected') {
    this.status = 'quarantined';
  }
  
  return this.save();
};

MessageAttachmentSchema.methods.incrementView = function() {
  this.analytics.views += 1;
  this.analytics.lastViewed = new Date();
  return this.save();
};

MessageAttachmentSchema.methods.incrementDownload = function() {
  this.analytics.downloads += 1;
  this.access.downloadCount += 1;
  this.access.lastDownloaded = new Date();
  return this.save();
};

MessageAttachmentSchema.methods.incrementShare = function() {
  this.analytics.shares += 1;
  this.analytics.lastShared = new Date();
  return this.save();
};

MessageAttachmentSchema.methods.moderate = function(status: string, reason: string, moderatedBy: string) {
  this.security.isModerated = true;
  this.security.moderationStatus = status;
  this.security.moderationReason = reason;
  this.security.moderatedBy = moderatedBy;
  this.security.moderatedAt = new Date();
  
  if (status === 'rejected') {
    this.status = 'quarantined';
  }
  
  return this.save();
};

MessageAttachmentSchema.methods.generateAccessToken = function(expiresInHours: number = 24) {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  this.access.accessToken = token;
  this.access.expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
  return this.save();
};

MessageAttachmentSchema.methods.revokeAccess = function() {
  this.access.accessToken = undefined;
  this.access.expiresAt = undefined;
  return this.save();
};

MessageAttachmentSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

MessageAttachmentSchema.methods.delete = function() {
  this.status = 'deleted';
  return this.save();
};

// Static methods
MessageAttachmentSchema.statics.getAttachmentsByMessage = function(messageId: string) {
  return this.find({
    messageId,
    status: 'active'
  }).sort({ createdAt: 1 });
};

MessageAttachmentSchema.statics.getAttachmentsByConversation = function(conversationId: string, attachmentType?: string) {
  const query: any = { conversationId, status: 'active' };
  
  if (attachmentType) {
    query.attachmentType = attachmentType;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

MessageAttachmentSchema.statics.getPendingProcessing = function() {
  return this.find({
    'processing.status': { $in: ['pending', 'processing'] },
    status: 'active'
  }).sort({ createdAt: 1 });
};

MessageAttachmentSchema.statics.getPendingModeration = function() {
  return this.find({
    'security.isModerated': false,
    status: 'active'
  }).sort({ createdAt: 1 });
};

MessageAttachmentSchema.statics.getExpiredAttachments = function() {
  return this.find({
    'access.expiresAt': { $lt: new Date() },
    status: 'active'
  });
};

MessageAttachmentSchema.statics.getAttachmentStats = function(userId: string) {
  return this.aggregate([
    { $match: { 'uploadInfo.uploadedBy': userId, status: 'active' } },
    {
      $group: {
        _id: '$attachmentType',
        count: { $sum: 1 },
        totalSize: { $sum: '$fileInfo.fileSize' },
        totalViews: { $sum: '$analytics.views' },
        totalDownloads: { $sum: '$analytics.downloads' }
      }
    }
  ]);
};

export const MessageAttachment = mongoose.models.MessageAttachment || mongoose.model('MessageAttachment', MessageAttachmentSchema);
