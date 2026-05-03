"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, Package, DollarSign, Calendar, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/hooks/use-auth'

interface Service {
  id: string
  name: string
  description: string
  category: string
  price: number
  duration: number
  status: 'active' | 'inactive' | 'pending'
  bookings: number
  rating: number
  createdAt: string
}

export default function VendorServicesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all')

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push('/auth/signin')
      return
    }

    if (user.role !== 'vendor') {
      router.push('/unauthorized')
      return
    }

    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/vendor/services');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Map API data to component state
            const mappedServices = data.services.map((s: any) => ({
              id: s.id,
              name: s.name,
              description: s.description || 'No description provided.',
              category: s.category,
              price: s.price,
              duration: 1, // Default duration if not provided
              status: s.isActive ? 'active' : 'inactive',
              bookings: s.bookings || 0,
              rating: s.rating || 0,
              createdAt: new Date().toISOString()
            }));
            setServices(mappedServices);
          }
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user, authLoading, router])

  const filteredServices = services.filter(service => {
    if (filter === 'all') return true
    return service.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'inactive': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">My Services</h1>
              <p className="text-gray-400">Manage your wedding services and packages</p>
            </div>
            <Button 
              onClick={() => router.push('/dashboard/vendor/services/create')}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Service
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Services</p>
                  <p className="text-2xl font-bold text-white">{services.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                  <p className="text-2xl font-bold text-white">
                    {formatPrice(services.reduce((sum, service) => sum + (service.price * service.bookings), 0))}
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
                  <p className="text-sm font-medium text-gray-400">Total Bookings</p>
                  <p className="text-2xl font-bold text-white">
                    {services.reduce((sum, service) => sum + service.bookings, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Avg Rating</p>
                  <p className="text-2xl font-bold text-white">
                    {services.length > 0 ? (services.reduce((sum, service) => sum + service.rating, 0) / services.length).toFixed(1) : '0.0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {['all', 'active', 'inactive', 'pending'].map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? 'default' : 'outline'}
                onClick={() => setFilter(filterType as any)}
                className="capitalize"
              >
                {filterType}
              </Button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-all border-white/5 hover:border-white/10 group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{service.name}</CardTitle>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </div>
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
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {service.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium">{service.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Price:</span>
                    <span className="font-medium">{formatPrice(service.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Duration:</span>
                    <span className="font-medium">{service.duration} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bookings:</span>
                    <span className="font-medium">{service.bookings}</span>
                  </div>
                  {service.rating > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating:</span>
                      <span className="font-medium flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        {service.rating}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No services found</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'all' 
                ? "You haven't created any services yet. Get started by adding your first service."
                : `No services with status "${filter}" found.`
              }
            </p>
            {filter === 'all' && (
              <Button 
                onClick={() => router.push('/dashboard/vendor/services/create')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Service
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}