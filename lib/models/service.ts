import mongoose, { Schema, Document } from 'mongoose'

export interface IService extends Document {
  vendor: mongoose.Types.ObjectId
  name: string
  description: string
  category: string
  price: number
  priceType: 'fixed' | 'per-person' | 'per-hour'
  duration?: number // in hours
  isActive: boolean
  images?: string[]
  features?: string[]
  requirements?: string[]
  createdAt: Date
  updatedAt: Date
}

const serviceSchema = new Schema<IService>({
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  priceType: {
    type: String,
    enum: ['fixed', 'per-person', 'per-hour'],
    default: 'fixed'
  },
  duration: {
    type: Number,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  images: [{
    type: String
  }],
  features: [{
    type: String
  }],
  requirements: [{
    type: String
  }]
}, {
  timestamps: true
})

// Indexes
serviceSchema.index({ vendor: 1, category: 1 })
serviceSchema.index({ isActive: 1, category: 1 })
serviceSchema.index({ name: 'text', description: 'text' })

export const Service = mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema) 