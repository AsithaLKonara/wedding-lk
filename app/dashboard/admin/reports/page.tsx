'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar, 
  Star, 
  Download,
  Filter,
  RefreshCw,
  Eye,
  Building2,
  Heart,
  MessageSquare,
  CreditCard
} from 'lucide-react';

interface ReportData {
  period: string;
  totalUsers: number;
  totalVendors: number;
  totalBookings: number;
  totalRevenue: number;
  userGrowth: number;
  vendorGrowth: number;
  bookingGrowth: number;
  revenueGrowth: number;
  averageRating: number;
  topCategories: Array<{
    category: string;
    count: number;
    revenue: number;
  }>;
  topVendors: Array<{
    name: string;
    bookings: number;
    revenue: number;
    rating: number;
  }>;
  monthlyStats: Array<{
    month: string;
    users: number;
    vendors: number;
    bookings: number;
    revenue: number;
  }>;
}

export default function AdminReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedReport, setSelectedReport] = useState('overview');

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
    { value: 'all', label: 'All time' }
  ];

  const reportTypes = [
    { value: 'overview', label: 'Overview' },
    { value: 'users', label: 'User Analytics' },
    { value: 'vendors', label: 'Vendor Analytics' },
    { value: 'revenue', label: 'Revenue Analytics' },
    { value: 'bookings', label: 'Booking Analytics' }
  ];

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockData: ReportData = {
        period: selectedPeriod,
        totalUsers: 1250,
        totalVendors: 180,
        totalBookings: 3200,
        totalRevenue: 2450000,
        userGrowth: 12.5,
        vendorGrowth: 8.3,
        bookingGrowth: 15.7,
        revenueGrowth: 22.1,
        averageRating: 4.6,
        topCategories: [
          { category: 'Photography', count: 45, revenue: 450000 },
          { category: 'Catering', count: 38, revenue: 380000 },
          { category: 'Venue', count: 32, revenue: 320000 },
          { category: 'Decoration', count: 28, revenue: 280000 },
          { category: 'Music & DJ', count: 25, revenue: 250000 }
        ],
        topVendors: [
          { name: 'Elegant Photography Studio', bookings: 45, revenue: 67500, rating: 4.9 },
          { name: 'Garden Catering Co.', bookings: 38, revenue: 57000, rating: 4.8 },
          { name: 'Dreamy Decorations', bookings: 32, revenue: 48000, rating: 4.7 },
          { name: 'Melody Music DJ', bookings: 28, revenue: 42000, rating: 4.6 },
          { name: 'Luxury Venue Hall', bookings: 25, revenue: 37500, rating: 4.8 }
        ],
        monthlyStats: [
          { month: 'Jan', users: 1000, vendors: 150, bookings: 2500, revenue: 1800000 },
          { month: 'Feb', users: 1050, vendors: 155, bookings: 2600, revenue: 1900000 },
          { month: 'Mar', users: 1100, vendors: 160, bookings: 2700, revenue: 2000000 },
          { month: 'Apr', users: 1150, vendors: 165, bookings: 2800, revenue: 2100000 },
          { month: 'May', users: 1200, vendors: 170, bookings: 2900, revenue: 2200000 },
          { month: 'Jun', users: 1250, vendors: 180, bookings: 3200, revenue: 2450000 }
        ]
      };
      setReportData(mockData);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = (format: string) => {
    // Mock export functionality
    console.log(`Exporting ${selectedReport} report as ${format}`);
    // In real implementation, this would generate and download the report
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  if (!reportData) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into platform performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {periods.map(period => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => fetchReportData()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Report Type Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            {reportTypes.map(type => (
              <Button
                key={type.value}
                variant={selectedReport === type.value ? 'default' : 'outline'}
                onClick={() => setSelectedReport(type.value)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{reportData.totalUsers.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(reportData.userGrowth)}
                  <span className={`text-sm ml-1 ${getGrowthColor(reportData.userGrowth)}`}>
                    {reportData.userGrowth}%
                  </span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Vendors</p>
                <p className="text-2xl font-bold">{reportData.totalVendors.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(reportData.vendorGrowth)}
                  <span className={`text-sm ml-1 ${getGrowthColor(reportData.vendorGrowth)}`}>
                    {reportData.vendorGrowth}%
                  </span>
                </div>
              </div>
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{reportData.totalBookings.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(reportData.bookingGrowth)}
                  <span className={`text-sm ml-1 ${getGrowthColor(reportData.bookingGrowth)}`}>
                    {reportData.bookingGrowth}%
                  </span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">${reportData.totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(reportData.revenueGrowth)}
                  <span className={`text-sm ml-1 ${getGrowthColor(reportData.revenueGrowth)}`}>
                    {reportData.revenueGrowth}%
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Top Categories by Revenue</CardTitle>
          <CardDescription>Most profitable service categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.topCategories.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{category.category}</p>
                    <p className="text-sm text-gray-500">{category.count} vendors</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${category.revenue.toLocaleString()}</p>
                  <div className="w-32">
                    <Progress 
                      value={(category.revenue / reportData.topCategories[0].revenue) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Vendors */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Vendors</CardTitle>
          <CardDescription>Vendors with highest bookings and revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.topVendors.map((vendor, index) => (
                <TableRow key={vendor.name}>
                  <TableCell>
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{vendor.name}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {vendor.bookings}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      {vendor.revenue.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      {vendor.rating}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Growth Trends</CardTitle>
          <CardDescription>Platform growth over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportData.monthlyStats.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="w-16">
                  <p className="font-medium">{month.month}</p>
                </div>
                <div className="flex-1 grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Users</p>
                    <p className="font-medium">{month.users.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Vendors</p>
                    <p className="font-medium">{month.vendors.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Bookings</p>
                    <p className="font-medium">{month.bookings.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="font-medium">${month.revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold">{reportData.averageRating}</p>
                <p className="text-xs text-gray-500">Platform-wide average</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">User Satisfaction</p>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-xs text-gray-500">Based on reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold">98%</p>
                <p className="text-xs text-gray-500">Vendor response time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
