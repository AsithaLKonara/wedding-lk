// Invoice Model
import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  invoiceNumber: string;
  bookingId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  
  // Invoice details
  issueDate: Date;
  dueDate: Date;
  serviceDate: Date;
  
  // Customer information
  customer: {
    name: string;
    email: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  
  // Vendor information
  vendor: {
    businessName: string;
    email: string;
    phone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    taxId?: string;
    registrationNumber?: string;
  };
  
  // Service details
  services: {
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    taxRate: number;
    taxAmount: number;
  }[];
  
  // Pricing breakdown
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate?: number;
  discountAmount?: number;
  platformFee: number;
  totalAmount: number;
  currency: string;
  
  // Payment information
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  paymentMethod?: string;
  paymentDate?: Date;
  transactionId?: string;
  
  // Platform fees
  platformFeeRate: number;
  platformFeeAmount: number;
  vendorAmount: number;
  
  // Invoice settings
  notes?: string;
  terms: string;
  footer?: string;
  
  // File information
  pdfUrl?: string;
  pdfGeneratedAt?: Date;
  
  // Status tracking
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled';
  sentAt?: Date;
  viewedAt?: Date;
  paidAt?: Date;
  
  // Reminders
  remindersSent: {
    type: 'payment_due' | 'overdue' | 'final_notice';
    sentAt: Date;
    method: 'email' | 'sms' | 'push';
  }[];
  
  // Refund information
  refunds?: {
    amount: number;
    reason: string;
    processedAt: Date;
    transactionId?: string;
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoice>({
  invoiceNumber: { 
    type: String, 
    required: true, 
    unique: true},
  bookingId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true},
  customerId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true},
  vendorId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Vendor', 
    required: true},
  
  issueDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true },
  serviceDate: { type: Date, required: true },
  
  customer: {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 100 },
    phone: { type: String, maxlength: 20 },
    address: {
      street: { type: String, required: true, maxlength: 200 },
      city: { type: String, required: true, maxlength: 100 },
      state: { type: String, required: true, maxlength: 100 },
      postalCode: { type: String, required: true, maxlength: 20 },
      country: { type: String, required: true, maxlength: 100 }
    }
  },
  
  vendor: {
    businessName: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, maxlength: 100 },
    phone: { type: String, maxlength: 20 },
    address: {
      street: { type: String, required: true, maxlength: 200 },
      city: { type: String, required: true, maxlength: 100 },
      state: { type: String, required: true, maxlength: 100 },
      postalCode: { type: String, required: true, maxlength: 20 },
      country: { type: String, required: true, maxlength: 100 }
    },
    taxId: { type: String, maxlength: 50 },
    registrationNumber: { type: String, maxlength: 50 }
  },
  
  services: [{
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 200 },
    quantity: { type: Number, required: true, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    taxRate: { type: Number, default: 0, min: 0, max: 100 },
    taxAmount: { type: Number, default: 0, min: 0 }
  }],
  
  subtotal: { type: Number, required: true, min: 0 },
  taxRate: { type: Number, default: 0, min: 0, max: 100 },
  taxAmount: { type: Number, default: 0, min: 0 },
  discountRate: { type: Number, min: 0, max: 100 },
  discountAmount: { type: Number, min: 0 },
  platformFee: { type: Number, required: true, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'LKR', maxlength: 3 },
  
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'overdue', 'cancelled', 'refunded'],
    default: 'pending'},
  paymentMethod: { type: String, maxlength: 50 },
  paymentDate: { type: Date },
  transactionId: { type: String, maxlength: 100 },
  
  platformFeeRate: { type: Number, required: true, min: 0, max: 100 },
  platformFeeAmount: { type: Number, required: true, min: 0 },
  vendorAmount: { type: Number, required: true, min: 0 },
  
  notes: { type: String, maxlength: 500 },
  terms: { type: String, required: true, maxlength: 1000 },
  footer: { type: String, maxlength: 200 },
  
  pdfUrl: { type: String },
  pdfGeneratedAt: { type: Date },
  
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'],
    default: 'draft'},
  sentAt: { type: Date },
  viewedAt: { type: Date },
  paidAt: { type: Date },
  
  remindersSent: [{
    type: { 
      type: String, 
      enum: ['payment_due', 'overdue', 'final_notice'],
      required: true 
    },
    sentAt: { type: Date, required: true },
    method: { 
      type: String, 
      enum: ['email', 'sms', 'push'],
      required: true 
    }
  }],
  
  refunds: [{
    amount: { type: Number, required: true, min: 0 },
    reason: { type: String, required: true, maxlength: 200 },
    processedAt: { type: Date, required: true },
    transactionId: { type: String, maxlength: 100 }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient queries
InvoiceSchema.index({ customerId: 1, status: 1 });
InvoiceSchema.index({ vendorId: 1, status: 1 });
InvoiceSchema.index({ dueDate: 1, paymentStatus: 1 });
InvoiceSchema.index({ createdAt: -1 });

// Pre-save middleware
InvoiceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Generate invoice number if not exists
  if (!this.invoiceNumber) {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.invoiceNumber = `INV-${year}${month}-${random}`;
  }
  
  // Calculate totals
  this.subtotal = this.services.reduce((sum, service) => sum + service.totalPrice, 0);
  this.taxAmount = (this.subtotal * this.taxRate) / 100;
  this.discountAmount = this.discountRate ? (this.subtotal * this.discountRate) / 100 : 0;
  this.platformFeeAmount = (this.subtotal * this.platformFeeRate) / 100;
  this.totalAmount = this.subtotal + this.taxAmount - (this.discountAmount || 0);
  this.vendorAmount = this.subtotal - this.platformFeeAmount;
  
  // Update payment status based on dates
  if (this.paymentStatus === 'pending' && this.dueDate < new Date()) {
    this.paymentStatus = 'overdue';
  }
  
  next();
});

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);


