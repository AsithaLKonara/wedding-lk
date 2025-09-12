import mongoose, { Document, Schema } from 'mongoose';

export interface IBoostPackage extends Document {
  name: string;
  description: string;
  type: 'featured' | 'premium' | 'sponsored';
  price: number;
  currency: string;
  duration: number; // in days
  features: string[];
  maxImpressions?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BoostPackageSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['featured', 'premium', 'sponsored'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'LKR',
    enum: ['LKR', 'USD']
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 365 // Maximum 1 year
  },
  features: [{
    type: String,
    trim: true
  }],
  maxImpressions: {
    type: Number,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
BoostPackageSchema.index({ type: 1, isActive: 1 });
BoostPackageSchema.index({ price: 1 });
BoostPackageSchema.index({ isActive: 1 });

export const BoostPackage = mongoose.model<IBoostPackage>('BoostPackage', BoostPackageSchema);



