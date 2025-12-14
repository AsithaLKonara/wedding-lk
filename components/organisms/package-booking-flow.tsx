'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  Star,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VendorPackage {
  _id: string;
  name: string;
  description: string;
  category: string;
  pricing: {
    basePrice: number;
    discountedPrice?: number;
    discountPercentage?: number;
    currency: string;
    isNegotiable: boolean;
  };
  availability: {
    isAvailable: boolean;
    availableFrom: string;
    availableUntil?: string;
    maxBookings: number;
    currentBookings: number;
    advanceBookingDays: number;
    blackoutDates: string[];
  };
  requirements: {
    minGuests: number;
    maxGuests: number;
    venueRequirements: string[];
    equipmentProvided: string[];
    equipmentRequired: string[];
    setupTime: number;
    breakdownTime: number;
  };
  media: {
    type: 'image' | 'video' | 'document';
    url: string;
    thumbnail?: string;
    caption?: string;
    isPrimary: boolean;
  }[];
  features: {
    name: string;
    description: string;
    icon?: string;
  }[];
  reviews: {
    averageRating: number;
    totalReviews: number;
  };
  tags: string[];
  vendor: {
    _id: string;
    businessName: string;
    email: string;
    phone: string;
    rating: {
      average: number;
      count: number;
    };
    location: {
      address: string;
      city: string;
      coordinates: [number, number];
    };
  };
}

interface PackageBookingFlowProps {
  packageId: string;
  onBookingCreated?: (booking: any) => void;
  onCancel?: () => void;
}

export function PackageBookingFlow({ packageId, onBookingCreated, onCancel }: PackageBookingFlowProps) {
  const [packageData, setPackageData] = useState<VendorPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    schedule: {
      date: '',
      startTime: '',
      endTime: '',
      duration: 8
    },
    guests: {
      count: 1,
      minGuests: 1,
      maxGuests: 1000
    },
    venue: {
      id: '',
      name: '',
      address: ''
    },
    customizations: {} as Record<string, any>,
    notes: '',
    paymentMethod: 'stripe',
    contactInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });
  const { toast } = useToast();

  const steps = [
    { id: 1, title: 'Package Details', description: 'Review package information' },
    { id: 2, title: 'Schedule', description: 'Select date and time' },
    { id: 3, title: 'Customize', description: 'Customize your booking' },
    { id: 4, title: 'Review', description: 'Review and confirm' },
    { id: 5, title: 'Payment', description: 'Complete payment' }
  ];

  useEffect(() => {
    fetchPackageData();
  }, [packageId]);

  const fetchPackageData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vendor-packages/${packageId}`);
      
      if (response.ok) {
        const data = await response.json();
        setPackageData(data.package);
        setFormData(prev => ({
          ...prev,
          guests: {
            count: data.package.requirements.minGuests,
            minGuests: data.package.requirements.minGuests,
            maxGuests: data.package.requirements.maxGuests
          }
        }));
      } else {
        throw new Error('Failed to fetch package data');
      }
    } catch (error) {
      console.error('Error fetching package data:', error);
      toast({
        title: "Error",
        description: "Failed to load package details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitBooking = async () => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/bookings/vendor-package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId,
          schedule: formData.schedule,
          venueId: formData.venue.id,
          customizations: formData.customizations,
          notes: formData.notes,
          paymentMethod: formData.paymentMethod
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: "Booking created successfully!",
        });
        onBookingCreated?.(data.booking);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create booking',
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const calculatePrice = () => {
    if (!packageData) return 0;
    const basePrice = packageData.pricing.discountedPrice || packageData.pricing.basePrice;
    const taxRate = 0.15;
    const taxAmount = basePrice * taxRate;
    return basePrice + taxAmount;
  };

  const isDateAvailable = (date: string) => {
    if (!packageData) return false;
    const bookingDate = new Date(date);
    const today = new Date();
    const maxDate = new Date(today.getTime() + (packageData.availability.advanceBookingDays * 24 * 60 * 60 * 1000));
    
    return bookingDate >= today && 
           bookingDate <= maxDate && 
           !packageData.availability.blackoutDates.some(blackoutDate => 
             new Date(blackoutDate).toDateString() === bookingDate.toDateString()
           );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading package details...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!packageData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Package not found</p>
          <Button onClick={onCancel} className="mt-4">
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= step.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
            </div>
            <div className="ml-2 hidden sm:block">
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="h-4 w-4 mx-4 text-gray-400" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                {packageData.media.find(m => m.isPrimary) && (
                  <img
                    src={packageData.media.find(m => m.isPrimary)?.url}
                    alt={packageData.name}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{packageData.name}</h2>
                  <p className="text-gray-600 mb-4">{packageData.description}</p>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge className="bg-blue-100 text-blue-800">
                      {packageData.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{packageData.reviews.averageRating.toFixed(1)}</span>
                      <span className="text-gray-500">({packageData.reviews.totalReviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <span className="text-2xl font-bold">
                        {packageData.pricing.currency} {packageData.pricing.discountedPrice || packageData.pricing.basePrice}
                      </span>
                      {packageData.pricing.discountedPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          {packageData.pricing.currency} {packageData.pricing.basePrice}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <span>{packageData.requirements.minGuests}-{packageData.requirements.maxGuests} guests</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Vendor Information</h3>
                  <div className="space-y-2">
                    <p className="font-medium">{packageData.vendor.businessName}</p>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{packageData.vendor.location.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{packageData.vendor.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{packageData.vendor.email}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Package Features</h3>
                  <div className="space-y-2">
                    {packageData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Select Date & Time</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Date</label>
                  <Input
                    type="date"
                    value={formData.schedule.date}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: { ...formData.schedule, date: e.target.value }
                    })}
                    min={new Date().toISOString().split('T')[0]}
                    max={new Date(Date.now() + (packageData.availability.advanceBookingDays * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}
                  />
                  {formData.schedule.date && !isDateAvailable(formData.schedule.date) && (
                    <p className="text-red-500 text-sm mt-1">Selected date is not available</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <Input
                    type="time"
                    value={formData.schedule.startTime}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: { ...formData.schedule, startTime: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <Input
                    type="time"
                    value={formData.schedule.endTime}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: { ...formData.schedule, endTime: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Duration (hours)</label>
                  <Input
                    type="number"
                    value={formData.schedule.duration}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: { ...formData.schedule, duration: parseInt(e.target.value) || 8 }
                    })}
                    min="1"
                    max="24"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Number of Guests</label>
                <Input
                  type="number"
                  value={formData.guests.count}
                  onChange={(e) => setFormData({
                    ...formData,
                    guests: { ...formData.guests, count: parseInt(e.target.value) || 1 }
                  })}
                  min={formData.guests.minGuests}
                  max={formData.guests.maxGuests}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum: {formData.guests.minGuests}, Maximum: {formData.guests.maxGuests}
                </p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Customize Your Booking</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Special Requests or Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({
                    ...formData,
                    notes: e.target.value
                  })}
                  placeholder="Any special requests or additional information..."
                  rows={4}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Contact Information</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="Your Name"
                    value={formData.contactInfo.name}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, name: e.target.value }
                    })}
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, email: e.target.value }
                    })}
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      contactInfo: { ...formData.contactInfo, phone: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Review Your Booking</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Booking Details</h3>
                  <div className="space-y-2">
                    <p><strong>Package:</strong> {packageData.name}</p>
                    <p><strong>Date:</strong> {new Date(formData.schedule.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {formData.schedule.startTime} - {formData.schedule.endTime}</p>
                    <p><strong>Duration:</strong> {formData.schedule.duration} hours</p>
                    <p><strong>Guests:</strong> {formData.guests.count}</p>
                    {formData.notes && (
                      <p><strong>Notes:</strong> {formData.notes}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Pricing Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>{packageData.pricing.currency} {packageData.pricing.discountedPrice || packageData.pricing.basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (15%):</span>
                      <span>{packageData.pricing.currency} {(calculatePrice() - (packageData.pricing.discountedPrice || packageData.pricing.basePrice)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total:</span>
                      <span>{packageData.pricing.currency} {calculatePrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Payment</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({
                      ...formData,
                      paymentMethod: e.target.value
                    })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="stripe">Credit/Debit Card (Stripe)</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cash">Cash Payment</option>
                  </select>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Payment Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Package: {packageData.name}</span>
                      <span>{packageData.pricing.currency} {packageData.pricing.discountedPrice || packageData.pricing.basePrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (15%)</span>
                      <span>{packageData.pricing.currency} {(calculatePrice() - (packageData.pricing.discountedPrice || packageData.pricing.basePrice)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total Amount</span>
                      <span>{packageData.pricing.currency} {calculatePrice().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : handlePrevious}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 1 ? 'Cancel' : 'Previous'}
        </Button>
        
        {currentStep < steps.length ? (
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 2 && (!formData.schedule.date || !isDateAvailable(formData.schedule.date))) ||
              (currentStep === 3 && (!formData.contactInfo.name || !formData.contactInfo.email))
            }
          >
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmitBooking}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Booking...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Complete Booking
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
