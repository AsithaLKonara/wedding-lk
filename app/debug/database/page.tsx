"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Database, Users, MapPin, Package, Star, CheckCircle, XCircle } from 'lucide-react'

interface DatabaseStatus {
  connected: boolean
  uri: string | null
  models: string[]
  sampleData: {
    packages: any[]
    venues: any[]
    vendors: any[]
  }
}

export default function DatabaseDebugPage() {
  const [status, setStatus] = useState<DatabaseStatus>({
    connected: false,
    uri: null,
    models: [],
    sampleData: {
      packages: [],
      venues: [],
      vendors: []
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkDatabaseStatus()
  }, [])

  const checkDatabaseStatus = async () => {
    try {
      // Check if MONGODB_URI is configured
      const hasUri = process.env.NEXT_PUBLIC_MONGODB_URI || 'Not configured'
      
      // Get sample data
      const packagesResponse = await fetch('/api/packages')
      const packages = packagesResponse.ok ? await packagesResponse.json() : []
      
      const chatbotResponse = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'show me venues' })
      })
      const chatbotData = chatbotResponse.ok ? await chatbotResponse.json() : { response: { data: [] } }
      
      setStatus({
        connected: hasUri !== 'Not configured',
        uri: hasUri,
        models: ['User', 'Venue', 'Vendor', 'Package', 'Booking', 'Review', 'Message', 'ChatRoom', 'Notification', 'Task', 'Service'],
        sampleData: {
          packages: packages.slice(0, 3),
          venues: chatbotData.response?.data?.slice(0, 3) || [],
          vendors: []
        }
      })
    } catch (error) {
      console.error('Database check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const testDatabaseConnection = async () => {
    try {
      const response = await fetch('/api/debug/database-test')
      const result = await response.json()
      alert(`Database test: ${result.success ? 'SUCCESS' : 'FAILED'}\n${result.message}`)
    } catch (error) {
      alert(`Database test failed: ${error}`)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="h-8 w-8 text-rose-500" />
        <h1 className="text-3xl font-bold">Database Status</h1>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status.connected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            Connection Status
          </CardTitle>
          <CardDescription>
            {status.connected ? 'Database is configured' : 'Using sample data mode'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>Status:</strong> 
              <Badge variant={status.connected ? "default" : "secondary"} className="ml-2">
                {status.connected ? 'Connected' : 'Sample Data Mode'}
              </Badge>
            </p>
            <p><strong>URI:</strong> {status.uri}</p>
            <Button onClick={testDatabaseConnection} className="mt-2">
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Database Models */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Database Models
          </CardTitle>
          <CardDescription>
            Available data models in your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {status.models.map((model) => (
              <Badge key={model} variant="outline" className="p-2">
                {model}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sample Data Preview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Packages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-purple-500" />
              Sample Packages
            </CardTitle>
            <CardDescription>
              {status.sampleData.packages.length} packages available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {status.sampleData.packages.map((pkg, index) => (
                <div key={index} className="p-2 border rounded">
                  <p className="font-medium">{pkg.name}</p>
                  <p className="text-sm text-gray-600">LKR {pkg.price?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{pkg.category}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Venues */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              Sample Venues
            </CardTitle>
            <CardDescription>
              {status.sampleData.venues.length} venues available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {status.sampleData.venues.map((venue, index) => (
                <div key={index} className="p-2 border rounded">
                  <p className="font-medium">{venue.name}</p>
                  <p className="text-sm text-gray-600">{venue.location}</p>
                  <p className="text-xs text-gray-500">Capacity: {venue.capacity}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vendors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Sample Vendors
            </CardTitle>
            <CardDescription>
              {status.sampleData.vendors.length} vendors available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {status.sampleData.vendors.length > 0 ? (
                status.sampleData.vendors.map((vendor, index) => (
                  <div key={index} className="p-2 border rounded">
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-sm text-gray-600">{vendor.category}</p>
                    <p className="text-xs text-gray-500">Rating: {vendor.rating}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No vendor data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Database Setup Instructions</CardTitle>
          <CardDescription>
            How to connect to a real database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">1. Create MongoDB Atlas Account</h4>
              <p className="text-sm text-gray-600">
                Go to <a href="https://www.mongodb.com/atlas" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">MongoDB Atlas</a> and create a free account
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">2. Create .env.local file</h4>
              <pre className="bg-gray-100 p-2 rounded text-sm">
{`MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weddinglk
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium mb-2">3. Restart Development Server</h4>
              <p className="text-sm text-gray-600">
                Run <code className="bg-gray-100 px-1 rounded">npm run dev</code> to apply changes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
