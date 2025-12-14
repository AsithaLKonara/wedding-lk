"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Shield, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentFormProps {
  booking: {
    id: string
    venueName: string
    totalAmount: number
  }
  onPaymentSuccess: (paymentId: string) => void
}

export function PaymentForm({ booking, onPaymentSuccess }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
  })
  const [errors, setErrors] = useState<any>({})
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err: any = {}
    if (!formData.cardNumber || !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) err.cardNumber = "Enter a valid 16-digit card number"
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) err.expiryDate = "Enter expiry as MM/YY"
    if (!formData.cvv || !/^\d{3,4}$/.test(formData.cvv)) err.cvv = "Enter a valid CVV"
    if (!formData.cardholderName) err.cardholderName = "Cardholder name is required"
    if (!formData.billingAddress) err.billingAddress = "Billing address is required"
    setErrors(err)
    if (Object.keys(err).length > 0) {
      toast({ title: "Please fix the errors above.", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const paymentId = `pay_${Date.now()}`
      toast({ title: "Payment successful", description: "Your payment has been processed successfully." })
      onPaymentSuccess(paymentId)
      setFormData({ cardNumber: "", expiryDate: "", cvv: "", cardholderName: "", billingAddress: "" })
      setErrors({})
    } catch (error) {
      toast({ title: "Payment failed. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>{booking.venueName}</span>
              <span>LKR {booking.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Service Fee</span>
              <span>LKR 5,000</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Processing Fee</span>
              <span>LKR 2,500</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>LKR {(booking.totalAmount + 7500).toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setPaymentMethod("card")}
              className={`p-4 border rounded-lg text-center transition-colors ${
                paymentMethod === "card"
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-950"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              aria-pressed={paymentMethod === "card"}
              aria-label="Select Credit or Debit Card payment"
            >
              <CreditCard className="h-6 w-6 mx-auto mb-2" />
              <p className="font-medium">Credit/Debit Card</p>
            </button>

            <button
              onClick={() => setPaymentMethod("bank")}
              className={`p-4 border rounded-lg text-center transition-colors ${
                paymentMethod === "bank"
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-950"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              aria-pressed={paymentMethod === "bank"}
              aria-label="Select Bank Transfer payment"
            >
              <div className="h-6 w-6 mx-auto mb-2 bg-blue-600 rounded"></div>
              <p className="font-medium">Bank Transfer</p>
            </button>

            <button
              onClick={() => setPaymentMethod("mobile")}
              className={`p-4 border rounded-lg text-center transition-colors ${
                paymentMethod === "mobile"
                  ? "border-rose-500 bg-rose-50 dark:bg-rose-950"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              aria-pressed={paymentMethod === "mobile"}
              aria-label="Select Mobile Payment"
            >
              <div className="h-6 w-6 mx-auto mb-2 bg-green-600 rounded"></div>
              <p className="font-medium">Mobile Payment</p>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Form */}
      {paymentMethod === "card" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Secure Payment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  required
                  aria-invalid={!!errors.cardNumber}
                  aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
                />
                {errors.cardNumber && <div id="cardNumber-error" className="text-xs text-destructive">{errors.cardNumber}</div>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    required
                    aria-invalid={!!errors.expiryDate}
                    aria-describedby={errors.expiryDate ? "expiryDate-error" : undefined}
                  />
                  {errors.expiryDate && <div id="expiryDate-error" className="text-xs text-destructive">{errors.expiryDate}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    required
                    aria-invalid={!!errors.cvv}
                    aria-describedby={errors.cvv ? "cvv-error" : undefined}
                  />
                  {errors.cvv && <div id="cvv-error" className="text-xs text-destructive">{errors.cvv}</div>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={formData.cardholderName}
                  onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                  required
                  aria-invalid={!!errors.cardholderName}
                  aria-describedby={errors.cardholderName ? "cardholderName-error" : undefined}
                />
                {errors.cardholderName && <div id="cardholderName-error" className="text-xs text-destructive">{errors.cardholderName}</div>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingAddress">Billing Address</Label>
                <Input
                  id="billingAddress"
                  placeholder="123 Main St, Colombo"
                  value={formData.billingAddress}
                  onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                  required
                  aria-invalid={!!errors.billingAddress}
                  aria-describedby={errors.billingAddress ? "billingAddress-error" : undefined}
                />
                {errors.billingAddress && <div id="billingAddress-error" className="text-xs text-destructive">{errors.billingAddress}</div>}
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Your payment information is encrypted and secure</span>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-600" disabled={isLoading}>
                {isLoading ? "Processing Payment..." : `Pay LKR ${(booking.totalAmount + 7500).toLocaleString()}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {paymentMethod === "bank" && (
        <Card>
          <CardHeader>
            <CardTitle>Bank Transfer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium mb-2">Transfer to:</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <strong>Bank:</strong> Commercial Bank of Ceylon
                  </p>
                  <p>
                    <strong>Account Name:</strong> Wedding Dreams Lanka (Pvt) Ltd
                  </p>
                  <p>
                    <strong>Account Number:</strong> 8001234567
                  </p>
                  <p>
                    <strong>Branch:</strong> Colombo 03
                  </p>
                  <p>
                    <strong>Reference:</strong> {booking.id}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Please include the booking ID as reference and upload the transfer receipt to confirm payment.
              </p>
              <Button className="w-full">Upload Transfer Receipt</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {paymentMethod === "mobile" && (
        <Card>
          <CardHeader>
            <CardTitle>Mobile Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select mobile payment provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dialog">Dialog eZ Cash</SelectItem>
                  <SelectItem value="mobitel">Mobitel mCash</SelectItem>
                  <SelectItem value="hutch">Hutch Pay</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Mobile Number" />
              <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-600">Pay with Mobile</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


export default PaymentForm
