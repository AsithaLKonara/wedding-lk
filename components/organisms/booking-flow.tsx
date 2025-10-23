"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  DollarSign, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  AlertCircle,
  CreditCard,
  User
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils/format'

interface BookingFlowProps {
  itemId: string
  itemType: 'venue' | 'vendor' | 'package'
  itemName: string
  itemPrice: number
  onClose: () => void
  onSuccess?: (booking: any) => void
}

interface BookingFormData {
  eventDate: string
  eventTime: string
  guestCount: number
  specialRequirements: string
  contactPhone: string
  contactEmail: string
  paymentMethod: string
  notes: string
}

export function BookingFlow({ 
  itemId, 
  itemType, 
  itemName, 
  itemPrice, 
  onClose, 
  onSuccess 
}: BookingFlowProps) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<BookingFormData>({
    eventDate: '',
    eventTime: '',
    guestCount: 50,
    specialRequirements: '',
    contactPhone: '',
    contactEmail: user ?.user?.email || '',
    paymentMethod: 'card',
    notes: ''
  })

  const steps = [
    { number: 1, title: 'Event Details', description: 'Choose date and time' },
    { number: 2, title: 'Guest Count', description: 'Number of attendees' },
    { number: 3, title: 'Contact Info', description: 'Your contact details' },
    { number: 4, title: 'Payment', description: 'Complete your booking' }
  ]

  const handleInputChange = (field: keyof BookingFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user?.user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to make a booking",
        variant: "destructive"
      })
      return
    }

    setLoading(true)

    try {
      const bookingData = {
        userId: user.id,
        [itemType === 'package' ? 'packageId' : `${itemType}Id`]: itemId,
        itemType,
        eventDate: new Date(formData.eventDate),
        eventTime: formData.eventTime,
        guestCount: formData.guestCount,
        totalAmount: itemPrice,
        specialRequirements: formData.specialRequirements,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        status: 'pending'
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Booking Created!",
          description: "Your booking has been submitted successfully",
          variant: "success"
        })
        
        if (onSuccess) {
          onSuccess(result.booking)
        }
        onClose()
      } else {
        throw new Error(result.error || 'Failed to create booking')
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="eventDate">Event Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={(e) => handleInputChange('eventDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="eventTime">Event Time</Label>
              <Select value={formData.eventTime} onValueChange={(value) => handleInputChange('eventTime', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                  <SelectItem value="17:00">5:00 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                  <SelectItem value="19:00">7:00 PM</SelectItem>
                  <SelectItem value="20:00">8:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="guestCount">Number of Guests</Label>
              <Input
                id="guestCount"
                type="number"
                min="1"
                max="1000"
                value={formData.guestCount}
                onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="specialRequirements">Special Requirements</Label>
              <Textarea
                id="specialRequirements"
                value={formData.specialRequirements}
                onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                placeholder="Any special requirements or requests..."
                className="mt-1"
                rows={4}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="+94 77 123 4567"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="contactEmail">Email Address</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Any additional information..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Item:</span>
                  <span>{itemName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{formatDate(formData.eventDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{formData.eventTime}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{formData.guestCount}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(itemPrice)}</span>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Book {itemName}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
          
          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-4">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.number}
                </div>
                <div className="ml-2 hidden sm:block">
                  <div className="text-sm font-medium">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {step.number < steps.length && (
                  <div className="w-8 h-0.5 bg-gray-200 mx-2" />
                )}
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStepContent()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onClose : handlePrevious}
              disabled={loading}
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            <Button
              onClick={currentStep === steps.length ? handleSubmit : handleNext}
              disabled={loading}
            >
              {loading ? 'Processing...' : currentStep === steps.length ? 'Complete Booking' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
