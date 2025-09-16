"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Users, Mail, Phone, Calendar, MessageSquare, Edit, Trash2, Eye, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface Client {
  id: string
  name: string
  email: string
  phone: string
  weddingDate: string
  status: 'active' | 'completed' | 'on_hold' | 'cancelled'
  budget: number
  guestCount: number
  venue: string
  lastContact: string
  notes: string
  createdAt: string
  tasksCompleted: number
  totalTasks: number
  satisfaction: number
}

export default function PlannerClientsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'on_hold' | 'cancelled'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'wedding_planner') {
      router.push('/unauthorized')
      return
    }

    // Mock data - replace with actual API call
    setClients([
      {
        id: '1',
        name: 'John & Sarah Wilson',
        email: 'john.sarah@email.com',
        phone: '+94 77 123 4567',
        weddingDate: '2024-06-15',
        status: 'active',
        budget: 2500000,
        guestCount: 150,
        venue: 'Grand Hotel Colombo',
        lastContact: '2024-02-10',
        notes: 'Very organized couple, prefers outdoor ceremonies',
        createdAt: '2023-12-01',
        tasksCompleted: 12,
        totalTasks: 25,
        satisfaction: 4.8
      },
      {
        id: '2',
        name: 'Mike & Emily Johnson',
        email: 'mike.emily@email.com',
        phone: '+94 77 234 5678',
        weddingDate: '2024-08-20',
        status: 'active',
        budget: 1800000,
        guestCount: 100,
        venue: 'Beach Resort Galle',
        lastContact: '2024-02-08',
        notes: 'Budget-conscious, wants simple elegant wedding',
        createdAt: '2024-01-15',
        tasksCompleted: 8,
        totalTasks: 20,
        satisfaction: 4.6
      },
      {
        id: '3',
        name: 'David & Lisa Brown',
        email: 'david.lisa@email.com',
        phone: '+94 77 345 6789',
        weddingDate: '2024-03-10',
        status: 'completed',
        budget: 3200000,
        guestCount: 200,
        venue: 'Luxury Resort Kandy',
        lastContact: '2024-03-15',
        notes: 'Perfect wedding, very happy clients',
        createdAt: '2023-10-01',
        tasksCompleted: 30,
        totalTasks: 30,
        satisfaction: 5.0
      },
      {
        id: '4',
        name: 'Tom & Jessica Davis',
        email: 'tom.jessica@email.com',
        phone: '+94 77 456 7890',
        weddingDate: '2024-09-05',
        status: 'on_hold',
        budget: 1500000,
        guestCount: 80,
        venue: 'Garden Venue Negombo',
        lastContact: '2024-01-20',
        notes: 'Postponed due to family emergency',
        createdAt: '2023-11-15',
        tasksCompleted: 5,
        totalTasks: 18,
        satisfaction: 4.2
      }
    ])
    setLoading(false)
  }, [session, status, router])

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.venue.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'on_hold': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getProgressPercentage = (completed: number, total: number) => {
    return total > 0 ? (completed / total) * 100 : 0
  }

  const getDaysUntilWedding = (weddingDate: string) => {
    const today = new Date()
    const wedding = new Date(weddingDate)
    const diffTime = wedding.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Management</h1>
              <p className="text-gray-600">Manage your wedding planning clients and their events</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => router.push('/dashboard/planner/clients/create')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Client
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/planner/clients/import')}
                variant="outline"
              >
                <Users className="w-4 h-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Clients</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {clients.filter(client => client.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {clients.filter(client => client.status === 'completed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Satisfaction</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(clients.reduce((sum, client) => sum + client.satisfaction, 0) / clients.length).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    onClick={() => setViewMode('grid')}
                    size="sm"
                  >
                    Grid
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
          </CardContent>
        </Card>

        {/* Clients Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{client.name}</CardTitle>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2" />
                      {client.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {client.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(client.weddingDate).toLocaleDateString()}
                      <span className="ml-2 text-blue-600 font-medium">
                        ({getDaysUntilWedding(client.weddingDate)} days)
                      </span>
                    </div>
                    
                    <div className="pt-3 border-t">
                      <div className="text-sm text-gray-600 mb-2">Planning Progress</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                          style={{width: `${getProgressPercentage(client.tasksCompleted, client.totalTasks)}%`}}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {client.tasksCompleted} of {client.totalTasks} tasks completed
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <div>
                        <div className="text-gray-500">Budget</div>
                        <div className="font-medium">{formatPrice(client.budget)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Guests</div>
                        <div className="font-medium">{client.guestCount}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Satisfaction</div>
                        <div className="font-medium flex items-center">
                          <Heart className="w-4 h-4 text-red-500 mr-1" />
                          {client.satisfaction}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                          <p className="text-gray-600">{client.venue}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(client.status)}>
                            {client.status.replace('_', ' ')}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-500">Wedding Date</div>
                          <div className="font-medium">
                            {new Date(client.weddingDate).toLocaleDateString()}
                            <span className="ml-2 text-blue-600">
                              ({getDaysUntilWedding(client.weddingDate)} days)
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Budget</div>
                          <div className="font-medium">{formatPrice(client.budget)}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Guests</div>
                          <div className="font-medium">{client.guestCount}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Progress</div>
                          <div className="font-medium">
                            {client.tasksCompleted}/{client.totalTasks} tasks
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <div className="text-sm text-gray-500 mb-1">Planning Progress</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                            style={{width: `${getProgressPercentage(client.tasksCompleted, client.totalTasks)}%`}}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? "Try adjusting your search criteria or filters."
                : "You don't have any clients yet. Add your first client to get started."
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Button 
                onClick={() => router.push('/dashboard/planner/clients/create')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Client
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}