import mongoose from "mongoose"

const PaymentSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
    vendor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Vendor" 
    },
    venue: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Venue" 
    },
    booking: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Booking" 
    },
    amount: { 
      type: Number, 
      required: true, 
      min: 0 
    },
    currency: { 
      type: String, 
      default: "LKR" 
    },
    status: { 
      type: String, 
      enum: ["pending", "processing", "completed", "failed", "refunded"], 
      default: "pending" 
    },
    type: { 
      type: String, 
      enum: ["booking", "ads_payment", "ads_subscription", "subscription"], 
      default: "booking" 
    },
    paymentMethod: { 
      type: String, 
      required: true 
    },
    transactionId: { 
      type: String
    },
    stripePaymentIntentId: { 
      type: String
    },
    stripeSubscriptionId: { 
      type: String
    },
    stripeCustomerId: { 
      type: String
    },
    gatewayResponse: { 
      type: mongoose.Schema.Types.Mixed 
    },
    description: { 
      type: String 
    },
    metadata: { 
      type: mongoose.Schema.Types.Mixed 
    },
    completedAt: { 
      type: Date 
    }
  },
  {
    timestamps: true,
  }
)

// Index for efficient queries
PaymentSchema.index({ user: 1, createdAt: -1 })
PaymentSchema.index({ vendor: 1, createdAt: -1 })
PaymentSchema.index({ venue: 1, createdAt: -1 })
PaymentSchema.index({ status: 1 })
PaymentSchema.index({ transactionId: 1 }, { unique: true })
PaymentSchema.index({ createdAt: -1 })

export const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema)

export interface IPayment extends mongoose.Document {
  user: mongoose.Types.ObjectId
  userId?: mongoose.Types.ObjectId
  vendor?: mongoose.Types.ObjectId
  venue?: mongoose.Types.ObjectId
  booking?: mongoose.Types.ObjectId
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  type: 'booking' | 'ads_payment' | 'ads_subscription' | 'subscription'
  paymentMethod: string
  transactionId?: string
  stripePaymentIntentId?: string
  stripeSubscriptionId?: string
  stripeCustomerId?: string
  gatewayResponse?: any
  description?: string
  metadata?: Record<string, any>
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
} 