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
    date: { 
      type: Date, 
      required: true 
    },
    startTime: { 
      type: String 
    },
    endTime: { 
      type: String 
    },
    guestCount: { 
      type: Number, 
      min: 1 
    },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "cancelled", "completed"], 
      default: "pending" 
    },
    totalAmount: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    depositAmount: { 
      type: Number, 
      min: 0 
    },
    depositPaid: { 
      type: Boolean, 
      default: false 
    },
    notes: { 
      type: String 
    },
    specialRequirements: { 
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
BookingSchema.index({ user: 1, date: -1 })
BookingSchema.index({ vendor: 1, date: -1 })
BookingSchema.index({ venue: 1, date: -1 })
BookingSchema.index({ status: 1 })
BookingSchema.index({ date: 1 })

export const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema)

export interface IBooking extends mongoose.Document {
  user: mongoose.Types.ObjectId
  vendor?: mongoose.Types.ObjectId
  venue?: mongoose.Types.ObjectId
  date: Date
  startTime?: string
  endTime?: string
  guestCount?: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  totalAmount: number
  depositAmount?: number
  depositPaid: boolean
  notes?: string
  specialRequirements?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
