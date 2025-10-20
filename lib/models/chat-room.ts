import mongoose, { Document, Schema } from 'mongoose'

export interface IChatRoom extends Document {
  _id: string
  name: string
  description?: string
  participants: string[]
  isActive: boolean
  isGroup: boolean
  lastMessage?: {
    content: string
    senderId: string
    timestamp: Date
  }
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

const ChatRoomSchema = new Schema<IChatRoom>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  participants: [{
    type: String,
    required: true,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isGroup: {
    type: Boolean,
    default: false
  },
  lastMessage: {
    content: String,
    senderId: {
      type: String,
      ref: 'User'
    },
    timestamp: Date
  },
  createdBy: {
    type: String,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Indexes for better performance
ChatRoomSchema.index({ participants: 1 })
ChatRoomSchema.index({ isActive: 1 })
ChatRoomSchema.index({ createdAt: -1 })

export const ChatRoom = mongoose.models.ChatRoom || mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema)