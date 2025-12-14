'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Users, 
  Star,
  Plus,
  Minus,
  Info,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Service {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  duration: number;
  maxCapacity?: number;
  customizations?: {
    name: string;
    type: 'text' | 'number' | 'boolean' | 'select';
    options?: string[];
    required: boolean;
  }[];
}

interface Vendor {
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
}

interface Venue {
  _id: string;
  name: string;
  location: {
    address: string;
    city: string;
    coordinates: [number, number];
  };
  capacity: number;
  amenities: string[];
}

interface Availability {
  _id: string;
  date: string;
  timeSlots: {
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    price: number;
    maxBookings: number;
    currentBookings: number;
  }[];
}

interface BookingFormData {
  vendor: string;
  venue?: string;
  services: {
    service: string;
    quantity: number;
    price: number;
    customizations: {
      key: string;
      value: any;
    }[];
  }[];
  schedule: {
    date: string;
    startTime: string;
    endTime: string;
    duration: number;
    timezone: string;
    recurring?: {
      isRecurring: boolean;
      frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
      endDate?: string;
      daysOfWeek?: number[];
    };
  };
  pricing: {
    basePrice: number;
    dynamicPricing: {
      multiplier: number;
      factors: string[];
    };
    discounts: {
      type: 'percentage' | 'fixed' | 'loyalty' | 'promotional';
      amount: number;
      reason: string;
    }[];
    totalPrice: number;
    currency: string;
    taxRate: number;
    taxAmount: number;
    finalPrice: number;
  };
  paymentMethod: string;
  notes?: string;
  customFields: {
    key: string;
    value: any;
  }[];
}

interface AdvancedBookingFormProps {
  vendorId: string;
  venueId?: string;
  onBookingCreated?: (booking: any) => void;
  onCancel?: () => void;
}

export function AdvancedBookingForm({ 
  vendorId, 
  venueId, 
  onBookingCreated, 
  onCancel 
}: AdvancedBookingFormProps) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedServices, setSelectedServices] = useState<{
    service: string;
    quantity: number;
    customizations: { key: string; value: any }[];
  }[]>([]);
  const [formData, setFormData] = useState<BookingFormData>({
    vendor: vendorId,
    venue: venueId,
    services: [],
    schedule: {
      date: '',
      startTime: '',
      endTime: '',
      duration: 0,
      timezone: 'UTC'
    },
    pricing: {
      basePrice: 0,
      dynamicPricing: { multiplier: 1, factors: [] },
      discounts: [],
      totalPrice: 0,
      currency: 'LKR',
      taxRate: 0.15,
      taxAmount: 0,
      finalPrice: 0
    },
    paymentMethod: 'stripe',
    notes: '',
    customFields: []
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [vendorId, venueId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch vendor data
      const vendorResponse = await fetch(`/api/vendors/${vendorId}`);
      if (vendorResponse.ok) {
        const vendorData = await vendorResponse.json();
        setVendor(vendorData.vendor);
      }

      // Fetch venue data if provided
      if (venueId) {
        const venueResponse = await fetch(`/api/venues/${venueId}`);
        if (venueResponse.ok) {
          const venueData = await venueResponse.json();
          setVenue(venueData.venue);
        }
      }

      // Fetch services
      const servicesResponse = await fetch(`/api/services?vendorId=${vendorId}`);
      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData.services || []);
      }

      // Fetch availability
      const availabilityResponse = await fetch(`/api/availability?vendorId=${vendorId}&venueId=${venueId || ''}`);
      if (availabilityResponse.ok) {
        const availabilityData = await availabilityResponse.json();
        setAvailability(availabilityData.availability || []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load booking data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAdd = (serviceId: string) => {
    const service = services.find(s => s._id === serviceId);
    if (!service) return;

    const newService = {
      service: serviceId,
      quantity: 1,
      customizations: service.customizations?.map(c => ({
        key: c.name,
        value: c.type === 'boolean' ? false : c.type === 'number' ? 0 : ''
      })) || []
    };

    setSelectedServices([...selectedServices, newService]);
    updateFormData();
  };

  const handleServiceRemove = (index: number) => {
    const newServices = selectedServices.filter((_, i) => i !== index);
    setSelectedServices(newServices);
    updateFormData();
  };

  const handleServiceQuantityChange = (index: number, quantity: number) => {
    const newServices = [...selectedServices];
    newServices[index].quantity = Math.max(1, quantity);
    setSelectedServices(newServices);
    updateFormData();
  };

  const handleServiceCustomizationChange = (serviceIndex: number, key: string, value: any) => {
    const newServices = [...selectedServices];
    const customization = newServices[serviceIndex].customizations.find(c => c.key === key);
    if (customization) {
      customization.value = value;
    }
    setSelectedServices(newServices);
    updateFormData();
  };

  const updateFormData = () => {
    const basePrice = selectedServices.reduce((sum, service) => {
      const serviceData = services.find(s => s._id === service.service);
      return sum + (serviceData?.basePrice || 0) * service.quantity;
    }, 0);

    const taxRate = 0.15;
    const taxAmount = basePrice * taxRate;
    const finalPrice = basePrice + taxAmount;

    setFormData(prev => ({
      ...prev,
      services: selectedServices.map(service => ({
        ...service,
        price: (services.find(s => s._id === service.service)?.basePrice || 0) * service.quantity
      })),
      pricing: {
        ...prev.pricing,
        basePrice,
        totalPrice: basePrice,
        taxAmount,
        finalPrice
      }
    }));
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot('');
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        date
      }
    }));
  };

  const handleTimeSlotChange = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    const [startTime, endTime] = timeSlot.split(' - ');
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        startTime,
        endTime,
        duration: calculateDuration(startTime, endTime)
      }
    }));
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one service",
        variant: "destructive"
      });
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: "Error",
        description: "Please select a date and time slot",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      
      const response = await fetch('/api/enhanced-bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

  const getAvailableTimeSlots = () => {
    if (!selectedDate) return [];
    
    const dayAvailability = availability.find(a => 
      new Date(a.date).toDateString() === new Date(selectedDate).toDateString()
    );
    
    return dayAvailability?.timeSlots.filter(slot => slot.isAvailable) || [];
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading booking data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Vendor & Venue Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Vendor & Venue</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {vendor && (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">{vendor.businessName}</h3>
                <p className="text-sm text-gray-600">{vendor.location.address}</p>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(vendor.rating.average)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({vendor.rating.count} reviews)
                  </span>
                </div>
              </div>
            </div>
          )}

          {venue && (
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">{venue.name}</h3>
                <p className="text-sm text-gray-600">{venue.location.address}</p>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Capacity: {venue.capacity}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Services Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Select Services</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service._id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{service.name}</h3>
                  <Badge variant="outline">
                    LKR {service.basePrice.toLocaleString()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{service.duration} min</span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleServiceAdd(service._id)}
                    disabled={selectedServices.some(s => s.service === service._id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Services */}
          {selectedServices.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Selected Services</h4>
              {selectedServices.map((service, index) => {
                const serviceData = services.find(s => s._id === service.service);
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium">{serviceData?.name}</h5>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleServiceRemove(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleServiceQuantityChange(index, service.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input
                            id={`quantity-${index}`}
                            type="number"
                            value={service.quantity}
                            onChange={(e) => handleServiceQuantityChange(index, parseInt(e.target.value) || 1)}
                            className="w-20 text-center"
                            min="1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleServiceQuantityChange(index, service.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label>Total Price</Label>
                        <p className="text-lg font-semibold">
                          LKR {((serviceData?.basePrice || 0) * service.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Service Customizations */}
                    {serviceData?.customizations && serviceData.customizations.length > 0 && (
                      <div className="space-y-2">
                        <Label>Customizations</Label>
                        {serviceData.customizations.map((customization) => (
                          <div key={customization.name}>
                            <Label htmlFor={`${index}-${customization.name}`}>
                              {customization.name}
                              {customization.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            {customization.type === 'text' && (
                              <Input
                                id={`${index}-${customization.name}`}
                                value={service.customizations.find(c => c.key === customization.name)?.value || ''}
                                onChange={(e) => handleServiceCustomizationChange(index, customization.name, e.target.value)}
                                required={customization.required}
                              />
                            )}
                            {customization.type === 'number' && (
                              <Input
                                id={`${index}-${customization.name}`}
                                type="number"
                                value={service.customizations.find(c => c.key === customization.name)?.value || 0}
                                onChange={(e) => handleServiceCustomizationChange(index, customization.name, parseFloat(e.target.value) || 0)}
                                required={customization.required}
                              />
                            )}
                            {customization.type === 'boolean' && (
                              <Checkbox
                                id={`${index}-${customization.name}`}
                                checked={service.customizations.find(c => c.key === customization.name)?.value || false}
                                onCheckedChange={(checked) => handleServiceCustomizationChange(index, customization.name, checked)}
                              />
                            )}
                            {customization.type === 'select' && customization.options && (
                              <Select
                                value={service.customizations.find(c => c.key === customization.name)?.value || ''}
                                onValueChange={(value) => handleServiceCustomizationChange(index, customization.name, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent>
                                  {customization.options.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date & Time Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Select Date & Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            <div>
              <Label htmlFor="timeSlot">Time Slot</Label>
              <Select
                value={selectedTimeSlot}
                onValueChange={handleTimeSlotChange}
                disabled={!selectedDate}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time slot" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableTimeSlots().map((slot) => (
                    <SelectItem key={`${slot.startTime}-${slot.endTime}`} value={`${slot.startTime} - ${slot.endTime}`}>
                      {slot.startTime} - {slot.endTime} (LKR {slot.price.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Pricing Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span>LKR {formData.pricing.basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (15%):</span>
              <span>LKR {formData.pricing.taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total:</span>
              <span>LKR {formData.pricing.finalPrice.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Special Requests or Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requests or additional information..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stripe">Credit/Debit Card (Stripe)</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting || selectedServices.length === 0 || !selectedDate || !selectedTimeSlot}
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating Booking...
            </>
          ) : (
            'Create Booking'
          )}
        </Button>
      </div>
    </form>
  );
}
