"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Eye, Edit, Trash2, CheckCircle, XCircle, AlertCircle, Building2, Star, Users, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  category: string
  location: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  isVerified: boolean
  rating: number
  totalBookings: number
  totalRevenue: number
  joinedDate: string
  lastActive: string
  services: string[]
  documents: string[]
}

export default function AdminVendorsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'suspended'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'admin') {
      router.push('/unauthorized')
      return
    }

    // Mock data - replace with actual API call
    setVendors([
      {
        id: '1',
        name: 'Elegant Photography Studio',
        email: 'info@elegantphoto.com',
        phone: '+94 77 123 4567',
        category: 'Photography',
        location: 'Colombo',
        status: 'approved',
        isVerified: true,
        rating: 4.8,
        totalBookings: 45,
        totalRevenue: 2500000,
        joinedDate: '2023-06-15',
        lastActive: '2024-02-10',
        services: ['Wedding Photography', 'Engagement Photos', 'Portrait Sessions'],
        documents: ['Business License', 'Insurance Certificate', 'Portfolio']
      },
      {
        id: '2',
        name: 'Dream Wedding Venues',
        email: 'contact@dreamvenues.com',
        phone: '+94 77 234 5678',
        category: 'Venue',
        location: 'Kandy',
        status: 'pending',
        isVerified: false,
        rating: 0,
        totalBookings: 0,
        totalRevenue: 0,
        joinedDate: '2024-01-20',
        lastActive: '2024-02-08',
        services: ['Wedding Venues', 'Reception Halls', 'Garden Venues'],
        documents: ['Business License', 'Property Deed']
      },
      {
        id: '3',
        name: 'Gourmet Catering Co.',
        email: 'orders@gourmetcatering.com',
        phone: '+94 77 345 6789',
        category: 'Catering',
        location: 'Galle',
        status: 'approved',
        isVerified: true,
        rating: 4.6,
        totalBookings: 32,
        totalRevenue: 1800000,
        joinedDate: '2023-08-10',
        lastActive: '2024-02-12',
        services: ['Wedding Catering', 'Corporate Events', 'Private Parties'],
        documents: ['Business License', 'Food Safety Certificate', 'Menu Samples']
      },
      {
        id: '4',
        name: 'Floral Dreams',
        email: 'hello@floraldreams.com',
        phone: '+94 77 456 7890',
        category: 'Florist',
        location: 'Negombo',
        status: 'suspended',
        isVerified: true,
        rating: 3.2,
        totalBookings: 8,
        totalRevenue: 450000,
        joinedDate: '2023-12-01',
        lastActive: '2024-01-15',
        services: ['Wedding Flowers', 'Bridal Bouquets', 'Centerpieces'],
        documents: ['Business License', 'Supplier Certificates']
      }
    ])
    setLoading(false)
  }, [session, status, router])

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'suspended': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'suspended': return <AlertCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleVendorAction = (vendorId: string, action: string) => {
    console.log(`Performing ${action} on vendor ${vendorId}`)
    // Implement actual vendor actions here
  }

  const categories = [...new Set(vendors.map(vendor => vendor.category))]

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendor Management</h1>
          <p className="text-gray-600">Manage vendor registrations, approvals, and performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                  <p className="text-2xl font-bold text-gray-900">{vendors.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vendors.filter(vendor => vendor.status === 'approved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {vendors.filter(vendor => vendor.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatPrice(vendors.reduce((sum, vendor) => sum + vendor.totalRevenue, 0))}
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search vendors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="suspended">Suspended</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Vendors ({filteredVendors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Vendor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Verified</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Joined</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVendors.map((vendor) => (
                    <tr key={vendor.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.email}</div>
                          <div className="text-sm text-gray-500">{vendor.location}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary">{vendor.category}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className={`p-1 rounded-full mr-2 ${getStatusColor(vendor.status).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                            {getStatusIcon(vendor.status)}
                          </div>
                          <Badge className={getStatusColor(vendor.status)}>
                            {vendor.status}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={vendor.isVerified ? 'default' : 'secondary'}>
                          {vendor.isVerified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="flex items-center mb-1">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            {vendor.rating > 0 ? vendor.rating.toFixed(1) : 'N/A'}
                          </div>
                          <div>{vendor.totalBookings} bookings</div>
                          <div className="text-gray-500">{formatPrice(vendor.totalRevenue)}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm text-gray-500">
                          {new Date(vendor.joinedDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          {vendor.status === 'pending' && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-green-600 hover:text-green-700"
                                onClick={() => handleVendorAction(vendor.id, 'approve')}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleVendorAction(vendor.id, 'reject')}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredVendors.length === 0 && (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                    ? "Try adjusting your search criteria or filters."
                    : "No vendors have been registered yet."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}