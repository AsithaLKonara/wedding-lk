import mongoose from "mongoose"

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["booking", "vendor", "system", "marketing", "reminder"],
  },
  category: {
    type: String,
    required: true,
    enum: ["email", "sms", "push", "in_app"],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isSent: {
    type: Boolean,
    default: false,
  },
  sentAt: Date,
  readAt: Date,
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
NotificationSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

// Index for efficient queries
NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 })
NotificationSchema.index({ type: 1, category: 1 })
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

// Static method to create notification
NotificationSchema.statics.createNotification = async function (notificationData: any) {
  const notification = new this(notificationData)
  return await notification.save()
}

// Instance method to mark as read
NotificationSchema.methods.markAsRead = function () {
  this.isRead = true
  this.readAt = new Date()
  return this.save()
}

// Instance method to mark as sent
NotificationSchema.methods.markAsSent = function () {
  this.isSent = true
  this.sentAt = new Date()
  return this.save()
}

export const Notification = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema)
