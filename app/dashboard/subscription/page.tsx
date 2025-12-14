"use client"

import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { useState } from "react"

const mockPlan = {
  name: "Premium",
  price: 4999,
  status: "active",
  renewsAt: "2024-08-01",
}
const mockPayments = [
  { id: 1, date: "2024-07-01", amount: 4999, status: "paid" },
  { id: 2, date: "2024-06-01", amount: 4999, status: "paid" },
]

// Card will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Table will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TableBody will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TableCell will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TableHead will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TableHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TableRow will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Dialog will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogFooter will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogTrigger will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogClose will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function SubscriptionPage() {
  const { toast } = useToast()
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [payments, setPayments] = useState(mockPayments)

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
              <div className="text-lg font-semibold">{mockPlan.name} Plan</div>
              <div className="text-gray-500">LKR {mockPlan.price} / month</div>
              <div className="text-sm text-green-600 mt-1">{mockPlan.status === "active" ? "Active" : "Inactive"}</div>
              <div className="text-xs text-gray-400 mt-1">Renews on {mockPlan.renewsAt}</div>
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