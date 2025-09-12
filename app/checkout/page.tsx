'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CheckoutItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  type: 'venue' | 'service' | 'package';
}

function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/login?callbackUrl=/checkout');
      return;
    }
    // Load checkout items from localStorage or API
    loadCheckoutItems();
  }, [session, status, router]);

  const loadCheckoutItems = () => {
    // TODO: Load from API or localStorage
    const mockItems: CheckoutItem[] = [
      {
        id: '1',
        name: 'Venue Booking',
        description: 'Wedding Venue - Grand Ballroom',
        price: 150000,
        quantity: 1,
        type: 'venue'
      }
    ];
    setItems(mockItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateTotal() * 0.15; // 15% tax
  };

  const calculateGrandTotal = () => {
    return calculateTotal() + calculateTax();
  };

  const handleCheckout = async () => {
    if (!session?.user?.email) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to continue with checkout.',
        variant: 'destructive'
      });
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.name,
            description: item.description,
            price: item.price,
            quantity: item.quantity,
            type: item.type
          })),
          userId: session.user.email,
          total: calculateGrandTotal()
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Redirect to Stripe Checkout
      const stripe = await import('@stripe/stripe-js');
      const { loadStripe } = stripe;
      const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      const stripeInstance = await stripePromise;

      if (stripeInstance) {
        const { error: stripeError } = await stripeInstance.redirectToCheckout({
          sessionId,
        });

        if (stripeError) {
          throw new Error(stripeError.message);
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Failed',
        description: error instanceof Error ? error.message : 'An error occurred during checkout.',
        variant: 'destructive'
      });
    } finally {
      setProcessing(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">Review your order and complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        LKR {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>LKR {calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (15%)</span>
                    <span>LKR {calculateTax().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>LKR {calculateGrandTotal().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Your payment information is secure and encrypted</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Protected by Stripe's secure payment processing</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={session.user?.email || ''}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+94 77 123 4567"
                    required
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={handleCheckout}
                    disabled={processing || items.length === 0}
                    className="w-full"
                    size="lg"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay LKR {calculateGrandTotal().toLocaleString()}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(CheckoutPage), { ssr: false });

