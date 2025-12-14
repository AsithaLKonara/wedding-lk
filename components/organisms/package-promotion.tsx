'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Target, 
  DollarSign, 
  Users, 
  MapPin, 
  Calendar,
  TrendingUp,
  Eye,
  MousePointer,
  Heart,
  Share2,
  Plus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PackagePromotionProps {
  packageData: {
    _id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    images: string[];
    vendor: {
      businessName: string;
      location: string;
    };
  };
  vendorId: string;
}

export default function PackagePromotion({ packageData, vendorId }: PackagePromotionProps) {
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [promotionData, setPromotionData] = useState({
    campaignName: `Promote ${packageData.name}`,
    objective: 'CONVERSIONS',
    budget: 10000,
    dailyBudget: 1000,
    startDate: '',
    endDate: '',
    targeting: {
      ageMin: 25,
      ageMax: 45,
      genders: [1, 2],
      locations: [packageData.vendor.location],
      interests: getDefaultInterests(packageData.category),
      behaviors: ['Wedding Planning', 'Event Planning', 'Online Shoppers']
    },
    creative: {
      title: `Book ${packageData.name} - ${packageData.vendor.businessName}`,
      description: `Professional ${packageData.category.toLowerCase()} services for your special day. Starting from ${packageData.price.toLocaleString()} LKR.`,
      callToAction: 'BOOK_NOW',
      imageUrl: packageData.images[0] || ''
    }
  });

  function getDefaultInterests(category: string): string[] {
    switch (category.toLowerCase()) {
      case 'photography':
        return ['Photography', 'Wedding Photography', 'Portrait Photography', 'Wedding Planning'];
      case 'catering':
        return ['Food', 'Cooking', 'Restaurants', 'Wedding Catering', 'Wedding Planning'];
      case 'venue':
        return ['Wedding Venues', 'Event Planning', 'Wedding Planning', 'Wedding Reception'];
      case 'music':
        return ['Music', 'Wedding Music', 'Live Music', 'DJ', 'Wedding Planning'];
      case 'decoration':
        return ['Wedding Decorations', 'Event Decorations', 'Flower Arrangements', 'Wedding Planning'];
      default:
        return ['Wedding Planning', 'Wedding Services', 'Event Planning'];
    }
  }

  const handleCreatePromotion = async () => {
    try {
      const response = await fetch('/api/meta-ads/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vendorId,
          packageId: packageData._id,
          ...promotionData
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Promotion campaign created successfully!'
        });
        setShowPromotionForm(false);
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.error || 'Failed to create promotion campaign',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error creating promotion:', error);
      toast({
        title: 'Error',
        description: 'Failed to create promotion campaign',
        variant: 'destructive'
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Package Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Promote This Package
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{packageData.name}</h3>
                <p className="text-muted-foreground">{packageData.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">{packageData.category}</Badge>
                  <span className="text-sm text-muted-foreground">
                    by {packageData.vendor.businessName}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  <span className="font-semibold">{formatCurrency(packageData.price)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">{packageData.vendor.location}</span>
                </div>
              </div>

              <Button 
                onClick={() => setShowPromotionForm(true)}
                className="w-full"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Create Promotion Campaign
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Suggested Targeting</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500" />
                    <span>Age: 25-45 years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>Location: {packageData.vendor.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Interests: {getDefaultInterests(packageData.category).join(', ')}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Expected Reach</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <Eye className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                    <div className="font-semibold">5K-15K</div>
                    <div className="text-xs text-muted-foreground">Impressions</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <MousePointer className="w-4 h-4 mx-auto mb-1 text-green-500" />
                    <div className="font-semibold">100-500</div>
                    <div className="text-xs text-muted-foreground">Clicks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotion Form Modal */}
      {showPromotionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Create Promotion Campaign</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleCreatePromotion(); }} className="space-y-4">
                <div>
                  <Label htmlFor="campaignName">Campaign Name</Label>
                  <Input
                    id="campaignName"
                    value={promotionData.campaignName}
                    onChange={(e) => setPromotionData({ ...promotionData, campaignName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="objective">Campaign Objective</Label>
                  <Select
                    value={promotionData.objective}
                    onValueChange={(value) => setPromotionData({ ...promotionData, objective: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONVERSIONS">Conversions (Bookings)</SelectItem>
                      <SelectItem value="TRAFFIC">Traffic to Package Page</SelectItem>
                      <SelectItem value="REACH">Reach More People</SelectItem>
                      <SelectItem value="BRAND_AWARENESS">Brand Awareness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Total Budget (LKR)</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={promotionData.budget}
                      onChange={(e) => setPromotionData({ ...promotionData, budget: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dailyBudget">Daily Budget (LKR)</Label>
                    <Input
                      id="dailyBudget"
                      type="number"
                      value={promotionData.dailyBudget}
                      onChange={(e) => setPromotionData({ ...promotionData, dailyBudget: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={promotionData.startDate}
                      onChange={(e) => setPromotionData({ ...promotionData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={promotionData.endDate}
                      onChange={(e) => setPromotionData({ ...promotionData, endDate: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Ad Title</Label>
                  <Input
                    id="title"
                    value={promotionData.creative.title}
                    onChange={(e) => setPromotionData({ 
                      ...promotionData, 
                      creative: { ...promotionData.creative, title: e.target.value }
                    })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Ad Description</Label>
                  <Textarea
                    id="description"
                    value={promotionData.creative.description}
                    onChange={(e) => setPromotionData({ 
                      ...promotionData, 
                      creative: { ...promotionData.creative, description: e.target.value }
                    })}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="callToAction">Call to Action</Label>
                  <Select
                    value={promotionData.creative.callToAction}
                    onValueChange={(value) => setPromotionData({ 
                      ...promotionData, 
                      creative: { ...promotionData.creative, callToAction: value }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BOOK_NOW">Book Now</SelectItem>
                      <SelectItem value="LEARN_MORE">Learn More</SelectItem>
                      <SelectItem value="SHOP_NOW">Shop Now</SelectItem>
                      <SelectItem value="SIGN_UP">Sign Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPromotionForm(false)}
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
