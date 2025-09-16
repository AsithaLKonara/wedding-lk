import mongoose, { Document, Schema } from 'mongoose';

export interface IPlanningTask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  category: string;
  dueDate?: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlanningTaskSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'venue',
        'photography',
        'music',
        'flowers',
        'catering',
        'transportation',
        'attire',
        'gifts',
        'cake',
        'rings',
        'other'
      ],
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    assignedTo: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PlanningTaskSchema.index({ userId: 1, completed: 1 });
PlanningTaskSchema.index({ userId: 1, category: 1 });
PlanningTaskSchema.index({ userId: 1, dueDate: 1 });
PlanningTaskSchema.index({ userId: 1, priority: 1 });

export const PlanningTask = mongoose.models.PlanningTask || mongoose.model<IPlanningTask>('PlanningTask', PlanningTaskSchema);
export default PlanningTask;
