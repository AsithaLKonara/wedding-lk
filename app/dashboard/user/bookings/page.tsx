'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, DollarSign, MapPin, Star, Eye, MessageSquare, Download, X, CheckCircle, Mail, Phone } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Booking {
  id: string;
  serviceName: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string;
  bookingDate: string;
  eventDate: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  totalAmount: number;
  paidAmount: number;
  guestCount: number;
  location: string;
  specialRequests: string;
  notes: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

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
          serviceName: 'Wedding Photography Package',
          vendorName: 'Elegant Photography Studio',
          vendorEmail: 'contact@elegantphoto.com',
          vendorPhone: '+1 (555) 123-4567',
          bookingDate: '2024-06-15',
          eventDate: '2024-08-15',
          status: 'confirmed',
          totalAmount: 2500,
          paidAmount: 1250,
          guestCount: 150,
          location: 'Garden Manor, New York',
          specialRequests: 'Outdoor ceremony photos, sunset shots',
          notes: 'Very professional team, highly recommended',
          rating: 5,
          review: 'Amazing photography service! The team was professional and captured every special moment perfectly.',
          createdAt: '2024-06-15',
          updatedAt: '2024-06-20'
        },
        {
          id: '2',
          serviceName: 'Catering Service',
          vendorName: 'Garden Catering Co.',
          vendorEmail: 'info@gardencatering.com',
          vendorPhone: '+1 (555) 234-5678',
          bookingDate: '2024-06-10',
          eventDate: '2024-09-22',
          status: 'pending',
          totalAmount: 1800,
          paidAmount: 0,
          guestCount: 100,
          location: 'Riverside Hotel, Los Angeles',
          specialRequests: 'Vegetarian options, gluten-free menu',
          notes: 'Waiting for final guest count confirmation',
          rating: 0,
          review: '',
          createdAt: '2024-06-10',
          updatedAt: '2024-06-10'
        },
        {
          id: '3',
          serviceName: 'Wedding Decoration',
          vendorName: 'Dreamy Decorations',
          vendorEmail: 'hello@dreamydecor.com',
          vendorPhone: '+1 (555) 345-6789',
          bookingDate: '2024-05-20',
          eventDate: '2024-07-30',
          status: 'completed',
          totalAmount: 1200,
          paidAmount: 1200,
          guestCount: 80,
          location: 'Grand Ballroom, Chicago',
          specialRequests: 'Rustic theme with fairy lights',
          notes: 'Beautiful decorations, exceeded expectations!',
          rating: 5,
          review: 'Absolutely stunning decorations! The team brought our vision to life perfectly.',
          createdAt: '2024-05-20',
          updatedAt: '2024-07-30'
        }
      ];
      setBookings(mockBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' as const, updatedAt: new Date().toISOString().split('T')[0] }
          : booking
      ));
    }
  };

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-100 text-gray-800';
  };

  const filteredBookings = bookings.filter(booking => {
    const statusMatch = filterStatus === 'all' || booking.status === filterStatus;
    const searchMatch = booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       booking.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       booking.location.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const getBookingStats = () => {
    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const totalSpent = bookings.reduce((sum, booking) => sum + booking.paidAmount, 0);
    const pendingAmount = bookings.reduce((sum, booking) => sum + (booking.totalAmount - booking.paidAmount), 0);
    
    return { total, pending, confirmed, completed, totalSpent, pendingAmount };
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
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">Track and manage your wedding service bookings</p>
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
              <Star className="h-8 w-8 text-green-600" />
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
              <CheckCircle className="h-8 w-8 text-purple-600" />
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
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <Label htmlFor="search">Search Bookings</Label>
              <Input
                id="search"
                placeholder="Search by service, vendor, or location..."
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
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
          <CardDescription>View and manage all your wedding service bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.serviceName}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-3 w-3 mr-1" />
                        {booking.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Booked on {new Date(booking.bookingDate).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {booking.vendorName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{booking.vendorName}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="h-3 w-3 mr-1" />
                          {booking.vendorEmail}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-3 w-3 mr-1" />
                          {booking.vendorPhone}
                        </div>
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
                    {booking.rating > 0 ? (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span>{booking.rating}/5</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Not rated</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      {booking.status === 'completed' && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
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
