import mongoose, { Schema, Document } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  features: string[];
  venues: string[];
  vendors: string[];
  featured: boolean;
  rating: {
    average: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>({
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
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  features: [{
    type: String,
    trim: true
  }],
  venues: [{
    type: Schema.Types.ObjectId,
    ref: 'Venue'
  }],
  vendors: [{
    type: Schema.Types.ObjectId,
    ref: 'Vendor'
  }],
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
PackageSchema.index({ featured: -1, createdAt: -1 });
PackageSchema.index({ price: 1 });
PackageSchema.index({ 'rating.average': -1 });

export const Package = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);
