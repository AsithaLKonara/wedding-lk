'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Download, Mail, Calendar, CreditCard, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PaymentDetails {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  items: Array<{
    name: string;
    description: string;
    price: number;
    quantity: number;
  }>;
}

function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetchPaymentDetails(sessionId);
    } else {
      setError('No session ID provided');
      setLoading(false);
    }
  }, [sessionId]);

  const fetchPaymentDetails = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/payments/session/${sessionId}`);
      const data = await response.json();

      if (data.success) {
        setPayment(data.payment);
      } else {
        setError(data.error || 'Failed to fetch payment details');
      }
    } catch (err) {
      console.error('Error fetching payment details:', err);
      setError('Failed to fetch payment details');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!payment) return;
    
    // TODO: Implement receipt generation and download
    toast({
      title: 'Receipt Downloaded',
      description: 'Your payment receipt has been downloaded.',
    });
  };

  const handleEmailReceipt = () => {
    if (!payment) return;
    
    // TODO: Implement email receipt functionality
    toast({
      title: 'Receipt Sent',
      description: 'Your payment receipt has been sent to your email.',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading payment details...</h2>
          <p className="text-gray-600">Please wait while we retrieve your payment information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mx-auto h-16 w-16 text-red-500 mb-4">
            <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
        </div>

        {payment && (
          <div className="space-y-6">
            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Payment Summary</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {payment.status.toUpperCase()}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Transaction ID</p>
                    <p className="font-mono font-medium">{payment.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium">{payment.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-medium text-lg">
                      {payment.currency} {payment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium">{formatDate(payment.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items Purchased */}
            <Card>
              <CardHeader>
                <CardTitle>Items Purchased</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payment.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start py-2 border-b last:border-b-0">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {payment.currency} {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleDownloadReceipt}
                variant="outline"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              <Button
                onClick={handleEmailReceipt}
                variant="outline"
                className="flex-1"
              >
                <Mail className="mr-2 h-4 w-4" />
                Email Receipt
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                className="flex-1"
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Bookings
              </Button>
            </div>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>What's Next?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-xs">1</span>
                    </div>
                    <div>
                      <p className="font-medium">Confirmation Email</p>
                      <p className="text-gray-600">You'll receive a confirmation email with all the details</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-xs">2</span>
                    </div>
                    <div>
                      <p className="font-medium">Vendor Notification</p>
                      <p className="text-gray-600">The vendor will be notified of your booking</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-xs">3</span>
                    </div>
                    <div>
                      <p className="font-medium">Booking Confirmation</p>
                      <p className="text-gray-600">You'll receive a final confirmation once the vendor approves</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(PaymentSuccessPage), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )
});
