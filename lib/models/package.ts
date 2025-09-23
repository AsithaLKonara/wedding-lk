import mongoose from "mongoose"

const PackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["premium", "luxury", "essential", "custom"],
  },
  features: [{
    name: {
      type: String,
      required: true,
    },
    included: {
      type: Boolean,
      default: true,
    },
    description: String,
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  capacity: {
    min: {
      type: Number,
      default: 50,
    },
    max: {
      type: Number,
      default: 500,
    },
  },
  location: {
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false,
    },
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  isPopular: {
    type: Boolean,
    default: false,
  },
  discount: {
    percentage: {
      type: Number,
      default: 0,
    },
    validUntil: Date,
  },
  availability: {
    startDate: Date,
    endDate: Date,
    blackoutDates: [Date],
  },
  terms: {
    cancellation: String,
    payment: String,
    refund: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
PackageSchema.pre("save", function (next) {
  this.updatedAt = new Date()
  next()
})

// Calculate average rating
PackageSchema.methods.calculateRating = function () {
  if (this.reviews.length === 0) return 0
  const sum = this.reviews.reduce((acc: number, review: any) => acc + review.rating, 0)
  this.rating = sum / this.reviews.length
  return this.rating
}

// Check if package is available for given date
PackageSchema.methods.isAvailable = function (date: Date) {
  if (!this.availability) return true
  
  const checkDate = new Date(date)
  
  // Check if date is within availability range
  if (this.availability.startDate && checkDate < this.availability.startDate) return false
  if (this.availability.endDate && checkDate > this.availability.endDate) return false
  
  // Check blackout dates
  if (this.availability.blackoutDates) {
    const isBlackout = this.availability.blackoutDates.some((blackoutDate: Date) => 
      new Date(blackoutDate).toDateString() === checkDate.toDateString()
    )
    if (isBlackout) return false
  }
  
  return true
}

// Calculate savings percentage
PackageSchema.virtual("savingsPercentage").get(function () {
  if (this.originalPrice <= this.price) return 0
  return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100)
})

// Ensure virtual fields are serialized
PackageSchema.set("toJSON", { virtuals: true })
PackageSchema.set("toObject", { virtuals: true })

export const Package = mongoose.models.Package || mongoose.model("Package", PackageSchema)
