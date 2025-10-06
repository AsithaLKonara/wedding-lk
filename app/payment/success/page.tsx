'use client'


import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Download, Home, Calendar, CreditCard } from 'lucide-react'
import { toast } from 'sonner'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get payment data from URL params or API
    const bookingId = searchParams.get('booking_id')
    const amount = searchParams.get('amount')
    const transactionId = searchParams.get('transaction_id')
    
    if (bookingId) {
      setPaymentData({
        bookingId,
        amount: amount ? parseFloat(amount) : 0,
        transactionId,
        status: 'success'
      })
    }
    setLoading(false)
  }, [searchParams])

  const handleDownloadReceipt = () => {
    toast.success('Receipt download started')
  }

  const handleViewBooking = () => {
    if (paymentData?.bookingId) {
      window.location.href = `/bookings/${paymentData.bookingId}`
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
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
              <p className="text-gray-600">
                Your payment has been processed successfully. You will receive a confirmation email shortly.
              </p>
            </div>

            {paymentData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium">{paymentData.transactionId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium">LKR {paymentData.amount?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Completed</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <Button 
                onClick={handleDownloadReceipt}
                className="w-full"
                variant="outline"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              
              {paymentData?.bookingId && (
                <Button 
                  onClick={handleViewBooking}
                  className="w-full"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  View Booking
                </Button>
              )}
              
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



