"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { User, Calendar, CreditCard, CheckCircle } from "lucide-react"

// Card will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Badge will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

const LoginForm = dynamic(() => import("@/components/auth/login-form"), { ssr: false })

const RegisterForm = dynamic(() => import("@/components/auth/register-form"), { ssr: false })

const VenueBooking = dynamic(() => import("@/components/organisms/venue-booking"), { ssr: false })

const PaymentForm = dynamic(() => import("@/components/organisms/payment-form"), { ssr: false })

// Tabs will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsList will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsTrigger will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function TestDemoPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [testResults, setTestResults] = useState<Record<string, boolean>>({})

  const mockVenue = {
    id: "1",
    name: "Grand Ballroom Hotel",
    price: 150000,
  }

  const mockBooking = {
    id: "booking_123",
    venueName: "Grand Ballroom Hotel",
    totalAmount: 150000,
  }

  const markStepComplete = (step: string) => {
    setTestResults((prev) => ({ ...prev, [step]: true }))
  }

  const steps = [
    { id: 1, name: "User Registration", icon: User, completed: testResults.registration },
    { id: 2, name: "User Login", icon: User, completed: testResults.login },
    { id: 3, name: "Venue Booking", icon: Calendar, completed: testResults.booking },
    { id: 4, name: "Payment Processing", icon: CreditCard, completed: testResults.payment },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Interactive Test Demo</h1>
        <p className="text-gray-600 dark:text-gray-400">Test the complete user journey step by step</p>
      </div>

      {/* Progress Steps */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Test Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    step.completed
                      ? "bg-green-500 border-green-500 text-white"
                      : currentStep === step.id
                        ? "border-rose-500 text-rose-500"
                        : "border-gray-300 text-gray-400"
                  }`}
                >
                  {step.completed ? <CheckCircle className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                </div>
                <div className="ml-3">
                  <p className={`font-medium ${step.completed ? "text-green-600" : "text-gray-900 dark:text-white"}`}>
                    {step.name}
                  </p>
                  {step.completed && <Badge className="bg-green-100 text-green-800">Completed</Badge>}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${step.completed ? "bg-green-500" : "bg-gray-300"}`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Components */}
      <Tabs value={currentStep.toString()} onValueChange={(value) => setCurrentStep(Number.parseInt(value))}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="1">Registration</TabsTrigger>
          <TabsTrigger value="2">Login</TabsTrigger>
          <TabsTrigger value="3">Booking</TabsTrigger>
          <TabsTrigger value="4">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="1" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test User Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Registration Form</h3>
                  <RegisterForm />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Test Instructions</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                      <p className="font-medium">1. Fill out the registration form</p>
                      <p>Use a test email like test@example.com</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                      <p className="font-medium">2. Select user type</p>
                      <p>Choose "Couple planning a wedding" for full features</p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                      <p className="font-medium">3. Submit the form</p>
                      <p>Check browser console for API responses</p>
                    </div>
                  </div>
                  <Button onClick={() => markStepComplete("registration")} className="mt-4 w-full">
                    Mark Registration Complete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="2" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test User Login</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Login Form</h3>
                  <LoginForm />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Test Instructions</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                      <p className="font-medium">1. Use registered credentials</p>
                      <p>Email and password from previous step</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                      <p className="font-medium">2. Test authentication</p>
                      <p>Should redirect to dashboard on success</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                      <p className="font-medium">3. Verify session</p>
                      <p>Check if user is properly authenticated</p>
                    </div>
                  </div>
                  <Button onClick={() => markStepComplete("login")} className="mt-4 w-full">
                    Mark Login Complete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="3" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Venue Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Booking Form</h3>
                  <VenueBooking venue={mockVenue} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Test Instructions</h3>
                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
                      <p className="font-medium">1. Select wedding date</p>
                      <p>Choose a future date for the event</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
                      <p className="font-medium">2. Enter guest count</p>
                      <p>Number of expected guests</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
                      <p className="font-medium">3. Fill contact details</p>
                      <p>Name, email, phone, and special requirements</p>
                    </div>
                    <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
                      <p className="font-medium">4. Submit booking request</p>
                      <p>Check API response and confirmation</p>
                    </div>
                  </div>
                  <Button onClick={() => markStepComplete("booking")} className="mt-4 w-full">
                    Mark Booking Complete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="4" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Payment Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment Form</h3>
                  <PaymentForm
                    booking={mockBooking}
                    onPaymentSuccess={(paymentId) => {
                      console.log("Payment successful:", paymentId)
                      markStepComplete("payment")
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-rose-50 dark:bg-rose-950 rounded">
                    <h4 className="font-medium">Credit/Debit Card</h4>
                    <p className="text-sm text-gray-600">Test card payment processing</p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded">
                    <h4 className="font-medium">Bank Transfer</h4>
                    <p className="text-sm text-gray-600">Test bank transfer details</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded">
                    <h4 className="font-medium">Mobile Payment</h4>
                    <p className="text-sm text-gray-600">Test Sri Lankan mobile payments</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Summary */}
      {Object.keys(testResults).length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Test Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(testResults).map(([test, completed]) => (
                <div key={test} className="text-center">
                  <div
                    className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      completed ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <p className="font-medium capitalize">{test}</p>
                  <Badge className={completed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {completed ? "Completed" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
