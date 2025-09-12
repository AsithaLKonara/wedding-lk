import mongoose, { Document, Schema } from 'mongoose';

export interface IEscrowPayment extends Document {
  // Basic Information
  escrowId: string; // Unique escrow identifier
  bookingId: mongoose.Types.ObjectId;
  paymentId: mongoose.Types.ObjectId;
  
  // Parties
  payerId: mongoose.Types.ObjectId; // User making payment
  payeeId: mongoose.Types.ObjectId; // Vendor receiving payment
  platformId: mongoose.Types.ObjectId; // WeddingLK platform
  
  // Payment Details
  amount: number;
  currency: string;
  platformFee: number; // Platform commission
  netAmount: number; // Amount after platform fee
  
  // Stripe Integration
  stripePaymentIntentId: string;
  stripeTransferId?: string; // For transferring to vendor
  stripeRefundId?: string; // For refunds
  
  // Escrow Status
  status: 'pending' | 'held' | 'released' | 'refunded' | 'disputed' | 'cancelled';
  holdReason?: string;
  
  // Release Conditions
  releaseConditions: {
    type: 'automatic' | 'manual' | 'event_based';
    eventDate?: Date; // For event-based release
    daysAfterEvent?: number; // Days after event to release
    requiresConfirmation: boolean; // Requires both parties to confirm
    autoReleaseDate?: Date; // Automatic release date
  };
  
  // Release Process
  releaseProcess: {
    initiatedBy: mongoose.Types.ObjectId;
    initiatedAt: Date;
    releaseReason: string;
    releaseAmount: number;
    isPartialRelease: boolean;
    confirmationRequired: boolean;
    payerConfirmed: boolean;
    payeeConfirmed: boolean;
    confirmedAt?: Date;
    releasedAt?: Date;
  };
  
  // Refund Process
  refundProcess: {
    initiatedBy: mongoose.Types.ObjectId;
    initiatedAt: Date;
    refundReason: string;
    refundAmount: number;
    isPartialRefund: boolean;
    refundMethod: 'original_payment' | 'bank_transfer' | 'credit';
    refundStatus: 'pending' | 'processing' | 'completed' | 'failed';
    refundedAt?: Date;
    refundNotes?: string;
  };
  
  // Dispute Integration
  disputeId?: mongoose.Types.ObjectId;
  isDisputed: boolean;
  disputeAmount?: number; // Amount in dispute
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  releasedAt?: Date;
  refundedAt?: Date;
  expiresAt?: Date; // Escrow expiration
}

const EscrowPaymentSchema: Schema = new Schema({
  // Basic Information
  escrowId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    index: true
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
    index: true
  },
  
  // Parties
  payerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  payeeId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  platformId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Platform user account
    required: true
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'LKR',
    maxlength: 3
  },
  platformFee: {
    type: Number,
    required: true,
    min: 0
  },
  netAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  // Stripe Integration
  stripePaymentIntentId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  stripeTransferId: {
    type: String,
    index: true
  },
  stripeRefundId: {
    type: String,
    index: true
  },
  
  // Escrow Status
  status: {
    type: String,
    required: true,
    enum: ['pending', 'held', 'released', 'refunded', 'disputed', 'cancelled'],
    default: 'pending',
    index: true
  },
  holdReason: {
    type: String,
    maxlength: 200,
    trim: true
  },
  
  // Release Conditions
  releaseConditions: {
    type: {
      type: String,
      required: true,
      enum: ['automatic', 'manual', 'event_based'],
      default: 'event_based'
    },
    eventDate: {
      type: Date,
      index: true
    },
    daysAfterEvent: {
      type: Number,
      default: 1,
      min: 0,
      max: 30
    },
    requiresConfirmation: {
      type: Boolean,
      default: false
    },
    autoReleaseDate: {
      type: Date,
      index: true
    }
  },
  
  // Release Process
  releaseProcess: {
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    initiatedAt: {
      type: Date
    },
    releaseReason: {
      type: String,
      maxlength: 200,
      trim: true
    },
    releaseAmount: {
      type: Number,
      min: 0
    },
    isPartialRelease: {
      type: Boolean,
      default: false
    },
    confirmationRequired: {
      type: Boolean,
      default: false
    },
    payerConfirmed: {
      type: Boolean,
      default: false
    },
    payeeConfirmed: {
      type: Boolean,
      default: false
    },
    confirmedAt: {
      type: Date
    },
    releasedAt: {
      type: Date
    }
  },
  
  // Refund Process
  refundProcess: {
    initiatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    initiatedAt: {
      type: Date
    },
    refundReason: {
      type: String,
      maxlength: 200,
      trim: true
    },
    refundAmount: {
      type: Number,
      min: 0
    },
    isPartialRefund: {
      type: Boolean,
      default: false
    },
    refundMethod: {
      type: String,
      enum: ['original_payment', 'bank_transfer', 'credit'],
      default: 'original_payment'
    },
    refundStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    refundedAt: {
      type: Date
    },
    refundNotes: {
      type: String,
      maxlength: 500,
      trim: true
    }
  },
  
  // Dispute Integration
  disputeId: {
    type: Schema.Types.ObjectId,
    ref: 'Dispute',
    index: true
  },
  isDisputed: {
    type: Boolean,
    default: false,
    index: true
  },
  disputeAmount: {
    type: Number,
    min: 0
  },
  
  // Timestamps
  releasedAt: {
    type: Date,
    index: true
  },
  refundedAt: {
    type: Date,
    index: true
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
EscrowPaymentSchema.index({ payerId: 1, status: 1, createdAt: -1 });
EscrowPaymentSchema.index({ payeeId: 1, status: 1, createdAt: -1 });
EscrowPaymentSchema.index({ status: 1, createdAt: -1 });
EscrowPaymentSchema.index({ 'releaseConditions.autoReleaseDate': 1 });
EscrowPaymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL

// Pre-save middleware to generate escrow ID and calculate amounts
EscrowPaymentSchema.pre('save', function(next) {
  if (!this.escrowId) {
    this.escrowId = `ESC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  
  // Calculate platform fee and net amount
  if (this.isModified('amount') || this.isModified('platformFee')) {
    this.netAmount = this.amount - this.platformFee;
  }
  
  // Set auto-release date for event-based releases
  if (this.releaseConditions.type === 'event_based' && this.releaseConditions.eventDate) {
    const releaseDate = new Date(this.releaseConditions.eventDate);
    releaseDate.setDate(releaseDate.getDate() + (this.releaseConditions.daysAfterEvent || 1));
    this.releaseConditions.autoReleaseDate = releaseDate;
  }
  
  // Set expiration date (30 days from creation)
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }
  
  next();
});

// Method to initiate release
EscrowPaymentSchema.methods.initiateRelease = async function(
  initiatedBy: mongoose.Types.ObjectId,
  releaseReason: string,
  releaseAmount?: number
) {
  const amount = releaseAmount || this.netAmount;
  
  this.releaseProcess = {
    initiatedBy,
    initiatedAt: new Date(),
    releaseReason,
    releaseAmount: amount,
    isPartialRelease: amount < this.netAmount,
    confirmationRequired: this.releaseConditions.requiresConfirmation,
    payerConfirmed: false,
    payeeConfirmed: false
  };
  
  this.status = 'held';
  await this.save();
  
  // Send notifications to both parties
  // await NotificationService.createNotification(
  //   this.payerId,
  //   'payment',
  //   'Payment Release Initiated',
  //   `Payment release has been initiated for booking ${this.bookingId}`,
  //   { data: { escrowId: this.escrowId } }
  // );
  
  return this;
};

// Method to confirm release
EscrowPaymentSchema.methods.confirmRelease = async function(
  confirmedBy: mongoose.Types.ObjectId,
  isPayer: boolean
) {
  if (isPayer) {
    this.releaseProcess.payerConfirmed = true;
  } else {
    this.releaseProcess.payeeConfirmed = true;
  }
  
  // Check if both parties have confirmed (if required)
  if (this.releaseProcess.confirmationRequired) {
    if (this.releaseProcess.payerConfirmed && this.releaseProcess.payeeConfirmed) {
      this.releaseProcess.confirmedAt = new Date();
      await this.release();
    }
  } else {
    // Auto-release if no confirmation required
    await this.release();
  }
  
  return this.save();
};

// Method to release payment
EscrowPaymentSchema.methods.release = async function() {
  try {
    // Create Stripe transfer to vendor
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const transfer = await stripe.transfers.create({
      amount: Math.round(this.releaseProcess.releaseAmount * 100), // Convert to cents
      currency: this.currency.toLowerCase(),
      destination: this.payeeId, // Vendor's Stripe account
      transfer_group: this.escrowId
    });
    
    this.stripeTransferId = transfer.id;
    this.status = 'released';
    this.releasedAt = new Date();
    this.releaseProcess.releasedAt = new Date();
    
    await this.save();
    
    // Send notification to vendor
    // await NotificationService.createNotification(
    //   this.payeeId,
    //   'payment',
    //   'Payment Released',
    //   `Payment of ${this.currency} ${this.releaseProcess.releaseAmount} has been released to your account`,
    //   { data: { escrowId: this.escrowId } }
    // );
    
    return this;
  } catch (error) {
    console.error('Error releasing payment:', error);
    throw error;
  }
};

// Method to initiate refund
EscrowPaymentSchema.methods.initiateRefund = async function(
  initiatedBy: mongoose.Types.ObjectId,
  refundReason: string,
  refundAmount?: number
) {
  const amount = refundAmount || this.amount;
  
  this.refundProcess = {
    initiatedBy,
    initiatedAt: new Date(),
    refundReason,
    refundAmount: amount,
    isPartialRefund: amount < this.amount,
    refundMethod: 'original_payment',
    refundStatus: 'pending'
  };
  
  this.status = 'refunded';
  await this.save();
  
  // Process refund with Stripe
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const refund = await stripe.refunds.create({
      payment_intent: this.stripePaymentIntentId,
      amount: Math.round(amount * 100), // Convert to cents
      reason: 'requested_by_customer'
    });
    
    this.stripeRefundId = refund.id;
    this.refundProcess.refundStatus = 'completed';
    this.refundProcess.refundedAt = new Date();
    this.refundedAt = new Date();
    
    await this.save();
    
    // Send notification to payer
    // await NotificationService.createNotification(
    //   this.payerId,
    //   'payment',
    //   'Refund Processed',
    //   `Refund of ${this.currency} ${amount} has been processed`,
    //   { data: { escrowId: this.escrowId } }
    // );
    
  } catch (error) {
    console.error('Error processing refund:', error);
    this.refundProcess.refundStatus = 'failed';
    await this.save();
    throw error;
  }
  
  return this;
};

// Static method to create escrow payment
EscrowPaymentSchema.statics.createEscrowPayment = async function(
  bookingId: mongoose.Types.ObjectId,
  paymentId: mongoose.Types.ObjectId,
  payerId: mongoose.Types.ObjectId,
  payeeId: mongoose.Types.ObjectId,
  amount: number,
  platformFeeRate: number = 0.1, // 10% platform fee
  eventDate?: Date
) {
  const platformFee = Math.round(amount * platformFeeRate * 100) / 100;
  const netAmount = amount - platformFee;
  
  const escrowPayment = new this({
    bookingId,
    paymentId,
    payerId,
    payeeId,
    platformId: process.env.PLATFORM_USER_ID, // Platform user account
    amount,
    platformFee,
    netAmount,
    stripePaymentIntentId: paymentId, // Assuming payment ID is Stripe payment intent ID
    releaseConditions: {
      type: eventDate ? 'event_based' : 'automatic',
      eventDate,
      daysAfterEvent: 1,
      requiresConfirmation: false
    }
  });
  
  await escrowPayment.save();
  return escrowPayment;
};

export const EscrowPayment = mongoose.models.EscrowPayment || mongoose.model<IEscrowPayment>('EscrowPayment', EscrowPaymentSchema);

