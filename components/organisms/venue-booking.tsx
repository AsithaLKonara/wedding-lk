"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Users, Phone, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VenueBookingProps {
  venue: {
    _id: string
    name: string
    pricing?: {
      basePrice: number
      currency: string
    }
  }
}

export function VenueBooking({ venue }: VenueBookingProps) {
  const [bookingData, setBookingData] = useState({
    date: "",
    guests: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [errors, setErrors] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err: any = {}
    if (!bookingData.date) err.date = "Date is required"
    if (!bookingData.guests || isNaN(Number(bookingData.guests)) || Number(bookingData.guests) <= 0) err.guests = "Enter a valid number of guests"
    if (!bookingData.name) err.name = "Name is required"
    if (!bookingData.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(bookingData.email)) err.email = "Enter a valid email"
    if (!bookingData.phone || !/^\+?\d{10,15}$/.test(bookingData.phone.replace(/\s/g, ""))) err.phone = "Enter a valid phone number"
    setErrors(err)
    if (Object.keys(err).length > 0) {
      toast({ title: "Please fix the errors above.", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((res) => setTimeout(res, 1200))
      toast({ title: "Booking request sent!", variant: "default" })
      setBookingData({ date: "", guests: "", name: "", email: "", phone: "", message: "" })
      setErrors({})
    } catch {
      toast({ title: "Failed to send booking request.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Book This Venue</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Wedding Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="date"
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                className="pl-10"
                required
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? "date-error" : undefined}
              />
            </div>
            {errors.date && <div id="date-error" className="text-xs text-destructive">{errors.date}</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests">Number of Guests</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="guests"
                type="number"
                placeholder="Expected guests"
                value={bookingData.guests}
                onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                className="pl-10"
                required
                aria-invalid={!!errors.guests}
                aria-describedby={errors.guests ? "guests-error" : undefined}
              />
            </div>
            {errors.guests && <div id="guests-error" className="text-xs text-destructive">{errors.guests}</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Full name"
              value={bookingData.name}
              onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
              required
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && <div id="name-error" className="text-xs text-destructive">{errors.name}</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={bookingData.email}
                onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                className="pl-10"
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && <div id="email-error" className="text-xs text-destructive">{errors.email}</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+94 77 123 4567"
                value={bookingData.phone}
                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                className="pl-10"
                required
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "phone-error" : undefined}
              />
            </div>
            {errors.phone && <div id="phone-error" className="text-xs text-destructive">{errors.phone}</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Special Requirements</Label>
            <textarea
              id="message"
              placeholder="Any special requests or requirements..."
              value={bookingData.message}
              onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
              className="w-full p-3 border rounded-md resize-none h-20"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Starting from</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                LKR {(venue.pricing?.basePrice || 0).toLocaleString()}
              </span>
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-600" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Request Booking"}
            </Button>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We&apos;re excited to help you book your perfect venue!
            </p>
            <p className="text-xs text-center text-gray-500 mt-2">
              You won&apos;t be charged yet. We&apos;ll contact you to confirm details.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


export default VenueBooking
