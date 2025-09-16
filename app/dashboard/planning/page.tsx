'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2,
  Users,
  MapPin,
  Camera,
  Music,
  Flower,
  Utensils,
  Car,
  Heart,
  Gift,
  Cake,
  Circle
} from 'lucide-react';
import { Header } from '@/components/organisms/header';
import { Footer } from '@/components/organisms/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PlanningTask {
  _id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface WeddingDetails {
  weddingDate: string;
  venue: string;
  guestCount: number;
  budget: number;
  theme: string;
  colors: string[];
}

const taskCategories = [
  { id: 'venue', name: 'Venue', icon: MapPin, color: 'bg-blue-100 text-blue-600' },
  { id: 'photography', name: 'Photography', icon: Camera, color: 'bg-purple-100 text-purple-600' },
  { id: 'music', name: 'Music', icon: Music, color: 'bg-green-100 text-green-600' },
  { id: 'flowers', name: 'Flowers', icon: Flower, color: 'bg-pink-100 text-pink-600' },
  { id: 'catering', name: 'Catering', icon: Utensils, color: 'bg-orange-100 text-orange-600' },
  { id: 'transportation', name: 'Transportation', icon: Car, color: 'bg-gray-100 text-gray-600' },
  { id: 'attire', name: 'Attire', icon: Heart, color: 'bg-red-100 text-red-600' },
  { id: 'gifts', name: 'Gifts', icon: Gift, color: 'bg-yellow-100 text-yellow-600' },
  { id: 'cake', name: 'Cake', icon: Cake, color: 'bg-indigo-100 text-indigo-600' },
  { id: 'rings', name: 'Rings', icon: Circle, color: 'bg-teal-100 text-teal-600' }
];

export default function PlanningPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [weddingDetails, setWeddingDetails] = useState<WeddingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: '',
    dueDate: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    fetchPlanningData();
  }, [session, status, router]);

  const fetchPlanningData = async () => {
    try {
      const response = await fetch('/api/user/planning');
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
        setWeddingDetails(data.weddingDetails || null);
      }
    } catch (error) {
      console.error('Error fetching planning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.category) return;

    try {
      const response = await fetch('/api/user/planning/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        await fetchPlanningData();
        setNewTask({
          title: '',
          description: '',
          category: '',
          dueDate: '',
          priority: 'medium'
        });
        setShowAddTask(false);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/user/planning/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
      });

      if (response.ok) {
        await fetchPlanningData();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/user/planning/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPlanningData();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => 
    selectedCategory === 'all' || task.category === selectedCategory
  );

  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Wedding Planning</h1>
                <p className="text-gray-600">Organize your wedding tasks and timeline</p>
              </div>
            </div>
            <Button
              onClick={() => setShowAddTask(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </Button>
          </div>

          {/* Wedding Details Summary */}
          {weddingDetails && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Wedding Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Wedding Date</p>
                    <p className="font-semibold">{new Date(weddingDetails.weddingDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Venue</p>
                    <p className="font-semibold">{weddingDetails.venue || 'Not selected'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Guest Count</p>
                    <p className="font-semibold">{weddingDetails.guestCount || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-semibold">${weddingDetails.budget?.toLocaleString() || 'Not set'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            {taskCategories.map((category) => {
              const Icon = category.icon;
              const taskCount = tasks.filter(task => task.category === category.id).length;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name} ({taskCount})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Task Modal */}
        {showAddTask && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title
                  </label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter task title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    {taskCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter task description"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddTask(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddTask}>
                  Add Task
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tasks List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span>Pending Tasks ({pendingTasks.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((task) => {
                  const category = taskCategories.find(cat => cat.id === task.category);
                  const Icon = category?.icon || Calendar;
                  
                  return (
                    <div
                      key={task._id}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-gray-400" />
                          <h4 className="font-medium text-gray-900">{task.title}</h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {task.dueDate && (
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          )}
                          {category && (
                            <span className={`px-2 py-1 rounded-full text-xs ${category.color}`}>
                              {category.name}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleToggleTask(task._id)}
                          className="flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          <span>Complete</span>
                        </Button>
                      </div>
                    </div>
                  );
                })}
                
                {pendingTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No pending tasks</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>Completed Tasks ({completedTasks.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedTasks.map((task) => {
                  const category = taskCategories.find(cat => cat.id === task.category);
                  const Icon = category?.icon || Calendar;
                  
                  return (
                    <div
                      key={task._id}
                      className="p-4 border border-gray-200 rounded-lg bg-green-50"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon className="w-4 h-4 text-gray-400" />
                          <h4 className="font-medium text-gray-900 line-through">{task.title}</h4>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-2 line-through">{task.description}</p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {task.dueDate && (
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          )}
                          {category && (
                            <span className={`px-2 py-1 rounded-full text-xs ${category.color}`}>
                              {category.name}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Completed</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {completedTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No completed tasks yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}