'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  DollarSign,
  Target,
  Calendar,
  Settings,
  BarChart3,
  Users,
  MapPin,
  Heart
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MetaAdsCampaign {
  _id: string;
  name: string;
  objective: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'DRAFT';
  budget: number;
  dailyBudget?: number;
  lifetimeBudget?: number;
  startTime: string;
  endTime?: string;
  targeting: {
    ageMin: number;
    ageMax: number;
    genders: number[];
    geoLocations: {
      countries: string[];
      regions?: string[];
      cities?: string[];
    };
    interests: string[];
    behaviors: string[];
    demographics: string[];
  };
  metrics: {
    impressions: number;
    clicks: number;
    spend: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpm: number;
    roas: number;
    lastUpdated: string;
  };
  packageId?: {
    _id: string;
    name: string;
    price: number;
    category: string;
  };
}

interface MetaAdsAccount {
  id: string;
  metaAccountId: string;
  accountName: string;
  currency: string;
  timezone: string;
  isActive: boolean;
  lastSyncAt?: string;
}

interface MetaAdsDashboardProps {
  vendorId: string;
}

export default function MetaAdsDashboard({ vendorId }: MetaAdsDashboardProps) {
  const [campaigns, setCampaigns] = useState<MetaAdsCampaign[]>([]);
  const [account, setAccount] = useState<MetaAdsAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<MetaAdsCampaign | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    objective: 'CONVERSIONS',
    budget: 0,
    dailyBudget: 0,
    lifetimeBudget: 0,
    startTime: '',
    endTime: '',
    packageId: '',
    targeting: {
      ageMin: 25,
      ageMax: 45,
      genders: [1, 2],
      geoLocations: {
        countries: ['LK'],
        regions: [],
        cities: []
      },
      interests: [],
      behaviors: [],
      demographics: []
    }
  });

  useEffect(() => {
    fetchData();
  }, [vendorId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [campaignsRes, accountRes] = await Promise.all([
        fetch(`/api/meta-ads/campaigns?vendorId=${vendorId}`),
        fetch(`/api/meta-ads/connect?vendorId=${vendorId}`)
      ]);

      if (campaignsRes.ok) {
        const campaignsData = await campaignsRes.json();
        setCampaigns(campaignsData.campaigns || []);
      }

      if (accountRes.ok) {
        const accountData = await accountRes.json();
        setAccount(accountData.account);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch Meta Ads data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/meta-ads/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vendorId,
          ...formData
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Campaign created successfully'
        });
        setShowCreateForm(false);
        setFormData({
          name: '',
          objective: 'CONVERSIONS',
          budget: 0,
          dailyBudget: 0,
          lifetimeBudget: 0,
          startTime: '',
          endTime: '',
          packageId: '',
          targeting: {
            ageMin: 25,
            ageMax: 45,
            genders: [1, 2],
            geoLocations: {
              countries: ['LK'],
              regions: [],
              cities: []
            },
            interests: [],
            behaviors: [],
            demographics: []
          }
        });
        fetchData();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to create campaign',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to create campaign',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateCampaignStatus = async (campaignId: string, status: string) => {
    try {
      const response = await fetch(`/api/meta-ads/campaigns/${campaignId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Campaign ${status.toLowerCase()} successfully`
        });
        fetchData();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to update campaign',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast({
        title: 'Error',
        description: 'Failed to update campaign',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'DELETED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'LKR') => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Meta Ads Dashboard</h2>
          <p className="text-muted-foreground">Manage your Meta advertising campaigns</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {/* Account Status */}
      {account ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Meta Ads Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{account.accountName}</p>
                <p className="text-sm text-muted-foreground">
                  Account ID: {account.metaAccountId}
                </p>
                <p className="text-sm text-muted-foreground">
                  Currency: {account.currency} | Timezone: {account.timezone}
                </p>
              </div>
              <Badge className={account.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                {account.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Connect Meta Ads Account</h3>
              <p className="text-muted-foreground mb-4">
                Connect your Meta Ads account to start promoting your packages
              </p>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Connect Account
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Campaigns */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Campaigns Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first Meta Ads campaign to promote your packages
                  </p>
                  <Button onClick={() => setShowCreateForm(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign._id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {campaign.name}
                          <Badge className={getStatusColor(campaign.status)}>
                            {campaign.status}
                          </Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {campaign.objective} • {formatCurrency(campaign.budget, account?.currency)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {campaign.status === 'ACTIVE' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateCampaignStatus(campaign._id, 'PAUSED')}
                          >
                            <Pause className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUpdateCampaignStatus(campaign._id, 'ACTIVE')}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateCampaignStatus(campaign._id, 'DELETED')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Eye className="w-4 h-4 text-blue-500 mr-1" />
                          <span className="text-sm font-medium">Impressions</span>
                        </div>
                        <p className="text-lg font-bold">{campaign.metrics.impressions.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <MousePointer className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-sm font-medium">Clicks</span>
                        </div>
                        <p className="text-lg font-bold">{campaign.metrics.clicks.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <DollarSign className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">Spend</span>
                        </div>
                        <p className="text-lg font-bold">{formatCurrency(campaign.metrics.spend, account?.currency)}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <TrendingUp className="w-4 h-4 text-purple-500 mr-1" />
                          <span className="text-sm font-medium">CTR</span>
                        </div>
                        <p className="text-lg font-bold">{campaign.metrics.ctr.toFixed(2)}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Campaign Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed analytics and performance insights will be available here
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Access Token</Label>
                  <Input placeholder="Enter your Meta Ads access token" />
                </div>
                <Button>Update Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Campaign Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create Meta Ads Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="objective">Objective</Label>
                  <Select
                    value={formData.objective}
                    onValueChange={(value) => setFormData({ ...formData, objective: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONVERSIONS">Conversions</SelectItem>
                      <SelectItem value="TRAFFIC">Traffic</SelectItem>
                      <SelectItem value="REACH">Reach</SelectItem>
                      <SelectItem value="BRAND_AWARENESS">Brand Awareness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Total Budget</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dailyBudget">Daily Budget</Label>
                    <Input
                      id="dailyBudget"
                      type="number"
                      value={formData.dailyBudget}
                      onChange={(e) => setFormData({ ...formData, dailyBudget: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Date</Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Date</Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Create Campaign
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
