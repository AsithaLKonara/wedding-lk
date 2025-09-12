'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Star,
  DollarSign,
  Calendar,
  Users,
  Settings,
  Image,
  Video,
  FileText,
  MoreHorizontal,
  Save,
  X,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface VendorPackage {
  _id: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  services: {
    service: {
      _id: string;
      name: string;
      description: string;
    };
    name: string;
    description: string;
    quantity: number;
    unit: string;
    price: number;
    isIncluded: boolean;
    isOptional: boolean;
  }[];
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
  isActive: boolean;
  isFeatured: boolean;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VendorPackageManagementProps {
  vendorId: string;
}

export function VendorPackageManagement({ vendorId }: VendorPackageManagementProps) {
  const [packages, setPackages] = useState<VendorPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<VendorPackage | null>(null);
  const [formData, setFormData] = useState<Partial<VendorPackage>>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, [vendorId]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vendor-packages?vendorId=${vendorId}`);
      
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: "Error",
        description: "Failed to load packages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePackage = async () => {
    try {
      const response = await fetch('/api/vendor-packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setPackages(prev => [data.package, ...prev]);
        setShowCreateDialog(false);
        setFormData({});
        toast({
          title: "Success",
          description: "Package created successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create package');
      }
    } catch (error) {
      console.error('Error creating package:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to create package',
        variant: "destructive"
      });
    }
  };

  const handleUpdatePackage = async (packageId: string) => {
    try {
      const response = await fetch(`/api/vendor-packages/${packageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setPackages(prev => prev.map(pkg => 
          pkg._id === packageId ? data.package : pkg
        ));
        setEditingPackage(null);
        setFormData({});
        toast({
          title: "Success",
          description: "Package updated successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update package');
      }
    } catch (error) {
      console.error('Error updating package:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to update package',
        variant: "destructive"
      });
    }
  };

  const handleDeletePackage = async (packageId: string) => {
    try {
      const response = await fetch(`/api/vendor-packages/${packageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPackages(prev => prev.filter(pkg => pkg._id !== packageId));
        toast({
          title: "Success",
          description: "Package deleted successfully",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to delete package',
        variant: "destructive"
      });
    }
  };

  const handleEditPackage = (pkg: VendorPackage) => {
    setEditingPackage(pkg);
    setFormData(pkg);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'photography':
        return <Image className="h-4 w-4" />;
      case 'videography':
        return <Video className="h-4 w-4" />;
      case 'catering':
        return <Users className="h-4 w-4" />;
      case 'venue':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'photography':
        return 'bg-blue-100 text-blue-800';
      case 'videography':
        return 'bg-purple-100 text-purple-800';
      case 'catering':
        return 'bg-green-100 text-green-800';
      case 'venue':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2">Loading packages...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Package Management</h2>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Package</DialogTitle>
            </DialogHeader>
            <PackageForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreatePackage}
              onCancel={() => {
                setShowCreateDialog(false);
                setFormData({});
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Packages Grid */}
      {packages.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              <Settings className="h-12 w-12 mx-auto mb-2" />
              <p>No packages yet</p>
              <p className="text-sm">Create your first package to get started!</p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Package
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg._id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(pkg.category)}
                    <div>
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      <Badge className={`text-xs ${getCategoryColor(pkg.category)}`}>
                        {pkg.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditPackage(pkg)}>
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeletePackage(pkg._id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {pkg.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-semibold">
                      {pkg.pricing.currency} {pkg.pricing.discountedPrice || pkg.pricing.basePrice}
                    </span>
                    {pkg.pricing.discountedPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {pkg.pricing.currency} {pkg.pricing.basePrice}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{pkg.reviews.averageRating.toFixed(1)}</span>
                    <span className="text-xs text-gray-500">({pkg.reviews.totalReviews})</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{pkg.requirements.minGuests}-{pkg.requirements.maxGuests} guests</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{pkg.availability.advanceBookingDays} days advance</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {pkg.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {pkg.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{pkg.tags.length - 3} more
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {pkg.isFeatured && (
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    )}
                    {pkg.isPopular && (
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    )}
                    <Badge variant={pkg.availability.isAvailable ? 'default' : 'destructive'} className="text-xs">
                      {pkg.availability.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  
                  <span className="text-xs text-gray-500">
                    {pkg.availability.currentBookings}/{pkg.availability.maxBookings} booked
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingPackage && (
        <Dialog open={!!editingPackage} onOpenChange={() => setEditingPackage(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Package</DialogTitle>
            </DialogHeader>
            <PackageForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={() => handleUpdatePackage(editingPackage._id)}
              onCancel={() => {
                setEditingPackage(null);
                setFormData({});
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Package Form Component
function PackageForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel 
}: {
  formData: Partial<VendorPackage>;
  setFormData: (data: Partial<VendorPackage>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const categories = [
    'photography', 'videography', 'catering', 'venue', 'decorations',
    'music', 'flowers', 'transportation', 'makeup', 'dress', 'jewelry',
    'planning', 'entertainment', 'photobooth', 'lighting', 'sound',
    'security', 'cleaning', 'other'
  ];

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Package Name</label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter package name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe your package"
            rows={3}
          />
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Base Price</label>
            <Input
              type="number"
              value={formData.pricing?.basePrice || ''}
              onChange={(e) => setFormData({
                ...formData,
                pricing: { ...formData.pricing, basePrice: parseFloat(e.target.value) || 0 }
              })}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Discounted Price</label>
            <Input
              type="number"
              value={formData.pricing?.discountedPrice || ''}
              onChange={(e) => setFormData({
                ...formData,
                pricing: { ...formData.pricing, discountedPrice: parseFloat(e.target.value) || undefined }
              })}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Currency</label>
            <select
              value={formData.pricing?.currency || 'LKR'}
              onChange={(e) => setFormData({
                ...formData,
                pricing: { ...formData.pricing, currency: e.target.value }
              })}
              className="w-full p-2 border rounded-md"
            >
              <option value="LKR">LKR</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Availability */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Max Bookings</label>
            <Input
              type="number"
              value={formData.availability?.maxBookings || ''}
              onChange={(e) => setFormData({
                ...formData,
                availability: { ...formData.availability, maxBookings: parseInt(e.target.value) || 1 }
              })}
              placeholder="1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Advance Booking Days</label>
            <Input
              type="number"
              value={formData.availability?.advanceBookingDays || ''}
              onChange={(e) => setFormData({
                ...formData,
                availability: { ...formData.availability, advanceBookingDays: parseInt(e.target.value) || 30 }
              })}
              placeholder="30"
            />
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Requirements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Min Guests</label>
            <Input
              type="number"
              value={formData.requirements?.minGuests || ''}
              onChange={(e) => setFormData({
                ...formData,
                requirements: { ...formData.requirements, minGuests: parseInt(e.target.value) || 1 }
              })}
              placeholder="1"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Max Guests</label>
            <Input
              type="number"
              value={formData.requirements?.maxGuests || ''}
              onChange={(e) => setFormData({
                ...formData,
                requirements: { ...formData.requirements, maxGuests: parseInt(e.target.value) || 1000 }
              })}
              placeholder="1000"
            />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tags</h3>
        <Input
          value={formData.tags?.join(', ') || ''}
          onChange={(e) => setFormData({
            ...formData,
            tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
          })}
          placeholder="Enter tags separated by commas"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={onSubmit}>
          <Save className="h-4 w-4 mr-2" />
          Save Package
        </Button>
      </div>
    </div>
  );
}
