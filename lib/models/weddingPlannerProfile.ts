import mongoose, { Document, Schema } from 'mongoose';

export interface IWeddingPlannerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Professional Information
  professionalTitle: string;
  yearsOfExperience: number;
  specialization: string[];
  languages: string[];
  
  // Education & Certifications
  education: {
    degree: string;
    institution: string;
    year: number;
    documentUrl?: string;
    verified: boolean;
  }[];
  
  certifications: {
    name: string;
    issuingAuthority: string;
    issueDate: Date;
    expiryDate?: Date;
    documentUrl: string;
    verified: boolean;
  }[];
  
  // Professional Memberships
  memberships: {
    organization: string;
    membershipType: string;
    memberSince: Date;
    memberId: string;
    verified: boolean;
  }[];
  
  // Portfolio
  portfolio: {
    title: string;
    description: string;
    weddingDate: Date;
    guestCount: number;
    budget: number;
    images: string[];
    clientTestimonial?: string;
    category: string[];
    featured: boolean;
  }[];
  
  // Services Offered
  services: {
    name: string;
    description: string;
    pricing: {
      type: 'fixed' | 'percentage' | 'hourly';
      amount: number;
      currency: string;
    };
    isAvailable: boolean;
  }[];
  
  // Service Areas
  serviceAreas: {
    city: string;
    state: string;
    country: string;
    travelRadius: number;
    travelFee?: number;
  }[];
  
  // Insurance & Liability
  professionalLiability: {
    provider: string;
    policyNumber: string;
    coverageAmount: number;
    expiryDate: Date;
    documentUrl: string;
    verified: boolean;
  };
  
  // Business Information
  businessName?: string;
  businessRegistrationNumber?: string;
  taxIdentificationNumber?: string;
  businessLicenseNumber?: string;
  
  // Contact Information
  businessPhone?: string;
  businessEmail?: string;
  businessAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  
  // Business Hours
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
  completedWeddings: number;
  averageWeddingBudget: number;
  totalRevenue: number;
  
  // Social Media & Website
  socialMedia: {
    website?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    pinterest?: string;
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

const WeddingPlannerProfileSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    
    // Professional Information
    professionalTitle: {
      type: String,
      required: true,
      trim: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    specialization: [{
      type: String,
      required: true,
    }],
    languages: [{
      type: String,
      required: true,
    }],
    
    // Education & Certifications
    education: [{
      degree: {
        type: String,
        required: true,
      },
      institution: {
        type: String,
        required: true,
      },
      year: {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear(),
      },
      documentUrl: {
        type: String,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    }],
    
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
    
    // Professional Memberships
    memberships: [{
      organization: {
        type: String,
        required: true,
      },
      membershipType: {
        type: String,
        required: true,
      },
      memberSince: {
        type: Date,
        required: true,
      },
      memberId: {
        type: String,
        required: true,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    }],
    
    // Portfolio
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
      weddingDate: {
        type: Date,
        required: true,
      },
      guestCount: {
        type: Number,
        required: true,
        min: 1,
      },
      budget: {
        type: Number,
        required: true,
        min: 0,
      },
      images: [{
        type: String,
        required: true,
      }],
      clientTestimonial: {
        type: String,
        maxlength: 500,
      },
      category: [{
        type: String,
      }],
      featured: {
        type: Boolean,
        default: false,
      },
    }],
    
    // Services Offered
    services: [{
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        maxlength: 500,
      },
      pricing: {
        type: {
          type: String,
          enum: ['fixed', 'percentage', 'hourly'],
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
      },
      isAvailable: {
        type: Boolean,
        default: true,
      },
    }],
    
    // Service Areas
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
      travelRadius: {
        type: Number,
        required: true,
        min: 1,
        max: 1000,
      },
      travelFee: {
        type: Number,
        min: 0,
      },
    }],
    
    // Insurance & Liability
    professionalLiability: {
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
    },
    
    // Business Information
    businessName: {
      type: String,
      trim: true,
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
    
    // Contact Information
    businessPhone: {
      type: String,
      trim: true,
    },
    businessEmail: {
      type: String,
      trim: true,
    },
    businessAddress: {
      street: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      zipCode: {
        type: String,
      },
    },
    
    // Business Hours
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
    completedWeddings: {
      type: Number,
      default: 0,
      min: 0,
    },
    averageWeddingBudget: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
      min: 0,
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
      pinterest: {
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
WeddingPlannerProfileSchema.index({ userId: 1 });
WeddingPlannerProfileSchema.index({ verificationStatus: 1 });
WeddingPlannerProfileSchema.index({ 'services.name': 1 });
WeddingPlannerProfileSchema.index({ 'serviceAreas.city': 1, 'serviceAreas.state': 1 });
WeddingPlannerProfileSchema.index({ 'rating.average': -1 });
WeddingPlannerProfileSchema.index({ yearsOfExperience: -1 });
WeddingPlannerProfileSchema.index({ completedWeddings: -1 });

// Instance methods
WeddingPlannerProfileSchema.methods.updateRating = function(newRating: number) {
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

WeddingPlannerProfileSchema.methods.addPortfolioItem = function(item: any) {
  this.portfolio.push(item);
  return this.save();
};

WeddingPlannerProfileSchema.methods.updateVerificationStatus = function(status: string, notes?: string, verifiedBy?: mongoose.Types.ObjectId) {
  this.verificationStatus = status;
  this.verificationNotes = notes;
  this.verifiedBy = verifiedBy;
  this.verifiedAt = new Date();
  this.lastVerifiedAt = new Date();
  
  return this.save();
};

WeddingPlannerProfileSchema.methods.calculateMetrics = function() {
  if (this.portfolio.length > 0) {
    this.completedWeddings = this.portfolio.length;
    
    const totalBudget = this.portfolio.reduce((sum: number, item: any) => sum + item.budget, 0);
    this.averageWeddingBudget = totalBudget / this.portfolio.length;
  }
  
  return this.save();
};

export const WeddingPlannerProfile = mongoose.models.WeddingPlannerProfile || mongoose.model<IWeddingPlannerProfile>('WeddingPlannerProfile', WeddingPlannerProfileSchema);
export default WeddingPlannerProfile; 