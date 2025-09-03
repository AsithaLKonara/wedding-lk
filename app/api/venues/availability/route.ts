import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Venue } from "@/lib/models/venue"
import { Booking } from "@/lib/models/booking"

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get('venueId')
    const date = searchParams.get('date')
    const startTime = searchParams.get('startTime')
    const endTime = searchParams.get('endTime')

    if (!venueId || !date) {
      return NextResponse.json(
        { error: "Venue ID and date are required" },
        { status: 400 }
      )
    }

    // Check if venue exists
    const venue = await Venue.findById(venueId)
    if (!venue) {
      return NextResponse.json(
        { error: "Venue not found" },
        { status: 404 }
      )
    }

    // Check for existing bookings on the same date
    const existingBookings = await Booking.find({
      venue: venueId,
      date: new Date(date),
      status: { $in: ['confirmed', 'pending'] }
    })

    // Check if the requested time slot conflicts with existing bookings
    let isAvailable = true
    let conflictingBookings: any[] = []

    if (startTime && endTime) {
      conflictingBookings = existingBookings.filter(booking => {
        const bookingStart = booking.startTime || '00:00'
        const bookingEnd = booking.endTime || '23:59'
        
        // Check for time overlap
        return (
          (startTime < bookingEnd && endTime > bookingStart) ||
          (bookingStart < endTime && bookingEnd > startTime)
        )
      })

      isAvailable = conflictingBookings.length === 0
    }

    // Get available time slots for the date
    const availableSlots = []
    const businessHours = venue.businessHours || {
      start: '09:00',
      end: '18:00'
    }

    // Generate time slots (assuming 1-hour intervals)
    const startHour = parseInt(businessHours.start.split(':')[0])
    const endHour = parseInt(businessHours.end.split(':')[0])

    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = `${hour.toString().padStart(2, '0')}:00`
      const slotEnd = `${(hour + 1).toString().padStart(2, '0')}:00`
      
      // Check if this slot conflicts with existing bookings
      const slotConflicts = existingBookings.filter(booking => {
        const bookingStart = booking.startTime || '00:00'
        const bookingEnd = booking.endTime || '23:59'
        return (
          (slotStart < bookingEnd && slotEnd > bookingStart) ||
          (bookingStart < slotEnd && bookingEnd > slotStart)
        )
      })

      if (slotConflicts.length === 0) {
        availableSlots.push({
          start: slotStart,
          end: slotEnd,
          available: true
        })
      } else {
        availableSlots.push({
          start: slotStart,
          end: slotEnd,
          available: false,
          conflictingBooking: slotConflicts[0]._id
        })
      }
    }

    return NextResponse.json({
      venueId,
      date,
      isAvailable,
      conflictingBookings: conflictingBookings.map(b => ({
        id: b._id,
        startTime: b.startTime,
        endTime: b.endTime,
        status: b.status
      })),
      availableSlots,
      businessHours: venue.businessHours
    })

  } catch (error) {
    console.error("Error checking venue availability:", error)
    return NextResponse.json(
      { error: "Failed to check venue availability" },
      { status: 500 }
    )
  }
} 