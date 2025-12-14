import { z } from "zod"

// User validation schemas
export const userRegistrationSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    userType: z.enum(["couple", "vendor", "venue_owner"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Venue validation schemas
export const venueSchema = z.object({
  name: z.string().min(2, "Venue name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  location: z.object({
    address: z.string().min(5, "Address must be at least 5 characters"),
    district: z.string().min(1, "District is required"),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
  capacity: z.object({
    min: z.number().min(1, "Minimum capacity must be at least 1"),
    max: z.number().min(1, "Maximum capacity must be at least 1"),
  }),
  pricing: z.object({
    basePrice: z.number().min(0, "Base price must be positive"),
    currency: z.string().default("LKR"),
    packages: z
      .array(
        z.object({
          name: z.string(),
          price: z.number(),
          description: z.string(),
          inclusions: z.array(z.string()),
        }),
      )
      .optional(),
  }),
  amenities: z.array(z.string()),
  images: z.array(z.string()).min(1, "At least one image is required"),
  availability: z
    .array(
      z.object({
        date: z.string(),
        isAvailable: z.boolean(),
      }),
    )
    .optional(),
  contactInfo: z.object({
    phone: z.string(),
    email: z.string().email(),
    website: z.string().url().optional(),
  }),
})

// Vendor validation schemas
export const vendorSchema = z.object({
  name: z.string().min(2, "Vendor name must be at least 2 characters"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  services: z.array(z.string()).min(1, "At least one service is required"),
  location: z.object({
    district: z.string().min(1, "District is required"),
    serviceAreas: z.array(z.string()),
  }),
  pricing: z.object({
    startingPrice: z.number().min(0, "Starting price must be positive"),
    currency: z.string().default("LKR"),
    packages: z
      .array(
        z.object({
          name: z.string(),
          price: z.number(),
          description: z.string(),
          inclusions: z.array(z.string()),
        }),
      )
      .optional(),
  }),
  portfolio: z.array(z.string()),
  contactInfo: z.object({
    phone: z.string(),
    email: z.string().email(),
    website: z.string().url().optional(),
    socialMedia: z
      .object({
        facebook: z.string().url().optional(),
        instagram: z.string().url().optional(),
        youtube: z.string().url().optional(),
      })
      .optional(),
  }),
  experience: z.number().min(0, "Experience must be positive"),
  certifications: z.array(z.string()).optional(),
})

// Booking validation schemas
export const bookingSchema = z.object({
  venueId: z.string().min(1, "Venue ID is required"),
  vendorIds: z.array(z.string()).optional(),
  eventDate: z.string().min(1, "Event date is required"),
  guestCount: z.number().min(1, "Guest count must be at least 1"),
  eventType: z.enum(["wedding", "engagement", "homecoming", "other"]),
  specialRequests: z.string().optional(),
  contactInfo: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
  }),
  budget: z.object({
    min: z.number().min(0, "Minimum budget must be positive"),
    max: z.number().min(0, "Maximum budget must be positive"),
  }),
})

// Search validation schemas
export const searchSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  priceRange: z
    .object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    })
    .optional(),
  date: z.string().optional(),
  guestCount: z.number().min(1).optional(),
  amenities: z.array(z.string()).optional(),
  sortBy: z.enum(["price", "rating", "distance", "popularity"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
})

export type UserRegistration = z.infer<typeof userRegistrationSchema>
export type UserLogin = z.infer<typeof userLoginSchema>
export type Venue = z.infer<typeof venueSchema>
export type Vendor = z.infer<typeof vendorSchema>
export type Booking = z.infer<typeof bookingSchema>
export type SearchParams = z.infer<typeof searchSchema>
