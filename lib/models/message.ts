import mongoose from "mongoose"

const MessageSchema = new mongoose.Schema(
  {
    sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    receiver: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    conversationId: { 
      type: String, 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    messageType: { 
      type: String, 
      enum: ["text", "image", "file", "audio"], 
      default: "text" 
    },
    isRead: { 
      type: Boolean, 
      default: false 
    },
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
    attachments: [{ 
      type: String 
    }],
    replyTo: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Message" 
    }
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient queries
MessageSchema.index({ conversationId: 1, createdAt: -1 })
MessageSchema.index({ sender: 1, createdAt: -1 })
MessageSchema.index({ receiver: 1, createdAt: -1 })
MessageSchema.index({ isRead: 1 })

export const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema)

export interface IMessage extends mongoose.Document {
  sender: mongoose.Types.ObjectId
  receiver: mongoose.Types.ObjectId
  conversationId: string
  content: string
  messageType: 'text' | 'image' | 'file' | 'audio'
  isRead: boolean
  isDeleted: boolean
  attachments?: string[]
  replyTo?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}
