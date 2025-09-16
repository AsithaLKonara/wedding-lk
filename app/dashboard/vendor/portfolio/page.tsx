"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Upload, Edit, Trash2, Eye, Heart, Download, Share2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: 'wedding' | 'engagement' | 'portrait' | 'event'
  images: string[]
  tags: string[]
  featured: boolean
  views: number
  likes: number
  createdAt: string
  updatedAt: string
}

export default function VendorPortfolioPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'wedding' | 'engagement' | 'portrait' | 'event'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'vendor') {
      router.push('/unauthorized')
      return
    }

    // Mock data - replace with actual API call
    setPortfolioItems([
      {
        id: '1',
        title: 'Elegant Garden Wedding',
        description: 'A beautiful outdoor wedding ceremony with natural lighting and floral arrangements.',
        category: 'wedding',
        images: ['/images/portfolio/wedding-1.jpg', '/images/portfolio/wedding-2.jpg'],
        tags: ['outdoor', 'garden', 'natural', 'elegant'],
        featured: true,
        views: 1250,
        likes: 89,
        createdAt: '2024-01-15',
        updatedAt: '2024-01-20'
      },
      {
        id: '2',
        title: 'Romantic Engagement Session',
        description: 'Intimate engagement photoshoot at sunset with golden hour lighting.',
        category: 'engagement',
        images: ['/images/portfolio/engagement-1.jpg'],
        tags: ['sunset', 'romantic', 'golden hour', 'intimate'],
        featured: false,
        views: 890,
        likes: 67,
        createdAt: '2024-01-10',
        updatedAt: '2024-01-12'
      },
      {
        id: '3',
        title: 'Modern City Wedding',
        description: 'Contemporary wedding in an urban setting with industrial architecture.',
        category: 'wedding',
        images: ['/images/portfolio/city-1.jpg', '/images/portfolio/city-2.jpg', '/images/portfolio/city-3.jpg'],
        tags: ['modern', 'urban', 'industrial', 'contemporary'],
        featured: true,
        views: 2100,
        likes: 156,
        createdAt: '2024-01-05',
        updatedAt: '2024-01-08'
      }
    ])
    setLoading(false)
  }, [session, status, router])

  const filteredItems = portfolioItems.filter(item => {
    if (filter === 'all') return true
    return item.category === filter
  })

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wedding': return 'bg-pink-100 text-pink-800'
      case 'engagement': return 'bg-purple-100 text-purple-800'
      case 'portrait': return 'bg-blue-100 text-blue-800'
      case 'event': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Management</h1>
              <p className="text-gray-600">Showcase your work and attract more clients</p>
            </div>
            <div className="flex space-x-3">
              <Button 
                onClick={() => router.push('/dashboard/vendor/portfolio/upload')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Work
              </Button>
              <Button 
                onClick={() => router.push('/dashboard/vendor/portfolio/create')}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ImageIcon className="w-8 h-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{portfolioItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {portfolioItems.reduce((sum, item) => sum + item.views, 0).toLocaleString()}
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
                  <p className="text-sm font-medium text-gray-600">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {portfolioItems.reduce((sum, item) => sum + item.likes, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Share2 className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Featured Projects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {portfolioItems.filter(item => item.featured).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and View Controls */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex space-x-2">
            {['all', 'wedding', 'engagement', 'portrait', 'event'].map((filterType) => (
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

        {/* Portfolio Items */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-t-lg flex items-center justify-center">
                    <ImageIcon className="w-16 h-16 text-purple-400" />
                  </div>
                  {item.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500 text-white">
                      Featured
                    </Badge>
                  )}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                    <Badge className={getCategoryColor(item.category)}>
                      {item.category}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{item.tags.length - 3} more</span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {item.views}
                      </div>
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {item.likes}
                      </div>
                    </div>
                    <div className="text-xs">
                      {new Date(item.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-8 h-8 text-purple-400" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.featured && (
                            <Badge className="bg-yellow-500 text-white">Featured</Badge>
                          )}
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {item.views} views
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {item.likes} likes
                          </div>
                          <div className="text-xs">
                            Updated {new Date(item.updatedAt).toLocaleDateString()}
                          </div>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't added any work to your portfolio yet. Start showcasing your talent!"
                : `No ${filter} projects found.`
              }
            </p>
            {filter === 'all' && (
              <Button 
                onClick={() => router.push('/dashboard/vendor/portfolio/upload')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Your First Work
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
