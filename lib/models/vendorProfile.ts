import mongoose, { Document, Schema } from 'mongoose';

export interface IVendorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Business Information
  businessName: string;
  businessType: 'individual' | 'company' | 'partnership';
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  businessLicenseNumber?: string;
  yearsInBusiness: number;
  
  // Service Details
  services: {
    category: string;
    subcategory: string;
    description: string;
    pricing: {
      type: 'fixed' | 'hourly' | 'package' | 'custom';
      amount: number;
      currency: string;
      unit?: string;
    };
    availability: {
      days: number[];
      hours: {
        start: string;
        end: string;
      };
      isAvailable: boolean;
    };
  }[];
  
  // Coverage Areas
  serviceAreas: {
    city: string;
    state: string;
    country: string;
    radius: number; // in kilometers
  }[];
  
  // Portfolio & Media
  portfolio: {
    title: string;
    description: string;
    images: string[];
    videos?: string[];
    category: string;
    tags: string[];
    featured: boolean;
  }[];
  
  // Certifications & Licenses
  certifications: {
    name: string;
    issuingAuthority: string;
    issueDate: Date;
    expiryDate?: Date;
    documentUrl: string;
    verified: boolean;
  }[];
  
  // Insurance & Liability
  insurance: {
    type: string;
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    expiryDate: Date;
    documentUrl: string;
    verified: boolean;
  }[];
  
  // Business Hours & Availability
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  
  // Emergency Contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  
  // Verification Status
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'under_review';
  verificationNotes?: string;
  verifiedBy?: mongoose.Types.ObjectId;
  verifiedAt?: Date;
  verificationDocuments: mongoose.Types.ObjectId[];
  
  // Business Metrics
  rating: {
    average: number;
    count: number;
    breakdown: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
  };
  
  // Social Media & Website
  socialMedia: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  
  // Payment & Billing
  paymentMethods: {
    type: 'bank_transfer' | 'credit_card' | 'paypal' | 'stripe' | 'cash';
    details: any;
    isDefault: boolean;
  }[];
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastVerifiedAt?: Date;
}

const VendorProfileSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    
    // Business Information
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    businessType: {
      type: String,
      enum: ['individual', 'company', 'partnership'],
      required: true,
    },
    businessRegistrationNumber: {
      type: String,
      trim: true,
    },
    taxIdentificationNumber: {
      type: String,
      trim: true,
    },
    businessLicenseNumber: {
      type: String,
      trim: true,
    },
    yearsInBusiness: {
      type: Number,
      required: true,
      min: 0,
    },
    
    // Service Details
    services: [{
      category: {
        type: String,
        required: true,
      },
      subcategory: {
        type: String,
      },
      description: {
        type: String,
        required: true,
        maxlength: 1000,
      },
      pricing: {
        type: {
          type: String,
          enum: ['fixed', 'hourly', 'package', 'custom'],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        currency: {
          type: String,
          default: 'USD',
        },
        unit: {
          type: String,
        },
      },
      availability: {
        days: [{
          type: Number,
          min: 0,
          max: 6, // 0 = Sunday, 6 = Saturday
        }],
        hours: {
          start: {
            type: String,
            required: true,
          },
          end: {
            type: String,
            required: true,
          },
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
      },
    }],
    
    // Coverage Areas
    serviceAreas: [{
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      radius: {
        type: Number,
        required: true,
        min: 1,
        max: 1000,
      },
    }],
    
    // Portfolio & Media
    portfolio: [{
      title: {
        type: String,
        required: true,
        maxlength: 200,
      },
      description: {
        type: String,
        maxlength: 1000,
      },
      images: [{
        type: String,
        required: true,
      }],
      videos: [{
        type: String,
      }],
      category: {
        type: String,
        required: true,
      },
      tags: [{
        type: String,
      }],
      featured: {
        type: Boolean,
        default: false,
      },
    }],
    
    // Certifications & Licenses
    certifications: [{
      name: {
        type: String,
        required: true,
      },
      issuingAuthority: {
        type: String,
        required: true,
      },
      issueDate: {
        type: Date,
        required: true,
      },
      expiryDate: {
        type: Date,
      },
      documentUrl: {
        type: String,
        required: true,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    }],
    
    // Insurance & Liability
    insurance: [{
      type: {
        type: String,
        required: true,
      },
      provider: {
        type: String,
        required: true,
      },
      policyNumber: {
        type: String,
        required: true,
      },
      coverageAmount: {
        type: Number,
        required: true,
        min: 0,
      },
      expiryDate: {
        type: Date,
        required: true,
      },
      documentUrl: {
        type: String,
        required: true,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    }],
    
    // Business Hours & Availability
    businessHours: {
      monday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '17:00' },
        closed: { type: Boolean, default: false },
      },
      tuesday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '17:00' },
        closed: { type: Boolean, default: false },
      },
      wednesday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '17:00' },
        closed: { type: Boolean, default: false },
      },
      thursday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '17:00' },
        closed: { type: Boolean, default: false },
      },
      friday: {
        open: { type: String, default: '09:00' },
        close: { type: String, default: '17:00' },
        closed: { type: Boolean, default: false },
      },
      saturday: {
        open: { type: String, default: '10:00' },
        close: { type: String, default: '16:00' },
        closed: { type: Boolean, default: false },
      },
      sunday: {
        open: { type: String, default: '10:00' },
        close: { type: String, default: '16:00' },
        closed: { type: Boolean, default: true },
      },
    },
    
    // Emergency Contact
    emergencyContact: {
      name: {
        type: String,
        required: true,
      },
      relationship: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      email: {
        type: String,
      },
    },
    
    // Verification Status
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'under_review'],
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
    verificationDocuments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
    }],
    
    // Business Metrics
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
      breakdown: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      },
    },
    
    // Social Media & Website
    socialMedia: {
      website: {
        type: String,
      },
      facebook: {
        type: String,
      },
      instagram: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      twitter: {
        type: String,
      },
      youtube: {
        type: String,
      },
    },
    
    // Payment & Billing
    paymentMethods: [{
      type: {
        type: String,
        enum: ['bank_transfer', 'credit_card', 'paypal', 'stripe', 'cash'],
        required: true,
      },
      details: {
        type: Schema.Types.Mixed,
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
// userId index is automatically created by unique: true constraint
VendorProfileSchema.index({ verificationStatus: 1 });
VendorProfileSchema.index({ 'services.category': 1 });
VendorProfileSchema.index({ 'serviceAreas.city': 1, 'serviceAreas.state': 1 });
VendorProfileSchema.index({ 'rating.average': -1 });
VendorProfileSchema.index({ businessName: 'text' });

// Instance methods
VendorProfileSchema.methods.updateRating = function(newRating: number) {
  const oldAverage = this.rating.average;
  const oldCount = this.rating.count;
  
  // Update total and count
  const newTotal = (oldAverage * oldCount) + newRating;
  const newCount = oldCount + 1;
  
  // Update average
  this.rating.average = newTotal / newCount;
  this.rating.count = newCount;
  
  // Update breakdown (assuming newRating is 1-5)
  if (newRating >= 1 && newRating <= 5) {
    this.rating.breakdown[newRating as keyof typeof this.rating.breakdown]++;
  }
  
  return this.save();
};

VendorProfileSchema.methods.addService = function(service: any) {
  this.services.push(service);
  return this.save();
};

VendorProfileSchema.methods.updateVerificationStatus = function(status: string, notes?: string, verifiedBy?: mongoose.Types.ObjectId) {
  this.verificationStatus = status;
  this.verificationNotes = notes;
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  this.lastVerifiedAt = new Date();
  
  return this.save();
};

export const VendorProfile = mongoose.models.VendorProfile || mongoose.model<IVendorProfile>('VendorProfile', VendorProfileSchema);
export default VendorProfile; 