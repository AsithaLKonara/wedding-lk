'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function ResetDatabasePage() {
  const [adminKey, setAdminKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleResetDatabase = async () => {
    if (!adminKey) {
      setError('Please enter admin key');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/admin/reset-database?adminKey=${adminKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.message || 'Database reset failed');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <Database className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Reset</h1>
          <p className="text-gray-600">
            Reset the entire database and create comprehensive seed data
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-red-600">⚠️ Warning</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>This action will:</strong>
                <ul className="mt-2 list-disc list-inside">
                  <li>Delete ALL existing data in the database</li>
                  <li>Clear all 48 collections</li>
                  <li>Create new seed data with 5 users, 5 vendors, 5 planners, and 5 admins</li>
                  <li>Generate related data for all collections</li>
                </ul>
                <p className="mt-2 font-semibold">This action cannot be undone!</p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Reset Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="adminKey">Admin Key</Label>
              <Input
                id="adminKey"
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Enter admin key to proceed"
                className="mt-1"
              />
            </div>

            <Button
              onClick={handleResetDatabase}
              disabled={isLoading || !adminKey}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting Database...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Reset Database & Create Seed Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card className="mt-6 border-red-200">
            <CardContent className="pt-6">
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="mt-6 border-green-200">
            <CardContent className="pt-6">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Database Reset Successful!</strong>
                  <div className="mt-2">
                    <p>✅ {result.data.users} Regular Users created</p>
                    <p>✅ {result.data.vendors} Vendors created</p>
                    <p>✅ {result.data.weddingPlanners} Wedding Planners created</p>
                    <p>✅ {result.data.admins} Admins created</p>
                    <p>✅ All {result.data.totalCollections} collections populated</p>
                  </div>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>What Will Be Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Users (5)</h4>
                <ul className="list-disc list-inside text-gray-600">
                  <li>John Doe (Colombo)</li>
                  <li>Jane Smith (Kandy)</li>
                  <li>Mike Wilson (Galle)</li>
                  <li>Sarah Brown (Negombo)</li>
                  <li>David Jones (Anuradhapura)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Vendors (5)</h4>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Elegant Events by Sarah</li>
                  <li>Royal Photography Studio</li>
                  <li>Garden Fresh Catering</li>
                  <li>Bloom & Blossom Florist</li>
                  <li>Melody Music Ensemble</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Planners (5)</h4>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Dream Weddings by Emma</li>
                  <li>Perfect Day Events</li>
                  <li>Bliss Events & Planning</li>
                  <li>Elegance Planning Studio</li>
                  <li>Harmony Events & Design</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Admins (5)</h4>
                <ul className="list-disc list-inside text-gray-600">
                  <li>System Administrator</li>
                  <li>Support Admin</li>
                  <li>Content Moderator</li>
                  <li>Finance Admin</li>
                  <li>Analytics Admin</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
