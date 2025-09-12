'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Filter, Calendar, CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Payment {
  _id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  description: string;
  vendor?: {
    businessName: string;
    category: string;
  };
  booking?: {
    date: string;
    service: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function PaymentHistoryPage() {
  const { data: session } = useSession() || {};
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    if (session) {
      fetchPayments();
    }
  }, [session]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment history.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadInvoice = async (paymentId: string) => {
    try {
      const response = await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          userId: session?.user?.email
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${paymentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Failed to generate invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast({
        title: 'Error',
        description: 'Failed to download invoice.',
        variant: 'destructive'
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'refunded':
        return <CreditCard className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.vendor?.businessName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === '30' && new Date(payment.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
                       (dateFilter === '90' && new Date(payment.createdAt) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="mt-2 text-gray-600">View and manage your payment transactions</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={fetchPayments}>
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payment List */}
        <div className="space-y-4">
          {filteredPayments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
                <p className="text-gray-600">
                  {searchQuery || statusFilter !== 'all' || dateFilter !== 'all'
                    ? 'Try adjusting your filters to see more results.'
                    : 'You haven\'t made any payments yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPayments.map((payment) => (
              <Card key={payment._id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(payment.status)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {payment.description}
                        </h3>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </div>
                      
                      {payment.vendor && (
                        <p className="text-sm text-gray-600 mb-1">
                          Vendor: {payment.vendor.businessName} • {payment.vendor.category}
                        </p>
                      )}
                      
                      {payment.booking && (
                        <p className="text-sm text-gray-600 mb-1">
                          Service: {payment.booking.service} • Date: {new Date(payment.booking.date).toLocaleDateString()}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-1" />
                          {payment.currency} {payment.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadInvoice(payment._id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredPayments.length > 0 && (
          <Card className="mt-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredPayments.length}
                  </p>
                  <p className="text-sm text-gray-600">Total Payments</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    LKR {filteredPayments
                      .filter(p => p.status === 'completed')
                      .reduce((sum, p) => sum + p.amount, 0)
                      .toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {filteredPayments.filter(p => p.status === 'pending').length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">
                    {filteredPayments.filter(p => p.status === 'failed').length}
                  </p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
