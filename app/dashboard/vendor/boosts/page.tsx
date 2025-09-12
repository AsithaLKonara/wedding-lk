'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  TrendingUp, 
  Plus, 
  Eye, 
  Calendar, 
  DollarSign, 
  Star, 
  Zap, 
  CheckCircle, 
  Clock, 
  XCircle,
  Filter,
  Search
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BoostPackage {
  id: string;
  name: string;
  description: string;
  type: 'featured' | 'premium' | 'sponsored';
  price: number;
  durationDays: number;
  features: string[];
  isActive: boolean;
}

interface ActiveBoost {
  id: string;
  packageId: string;
  packageName: string;
  type: 'featured' | 'premium' | 'sponsored';
  startDate: string;
  endDate: string;
  status: 'active' | 'pending' | 'expired' | 'cancelled';
  views: number;
  clicks: number;
  bookings: number;
  revenue: number;
}

export default function VendorBoostsPage() {
  const [packages, setPackages] = useState<BoostPackage[]>([]);
  const [activeBoosts, setActiveBoosts] = useState<ActiveBoost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<BoostPackage | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesResponse, boostsResponse] = await Promise.all([
        fetch('/api/boosts/packages'),
        fetch('/api/boosts/vendor/active')
      ]);

      if (packagesResponse.ok) {
        const packagesData = await packagesResponse.json();
        setPackages(packagesData.packages || []);
      }

      if (boostsResponse.ok) {
        const boostsData = await boostsResponse.json();
        setActiveBoosts(boostsData.boosts || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load boost data.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseBoost = async (pkg: BoostPackage) => {
    try {
      const response = await fetch('/api/boosts/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId: pkg.id,
          vendorId: 'current-vendor-id', // TODO: Get from session
        }),
      });

      if (response.ok) {
        toast({
          title: 'Boost Purchased',
          description: `Successfully purchased ${pkg.name} boost package.`,
        });
        setIsPurchaseDialogOpen(false);
        fetchData(); // Refresh data
      } else {
        throw new Error('Failed to purchase boost');
      }
    } catch (error) {
      toast({
        title: 'Purchase Failed',
        description: 'Failed to purchase boost package. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'expired':
        return <Badge className="bg-gray-100 text-gray-800">Expired</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'featured':
        return <Star className="h-4 w-4 text-yellow-500" />;
      case 'premium':
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      case 'sponsored':
        return <Zap className="h-4 w-4 text-blue-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredBoosts = activeBoosts.filter(boost => {
    const matchesStatus = filterStatus === 'all' || boost.status === filterStatus;
    const matchesType = filterType === 'all' || boost.type === filterType;
    const matchesSearch = boost.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const totalViews = activeBoosts.reduce((sum, boost) => sum + boost.views, 0);
  const totalClicks = activeBoosts.reduce((sum, boost) => sum + boost.clicks, 0);
  const totalBookings = activeBoosts.reduce((sum, boost) => sum + boost.bookings, 0);
  const totalRevenue = activeBoosts.reduce((sum, boost) => sum + boost.revenue, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Boost Campaigns</h1>
          <p className="text-gray-600">Manage your boost packages and track performance</p>
        </div>
        <Dialog open={isPurchaseDialogOpen} onOpenChange={setIsPurchaseDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Purchase Boost
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Purchase Boost Package</DialogTitle>
              <DialogDescription>
                Choose a boost package to increase your visibility and get more bookings.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {packages.map((pkg) => (
                <Card key={pkg.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      {getTypeIcon(pkg.type)}
                    </div>
                    <CardDescription>{pkg.description}</CardDescription>
                    <div className="text-2xl font-bold text-blue-600">
                      LKR {pkg.price.toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-gray-600 mb-4">
                      {pkg.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handlePurchaseBoost(pkg)}
                      className="w-full"
                      disabled={!pkg.isActive}
                    >
                      {pkg.isActive ? 'Purchase' : 'Coming Soon'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">LKR {totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search boosts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="sponsored">Sponsored</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Active Boosts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Active Boost Campaigns</CardTitle>
          <CardDescription>
            Track the performance of your boost campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBoosts.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No boost campaigns</h3>
              <p className="text-gray-600 mb-4">
                You haven't purchased any boost packages yet.
              </p>
              <Button onClick={() => setIsPurchaseDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Purchase Your First Boost
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBoosts.map((boost) => (
                  <TableRow key={boost.id}>
                    <TableCell className="font-medium">{boost.packageName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(boost.type)}
                        <span className="capitalize">{boost.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(boost.startDate).toLocaleDateString()}</div>
                        <div className="text-gray-500">to {new Date(boost.endDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(boost.status)}</TableCell>
                    <TableCell>{boost.views.toLocaleString()}</TableCell>
                    <TableCell>{boost.clicks.toLocaleString()}</TableCell>
                    <TableCell>{boost.bookings}</TableCell>
                    <TableCell>LKR {boost.revenue.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}



