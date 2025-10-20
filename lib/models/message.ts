import mongoose, { Document, Schema } from 'mongoose'

export interface IMessage extends Document {
  _id: string
  content: string
  senderId: string
  roomId: string
  messageType: 'text' | 'image' | 'file' | 'system'
  isRead: boolean
  readBy: string[]
  attachments?: {
    url: string
    type: string
    name: string
    size: number
  }[]
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>({
  content: {
    type: String,
    required: true,
    trim: true
  },
  senderId: {
    type: String,
    required: true,
    ref: 'User'
  },
  roomId: {
    type: String,
    required: true,
    ref: 'ChatRoom'
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'system'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readBy: [{
    type: String,
    ref: 'User'
  }],
  attachments: [{
    url: String,
    type: String,
    name: String,
    size: Number
  }]
}, {
  timestamps: true
})

// Indexes for better performance
MessageSchema.index({ roomId: 1, createdAt: -1 })
MessageSchema.index({ senderId: 1 })
MessageSchema.index({ isRead: 1 })

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)