'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  _id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  service: {
    id: string;
    name: string;
    duration: number; // in minutes
    price: number;
  };
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  specialRequests?: string;
  payment: {
    status: 'pending' | 'paid' | 'refunded';
    amount: number;
    method: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface VendorBookingCalendarProps {
  vendorId: string;
  onBookingClick?: (booking: Booking) => void;
}

export function VendorBookingCalendar({ vendorId, onBookingClick }: VendorBookingCalendarProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, [vendorId, selectedDate, filterStatus]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        vendorId,
        date: selectedDate.toISOString().split('T')[0],
        status: filterStatus
      });
      
      const response = await fetch(`/api/vendor/bookings?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookingStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/vendor/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (response.ok) {
        setBookings(prev => 
          prev.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status: newStatus as any }
              : booking
          )
        );
        
        toast({
          title: "Status updated",
          description: `Booking status changed to ${newStatus}`,
        });
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/vendor/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings(prev => prev.filter(booking => booking._id !== bookingId));
        
        toast({
          title: "Booking deleted",
          description: "Booking has been deleted successfully",
        });
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBookingsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(booking => 
      booking.date === dateString
    );
  };

  const getTotalRevenue = () => {
    return bookings
      .filter(booking => booking.status === 'completed')
      .reduce((total, booking) => total + booking.payment.amount, 0);
  };

  const getBookingStats = () => {
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      revenue: getTotalRevenue()
    };
    return stats;
  };

  const stats = getBookingStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${stats.revenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Bookings</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <Users className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Display */}
      {viewMode === 'calendar' ? (
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center font-semibold text-gray-600 p-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(selectedDate);
                date.setDate(1);
                date.setDate(date.getDate() - date.getDay() + i);
                
                const dayBookings = getBookingsForDate(date);
                const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div
                    key={i}
                    className={`min-h-20 p-2 border rounded ${
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                    } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className={`text-sm font-medium ${
                      isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {date.getDate()}
                    </div>
                    
                    <div className="space-y-1 mt-1">
                      {dayBookings.slice(0, 2).map((booking) => (
                        <div
                          key={booking._id}
                          className={`text-xs p-1 rounded cursor-pointer ${getStatusColor(booking.status)}`}
                          onClick={() => onBookingClick?.(booking)}
                        >
                          <div className="truncate">{booking.customer.name}</div>
                          <div className="truncate">{formatTime(booking.time)}</div>
                        </div>
                      ))}
                      {dayBookings.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayBookings.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-semibold text-gray-600 mb-2">No bookings found</p>
                <p className="text-sm text-gray-500">Bookings will appear here when customers make reservations</p>
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking) => (
              <Card key={booking._id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div>
                          <h3 className="font-semibold">{booking.customer.name}</h3>
                          <p className="text-sm text-gray-600">{booking.customer.email}</p>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </div>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-600">Service</p>
                          <p>{booking.service.name}</p>
                          <p className="text-gray-500">{booking.service.duration} minutes</p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-600">Date & Time</p>
                          <p>{formatDate(booking.date)}</p>
                          <p className="text-gray-500">{formatTime(booking.time)}</p>
                        </div>
                        
                        <div>
                          <p className="font-medium text-gray-600">Payment</p>
                          <p>${booking.payment.amount}</p>
                          <p className="text-gray-500 capitalize">{booking.payment.status}</p>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm font-medium text-gray-600">Notes</p>
                          <p className="text-sm">{booking.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {booking.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleBookingStatusChange(booking._id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleBookingStatusChange(booking._id, 'cancelled')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => handleBookingStatusChange(booking._id, 'in-progress')}
                        >
                          Start
                        </Button>
                      )}
                      
                      {booking.status === 'in-progress' && (
                        <Button
                          size="sm"
                          onClick={() => handleBookingStatusChange(booking._id, 'completed')}
                        >
                          Complete
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onBookingClick?.(booking)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteBooking(booking._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}


