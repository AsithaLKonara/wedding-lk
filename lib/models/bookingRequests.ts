import mongoose, { Schema, Document } from 'mongoose';

export interface IBookingRequest extends Document {
  // Request Basic Information
  requestId: string; // Unique request identifier
  
  // Customer Information
  customer: {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    alternatePhone?: string;
  };
  
  // Service/Vendor Information
  service: {
    vendorId: mongoose.Types.ObjectId;
    serviceId?: mongoose.Types.ObjectId;
    serviceName: string;
    category: string;
    estimatedPrice?: number;
  };
  
  // Event Details
  event: {
    type: 'wedding' | 'corporate' | 'private_party' | 'other';
    eventName: string;
    eventDate: Date;
    startTime: string;
    endTime: string;
    duration: number; // in hours
    guestCount: number;
    location: {
      type: 'vendor_location' | 'client_location' | 'venue';
      address: string;
      city: string;
      state: string;
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
  };
  
  // Service Requirements
  requirements: {
    description: string;
    specialRequests: string[];
    equipmentNeeded: string[];
    setupRequirements: string[];
    dietaryRestrictions?: string[];
    accessibilityNeeds?: string[];
    culturalRequirements?: string[];
  };
  
  // Budget Information
  budget: {
    estimatedBudget: number;
    currency: string;
    paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'installments';
    paymentSchedule?: Array<{
      amount: number;
      dueDate: Date;
      description: string;
    }>;
  };
  
  // Request Status
  status: 'pending' | 'quoted' | 'accepted' | 'rejected' | 'expired' | 'cancelled';
  
  // Vendor Response
  vendorResponse?: {
    status: 'pending' | 'quoted' | 'accepted' | 'rejected';
    responseTime: Date;
    message?: string;
    quotation?: {
      quotationId: mongoose.Types.ObjectId;
      totalPrice: number;
      breakdown: Array<{
        item: string;
        price: number;
        description?: string;
      }>;
      validUntil: Date;
    };
    availability?: {
      isAvailable: boolean;
      alternativeDates?: Date[];
      alternativeTimes?: Array<{
        startTime: string;
        endTime: string;
      }>;
    };
  };
  
  // Communication
  communication: {
    messages: Array<{
      sender: 'customer' | 'vendor' | 'admin';
      senderId: mongoose.Types.ObjectId;
      message: string;
      timestamp: Date;
      attachments?: Array<{
        type: 'image' | 'document' | 'other';
        url: string;
        name: string;
      }>;
    }>;
    lastMessageAt?: Date;
    unreadMessages: {
      customer: number;
      vendor: number;
    };
  };
  
  // Timeline
  timeline: {
    submittedAt: Date;
    vendorNotifiedAt?: Date;
    vendorRespondedAt?: Date;
    customerRespondedAt?: Date;
    acceptedAt?: Date;
    rejectedAt?: Date;
    expiredAt?: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
  };
  
  // Additional Information
  additionalInfo: {
    referralSource?: string;
    previousBookings?: mongoose.Types.ObjectId[];
    specialInstructions?: string;
    emergencyContact?: {
      name: string;
      phone: string;
      relationship: string;
    };
  };
  
  // Analytics
  analytics: {
    viewCount: number;
    responseTime: number; // in minutes
    conversionRate?: number;
    customerSatisfaction?: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const BookingRequestSchema = new Schema<IBookingRequest>({
  requestId: {
    type: String,
    required: true,
    unique: true
  },
  
  customer: {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    alternatePhone: String
  },
  
  service: {
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'VendorService' },
    serviceName: { type: String, required: true },
    category: { type: String, required: true },
    estimatedPrice: Number
  },
  
  event: {
    type: {
      type: String,
      enum: ['wedding', 'corporate', 'private_party', 'other'],
      default: 'wedding'
    },
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    guestCount: { type: Number, required: true },
    location: {
      type: {
        type: String,
        enum: ['vendor_location', 'client_location', 'venue'],
        required: true
      },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    }
  },
  
  requirements: {
    description: { type: String, required: true },
    specialRequests: [String],
    equipmentNeeded: [String],
    setupRequirements: [String],
    dietaryRestrictions: [String],
    accessibilityNeeds: [String],
    culturalRequirements: [String]
  },
  
  budget: {
    estimatedBudget: { type: Number, required: true },
    currency: { type: String, default: 'LKR' },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'installments'],
      default: 'card'
    },
    paymentSchedule: [{
      amount: { type: Number, required: true },
      dueDate: { type: Date, required: true },
      description: String
    }]
  },
  
  status: {
    type: String,
    enum: ['pending', 'quoted', 'accepted', 'rejected', 'expired', 'cancelled'],
    default: 'pending'
  },
  
  vendorResponse: {
    status: {
      type: String,
      enum: ['pending', 'quoted', 'accepted', 'rejected']
    },
    responseTime: Date,
    message: String,
    quotation: {
      quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation' },
      totalPrice: Number,
      breakdown: [{
        item: { type: String, required: true },
        price: { type: Number, required: true },
        description: String
      }],
      validUntil: Date
    },
    availability: {
      isAvailable: Boolean,
      alternativeDates: [Date],
      alternativeTimes: [{
        startTime: String,
        endTime: String
      }]
    }
  },
  
  communication: {
    messages: [{
      sender: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        required: true
      },
      senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      attachments: [{
        type: {
          type: String,
          enum: ['image', 'document', 'other']
        },
        url: { type: String, required: true },
        name: { type: String, required: true }
      }]
    }],
    lastMessageAt: Date,
    unreadMessages: {
      customer: { type: Number, default: 0 },
      vendor: { type: Number, default: 0 }
    }
  },
  
  timeline: {
    submittedAt: { type: Date, default: Date.now },
    vendorNotifiedAt: Date,
    vendorRespondedAt: Date,
    customerRespondedAt: Date,
    acceptedAt: Date,
    rejectedAt: Date,
    expiredAt: Date,
    cancelledAt: Date,
    cancellationReason: String
  },
  
  additionalInfo: {
    referralSource: String,
    previousBookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
    specialInstructions: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  
  analytics: {
    viewCount: { type: Number, default: 0 },
    responseTime: Number,
    conversionRate: Number,
    customerSatisfaction: Number
  }
}, {
  timestamps: true
});

// Indexes
BookingRequestSchema.index({ requestId: 1 });
BookingRequestSchema.index({ 'customer.userId': 1 });
BookingRequestSchema.index({ 'service.vendorId': 1 });
BookingRequestSchema.index({ 'service.serviceId': 1 });
BookingRequestSchema.index({ status: 1 });
BookingRequestSchema.index({ 'event.eventDate': 1 });
BookingRequestSchema.index({ 'event.location.city': 1 });
BookingRequestSchema.index({ 'event.location.state': 1 });
BookingRequestSchema.index({ 'timeline.submittedAt': -1 });
BookingRequestSchema.index({ 'vendorResponse.status': 1 });
BookingRequestSchema.index({ 'communication.lastMessageAt': -1 });

// Compound indexes for common queries
BookingRequestSchema.index({ 'service.vendorId': 1, status: 1 });
BookingRequestSchema.index({ 'customer.userId': 1, status: 1 });
BookingRequestSchema.index({ 'event.eventDate': 1, status: 1 });
BookingRequestSchema.index({ 'service.category': 1, status: 1 });

export const BookingRequest = mongoose.models.BookingRequest || mongoose.model('BookingRequest', BookingRequestSchema);
