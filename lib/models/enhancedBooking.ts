import mongoose, { Schema, Document } from 'mongoose';

export interface IEnhancedBooking extends Document {
  user: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  venue?: mongoose.Types.ObjectId;
  services: {
    service: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
    customizations: {
      key: string;
      value: any;
    }[];
  }[];
  schedule: {
    date: Date;
    startTime: string;
    endTime: string;
    duration: number; // in minutes
    timezone: string;
    recurring?: {
      isRecurring: boolean;
      frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
      endDate?: Date;
      daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
    };
  };
  pricing: {
    basePrice: number;
    dynamicPricing: {
      multiplier: number;
      factors: string[];
      appliedAt: Date;
    };
    discounts: {
      type: 'percentage' | 'fixed' | 'loyalty' | 'promotional';
      amount: number;
      reason: string;
      appliedAt: Date;
    }[];
    totalPrice: number;
    currency: string;
    taxRate: number;
    taxAmount: number;
    finalPrice: number;
  };
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  payment: {
    status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
    method: 'stripe' | 'paypal' | 'bank_transfer' | 'cash';
    transactionId?: string;
    amount: number;
    paidAt?: Date;
    refundedAt?: Date;
    refundAmount?: number;
    refundReason?: string;
  };
  notifications: {
    reminders: {
      type: 'email' | 'sms' | 'push';
      scheduledAt: Date;
      sentAt?: Date;
      status: 'pending' | 'sent' | 'failed';
    }[];
    followUps: {
      type: 'survey' | 'review' | 'feedback';
      scheduledAt: Date;
      sentAt?: Date;
      status: 'pending' | 'sent' | 'completed';
    }[];
    lastSent: Date;
  };
  metadata: {
    source: 'web' | 'mobile' | 'api' | 'admin';
    referrer?: string;
    campaign?: string;
    notes?: string;
    customFields: {
      key: string;
      value: any;
    }[];
  };
  waitlist: {
    isWaitlisted: boolean;
    position: number;
    notifiedAt?: Date;
    priority: 'low' | 'medium' | 'high';
  };
  conflicts: {
    type: 'time' | 'resource' | 'capacity';
    description: string;
    resolvedAt?: Date;
    resolution?: string;
  }[];
  reviews: {
    userReview?: mongoose.Types.ObjectId;
    vendorReview?: mongoose.Types.ObjectId;
  };
  attachments: {
    type: 'contract' | 'invoice' | 'receipt' | 'photo' | 'document';
    url: string;
    name: string;
    uploadedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

const EnhancedBookingSchema = new Schema<IEnhancedBooking>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  venue: {
    type: Schema.Types.ObjectId,
    ref: 'Venue'
  },
  services: [{
    service: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    customizations: [{
      key: {
        type: String,
        required: true
      },
      value: Schema.Types.Mixed
    }]
  }],
  schedule: {
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true,
      min: 1
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    recurring: {
      isRecurring: { type: Boolean, default: false },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
      },
      endDate: Date,
      daysOfWeek: [Number]
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    dynamicPricing: {
      multiplier: { type: Number, default: 1 },
      factors: [String],
      appliedAt: { type: Date, default: Date.now }
    },
    discounts: [{
      type: {
        type: String,
        enum: ['percentage', 'fixed', 'loyalty', 'promotional'],
        required: true
      },
      amount: {
        type: Number,
        required: true,
        min: 0
      },
      reason: {
        type: String,
        required: true
      },
      appliedAt: {
        type: Date,
        default: Date.now
      }
    }],
    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'LKR'
    },
    taxRate: {
      type: Number,
      default: 0
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  payment: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['stripe', 'paypal', 'bank_transfer', 'cash'],
      required: true
    },
    transactionId: String,
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number,
    refundReason: String
  },
  notifications: {
    reminders: [{
      type: {
        type: String,
        enum: ['email', 'sms', 'push'],
        required: true
      },
      scheduledAt: {
        type: Date,
        required: true
      },
      sentAt: Date,
      status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
      }
    }],
    followUps: [{
      type: {
        type: String,
        enum: ['survey', 'review', 'feedback'],
        required: true
      },
      scheduledAt: {
        type: Date,
        required: true
      },
      sentAt: Date,
      status: {
        type: String,
        enum: ['pending', 'sent', 'completed'],
        default: 'pending'
      }
    }],
    lastSent: {
      type: Date,
      default: Date.now
    }
  },
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'api', 'admin'],
      default: 'web'
    },
    referrer: String,
    campaign: String,
    notes: String,
    customFields: [{
      key: {
        type: String,
        required: true
      },
      value: Schema.Types.Mixed
    }]
  },
  waitlist: {
    isWaitlisted: { type: Boolean, default: false },
    position: { type: Number, default: 0 },
    notifiedAt: Date,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  conflicts: [{
    type: {
      type: String,
      enum: ['time', 'resource', 'capacity'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    resolvedAt: Date,
    resolution: String
  }],
  reviews: {
    userReview: {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    },
    vendorReview: {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  },
  attachments: [{
    type: {
      type: String,
      enum: ['contract', 'invoice', 'receipt', 'photo', 'document'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for performance
EnhancedBookingSchema.index({ user: 1, createdAt: -1 });
EnhancedBookingSchema.index({ vendor: 1, createdAt: -1 });
EnhancedBookingSchema.index({ venue: 1, createdAt: -1 });
EnhancedBookingSchema.index({ status: 1, createdAt: -1 });
EnhancedBookingSchema.index({ 'schedule.date': 1, 'schedule.startTime': 1 });
EnhancedBookingSchema.index({ 'payment.status': 1 });
EnhancedBookingSchema.index({ 'waitlist.isWaitlisted': 1, 'waitlist.position': 1 });
EnhancedBookingSchema.index({ 'schedule.recurring.isRecurring': 1 });
EnhancedBookingSchema.index({ isActive: 1, createdAt: -1 });

// Compound indexes
EnhancedBookingSchema.index({ 
  vendor: 1, 
  'schedule.date': 1, 
  'schedule.startTime': 1 
});

EnhancedBookingSchema.index({ 
  status: 1, 
  'schedule.date': 1 
});

// Auto-update updatedAt
EnhancedBookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.EnhancedBooking || mongoose.model<IEnhancedBooking>('EnhancedBooking', EnhancedBookingSchema);
