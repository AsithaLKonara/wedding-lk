"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react'

interface VendorForm {
  businessName: string
  businessType: string
  description: string
  services: string[]
  location: string
  contactPhone: string
  contactEmail: string
  website: string
  experience: string
  portfolio: string[]
  certifications: string[]
  pricing: {
    minPrice: number
    maxPrice: number
    currency: string
  }
  availability: {
    weekdays: boolean
    weekends: boolean
    holidays: boolean
  }
  terms: boolean
}

const businessTypes = [
  'Photography', 'Videography', 'Catering', 'Music & DJ', 'Decorations',
  'Wedding Planning', 'Beauty & Makeup', 'Flowers', 'Transportation',
  'Venue', 'Lighting', 'Security', 'Other'
]

const services = [
  'Wedding Photography', 'Engagement Photography', 'Pre-wedding Photography',
  'Wedding Videography', 'Drone Photography', 'Photo Editing',
  'Video Editing', 'Wedding Albums', 'Online Galleries',
  'Same Day Edit', 'Highlight Reels', 'Full Day Coverage'
]

export default function VendorRegistrationPage() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const router = useRouter()
  
  const [form, setForm] = useState<VendorForm>({
    businessName: '',
    businessType: '',
    description: '',
    services: [],
    location: '',
    contactPhone: '',
    contactEmail: user ?.user?.email || '',
    website: '',
    experience: '',
    portfolio: [],
    certifications: [],
    pricing: {
      minPrice: 0,
      maxPrice: 0,
      currency: 'LKR'
    },
    availability: {
      weekdays: true,
      weekends: true,
      holidays: false
    },
    terms: false
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user?.user) {
    router.push('/auth/signin')
    return null
  }

  const handleInputChange = (field: keyof VendorForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleNestedInputChange = (parent: keyof VendorForm, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent] as any,
        [field]: value
      }
    }))
  }

  const handleServiceToggle = (service: string) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const handleFileUpload = async (files: FileList) => {
    setUploading(true)
    try {
      const uploadedFiles = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', 'portfolio')

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          uploadedFiles.push(data.filePath)
        }
      }
      setForm(prev => ({ ...prev, portfolio: [...prev.portfolio, ...uploadedFiles] }))
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/vendors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          userId: user.id
        })
      })

      if (response.ok) {
        router.push('/vendor/dashboard?registered=true')
      } else {
        throw new Error('Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return form.businessName && form.businessType && form.description
      case 2:
        return form.services.length > 0 && form.location && form.contactPhone
      case 3:
        return form.pricing.minPrice > 0 && form.pricing.maxPrice > 0
      case 4:
        return form.terms
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Registration</h1>
          <p className="text-gray-600">Join WeddingLK as a vendor and start receiving bookings</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step ? 'text-purple-600 font-medium' : 'text-gray-500'
                }`}>
                  {step === 1 && 'Business Info'}
                  {step === 2 && 'Services & Contact'}
                  {step === 3 && 'Pricing & Portfolio'}
                  {step === 4 && 'Review & Submit'}
                </span>
                {step < 4 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && 'Business Information'}
                {currentStep === 2 && 'Services & Contact Details'}
                {currentStep === 3 && 'Pricing & Portfolio'}
                {currentStep === 4 && 'Review & Submit'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <>
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={form.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Enter your business name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select value={form.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Business Description *</Label>
                    <Textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your business and what makes you unique"
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      value={form.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="e.g., 5 years"
                    />
                  </div>
                </>
              )}

              {/* Step 2: Services & Contact */}
              {currentStep === 2 && (
                <>
                  <div>
                    <Label>Services Offered *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {services.map(service => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={service}
                            checked={form.services.includes(service)}
                            onCheckedChange={() => handleServiceToggle(service)}
                          />
                          <Label htmlFor={service} className="text-sm">{service}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={form.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="e.g., Colombo, Sri Lanka"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contactPhone">Phone Number *</Label>
                      <Input
                        id="contactPhone"
                        value={form.contactPhone}
                        onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                        placeholder="+94 77 123 4567"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contactEmail">Email Address *</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={form.contactEmail}
                        onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      value={form.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </>
              )}

              {/* Step 3: Pricing & Portfolio */}
              {currentStep === 3 && (
                <>
                  <div>
                    <Label>Pricing Range *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <Label htmlFor="minPrice">Minimum Price</Label>
                        <Input
                          id="minPrice"
                          type="number"
                          value={form.pricing.minPrice}
                          onChange={(e) => handleNestedInputChange('pricing', 'minPrice', parseInt(e.target.value))}
                          placeholder="50000"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="maxPrice">Maximum Price</Label>
                        <Input
                          id="maxPrice"
                          type="number"
                          value={form.pricing.maxPrice}
                          onChange={(e) => handleNestedInputChange('pricing', 'maxPrice', parseInt(e.target.value))}
                          placeholder="200000"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={form.pricing.currency} onValueChange={(value) => handleNestedInputChange('pricing', 'currency', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LKR">LKR</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Portfolio Images</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 mb-2">Upload your best work</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                        className="hidden"
                        id="portfolio-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('portfolio-upload')?.click()}
                        disabled={uploading}
                      >
                        {uploading ? 'Uploading...' : 'Choose Files'}
                      </Button>
                    </div>
                    {form.portfolio.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Uploaded Images:</p>
                        <div className="grid grid-cols-4 gap-2">
                          {form.portfolio.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Portfolio ${index + 1}`}
                              className="w-20 h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Availability</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="weekdays"
                          checked={form.availability.weekdays}
                          onCheckedChange={(checked) => handleNestedInputChange('availability', 'weekdays', checked)}
                        />
                        <Label htmlFor="weekdays">Weekdays</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="weekends"
                          checked={form.availability.weekends}
                          onCheckedChange={(checked) => handleNestedInputChange('availability', 'weekends', checked)}
                        />
                        <Label htmlFor="weekends">Weekends</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="holidays"
                          checked={form.availability.holidays}
                          onCheckedChange={(checked) => handleNestedInputChange('availability', 'holidays', checked)}
                        />
                        <Label htmlFor="holidays">Holidays</Label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Review Your Information</h3>
                    
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <span className="font-medium">Business Name:</span> {form.businessName}
                      </div>
                      <div>
                        <span className="font-medium">Business Type:</span> {form.businessType}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {form.location}
                      </div>
                      <div>
                        <span className="font-medium">Services:</span> {form.services.join(', ')}
                      </div>
                      <div>
                        <span className="font-medium">Pricing:</span> {form.pricing.minPrice} - {form.pricing.maxPrice} {form.pricing.currency}
                      </div>
                      <div>
                        <span className="font-medium">Contact:</span> {form.contactPhone} | {form.contactEmail}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={form.terms}
                        onCheckedChange={(checked) => handleInputChange('terms', checked)}
                        required
                      />
                      <Label htmlFor="terms" className="text-sm">
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid(currentStep)}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!form.terms || submitting}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    {submitting ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
