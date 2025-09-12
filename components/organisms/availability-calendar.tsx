'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, X, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface TimeSlot {
  start: string;
  end: string;
  isAvailable: boolean;
  price?: number;
  maxBookings?: number;
  currentBookings: number;
}

interface AvailabilityData {
  _id: string;
  date: string;
  timeSlots: TimeSlot[];
  isBlackout: boolean;
  reason?: string;
}

interface AvailabilityCalendarProps {
  vendorId: string;
  serviceId?: string;
  onAvailabilityChange?: (availability: AvailabilityData[]) => void;
  readonly?: boolean;
}

export function AvailabilityCalendar({ 
  vendorId, 
  serviceId, 
  onAvailabilityChange,
  readonly = false 
}: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availability, setAvailability] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTimeSlotForm, setShowTimeSlotForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [newTimeSlot, setNewTimeSlot] = useState<Partial<TimeSlot>>({
    start: '09:00',
    end: '17:00',
    isAvailable: true,
    maxBookings: 1,
    currentBookings: 0
  });

  // Fetch availability data
  useEffect(() => {
    fetchAvailability();
  }, [vendorId, serviceId, selectedDate]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/availability?vendorId=${vendorId}&serviceId=${serviceId}&month=${selectedDate.getMonth()}&year=${selectedDate.getFullYear()}`
      );
      const data = await response.json();
      setAvailability(data.availability || []);
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch availability data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveAvailability = async (date: string, timeSlots: TimeSlot[], isBlackout: boolean = false, reason?: string) => {
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorId,
          serviceId,
          date,
          timeSlots,
          isBlackout,
          reason
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Availability updated successfully'
        });
        fetchAvailability();
        onAvailabilityChange?.(availability);
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to save availability',
        variant: 'destructive'
      });
    }
  };

  const addTimeSlot = () => {
    if (!newTimeSlot.start || !newTimeSlot.end) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    const existingDay = availability.find(a => a.date === dateStr);
    
    const slot: TimeSlot = {
      start: newTimeSlot.start!,
      end: newTimeSlot.end!,
      isAvailable: newTimeSlot.isAvailable ?? true,
      price: newTimeSlot.price,
      maxBookings: newTimeSlot.maxBookings ?? 1,
      currentBookings: 0
    };

    if (existingDay) {
      existingDay.timeSlots.push(slot);
      saveAvailability(dateStr, existingDay.timeSlots, existingDay.isBlackout, existingDay.reason);
    } else {
      saveAvailability(dateStr, [slot]);
    }

    setNewTimeSlot({
      start: '09:00',
      end: '17:00',
      isAvailable: true,
      maxBookings: 1,
      currentBookings: 0
    });
    setShowTimeSlotForm(false);
  };

  const updateTimeSlot = (slotIndex: number, updatedSlot: TimeSlot) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const existingDay = availability.find(a => a.date === dateStr);
    
    if (existingDay) {
      existingDay.timeSlots[slotIndex] = updatedSlot;
      saveAvailability(dateStr, existingDay.timeSlots, existingDay.isBlackout, existingDay.reason);
    }
  };

  const deleteTimeSlot = (slotIndex: number) => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const existingDay = availability.find(a => a.date === dateStr);
    
    if (existingDay) {
      existingDay.timeSlots.splice(slotIndex, 1);
      saveAvailability(dateStr, existingDay.timeSlots, existingDay.isBlackout, existingDay.reason);
    }
  };

  const toggleBlackout = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const existingDay = availability.find(a => a.date === dateStr);
    const isBlackout = !existingDay?.isBlackout;
    
    saveAvailability(dateStr, existingDay?.timeSlots || [], isBlackout, isBlackout ? 'Blackout day' : undefined);
  };

  const getDayAvailability = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return availability.find(a => a.date === dateStr);
  };

  const isDateInPast = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const getAvailabilityStatus = (date: Date) => {
    const dayAvailability = getDayAvailability(date);
    if (!dayAvailability) return 'no-data';
    if (dayAvailability.isBlackout) return 'blackout';
    if (dayAvailability.timeSlots.some(slot => slot.isAvailable && slot.currentBookings < (slot.maxBookings || 1))) return 'available';
    return 'booked';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'booked': return 'bg-red-100 text-red-800 border-red-200';
      case 'blackout': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-50 text-gray-500 border-gray-100';
    }
  };

  const calendarDays = generateCalendarDays();
  const selectedDayAvailability = getDayAvailability(selectedDate);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Availability Calendar</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}
          >
            Previous
          </Button>
          <span className="font-medium">
            {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
          const isSelected = date.toDateString() === selectedDate.toDateString();
          const isPast = isDateInPast(date);
          const status = getAvailabilityStatus(date);
          
          return (
            <button
              key={index}
              onClick={() => !isPast && setSelectedDate(date)}
              disabled={isPast}
              className={`
                p-2 text-sm rounded-lg border transition-colors
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isSelected ? 'ring-2 ring-blue-500' : ''}
                ${isPast ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
                ${getStatusColor(status)}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Selected Day Details */}
      {selectedDayAvailability && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
              {!readonly && (
                <div className="flex space-x-2">
                  <Button
                    variant={selectedDayAvailability.isBlackout ? "default" : "outline"}
                    size="sm"
                    onClick={toggleBlackout}
                  >
                    {selectedDayAvailability.isBlackout ? 'Remove Blackout' : 'Set Blackout'}
                  </Button>
                  {!selectedDayAvailability.isBlackout && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTimeSlotForm(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Slot
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            {selectedDayAvailability.isBlackout ? (
              <div className="text-center py-4">
                <X className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">This day is marked as blackout</p>
                {selectedDayAvailability.reason && (
                  <p className="text-sm text-gray-400 mt-1">Reason: {selectedDayAvailability.reason}</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayAvailability.timeSlots.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No time slots available</p>
                ) : (
                  selectedDayAvailability.timeSlots.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {slot.start} - {slot.end}
                        </span>
                        <Badge variant={slot.isAvailable ? "default" : "secondary"}>
                          {slot.isAvailable ? 'Available' : 'Unavailable'}
                        </Badge>
                        {slot.price && (
                          <span className="text-sm text-gray-600">LKR {slot.price}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {slot.currentBookings}/{slot.maxBookings} bookings
                        </span>
                        {!readonly && (
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingSlot(slot)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTimeSlot(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Time Slot Form */}
      {showTimeSlotForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add Time Slot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={newTimeSlot.start}
                  onChange={(e) => setNewTimeSlot({ ...newTimeSlot, start: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={newTimeSlot.end}
                  onChange={(e) => setNewTimeSlot({ ...newTimeSlot, end: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (LKR)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newTimeSlot.price || ''}
                  onChange={(e) => setNewTimeSlot({ ...newTimeSlot, price: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="max-bookings">Max Bookings</Label>
                <Input
                  id="max-bookings"
                  type="number"
                  min="1"
                  value={newTimeSlot.maxBookings || 1}
                  onChange={(e) => setNewTimeSlot({ ...newTimeSlot, maxBookings: Number(e.target.value) })}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is-available"
                checked={newTimeSlot.isAvailable}
                onChange={(e) => setNewTimeSlot({ ...newTimeSlot, isAvailable: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="is-available">Available for booking</Label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTimeSlotForm(false)}>
                Cancel
              </Button>
              <Button onClick={addTimeSlot}>
                Add Slot
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


