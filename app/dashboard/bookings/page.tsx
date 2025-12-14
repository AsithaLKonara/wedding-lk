"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { Calendar, Users, Phone, Download, Eye } from "lucide-react"
import Link from "next/link"

// Card will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Badge will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function BookingsPage() {
  const [bookings] = useState([
    {
      id: "1",
      venueId: "1",
      venueName: "Galle Face Hotel",
      venueImage: "/placeholder.svg?height=100&width=150",
      date: "2024-06-15",
      guests: 150,
      status: "confirmed",
      totalAmount: 450000,
      createdAt: "2024-01-15",
      contactPerson: "Arjun Mendis",
      phone: "+94 77 123 4567",
      email: "arjun@example.com",
    },
    {
      id: "2",
      venueId: "2",
      venueName: "Cinnamon Grand Colombo",
      venueImage: "/placeholder.svg?height=100&width=150",
      date: "2024-07-20",
      guests: 200,
      status: "pending",
      totalAmount: 650000,
      createdAt: "2024-01-20",
      contactPerson: "Kavitha Rajapaksa",
      phone: "+94 77 987 6543",
      email: "kavitha@example.com",
    },
    {
      id: "3",
      venueId: "3",
      venueName: "Jetwing Lighthouse",
      venueImage: "/placeholder.svg?height=100&width=150",
      date: "2024-08-10",
      guests: 120,
      status: "cancelled",
      totalAmount: 380000,
      createdAt: "2024-01-25",
      contactPerson: "Dinesh Wickramasinghe",
      phone: "+94 77 555 1234",
      email: "dinesh@example.com",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your venue bookings and track their status</p>
      </div>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                {/* Venue Image */}
                <div className="md:w-48 h-48 md:h-auto">
                  <img
                    src={booking.venueImage || "/placeholder.svg"}
                    alt={booking.venueName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Booking Details */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{booking.venueName}</h3>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-right mt-4 md:mt-0">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        LKR {booking.totalAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{booking.guests} Guests</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{booking.phone}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href={`/venues/${booking.venueId}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Venue
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Receipt
                    </Button>
                    {booking.status === "pending" && (
                      <Button variant="outline" size="sm">
                        Cancel Booking
                      </Button>
                    )}
                    {booking.status === "confirmed" && (
                      <Button size="sm" className="bg-gradient-to-r from-rose-500 to-pink-600">
                        Contact Venue
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bookings.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start planning your dream wedding by booking a venue
            </p>
            <Link href="/venues">
              <Button className="bg-gradient-to-r from-rose-500 to-pink-600">Browse Venues</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
