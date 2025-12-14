"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Loader2, Calendar, DollarSign } from 'lucide-react'

export default function PaymentsTab() {
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/dashboard/user/payments')
      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments || [])
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Loading payments...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Your Payments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment: any) => (
              <div key={payment._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">{payment.description || 'Payment'}</p>
                    <p className="text-sm text-gray-500">{payment.vendor?.name || 'Vendor'}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(payment.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-lg">LKR {payment.amount?.toLocaleString() || "0"}</p>
                  <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'}>
                    {payment.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No payments yet</p>
            <p className="text-sm">Track your wedding expenses and payment history here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 