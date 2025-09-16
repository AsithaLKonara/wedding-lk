import mongoose, { Schema, Document } from 'mongoose';

export interface IVendorPortfolio extends Document {
  vendorId: mongoose.Types.ObjectId;
  
  // Portfolio Basic Information
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  
  // Project Details
  projectType: 'wedding' | 'corporate' | 'private_party' | 'other';
  eventDate: Date;
  clientName?: string; // Optional for privacy
  location: {
    venue: string;
    city: string;
    state: string;
    country: string;
  };
  
  // Portfolio Media
  media: {
    images: Array<{
      url: string;
      caption?: string;
      isPrimary: boolean;
      order: number;
      tags: string[];
      metadata?: {
        width: number;
        height: number;
        size: number;
        format: string;
      };
    }>;
    videos: Array<{
      url: string;
      thumbnail: string;
      caption?: string;
      duration: number;
      order: number;
      tags: string[];
    }>;
    beforeAfterImages?: Array<{
      beforeUrl: string;
      afterUrl: string;
      caption?: string;
      order: number;
    }>;
  };
  
  // Project Specifications
  specifications: {
    guestCount?: number;
    budget?: number;
    duration?: number; // in hours
    services: string[];
    themes: string[];
    colors: string[];
    specialRequirements: string[];
  };
  
  // Client Feedback
  clientFeedback?: {
    rating: number; // 1-5
    testimonial: string;
    clientName?: string; // Optional
    clientImage?: string;
    isPublic: boolean;
    approvedAt?: Date;
  };
  
  // Portfolio Settings
  settings: {
    isPublic: boolean;
    isFeatured: boolean;
    showClientName: boolean;
    showBudget: boolean;
    allowDownload: boolean;
    watermark: boolean;
  };
  
  // SEO & Discovery
  seo: {
    keywords: string[];
    metaDescription: string;
    slug: string;
  };
  
  // Analytics
  analytics: {
    views: number;
    likes: number;
    shares: number;
    downloads: number;
    inquiries: number;
    lastViewed?: Date;
  };
  
  // Portfolio Status
  status: 'draft' | 'published' | 'archived' | 'pending_approval';
  
  // Approval Process
  approval: {
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: mongoose.Types.ObjectId;
    reviewedAt?: Date;
    rejectionReason?: string;
    notes?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const VendorPortfolioSchema = new Schema<IVendorPortfolio>({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true
  },
  subcategory: String,
  
  projectType: {
    type: String,
    enum: ['wedding', 'corporate', 'private_party', 'other'],
    default: 'wedding'
  },
  eventDate: {
    type: Date,
    required: true
  },
  clientName: String,
  location: {
    venue: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'Sri Lanka' }
  },
  
  media: {
    images: [{
      url: { type: String, required: true },
      caption: String,
      isPrimary: { type: Boolean, default: false },
      order: { type: Number, default: 0 },
      tags: [String],
      metadata: {
        width: Number,
        height: Number,
        size: Number,
        format: String
      }
    }],
    videos: [{
      url: { type: String, required: true },
      thumbnail: { type: String, required: true },
      caption: String,
      duration: Number,
      order: { type: Number, default: 0 },
      tags: [String]
    }],
    beforeAfterImages: [{
      beforeUrl: { type: String, required: true },
      afterUrl: { type: String, required: true },
      caption: String,
      order: { type: Number, default: 0 }
    }]
  },
  
  specifications: {
    guestCount: Number,
    budget: Number,
    duration: Number,
    services: [String],
    themes: [String],
    colors: [String],
    specialRequirements: [String]
  },
  
  clientFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    testimonial: String,
    clientName: String,
    clientImage: String,
    isPublic: { type: Boolean, default: true },
    approvedAt: Date
  },
  
  settings: {
    isPublic: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    showClientName: { type: Boolean, default: false },
    showBudget: { type: Boolean, default: false },
    allowDownload: { type: Boolean, default: false },
    watermark: { type: Boolean, default: true }
  },
  
  seo: {
    keywords: [String],
    metaDescription: String,
    slug: { type: String, unique: true, sparse: true }
  },
  
  analytics: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    lastViewed: Date
  },
  
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'pending_approval'],
    default: 'pending_approval'
  },
  
  approval: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    rejectionReason: String,
    notes: String
  }
}, {
  timestamps: true
});

// Indexes
VendorPortfolioSchema.index({ vendorId: 1 });
VendorPortfolioSchema.index({ category: 1 });
VendorPortfolioSchema.index({ subcategory: 1 });
VendorPortfolioSchema.index({ projectType: 1 });
VendorPortfolioSchema.index({ eventDate: -1 });
VendorPortfolioSchema.index({ status: 1 });
VendorPortfolioSchema.index({ 'settings.isPublic': 1 });
VendorPortfolioSchema.index({ 'settings.isFeatured': 1 });
VendorPortfolioSchema.index({ 'approval.status': 1 });
VendorPortfolioSchema.index({ 'location.city': 1 });
VendorPortfolioSchema.index({ 'location.state': 1 });
VendorPortfolioSchema.index({ 'analytics.views': -1 });
VendorPortfolioSchema.index({ 'analytics.likes': -1 });
VendorPortfolioSchema.index({ 'seo.slug': 1 });
VendorPortfolioSchema.index({ createdAt: -1 });

// Text search index
VendorPortfolioSchema.index({
  title: 'text',
  description: 'text',
  category: 'text',
  subcategory: 'text',
  'location.venue': 'text',
  'location.city': 'text',
  'specifications.themes': 'text',
  'specifications.colors': 'text',
  'seo.keywords': 'text'
});

// Compound indexes for common queries
VendorPortfolioSchema.index({ vendorId: 1, status: 1 });
VendorPortfolioSchema.index({ category: 1, 'settings.isPublic': 1 });
VendorPortfolioSchema.index({ projectType: 1, 'settings.isFeatured': 1 });
VendorPortfolioSchema.index({ eventDate: -1, 'settings.isPublic': 1 });

export const VendorPortfolio = mongoose.models.VendorPortfolio || mongoose.model('VendorPortfolio', VendorPortfolioSchema);
