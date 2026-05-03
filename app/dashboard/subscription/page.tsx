"use client"

import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { useState, useEffect } from "react"

export default function SubscriptionPage() {
  const { toast } = useToast()
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/subscription');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.subscription) {
            setPlan(data.subscription);
            setPayments(data.payments.map((p: any, index: number) => ({
              id: index,
              date: new Date(p.paidAt).toLocaleDateString(),
              amount: p.amount,
              status: p.status
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const currentPlan = plan || { name: 'No Active', price: 0, status: 'inactive', renewsAt: 'N/A' };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Subscription & Payments</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-lg font-semibold">{currentPlan.name} Plan</div>
              <div className="text-gray-500">LKR {currentPlan.price} / month</div>
              <div className="text-sm text-green-600 mt-1">{currentPlan.status === "active" ? "Active" : "Inactive"}</div>
              <div className="text-xs text-gray-400 mt-1">Renews on {currentPlan.renewsAt}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" aria-label="Change Plan" onClick={() => toast({ title: "Change Plan coming soon!", variant: "default" })}>Change Plan</Button>
              <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" aria-label="Cancel Subscription">Cancel</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Subscription</DialogTitle>
                  </DialogHeader>
                  <div>Are you sure you want to cancel your subscription? This action cannot be undone.</div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">No, Keep Subscription</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={() => { setCancelDialogOpen(false); toast({ title: "Subscription cancelled.", variant: "destructive" }) }}>Yes, Cancel</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount (LKR)</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-5xl mb-2">💳</span>
                      <span>No payment history found.</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>{p.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className={p.status === "paid" ? "text-green-600" : "text-gray-400"}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 