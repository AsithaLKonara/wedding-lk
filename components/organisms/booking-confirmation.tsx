"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Users, MapPin, Phone, Mail, Download, Share2 } from "lucide-react"
import Link from "next/link"

interface BookingConfirmationProps {
  booking: {
    id: string
    venueName: string
    date: string
    guests: number
    contactInfo: {
      name: string
      email: string
      phone: string
    }
    totalAmount: number
    status: string
  }
}

export function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const handleDownloadReceipt = () => {
    console.log("Downloading receipt for booking:", booking.id)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Wedding Venue Booking Confirmed",
        text: `My wedding venue booking at ${booking.venueName} has been confirmed!`,
        url: window.location.href,
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
            <CheckCircle className="h-8 w-8" />
            <div className="text-center">
              <h1 className="text-2xl font-bold">Booking Confirmed!</h1>
              <p className="text-sm">Your wedding venue has been successfully booked</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">{booking.venueName}</p>
                  <p className="text-sm text-gray-600">Wedding Venue</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600">Wedding Date</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">{booking.guests} Guests</p>
                  <p className="text-sm text-gray-600">Expected Attendance</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">{booking.contactInfo.email}</p>
                  <p className="text-sm text-gray-600">Contact Email</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">{booking.contactInfo.phone}</p>
                  <p className="text-sm text-gray-600">Contact Phone</p>
                </div>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600">Booking ID</p>
                <p className="font-mono font-medium">{booking.id}</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Total Amount</span>
              <span className="text-2xl font-bold text-green-600">LKR {booking.totalAmount.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Payment will be processed separately</p>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <div>
                <p className="font-medium">Venue Confirmation</p>
                <p className="text-sm text-gray-600">
                  The venue will contact you within 24 hours to confirm availability and discuss details.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-sm font-medium">
                2
              </div>
              <div>
                <p className="font-medium">Contract & Payment</p>
                <p className="text-sm text-gray-600">
                  Review and sign the venue contract, then proceed with the payment process.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-sm font-medium">
                3
              </div>
              <div>
                <p className="font-medium">Wedding Planning</p>
                <p className="text-sm text-gray-600">
                  Start planning other aspects of your wedding using our planning tools.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleDownloadReceipt} variant="outline" className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          Download Receipt
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex-1">
          <Share2 className="h-4 w-4 mr-2" />
          Share Booking
        </Button>
        <Link href="/dashboard" className="flex-1">
          <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-600">Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
