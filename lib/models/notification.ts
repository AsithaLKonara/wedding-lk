import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    type: { 
      type: String, 
      enum: [
        "info", "success", "warning", "error",
        "booking_request", "booking_status_update", "new_review",
        "payment_received", "new_message", "service_updated",
        "user_status_changed", "vendor_approved", "vendor_rejected"
      ], 
      default: "info" 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    actionUrl: { 
      type: String 
    },
    actionText: { 
      type: String 
    },
    metadata: { 
      type: mongoose.Schema.Types.Mixed 
    }
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient queries
NotificationSchema.index({ user: 1, createdAt: -1 })
NotificationSchema.index({ user: 1, isRead: 1 })
NotificationSchema.index({ isActive: 1 })

export const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema)

export interface INotification extends mongoose.Document {
  user: mongoose.Types.ObjectId
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 
         'booking_request' | 'booking_status_update' | 'new_review' |
         'payment_received' | 'new_message' | 'service_updated' |
         'user_status_changed' | 'vendor_approved' | 'vendor_rejected'
  isRead: boolean
  isActive: boolean
  actionUrl?: string
  actionText?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}
