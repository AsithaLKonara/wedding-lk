// Quotation System Model
import mongoose, { Schema, Document } from 'mongoose';

export interface IQuotation extends Document {
  requestId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  
  // Quotation details
  title: string;
  description: string;
  items: {
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
  
  // Pricing
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate?: number;
  discountAmount?: number;
  totalAmount: number;
  currency: string;
  
  // Validity and terms
  validUntil: Date;
  terms: string;
  notes?: string;
  
  // Status tracking
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  sentAt?: Date;
  viewedAt?: Date;
  respondedAt?: Date;
  
  // Customer response
  customerResponse?: {
    status: 'accepted' | 'rejected' | 'counter_offer';
    message?: string;
    counterOffer?: {
      items: {
        name: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
      }[];
      totalAmount: number;
      message?: string;
    };
    respondedAt: Date;
  };
  
  // Booking creation
  bookingId?: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

const QuotationSchema = new Schema<IQuotation>({
  requestId: { 
    type: Schema.Types.ObjectId, 
    ref: 'QuotationRequest', 
    required: true},
  vendorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: true},
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true},
  serviceId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Service' 
  },
  
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 1000 },
  items: [{
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 200 },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 }
  }],
  
  subtotal: { type: Number, required: true, min: 0 },
  taxRate: { type: Number, default: 0, min: 0, max: 100 },
  taxAmount: { type: Number, default: 0, min: 0 },
  discountRate: { type: Number, min: 0, max: 100 },
  discountAmount: { type: Number, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'LKR', maxlength: 3 },
  
  validUntil: { type: Date, required: true },
  terms: { type: String, required: true, maxlength: 1000 },
  notes: { type: String, maxlength: 500 },
  
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'viewed', 'accepted', 'rejected', 'expired'],
    default: 'draft'},
  sentAt: { type: Date },
  viewedAt: { type: Date },
  respondedAt: { type: Date },
  
  customerResponse: {
    status: { 
      type: String, 
      enum: ['accepted', 'rejected', 'counter_offer'] 
    },
    message: { type: String, maxlength: 500 },
    counterOffer: {
      items: [{
        name: { type: String, required: true, maxlength: 100 },
        quantity: { type: Number, required: true, min: 0 },
        unitPrice: { type: Number, required: true, min: 0 },
        totalPrice: { type: Number, required: true, min: 0 }
      }],
      totalAmount: { type: Number, min: 0 },
      message: { type: String, maxlength: 500 }
    },
    respondedAt: { type: Date }
  },
  
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
QuotationSchema.index({ vendorId: 1, status: 1 });
QuotationSchema.index({ customerId: 1, status: 1 });
QuotationSchema.index({ validUntil: 1, status: 1 });

// Pre-save middleware
QuotationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate totals
  this.subtotal = this.items.reduce((sum, item) => sum + item.totalPrice, 0);
  this.taxAmount = (this.subtotal * this.taxRate) / 100;
  this.discountAmount = this.discountRate ? (this.subtotal * this.discountRate) / 100 : 0;
  this.totalAmount = this.subtotal + this.taxAmount - (this.discountAmount || 0);
  
  next();
});

export default mongoose.models.Quotation || mongoose.model<IQuotation>('Quotation', QuotationSchema);


