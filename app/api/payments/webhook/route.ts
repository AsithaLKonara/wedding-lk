import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { paymentId, status, amount, bookingId } = body

    console.log("Payment webhook received:", { paymentId, status, amount, bookingId })

    // Process payment status update
    if (status === "completed") {
      // Update booking status to confirmed
      console.log(`Payment ${paymentId} completed for booking ${bookingId}`)

      // Send confirmation email
      console.log("Sending payment confirmation email")

      // Update database
      // await Booking.findByIdAndUpdate(bookingId, {
      //   status: "confirmed",
      //   paymentStatus: "paid",
      //   paymentId
      // })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
