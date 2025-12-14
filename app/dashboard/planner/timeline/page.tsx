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
import { Calendar, Clock, CheckCircle, Circle, Plus, Edit, Trash2, Star, AlertCircle, Users, MapPin } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number; // in minutes
  category: 'ceremony' | 'reception' | 'preparation' | 'photography' | 'transportation' | 'other';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  location: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export default function PlannerTimelinePage() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    date: string;
    time: string;
    duration: number;
    category: 'ceremony' | 'reception' | 'preparation' | 'photography' | 'transportation' | 'other';
    status: 'pending' | 'completed' | 'confirmed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignedTo: string;
    location: string;
    notes: string;
  }>({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    category: 'ceremony',
    status: 'pending',
    priority: 'medium',
    assignedTo: '',
    location: '',
    notes: ''
  });

  const categories = [
    { value: 'ceremony', label: 'Ceremony', color: 'bg-purple-100 text-purple-800' },
    { value: 'reception', label: 'Reception', color: 'bg-pink-100 text-pink-800' },
    { value: 'preparation', label: 'Preparation', color: 'bg-blue-100 text-blue-800' },
    { value: 'photography', label: 'Photography', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'transportation', label: 'Transportation', color: 'bg-green-100 text-green-800' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' }
  ];

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockEvents: TimelineEvent[] = [
        {
          id: '1',
          title: 'Bridal Hair & Makeup',
          description: 'Professional hair and makeup for the bride',
          date: '2024-08-15',
          time: '08:00',
          duration: 180,
          category: 'preparation',
          status: 'confirmed',
          priority: 'high',
          assignedTo: 'Sarah Johnson',
          location: 'Bridal Suite, Garden Manor',
          notes: 'Bring own foundation, prefer natural look',
          createdAt: '2024-06-15',
          updatedAt: '2024-06-20'
        },
        {
          id: '2',
          title: 'Wedding Ceremony',
          description: 'Main wedding ceremony with vows exchange',
          date: '2024-08-15',
          time: '16:00',
          duration: 60,
          category: 'ceremony',
          status: 'confirmed',
          priority: 'urgent',
          assignedTo: 'Reverend Smith',
          location: 'Garden Pavilion, Garden Manor',
          notes: 'Outdoor ceremony, weather backup plan ready',
          createdAt: '2024-06-15',
          updatedAt: '2024-06-20'
        },
        {
          id: '3',
          title: 'Cocktail Hour',
          description: 'Cocktail reception with appetizers',
          date: '2024-08-15',
          time: '17:00',
          duration: 60,
          category: 'reception',
          status: 'pending',
          priority: 'medium',
          assignedTo: 'Garden Catering Co.',
          location: 'Garden Terrace, Garden Manor',
          notes: 'Vegetarian options required',
          createdAt: '2024-06-15',
          updatedAt: '2024-06-15'
        },
        {
          id: '4',
          title: 'Wedding Photography',
          description: 'Professional wedding photography session',
          date: '2024-08-15',
          time: '15:00',
          duration: 480,
          category: 'photography',
          status: 'confirmed',
          priority: 'high',
          assignedTo: 'Elegant Photography Studio',
          location: 'Garden Manor (Various Locations)',
          notes: 'Sunset shots at 18:30, group photos at 19:00',
          createdAt: '2024-06-15',
          updatedAt: '2024-06-20'
        }
      ];
      setEvents(mockEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        // Update existing event
        setEvents(prev => prev.map(event => 
          event.id === editingEvent.id 
            ? { 
                ...event, 
                ...formData,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : event
        ));
      } else {
        // Create new event
        const newEvent: TimelineEvent = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setEvents(prev => [...prev, newEvent]);
      }
      
      setIsDialogOpen(false);
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: 60,
        category: 'ceremony',
        status: 'pending',
        priority: 'medium',
        assignedTo: '',
        location: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = (event: TimelineEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      duration: event.duration,
      category: event.category,
      status: event.status,
      priority: event.priority,
      assignedTo: event.assignedTo,
      location: event.location,
      notes: event.notes
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
    }
  };

  const handleStatusChange = (eventId: string, newStatus: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: newStatus as any, updatedAt: new Date().toISOString().split('T')[0] }
        : event
    ));
  };

  const getCategoryColor = (category: string) => {
    const categoryObj = categories.find(c => c.value === category);
    return categoryObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'bg-gray-100 text-gray-800';
  };

  const filteredEvents = events.filter(event => {
    const categoryMatch = filterCategory === 'all' || event.category === filterCategory;
    const statusMatch = filterStatus === 'all' || event.status === filterStatus;
    const searchMatch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       event.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && statusMatch && searchMatch;
  });

  // Group events by date
  const eventsByDate = filteredEvents.reduce((acc, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, TimelineEvent[]>);

  const getEventStats = () => {
    const total = events.length;
    const pending = events.filter(e => e.status === 'pending').length;
    const confirmed = events.filter(e => e.status === 'confirmed').length;
    const completed = events.filter(e => e.status === 'completed').length;
    const urgent = events.filter(e => e.priority === 'urgent').length;
    
    return { total, pending, confirmed, completed, urgent };
  };

  const stats = getEventStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Wedding Timeline</h1>
          <p className="text-gray-600">Plan and manage your wedding day timeline</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingEvent(null);
              setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                duration: 60,
                category: 'ceremony',
                status: 'pending',
                priority: 'medium',
                assignedTo: '',
                location: '',
                notes: ''
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
              <DialogDescription>
                {editingEvent ? 'Update your timeline event' : 'Create a new event for your wedding timeline'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: 'ceremony' | 'reception' | 'preparation' | 'photography' | 'transportation' | 'other') => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
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
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    min="1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'pending' | 'confirmed' | 'completed' | 'cancelled') => setFormData(prev => ({ ...prev, status: value }))}
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
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(priority => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                    placeholder="Vendor or person"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Event location"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  placeholder="Additional notes or special instructions"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEvent ? 'Update Event' : 'Add Event'}
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
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
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
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-2xl font-bold">{stats.urgent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline View */}
      <div className="space-y-6">
        {Object.keys(eventsByDate).length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500">Start by adding events to your wedding timeline</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(eventsByDate)
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .map(([date, dateEvents]) => (
              <Card key={date}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dateEvents
                      .sort((a, b) => a.time.localeCompare(b.time))
                      .map((event) => (
                        <div key={event.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mt-2"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-lg font-medium text-gray-900">{event.title}</h4>
                                <Badge className={getCategoryColor(event.category)}>
                                  {categories.find(c => c.value === event.category)?.label}
                                </Badge>
                                <Badge className={getStatusColor(event.status)}>
                                  {statuses.find(s => s.value === event.status)?.label}
                                </Badge>
                                <Badge className={getPriorityColor(event.priority)}>
                                  {priorities.find(p => p.value === event.priority)?.label}
                                </Badge>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500">
                                  {event.time} ({event.duration} min)
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(event)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(event.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-gray-600 mt-1">{event.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                {event.assignedTo}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {event.location}
                              </div>
                            </div>
                            {event.notes && (
                              <p className="text-sm text-gray-600 mt-2 italic">"{event.notes}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
