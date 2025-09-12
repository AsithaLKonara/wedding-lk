// Quotation Request Model
import mongoose, { Schema, Document } from 'mongoose';

export interface IQuotationRequest extends Document {
  customerId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  
  // Request details
  title: string;
  description: string;
  eventDate: Date;
  eventLocation: string;
  guestCount?: number;
  
  // Service requirements
  requirements: {
    category: string;
    description: string;
    quantity?: number;
    budget?: number;
    priority: 'low' | 'medium' | 'high';
  }[];
  
  // Budget and timeline
  budgetRange: {
    min: number;
    max: number;
    currency: string;
  };
  timeline: {
    requestDeadline: Date;
    eventDate: Date;
    flexibility: 'strict' | 'flexible' | 'very_flexible';
  };
  
  // Additional information
  specialRequests?: string;
  attachments?: {
    filename: string;
    url: string;
    type: string;
    size: number;
  }[];
  
  // Status tracking
  status: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
  quotedAt?: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  expiredAt?: Date;
  
  // Vendor response
  vendorResponse?: {
    message?: string;
    estimatedDelivery?: Date;
    questions?: {
      question: string;
      required: boolean;
    }[];
    respondedAt: Date;
  };
  
  // Customer feedback
  customerFeedback?: {
    rating: number;
    comment?: string;
    respondedAt: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const QuotationRequestSchema = new Schema<IQuotationRequest>({
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  vendorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: true,
    index: true 
  },
  serviceId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Service' 
  },
  
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 2000 },
  eventDate: { type: Date, required: true },
  eventLocation: { type: String, required: true, maxlength: 200 },
  guestCount: { type: Number, min: 1 },
  
  requirements: [{
    category: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 500 },
    quantity: { type: Number, min: 1 },
    budget: { type: Number, min: 0 },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  
  budgetRange: {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'LKR', maxlength: 3 }
  },
  timeline: {
    requestDeadline: { type: Date, required: true },
    eventDate: { type: Date, required: true },
    flexibility: { 
      type: String, 
      enum: ['strict', 'flexible', 'very_flexible'],
      default: 'flexible'
    }
  },
  
  specialRequests: { type: String, maxlength: 1000 },
  attachments: [{
    filename: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true }
  }],
  
  status: { 
    type: String, 
    enum: ['pending', 'quoted', 'accepted', 'rejected', 'expired', 'cancelled'],
    default: 'pending',
    index: true
  },
  quotedAt: { type: Date },
  acceptedAt: { type: Date },
  rejectedAt: { type: Date },
  expiredAt: { type: Date },
  
  vendorResponse: {
    message: { type: String, maxlength: 1000 },
    estimatedDelivery: { type: Date },
    questions: [{
      question: { type: String, required: true, maxlength: 500 },
      required: { type: Boolean, default: false }
    }],
    respondedAt: { type: Date }
  },
  
  customerFeedback: {
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    respondedAt: { type: Date }
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
QuotationRequestSchema.index({ customerId: 1, status: 1 });
QuotationRequestSchema.index({ vendorId: 1, status: 1 });
QuotationRequestSchema.index({ eventDate: 1, status: 1 });
QuotationRequestSchema.index({ createdAt: -1 });

// Pre-save middleware
QuotationRequestSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Auto-expire requests after deadline
  if (this.status === 'pending' && this.timeline.requestDeadline < new Date()) {
    this.status = 'expired';
    this.expiredAt = new Date();
  }
  
  next();
});

export default mongoose.models.QuotationRequest || mongoose.model<IQuotationRequest>('QuotationRequest', QuotationRequestSchema);


