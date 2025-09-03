import mongoose, { Document as MongooseDocument, Schema } from 'mongoose';

export interface IDocument extends MongooseDocument {
  userId: mongoose.Types.ObjectId;
  documentType: 'identity' | 'business_license' | 'certification' | 'insurance' | 'portfolio' | 'other';
  title: string;
  description?: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType: string;
  status: 'pending' | 'verified' | 'rejected' | 'expired';
  verificationNotes?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  expiresAt?: Date;
  tags: string[];
  metadata: {
    category?: string;
    subcategory?: string;
    documentNumber?: string;
    issuingAuthority?: string;
    issueDate?: Date;
    expiryDate?: Date;
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    
    documentType: {
      type: String,
      enum: ['identity', 'business_license', 'certification', 'insurance', 'portfolio', 'other'],
      required: true,
    },
    
    title: {
      type: String,
      required: true,
      trim: true,
    },
    
    description: {
      type: String,
      maxlength: 1000,
    },
    
    fileName: {
      type: String,
      required: true,
    },
    
    originalName: {
      type: String,
      required: true,
    },
    
    fileUrl: {
      type: String,
      required: true,
    },
    
    thumbnailUrl: {
      type: String,
    },
    
    fileSize: {
      type: Number,
      required: true,
      min: 0,
    },
    
    mimeType: {
      type: String,
      required: true,
    },
    
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'expired'],
      default: 'pending',
    },
    
    verificationNotes: {
      type: String,
      maxlength: 1000,
    },
    
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    
    verifiedAt: {
      type: Date,
    },
    
    expiresAt: {
      type: Date,
    },
    
    tags: [{
      type: String,
      trim: true,
    }],
    
    metadata: {
      category: {
        type: String,
      },
      subcategory: {
        type: String,
      },
      documentNumber: {
        type: String,
      },
      issuingAuthority: {
        type: String,
      },
      issueDate: {
        type: Date,
      },
      expiryDate: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
DocumentSchema.index({ userId: 1 });
DocumentSchema.index({ documentType: 1 });
DocumentSchema.index({ status: 1 });
DocumentSchema.index({ 'metadata.category': 1 });
DocumentSchema.index({ expiresAt: 1 });
DocumentSchema.index({ createdAt: -1 });

// Pre-save middleware to check expiration
DocumentSchema.pre('save', function(next) {
  if (this.expiresAt && this.expiresAt < new Date()) {
    this.status = 'expired';
  }
  next();
});

// Instance methods
DocumentSchema.methods.verify = function(verifiedBy: mongoose.Types.ObjectId, notes?: string) {
  this.status = 'verified';
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  this.verificationNotes = notes;
  
  return this.save();
};

DocumentSchema.methods.reject = function(verifiedBy: mongoose.Types.ObjectId, notes: string) {
  this.status = 'rejected';
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  this.verificationNotes = notes;
  
  return this.save();
};

DocumentSchema.methods.isExpired = function(): boolean {
  if (!this.expiresAt) return false;
  return this.expiresAt < new Date();
};

DocumentSchema.methods.getDaysUntilExpiry = function(): number {
  if (!this.expiresAt) return -1;
  
  const now = new Date();
  const expiry = new Date(this.expiresAt);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

// Static methods
DocumentSchema.statics.findByUserAndType = function(userId: string, documentType: string) {
  return this.find({ userId, documentType });
};

DocumentSchema.statics.findExpiringSoon = function(daysThreshold: number = 30) {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  
  return this.find({
    expiresAt: { $lte: thresholdDate, $gt: new Date() },
    status: { $ne: 'expired' }
  });
};

DocumentSchema.statics.findPendingVerification = function() {
  return this.find({ status: 'pending' });
};

const Document = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);
export default Document; 