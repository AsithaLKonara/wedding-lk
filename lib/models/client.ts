import mongoose from "mongoose"

const ClientSchema = new mongoose.Schema({
  plannerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  weddingDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
})

export const Client = mongoose.models.Client || mongoose.model("Client", ClientSchema) 