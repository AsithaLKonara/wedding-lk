import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Validation schemas
const registrationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+94\d{9}$/, "Phone must be in format +94XXXXXXXXX"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  userType: z.enum(["couple", "vendor", "planner"]),
  weddingDate: z.string().optional(),
})

const bookingSchema = z.object({
  venueId: z.string().min(1, "Venue ID is required"),
  date: z.string().refine((date) => new Date(date) > new Date(), "Wedding date must be in the future"),
  guests: z.number().min(1, "At least 1 guest required").max(1000, "Maximum 1000 guests"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\+94\d{9}$/, "Phone must be in format +94XXXXXXXXX"),
  message: z.string().optional(),
})

const paymentSchema = z.object({
  amount: z.number().min(1000, "Minimum payment is LKR 1,000"),
  currency: z.literal("LKR"),
  paymentMethod: z.enum(["card", "bank", "mobile"]),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    let validationResult
    let errors: string[] = []

    switch (type) {
      case "registration":
        try {
          validationResult = registrationSchema.parse(data)
        } catch (error) {
          if (error instanceof z.ZodError) {
            errors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)
          }
        }
        break

      case "booking":
        try {
          validationResult = bookingSchema.parse(data)
        } catch (error) {
          if (error instanceof z.ZodError) {
            errors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)
          }
        }
        break

      case "payment":
        try {
          validationResult = paymentSchema.parse(data)
        } catch (error) {
          if (error instanceof z.ZodError) {
            errors = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`)
          }
        }
        break

      default:
        return NextResponse.json({ error: "Invalid validation type" }, { status: 400 })
    }

    return NextResponse.json({
      success: errors.length === 0,
      errors,
      validData: validationResult,
      message: errors.length === 0 ? "Validation passed" : "Validation failed",
    })
  } catch (error) {
    console.error("Form validation test error:", error)
    return NextResponse.json({ error: "Validation test failed" }, { status: 500 })
  }
}
