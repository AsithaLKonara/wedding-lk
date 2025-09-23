import mongoose from "mongoose"

const VendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    businessName: { type: String, required: true },
    category: {
      type: String,
      enum: ["photographer", "decorator", "catering", "music", "transport", "makeup", "jewelry", "clothing"],
      required: true,
    },
    description: { type: String, required: true },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
      serviceAreas: [{ type: String }],
    },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
      website: { type: String },
      socialMedia: {
        facebook: { type: String },
        instagram: { type: String },
        youtube: { type: String },
      },
    },
    services: [
      {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number },
        duration: { type: String },
      },
    ],
    portfolio: [{ type: String }],
    pricing: {
      startingPrice: { type: Number, required: true },
      currency: { type: String, default: "LKR" },
      packages: [
        {
          name: { type: String },
          price: { type: Number },
          features: [{ type: String }],
        },
      ],
    },
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
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    onboardingComplete: { type: Boolean, default: false },
    subscription: {
      plan: { type: String, enum: ["basic", "premium", "pro"], default: "basic" },
      expiresAt: { type: Date },
    },
  },
  {
    timestamps: true,
  },
)

export const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", VendorSchema)
