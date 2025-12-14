import mongoose, { Schema, Document } from 'mongoose';

export interface IUserVerification extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Email Verification
  emailVerification: {
    token: string;
    expiresAt: Date;
    verified: boolean;
    verifiedAt?: Date;
    attempts: number;
    lastAttempt?: Date;
  };
  
  // Phone Verification
  phoneVerification: {
    token: string;
    expiresAt: Date;
    verified: boolean;
    verifiedAt?: Date;
    attempts: number;
    lastAttempt?: Date;
    phoneNumber: string;
  };
  
  // Identity Verification
  identityVerification: {
    status: 'pending' | 'verified' | 'rejected' | 'expired';
    documents: Array<{
      type: 'passport' | 'drivers_license' | 'national_id' | 'other';
      documentId: mongoose.Types.ObjectId;
      uploadedAt: Date;
      verifiedAt?: Date;
      rejectedReason?: string;
    }>;
    verifiedAt?: Date;
    verifiedBy?: mongoose.Types.ObjectId;
    rejectionReason?: string;
    rejectionDetails?: string;
  };
  
  // Business Verification (for vendors)
  businessVerification: {
    status: 'pending' | 'verified' | 'rejected' | 'expired';
    businessRegistration: {
      documentId: mongoose.Types.ObjectId;
      registrationNumber: string;
      businessName: string;
      uploadedAt: Date;
      verifiedAt?: Date;
    };
    taxDocuments: Array<{
      documentId: mongoose.Types.ObjectId;
      documentType: string;
      uploadedAt: Date;
      verifiedAt?: Date;
    }>;
    bankAccountVerification: {
      status: 'pending' | 'verified' | 'rejected';
      bankName: string;
      accountNumber: string; // encrypted
      verifiedAt?: Date;
      rejectionReason?: string;
    };
    verifiedAt?: Date;
    verifiedBy?: mongoose.Types.ObjectId;
    rejectionReason?: string;
  };
  
  // Address Verification
  addressVerification: {
    status: 'pending' | 'verified' | 'rejected';
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    verificationMethod: 'document' | 'utility_bill' | 'bank_statement' | 'other';
    documentId?: mongoose.Types.ObjectId;
    verifiedAt?: Date;
    verifiedBy?: mongoose.Types.ObjectId;
    rejectionReason?: string;
  };
  
  // Social Media Verification
  socialMediaVerification: {
    platforms: Array<{
      platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok';
      username: string;
      verified: boolean;
      verifiedAt?: Date;
      verificationToken?: string;
      profileUrl?: string;
    }>;
  };
  
  // Overall Verification Status
  overallStatus: {
    level: 'unverified' | 'basic' | 'verified' | 'premium';
    score: number; // 0-100
    lastUpdated: Date;
    requirements: Array<{
      type: string;
      required: boolean;
      completed: boolean;
      completedAt?: Date;
    }>;
  };
  
  // Verification History
  verificationHistory: Array<{
    type: string;
    status: 'initiated' | 'completed' | 'failed' | 'expired';
    timestamp: Date;
    details?: string;
    verifiedBy?: mongoose.Types.ObjectId;
  }>;
  
  createdAt: Date;
  updatedAt: Date;
}

const UserVerificationSchema = new Schema<IUserVerification>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  
  emailVerification: {
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    verifiedAt: Date,
    attempts: { type: Number, default: 0 },
    lastAttempt: Date
  },
  
  phoneVerification: {
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
    verifiedAt: Date,
    attempts: { type: Number, default: 0 },
    lastAttempt: Date,
    phoneNumber: { type: String, required: true }
  },
  
  identityVerification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'expired'],
      default: 'pending'
    },
    documents: [{
      type: {
        type: String,
        enum: ['passport', 'drivers_license', 'national_id', 'other'],
        required: true
      },
      documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
      uploadedAt: { type: Date, default: Date.now },
      verifiedAt: Date,
      rejectedReason: String
    }],
    verifiedAt: Date,
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: String,
    rejectionDetails: String
  },
  
  businessVerification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'expired'],
      default: 'pending'
    },
    businessRegistration: {
      documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
      registrationNumber: { type: String, required: true },
      businessName: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
      verifiedAt: Date
    },
    taxDocuments: [{
      documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
      documentType: { type: String, required: true },
      uploadedAt: { type: Date, default: Date.now },
      verifiedAt: Date
    }],
    bankAccountVerification: {
      status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
      },
      bankName: String,
      accountNumber: String, // Should be encrypted in production
      verifiedAt: Date,
      rejectionReason: String
    },
    verifiedAt: Date,
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: String
  },
  
  addressVerification: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    verificationMethod: {
      type: String,
      enum: ['document', 'utility_bill', 'bank_statement', 'other']
    },
    documentId: { type: Schema.Types.ObjectId, ref: 'Document' },
    verifiedAt: Date,
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: String
  },
  
  socialMediaVerification: {
    platforms: [{
      platform: {
        type: String,
        enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'],
        required: true
      },
      username: { type: String, required: true },
      verified: { type: Boolean, default: false },
      verifiedAt: Date,
      verificationToken: String,
      profileUrl: String
    }]
  },
  
  overallStatus: {
    level: {
      type: String,
      enum: ['unverified', 'basic', 'verified', 'premium'],
      default: 'unverified'
    },
    score: { type: Number, default: 0, min: 0, max: 100 },
    lastUpdated: { type: Date, default: Date.now },
    requirements: [{
      type: { type: String, required: true },
      required: { type: Boolean, default: true },
      completed: { type: Boolean, default: false },
      completedAt: Date
    }]
  },
  
  verificationHistory: [{
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ['initiated', 'completed', 'failed', 'expired'],
      required: true
    },
    timestamp: { type: Date, default: Date.now },
    details: String,
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  }]
}, {
  timestamps: true
});

// Indexes
UserVerificationSchema.index({ userId: 1 });
UserVerificationSchema.index({ 'emailVerification.token': 1 });
UserVerificationSchema.index({ 'phoneVerification.token': 1 });
UserVerificationSchema.index({ 'overallStatus.level': 1 });
UserVerificationSchema.index({ 'identityVerification.status': 1 });
UserVerificationSchema.index({ 'businessVerification.status': 1 });

export const UserVerification = mongoose.models.UserVerification || mongoose.model('UserVerification', UserVerificationSchema);
