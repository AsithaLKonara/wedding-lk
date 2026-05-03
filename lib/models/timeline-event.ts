import mongoose, { Schema, Document } from 'mongoose';

export interface ITimelineEvent extends Document {
  plannerId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration: number;
  category: 'ceremony' | 'reception' | 'preparation' | 'photography' | 'transportation' | 'other';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  location?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TimelineEventSchema = new Schema<ITimelineEvent>(
  {
    plannerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, default: 60 },
    category: {
      type: String,
      enum: ['ceremony', 'reception', 'preparation', 'photography', 'transportation', 'other'],
      default: 'other'
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    assignedTo: { type: String },
    location: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

export const TimelineEvent = mongoose.models.TimelineEvent || mongoose.model<ITimelineEvent>('TimelineEvent', TimelineEventSchema);
