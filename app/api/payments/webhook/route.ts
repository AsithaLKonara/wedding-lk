import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Booking } from "@/lib/models/booking"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { paymentId, status, amount, bookingId, customerEmail, customerName } = body

    console.log("Payment webhook received:", { paymentId, status, amount, bookingId })

    // Process payment status update
    if (status === "completed") {
      console.log(`Payment ${paymentId} completed for booking ${bookingId}`)

      // Update booking status to confirmed
      const updatedBooking = await Booking.findByIdAndUpdate(bookingId, {
        status: "confirmed",
        paymentStatus: "paid",
        paymentId,
        paidAt: new Date()
      }, { new: true })

      if (updatedBooking) {
        console.log(`Booking ${bookingId} status updated to confirmed`)

      // Send confirmation email
        try {
          await sendEmail(
            customerEmail,
            "Payment Confirmed - Your Booking is Confirmed! 🎉",
            `Payment confirmed for booking ${bookingId}. Amount: LKR ${amount}. Payment ID: ${paymentId}.`
          )
          console.log("Payment confirmation email sent successfully")
        } catch (emailError) {
          console.error("Failed to send confirmation email:", emailError)
        }
      }
    } else if (status === "failed") {
      console.log(`Payment ${paymentId} failed for booking ${bookingId}`)
      
      // Update booking status to payment failed
      await Booking.findByIdAndUpdate(bookingId, {
        status: "pending",
        paymentStatus: "failed",
        paymentId
      })

      // Send failure notification email
      try {
        await sendEmail(
          customerEmail,
          "Payment Failed - Action Required",
          `Payment failed for booking ${bookingId}. Amount: LKR ${amount}. Please retry or contact support.`
        )
      } catch (emailError) {
        console.error("Failed to send failure email:", emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Payment webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
