"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Star, TrendingUp, Crown, Target } from 'lucide-react'

const boostPackages = [
  {
    id: 'basic',
    name: 'Basic Boost',
    price: 1000,
    currency: 'LKR',
    duration: '7 days',
    features: [
      'Enhanced visibility in search results',
      'Basic targeting options',
      'Performance tracking',
      'Email support'
    ],
    icon: Zap,
    color: 'from-blue-500 to-blue-600',
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium Boost',
    price: 2500,
    currency: 'LKR',
    duration: '14 days',
    features: [
      'Priority placement in search results',
      'Advanced targeting options',
      'Detailed analytics dashboard',
      'Priority customer support',
      'Social media promotion'
    ],
    icon: Star,
    color: 'from-purple-500 to-purple-600',
    popular: true
  },
  {
    id: 'featured',
    name: 'Featured Boost',
    price: 5000,
    currency: 'LKR',
    duration: '30 days',
    features: [
      'Top placement in search results',
      'Premium targeting options',
      'Full analytics suite',
      'Dedicated account manager',
      'Social media campaigns',
      'Email marketing inclusion'
    ],
    icon: TrendingUp,
    color: 'from-green-500 to-green-600',
    popular: false
  },
  {
    id: 'trending',
    name: 'Trending Boost',
    price: 10000,
    currency: 'LKR',
    duration: '60 days',
    features: [
      'Maximum visibility & priority',
      'Advanced AI-powered targeting',
      'Comprehensive analytics',
      'Personal account manager',
      'Multi-channel marketing',
      'Featured in newsletters',
      'Exclusive promotional events'
    ],
    icon: Crown,
    color: 'from-orange-500 to-red-600',
    popular: false
  }
]

interface BoostPricingProps {
  onSelectPackage: (packageId: string) => void
  selectedVenue?: string
}

export default function BoostPricing({ onSelectPackage, selectedVenue }: BoostPricingProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Choose Your Boost Package</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select the perfect boost package to increase your venue's visibility and reach more couples planning their dream wedding.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {boostPackages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`relative transition-all duration-300 hover:shadow-lg ${
              pkg.popular ? 'ring-2 ring-purple-500 scale-105' : ''
            }`}
          >
            {pkg.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                Most Popular
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center`}>
                <pkg.icon className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-xl">{pkg.name}</CardTitle>
              <div className="text-3xl font-bold text-gray-900">
                {pkg.currency} {pkg.price.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">per {pkg.duration}</div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full bg-gradient-to-r ${pkg.color} hover:opacity-90 transition-opacity`}
                onClick={() => onSelectPackage(pkg.id)}
                disabled={!selectedVenue}
              >
                {selectedVenue ? 'Select Package' : 'Select Venue First'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Information */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">How Boost Campaigns Work</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium mb-2">Targeted Reach</h4>
            <p className="text-sm text-gray-600">
              Your venue appears to couples matching your target criteria
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-medium mb-2">Performance Tracking</h4>
            <p className="text-sm text-gray-600">
              Monitor impressions, clicks, and conversions in real-time
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-medium mb-2">Instant Results</h4>
            <p className="text-sm text-gray-600">
              Campaigns start working immediately after approval
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
        
        <div className="space-y-3">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">How long does it take for a boost campaign to start working?</h4>
            <p className="text-sm text-gray-600">
              Boost campaigns typically start working within 1-2 hours after approval. You'll see immediate improvements in visibility and search rankings.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">Can I pause or modify my boost campaign?</h4>
            <p className="text-sm text-gray-600">
              Yes! You can pause, resume, or modify your boost campaign at any time through your dashboard. Changes take effect immediately.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">What targeting options are available?</h4>
            <p className="text-sm text-gray-600">
              You can target by location, guest count, event type, price range, season, and more. Advanced packages offer more sophisticated targeting options.
            </p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">How do you measure the success of a boost campaign?</h4>
            <p className="text-sm text-gray-600">
              We track impressions, clicks, views, inquiries, and bookings. You'll get detailed analytics showing your campaign's performance and ROI.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 