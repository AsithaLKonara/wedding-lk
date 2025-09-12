import { Suspense } from 'react';
import SocialLoginButtons from '@/components/auth/social-login-buttons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FaSpinner } from 'react-icons/fa';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">WeddingLK</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your complete wedding planning platform
          </p>
        </div>

        <Suspense fallback={
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <FaSpinner className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading...</span>
            </CardContent>
          </Card>
        }>
          <SocialLoginButtons />
        </Suspense>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up here
            </Link>
          </p>
        </div>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-50 px-2 text-gray-500">
                Development Info
              </span>
            </div>
          </div>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">OAuth Status</CardTitle>
              <CardDescription>
                Current OAuth provider configuration status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Google OAuth:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  process.env.GOOGLE_CLIENT_ID ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Not Configured'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Facebook OAuth:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  process.env.FACEBOOK_CLIENT_ID ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {process.env.FACEBOOK_CLIENT_ID ? 'Configured' : 'Not Configured'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>NextAuth Secret:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  process.env.NEXTAUTH_SECRET ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {process.env.NEXTAUTH_SECRET ? 'Configured' : 'Not Configured'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
