"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AvailabilitySlot {
  id: string
  date: string
  startTime: string
  endTime: string
  status: 'available' | 'booked' | 'blocked' | 'maintenance'
  service: string
  client?: string
  notes?: string
  createdAt: string
}

interface RecurringAvailability {
  id: string
  dayOfWeek: number // 0 = Sunday, 1 = Monday, etc.
  startTime: string
  endTime: string
  service: string
  isActive: boolean
}

export default function VendorAvailabilityPage() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const router = useRouter()
  const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([])
  const [recurringAvailability, setRecurringAvailability] = useState<RecurringAvailability[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

  useEffect(() => {
    if (status === 'loading') return

    if (!user?.user) {
      router.push('/auth/signin')
      return
    }

    if (user.role !== 'vendor') {
      router.push('/unauthorized')
      return
    }

    // Mock data - replace with actual API call
    setAvailabilitySlots([
      {
        id: '1',
        date: '2024-02-15',
        startTime: '09:00',
        endTime: '12:00',
        status: 'booked',
        service: 'Wedding Photography',
        client: 'John & Sarah',
        notes: 'Outdoor ceremony',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        date: '2024-02-15',
        startTime: '14:00',
        endTime: '17:00',
        status: 'available',
        service: 'Portrait Session',
        createdAt: '2024-01-15'
      },
      {
        id: '3',
        date: '2024-02-16',
        startTime: '10:00',
        endTime: '16:00',
        status: 'booked',
        service: 'Wedding Photography',
        client: 'Mike & Emily',
        notes: 'Full day wedding',
        createdAt: '2024-01-10'
      },
      {
        id: '4',
        date: '2024-02-17',
        startTime: '09:00',
        endTime: '11:00',
        status: 'blocked',
        service: 'Equipment Maintenance',
        notes: 'Camera cleaning and calibration',
        createdAt: '2024-01-20'
      }
    ])

    setRecurringAvailability([
      {
        id: '1',
        dayOfWeek: 1, // Monday
        startTime: '09:00',
        endTime: '17:00',
        service: 'Wedding Photography',
        isActive: true
      },
      {
        id: '2',
        dayOfWeek: 2, // Tuesday
        startTime: '09:00',
        endTime: '17:00',
        service: 'Wedding Photography',
        isActive: true
      },
      {
        id: '3',
        dayOfWeek: 6, // Saturday
        startTime: '08:00',
        endTime: '18:00',
        service: 'Wedding Photography',
        isActive: true
      },
      {
        id: '4',
        dayOfWeek: 0, // Sunday
        startTime: '10:00',
        endTime: '16:00',
        service: 'Portrait Session',
        isActive: true
      }
    ])
    setLoading(false)
  }, [session, status, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800'
      case 'booked': return 'bg-blue-100 text-blue-800'
      case 'blocked': return 'bg-red-100 text-red-800'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />
      case 'booked': return <Calendar className="w-4 h-4" />
      case 'blocked': return <XCircle className="w-4 h-4" />
      case 'maintenance': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getDayName = (dayOfWeek: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayOfWeek]
  }

  const filteredSlots = availabilitySlots.filter(slot => slot.date === selectedDate)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Availability Management</h1>
              <p className="text-gray-600">Manage your schedule and availability for bookings</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => router.push('/dashboard/vendor/availability/create')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Availability
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/vendor/availability/recurring')}
                variant="outline"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Set Recurring
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Slots</p>
                  <p className="text-2xl font-bold text-gray-900">{availabilitySlots.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {availabilitySlots.filter(slot => slot.status === 'available').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Booked</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {availabilitySlots.filter(slot => slot.status === 'booked').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Blocked</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {availabilitySlots.filter(slot => slot.status === 'blocked').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Date Selector and View Controls */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                onClick={() => setViewMode('calendar')}
                size="sm"
              >
                Calendar
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                size="sm"
              >
                List
              </Button>
            </div>
          </div>
        </div>

        {/* Availability Slots */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Selected Date Slots */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Availability for {new Date(selectedDate).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSlots.length > 0 ? (
                <div className="space-y-3">
                  {filteredSlots.map((slot) => (
                    <div key={slot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getStatusColor(slot.status).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                          {getStatusIcon(slot.status)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{slot.service}</div>
                          <div className="text-sm text-gray-600">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          {slot.client && (
                            <div className="text-sm text-blue-600">Client: {slot.client}</div>
                          )}
                          {slot.notes && (
                            <div className="text-sm text-gray-500">{slot.notes}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(slot.status)}>
                          {slot.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No availability slots for this date</p>
                  <Button 
                    onClick={() => router.push('/dashboard/vendor/availability/create')}
                    className="mt-4"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Availability
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recurring Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recurring Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recurringAvailability.length > 0 ? (
                <div className="space-y-3">
                  {recurringAvailability.map((recurring) => (
                    <div key={recurring.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${recurring.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{getDayName(recurring.dayOfWeek)}</div>
                          <div className="text-sm text-gray-600">
                            {recurring.startTime} - {recurring.endTime}
                          </div>
                          <div className="text-sm text-gray-500">{recurring.service}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={recurring.isActive ? 'default' : 'secondary'}>
                          {recurring.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recurring availability set</p>
                  <Button 
                    onClick={() => router.push('/dashboard/vendor/availability/recurring')}
                    className="mt-4"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Set Recurring Availability
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => router.push('/dashboard/vendor/availability/create')}
                className="h-20 flex flex-col items-center justify-center"
                variant="outline"
              >
                <Plus className="w-6 h-6 mb-2" />
                <span>Add Single Slot</span>
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/vendor/availability/recurring')}
                className="h-20 flex flex-col items-center justify-center"
                variant="outline"
              >
                <Calendar className="w-6 h-6 mb-2" />
                <span>Set Recurring</span>
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/vendor/availability/bulk')}
                className="h-20 flex flex-col items-center justify-center"
                variant="outline"
              >
                <Clock className="w-6 h-6 mb-2" />
                <span>Bulk Import</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
