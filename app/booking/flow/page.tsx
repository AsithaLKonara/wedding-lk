"use client"

import { MainLayout } from "@/components/templates/main-layout"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  CreditCard, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Phone,
  Mail,
  User,
  MessageSquare
} from "lucide-react"

interface BookingStep {
  id: number
  title: string
  description: string
  icon: any
}

interface BookingData {
  venueId: string
  venueName: string
  venueLocation: string
  venueImage: string
  venuePrice: number
  selectedDate: string
  selectedTime: string
  guestCount: number
  specialRequests: string
  brideName: string
  groomName: string
  email: string
  phone: string
  paymentMethod: string
}

export default function BookingFlowPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingData, setBookingData] = useState<BookingData>({
    venueId: '1',
    venueName: 'Royal Garden Hotel',
    venueLocation: 'Colombo',
    venueImage: 'https://images.unsplash.com/photo-1519167758481-83f29c0c0b8a?w=400&h=300&fit=crop',
    venuePrice: 250000,
    selectedDate: '',
    selectedTime: '',
    guestCount: 0,
    specialRequests: '',
    brideName: '',
    groomName: '',
    email: '',
    phone: '',
    paymentMethod: ''
  })

  const steps: BookingStep[] = [
    {
      id: 1,
      title: 'Date & Time',
      description: 'Select your preferred date and time',
      icon: Calendar
    },
    {
      id: 2,
      title: 'Guest Details',
      description: 'Tell us about your guest count and special requirements',
      icon: Users
    },
    {
      id: 3,
      title: 'Contact Info',
      description: 'Provide your contact information',
      icon: User
    },
    {
      id: 4,
      title: 'Payment',
      description: 'Choose your payment method',
      icon: CreditCard
    },
    {
      id: 5,
      title: 'Confirmation',
      description: 'Review and confirm your booking',
      icon: CheckCircle
    }
  ]

  const progress = (currentStep / steps.length) * 100

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

  const handleInputChange = (field: keyof BookingData, value: string | number) => {
    setBookingData(prev => ({ ...prev, [field]: value }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select Your Wedding Date</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Wedding Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={bookingData.selectedDate}
                    onChange={(e) => handleInputChange('selectedDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Ceremony Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={bookingData.selectedTime}
                    onChange={(e) => handleInputChange('selectedTime', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                📅 Popular Wedding Dates
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['2024-06-15', '2024-06-22', '2024-07-06', '2024-07-13'].map((date) => (
                  <Button
                    key={date}
                    variant={bookingData.selectedDate === date ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleInputChange('selectedDate', date)}
                  >
                    {new Date(date).toLocaleDateString()}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Guest Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="guestCount">Expected Guest Count</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    min="1"
                    value={bookingData.guestCount}
                    onChange={(e) => handleInputChange('guestCount', parseInt(e.target.value) || 0)}
                    required
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Venue capacity: 300 guests
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests or Requirements</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Any dietary restrictions, accessibility needs, or special arrangements..."
                    value={bookingData.specialRequests}
                    onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                💡 Planning Tip
              </h4>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                Consider having 10-15% fewer guests than the venue capacity for comfort and better service.
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brideName">Bride's Full Name</Label>
                  <Input
                    id="brideName"
                    value={bookingData.brideName}
                    onChange={(e) => handleInputChange('brideName', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groomName">Groom's Full Name</Label>
                  <Input
                    id="groomName"
                    value={bookingData.groomName}
                    onChange={(e) => handleInputChange('groomName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={bookingData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={bookingData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                ✅ Contact Verification
              </h4>
              <p className="text-green-800 dark:text-green-200 text-sm">
                We'll use this information to send you booking confirmations and important updates about your wedding.
              </p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="space-y-3">
                {[
                  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'bank', name: 'Bank Transfer', icon: CreditCard },
                  { id: 'ezcash', name: 'ezCash', icon: CreditCard },
                  { id: 'mcash', name: 'mCash', icon: CreditCard }
                ].map((method) => {
                  const IconComponent = method.icon
                  return (
                    <div
                      key={method.id}
                      onClick={() => handleInputChange('paymentMethod', method.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        bookingData.paymentMethod === method.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5" />
                        <span className="font-medium">{method.name}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💳 Payment Security
              </h4>
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                All payments are processed securely. You'll receive a receipt via email after successful payment.
              </p>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Booking Confirmation</h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Venue:</span>
                  <span>{bookingData.venueName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{bookingData.selectedDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Time:</span>
                  <span>{bookingData.selectedTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Guests:</span>
                  <span>{bookingData.guestCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Couple:</span>
                  <span>{bookingData.brideName} & {bookingData.groomName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="text-lg font-bold text-green-600">
                    LKR {bookingData.venuePrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                🎉 Congratulations!
              </h4>
              <p className="text-green-800 dark:text-green-200 text-sm">
                Your booking has been confirmed! You'll receive a confirmation email shortly with all the details.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return bookingData.selectedDate && bookingData.selectedTime
      case 2:
        return bookingData.guestCount > 0
      case 3:
        return bookingData.brideName && bookingData.groomName && bookingData.email && bookingData.phone
      case 4:
        return bookingData.paymentMethod
      case 5:
        return true
      default:
        return false
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Book Your Venue
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Complete your booking in just a few simple steps
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Progress Steps */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {steps.map((step) => {
                        const IconComponent = step.icon
                        return (
                          <div
                            key={step.id}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              currentStep === step.id
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : currentStep > step.id
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              currentStep === step.id
                                ? 'bg-blue-500 text-white'
                                : currentStep > step.id
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                              {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{step.title}</p>
                              <p className="text-xs opacity-75">{step.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
                          Step {currentStep}: {steps[currentStep - 1].title}
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {steps[currentStep - 1].description}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {currentStep} of {steps.length}
                      </Badge>
                    </div>
                    <Progress value={progress} className="mt-4" />
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      
                      {currentStep < steps.length ? (
                        <Button
                          onClick={handleNext}
                          disabled={!isStepValid()}
                        >
                          Next
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            // Handle final booking submission
                            console.log('Booking submitted:', bookingData)
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Complete Booking
                          <CheckCircle className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Booking Summary */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <img
                        src={bookingData.venueImage}
                        alt={bookingData.venueName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {bookingData.venueName}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                          {bookingData.venueLocation}
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          LKR {bookingData.venuePrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
