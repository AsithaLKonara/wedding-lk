"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Phone, Mail, Globe, MapPin, Star, Clock, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VendorContactProps {
  vendor: {
    _id: string
    businessName: string
    name: string
    category: string
    description: string
    location: {
      address: string
      city: string
      province: string
    }
    contact: {
      phone: string
      email: string
      website?: string
    }
    rating: {
      average: number
      count: number
    }
    pricing: {
      startingPrice: number
      currency: string
    }
  }
}

export function VendorContact({ vendor }: VendorContactProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    eventDate: "",
    guestCount: "",
    budget: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.email) {
      toast({
        title: "Please login",
        description: "You need to be logged in to contact vendors.",
        variant: "destructive"
      })
      router.push('/login')
      return
    }

    setIsLoading(true)
    
    try {
      // Create conversation with vendor
      const conversationResponse = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participants: [
            { user: session.user.id, role: session.user.role || 'couple' },
            { user: vendor._id, role: 'vendor' }
          ],
          conversationType: 'direct',
          vendorId: vendor._id,
          title: `Inquiry about ${vendor.businessName}`,
          description: `Inquiry from ${formData.name || session.user.name} about ${vendor.businessName}`,
        })
      })

      const conversationData = await conversationResponse.json()
      
      if (!conversationData.success) {
        throw new Error('Failed to create conversation')
      }

      // Send initial message
      const messageResponse = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversationData.conversation._id,
          recipientId: vendor._id,
          content: `Hi ${vendor.name},\n\n${formData.message}\n\nEvent Details:\n- Date: ${formData.eventDate}\n- Guest Count: ${formData.guestCount}\n- Budget: ${formData.budget}\n\nContact Information:\n- Name: ${formData.name || session.user.name}\n- Email: ${formData.email || session.user.email}\n- Phone: ${formData.phone || 'Not provided'}`,
          messageType: 'text',
        })
      })

      const messageData = await messageResponse.json()
      
      if (!messageData.success) {
        throw new Error('Failed to send message')
      }

      toast({ 
        title: "Message sent successfully!", 
        description: "The vendor will get back to you soon. You can view your conversation in the Messages section.",
        variant: "default"
      })
      
      setFormData({ name: "", email: "", phone: "", message: "", eventDate: "", guestCount: "", budget: "" })
      
      // Redirect to messages page
      router.push('/dashboard/messages')
      
    } catch (error) {
      console.error('Error sending message:', error)
      toast({ 
        title: "Failed to send message", 
        description: "Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Contact {vendor.businessName}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Vendor Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {vendor?.location?.address || 'N/A'}, {vendor?.location?.city || 'N/A'}, {vendor?.location?.province || 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-600">
              {vendor.rating?.average?.toFixed(1) || '4.5'} ({vendor.rating?.count || 0} reviews)
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600">
              Starting from {vendor.pricing?.currency || "LKR"} {vendor.pricing?.startingPrice?.toLocaleString() || "0"}
            </span>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                defaultValue={session?.user?.name || ""}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                defaultValue={session?.user?.email || ""}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+94 77 123 4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              defaultValue=""
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="guestCount">Guest Count</Label>
              <Input
                id="guestCount"
                type="number"
                placeholder="100"
                value={formData.guestCount}
                onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (LKR)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="50000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us about your requirements, specific services needed, and any special requests..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="min-h-[120px]"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </Button>
        </form>

        {/* Direct Contact Info */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">Direct Contact</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-500" />
              <a href={`tel:${vendor?.contact?.phone || ''}`} className="text-blue-600 hover:underline">
                {vendor?.contact?.phone || 'N/A'}
              </a>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-500" />
              <a href={`mailto:${vendor?.contact?.email || ''}`} className="text-blue-600 hover:underline">
                {vendor?.contact?.email || 'N/A'}
              </a>
            </div>
            
            {vendor.contact?.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-gray-500" />
                <a href={vendor.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Visit Website
                </a>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


export default VendorContact
