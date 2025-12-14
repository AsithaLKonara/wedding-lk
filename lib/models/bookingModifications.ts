import mongoose, { Schema, Document } from 'mongoose';

export interface IBookingModification extends Document {
  // Booking Reference
  bookingId: mongoose.Types.ObjectId;
  
  // Modification Details
  modificationType: 'date_change' | 'time_change' | 'service_change' | 'guest_count_change' | 'location_change' | 'cancellation' | 'reschedule' | 'add_service' | 'remove_service';
  
  // Request Information
  requestedBy: mongoose.Types.ObjectId; // User who requested the change
  requestedAt: Date;
  
  // Original Booking Data
  originalData: {
    eventDate: Date;
    startTime: string;
    endTime: string;
    guestCount: number;
    services: Array<{
      serviceId: mongoose.Types.ObjectId;
      serviceName: string;
      price: number;
    }>;
    location: {
      type: 'vendor_location' | 'client_location' | 'venue';
      address: string;
      city: string;
      state: string;
    };
    totalPrice: number;
  };
  
  // Requested Changes
  requestedChanges: {
    newEventDate?: Date;
    newStartTime?: string;
    newEndTime?: string;
    newGuestCount?: number;
    newServices?: Array<{
      serviceId: mongoose.Types.ObjectId;
      serviceName: string;
      price: number;
      action: 'add' | 'remove' | 'modify';
    }>;
    newLocation?: {
      type: 'vendor_location' | 'client_location' | 'venue';
      address: string;
      city: string;
      state: string;
    };
    reason: string;
    additionalNotes?: string;
  };
  
  // Vendor Response
  vendorResponse?: {
    status: 'pending' | 'approved' | 'rejected' | 'counter_offer';
    respondedAt?: Date;
    responseMessage?: string;
    counterOffer?: {
      newEventDate?: Date;
      newStartTime?: string;
      newEndTime?: string;
      newGuestCount?: number;
      newServices?: Array<{
        serviceId: mongoose.Types.ObjectId;
        serviceName: string;
        price: number;
        action: 'add' | 'remove' | 'modify';
      }>;
      newLocation?: {
        type: 'vendor_location' | 'client_location' | 'venue';
        address: string;
        city: string;
        state: string;
      };
      priceAdjustment?: number;
      reason: string;
    };
  };
  
  // Customer Response (for counter offers)
  customerResponse?: {
    status: 'pending' | 'accepted' | 'rejected';
    respondedAt?: Date;
    responseMessage?: string;
  };
  
  // Price Impact
  priceImpact: {
    originalPrice: number;
    newPrice?: number;
    priceDifference: number;
    additionalCharges?: Array<{
      description: string;
      amount: number;
      reason: string;
    }>;
    refundAmount?: number;
    refundReason?: string;
  };
  
  // Status Tracking
  status: 'pending' | 'approved' | 'rejected' | 'counter_offer' | 'customer_response_pending' | 'completed' | 'cancelled';
  
  // Timeline
  timeline: Array<{
    status: string;
    timestamp: Date;
    actor: mongoose.Types.ObjectId;
    actorType: 'customer' | 'vendor' | 'admin';
    notes?: string;
  }>;
  
  // Communication
  communication: {
    messages: Array<{
      sender: mongoose.Types.ObjectId;
      senderType: 'customer' | 'vendor' | 'admin';
      message: string;
      timestamp: Date;
      attachments?: Array<{
        type: 'image' | 'document' | 'other';
        url: string;
        name: string;
      }>;
    }>;
    lastMessageAt?: Date;
  };
  
  // Approval Process
  approval?: {
    requiresApproval: boolean;
    approvedBy?: mongoose.Types.ObjectId;
    approvedAt?: Date;
    approvalNotes?: string;
    rejectionReason?: string;
  };
  
  // Final Implementation
  implementation?: {
    implementedAt?: Date;
    implementedBy?: mongoose.Types.ObjectId;
    finalData?: {
      eventDate: Date;
      startTime: string;
      endTime: string;
      guestCount: number;
      services: Array<{
        serviceId: mongoose.Types.ObjectId;
        serviceName: string;
        price: number;
      }>;
      location: {
        type: 'vendor_location' | 'client_location' | 'venue';
        address: string;
        city: string;
        state: string;
      };
      totalPrice: number;
    };
    notes?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const BookingModificationSchema = new Schema<IBookingModification>({
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  
  modificationType: {
    type: String,
    enum: ['date_change', 'time_change', 'service_change', 'guest_count_change', 'location_change', 'cancellation', 'reschedule', 'add_service', 'remove_service'],
    required: true
  },
  
  requestedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  
  originalData: {
    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    guestCount: { type: Number, required: true },
    services: [{
      serviceId: { type: Schema.Types.ObjectId, ref: 'VendorService', required: true },
      serviceName: { type: String, required: true },
      price: { type: Number, required: true }
    }],
    location: {
      type: {
        type: String,
        enum: ['vendor_location', 'client_location', 'venue'],
        required: true
      },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true }
    },
    totalPrice: { type: Number, required: true }
  },
  
  requestedChanges: {
    newEventDate: Date,
    newStartTime: String,
    newEndTime: String,
    newGuestCount: Number,
    newServices: [{
      serviceId: { type: Schema.Types.ObjectId, ref: 'VendorService', required: true },
      serviceName: { type: String, required: true },
      price: { type: Number, required: true },
      action: {
        type: String,
        enum: ['add', 'remove', 'modify'],
        required: true
      }
    }],
    newLocation: {
      type: {
        type: String,
        enum: ['vendor_location', 'client_location', 'venue']
      },
      address: String,
      city: String,
      state: String
    },
    reason: { type: String, required: true },
    additionalNotes: String
  },
  
  vendorResponse: {
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'counter_offer']
    },
    respondedAt: Date,
    responseMessage: String,
    counterOffer: {
      newEventDate: Date,
      newStartTime: String,
      newEndTime: String,
      newGuestCount: Number,
      newServices: [{
        serviceId: { type: Schema.Types.ObjectId, ref: 'VendorService', required: true },
        serviceName: { type: String, required: true },
        price: { type: Number, required: true },
        action: {
          type: String,
          enum: ['add', 'remove', 'modify'],
          required: true
        }
      }],
      newLocation: {
        type: {
          type: String,
          enum: ['vendor_location', 'client_location', 'venue']
        },
        address: String,
        city: String,
        state: String
      },
      priceAdjustment: Number,
      reason: String
    }
  },
  
  customerResponse: {
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected']
    },
    respondedAt: Date,
    responseMessage: String
  },
  
  priceImpact: {
    originalPrice: { type: Number, required: true },
    newPrice: Number,
    priceDifference: { type: Number, default: 0 },
    additionalCharges: [{
      description: { type: String, required: true },
      amount: { type: Number, required: true },
      reason: String
    }],
    refundAmount: Number,
    refundReason: String
  },
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'counter_offer', 'customer_response_pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  
  timeline: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    actorType: {
      type: String,
      enum: ['customer', 'vendor', 'admin'],
      required: true
    },
    notes: String
  }],
  
  communication: {
    messages: [{
      sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      senderType: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        required: true
      },
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
    lastMessageAt: Date
  },
  
  approval: {
    requiresApproval: { type: Boolean, default: false },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    approvalNotes: String,
    rejectionReason: String
  },
  
  implementation: {
    implementedAt: Date,
    implementedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    finalData: {
      eventDate: Date,
      startTime: String,
      endTime: String,
      guestCount: Number,
      services: [{
        serviceId: { type: Schema.Types.ObjectId, ref: 'VendorService', required: true },
        serviceName: { type: String, required: true },
        price: { type: Number, required: true }
      }],
      location: {
        type: {
          type: String,
          enum: ['vendor_location', 'client_location', 'venue'],
          required: true
        },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true }
      },
      totalPrice: { type: Number, required: true }
    },
    notes: String
  }
}, {
  timestamps: true
});

// Indexes
BookingModificationSchema.index({ bookingId: 1 });
BookingModificationSchema.index({ requestedBy: 1 });
BookingModificationSchema.index({ modificationType: 1 });
BookingModificationSchema.index({ status: 1 });
BookingModificationSchema.index({ requestedAt: -1 });
BookingModificationSchema.index({ 'vendorResponse.status': 1 });
BookingModificationSchema.index({ 'customerResponse.status': 1 });

// Compound indexes
BookingModificationSchema.index({ bookingId: 1, status: 1 });
BookingModificationSchema.index({ requestedBy: 1, status: 1 });
BookingModificationSchema.index({ modificationType: 1, status: 1 });

// Instance methods
BookingModificationSchema.methods.addTimelineEvent = function(status: string, actor: string, actorType: string, notes?: string) {
  this.timeline.push({
    status,
    timestamp: new Date(),
    actor,
    actorType,
    notes
  });
  return this.save();
};

BookingModificationSchema.methods.addMessage = function(sender: string, senderType: string, message: string, attachments?: any[]) {
  this.communication.messages.push({
    sender,
    senderType,
    message,
    timestamp: new Date(),
    attachments
  });
  this.communication.lastMessageAt = new Date();
  return this.save();
};

BookingModificationSchema.methods.approveModification = function(approvedBy: string, notes?: string) {
  this.status = 'approved';
  this.approval = {
    requiresApproval: true,
    approvedBy,
    approvedAt: new Date(),
    approvalNotes: notes
  };
  this.addTimelineEvent('approved', approvedBy, 'admin', notes);
  return this.save();
};

BookingModificationSchema.methods.rejectModification = function(rejectedBy: string, reason: string) {
  this.status = 'rejected';
  this.approval = {
    requiresApproval: true,
    approvedBy: rejectedBy,
    approvedAt: new Date(),
    rejectionReason: reason
  };
  this.addTimelineEvent('rejected', rejectedBy, 'admin', reason);
  return this.save();
};

export const BookingModification = mongoose.models.BookingModification || mongoose.model('BookingModification', BookingModificationSchema);
