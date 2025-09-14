import mongoose, { Document, Schema } from 'mongoose';

export interface IReferral extends Document {
  // Referral Information
  referrerId: mongoose.Types.ObjectId; // User who made the referral
  refereeId: mongoose.Types.ObjectId; // User who was referred
  referralCode: string; // Unique referral code
  referralType: 'user_signup' | 'vendor_signup' | 'booking' | 'first_booking';
  
  // Status and Tracking
  status: 'pending' | 'completed' | 'expired' | 'cancelled';
  completedAt?: Date;
  expiresAt: Date;
  
  // Rewards
  referrerReward: {
    type: 'discount' | 'credit' | 'points' | 'commission';
    amount: number;
    currency: string;
    description: string;
    claimed: boolean;
    claimedAt?: Date;
  };
  
  refereeReward: {
    type: 'discount' | 'credit' | 'points' | 'bonus';
    amount: number;
    currency: string;
    description: string;
    claimed: boolean;
    claimedAt?: Date;
  };
  
  // Tracking Data
  source: 'email' | 'sms' | 'social' | 'direct' | 'qr_code';
  campaignId?: string; // For tracking campaigns
  utmParams?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  
  // Booking Information (if applicable)
  bookingId?: mongoose.Types.ObjectId;
  bookingAmount?: number;
  commissionEarned?: number;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ReferralSchema: Schema = new Schema({
  // Referral Information
  referrerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  refereeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  referralType: {
    type: String,
    required: true,
    enum: ['user_signup', 'vendor_signup', 'booking', 'first_booking'],
    index: true
  },
  
  // Status and Tracking
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'expired', 'cancelled'],
    default: 'pending',
    index: true
  },
  completedAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    required: true
  },
  
  // Rewards
  referrerReward: {
    type: {
      type: String,
      required: true,
      enum: ['discount', 'credit', 'points', 'commission']
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      default: 'LKR'
    },
    description: {
      type: String,
      required: true
    },
    claimed: {
      type: Boolean,
      default: false
    },
    claimedAt: {
      type: Date
    }
  },
  
  refereeReward: {
    type: {
      type: String,
      required: true,
      enum: ['discount', 'credit', 'points', 'bonus']
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      default: 'LKR'
    },
    description: {
      type: String,
      required: true
    },
    claimed: {
      type: Boolean,
      default: false
    },
    claimedAt: {
      type: Date
    }
  },
  
  // Tracking Data
  source: {
    type: String,
    required: true,
    enum: ['email', 'sms', 'social', 'direct', 'qr_code'],
    default: 'direct'
  },
  campaignId: {
    type: String,
    index: true
  },
  utmParams: {
    source: String,
    medium: String,
    campaign: String,
    term: String,
    content: String
  },
  
  // Booking Information
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  },
  bookingAmount: {
    type: Number,
    min: 0
  },
  commissionEarned: {
    type: Number,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for performance
ReferralSchema.index({ referrerId: 1, status: 1, createdAt: -1 });
ReferralSchema.index({ refereeId: 1, status: 1 });
ReferralSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Prevent duplicate referrals
ReferralSchema.index({ referrerId: 1, refereeId: 1 }, { unique: true });

// Virtual for referral link
ReferralSchema.virtual('referralLink').get(function() {
  return `${process.env.NEXTAUTH_URL}/referral/${this.referralCode}`;
});

// Virtual for days until expiry
ReferralSchema.virtual('daysUntilExpiry').get(function() {
  const now = new Date();
  const expiry = new Date(this.expiresAt);
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

export const Referral = mongoose.models.Referral || mongoose.model<IReferral>('Referral', ReferralSchema);

