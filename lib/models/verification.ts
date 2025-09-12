// Vendor Verification Model
import mongoose, { Schema, Document } from 'mongoose';

export interface IVerification extends Document {
  vendorId: mongoose.Types.ObjectId;
  type: 'business_registration' | 'tax_certificate' | 'insurance' | 'portfolio' | 'identity' | 'address';
  
  // Document information
  document: {
    filename: string;
    originalName: string;
    url: string;
    mimeType: string;
    size: number;
    uploadedAt: Date;
  };
  
  // Verification details
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: mongoose.Types.ObjectId; // Admin who reviewed
  expiresAt?: Date;
  
  // Review information
  review: {
    comments?: string;
    issues?: string[];
    requirements?: string[];
    score?: number; // 0-100
    reviewer: mongoose.Types.ObjectId;
    reviewedAt: Date;
  };
  
  // Document details
  details: {
    documentNumber?: string;
    issueDate?: Date;
    expiryDate?: Date;
    issuingAuthority?: string;
    businessName?: string;
    businessType?: string;
    address?: string;
    contactInfo?: {
      phone?: string;
      email?: string;
    };
  };
  
  // Re-submission
  resubmission?: {
    reason: string;
    requestedAt: Date;
    requestedBy: mongoose.Types.ObjectId;
    deadline: Date;
    attempts: number;
  };
  
  // Compliance
  compliance: {
    isCompliant: boolean;
    violations: string[];
    warnings: string[];
    lastChecked: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new Schema<IVerification>({
  vendorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: true,
    index: true 
  },
  type: { 
    type: String, 
    required: true, 
    enum: ['business_registration', 'tax_certificate', 'insurance', 'portfolio', 'identity', 'address'],
    index: true
  },
  
  document: {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedAt: { type: Date, required: true, default: Date.now }
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'expired'],
    default: 'pending',
    index: true
  },
  submittedAt: { type: Date, required: true, default: Date.now },
  reviewedAt: { type: Date },
  reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date },
  
  review: {
    comments: { type: String, maxlength: 1000 },
    issues: [{ type: String, maxlength: 200 }],
    requirements: [{ type: String, maxlength: 200 }],
    score: { type: Number, min: 0, max: 100 },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reviewedAt: { type: Date, required: true }
  },
  
  details: {
    documentNumber: { type: String, maxlength: 100 },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    issuingAuthority: { type: String, maxlength: 200 },
    businessName: { type: String, maxlength: 200 },
    businessType: { type: String, maxlength: 100 },
    address: { type: String, maxlength: 500 },
    contactInfo: {
      phone: { type: String, maxlength: 20 },
      email: { type: String, maxlength: 100 }
    }
  },
  
  resubmission: {
    reason: { type: String, required: true, maxlength: 500 },
    requestedAt: { type: Date, required: true },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deadline: { type: Date, required: true },
    attempts: { type: Number, default: 0, min: 0 }
  },
  
  compliance: {
    isCompliant: { type: Boolean, default: true },
    violations: [{ type: String, maxlength: 200 }],
    warnings: [{ type: String, maxlength: 200 }],
    lastChecked: { type: Date, default: Date.now }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
VerificationSchema.index({ vendorId: 1, type: 1 });
VerificationSchema.index({ status: 1, submittedAt: -1 });
VerificationSchema.index({ reviewedBy: 1, reviewedAt: -1 });
VerificationSchema.index({ expiresAt: 1, status: 1 });

// Pre-save middleware
VerificationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Set expiry date based on document type
  if (!this.expiresAt) {
    const now = new Date();
    switch (this.type) {
      case 'business_registration':
        this.expiresAt = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        break;
      case 'tax_certificate':
        this.expiresAt = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        break;
      case 'insurance':
        this.expiresAt = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        break;
      case 'portfolio':
        this.expiresAt = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate());
        break;
      case 'identity':
        this.expiresAt = new Date(now.getFullYear() + 5, now.getMonth(), now.getDate());
        break;
      case 'address':
        this.expiresAt = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
        break;
    }
  }
  
  next();
});

export default mongoose.models.Verification || mongoose.model<IVerification>('Verification', VerificationSchema);


