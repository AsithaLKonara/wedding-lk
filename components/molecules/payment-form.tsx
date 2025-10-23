"use client"

import { useState } from 'react'
// Removed NextAuth - using custom auth
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Lock, CheckCircle, AlertCircle } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  bookingId: string
  amount: number
  currency?: string
  description?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

function PaymentFormContent({ 
  bookingId, 
  amount, 
  currency = 'lkr', 
  description,
  onSuccess,
  onError 
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { data: session } = useSession()
  const router = useRouter()
  
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements || !session?.user) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bookingId,
          amount,
          currency,
          description
        })
      })

      const { clientSecret, error: apiError } = await response.json()

      if (apiError) {
        throw new Error(apiError)
      }

      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
            billing_details: {
              name: session.user.name || '',
              email: session.user.email || ''
            }
          }
        }
      )

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      if (paymentIntent.status === 'succeeded') {
        setSuccess(true)
        onSuccess?.()
        
        // Redirect to booking confirmation after a short delay
        setTimeout(() => {
          router.push(`/booking/confirmation/${bookingId}`)
        }, 2000)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-4">Your booking has been confirmed.</p>
        <p className="text-sm text-gray-500">Redirecting to confirmation page...</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payment Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Amount</span>
              <span className="text-2xl font-bold text-purple-600">
                {formatPrice(amount)}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Lock className="w-4 h-4 mr-1" />
              Secure payment powered by Stripe
            </div>
          </div>

          {/* Card Details */}
          <div className="space-y-2">
            <Label htmlFor="card-element">Card Information</Label>
            <div className="border border-gray-300 rounded-md p-3">
              <CardElement
                id="card-element"
                options={cardElementOptions}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!stripe || processing}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            {processing ? 'Processing...' : `Pay ${formatPrice(amount)}`}
          </Button>

          {/* Security Notice */}
          <div className="text-center text-xs text-gray-500">
            <p>Your payment information is secure and encrypted.</p>
            <p>We never store your card details.</p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export function PaymentForm(props: PaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentFormContent {...props} />
    </Elements>
  )
}
