// Commission and Payout Management Model
import mongoose, { Schema, Document } from 'mongoose';

export interface ICommission extends Document {
  bookingId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  
  // Commission details
  grossAmount: number;
  commissionRate: number;
  commissionAmount: number;
  netAmount: number; // Amount vendor receives
  currency: string;
  
  // Payment breakdown
  payment: {
    totalAmount: number;
    platformFee: number;
    processingFee: number;
    taxAmount: number;
    vendorAmount: number;
  };
  
  // Commission status
  status: 'pending' | 'calculated' | 'approved' | 'paid' | 'disputed' | 'refunded';
  
  // Payout information
  payout: {
    payoutId?: string;
    payoutMethod: 'bank_transfer' | 'paypal' | 'stripe' | 'manual';
    payoutStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
    payoutDate?: Date;
    payoutReference?: string;
    bankDetails?: {
      accountName: string;
      accountNumber: string;
      bankName: string;
      branchCode?: string;
      swiftCode?: string;
    };
    paypalEmail?: string;
    stripeAccountId?: string;
  };
  
  // Commission calculation
  calculation: {
    baseRate: number; // Default platform commission rate
    adjustedRate: number; // Actual rate applied (considering vendor tier, promotions, etc.)
    adjustments: {
      type: 'promotion' | 'vendor_tier' | 'volume_discount' | 'manual';
      description: string;
      amount: number;
      percentage?: number;
    }[];
    calculatedAt: Date;
    calculatedBy: mongoose.Types.ObjectId;
  };
  
  // Approval workflow
  approval: {
    requiresApproval: boolean;
    approvedBy?: mongoose.Types.ObjectId;
    approvedAt?: Date;
    approvalNotes?: string;
    autoApproved: boolean;
  };
  
  // Dispute information
  dispute?: {
    raisedBy: mongoose.Types.ObjectId;
    raisedAt: Date;
    reason: string;
    description: string;
    status: 'pending' | 'under_review' | 'resolved' | 'rejected';
    resolvedBy?: mongoose.Types.ObjectId;
    resolvedAt?: Date;
    resolution?: string;
    adjustedAmount?: number;
  };
  
  // Refund information
  refund?: {
    refundAmount: number;
    refundReason: string;
    refundedAt: Date;
    refundedBy: mongoose.Types.ObjectId;
    refundMethod: string;
    refundReference?: string;
  };
  
  // Tax information
  tax: {
    vendorTaxId?: string;
    taxRate: number;
    taxAmount: number;
    taxExempt: boolean;
    taxExemptionReason?: string;
  };
  
  // Audit trail
  auditTrail: {
    action: string;
    performedBy: mongoose.Types.ObjectId;
    performedAt: Date;
    details: string;
    previousValue?: any;
    newValue?: any;
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

const CommissionSchema = new Schema<ICommission>({
  bookingId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true
  },
  vendorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: true},
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true},
  
  grossAmount: { type: Number, required: true, min: 0 },
  commissionRate: { type: Number, required: true, min: 0, max: 100 },
  commissionAmount: { type: Number, required: true, min: 0 },
  netAmount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'LKR', maxlength: 3 },
  
  payment: {
    totalAmount: { type: Number, required: true, min: 0 },
    platformFee: { type: Number, required: true, min: 0 },
    processingFee: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    vendorAmount: { type: Number, required: true, min: 0 }
  },
  
  status: { 
    type: String, 
    enum: ['pending', 'calculated', 'approved', 'paid', 'disputed', 'refunded'],
    default: 'pending'},
  
  payout: {
    payoutId: { type: String },
    payoutMethod: { 
      type: String, 
      enum: ['bank_transfer', 'paypal', 'stripe', 'manual'],
      required: true
    },
    payoutStatus: { 
      type: String, 
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
      default: 'pending'
    },
    payoutDate: { type: Date },
    payoutReference: { type: String },
    bankDetails: {
      accountName: { type: String, maxlength: 100 },
      accountNumber: { type: String, maxlength: 50 },
      bankName: { type: String, maxlength: 100 },
      branchCode: { type: String, maxlength: 20 },
      swiftCode: { type: String, maxlength: 20 }
    },
    paypalEmail: { type: String, maxlength: 100 },
    stripeAccountId: { type: String, maxlength: 100 }
  },
  
  calculation: {
    baseRate: { type: Number, required: true, min: 0, max: 100 },
    adjustedRate: { type: Number, required: true, min: 0, max: 100 },
    adjustments: [{
      type: { 
        type: String, 
        enum: ['promotion', 'vendor_tier', 'volume_discount', 'manual'],
        required: true
      },
      description: { type: String, required: true, maxlength: 200 },
      amount: { type: Number, required: true },
      percentage: { type: Number, min: 0, max: 100 }
    }],
    calculatedAt: { type: Date, required: true, default: Date.now },
    calculatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  
  approval: {
    requiresApproval: { type: Boolean, default: false },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    approvalNotes: { type: String, maxlength: 500 },
    autoApproved: { type: Boolean, default: false }
  },
  
  dispute: {
    raisedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    raisedAt: { type: Date, required: true, default: Date.now },
    reason: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 1000 },
    status: { 
      type: String, 
      enum: ['pending', 'under_review', 'resolved', 'rejected'],
      default: 'pending'
    },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
    resolution: { type: String, maxlength: 1000 },
    adjustedAmount: { type: Number, min: 0 }
  },
  
  refund: {
    refundAmount: { type: Number, required: true, min: 0 },
    refundReason: { type: String, required: true, maxlength: 200 },
    refundedAt: { type: Date, required: true },
    refundedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    refundMethod: { type: String, required: true, maxlength: 50 },
    refundReference: { type: String, maxlength: 100 }
  },
  
  tax: {
    vendorTaxId: { type: String, maxlength: 50 },
    taxRate: { type: Number, default: 0, min: 0, max: 100 },
    taxAmount: { type: Number, default: 0, min: 0 },
    taxExempt: { type: Boolean, default: false },
    taxExemptionReason: { type: String, maxlength: 200 }
  },
  
  auditTrail: [{
    action: { type: String, required: true, maxlength: 100 },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    performedAt: { type: Date, required: true, default: Date.now },
    details: { type: String, required: true, maxlength: 500 },
    previousValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
CommissionSchema.index({ vendorId: 1, status: 1 });
CommissionSchema.index({ bookingId: 1 });
CommissionSchema.index({ 'payout.payoutStatus': 1 });
CommissionSchema.index({ createdAt: -1 });
CommissionSchema.index({ 'dispute.status': 1 });

// Pre-save middleware
CommissionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate amounts
  this.commissionAmount = (this.grossAmount * this.commissionRate) / 100;
  this.netAmount = this.grossAmount - this.commissionAmount;
  
  // Update payment breakdown
  this.payment.platformFee = this.commissionAmount;
  this.payment.vendorAmount = this.netAmount;
  
  next();
});

export default mongoose.models.Commission || mongoose.model<ICommission>('Commission', CommissionSchema);


