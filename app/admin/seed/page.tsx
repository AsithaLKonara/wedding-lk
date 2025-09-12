'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export default function SeedDatabasePage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSeedDatabase = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'seed' }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `Database seeded successfully! Created ${data.data.vendors.length} vendors, ${data.data.venues.length} venues, ${data.data.testimonials.length} testimonials, ${data.data.packages.length} packages, and ${data.data.users.length} users.`
        });
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to seed database'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error occurred while seeding database'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'clear' }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: 'Database cleared successfully!'
        });
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to clear database'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error occurred while clearing database'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Management</h1>
            <p className="text-gray-600">
              Seed the database with sample data or clear all existing data
            </p>
          </div>

          {message && (
            <Alert className={`mb-6 ${message.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  Seed Database
                </CardTitle>
                <CardDescription>
                  Populate the database with sample vendors, venues, testimonials, and packages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">This will create:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>6 Featured Vendors (Event Planning, Photography, Floral Design, Catering, Entertainment, Beauty)</li>
                      <li>3 Featured Venues (Colombo, Kandy, Galle)</li>
                      <li>6 Customer Testimonials</li>
                      <li>3 Wedding Packages</li>
                      <li>3 Sample Users (including admin)</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={handleSeedDatabase} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Seeding...' : 'Seed Database'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  Clear Database
                </CardTitle>
                <CardDescription>
                  Remove all existing data from the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">This will delete:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>All Vendors</li>
                      <li>All Venues</li>
                      <li>All Testimonials</li>
                      <li>All Packages</li>
                      <li>All Users</li>
                    </ul>
                  </div>
                  <Button 
                    onClick={handleClearDatabase} 
                    disabled={loading}
                    variant="destructive"
                    className="w-full"
                  >
                    {loading ? 'Clearing...' : 'Clear Database'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Sample Data Preview</CardTitle>
                <CardDescription>
                  Here's what will be created when you seed the database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Featured Vendors:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Elegant Events by Sarah (Event Planning) - Colombo</li>
                      <li>Royal Photography Studio (Photography) - Kandy</li>
                      <li>Blissful Blooms (Floral Design) - Galle</li>
                      <li>Harmony Catering (Catering) - Colombo</li>
                      <li>Melody Music Band (Entertainment) - Negombo</li>
                      <li>Glamour Makeup Studio (Beauty) - Colombo</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Featured Venues:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>The Grand Ballroom - Colombo (50-500 guests)</li>
                      <li>Temple Gardens Resort - Bentota (30-300 guests)</li>
                      <li>Hill Country Manor - Kandy (20-150 guests)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Wedding Packages:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      <li>Colombo Luxury Wedding Package - LKR 2,500,000</li>
                      <li>Kandy Romantic Wedding Package - LKR 1,800,000</li>
                      <li>Galle Beach Wedding Package - LKR 2,200,000</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
