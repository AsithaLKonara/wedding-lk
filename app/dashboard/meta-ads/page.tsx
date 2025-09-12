'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MetaAdsDashboard from '@/components/organisms/meta-ads-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function MetaAdsPage() {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [vendorId, setVendorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.id) {
      router.push('/login');
      return;
    }

    // Fetch vendor ID for the current user
    const fetchVendorId = async () => {
      try {
        const response = await fetch('/api/vendors/my-vendor');
        if (response.ok) {
          const data = await response.json();
          if (data.vendor) {
            setVendorId(data.vendor._id);
          }
        }
      } catch (error) {
        console.error('Error fetching vendor ID:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorId();
  }, [session, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!vendorId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Meta Ads</h1>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Vendor Account Required</h2>
              <p className="text-muted-foreground mb-6">
                You need to have a vendor account to access Meta Ads features.
              </p>
              <Button onClick={() => router.push('/dashboard/vendor-setup')}>
                Set Up Vendor Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Meta Ads Dashboard</h1>
      </div>

      {/* Meta Ads Help Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Getting Started with Meta Ads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Promote your wedding packages to reach more couples planning their special day. 
              Meta Ads allows you to target specific demographics and interests to maximize your reach.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Connect Account</h4>
                <p className="text-sm text-muted-foreground">
                  Link your Meta Ads account to start creating campaigns
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">2. Create Campaign</h4>
                <p className="text-sm text-muted-foreground">
                  Set up targeted campaigns for your wedding packages
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">3. Track Performance</h4>
                <p className="text-sm text-muted-foreground">
                  Monitor your ad performance and optimize for better results
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Meta Ads Help Center
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                WeddingLK Advertising Guide
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meta Ads Dashboard */}
      <MetaAdsDashboard vendorId={vendorId} />
    </div>
  );
}
