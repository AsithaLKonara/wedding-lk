import mongoose, { Schema, Document } from 'mongoose';

const SystemSettingsSchema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
  description: { type: String },
  category: { type: String, default: 'general' }
}, { timestamps: true });

export const SystemSettings = mongoose.models.SystemSettings || mongoose.model('SystemSettings', SystemSettingsSchema);
