import mongoose, { Schema, Document } from 'mongoose';

export interface IBudgetItem extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  name: string;
  estimatedCost: number;
  actualCost: number;
  paid: number;
  status: 'planned' | 'booked' | 'paid' | 'completed';
  notes?: string;
  vendor?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BudgetItemSchema = new Schema<IBudgetItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, required: true },
    name: { type: String, required: true },
    estimatedCost: { type: Number, default: 0 },
    actualCost: { type: Number, default: 0 },
    paid: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['planned', 'booked', 'paid', 'completed'],
      default: 'planned'
    },
    notes: { type: String },
    vendor: { type: String },
    dueDate: { type: Date }
  },
  { timestamps: true }
);

export const BudgetItem = mongoose.models.BudgetItem || mongoose.model<IBudgetItem>('BudgetItem', BudgetItemSchema);
