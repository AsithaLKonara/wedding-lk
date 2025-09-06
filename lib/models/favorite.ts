import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  userId: string;
  itemId: string;
  type: 'venue' | 'vendor' | 'package';
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  itemId: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['venue', 'vendor', 'package']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicates
FavoriteSchema.index({ userId: 1, itemId: 1, type: 1 }, { unique: true });

export const Favorite = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);
