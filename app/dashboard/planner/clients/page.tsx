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
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Edit, Trash2, Eye, Mail, Phone, Calendar, Heart, Users, DollarSign, Star, MapPin } from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  weddingDate: string;
  budget: number;
  guestCount: number;
  venue: string;
  status: 'prospect' | 'active' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes: string;
  lastContact: string;
  totalSpent: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export default function PlannerClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    weddingDate: string;
    budget: number;
    guestCount: number;
    venue: string;
    status: 'prospect' | 'active' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    notes: string;
  }>({
    name: '',
    email: '',
    phone: '',
    weddingDate: '',
    budget: 0,
    guestCount: 0,
    venue: '',
    status: 'prospect',
    priority: 'medium',
    notes: ''
  });

  const statuses = [
    { value: 'prospect', label: 'Prospect', color: 'bg-blue-100 text-blue-800' },
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', color: 'bg-purple-100 text-purple-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockClients: Client[] = [
        {
          id: '1',
          name: 'Sarah & Michael Johnson',
          email: 'sarah.michael@email.com',
          phone: '+1 (555) 123-4567',
          weddingDate: '2024-08-15',
          budget: 50000,
          guestCount: 150,
          venue: 'Garden Manor',
          status: 'active',
          priority: 'high',
          notes: 'Very organized couple, prefers outdoor ceremony',
          lastContact: '2024-06-20',
          totalSpent: 25000,
          rating: 5,
          createdAt: '2024-03-15',
          updatedAt: '2024-06-20'
        },
        {
          id: '2',
          name: 'Emma & David Wilson',
          email: 'emma.david@email.com',
          phone: '+1 (555) 234-5678',
          weddingDate: '2024-09-22',
          budget: 35000,
          guestCount: 100,
          venue: 'Riverside Hotel',
          status: 'prospect',
          priority: 'medium',
          notes: 'Still deciding on venue, very budget conscious',
          lastContact: '2024-06-18',
          totalSpent: 5000,
          rating: 0,
          createdAt: '2024-05-10',
          updatedAt: '2024-06-18'
        },
        {
          id: '3',
          name: 'Lisa & James Brown',
          email: 'lisa.james@email.com',
          phone: '+1 (555) 345-6789',
          weddingDate: '2024-07-30',
          budget: 75000,
          guestCount: 200,
          venue: 'Grand Ballroom',
          status: 'completed',
          priority: 'high',
          notes: 'Luxury wedding, very satisfied with services',
          lastContact: '2024-07-30',
          totalSpent: 75000,
          rating: 5,
          createdAt: '2024-01-20',
          updatedAt: '2024-07-30'
        }
      ];
      setClients(mockClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingClient) {
        // Update existing client
        setClients(prev => prev.map(client => 
          client.id === editingClient.id 
            ? { 
                ...client, 
                ...formData,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : client
        ));
      } else {
        // Create new client
        const newClient: Client = {
          id: Date.now().toString(),
          ...formData,
          lastContact: new Date().toISOString().split('T')[0],
          totalSpent: 0,
          rating: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setClients(prev => [...prev, newClient]);
      }
      
      setIsDialogOpen(false);
      setEditingClient(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        weddingDate: '',
        budget: 0,
        guestCount: 0,
        venue: '',
        status: 'prospect',
        priority: 'medium',
        notes: ''
      });
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      weddingDate: client.weddingDate,
      budget: client.budget,
      guestCount: client.guestCount,
      venue: client.venue,
      status: client.status,
      priority: client.priority,
      notes: client.notes
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      setClients(prev => prev.filter(client => client.id !== clientId));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedClients.length === 0) return;
    
    switch (action) {
      case 'activate':
        setClients(prev => prev.map(client => 
          selectedClients.includes(client.id) 
            ? { ...client, status: 'active' as const }
            : client
        ));
        break;
      case 'complete':
        setClients(prev => prev.map(client => 
          selectedClients.includes(client.id) 
            ? { ...client, status: 'completed' as const }
            : client
        ));
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedClients.length} clients?`)) {
          setClients(prev => prev.filter(client => !selectedClients.includes(client.id)));
        }
        break;
    }
    setSelectedClients([]);
  };

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'bg-gray-100 text-gray-800';
  };

  const filteredClients = clients.filter(client => {
    const statusMatch = filterStatus === 'all' || client.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || client.priority === filterPriority;
    const searchMatch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       client.venue.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && priorityMatch && searchMatch;
  });

  const getClientStats = () => {
    const total = clients.length;
    const active = clients.filter(c => c.status === 'active').length;
    const completed = clients.filter(c => c.status === 'completed').length;
    const prospects = clients.filter(c => c.status === 'prospect').length;
    const totalRevenue = clients.reduce((sum, client) => sum + client.totalSpent, 0);
    const averageBudget = clients.reduce((sum, client) => sum + client.budget, 0) / clients.length;
    
    return { total, active, completed, prospects, totalRevenue, averageBudget };
  };

  const stats = getClientStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Management</h1>
          <p className="text-gray-600">Manage your wedding planning clients and their events</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingClient(null);
              setFormData({
                name: '',
                email: '',
                phone: '',
                weddingDate: '',
                budget: 0,
                guestCount: 0,
                venue: '',
                status: 'prospect',
                priority: 'medium',
                notes: ''
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </DialogTitle>
              <DialogDescription>
                {editingClient ? 'Update client information' : 'Add a new wedding planning client'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Client Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Sarah & Michael Johnson"
                    required
                  />
                </div>
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="weddingDate">Wedding Date</Label>
                  <Input
                    id="weddingDate"
                    type="date"
                    value={formData.weddingDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, weddingDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="guestCount">Guest Count</Label>
                  <Input
                    id="guestCount"
                    type="number"
                    value={formData.guestCount}
                    onChange={(e) => setFormData(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
                <div>
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                    placeholder="Venue name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'prospect' | 'active' | 'completed' | 'cancelled') => setFormData(prev => ({ ...prev, status: value }))}
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
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Additional notes about the client or wedding"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingClient ? 'Update Client' : 'Add Client'}
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
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-green-600" />
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
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prospects</p>
                <p className="text-2xl font-bold">{stats.prospects}</p>
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
                <Label htmlFor="search">Search Clients</Label>
                <Input
                  id="search"
                  placeholder="Search by name, email, or venue..."
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
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priorityFilter">Priority</Label>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedClients.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedClients.length} selected
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('activate')}
                >
                  Mark Active
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction('complete')}
                >
                  Mark Complete
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

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client Directory</CardTitle>
          <CardDescription>Manage your wedding planning clients and their events</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedClients.length === filteredClients.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedClients(filteredClients.map(c => c.id));
                      } else {
                        setSelectedClients([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Wedding Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedClients(prev => [...prev, client.id]);
                        } else {
                          setSelectedClients(prev => prev.filter(id => id !== client.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {client.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-gray-500">Last contact: {new Date(client.lastContact).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        {client.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        {client.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(client.weddingDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        {client.venue}
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        {client.guestCount} guests
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(client.status)}>
                      {statuses.find(s => s.value === client.status)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(client.priority)}>
                      {priorities.find(p => p.value === client.priority)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                        <span className="font-medium">{client.budget.toLocaleString()}</span>
                      </div>
                      <div className="text-gray-500">
                        Spent: {client.totalSpent.toLocaleString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{client.totalSpent.toLocaleString()}</span>
                        <span>{client.budget.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(client.totalSpent / client.budget) * 100} 
                        className="h-2" 
                      />
                      {client.rating > 0 && (
                        <div className="flex items-center text-sm">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          <span>{client.rating}/5</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
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
