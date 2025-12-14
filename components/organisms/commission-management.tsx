'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  Filter,
  Download,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Commission {
  _id: string;
  vendor: {
    id: string;
    name: string;
    email: string;
    businessName: string;
  };
  booking: {
    id: string;
    customerName: string;
    serviceName: string;
    amount: number;
    date: string;
  };
  commission: {
    rate: number; // percentage
    amount: number; // calculated amount
    status: 'pending' | 'paid' | 'disputed' | 'refunded';
  };
  payment: {
    method: 'bank_transfer' | 'paypal' | 'stripe';
    accountDetails?: string;
    transactionId?: string;
    paidAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface CommissionManagementProps {
  onCommissionClick?: (commission: Commission) => void;
}

export function CommissionManagement({ onCommissionClick }: CommissionManagementProps) {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVendor, setFilterVendor] = useState<string>('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [stats, setStats] = useState({
    totalCommissions: 0,
    pendingCommissions: 0,
    paidCommissions: 0,
    totalRevenue: 0,
    averageCommissionRate: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCommissions();
    fetchStats();
  }, [filterStatus, filterVendor, dateRange]);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filterStatus,
        vendor: filterVendor,
        startDate: dateRange.start,
        endDate: dateRange.end
      });
      
      const response = await fetch(`/api/admin/commissions?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        setCommissions(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching commissions:', error);
      toast({
        title: "Error",
        description: "Failed to load commissions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/commissions/stats');
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching commission stats:', error);
    }
  };

  const handleCommissionStatusChange = async (commissionId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/commissions/${commissionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (response.ok) {
        setCommissions(prev => 
          prev.map(commission => 
            commission._id === commissionId 
              ? { ...commission, commission: { ...commission.commission, status: newStatus as any } }
              : commission
          )
        );
        
        toast({
          title: "Status updated",
          description: `Commission status changed to ${newStatus}`,
        });
        
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error updating commission status:', error);
      toast({
        title: "Error",
        description: "Failed to update commission status",
        variant: "destructive"
      });
    }
  };

  const handleBulkPayment = async (commissionIds: string[]) => {
    try {
      const response = await fetch('/api/admin/commissions/bulk-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commissionIds,
        }),
      });

      if (response.ok) {
        toast({
          title: "Bulk payment processed",
          description: `${commissionIds.length} commissions marked as paid`,
        });
        
        fetchCommissions();
        fetchStats();
      }
    } catch (error) {
      console.error('Error processing bulk payment:', error);
      toast({
        title: "Error",
        description: "Failed to process bulk payment",
        variant: "destructive"
      });
    }
  };

  const handleExportCommissions = async () => {
    try {
      const params = new URLSearchParams({
        status: filterStatus,
        vendor: filterVendor,
        startDate: dateRange.start,
        endDate: dateRange.end
      });
      
      const response = await fetch(`/api/admin/commissions/export?${params}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `commissions-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        toast({
          title: "Export successful",
          description: "Commissions data exported successfully",
        });
      }
    } catch (error) {
      console.error('Error exporting commissions:', error);
      toast({
        title: "Error",
        description: "Failed to export commissions",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'disputed': return <XCircle className="h-4 w-4" />;
      case 'refunded': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const pendingCommissions = commissions.filter(c => c.commission.status === 'pending');
  const selectedCommissions = pendingCommissions.filter(c => c.commission.status === 'pending');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commissions</p>
                <p className="text-2xl font-bold">{stats.totalCommissions}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingCommissions}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">{stats.paidCommissions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.totalRevenue)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Commission Management</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCommissions}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {selectedCommissions.length > 0 && (
                <Button
                  size="sm"
                  onClick={() => handleBulkPayment(selectedCommissions.map(c => c._id))}
                >
                  Pay Selected ({selectedCommissions.length})
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="disputed">Disputed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <Label htmlFor="vendor-filter">Vendor</Label>
              <Input
                id="vendor-filter"
                placeholder="Search vendor..."
                value={filterVendor}
                onChange={(e) => setFilterVendor(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commissions List */}
      <div className="space-y-4">
        {commissions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-semibold text-gray-600 mb-2">No commissions found</p>
              <p className="text-sm text-gray-500">Commissions will appear here when vendors complete bookings</p>
            </CardContent>
          </Card>
        ) : (
          commissions.map((commission) => (
            <Card key={commission._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div>
                        <h3 className="font-semibold">{commission.vendor.businessName}</h3>
                        <p className="text-sm text-gray-600">{commission.vendor.email}</p>
                      </div>
                      <Badge className={getStatusColor(commission.commission.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(commission.commission.status)}
                          <span className="capitalize">{commission.commission.status}</span>
                        </div>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-600">Booking</p>
                        <p>{commission.booking.customerName}</p>
                        <p className="text-gray-500">{commission.booking.serviceName}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-600">Amount</p>
                        <p>{formatCurrency(commission.booking.amount)}</p>
                        <p className="text-gray-500">
                          {commission.commission.rate}% commission
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-600">Commission</p>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(commission.commission.amount)}
                        </p>
                        <p className="text-gray-500">
                          {formatDate(commission.createdAt)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-600">Payment</p>
                        <p className="capitalize">{commission.payment.method}</p>
                        {commission.payment.paidAt && (
                          <p className="text-gray-500">
                            Paid {formatDate(commission.payment.paidAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {commission.commission.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleCommissionStatusChange(commission._id, 'paid')}
                      >
                        Mark as Paid
                      </Button>
                    )}
                    
                    {commission.commission.status === 'paid' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCommissionStatusChange(commission._id, 'disputed')}
                      >
                        Dispute
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCommissionClick?.(commission)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}


