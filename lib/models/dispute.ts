import mongoose, { Document, Schema } from 'mongoose';

export interface IDispute extends Document {
  // Basic Information
  disputeId: string; // Unique dispute identifier
  type: 'booking' | 'payment' | 'service' | 'vendor' | 'refund' | 'other';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Parties Involved
  complainantId: mongoose.Types.ObjectId; // User who filed the dispute
  respondentId: mongoose.Types.ObjectId; // Vendor or user being disputed
  assignedAdminId?: mongoose.Types.ObjectId; // Admin handling the dispute
  
  // Related Entities
  bookingId?: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  vendorId?: mongoose.Types.ObjectId;
  
  // Dispute Details
  title: string;
  description: string;
  category: 'quality' | 'delivery' | 'communication' | 'billing' | 'cancellation' | 'other';
  requestedResolution: 'refund' | 'partial_refund' | 'reschedule' | 'replacement' | 'apology' | 'other';
  requestedAmount?: number; // For monetary disputes
  currency: string;
  
  // Evidence and Documentation
  evidence: {
    type: 'image' | 'document' | 'video' | 'audio' | 'receipt' | 'contract';
    url: string;
    description: string;
    uploadedBy: mongoose.Types.ObjectId;
    uploadedAt: Date;
    isVerified: boolean;
  }[];
  
  // Communication Thread
  messages: {
    id: string;
    senderId: mongoose.Types.ObjectId;
    senderType: 'complainant' | 'respondent' | 'admin' | 'system';
    message: string;
    isInternal: boolean; // Admin-only messages
    attachments: string[];
    timestamp: Date;
    isRead: boolean;
  }[];
  
  // Resolution Details
  resolution: {
    type: 'refund' | 'partial_refund' | 'reschedule' | 'replacement' | 'apology' | 'dismissed' | 'other';
    amount?: number;
    currency?: string;
    description: string;
    resolvedBy: mongoose.Types.ObjectId;
    resolvedAt: Date;
    isAccepted: boolean;
    acceptedAt?: Date;
    rejectionReason?: string;
  };
  
  // Timeline and Status Updates
  timeline: {
    status: string;
    description: string;
    updatedBy: mongoose.Types.ObjectId;
    updatedAt: Date;
    isPublic: boolean;
  }[];
  
  // Escalation
  escalationLevel: number; // 0 = initial, 1 = supervisor, 2 = manager, 3 = director
  escalatedAt?: Date;
  escalationReason?: string;
  
  // Resolution Tracking
  resolutionDeadline: Date;
  lastActivityAt: Date;
  isOverdue: boolean;
  
  // Satisfaction and Feedback
  complainantSatisfaction?: {
    rating: number; // 1-5
    feedback: string;
    submittedAt: Date;
  };
  
  respondentSatisfaction?: {
    rating: number; // 1-5
    feedback: string;
    submittedAt: Date;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
}

const DisputeSchema: Schema = new Schema({
  // Basic Information
  disputeId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['booking', 'payment', 'service', 'vendor', 'refund', 'other'],
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['open', 'in_progress', 'resolved', 'closed', 'escalated'],
    default: 'open',
    index: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  
  // Parties Involved
  complainantId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  respondentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  assignedAdminId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  
  // Related Entities
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    index: true
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    index: true
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    index: true
  },
  
  // Dispute Details
  title: {
    type: String,
    required: true,
    maxlength: 200,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['quality', 'delivery', 'communication', 'billing', 'cancellation', 'other'],
    index: true
  },
  requestedResolution: {
    type: String,
    required: true,
    enum: ['refund', 'partial_refund', 'reschedule', 'replacement', 'apology', 'other']
  },
  requestedAmount: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'LKR',
    maxlength: 3
  },
  
  // Evidence and Documentation
  evidence: [{
    type: {
      type: String,
      required: true,
      enum: ['image', 'document', 'video', 'audio', 'receipt', 'contract']
    },
    url: {
      type: String,
      required: true,
      maxlength: 500
    },
    description: {
      type: String,
      maxlength: 200,
      trim: true
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Communication Thread
  messages: [{
    id: {
      type: String,
      required: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderType: {
      type: String,
      required: true,
      enum: ['complainant', 'respondent', 'admin', 'system']
    },
    message: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    attachments: [{
      type: String,
      maxlength: 500
    }],
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
  // Resolution Details
  resolution: {
    type: {
      type: String,
      enum: ['refund', 'partial_refund', 'reschedule', 'replacement', 'apology', 'dismissed', 'other']
    },
    amount: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      maxlength: 3
    },
    description: {
      type: String,
      maxlength: 1000,
      trim: true
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: {
      type: Date
    },
    isAccepted: {
      type: Boolean,
      default: false
    },
    acceptedAt: {
      type: Date
    },
    rejectionReason: {
      type: String,
      maxlength: 500,
      trim: true
    }
  },
  
  // Timeline and Status Updates
  timeline: [{
    status: {
      type: String,
      required: true,
      maxlength: 50
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    isPublic: {
      type: Boolean,
      default: true
    }
  }],
  
  // Escalation
  escalationLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 3
  },
  escalatedAt: {
    type: Date
  },
  escalationReason: {
    type: String,
    maxlength: 500,
    trim: true
  },
  
  // Resolution Tracking
  resolutionDeadline: {
    type: Date,
    required: true,
    index: true
  },
  lastActivityAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  isOverdue: {
    type: Boolean,
    default: false,
    index: true
  },
  
  // Satisfaction and Feedback
  complainantSatisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      maxlength: 500,
      trim: true
    },
    submittedAt: {
      type: Date
    }
  },
  
  respondentSatisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: {
      type: String,
      maxlength: 500,
      trim: true
    },
    submittedAt: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
DisputeSchema.index({ complainantId: 1, status: 1, createdAt: -1 });
DisputeSchema.index({ respondentId: 1, status: 1, createdAt: -1 });
DisputeSchema.index({ assignedAdminId: 1, status: 1 });
DisputeSchema.index({ status: 1, priority: 1, createdAt: -1 });
DisputeSchema.index({ resolutionDeadline: 1, isOverdue: 1 });
DisputeSchema.index({ lastActivityAt: -1 });

// Pre-save middleware to generate dispute ID
DisputeSchema.pre('save', function(next) {
  if (!this.disputeId) {
    this.disputeId = `DIS-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  }
  next();
});

// Method to add timeline entry
DisputeSchema.methods.addTimelineEntry = function(status: string, description: string, updatedBy: mongoose.Types.ObjectId, isPublic: boolean = true) {
  this.timeline.push({
    status,
    description,
    updatedBy,
    updatedAt: new Date(),
    isPublic
  });
  this.lastActivityAt = new Date();
  return this.save();
};

// Method to add message
DisputeSchema.methods.addMessage = function(
  senderId: mongoose.Types.ObjectId,
  senderType: string,
  message: string,
  isInternal: boolean = false,
  attachments: string[] = []
) {
  this.messages.push({
    id: `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    senderId,
    senderType,
    message,
    isInternal,
    attachments,
    timestamp: new Date(),
    isRead: false
  });
  this.lastActivityAt = new Date();
  return this.save();
};

// Method to escalate dispute
DisputeSchema.methods.escalate = function(reason: string, escalatedBy: mongoose.Types.ObjectId) {
  this.escalationLevel += 1;
  this.escalatedAt = new Date();
  this.escalationReason = reason;
  this.status = 'escalated';
  this.addTimelineEntry('escalated', `Dispute escalated to level ${this.escalationLevel}: ${reason}`, escalatedBy);
  return this.save();
};

// Static method to create dispute
DisputeSchema.statics.createDispute = async function(
  complainantId: mongoose.Types.ObjectId,
  respondentId: mongoose.Types.ObjectId,
  disputeData: any
) {
  const dispute = new this({
    complainantId,
    respondentId,
    ...disputeData,
    resolutionDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });

  await dispute.save();
  
  // Add initial timeline entry
  await dispute.addTimelineEntry(
    'open',
    'Dispute created and opened',
    complainantId
  );

  return dispute;
};

export const Dispute = mongoose.models.Dispute || mongoose.model<IDispute>('Dispute', DisputeSchema);

