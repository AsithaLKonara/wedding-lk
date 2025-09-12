'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, DollarSign, User, Phone, Mail, MapPin, Star, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';

interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceName: string;
  bookingDate: string;
  eventDate: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  paidAmount: number;
  guestCount: number;
  location: string;
  specialRequests: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockBookings: Booking[] = [
        {
          id: '1',
          clientName: 'Sarah & Michael Johnson',
          clientEmail: 'sarah.michael@email.com',
          clientPhone: '+1 (555) 123-4567',
          serviceName: 'Wedding Photography Package',
          bookingDate: '2024-06-15',
          eventDate: '2024-08-15',
          status: 'confirmed',
          totalAmount: 2500,
          paidAmount: 1250,
          guestCount: 150,
          location: 'Garden Manor, New York',
          specialRequests: 'Outdoor ceremony photos, sunset shots',
          notes: 'Very organized couple, prefers natural lighting',
          createdAt: '2024-06-15',
          updatedAt: '2024-06-20'
        },
        {
          id: '2',
          clientName: 'Emma & David Wilson',
          clientEmail: 'emma.david@email.com',
          clientPhone: '+1 (555) 234-5678',
          serviceName: 'Catering Service',
          bookingDate: '2024-06-10',
          eventDate: '2024-09-22',
          status: 'pending',
          totalAmount: 1800,
          paidAmount: 0,
          guestCount: 100,
          location: 'Riverside Hotel, Los Angeles',
          specialRequests: 'Vegetarian options, gluten-free menu',
          notes: 'Waiting for final guest count',
          createdAt: '2024-06-10',
          updatedAt: '2024-06-10'
        }
      ];
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus as any, updatedAt: new Date().toISOString().split('T')[0] }
        : booking
    ));
  };

  const handleBulkAction = (action: string) => {
    if (selectedBookings.length === 0) return;
    
    switch (action) {
      case 'confirm':
        selectedBookings.forEach(id => handleStatusChange(id, 'confirmed'));
        break;
      case 'complete':
        selectedBookings.forEach(id => handleStatusChange(id, 'completed'));
        break;
      case 'cancel':
        selectedBookings.forEach(id => handleStatusChange(id, 'cancelled'));
        break;
    }
    setSelectedBookings([]);
  };

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-100 text-gray-800';
  };

  const filteredBookings = bookings.filter(booking => {
    const statusMatch = filterStatus === 'all' || booking.status === filterStatus;
    const searchMatch = booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const getBookingStats = () => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.paidAmount, 0);
    const pendingRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount - booking.paidAmount), 0);
    
    return { total, pending, confirmed, completed, totalRevenue, pendingRevenue };
  };

  const stats = getBookingStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600">Manage your service bookings and client requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.total}</p>
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
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
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
                <Label htmlFor="search">Search Bookings</Label>
                <Input
                  id="search"
                  placeholder="Search by client name, service, or email..."
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedBookings.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedBookings.length} selected
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('confirm')}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('complete')}
                >
                  Complete
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction('cancel')}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Directory</CardTitle>
          <CardDescription>Manage and track your service bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedBookings.length === filteredBookings.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedBookings(filteredBookings.map(b => b.id));
                      } else {
                        setSelectedBookings([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedBookings.includes(booking.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBookings(prev => [...prev, booking.id]);
                        } else {
                          setSelectedBookings(prev => prev.filter(id => id !== booking.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {booking.clientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{booking.clientName}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-3 w-3 mr-1" />
                          {booking.clientEmail}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-3 w-3 mr-1" />
                          {booking.clientPhone}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.serviceName}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {booking.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="h-3 w-3 mr-1" />
                        {booking.guestCount} guests
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm">{new Date(booking.eventDate).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status)}>
                      {statuses.find(s => s.value === booking.status)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      <span className="font-medium">{booking.totalAmount.toLocaleString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Paid: {booking.paidAmount.toLocaleString()}</span>
                        <span>Total: {booking.totalAmount.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(booking.paidAmount / booking.totalAmount) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      {booking.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {booking.status === 'confirmed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStatusChange(booking.id, 'completed')}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
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

