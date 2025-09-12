'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Eye, Star, DollarSign, Calendar, Users, MapPin, Clock, Image } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'package';
  duration: number;
  location: string;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  reviewCount: number;
  bookingCount: number;
  images: string[];
  features: string[];
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export default function VendorServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    category: string;
    price: number;
    priceType: 'fixed' | 'hourly' | 'package';
    duration: number;
    location: string;
    status: 'active' | 'inactive' | 'pending';
    features: string[];
    availability: {
      monday: boolean;
      tuesday: boolean;
      wednesday: boolean;
      thursday: boolean;
      friday: boolean;
      saturday: boolean;
      sunday: boolean;
    };
  }>({
    name: '',
    description: '',
    category: '',
    price: 0,
    priceType: 'fixed',
    duration: 0,
    location: '',
    status: 'active',
    features: [],
    availability: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    }
  });

  const categories = [
    'Photography',
    'Videography',
    'Catering',
    'Decoration',
    'Music & DJ',
    'Transportation',
    'Makeup & Hair',
    'Venue',
    'Flowers',
    'Cake',
    'Lighting',
    'Entertainment',
    'Other'
  ];

  const priceTypes = [
    { value: 'fixed', label: 'Fixed Price' },
    { value: 'hourly', label: 'Hourly Rate' },
    { value: 'package', label: 'Package Deal' }
  ];

  const statuses = [
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'inactive', label: 'Inactive', color: 'bg-gray-100 text-gray-800' },
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' }
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockServices: Service[] = [
        {
          id: '1',
          name: 'Wedding Photography Package',
          description: 'Complete wedding photography coverage with 8 hours of shooting, 500+ edited photos, and online gallery',
          category: 'Photography',
          price: 2500,
          priceType: 'package',
          duration: 8,
          location: 'New York, NY',
          status: 'active',
          rating: 4.8,
          reviewCount: 45,
          bookingCount: 23,
          images: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
          features: ['8 hours coverage', '500+ edited photos', 'Online gallery', 'Engagement session'],
          availability: {
            monday: true,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true
          },
          createdAt: '2024-01-15',
          updatedAt: '2024-06-20'
        },
        {
          id: '2',
          name: 'Garden Catering Service',
          description: 'Fresh, organic catering for weddings and special events with customizable menus',
          category: 'Catering',
          price: 75,
          priceType: 'hourly',
          duration: 6,
          location: 'Los Angeles, CA',
          status: 'active',
          rating: 4.6,
          reviewCount: 32,
          bookingCount: 18,
          images: ['food1.jpg', 'food2.jpg'],
          features: ['Organic ingredients', 'Customizable menu', 'Professional staff', 'Cleanup included'],
          availability: {
            monday: false,
            tuesday: true,
            wednesday: true,
            thursday: true,
            friday: true,
            saturday: true,
            sunday: true
          },
          createdAt: '2024-02-20',
          updatedAt: '2024-06-18'
        }
      ];
      setServices(mockServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        // Update existing service
        setServices(prev => prev.map(service => 
          service.id === editingService.id 
            ? { 
                ...service, 
                ...formData,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : service
        ));
      } else {
        // Create new service
        const newService: Service = {
          id: Date.now().toString(),
          ...formData,
          rating: 0,
          reviewCount: 0,
          bookingCount: 0,
          images: [],
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setServices(prev => [...prev, newService]);
      }
      
      setIsDialogOpen(false);
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        category: '',
        price: 0,
        priceType: 'fixed',
        duration: 0,
        location: '',
        status: 'active',
        features: [],
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true
        }
      });
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      price: service.price,
      priceType: service.priceType,
      duration: service.duration,
      location: service.location,
      status: service.status,
      features: service.features,
      availability: service.availability
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(service => service.id !== serviceId));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedServices.length === 0) return;
    
    switch (action) {
      case 'activate':
        setServices(prev => prev.map(service => 
          selectedServices.includes(service.id) 
            ? { ...service, status: 'active' as const }
            : service
        ));
        break;
      case 'deactivate':
        setServices(prev => prev.map(service => 
          selectedServices.includes(service.id) 
            ? { ...service, status: 'inactive' as const }
            : service
        ));
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedServices.length} services?`)) {
          setServices(prev => prev.filter(service => !selectedServices.includes(service.id)));
        }
        break;
    }
    setSelectedServices([]);
  };

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-100 text-gray-800';
  };

  const filteredServices = services.filter(service => {
    const statusMatch = filterStatus === 'all' || service.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || service.category === filterCategory;
    const searchMatch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       service.location.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && categoryMatch && searchMatch;
  });

  const getServiceStats = () => {
    const total = services.length;
    const active = services.filter(s => s.status === 'active').length;
    const totalBookings = services.reduce((sum, service) => sum + service.bookingCount, 0);
    const averageRating = services.reduce((sum, service) => sum + service.rating, 0) / services.length;
    
    return { total, active, totalBookings, averageRating };
  };

  const stats = getServiceStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-600">Manage your wedding services and offerings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingService(null);
              setFormData({
                name: '',
                description: '',
                category: '',
                price: 0,
                priceType: 'fixed',
                duration: 0,
                location: '',
                status: 'active',
                features: [],
                availability: {
                  monday: true,
                  tuesday: true,
                  wednesday: true,
                  thursday: true,
                  friday: true,
                  saturday: true,
                  sunday: true
                }
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
              <DialogDescription>
                {editingService ? 'Update your service details' : 'Create a new service offering'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="priceType">Price Type</Label>
                  <Select
                    value={formData.priceType}
                    onValueChange={(value: 'fixed' | 'hourly' | 'package') => setFormData(prev => ({ ...prev, priceType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priceTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive' | 'pending') => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingService ? 'Update Service' : 'Add Service'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Checkbox className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Directory</CardTitle>
          <CardDescription>Manage your wedding services and track performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedServices.length === filteredServices.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedServices(filteredServices.map(s => s.id));
                      } else {
                        setSelectedServices([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedServices.includes(service.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedServices(prev => [...prev, service.id]);
                        } else {
                          setSelectedServices(prev => prev.filter(id => id !== service.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500">{service.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {service.features.map(feature => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      <span className="font-medium">{service.price}</span>
                      <span className="text-sm text-gray-500 ml-1">
                        {service.priceType === 'hourly' ? '/hr' : service.priceType === 'package' ? '/package' : ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(service.status)}>
                      {statuses.find(s => s.value === service.status)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>{service.rating.toFixed(1)} ({service.reviewCount})</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                        <span>{service.bookingCount} bookings</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm">{service.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
