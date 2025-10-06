'use client'


import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle, RefreshCw, Home, CreditCard } from 'lucide-react'

function PaymentCancelContent() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get payment data from URL params
    const bookingId = searchParams.get('booking_id')
    const amount = searchParams.get('amount')
    
    if (bookingId) {
      setPaymentData({
        bookingId,
        amount: amount ? parseFloat(amount) : 0,
        status: 'cancelled'
      })
    }
    setLoading(false)
  }, [searchParams])

  const handleRetryPayment = () => {
    if (paymentData?.bookingId) {
      window.location.href = `/bookings/${paymentData.bookingId}/payment`
    }
  }

  const handleGoHome = () => {
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
              <p className="text-gray-600">
                Your payment was cancelled. No charges have been made to your account.
              </p>
            </div>

            {paymentData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking ID:</span>
                    <span className="font-medium">{paymentData.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">LKR {paymentData.amount?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-red-600">Cancelled</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={handleRetryPayment}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Payment
              </Button>
              
              <Button 
                onClick={handleGoHome}
                className="w-full"
                variant="outline"
              >
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



