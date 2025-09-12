'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, TrendingUp, Eye, Users, Clock, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BoostPackage {
  id: string;
  name: string;
  description: string;
  type: 'featured' | 'premium' | 'sponsored';
  price: number;
  durationDays: number;
  features: string[];
  isPopular?: boolean;
  isActive: boolean;
}

export default function BoostsPage() {
  const [packages, setPackages] = useState<BoostPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<BoostPackage | null>(null);

  useEffect(() => {
    fetchBoostPackages();
  }, []);

  const fetchBoostPackages = async () => {
    try {
      const response = await fetch('/api/boosts/packages');
      if (response.ok) {
        const data = await response.json();
        setPackages(data.packages || []);
      }
    } catch (error) {
      console.error('Error fetching boost packages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load boost packages.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (pkg: BoostPackage) => {
    setSelectedPackage(pkg);
    // TODO: Implement purchase flow
    toast({
      title: 'Purchase Boost',
      description: `Redirecting to purchase ${pkg.name}...`,
    });
  };

  const getPackageIcon = (type: string) => {
    switch (type) {
      case 'featured':
        return <Star className="h-6 w-6 text-yellow-500" />;
      case 'premium':
        return <TrendingUp className="h-6 w-6 text-purple-500" />;
      case 'sponsored':
        return <Zap className="h-6 w-6 text-blue-500" />;
      default:
        return <Star className="h-6 w-6 text-gray-500" />;
    }
  };

  const getPackageColor = (type: string) => {
    switch (type) {
      case 'featured':
        return 'border-yellow-200 bg-yellow-50';
      case 'premium':
        return 'border-purple-200 bg-purple-50';
      case 'sponsored':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Boost Your Wedding Business
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Increase your visibility and get more bookings with our premium boost packages. 
            Reach more couples planning their special day.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <Eye className="h-8 w-8 text-blue-600" />
                <h3 className="text-lg font-semibold">Increased Visibility</h3>
              </div>
              <p className="text-gray-600">
                Get featured in search results and appear at the top of relevant categories.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="h-8 w-8 text-green-600" />
                <h3 className="text-lg font-semibold">More Bookings</h3>
              </div>
              <p className="text-gray-600">
                Reach more potential clients and increase your booking conversion rate.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3 mb-3">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <h3 className="text-lg font-semibold">Grow Your Business</h3>
              </div>
              <p className="text-gray-600">
                Build your reputation and grow your wedding business with premium placement.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Boost Packages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id} 
              className={`relative ${getPackageColor(pkg.type)} ${
                pkg.isPopular ? 'ring-2 ring-blue-500 scale-105' : ''
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {getPackageIcon(pkg.type)}
                </div>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription className="text-gray-600">
                  {pkg.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    LKR {pkg.price.toLocaleString()}
                  </span>
                  <span className="text-gray-600 ml-2">
                    / {pkg.durationDays} days
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">What's Included:</h4>
                  <ul className="space-y-2">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {pkg.durationDays} days</span>
                </div>

                <Button
                  onClick={() => handlePurchase(pkg)}
                  className="w-full"
                  size="lg"
                  disabled={!pkg.isActive}
                >
                  {pkg.isActive ? 'Purchase Boost' : 'Coming Soon'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does boosting work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  When you purchase a boost package, your business gets featured prominently 
                  in search results and category listings for the duration of your boost.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I cancel my boost?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Boost packages are non-refundable once activated. However, you can 
                  contact support for special circumstances.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How long does it take to activate?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your boost will be activated within 24 hours of successful payment. 
                  You'll receive an email confirmation once it's live.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I upgrade my boost?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, you can upgrade to a higher tier boost package at any time. 
                  The remaining time from your current boost will be prorated.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}



