import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ["couple", "vendor", "planner", "admin"], required: true },
    weddingDate: { type: Date },
    profileImage: { type: String },
    isVerified: { type: Boolean, default: false },
    subscription: {
      plan: { type: String, enum: ["free", "premium", "pro"], default: "free" },
      expiresAt: { type: Date },
    },
    preferences: {
      budget: { type: Number },
      location: { type: String },
      guestCount: { type: Number },
      weddingStyle: { type: String },
    },
    favorites: {
      venues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Venue" }],
      vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }],
    },
    twoFactorEnabled: { type: Boolean },
    twoFactorSecret: { type: String },
    twoFactorTemp: { type: String },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date },
  },
  {
    timestamps: true,
  },
)

// Set twoFactorEnabled default true for vendors and admins
UserSchema.pre("save", function (next) {
  if (this.isNew && (this.userType === "vendor" || this.userType === "admin")) {
    this.twoFactorEnabled = true
  } else if (this.isNew && (this.userType === "couple" || this.userType === "planner")) {
    this.twoFactorEnabled = false
  }
  next()
})

export const User = mongoose.models.User || mongoose.model("User", UserSchema)
