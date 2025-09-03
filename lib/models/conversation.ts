import mongoose from "mongoose"

const ConversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["couple", "vendor", "planner", "admin"],
          required: true,
        },
        isActive: {
          type: Boolean,
          default: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        leftAt: {
          type: Date,
        },
      },
    ],
    conversationType: {
      type: String,
      enum: ["direct", "group", "booking", "support"],
      default: "direct",
    },
    title: {
      type: String,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    lastMessage: {
      content: { type: String },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      timestamp: { type: Date },
      messageType: { type: String },
    },
    unreadCounts: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        count: {
          type: Number,
          default: 0,
        },
        lastReadAt: {
          type: Date,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    archivedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        archivedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    pinnedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        pinnedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    settings: {
      allowFileSharing: {
        type: Boolean,
        default: true,
      },
      allowReactions: {
        type: Boolean,
        default: true,
      },
      allowEditing: {
        type: Boolean,
        default: true,
      },
      allowDeletion: {
        type: Boolean,
        default: true,
      },
      maxFileSize: {
        type: Number,
        default: 10 * 1024 * 1024, // 10MB
      },
      allowedFileTypes: {
        type: [String],
        default: ["image/jpeg", "image/png", "image/gif", "application/pdf", "text/plain"],
      },
    },
    metadata: {
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      purpose: {
        type: String,
        enum: ["general", "booking", "support", "planning"],
        default: "general",
      },
      tags: [String],
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
ConversationSchema.index({ participants: 1, isActive: 1 })
ConversationSchema.index({ bookingId: 1, isActive: 1 })
ConversationSchema.index({ venueId: 1, isActive: 1 })
ConversationSchema.index({ vendorId: 1, isActive: 1 })
ConversationSchema.index({ "lastMessage.timestamp": -1 })

// Virtual for conversation title
ConversationSchema.virtual("displayTitle").get(function () {
  if (this.title) return this.title
  
  if (this.conversationType === "direct" && this.participants.length === 2) {
    // For direct conversations, show the other participant's name
    return "Direct Message"
  }
  
  if (this.bookingId) {
    return `Booking Conversation`
  }
  
  return "Group Conversation"
})

// Pre-save middleware
ConversationSchema.pre("save", function (next) {
  // Ensure participants are unique
  const participantIds = this.participants.map(p => p.user.toString())
  const uniqueIds = [...new Set(participantIds)]
  
  if (participantIds.length !== uniqueIds.length) {
    const error = new Error("Duplicate participants are not allowed")
    return next(error)
  }
  
  next()
})

// Static method to find or create conversation
ConversationSchema.statics.findOrCreateConversation = async function (participants: any[], options: any = {}) {
  const { conversationType = "direct", bookingId, venueId, vendorId, title, description } = options
  
  // For direct conversations, find existing conversation
  if (conversationType === "direct" && participants.length === 2) {
    const existingConversation = await this.findOne({
      conversationType: "direct",
      "participants.user": { $all: participants.map(p => p.user) },
      "participants": { $size: 2 },
      isActive: true,
    }).populate("participants.user", "firstName lastName email")
    
    if (existingConversation) {
      return existingConversation
    }
  }
  
  // Create new conversation
  const conversation = new this({
    participants,
    conversationType,
    bookingId,
    venueId,
    vendorId,
    title,
    description,
  })
  
  return conversation.save()
}

// Static method to get user conversations
ConversationSchema.statics.getUserConversations = async function (userId: string, options: any = {}) {
  const { limit = 20, offset = 0, includeArchived = false } = options
  
  const query: any = {
    "participants.user": userId,
    isActive: true,
  }
  
  if (!includeArchived) {
    query.isArchived = false
  }
  
  return this.find(query)
    .populate("participants.user", "firstName lastName email profileImage userType")
    .populate("lastMessage.sender", "firstName lastName")
    .populate("bookingId", "bookingNumber date")
    .populate("venueId", "name")
    .populate("vendorId", "businessName")
    .sort({ "lastMessage.timestamp": -1, updatedAt: -1 })
    .limit(limit)
    .skip(offset)
}

// Instance method to add participant
ConversationSchema.methods.addParticipant = function (userId: string, role: string) {
  const existingParticipant = this.participants.find((p: any) => p.user.toString() === userId)
  
  if (existingParticipant) {
    if (!existingParticipant.isActive) {
      existingParticipant.isActive = true
      existingParticipant.leftAt = undefined
    }
  } else {
    this.participants.push({
      user: userId,
      role,
      isActive: true,
      joinedAt: new Date(),
    })
  }
  
  return this.save()
}

// Instance method to remove participant
ConversationSchema.methods.removeParticipant = function (userId: string) {
  const participant = this.participants.find((p: any) => p.user.toString() === userId)
  
  if (participant) {
    participant.isActive = false
    participant.leftAt = new Date()
  }
  
  return this.save()
}

// Instance method to update last message
ConversationSchema.methods.updateLastMessage = function (message: any) {
  this.lastMessage = {
    content: message.content,
    sender: message.sender,
    timestamp: message.createdAt || new Date(),
    messageType: message.messageType,
  }
  
  // Update unread counts for other participants
  this.participants.forEach((participant: any) => {
    if (participant.user.toString() !== message.sender.toString() && participant.isActive) {
              const unreadEntry = this.unreadCounts.find((u: any) => u.user.toString() === participant.user.toString())
      
      if (unreadEntry) {
        unreadEntry.count += 1
      } else {
        this.unreadCounts.push({
          user: participant.user,
          count: 1,
        })
      }
    }
  })
  
  return this.save()
}

// Instance method to mark as read
ConversationSchema.methods.markAsRead = function (userId: string) {
  const unreadEntry = this.unreadCounts.find((u: any) => u.user.toString() === userId)
  
  if (unreadEntry) {
    unreadEntry.count = 0
    unreadEntry.lastReadAt = new Date()
  }
  
  return this.save()
}

// Instance method to archive conversation
ConversationSchema.methods.archive = function (userId: string) {
  this.isArchived = true
  this.archivedBy.push({
    user: userId,
    archivedAt: new Date(),
  })
  
  return this.save()
}

// Instance method to pin conversation
ConversationSchema.methods.pin = function (userId: string) {
  const existingPin = this.pinnedBy.find((p: any) => p.user.toString() === userId)
  
  if (!existingPin) {
    this.pinnedBy.push({
      user: userId,
      pinnedAt: new Date(),
    })
  }
  
  return this.save()
}

// Instance method to unpin conversation
ConversationSchema.methods.unpin = function (userId: string) {
  this.pinnedBy = this.pinnedBy.filter((p: any) => p.user.toString() !== userId)
  return this.save()
}

export const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema) 