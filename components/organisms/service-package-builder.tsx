'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, Eye, Upload, Calendar, Clock, Users, DollarSign, Settings, Image, Video, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

interface ServiceItem {
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  isIncluded: boolean;
  isRequired: boolean;
  category: string;
}

interface AddonItem {
  name: string;
  description: string;
  price: number;
  isPopular: boolean;
  category: string;
}

interface PricingTier {
  name: string;
  description: string;
  price: number;
  features: string[];
  isPopular: boolean;
  maxBookings?: number;
  validityDays?: number;
}

interface ServicePackageBuilderProps {
  vendorId: string;
  onSave?: (packageData: any) => void;
  initialData?: any;
}

export function ServicePackageBuilder({ vendorId, onSave, initialData }: ServicePackageBuilderProps) {
  const [packageData, setPackageData] = useState({
    name: '',
    description: '',
    category: '',
    type: 'basic' as 'basic' | 'premium' | 'custom' | 'addon',
    basePrice: 0,
    currency: 'LKR',
    services: [] as ServiceItem[],
    addons: [] as AddonItem[],
    pricingTiers: [] as PricingTier[],
    settings: {
      isActive: true,
      isPublic: true,
      allowCustomization: true,
      requiresApproval: false,
      maxAdvanceBooking: 365,
      minAdvanceBooking: 1,
      cancellationPolicy: {
        freeCancellationHours: 48,
        partialRefundHours: 24,
        noRefundHours: 12
      }
    },
    availability: {
      daysOfWeek: [] as number[],
      timeSlots: [] as { start: string; end: string; isAvailable: boolean }[],
      blackoutDates: [] as Date[]
    },
    requirements: {
      guestCount: { min: 1, max: 1000 },
      venueRequirements: [] as string[],
      equipmentProvided: [] as string[],
      equipmentRequired: [] as string[]
    },
    images: [] as { url: string; caption: string; isPrimary: boolean; order: number }[],
    videos: [] as { url: string; thumbnail: string; duration: number; caption: string }[],
    tags: [] as string[],
    keywords: [] as string[],
    location: {
      name: '',
      coordinates: { lat: 0, lng: 0 },
      radius: 50
    }
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [newService, setNewService] = useState<Partial<ServiceItem>>({
    name: '',
    description: '',
    quantity: 1,
    unitPrice: 0,
    isIncluded: true,
    isRequired: true,
    category: ''
  });
  const [newAddon, setNewAddon] = useState<Partial<AddonItem>>({
    name: '',
    description: '',
    price: 0,
    isPopular: false,
    category: ''
  });
  const [newTier, setNewTier] = useState<Partial<PricingTier>>({
    name: '',
    description: '',
    price: 0,
    features: [],
    isPopular: false
  });

  const categories = [
    'Photography', 'Videography', 'Catering', 'Venue', 'Decorations',
    'Music', 'Transport', 'Beauty', 'Planning', 'Other'
  ];

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  useEffect(() => {
    if (initialData) {
      setPackageData(initialData);
    }
  }, [initialData]);

  const addService = () => {
    if (!newService.name || !newService.unitPrice) return;

    const service: ServiceItem = {
      name: newService.name!,
      description: newService.description || '',
      quantity: newService.quantity || 1,
      unitPrice: newService.unitPrice!,
      totalPrice: (newService.quantity || 1) * newService.unitPrice!,
      isIncluded: newService.isIncluded ?? true,
      isRequired: newService.isRequired ?? true,
      category: newService.category || ''
    };

    setPackageData(prev => ({
      ...prev,
      services: [...prev.services, service]
    }));

    setNewService({
      name: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      isIncluded: true,
      isRequired: true,
      category: ''
    });
  };

  const removeService = (index: number) => {
    setPackageData(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const addAddon = () => {
    if (!newAddon.name || !newAddon.price) return;

    const addon: AddonItem = {
      name: newAddon.name!,
      description: newAddon.description || '',
      price: newAddon.price!,
      isPopular: newAddon.isPopular ?? false,
      category: newAddon.category || ''
    };

    setPackageData(prev => ({
      ...prev,
      addons: [...prev.addons, addon]
    }));

    setNewAddon({
      name: '',
      description: '',
      price: 0,
      isPopular: false,
      category: ''
    });
  };

  const removeAddon = (index: number) => {
    setPackageData(prev => ({
      ...prev,
      addons: prev.addons.filter((_, i) => i !== index)
    }));
  };

  const addPricingTier = () => {
    if (!newTier.name || !newTier.price) return;

    const tier: PricingTier = {
      name: newTier.name!,
      description: newTier.description || '',
      price: newTier.price!,
      features: newTier.features || [],
      isPopular: newTier.isPopular ?? false,
      maxBookings: newTier.maxBookings,
      validityDays: newTier.validityDays
    };

    setPackageData(prev => ({
      ...prev,
      pricingTiers: [...prev.pricingTiers, tier]
    }));

    setNewTier({
      name: '',
      description: '',
      price: 0,
      features: [],
      isPopular: false
    });
  };

  const removePricingTier = (index: number) => {
    setPackageData(prev => ({
      ...prev,
      pricingTiers: prev.pricingTiers.filter((_, i) => i !== index)
    }));
  };

  const addFeature = (tierIndex: number, feature: string) => {
    if (!feature.trim()) return;

    setPackageData(prev => ({
      ...prev,
      pricingTiers: prev.pricingTiers.map((tier, index) => 
        index === tierIndex 
          ? { ...tier, features: [...tier.features, feature.trim()] }
          : tier
      )
    }));
  };

  const removeFeature = (tierIndex: number, featureIndex: number) => {
    setPackageData(prev => ({
      ...prev,
      pricingTiers: prev.pricingTiers.map((tier, index) => 
        index === tierIndex 
          ? { ...tier, features: tier.features.filter((_, i) => i !== featureIndex) }
          : tier
      )
    }));
  };

  const toggleDayOfWeek = (day: number) => {
    setPackageData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        daysOfWeek: prev.availability.daysOfWeek.includes(day)
          ? prev.availability.daysOfWeek.filter(d => d !== day)
          : [...prev.availability.daysOfWeek, day]
      }
    }));
  };

  const addTimeSlot = () => {
    setPackageData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: [...prev.availability.timeSlots, { start: '09:00', end: '17:00', isAvailable: true }]
      }
    }));
  };

  const updateTimeSlot = (index: number, field: string, value: string | boolean) => {
    setPackageData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: prev.availability.timeSlots.map((slot, i) => 
          i === index ? { ...slot, [field]: value } : slot
        )
      }
    }));
  };

  const removeTimeSlot = (index: number) => {
    setPackageData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: prev.availability.timeSlots.filter((_, i) => i !== index)
      }
    }));
  };

  const addTag = (tag: string) => {
    if (!tag.trim() || packageData.tags.includes(tag.trim())) return;

    setPackageData(prev => ({
      ...prev,
      tags: [...prev.tags, tag.trim()]
    }));
  };

  const removeTag = (tag: string) => {
    setPackageData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const savePackage = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/service-packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...packageData,
          vendorId
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Service package saved successfully'
        });
        onSave?.(packageData);
      } else {
        throw new Error('Failed to save package');
      }
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: 'Error',
        description: 'Failed to save service package',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Service Package Builder</h1>
        <p className="text-gray-600">
          Create and customize your service packages for customers
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Package Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Package Name</Label>
                  <Input
                    id="name"
                    value={packageData.name}
                    onChange={(e) => setPackageData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Premium Wedding Photography"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={packageData.category}
                    onValueChange={(value) => setPackageData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={packageData.description}
                  onChange={(e) => setPackageData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your service package..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="type">Package Type</Label>
                  <Select
                    value={packageData.type}
                    onValueChange={(value: any) => setPackageData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                      <SelectItem value="addon">Add-on</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="basePrice">Base Price</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={packageData.basePrice}
                    onChange={(e) => setPackageData(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={packageData.currency}
                    onValueChange={(value) => setPackageData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LKR">LKR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {packageData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add tag"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addTag(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Add tag"]') as HTMLInputElement;
                      if (input) {
                        addTag(input.value);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Services Included</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Service Form */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Add Service</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Service Name</Label>
                    <Input
                      value={newService.name || ''}
                      onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., 8-hour photography"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={newService.category || ''}
                      onChange={(e) => setNewService(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., Photography"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newService.description || ''}
                    onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this service..."
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      value={newService.quantity || 1}
                      onChange={(e) => setNewService(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      value={newService.unitPrice || 0}
                      onChange={(e) => setNewService(prev => ({ ...prev, unitPrice: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addService} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Service
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newService.isIncluded ?? true}
                      onCheckedChange={(checked) => setNewService(prev => ({ ...prev, isIncluded: checked }))}
                    />
                    <Label>Included in package</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newService.isRequired ?? true}
                      onCheckedChange={(checked) => setNewService(prev => ({ ...prev, isRequired: checked }))}
                    />
                    <Label>Required</Label>
                  </div>
                </div>
              </div>

              {/* Services List */}
              <div className="space-y-2">
                {packageData.services.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{service.name}</h4>
                        <Badge variant={service.isIncluded ? "default" : "secondary"}>
                          {service.isIncluded ? 'Included' : 'Optional'}
                        </Badge>
                        {service.isRequired && (
                          <Badge variant="destructive">Required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <p className="text-sm font-medium">
                        {service.quantity}x {packageData.currency} {service.unitPrice} = {packageData.currency} {service.totalPrice}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeService(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card>
            <CardHeader>
              <CardTitle>Add-ons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Add Add-on</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Add-on Name</Label>
                    <Input
                      value={newAddon.name || ''}
                      onChange={(e) => setNewAddon(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Extra hour of photography"
                    />
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={newAddon.price || 0}
                      onChange={(e) => setNewAddon(prev => ({ ...prev, price: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newAddon.description || ''}
                    onChange={(e) => setNewAddon(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this add-on..."
                    rows={2}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newAddon.isPopular ?? false}
                      onCheckedChange={(checked) => setNewAddon(prev => ({ ...prev, isPopular: checked }))}
                    />
                    <Label>Popular add-on</Label>
                  </div>
                  <Button onClick={addAddon}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Add-on
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {packageData.addons.map((addon, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{addon.name}</h4>
                        {addon.isPopular && (
                          <Badge variant="default">Popular</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{addon.description}</p>
                      <p className="text-sm font-medium">
                        {packageData.currency} {addon.price}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAddon(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tiers */}
        <TabsContent value="pricing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Tiers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Add Pricing Tier</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tier Name</Label>
                    <Input
                      value={newTier.name || ''}
                      onChange={(e) => setNewTier(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Basic Package"
                    />
                  </div>
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="number"
                      value={newTier.price || 0}
                      onChange={(e) => setNewTier(prev => ({ ...prev, price: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={newTier.description || ''}
                    onChange={(e) => setNewTier(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this pricing tier..."
                    rows={2}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={newTier.isPopular ?? false}
                      onCheckedChange={(checked) => setNewTier(prev => ({ ...prev, isPopular: checked }))}
                    />
                    <Label>Popular tier</Label>
                  </div>
                  <Button onClick={addPricingTier}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tier
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {packageData.pricingTiers.map((tier, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{tier.name}</h4>
                        {tier.isPopular && (
                          <Badge variant="default">Popular</Badge>
                        )}
                        <Badge variant="outline">{packageData.currency} {tier.price}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePricingTier(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{tier.description}</p>
                    <div>
                      <Label>Features</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tier.features.map((feature, featureIndex) => (
                          <Badge key={featureIndex} variant="secondary" className="flex items-center gap-1">
                            {feature}
                            <button
                              onClick={() => removeFeature(index, featureIndex)}
                              className="ml-1 hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add feature"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addFeature(index, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <Button
                          onClick={() => {
                            const input = document.querySelector(`input[placeholder="Add feature"]`) as HTMLInputElement;
                            if (input) {
                              addFeature(index, input.value);
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Availability */}
        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Availability Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Available Days</Label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {daysOfWeek.map((day, index) => (
                    <Button
                      key={index}
                      variant={packageData.availability.daysOfWeek.includes(index) ? "default" : "outline"}
                      onClick={() => toggleDayOfWeek(index)}
                      className="text-xs"
                    >
                      {day.slice(0, 3)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Time Slots</Label>
                  <Button onClick={addTimeSlot} size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Slot
                  </Button>
                </div>
                <div className="space-y-2">
                  {packageData.availability.timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={slot.start}
                        onChange={(e) => updateTimeSlot(index, 'start', e.target.value)}
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={slot.end}
                        onChange={(e) => updateTimeSlot(index, 'end', e.target.value)}
                      />
                      <Switch
                        checked={slot.isAvailable}
                        onCheckedChange={(checked) => updateTimeSlot(index, 'isAvailable', checked)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTimeSlot(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Guest Count Range</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="minGuests">Minimum</Label>
                    <Input
                      id="minGuests"
                      type="number"
                      value={packageData.requirements.guestCount.min}
                      onChange={(e) => setPackageData(prev => ({
                        ...prev,
                        requirements: {
                          ...prev.requirements,
                          guestCount: {
                            ...prev.requirements.guestCount,
                            min: Number(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxGuests">Maximum</Label>
                    <Input
                      id="maxGuests"
                      type="number"
                      value={packageData.requirements.guestCount.max}
                      onChange={(e) => setPackageData(prev => ({
                        ...prev,
                        requirements: {
                          ...prev.requirements,
                          guestCount: {
                            ...prev.requirements.guestCount,
                            max: Number(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media Gallery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Images and Videos</h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop files here, or click to select files
                </p>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Package Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Active Package</Label>
                    <p className="text-sm text-gray-600">Make this package available for booking</p>
                  </div>
                  <Switch
                    checked={packageData.settings.isActive}
                    onCheckedChange={(checked) => setPackageData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, isActive: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Package</Label>
                    <p className="text-sm text-gray-600">Show this package in search results</p>
                  </div>
                  <Switch
                    checked={packageData.settings.isPublic}
                    onCheckedChange={(checked) => setPackageData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, isPublic: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Customization</Label>
                    <p className="text-sm text-gray-600">Let customers customize this package</p>
                  </div>
                  <Switch
                    checked={packageData.settings.allowCustomization}
                    onCheckedChange={(checked) => setPackageData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, allowCustomization: checked }
                    }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Requires Approval</Label>
                    <p className="text-sm text-gray-600">Manual approval required for bookings</p>
                  </div>
                  <Switch
                    checked={packageData.settings.requiresApproval}
                    onCheckedChange={(checked) => setPackageData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, requiresApproval: checked }
                    }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxAdvanceBooking">Max Advance Booking (days)</Label>
                  <Input
                    id="maxAdvanceBooking"
                    type="number"
                    value={packageData.settings.maxAdvanceBooking}
                    onChange={(e) => setPackageData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, maxAdvanceBooking: Number(e.target.value) }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="minAdvanceBooking">Min Advance Booking (days)</Label>
                  <Input
                    id="minAdvanceBooking"
                    type="number"
                    value={packageData.settings.minAdvanceBooking}
                    onChange={(e) => setPackageData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, minAdvanceBooking: Number(e.target.value) }
                    }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end space-x-4 mt-8">
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button onClick={savePackage} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Package'}
        </Button>
      </div>
    </div>
  );
}
