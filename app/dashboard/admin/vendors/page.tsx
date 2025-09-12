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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, Trash2, Eye, Mail, Phone, MapPin, Star, CheckCircle, XCircle, Clock, Building2, DollarSign, Users } from 'lucide-react';

interface Vendor {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  category: string;
  location: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rating: number;
  reviewCount: number;
  joinedDate: string;
  lastActive: string;
  totalBookings: number;
  totalRevenue: number;
  verificationStatus: 'unverified' | 'verified' | 'pending_verification';
  description: string;
  services: string[];
  portfolio: string[];
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    businessName: string;
    contactName: string;
    email: string;
    phone: string;
    category: string;
    location: string;
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    description: string;
    verificationStatus: 'unverified' | 'verified' | 'pending_verification';
  }>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    category: '',
    location: '',
    status: 'pending',
    description: '',
    verificationStatus: 'unverified'
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

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockVendors: Vendor[] = [
        {
          id: '1',
          businessName: 'Elegant Photography Studio',
          contactName: 'Sarah Johnson',
          email: 'sarah@elegantphoto.com',
          phone: '+1 (555) 123-4567',
          category: 'Photography',
          location: 'New York, NY',
          status: 'approved',
          rating: 4.8,
          reviewCount: 45,
          joinedDate: '2024-01-15',
          lastActive: '2024-06-20',
          totalBookings: 23,
          totalRevenue: 34500,
          verificationStatus: 'verified',
          description: 'Professional wedding photography with 10+ years experience',
          services: ['Wedding Photography', 'Engagement Shoots', 'Bridal Portraits'],
          portfolio: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg']
        },
        {
          id: '2',
          businessName: 'Garden Catering Co.',
          contactName: 'Michael Brown',
          email: 'michael@gardencatering.com',
          phone: '+1 (555) 234-5678',
          category: 'Catering',
          location: 'Los Angeles, CA',
          status: 'pending',
          rating: 0,
          reviewCount: 0,
          joinedDate: '2024-06-10',
          lastActive: '2024-06-15',
          totalBookings: 0,
          totalRevenue: 0,
          verificationStatus: 'pending_verification',
          description: 'Fresh, organic catering for special events',
          services: ['Wedding Catering', 'Corporate Events', 'Private Parties'],
          portfolio: ['food1.jpg', 'food2.jpg']
        },
        {
          id: '3',
          businessName: 'Dreamy Decorations',
          contactName: 'Lisa Wilson',
          email: 'lisa@dreamydecor.com',
          phone: '+1 (555) 345-6789',
          category: 'Decoration',
          location: 'Chicago, IL',
          status: 'approved',
          rating: 4.6,
          reviewCount: 32,
          joinedDate: '2024-02-20',
          lastActive: '2024-06-18',
          totalBookings: 18,
          totalRevenue: 22800,
          verificationStatus: 'verified',
          description: 'Creative wedding decorations and floral arrangements',
          services: ['Wedding Decor', 'Floral Arrangements', 'Centerpieces'],
          portfolio: ['decor1.jpg', 'decor2.jpg', 'decor3.jpg']
        },
        {
          id: '4',
          businessName: 'Melody Music DJ',
          contactName: 'David Garcia',
          email: 'david@melodymusic.com',
          phone: '+1 (555) 456-7890',
          category: 'Music & DJ',
          location: 'Miami, FL',
          status: 'rejected',
          rating: 0,
          reviewCount: 0,
          joinedDate: '2024-05-05',
          lastActive: '2024-05-10',
          totalBookings: 0,
          totalRevenue: 0,
          verificationStatus: 'unverified',
          description: 'Professional DJ services for weddings and events',
          services: ['Wedding DJ', 'MC Services', 'Sound Equipment'],
          portfolio: ['dj1.jpg']
        }
      ];
      setVendors(mockVendors);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingVendor) {
        // Update existing vendor
        setVendors(prev => prev.map(vendor => 
          vendor.id === editingVendor.id 
            ? { 
                ...vendor, 
                ...formData,
                lastActive: new Date().toISOString().split('T')[0]
              }
            : vendor
        ));
      } else {
        // Create new vendor
        const newVendor: Vendor = {
          id: Date.now().toString(),
          ...formData,
          rating: 0,
          reviewCount: 0,
          totalBookings: 0,
          totalRevenue: 0,
          joinedDate: new Date().toISOString().split('T')[0],
          lastActive: new Date().toISOString().split('T')[0],
          description: '',
          services: [],
          portfolio: []
        };
        setVendors(prev => [...prev, newVendor]);
      }
      
      setIsDialogOpen(false);
      setEditingVendor(null);
      setFormData({
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        category: '',
        location: '',
        status: 'pending',
        description: '',
        verificationStatus: 'unverified'
      });
    } catch (error) {
      console.error('Error saving vendor:', error);
    }
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      businessName: vendor.businessName,
      contactName: vendor.contactName,
      email: vendor.email,
      phone: vendor.phone,
      category: vendor.category,
      location: vendor.location,
      status: vendor.status,
      description: vendor.description,
      verificationStatus: vendor.verificationStatus
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (vendorId: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      setVendors(prev => prev.filter(vendor => vendor.id !== vendorId));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedVendors.length === 0) return;
    
    switch (action) {
      case 'approve':
        setVendors(prev => prev.map(vendor => 
          selectedVendors.includes(vendor.id) 
            ? { ...vendor, status: 'approved' as const }
            : vendor
        ));
        break;
      case 'reject':
        setVendors(prev => prev.map(vendor => 
          selectedVendors.includes(vendor.id) 
            ? { ...vendor, status: 'rejected' as const }
            : vendor
        ));
        break;
      case 'suspend':
        setVendors(prev => prev.map(vendor => 
          selectedVendors.includes(vendor.id) 
            ? { ...vendor, status: 'suspended' as const }
            : vendor
        ));
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedVendors.length} vendors?`)) {
          setVendors(prev => prev.filter(vendor => !selectedVendors.includes(vendor.id)));
        }
        break;
    }
    setSelectedVendors([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending_verification': return 'bg-yellow-100 text-yellow-800';
      case 'unverified': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const statusMatch = filterStatus === 'all' || vendor.status === filterStatus;
    const categoryMatch = filterCategory === 'all' || vendor.category === filterCategory;
    const searchMatch = vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       vendor.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       vendor.location.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && categoryMatch && searchMatch;
  });

  const getVendorStats = () => {
    const total = vendors.length;
    const approved = vendors.filter(v => v.status === 'approved').length;
    const pending = vendors.filter(v => v.status === 'pending').length;
    const rejected = vendors.filter(v => v.status === 'rejected').length;
    const totalRevenue = vendors.reduce((sum, vendor) => sum + vendor.totalRevenue, 0);
    
    return { total, approved, pending, rejected, totalRevenue };
  };

  const stats = getVendorStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600">Approve and manage wedding vendors on the platform</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingVendor(null);
              setFormData({
                businessName: '',
                contactName: '',
                email: '',
                phone: '',
                category: '',
                location: '',
                status: 'pending',
                description: '',
                verificationStatus: 'unverified'
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
              </DialogTitle>
              <DialogDescription>
                {editingVendor ? 'Update vendor information' : 'Add a new vendor to the platform'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'pending' | 'approved' | 'rejected' | 'suspended') => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="verificationStatus">Verification Status</Label>
                  <Select
                    value={formData.verificationStatus}
                    onValueChange={(value: 'unverified' | 'verified' | 'pending_verification') => setFormData(prev => ({ ...prev, verificationStatus: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unverified">Unverified</SelectItem>
                      <SelectItem value="pending_verification">Pending Verification</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
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
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingVendor ? 'Update Vendor' : 'Add Vendor'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold">{stats.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Bulk Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <Label htmlFor="search">Search Vendors</Label>
                <Input
                  id="search"
                  placeholder="Search by name, email, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <div>
                <Label htmlFor="statusFilter">Status</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="categoryFilter">Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedVendors.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedVendors.length} selected
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('approve')}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('reject')}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('suspend')}
                >
                  Suspend
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('delete')}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Directory</CardTitle>
          <CardDescription>Manage and approve wedding vendors on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedVendors.length === filteredVendors.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedVendors(filteredVendors.map(v => v.id));
                      } else {
                        setSelectedVendors([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedVendors.includes(vendor.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedVendors(prev => [...prev, vendor.id]);
                        } else {
                          setSelectedVendors(prev => prev.filter(id => id !== vendor.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {vendor.businessName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{vendor.businessName}</p>
                        <p className="text-sm text-gray-500">{vendor.contactName}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        {vendor.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {vendor.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        {vendor.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{vendor.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(vendor.status)}>
                      {vendor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getVerificationColor(vendor.verificationStatus)}>
                      {vendor.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        {vendor.rating > 0 ? vendor.rating.toFixed(1) : 'No rating'}
                      </div>
                      <p className="text-gray-500">{vendor.reviewCount} reviews</p>
                      <p className="text-gray-500">{vendor.totalBookings} bookings</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      {vendor.totalRevenue.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(vendor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(vendor.id)}
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
