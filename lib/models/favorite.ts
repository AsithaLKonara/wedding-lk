import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  type: 'venue' | 'vendor' | 'package' | 'service';
  category?: string; // For organizing wishlists
  notes?: string; // User notes about this item
  priority: 'low' | 'medium' | 'high'; // Priority for comparison
  tags: string[]; // Custom tags for organization
  isForComparison: boolean; // Marked for comparison
  comparisonGroup?: string; // Group items for comparison
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  itemId: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['venue', 'vendor', 'package', 'service'],
    index: true
  },
  category: {
    type: String,
    trim: true,
    maxlength: 50
  },
  notes: {
    type: String,
    maxlength: 500,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  isForComparison: {
    type: Boolean,
    default: false,
    index: true
  },
  comparisonGroup: {
    type: String,
    trim: true,
    maxlength: 50
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicates
FavoriteSchema.index({ userId: 1, itemId: 1, type: 1 }, { unique: true });

// Indexes for performance
FavoriteSchema.index({ userId: 1, type: 1, createdAt: -1 });
FavoriteSchema.index({ userId: 1, isForComparison: 1 });
FavoriteSchema.index({ userId: 1, comparisonGroup: 1 });

export const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);

