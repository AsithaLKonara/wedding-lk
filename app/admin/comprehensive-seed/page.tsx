'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, Users, Building2, Heart, CheckCircle, AlertCircle } from 'lucide-react';

export default function ComprehensiveSeedPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleComprehensiveSeed = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/admin/comprehensive-seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Seeding failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Database Seeding
          </h1>
          <p className="text-lg text-gray-600">
            Seed the database with comprehensive test data for all user roles and related collections
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <Database className="w-8 h-8 text-purple-600" />
              <span>Database Seeding</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* What will be created */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-blue-900">5 Regular Users</h3>
                <p className="text-sm text-blue-700">Couples planning weddings</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <Building2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-green-900">5 Vendors</h3>
                <p className="text-sm text-green-700">With business profiles & services</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-purple-900">5 Wedding Planners</h3>
                <p className="text-sm text-purple-700">With professional profiles</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold text-orange-900">2 Admin Users</h3>
                <p className="text-sm text-orange-700">Platform administrators</p>
              </div>
            </div>

            {/* Additional data */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Additional Data Created:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-700">
                <div>• 3 Wedding Venues</div>
                <div>• 3 Service Packages</div>
                <div>• 3 Testimonials</div>
                <div>• 3 Bookings</div>
                <div>• 3 Reviews</div>
                <div>• Vendor Profiles</div>
                <div>• Planner Profiles</div>
                <div>• User Preferences</div>
              </div>
            </div>

            {/* Warning */}
            <Alert>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                <strong>Warning:</strong> This will clear all existing data and replace it with comprehensive test data. 
                This action cannot be undone. Make sure you have backed up any important data.
              </AlertDescription>
            </Alert>

            {/* Action Button */}
            <div className="text-center">
              <Button
                onClick={handleComprehensiveSeed}
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 text-lg font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Seeding Database...
                  </>
                ) : (
                  <>
                    <Database className="w-5 h-5 mr-2" />
                    Start Comprehensive Seeding
                  </>
                )}
              </Button>
            </div>

            {/* Results */}
            {result && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Success!</strong> Comprehensive database seeding completed successfully.
                  <div className="mt-2 text-sm">
                    Created: {result.data.totalUsers} total users ({result.data.vendors} vendors, {result.data.planners} planners, {result.data.admins} admins)
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Error */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  <strong>Error:</strong> {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Test Credentials */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Test Credentials:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Regular Users:</strong>
                  <div>Email: john.sarah@email.com</div>
                  <div>Password: password123</div>
                </div>
                <div>
                  <strong>Vendors:</strong>
                  <div>Email: photographer@perfectmoments.com</div>
                  <div>Password: password123</div>
                </div>
                <div>
                  <strong>Wedding Planners:</strong>
                  <div>Email: sarah@weddingplanner.com</div>
                  <div>Password: password123</div>
                </div>
                <div>
                  <strong>Admins:</strong>
                  <div>Email: admin@weddinglk.com</div>
                  <div>Password: admin123</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
