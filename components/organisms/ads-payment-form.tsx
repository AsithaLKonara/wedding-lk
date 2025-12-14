'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  Target, 
  Users, 
  MousePointer,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface AdsPaymentFormProps {
  campaignId: string;
  packageId?: string;
  onPaymentSuccess?: (paymentId: string) => void;
  onPaymentError?: (error: string) => void;
}

interface BudgetRecommendation {
  suggestedDailyBudget: number;
  suggestedLifetimeBudget: number;
  estimatedReach: number;
  estimatedClicks: number;
  estimatedConversions: number;
}

export function AdsPaymentForm({ 
  campaignId, 
  packageId, 
  onPaymentSuccess, 
  onPaymentError 
}: AdsPaymentFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
    description: '',
    paymentMethod: 'card',
    billingCycle: 'one_time',
    priority: 'medium'
  });

  const [budgetRecommendation, setBudgetRecommendation] = useState<BudgetRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Calculate budget recommendations when amount changes
    if (field === 'amount' && value) {
      calculateBudgetRecommendations(parseFloat(value));
    }
  };

  const calculateBudgetRecommendations = async (amount: number) => {
    try {
      const response = await fetch('/api/ads-payments/budget-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          priority: formData.priority,
          billingCycle: formData.billingCycle
        })
      });

      if (response.ok) {
        const data = await response.json();
        setBudgetRecommendation(data.data);
      }
    } catch (error) {
      console.error('Error calculating budget recommendations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount < 10) {
      setError('Minimum payment amount is $10');
      return;
    }

    setPaymentLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ads-payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          packageId,
          amount,
          currency: formData.currency,
          description: formData.description,
          paymentMethod: formData.paymentMethod,
          billingCycle: formData.billingCycle
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment creation failed');
      }

      // Handle payment based on method
      if (formData.paymentMethod === 'card') {
        // Redirect to Stripe Checkout or handle client-side payment
        handleCardPayment(data.data);
      } else {
        // Handle other payment methods
        onPaymentSuccess?.(data.data.paymentId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCardPayment = async (paymentData: any) => {
    try {
      // Here you would integrate with Stripe Elements or redirect to Stripe Checkout
      // For now, we'll simulate a successful payment
      const confirmResponse = await fetch(`/api/ads-payments/${paymentData.paymentId}/confirm`, {
        method: 'POST'
      });

      if (confirmResponse.ok) {
        onPaymentSuccess?.(paymentData.paymentId);
      } else {
        throw new Error('Payment confirmation failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      setError(errorMessage);
      onPaymentError?.(errorMessage);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Ads Payment
          </CardTitle>
          <CardDescription>
            Pay for your Meta Ads campaign to start promoting your packages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  min="10"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-sm text-gray-500">Minimum amount: $10.00</p>
            </div>

            {/* Currency */}
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="LKR">LKR - Sri Lankan Rupee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your campaign goals..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="wallet">Digital Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Billing Cycle */}
            <div className="space-y-2">
              <Label htmlFor="billingCycle">Billing Cycle</Label>
              <Select value={formData.billingCycle} onValueChange={(value) => handleInputChange('billingCycle', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">One-time Payment</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campaign Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Campaign Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Budget Recommendations */}
            {budgetRecommendation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Budget Recommendations</CardTitle>
                  <CardDescription>Based on your budget and priority level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(budgetRecommendation.suggestedDailyBudget)}
                      </div>
                      <div className="text-sm text-blue-600">Daily Budget</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(budgetRecommendation.suggestedLifetimeBudget)}
                      </div>
                      <div className="text-sm text-green-600">30-Day Budget</div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <Users className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold">{formatNumber(budgetRecommendation.estimatedReach)}</div>
                      <div className="text-sm text-gray-600">Estimated Reach</div>
                    </div>
                    <div>
                      <MousePointer className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold">{formatNumber(budgetRecommendation.estimatedClicks)}</div>
                      <div className="text-sm text-gray-600">Estimated Clicks</div>
                    </div>
                    <div>
                      <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
                      <div className="text-lg font-semibold">{formatNumber(budgetRecommendation.estimatedConversions)}</div>
                      <div className="text-sm text-gray-600">Estimated Conversions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={paymentLoading || !formData.amount || !formData.description}
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay {formatCurrency(parseFloat(formData.amount) || 0)}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Secure payment processing by Stripe</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Your campaign will be activated after successful payment</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Full refund available within 24 hours</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
