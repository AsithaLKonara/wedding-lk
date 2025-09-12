import mongoose, { Document, Schema } from 'mongoose';

export interface IGuestList extends Document {
  // Wedding Information
  weddingId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Wedding couple
  weddingDate: Date;
  weddingLocation: string;
  
  // Guest Information
  guests: {
    id: string; // Unique ID for each guest
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    relationship: 'family' | 'friend' | 'colleague' | 'other';
    side: 'bride' | 'groom' | 'both' | 'other';
    isPlusOne: boolean;
    plusOneName?: string;
    plusOneEmail?: string;
    plusOnePhone?: string;
    
    // RSVP Information
    rsvpStatus: 'pending' | 'attending' | 'not_attending' | 'maybe';
    rsvpDate?: Date;
    rsvpNotes?: string;
    
    // Dietary Requirements
    dietaryRequirements: string[];
    allergies: string[];
    specialRequests: string;
    
    // Seating Information
    tableNumber?: number;
    seatNumber?: number;
    seatingGroup?: string; // e.g., 'family', 'friends', 'colleagues'
    
    // Contact Information
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    
    // Gift Information
    giftReceived: boolean;
    giftDescription?: string;
    giftValue?: number;
    thankYouSent: boolean;
    
    // Additional Information
    notes: string;
    tags: string[];
    priority: 'high' | 'medium' | 'low';
    isVip: boolean;
  }[];
  
  // Guest List Settings
  settings: {
    allowPlusOnes: boolean;
    maxPlusOnes: number;
    rsvpDeadline: Date;
    requireDietaryInfo: boolean;
    allowGiftTracking: boolean;
    sendReminders: boolean;
    reminderDays: number[]; // Days before wedding to send reminders
  };
  
  // Statistics
  statistics: {
    totalInvited: number;
    totalAttending: number;
    totalNotAttending: number;
    totalPending: number;
    totalPlusOnes: number;
    responseRate: number; // Percentage
    lastUpdated: Date;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const GuestListSchema: Schema = new Schema({
  // Wedding Information
  weddingId: {
    type: Schema.Types.ObjectId,
    ref: 'Wedding',
    required: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  weddingDate: {
    type: Date,
    required: true,
    index: true
  },
  weddingLocation: {
    type: String,
    required: true,
    trim: true
  },
  
  // Guest Information
  guests: [{
    id: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 100
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20
    },
    relationship: {
      type: String,
      required: true,
      enum: ['family', 'friend', 'colleague', 'other'],
      default: 'friend'
    },
    side: {
      type: String,
      required: true,
      enum: ['bride', 'groom', 'both', 'other'],
      default: 'both'
    },
    isPlusOne: {
      type: Boolean,
      default: false
    },
    plusOneName: {
      type: String,
      trim: true,
      maxlength: 100
    },
    plusOneEmail: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 100
    },
    plusOnePhone: {
      type: String,
      trim: true,
      maxlength: 20
    },
    
    // RSVP Information
    rsvpStatus: {
      type: String,
      required: true,
      enum: ['pending', 'attending', 'not_attending', 'maybe'],
      default: 'pending'
    },
    rsvpDate: {
      type: Date
    },
    rsvpNotes: {
      type: String,
      maxlength: 500,
      trim: true
    },
    
    // Dietary Requirements
    dietaryRequirements: [{
      type: String,
      trim: true,
      maxlength: 50
    }],
    allergies: [{
      type: String,
      trim: true,
      maxlength: 50
    }],
    specialRequests: {
      type: String,
      maxlength: 500,
      trim: true
    },
    
    // Seating Information
    tableNumber: {
      type: Number,
      min: 1
    },
    seatNumber: {
      type: Number,
      min: 1
    },
    seatingGroup: {
      type: String,
      trim: true,
      maxlength: 50
    },
    
    // Contact Information
    address: {
      street: {
        type: String,
        trim: true,
        maxlength: 100
      },
      city: {
        type: String,
        trim: true,
        maxlength: 50
      },
      state: {
        type: String,
        trim: true,
        maxlength: 50
      },
      zipCode: {
        type: String,
        trim: true,
        maxlength: 20
      },
      country: {
        type: String,
        trim: true,
        maxlength: 50
      }
    },
    
    // Gift Information
    giftReceived: {
      type: Boolean,
      default: false
    },
    giftDescription: {
      type: String,
      trim: true,
      maxlength: 200
    },
    giftValue: {
      type: Number,
      min: 0
    },
    thankYouSent: {
      type: Boolean,
      default: false
    },
    
    // Additional Information
    notes: {
      type: String,
      maxlength: 500,
      trim: true
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: 30
    }],
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    isVip: {
      type: Boolean,
      default: false
    }
  }],
  
  // Guest List Settings
  settings: {
    allowPlusOnes: {
      type: Boolean,
      default: true
    },
    maxPlusOnes: {
      type: Number,
      default: 1,
      min: 0
    },
    rsvpDeadline: {
      type: Date,
      required: true
    },
    requireDietaryInfo: {
      type: Boolean,
      default: false
    },
    allowGiftTracking: {
      type: Boolean,
      default: true
    },
    sendReminders: {
      type: Boolean,
      default: true
    },
    reminderDays: [{
      type: Number,
      min: 1,
      max: 365
    }]
  },
  
  // Statistics
  statistics: {
    totalInvited: {
      type: Number,
      default: 0
    },
    totalAttending: {
      type: Number,
      default: 0
    },
    totalNotAttending: {
      type: Number,
      default: 0
    },
    totalPending: {
      type: Number,
      default: 0
    },
    totalPlusOnes: {
      type: Number,
      default: 0
    },
    responseRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
GuestListSchema.index({ userId: 1, weddingDate: -1 });
GuestListSchema.index({ 'guests.rsvpStatus': 1 });
GuestListSchema.index({ 'guests.email': 1 });
GuestListSchema.index({ 'guests.phone': 1 });

// Virtual for full name
GuestListSchema.virtual('guests.fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to update statistics
GuestListSchema.methods.updateStatistics = function() {
  const guests = this.guests;
  
  this.statistics.totalInvited = guests.length;
  this.statistics.totalAttending = guests.filter(g => g.rsvpStatus === 'attending').length;
  this.statistics.totalNotAttending = guests.filter(g => g.rsvpStatus === 'not_attending').length;
  this.statistics.totalPending = guests.filter(g => g.rsvpStatus === 'pending').length;
  this.statistics.totalPlusOnes = guests.filter(g => g.isPlusOne).length;
  
  const responded = this.statistics.totalAttending + this.statistics.totalNotAttending;
  this.statistics.responseRate = this.statistics.totalInvited > 0 
    ? Math.round((responded / this.statistics.totalInvited) * 100) 
    : 0;
  
  this.statistics.lastUpdated = new Date();
};

// Pre-save middleware to update statistics
GuestListSchema.pre('save', function() {
  this.updateStatistics();
});

export const GuestList = mongoose.models.GuestList || mongoose.model<IGuestList>('GuestList', GuestListSchema);

