// Content Moderation Model
import mongoose, { Schema, Document } from 'mongoose';

export interface IModeration extends Document {
  contentId: mongoose.Types.ObjectId;
  contentType: 'post' | 'comment' | 'review' | 'story' | 'reel' | 'vendor' | 'venue';
  contentAuthor: {
    type: 'user' | 'vendor' | 'venue' | 'planner';
    id: mongoose.Types.ObjectId;
    name: string;
  };
  
  // Moderation details
  status: 'pending' | 'approved' | 'rejected' | 'flagged' | 'hidden' | 'deleted';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Report information
  reports: {
    reporterId: mongoose.Types.ObjectId;
    reporterType: 'user' | 'vendor' | 'admin' | 'system';
    reason: string;
    category: 'spam' | 'inappropriate' | 'harassment' | 'fake' | 'copyright' | 'violence' | 'other';
    description?: string;
    reportedAt: Date;
    severity: 'low' | 'medium' | 'high';
  }[];
  
  // AI moderation
  aiModeration: {
    confidence: number; // 0-100
    categories: {
      category: string;
      confidence: number;
      details?: string;
    }[];
    flags: {
      type: string;
      confidence: number;
      description: string;
    }[];
    processedAt: Date;
    model: string;
  };
  
  // Manual review
  review: {
    reviewerId: mongoose.Types.ObjectId;
    reviewedAt: Date;
    decision: 'approve' | 'reject' | 'flag' | 'hide' | 'delete';
    reason?: string;
    notes?: string;
    actions: {
      type: 'warn' | 'suspend' | 'ban' | 'remove_content' | 'hide_content';
      duration?: number; // days for temporary actions
      reason: string;
      appliedAt: Date;
    }[];
  };
  
  // Content analysis
  contentAnalysis: {
    textContent?: string;
    detectedLanguage?: string;
    sentiment?: 'positive' | 'negative' | 'neutral';
    keywords: string[];
    hashtags: string[];
    mentions: string[];
    links: string[];
    images?: {
      url: string;
      analysis: {
        safe: boolean;
        confidence: number;
        categories: string[];
      };
    }[];
    videos?: {
      url: string;
      analysis: {
        safe: boolean;
        confidence: number;
        categories: string[];
      };
    }[];
  };
  
  // Appeal process
  appeal?: {
    requestedBy: mongoose.Types.ObjectId;
    requestedAt: Date;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    reviewNotes?: string;
  };
  
  // History
  history: {
    action: string;
    performedBy: mongoose.Types.ObjectId;
    performedAt: Date;
    details: string;
    previousStatus?: string;
    newStatus?: string;
  }[];
  
  // Auto-moderation rules
  autoModeration: {
    rulesTriggered: string[];
    actionsTaken: string[];
    confidence: number;
    processedAt: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const ModerationSchema = new Schema<IModeration>({
  contentId: { 
    type: Schema.Types.ObjectId, 
    required: true,
    index: true 
  },
  contentType: { 
    type: String, 
    required: true, 
    enum: ['post', 'comment', 'review', 'story', 'reel', 'vendor', 'venue'],
    index: true
  },
  contentAuthor: {
    type: { 
      type: String, 
      required: true, 
      enum: ['user', 'vendor', 'venue', 'planner'] 
    },
    id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, maxlength: 100 }
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'flagged', 'hidden', 'deleted'],
    default: 'pending',
    index: true
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  
  reports: [{
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reporterType: { 
      type: String, 
      enum: ['user', 'vendor', 'admin', 'system'],
      required: true
    },
    reason: { type: String, required: true, maxlength: 200 },
    category: { 
      type: String, 
      enum: ['spam', 'inappropriate', 'harassment', 'fake', 'copyright', 'violence', 'other'],
      required: true
    },
    description: { type: String, maxlength: 1000 },
    reportedAt: { type: Date, required: true, default: Date.now },
    severity: { 
      type: String, 
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  
  aiModeration: {
    confidence: { type: Number, min: 0, max: 100 },
    categories: [{
      category: { type: String, required: true },
      confidence: { type: Number, required: true, min: 0, max: 100 },
      details: { type: String, maxlength: 500 }
    }],
    flags: [{
      type: { type: String, required: true },
      confidence: { type: Number, required: true, min: 0, max: 100 },
      description: { type: String, required: true, maxlength: 200 }
    }],
    processedAt: { type: Date, required: true },
    model: { type: String, required: true, maxlength: 100 }
  },
  
  review: {
    reviewerId: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    decision: { 
      type: String, 
      enum: ['approve', 'reject', 'flag', 'hide', 'delete'] 
    },
    reason: { type: String, maxlength: 500 },
    notes: { type: String, maxlength: 1000 },
    actions: [{
      type: { 
        type: String, 
        enum: ['warn', 'suspend', 'ban', 'remove_content', 'hide_content'],
        required: true
      },
      duration: { type: Number, min: 1 },
      reason: { type: String, required: true, maxlength: 200 },
      appliedAt: { type: Date, required: true }
    }]
  },
  
  contentAnalysis: {
    textContent: { type: String, maxlength: 10000 },
    detectedLanguage: { type: String, maxlength: 10 },
    sentiment: { 
      type: String, 
      enum: ['positive', 'negative', 'neutral'] 
    },
    keywords: [{ type: String, maxlength: 100 }],
    hashtags: [{ type: String, maxlength: 100 }],
    mentions: [{ type: String, maxlength: 100 }],
    links: [{ type: String, maxlength: 500 }],
    images: [{
      url: { type: String, required: true },
      analysis: {
        safe: { type: Boolean, required: true },
        confidence: { type: Number, required: true, min: 0, max: 100 },
        categories: [{ type: String, maxlength: 50 }]
      }
    }],
    videos: [{
      url: { type: String, required: true },
      analysis: {
        safe: { type: Boolean, required: true },
        confidence: { type: Number, required: true, min: 0, max: 100 },
        categories: [{ type: String, maxlength: 50 }]
      }
    }]
  },
  
  appeal: {
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requestedAt: { type: Date, required: true, default: Date.now },
    reason: { type: String, required: true, maxlength: 1000 },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    reviewNotes: { type: String, maxlength: 1000 }
  },
  
  history: [{
    action: { type: String, required: true, maxlength: 100 },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    performedAt: { type: Date, required: true, default: Date.now },
    details: { type: String, required: true, maxlength: 500 },
    previousStatus: { type: String, maxlength: 50 },
    newStatus: { type: String, maxlength: 50 }
  }],
  
  autoModeration: {
    rulesTriggered: [{ type: String, maxlength: 100 }],
    actionsTaken: [{ type: String, maxlength: 100 }],
    confidence: { type: Number, min: 0, max: 100 },
    processedAt: { type: Date, required: true }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
ModerationSchema.index({ contentId: 1, contentType: 1 });
ModerationSchema.index({ status: 1, priority: 1 });
ModerationSchema.index({ 'contentAuthor.id': 1, status: 1 });
ModerationSchema.index({ createdAt: -1 });
ModerationSchema.index({ 'reports.reportedAt': -1 });

// Pre-save middleware
ModerationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-assign priority based on reports
  if (this.reports.length > 0) {
    const highSeverityReports = this.reports.filter(r => r.severity === 'high').length;
    const mediumSeverityReports = this.reports.filter(r => r.severity === 'medium').length;
    
    if (highSeverityReports > 0 || this.reports.length >= 5) {
      this.priority = 'urgent';
    } else if (mediumSeverityReports > 0 || this.reports.length >= 3) {
      this.priority = 'high';
    } else if (this.reports.length >= 2) {
      this.priority = 'medium';
    } else {
      this.priority = 'low';
    }
  }
  
  next();
});

export default mongoose.models.Moderation || mongoose.model<IModeration>('Moderation', ModerationSchema);


