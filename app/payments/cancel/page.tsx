'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw, CreditCard } from 'lucide-react';

export default function PaymentCancelPage() {
  const router = useRouter();

  const handleRetryPayment = () => {
    // TODO: Implement retry payment logic
    router.push('/checkout');
  };

  const handleBackToCart = () => {
    // TODO: Implement back to cart logic
    router.push('/checkout');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600">
            Your payment was cancelled. No charges have been made to your account.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>What happened?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 font-medium text-xs">!</span>
                </div>
                <div>
                  <p className="font-medium">Payment was cancelled</p>
                  <p className="text-gray-600">You cancelled the payment process or there was an issue with your payment method</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-xs">i</span>
                </div>
                <div>
                  <p className="font-medium">No charges made</p>
                  <p className="text-gray-600">Your payment method was not charged and no booking was created</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-medium text-xs">✓</span>
                </div>
                <div>
                  <p className="font-medium">Items still available</p>
                  <p className="text-gray-600">Your selected items are still available and can be booked again</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Common reasons for cancellation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Insufficient funds</p>
                  <p className="text-gray-600">Your payment method doesn't have enough funds</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Card declined</p>
                  <p className="text-gray-600">Your bank declined the transaction</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Network issues</p>
                  <p className="text-gray-600">Connection problems during payment processing</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Manual cancellation</p>
                  <p className="text-gray-600">You chose to cancel the payment</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">What would you like to do?</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handleRetryPayment}
              className="h-12"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <Button
              onClick={handleBackToCart}
              variant="outline"
              className="h-12"
              size="lg"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Back to Checkout
            </Button>
          </div>
          
          <div className="pt-4">
            <Button
              onClick={handleBackToDashboard}
              variant="ghost"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                If you're experiencing issues with payments, our support team is here to help.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> support@weddinglk.com
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Phone:</strong> +94 77 123 4567
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Hours:</strong> 9:00 AM - 6:00 PM (Mon-Fri)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



