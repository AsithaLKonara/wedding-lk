import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Booking } from "@/lib/models/booking"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { venueId, date, guests, name, email, phone, message } = body

    // Validate required fields
    if (!venueId || !date || !guests || !name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create booking record
    const booking = await (Booking as any).create({
      venueId,
      userId: "temp-user-id", // Temporary until auth is fixed
      date,
      guests: Number.parseInt(guests),
      contactInfo: { name, email, phone },
      message,
      status: "pending",
      createdAt: new Date(),
    })

    // Send confirmation email (mock)
    console.log("Sending confirmation email to:", email)

    return NextResponse.json({
      success: true,
      booking,
      message: "Booking request submitted successfully! We'll contact you within 24 hours.",
    })
  } catch (error) {
    console.error("Booking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const bookings = await (Booking as any).find({}).sort({ createdAt: -1 }).limit(50)

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Get bookings error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
