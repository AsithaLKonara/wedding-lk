"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { MainLayout } from "@/components/templates/main-layout"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

// Button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Card will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Input will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Label will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Checkbox will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Slider will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function CustomPackagePage() {
  const router = useRouter()
  const [budget, setBudget] = useState([500000])
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  const services = [
    { id: "venue", name: "Venue Rental", price: 200000, required: true },
    { id: "photography", name: "Photography & Videography", price: 150000, required: false },
    { id: "catering", name: "Catering Services", price: 180000, required: false },
    { id: "decoration", name: "Decoration & Flowers", price: 100000, required: false },
    { id: "entertainment", name: "Entertainment (DJ/Band)", price: 80000, required: false },
    { id: "transport", name: "Transportation", price: 50000, required: false },
    { id: "coordinator", name: "Wedding Coordinator", price: 75000, required: false },
    { id: "makeup", name: "Bridal Makeup & Hair", price: 45000, required: false },
  ]

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const totalCost = services
    .filter((service) => service.required || selectedServices.includes(service.id))
    .reduce((sum, service) => sum + service.price, 0)

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Custom Package</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Build your perfect wedding package</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Package Builder */}
            <div className="lg:col-span-2 space-y-6">
              {/* Budget Range */}
              <Card>
                <CardHeader>
                  <CardTitle>Budget Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label>Budget: LKR {budget[0].toLocaleString()}</Label>
                    <Slider
                      value={budget}
                      onValueChange={setBudget}
                      max={2000000}
                      min={200000}
                      step={50000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>LKR 200,000</span>
                      <span>LKR 2,000,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Wedding Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Wedding Date</Label>
                      <Input type="date" id="date" />
                    </div>
                    <div>
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Input type="number" id="guests" placeholder="150" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Preferred Location</Label>
                    <Input id="location" placeholder="Colombo, Western Province" />
                  </div>
                </CardContent>
              </Card>

              {/* Services Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Select Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={service.required || selectedServices.includes(service.id)}
                          onCheckedChange={() => !service.required && handleServiceToggle(service.id)}
                          disabled={service.required}
                        />
                        <div>
                          <div className="font-medium">{service.name}</div>
                          {service.required && <div className="text-sm text-gray-500">Required</div>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">LKR {service.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Package Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Package Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {services
                      .filter((service) => service.required || selectedServices.includes(service.id))
                      .map((service) => (
                        <div key={service.id} className="flex justify-between text-sm">
                          <span>{service.name}</span>
                          <span>LKR {service.price.toLocaleString()}</span>
                        </div>
                      ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Cost</span>
                      <span>LKR {totalCost.toLocaleString()}</span>
                    </div>
                    {totalCost > budget[0] && (
                      <div className="text-red-500 text-sm mt-2">
                        Over budget by LKR {(totalCost - budget[0]).toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 pt-4">
                    <Button className="w-full">Save Package</Button>
                    <Button variant="outline" className="w-full">
                      Get Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
