'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Target,
  Users,
  Camera,
  Music,
  Utensils
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  category: 'ceremony' | 'reception' | 'preparation' | 'photography' | 'music' | 'catering' | 'other';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
  location?: string;
  notes?: string;
}

export default function TimelinePage() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [weddingDate, setWeddingDate] = useState('');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    category: 'other' as const,
    assignedTo: '',
    location: '',
    notes: ''
  });

  const categories = [
    { value: 'ceremony', label: 'Ceremony', icon: Users, color: 'bg-blue-500' },
    { value: 'reception', label: 'Reception', icon: Users, color: 'bg-green-500' },
    { value: 'preparation', label: 'Preparation', icon: Clock, color: 'bg-purple-500' },
    { value: 'photography', label: 'Photography', icon: Camera, color: 'bg-pink-500' },
    { value: 'music', label: 'Music', icon: Music, color: 'bg-yellow-500' },
    { value: 'catering', label: 'Catering', icon: Utensils, color: 'bg-orange-500' },
    { value: 'other', label: 'Other', icon: Target, color: 'bg-gray-500' },
  ];

  useEffect(() => {
    if (session) {
      loadTimelineData();
    }
  }, [session]);

  const loadTimelineData = () => {
    const savedEvents = localStorage.getItem('wedding-timeline');
    const savedWeddingDate = localStorage.getItem('wedding-date');
    
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Create default timeline
      const defaultEvents = createDefaultTimeline();
      setEvents(defaultEvents);
    }
    
    if (savedWeddingDate) {
      setWeddingDate(savedWeddingDate);
    } else {
      // Set default wedding date to 6 months from now
      const defaultDate = new Date();
      defaultDate.setMonth(defaultDate.getMonth() + 6);
      setWeddingDate(defaultDate.toISOString().split('T')[0]);
    }
  };

  const createDefaultTimeline = (): TimelineEvent[] => {
    const weddingDate = new Date();
    weddingDate.setMonth(weddingDate.getMonth() + 6);
    
    return [
      {
        id: '1',
        title: 'Book Venue',
        description: 'Reserve wedding venue and confirm date',
        date: new Date(weddingDate.getTime() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '10:00',
        category: 'ceremony',
        status: 'pending',
        assignedTo: 'Couple',
        location: 'Venue Location'
      },
      {
        id: '2',
        title: 'Hire Photographer',
        description: 'Book wedding photographer and videographer',
        date: new Date(weddingDate.getTime() - 5 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '14:00',
        category: 'photography',
        status: 'pending',
        assignedTo: 'Couple'
      },
      {
        id: '3',
        title: 'Order Wedding Dress',
        description: 'Choose and order wedding dress',
        date: new Date(weddingDate.getTime() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '11:00',
        category: 'preparation',
        status: 'pending',
        assignedTo: 'Bride'
      },
      {
        id: '4',
        title: 'Book Caterer',
        description: 'Finalize catering menu and service',
        date: new Date(weddingDate.getTime() - 3 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '15:00',
        category: 'catering',
        status: 'pending',
        assignedTo: 'Couple'
      },
      {
        id: '5',
        title: 'Hire Musicians',
        description: 'Book wedding band or DJ',
        date: new Date(weddingDate.getTime() - 2 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '16:00',
        category: 'music',
        status: 'pending',
        assignedTo: 'Couple'
      },
      {
        id: '6',
        title: 'Wedding Day',
        description: 'The big day!',
        date: weddingDate.toISOString().split('T')[0],
        time: '09:00',
        category: 'ceremony',
        status: 'pending',
        assignedTo: 'Everyone'
      }
    ];
  };

  const saveTimelineData = () => {
    localStorage.setItem('wedding-timeline', JSON.stringify(events));
    localStorage.setItem('wedding-date', weddingDate);
  };

  useEffect(() => {
    saveTimelineData();
  }, [events, weddingDate]);

  const addEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date.trim()) return;
    
    const event: TimelineEvent = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      time: newEvent.time,
      category: newEvent.category,
      status: 'pending',
      assignedTo: newEvent.assignedTo,
      location: newEvent.location,
      notes: newEvent.notes
    };
    
    setEvents([...events, event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      category: 'other',
      assignedTo: '',
      location: '',
      notes: ''
    });
    setShowAddEvent(false);
    toast({
      title: 'Event Added',
      description: `${newEvent.title} has been added to your timeline.`,
    });
  };

  const updateEvent = () => {
    if (!editingEvent) return;
    
    setEvents(events.map(event => 
      event.id === editingEvent.id 
        ? { ...editingEvent }
        : event
    ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    
    setEditingEvent(null);
    toast({
      title: 'Event Updated',
      description: `${editingEvent.title} has been updated.`,
    });
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
    toast({
      title: 'Event Deleted',
      description: 'Event has been removed from your timeline.',
    });
  };

  const updateEventStatus = (eventId: string, status: 'pending' | 'in-progress' | 'completed') => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, status }
        : event
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryInfo = categories.find(c => c.value === category);
    const Icon = categoryInfo?.icon || Target;
    return <Icon className="h-4 w-4" />;
  };

  const getDaysUntilWedding = () => {
    if (!weddingDate) return 0;
    const today = new Date();
    const wedding = new Date(weddingDate);
    const diffTime = wedding.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events.filter(event => 
      new Date(event.date) >= today && event.status !== 'completed'
    ).slice(0, 3);
  };

  const getCompletedEvents = () => {
    return events.filter(event => event.status === 'completed').length;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wedding Timeline</h1>
          <p className="mt-2 text-gray-600">Plan and track your wedding day timeline</p>
        </div>

        {/* Wedding Date & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Wedding Date</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {weddingDate ? new Date(weddingDate).toLocaleDateString() : 'Not Set'}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Days Until Wedding</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getDaysUntilWedding()}
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {events.length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {getCompletedEvents()}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Wedding Date Picker */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Wedding Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Label htmlFor="weddingDate">Set your wedding date:</Label>
              <Input
                id="weddingDate"
                type="date"
                value={weddingDate}
                onChange={(e) => setWeddingDate(e.target.value)}
                className="w-48"
              />
            </div>
          </CardContent>
        </Card>

        {/* Timeline Events */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Timeline Events</h2>
            <Button onClick={() => setShowAddEvent(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>

          {events.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
                <p className="text-gray-600 mb-4">Start planning your wedding timeline by adding events.</p>
                <Button onClick={() => setShowAddEvent(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {events.map((event, index) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(event.status)}
                          <h3 className="text-lg font-semibold text-gray-900">
                            {event.title}
                          </h3>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                          <Badge variant="outline" className="flex items-center space-x-1">
                            {getCategoryIcon(event.category)}
                            <span>{categories.find(c => c.value === event.category)?.label}</span>
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{event.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {event.time}
                          </div>
                          {event.assignedTo && (
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {event.assignedTo}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center">
                              <Target className="h-4 w-4 mr-1" />
                              {event.location}
                            </div>
                          )}
                        </div>
                        
                        {event.notes && (
                          <p className="text-sm text-gray-500 mt-2 italic">
                            Note: {event.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <select
                          value={event.status}
                          onChange={(e) => updateEventStatus(event.id, e.target.value as any)}
                          className="text-sm border rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingEvent(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteEvent(event.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add Timeline Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="eventTitle">Event Title</Label>
                  <Input
                    id="eventTitle"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="e.g., Hair & Makeup"
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventDescription">Description</Label>
                  <Textarea
                    id="eventDescription"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Event description..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventDate">Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventTime">Time</Label>
                    <Input
                      id="eventTime"
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="eventCategory">Category</Label>
                  <select
                    id="eventCategory"
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value as any })}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="eventAssignedTo">Assigned To</Label>
                  <Input
                    id="eventAssignedTo"
                    value={newEvent.assignedTo}
                    onChange={(e) => setNewEvent({ ...newEvent, assignedTo: e.target.value })}
                    placeholder="e.g., Bride, Groom, Wedding Planner"
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventLocation">Location</Label>
                  <Input
                    id="eventLocation"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    placeholder="Event location"
                  />
                </div>
                
                <div>
                  <Label htmlFor="eventNotes">Notes</Label>
                  <Textarea
                    id="eventNotes"
                    value={newEvent.notes}
                    onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddEvent(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={addEvent}>
                    Add Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Event Modal */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Edit Timeline Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="editTitle">Event Title</Label>
                  <Input
                    id="editTitle"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="editDescription">Description</Label>
                  <Textarea
                    id="editDescription"
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="editDate">Date</Label>
                    <Input
                      id="editDate"
                      type="date"
                      value={editingEvent.date}
                      onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="editTime">Time</Label>
                    <Input
                      id="editTime"
                      type="time"
                      value={editingEvent.time}
                      onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="editCategory">Category</Label>
                  <select
                    id="editCategory"
                    value={editingEvent.category}
                    onChange={(e) => setEditingEvent({ ...editingEvent, category: e.target.value as any })}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="editAssignedTo">Assigned To</Label>
                  <Input
                    id="editAssignedTo"
                    value={editingEvent.assignedTo || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, assignedTo: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="editLocation">Location</Label>
                  <Input
                    id="editLocation"
                    value={editingEvent.location || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="editNotes">Notes</Label>
                  <Textarea
                    id="editNotes"
                    value={editingEvent.notes || ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, notes: e.target.value })}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setEditingEvent(null)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={updateEvent}>
                    Update Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
