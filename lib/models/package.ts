import mongoose, { Schema, Document } from 'mongoose'

export interface IPackage extends Document {
  name: string
  description: string
  price: number
  features: Record<string, boolean>
  category: string
  images: string[]
  rating: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const PackageSchema = new Schema<IPackage>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  features: {
    type: Map,
    of: Boolean,
    default: {}
  },
  category: {
    type: String,
    required: true,
    enum: ['Premium', 'Standard', 'Basic', 'Custom']
  },
  images: [{
    type: String,
    required: false
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Indexes for better query performance
PackageSchema.index({ category: 1 })
PackageSchema.index({ price: 1 })
PackageSchema.index({ rating: -1 })
PackageSchema.index({ isActive: 1 })

export const Package = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema)