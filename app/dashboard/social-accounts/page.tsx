import { Suspense } from 'react';
import { getServerSession } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';
import SocialAccountsManager from '@/components/auth/social-accounts-manager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default async function SocialAccountsPage() {
  let session: any = null;
  
  // Skip authentication during build
  if (process.env.NODE_ENV === 'production' && process.env.SKIP_AUTH === 'true') {
    // Continue without authentication during build
    session = { user: { name: 'Build User', email: 'build@example.com', role: 'user', provider: 'credentials', isVerified: true, isActive: true } };
  } else {
    session = await getServerSession();
    
    if (!session) {
      redirect('/auth/signin');
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900">Social Accounts</h1>
          <p className="text-gray-600 mt-2">
            Manage your linked social accounts and authentication methods
          </p>
        </div>

        {/* User Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your current account details and authentication status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Name</label>
                <p className="text-lg">{session.user?.name || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-lg">{session.user?.email || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Role</label>
                <p className="text-lg capitalize">{session.user?.role || 'user'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Provider</label>
                <p className="text-lg capitalize">{session.user?.provider || 'credentials'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Verified</label>
                <p className="text-lg">
                  {session.user?.isVerified ? (
                    <span className="text-green-600">✓ Verified</span>
                  ) : (
                    <span className="text-yellow-600">⚠ Not Verified</span>
                  )}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p className="text-lg">
                  {session.user?.isActive ? (
                    <span className="text-green-600">✓ Active</span>
                  ) : (
                    <span className="text-red-600">✗ Inactive</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Accounts Manager */}
        <Suspense fallback={
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <FaSpinner className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading social accounts...</span>
            </CardContent>
          </Card>
        }>
          <SocialAccountsManager />
        </Suspense>

        {/* Help Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Common questions about social account management
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">How do I link a social account?</h4>
              <p className="text-sm text-gray-600">
                Go to the sign-in page and click on the social provider you want to link. 
                If you're already signed in, the account will be automatically linked.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Can I unlink all social accounts?</h4>
              <p className="text-sm text-gray-600">
                You can only unlink social accounts if you have a password set or other social accounts linked. 
                This ensures you always have a way to sign in to your account.
              </p>
            </div>
            <div>
              <h4 className="font-medium">What if I can't access my social account?</h4>
              <p className="text-sm text-gray-600">
                If you can't access your social account, make sure you have a password set. 
                You can then sign in using your email and password instead.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
