'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, User, Building2, Calendar, Heart, Star, Camera, MapPin, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

interface OnboardingWizardProps {
  userType: 'user' | 'vendor' | 'planner';
  onComplete: (data: any) => void;
  onSkip: () => void;
}

export function OnboardingWizard({ userType, onComplete, onSkip }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const steps = {
    user: [
      { id: 'welcome', title: 'Welcome to WeddingLK', icon: Heart },
      { id: 'profile', title: 'Tell us about yourself', icon: User },
      { id: 'preferences', title: 'Wedding preferences', icon: Star },
      { id: 'budget', title: 'Budget planning', icon: Calendar },
      { id: 'timeline', title: 'Wedding timeline', icon: Calendar },
      { id: 'complete', title: 'You\'re all set!', icon: Check }
    ],
    vendor: [
      { id: 'welcome', title: 'Welcome to WeddingLK', icon: Building2 },
      { id: 'business', title: 'Business information', icon: Building2 },
      { id: 'services', title: 'Your services', icon: Camera },
      { id: 'pricing', title: 'Pricing & packages', icon: Star },
      { id: 'availability', title: 'Availability', icon: Calendar },
      { id: 'verification', title: 'Verification', icon: Check },
      { id: 'complete', title: 'Ready to go!', icon: Check }
    ],
    planner: [
      { id: 'welcome', title: 'Welcome to WeddingLK', icon: Users },
      { id: 'profile', title: 'Professional profile', icon: User },
      { id: 'experience', title: 'Experience & expertise', icon: Star },
      { id: 'services', title: 'Planning services', icon: Calendar },
      { id: 'clients', title: 'Client management', icon: Users },
      { id: 'complete', title: 'All set!', icon: Check }
    ]
  };

  const currentSteps = steps[userType];
  const progress = ((currentStep + 1) / currentSteps.length) * 100;

  const nextStep = () => {
    if (currentStep < currentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType,
          data: formData
        })
      });

      if (response.ok) {
        toast({
          title: 'Welcome to WeddingLK!',
          description: 'Your profile has been set up successfully'
        });
        onComplete(formData);
      } else {
        throw new Error('Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete setup. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStep = () => {
    const step = currentSteps[currentStep];
    
    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <step.icon className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Welcome to WeddingLK!</h2>
              <p className="text-gray-600 text-lg">
                {userType === 'user' && "Let's plan your perfect wedding together"}
                {userType === 'vendor' && "Let's grow your wedding business"}
                {userType === 'planner' && "Let's help couples create magical weddings"}
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800">
                This quick setup will help us personalize your experience and connect you with the right people.
              </p>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Tell us about yourself</h2>
              <p className="text-gray-600">Help us personalize your experience</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName || ''}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName || ''}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="+94 XX XXX XXXX"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Select
                value={formData.location || ''}
                onValueChange={(value) => updateFormData('location', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="colombo">Colombo</SelectItem>
                  <SelectItem value="kandy">Kandy</SelectItem>
                  <SelectItem value="galle">Galle</SelectItem>
                  <SelectItem value="negombo">Negombo</SelectItem>
                  <SelectItem value="anuradhapura">Anuradhapura</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => updateFormData('bio', e.target.value)}
                placeholder="Tell us a bit about yourself..."
                rows={3}
              />
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Wedding Preferences</h2>
              <p className="text-gray-600">Help us recommend the perfect vendors for you</p>
            </div>

            <div>
              <Label>Wedding Style</Label>
              <RadioGroup
                value={formData.weddingStyle || ''}
                onValueChange={(value) => updateFormData('weddingStyle', value)}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="traditional" id="traditional" />
                  <Label htmlFor="traditional">Traditional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="modern" id="modern" />
                  <Label htmlFor="modern">Modern</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rustic" id="rustic" />
                  <Label htmlFor="rustic">Rustic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beach" id="beach" />
                  <Label htmlFor="beach">Beach</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="garden" id="garden" />
                  <Label htmlFor="garden">Garden</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="luxury" id="luxury" />
                  <Label htmlFor="luxury">Luxury</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Guest Count</Label>
              <Select
                value={formData.guestCount || ''}
                onValueChange={(value) => updateFormData('guestCount', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Expected number of guests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-50">1-50 guests</SelectItem>
                  <SelectItem value="51-100">51-100 guests</SelectItem>
                  <SelectItem value="101-200">101-200 guests</SelectItem>
                  <SelectItem value="201-300">201-300 guests</SelectItem>
                  <SelectItem value="300+">300+ guests</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Interests</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Photography', 'Videography', 'Catering', 'Music', 'Decorations', 'Transport', 'Beauty', 'Planning'].map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={formData.interests?.includes(interest) || false}
                      onCheckedChange={(checked) => {
                        const interests = formData.interests || [];
                        if (checked) {
                          updateFormData('interests', [...interests, interest]);
                        } else {
                          updateFormData('interests', interests.filter((i: string) => i !== interest));
                        }
                      }}
                    />
                    <Label htmlFor={interest} className="text-sm">{interest}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Budget Planning</h2>
              <p className="text-gray-600">Help us understand your budget range</p>
            </div>

            <div>
              <Label>Total Wedding Budget</Label>
              <Select
                value={formData.budget || ''}
                onValueChange={(value) => updateFormData('budget', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-500k">Under LKR 500,000</SelectItem>
                  <SelectItem value="500k-1m">LKR 500,000 - 1,000,000</SelectItem>
                  <SelectItem value="1m-2m">LKR 1,000,000 - 2,000,000</SelectItem>
                  <SelectItem value="2m-5m">LKR 2,000,000 - 5,000,000</SelectItem>
                  <SelectItem value="5m-10m">LKR 5,000,000 - 10,000,000</SelectItem>
                  <SelectItem value="10m+">LKR 10,000,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Budget Allocation</Label>
              <div className="space-y-4 mt-2">
                {[
                  { category: 'Venue', default: 40 },
                  { category: 'Catering', default: 25 },
                  { category: 'Photography', default: 10 },
                  { category: 'Decorations', default: 15 },
                  { category: 'Music', default: 5 },
                  { category: 'Other', default: 5 }
                ].map((item) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <Label className="text-sm">{item.category}</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.budgetAllocation?.[item.category] || item.default}
                        onChange={(e) => {
                          const allocation = formData.budgetAllocation || {};
                          allocation[item.category] = Number(e.target.value);
                          updateFormData('budgetAllocation', allocation);
                        }}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-500">%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Wedding Timeline</h2>
              <p className="text-gray-600">When are you planning to get married?</p>
            </div>

            <div>
              <Label>Wedding Date</Label>
              <Input
                type="date"
                value={formData.weddingDate || ''}
                onChange={(e) => updateFormData('weddingDate', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label>Planning Stage</Label>
              <RadioGroup
                value={formData.planningStage || ''}
                onValueChange={(value) => updateFormData('planningStage', value)}
                className="space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="just-started" id="just-started" />
                  <Label htmlFor="just-started">Just started planning</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="venue-booked" id="venue-booked" />
                  <Label htmlFor="venue-booked">Venue booked</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vendors-selected" id="vendors-selected" />
                  <Label htmlFor="vendors-selected">Vendors selected</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="final-details" id="final-details" />
                  <Label htmlFor="final-details">Final details</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Do you need a wedding planner?</Label>
              <RadioGroup
                value={formData.needsPlanner || ''}
                onValueChange={(value) => updateFormData('needsPlanner', value)}
                className="space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="needs-planner-yes" />
                  <Label htmlFor="needs-planner-yes">Yes, I need help</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maybe" id="needs-planner-maybe" />
                  <Label htmlFor="needs-planner-maybe">Maybe, let me think</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="needs-planner-no" />
                  <Label htmlFor="needs-planner-no">No, I'm handling it myself</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Business Information</h2>
              <p className="text-gray-600">Tell us about your wedding business</p>
            </div>

            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName || ''}
                onChange={(e) => updateFormData('businessName', e.target.value)}
                placeholder="Enter your business name"
              />
            </div>

            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Select
                value={formData.businessType || ''}
                onValueChange={(value) => updateFormData('businessType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="videography">Videography</SelectItem>
                  <SelectItem value="catering">Catering</SelectItem>
                  <SelectItem value="venue">Venue</SelectItem>
                  <SelectItem value="decorations">Decorations</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="beauty">Beauty & Makeup</SelectItem>
                  <SelectItem value="planning">Wedding Planning</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessDescription">Business Description</Label>
              <Textarea
                id="businessDescription"
                value={formData.businessDescription || ''}
                onChange={(e) => updateFormData('businessDescription', e.target.value)}
                placeholder="Describe your business and services..."
                rows={4}
              />
            </div>

            <div>
              <Label>Years of Experience</Label>
              <Select
                value={formData.experience || ''}
                onValueChange={(value) => updateFormData('experience', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select years of experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="2-5">2-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11-20">11-20 years</SelectItem>
                  <SelectItem value="20+">20+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Services</h2>
              <p className="text-gray-600">What services do you offer?</p>
            </div>

            <div>
              <Label>Service Categories</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {[
                  'Wedding Photography', 'Videography', 'Catering', 'Venue Rental',
                  'Decorations', 'Music & DJ', 'Transport', 'Beauty & Makeup',
                  'Wedding Planning', 'Flowers', 'Cake', 'Lighting'
                ].map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={formData.services?.includes(service) || false}
                      onCheckedChange={(checked) => {
                        const services = formData.services || [];
                        if (checked) {
                          updateFormData('services', [...services, service]);
                        } else {
                          updateFormData('services', services.filter((s: string) => s !== service));
                        }
                      }}
                    />
                    <Label htmlFor={service} className="text-sm">{service}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Service Areas</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Colombo', 'Kandy', 'Galle', 'Negombo', 'Anuradhapura', 'Jaffna', 'Kurunegala', 'All Island'].map((area) => (
                  <div key={area} className="flex items-center space-x-2">
                    <Checkbox
                      id={area}
                      checked={formData.serviceAreas?.includes(area) || false}
                      onCheckedChange={(checked) => {
                        const areas = formData.serviceAreas || [];
                        if (checked) {
                          updateFormData('serviceAreas', [...areas, area]);
                        } else {
                          updateFormData('serviceAreas', areas.filter((a: string) => a !== area));
                        }
                      }}
                    />
                    <Label htmlFor={area} className="text-sm">{area}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Pricing & Packages</h2>
              <p className="text-gray-600">Set your pricing structure</p>
            </div>

            <div>
              <Label>Starting Price Range</Label>
              <Select
                value={formData.priceRange || ''}
                onValueChange={(value) => updateFormData('priceRange', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your starting price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-50k">Under LKR 50,000</SelectItem>
                  <SelectItem value="50k-100k">LKR 50,000 - 100,000</SelectItem>
                  <SelectItem value="100k-250k">LKR 100,000 - 250,000</SelectItem>
                  <SelectItem value="250k-500k">LKR 250,000 - 500,000</SelectItem>
                  <SelectItem value="500k-1m">LKR 500,000 - 1,000,000</SelectItem>
                  <SelectItem value="1m+">LKR 1,000,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Pricing Model</Label>
              <RadioGroup
                value={formData.pricingModel || ''}
                onValueChange={(value) => updateFormData('pricingModel', value)}
                className="space-y-2 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hourly" id="hourly" />
                  <Label htmlFor="hourly">Hourly rates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="package" id="package" />
                  <Label htmlFor="package">Package deals</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom quotes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed">Mixed approach</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Payment Terms</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="deposit"
                    checked={formData.paymentTerms?.includes('deposit') || false}
                    onCheckedChange={(checked) => {
                      const terms = formData.paymentTerms || [];
                      if (checked) {
                        updateFormData('paymentTerms', [...terms, 'deposit']);
                      } else {
                        updateFormData('paymentTerms', terms.filter((t: string) => t !== 'deposit'));
                      }
                    }}
                  />
                  <Label htmlFor="deposit">Require deposit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="full-payment"
                    checked={formData.paymentTerms?.includes('full-payment') || false}
                    onCheckedChange={(checked) => {
                      const terms = formData.paymentTerms || [];
                      if (checked) {
                        updateFormData('paymentTerms', [...terms, 'full-payment']);
                      } else {
                        updateFormData('paymentTerms', terms.filter((t: string) => t !== 'full-payment'));
                      }
                    }}
                  />
                  <Label htmlFor="full-payment">Full payment upfront</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="installments"
                    checked={formData.paymentTerms?.includes('installments') || false}
                    onCheckedChange={(checked) => {
                      const terms = formData.paymentTerms || [];
                      if (checked) {
                        updateFormData('paymentTerms', [...terms, 'installments']);
                      } else {
                        updateFormData('paymentTerms', terms.filter((t: string) => t !== 'installments'));
                      }
                    }}
                  />
                  <Label htmlFor="installments">Payment installments</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'availability':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Availability</h2>
              <p className="text-gray-600">When are you available for bookings?</p>
            </div>

            <div>
              <Label>Available Days</Label>
              <div className="grid grid-cols-7 gap-2 mt-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <Button
                    key={day}
                    variant={formData.availableDays?.includes(index) ? "default" : "outline"}
                    onClick={() => {
                      const days = formData.availableDays || [];
                      if (days.includes(index)) {
                        updateFormData('availableDays', days.filter((d: number) => d !== index));
                      } else {
                        updateFormData('availableDays', [...days, index]);
                      }
                    }}
                    className="text-xs"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Advance Booking</Label>
              <Select
                value={formData.advanceBooking || ''}
                onValueChange={(value) => updateFormData('advanceBooking', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="How far in advance can customers book?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-week">1 week</SelectItem>
                  <SelectItem value="1-month">1 month</SelectItem>
                  <SelectItem value="3-months">3 months</SelectItem>
                  <SelectItem value="6-months">6 months</SelectItem>
                  <SelectItem value="1-year">1 year</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Peak Season</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
                  <div key={month} className="flex items-center space-x-2">
                    <Checkbox
                      id={month}
                      checked={formData.peakSeason?.includes(month) || false}
                      onCheckedChange={(checked) => {
                        const months = formData.peakSeason || [];
                        if (checked) {
                          updateFormData('peakSeason', [...months, month]);
                        } else {
                          updateFormData('peakSeason', months.filter((m: string) => m !== month));
                        }
                      }}
                    />
                    <Label htmlFor={month} className="text-sm">{month}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'verification':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Verification</h2>
              <p className="text-gray-600">Verify your business to build trust with customers</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Required Documents</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Business registration certificate</li>
                <li>• Tax registration certificate</li>
                <li>• Valid ID (NIC/Passport)</li>
                <li>• Portfolio samples (3-5 examples)</li>
              </ul>
            </div>

            <div>
              <Label>Upload Documents</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Drag and drop your documents here, or click to select files
                </p>
                <Button>
                  <Camera className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Verification typically takes 1-3 business days. 
                You can start using the platform while verification is in progress.
              </p>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">You're all set!</h2>
              <p className="text-gray-600 text-lg">
                {userType === 'user' && "Your profile is ready. Start exploring vendors and planning your perfect wedding!"}
                {userType === 'vendor' && "Your business profile is ready. Start connecting with couples and growing your business!"}
                {userType === 'planner' && "Your planner profile is ready. Start helping couples create magical weddings!"}
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                🎉 Welcome to the WeddingLK community! We're excited to have you on board.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {currentSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                ))}
              </div>
              <Button variant="ghost" onClick={onSkip}>
                Skip
              </Button>
            </div>
            <Progress value={progress} className="mb-4" />
            <div className="text-center">
              <h1 className="text-2xl font-bold">{currentSteps[currentStep].title}</h1>
              <p className="text-gray-600">
                Step {currentStep + 1} of {currentSteps.length}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
          <div className="flex justify-between p-6 pt-0">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={nextStep}
              disabled={loading}
            >
              {loading ? 'Saving...' : currentStep === currentSteps.length - 1 ? 'Complete' : 'Next'}
              {!loading && currentStep < currentSteps.length - 1 && (
                <ChevronRight className="w-4 h-4 ml-2" />
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
