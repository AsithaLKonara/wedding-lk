import mongoose from "mongoose"

const VenueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    capacity: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    pricing: {
      basePrice: { type: Number, required: true },
      currency: { type: String, default: "LKR" },
      pricePerGuest: { type: Number },
    },
    amenities: [{ type: String }],
    images: [{ type: String }],
    availability: [
      {
        date: { type: Date },
        isAvailable: { type: Boolean, default: true },
      },
    ],
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true },
        comment: { type: String },
        images: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export const Venue = mongoose.models.Venue || mongoose.model("Venue", VenueSchema)
