import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    vendor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Vendor" 
    },
    venue: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Venue" 
    },
    planner: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    service: {
      name: String,
      description: String,
      price: Number
    },
    eventDate: { 
      type: Date, 
      required: true 
    },
    eventTime: { 
      type: String 
    },
    duration: { 
      type: Number 
    },
    guestCount: { 
      type: Number, 
      min: 1 
    },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "cancelled", "completed", "in_progress"], 
      default: "pending" 
    },
    payment: {
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, default: 'LKR' },
      status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
      method: { type: String, enum: ['bank_transfer', 'card', 'cash'], default: 'bank_transfer' },
      transactionId: String
    },
    notes: { 
      type: String 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient queries
BookingSchema.index({ user: 1, eventDate: -1 })
BookingSchema.index({ vendor: 1, eventDate: -1 })
BookingSchema.index({ venue: 1, eventDate: -1 })
BookingSchema.index({ status: 1 })
BookingSchema.index({ eventDate: 1 })

export const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema)

export interface IBooking extends mongoose.Document {
  user: mongoose.Types.ObjectId
  vendor?: mongoose.Types.ObjectId
  venue?: mongoose.Types.ObjectId
  planner?: mongoose.Types.ObjectId
  service?: {
    name: string
    description: string
    price: number
  }
  eventDate: Date
  eventTime?: string
  duration?: number
  guestCount?: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'in_progress'
  payment: {
    amount: number
    currency: string
    status: 'pending' | 'completed' | 'failed' | 'refunded'
    method: 'bank_transfer' | 'card' | 'cash'
    transactionId?: string
  }
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
