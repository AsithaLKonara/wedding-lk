"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Users, 
  DollarSign, 
  MapPin, 
  Clock,
  Plus,
  Save,
  Trash2
} from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string
  dueDate: Date
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  category: string
}

interface Guest {
  id: string
  name: string
  email: string
  phone: string
  rsvp: 'pending' | 'confirmed' | 'declined'
  dietary: string
  plusOne: boolean
}

interface BudgetItem {
  id: string
  category: string
  item: string
  estimated: number
  actual: number
  paid: boolean
}

export default function PlanningPage() {
  const [activeTab, setActiveTab] = useState('timeline')
  const [weddingDate, setWeddingDate] = useState<Date>()
  const [tasks, setTasks] = useState<Task[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [budget, setBudget] = useState<BudgetItem[]>([])
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: new Date(), priority: 'medium' as const, category: '' })
  const [newGuest, setNewGuest] = useState({ name: '', email: '', phone: '', dietary: '', plusOne: false })
  const [newBudget, setNewBudget] = useState({ category: '', item: '', estimated: 0 })

  useEffect(() => {
    // Load saved data from localStorage
    const savedTasks = localStorage.getItem('wedding-tasks')
    const savedGuests = localStorage.getItem('wedding-guests')
    const savedBudget = localStorage.getItem('wedding-budget')
    const savedDate = localStorage.getItem('wedding-date')

    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedGuests) setGuests(JSON.parse(savedGuests))
    if (savedBudget) setBudget(JSON.parse(savedBudget))
    if (savedDate) setWeddingDate(new Date(savedDate))
  }, [])

  useEffect(() => {
    // Save data to localStorage
    localStorage.setItem('wedding-tasks', JSON.stringify(tasks))
    localStorage.setItem('wedding-guests', JSON.stringify(guests))
    localStorage.setItem('wedding-budget', JSON.stringify(budget))
    if (weddingDate) localStorage.setItem('wedding-date', weddingDate.toISOString())
  }, [tasks, guests, budget, weddingDate])

  const addTask = () => {
    if (!newTask.title.trim()) return
    
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      completed: false
    }
    
    setTasks([...tasks, task])
    setNewTask({ title: '', description: '', dueDate: new Date(), priority: 'medium', category: '' })
  }

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
  }

  const addGuest = () => {
    if (!newGuest.name.trim()) return
    
    const guest: Guest = {
      id: Date.now().toString(),
      ...newGuest,
      rsvp: 'pending'
    }
    
    setGuests([...guests, guest])
    setNewGuest({ name: '', email: '', phone: '', dietary: '', plusOne: false })
  }

  const updateGuestRSVP = (guestId: string, rsvp: 'confirmed' | 'declined') => {
    setGuests(guests.map(guest => 
      guest.id === guestId ? { ...guest, rsvp } : guest
    ))
  }

  const deleteGuest = (guestId: string) => {
    setGuests(guests.filter(guest => guest.id !== guestId))
  }

  const addBudgetItem = () => {
    if (!newBudget.item.trim() || !newBudget.category.trim()) return
    
    const budgetItem: BudgetItem = {
      id: Date.now().toString(),
      ...newBudget,
      actual: 0,
      paid: false
    }
    
    setBudget([...budget, budgetItem])
    setNewBudget({ category: '', item: '', estimated: 0 })
  }

  const updateBudgetItem = (itemId: string, field: keyof BudgetItem, value: any) => {
    setBudget(budget.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ))
  }

  const deleteBudgetItem = (itemId: string) => {
    setBudget(budget.filter(item => item.id !== itemId))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRSVPColor = (rsvp: string) => {
    switch (rsvp) {
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalBudget = budget.reduce((sum, item) => sum + item.estimated, 0)
  const totalSpent = budget.reduce((sum, item) => sum + item.actual, 0)
  const totalPaid = budget.reduce((sum, item) => sum + (item.paid ? item.actual : 0), 0)

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Wedding Planning</h1>
        <p className="text-xl text-gray-600">Organize your special day with our planning tools</p>
        
        {/* Wedding Date */}
        <div className="mt-6 flex items-center justify-center space-x-4">
          <CalendarIcon className="h-6 w-6 text-blue-600" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wedding Date
            </label>
            <Calendar
              mode="single"
              selected={weddingDate}
              onSelect={setWeddingDate}
              className="rounded-md border"
            />
          </div>
        </div>
      </div>

      {/* Planning Tabs */}
      <div className="space-y-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={activeTab === 'timeline' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('timeline')}
            className="flex-1"
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Timeline & Tasks
          </Button>
          <Button
            variant={activeTab === 'guests' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('guests')}
            className="flex-1"
          >
            <Users className="h-4 w-4 mr-2" />
            Guest List
          </Button>
          <Button
            variant={activeTab === 'budget' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('budget')}
            className="flex-1"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Budget
          </Button>
        </div>

        {/* Timeline & Tasks Tab */}
        {activeTab === 'timeline' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Wedding Timeline & Tasks</span>
                <Button onClick={addTask} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add New Task */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 border rounded-lg">
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
                <Input
                  placeholder="Category (e.g., Venue, Vendor, etc.)"
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                />
                <div className="flex space-x-2">
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="flex-1 px-3 py-2 border rounded-md"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <Button onClick={addTask} size="sm">Add</Button>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </span>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        {task.category && (
                          <Badge variant="outline">{task.category}</Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No tasks yet</p>
                    <p className="text-sm">Add your first wedding planning task above</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Guest List Tab */}
        {activeTab === 'guests' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Guest List</span>
                <Button onClick={addGuest} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guest
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add New Guest */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg">
                <Input
                  placeholder="Guest name"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({ ...newGuest, name: e.target.value })}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newGuest.email}
                  onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
                />
                <Input
                  placeholder="Phone"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
                />
                <div className="flex space-x-2">
                  <Input
                    placeholder="Dietary restrictions"
                    value={newGuest.dietary}
                    onChange={(e) => setNewGuest({ ...newGuest, dietary: e.target.value })}
                  />
                  <Button onClick={addGuest} size="sm">Add</Button>
                </div>
              </div>

              {/* Guests List */}
              <div className="space-y-3">
                {guests.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">{guest.name}</span>
                        <Badge className={getRSVPColor(guest.rsvp)}>
                          {guest.rsvp}
                        </Badge>
                        {guest.plusOne && (
                          <Badge variant="outline">+1</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{guest.email}</p>
                        <p>{guest.phone}</p>
                        {guest.dietary && <p>Dietary: {guest.dietary}</p>}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateGuestRSVP(guest.id, 'confirmed')}
                        className="text-green-600"
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateGuestRSVP(guest.id, 'declined')}
                        className="text-red-600"
                      >
                        Decline
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGuest(guest.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {guests.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No guests yet</p>
                    <p className="text-sm">Add your first guest above</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Budget Tab */}
        {activeTab === 'budget' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Wedding Budget</span>
                <Button onClick={addBudgetItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Budget Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">LKR {totalBudget.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Total Budget</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">LKR {totalSpent.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-purple-600">LKR {totalPaid.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">Total Paid</p>
                  </CardContent>
                </Card>
              </div>

              {/* Add New Budget Item */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg">
                <Input
                  placeholder="Category (e.g., Venue, Catering)"
                  value={newBudget.category}
                  onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
                />
                <Input
                  placeholder="Item description"
                  value={newBudget.item}
                  onChange={(e) => setNewBudget({ ...newBudget, item: e.target.value })}
                />
                <Input
                  placeholder="Estimated cost"
                  type="number"
                  value={newBudget.estimated}
                  onChange={(e) => setNewBudget({ ...newBudget, estimated: parseFloat(e.target.value) || 0 })}
                />
                <Button onClick={addBudgetItem} size="sm">Add</Button>
              </div>

              {/* Budget Items List */}
              <div className="space-y-3">
                {budget.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">{item.item}</span>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Estimated: LKR {item.estimated.toLocaleString()}</p>
                        <p>Actual: LKR {item.actual.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        placeholder="Actual cost"
                        value={item.actual}
                        onChange={(e) => updateBudgetItem(item.id, 'actual', parseFloat(e.target.value) || 0)}
                        className="w-24"
                      />
                      <Checkbox
                        checked={item.paid}
                        onCheckedChange={(checked) => updateBudgetItem(item.id, 'paid', checked)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteBudgetItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {budget.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No budget items yet</p>
                    <p className="text-sm">Add your first budget item above</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
