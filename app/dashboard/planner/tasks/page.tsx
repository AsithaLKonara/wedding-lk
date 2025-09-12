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
import { Plus, Edit, Trash2, CheckSquare, Clock, AlertCircle, Calendar, User, Flag } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  dueDate: string;
  assignedTo: string;
  category: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export default function PlannerTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    dueDate: string;
    assignedTo: string;
    category: string;
    estimatedHours: number;
    tags: string[];
    notes: string;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: '',
    category: '',
    estimatedHours: 0,
    tags: [],
    notes: ''
  });

  const categories = [
    'Venue Selection',
    'Catering',
    'Photography',
    'Decoration',
    'Music & Entertainment',
    'Transportation',
    'Guest Management',
    'Timeline Planning',
    'Budget Management',
    'Vendor Coordination',
    'Other'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  const statuses = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Book Wedding Venue',
          description: 'Research and book the perfect wedding venue for 150 guests',
          priority: 'high',
          status: 'in_progress',
          dueDate: '2024-07-15',
          assignedTo: 'Sarah Johnson',
          category: 'Venue Selection',
          estimatedHours: 8,
          actualHours: 5,
          tags: ['venue', 'booking', 'research'],
          notes: 'Contacted 5 venues, narrowed down to 2 options',
          createdAt: '2024-06-01',
          updatedAt: '2024-06-10'
        },
        {
          id: '2',
          title: 'Finalize Catering Menu',
          description: 'Choose menu items and confirm catering arrangements',
          priority: 'medium',
          status: 'pending',
          dueDate: '2024-07-20',
          assignedTo: 'Mike Wilson',
          category: 'Catering',
          estimatedHours: 4,
          actualHours: 0,
          tags: ['catering', 'menu', 'food'],
          notes: 'Waiting for dietary requirements from guests',
          createdAt: '2024-06-05',
          updatedAt: '2024-06-05'
        },
        {
          id: '3',
          title: 'Hire Wedding Photographer',
          description: 'Interview and hire professional wedding photographer',
          priority: 'high',
          status: 'completed',
          dueDate: '2024-06-30',
          assignedTo: 'Emma Davis',
          category: 'Photography',
          estimatedHours: 6,
          actualHours: 6,
          tags: ['photography', 'vendor', 'hiring'],
          notes: 'Signed contract with Elegant Photography Studio',
          createdAt: '2024-05-20',
          updatedAt: '2024-06-25'
        }
      ];
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        // Update existing task
        setTasks(prev => prev.map(task => 
          task.id === editingTask.id 
            ? { 
                ...task, 
                ...formData,
                updatedAt: new Date().toISOString().split('T')[0]
              }
            : task
        ));
      } else {
        // Create new task
        const newTask: Task = {
          id: Date.now().toString(),
          ...formData,
          actualHours: 0,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        setTasks(prev => [...prev, newTask]);
      }
      
      setIsDialogOpen(false);
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        assignedTo: '',
        category: '',
        estimatedHours: 0,
        tags: [],
        notes: ''
      });
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo,
      category: task.category,
      estimatedHours: task.estimatedHours,
      tags: task.tags,
      notes: task.notes
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedTasks.length === 0) return;
    
    switch (action) {
      case 'complete':
        setTasks(prev => prev.map(task => 
          selectedTasks.includes(task.id) 
            ? { ...task, status: 'completed' as const }
            : task
        ));
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedTasks.length} tasks?`)) {
          setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id)));
        }
        break;
    }
    setSelectedTasks([]);
  };

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status);
    return statusObj?.color || 'bg-gray-100 text-gray-800';
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const priorityMatch = filterPriority === 'all' || task.priority === filterPriority;
    const searchMatch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && priorityMatch && searchMatch;
  });

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress').length;
    const pending = tasks.filter(t => t.status === 'pending').length;
    const overdue = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length;
    
    return { total, completed, inProgress, pending, overdue };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600">Organize and track your wedding planning tasks</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingTask(null);
              setFormData({
                title: '',
                description: '',
                priority: 'medium',
                status: 'pending',
                dueDate: '',
                assignedTo: '',
                category: '',
                estimatedHours: 0,
                tags: [],
                notes: ''
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </DialogTitle>
              <DialogDescription>
                {editingTask ? 'Update your task details' : 'Create a new planning task'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
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
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'pending' | 'in_progress' | 'completed' | 'cancelled') => setFormData(prev => ({ ...prev, status: value }))}
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
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input
                    id="assignedTo"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                    placeholder="Team member name"
                  />
                </div>
                <div>
                  <Label htmlFor="estimatedHours">Estimated Hours</Label>
                  <Input
                    id="estimatedHours"
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: parseInt(e.target.value) || 0 }))}
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={2}
                  placeholder="Additional notes or comments"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTask ? 'Update Task' : 'Add Task'}
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
              <Flag className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckSquare className="h-8 w-8 text-green-600" />
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
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
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
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{stats.overdue}</p>
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
                <Label htmlFor="search">Search Tasks</Label>
                <Input
                  id="search"
                  placeholder="Search by title, description, or assignee..."
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
                    <SelectItem value="in_progress">In Progress</SelectItem>
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
            
            {selectedTasks.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedTasks.length} selected
                </span>
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

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
          <CardDescription>Manage and track your wedding planning tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedTasks.length === filteredTasks.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTasks(filteredTasks.map(t => t.id));
                      } else {
                        setSelectedTasks([]);
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedTasks(prev => [...prev, task.id]);
                        } else {
                          setSelectedTasks(prev => prev.filter(id => id !== task.id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.description}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {task.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      {priorities.find(p => p.value === task.priority)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(task.status)}>
                      {statuses.find(s => s.value === task.status)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      {task.assignedTo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{task.actualHours}h</span>
                        <span>{task.estimatedHours}h</span>
                      </div>
                      <Progress 
                        value={(task.actualHours / task.estimatedHours) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(task)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(task.id)}
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
