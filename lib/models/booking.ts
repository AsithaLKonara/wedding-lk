import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema({
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  guests: { type: Number, required: true },
  contactInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  message: { type: String },
  status: { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" },
  totalAmount: { type: Number },
  createdAt: { type: Date, default: Date.now },
})

export const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema) 