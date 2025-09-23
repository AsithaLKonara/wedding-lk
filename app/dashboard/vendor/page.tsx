"use client"

import { BarChart2, ClipboardList, Package, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"

interface Booking {
  _id: string
  contactInfo?: {
    name: string
    email: string
    phone: string
  }
  date: string
  status: string
}

interface Service {
  _id: string
  name: string
  price: number
  description: string
}

interface Review {
  id: string
  client: string
  rating: number
  comment: string
  date: string
}

const mockBookings: Booking[] = [
  { _id: "1", contactInfo: { name: "Sarah & Michael", email: "", phone: "" }, date: "2024-07-15", status: "pending" },
  { _id: "2", contactInfo: { name: "Priya & Raj", email: "", phone: "" }, date: "2024-08-10", status: "confirmed" },
  { _id: "3", contactInfo: { name: "Emma & David", email: "", phone: "" }, date: "2024-09-05", status: "pending" },
]

const analyticsData = {
  totalBookings: 32,
  totalRevenue: 1250000,
  avgReview: 4.7,
  reviewCount: 18,
}

const mockServices: Service[] = [
  { _id: "1", name: "Photography", price: 120000, description: "Full day wedding photography" },
  { _id: "2", name: "Catering", price: 250000, description: "Buffet for 200 guests" },
  { _id: "3", name: "Music Band", price: 80000, description: "Live band for reception" },
]

const mockReviews: Review[] = [
  { id: "1", client: "Sarah & Michael", rating: 5, comment: "Amazing service!", date: "2024-07-16" },
  { id: "2", client: "Priya & Raj", rating: 4, comment: "Great food and music.", date: "2024-08-11" },
  { id: "3", client: "Emma & David", rating: 3, comment: "Good, but could improve timing.", date: "2024-09-06" },
]

// Card will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Tabs will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsList will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// TabsTrigger will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

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

// LoadingSpinner will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function VendorDashboardPage() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [servicesLoading, setServicesLoading] = useState(true)
  const [serviceLoadingId, setServiceLoadingId] = useState<string | null>(null)
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [reviewLoadingId, setReviewLoadingId] = useState<string | null>(null)
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false)
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false)
  const [editService, setEditService] = useState<Service | null>(null)
  const [serviceForm, setServiceForm] = useState({ name: "", price: "", description: "" })

  useEffect(() => {
    async function fetchBookings() {
      setBookingsLoading(true)
      try {
        const res = await fetch("/api/bookings")
        const data = await res.json()
        if (res.ok && data.bookings) {
          setBookings(data.bookings)
        }
      } catch (e) {
        toast({ title: "Failed to load bookings", variant: "destructive" })
      } finally {
        setBookingsLoading(false)
      }
    }
    fetchBookings()
  }, [toast])

  useEffect(() => {
    async function fetchServices() {
      setServicesLoading(true)
      try {
        const res = await fetch("/api/services")
        const data = await res.json()
        if (res.ok && data.services) {
          setServices(data.services)
        }
      } catch (e) {
        toast({ title: "Failed to load services", variant: "destructive" })
      } finally {
        setServicesLoading(false)
      }
    }
    fetchServices()
  }, [toast])

  const handleAddService = async () => {
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceForm),
      })
      const data = await res.json()
      if (res.ok && data.service) {
        setServices(prev => [...prev, data.service])
        setIsAddServiceOpen(false)
        setServiceForm({ name: "", price: "", description: "" })
        toast({ title: "Service added!", variant: "default" })
      } else {
        toast({ title: data.error || "Failed to add service", variant: "destructive" })
      }
    } catch {
      toast({ title: "Failed to add service", variant: "destructive" })
    }
  }

  const handleEditService = async () => {
    if (!editService) return
    try {
      const res = await fetch("/api/services", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editService._id, ...serviceForm }),
      })
      const data = await res.json()
      if (res.ok && data.service) {
        setServices(prev => prev.map(s => s._id === editService._id ? data.service : s))
        setIsEditServiceOpen(false)
        setEditService(null)
        setServiceForm({ name: "", price: "", description: "" })
        toast({ title: "Service updated!", variant: "default" })
      } else {
        toast({ title: data.error || "Failed to update service", variant: "destructive" })
      }
    } catch {
      toast({ title: "Failed to update service", variant: "destructive" })
    }
  }

  const handleDeleteService = async (id: string) => {
    try {
      const res = await fetch("/api/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setServices(prev => prev.filter(s => s._id !== id))
        toast({ title: "Service deleted.", variant: "destructive" })
      } else {
        toast({ title: data.error || "Failed to delete service", variant: "destructive" })
      }
    } catch {
      toast({ title: "Failed to delete service", variant: "destructive" })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>
      <Tabs defaultValue="bookings" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="bookings"><ClipboardList className="inline mr-2 h-4 w-4" />Bookings</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart2 className="inline mr-2 h-4 w-4" />Analytics</TabsTrigger>
          <TabsTrigger value="services"><Package className="inline mr-2 h-4 w-4" />Services</TabsTrigger>
          <TabsTrigger value="reviews"><Star className="inline mr-2 h-4 w-4" />Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex justify-center items-center py-12"><LoadingSpinner /></div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                          <div className="flex flex-col items-center justify-center">
                            <span className="text-5xl mb-2">📅</span>
                            <span>No bookings yet.</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      bookings.map((booking) => (
                        <TableRow key={booking._id}>
                          <TableCell>{booking.contactInfo?.name || "-"}</TableCell>
                          <TableCell>{booking.date?.slice(0, 10)}</TableCell>
                          <TableCell>{booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}</TableCell>
                          <TableCell>
                            {booking.status === "pending" ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  disabled={loadingId === booking._id}
                                  onClick={async () => {
                                    setLoadingId(booking._id)
                                    try {
                                      const res = await fetch("/api/bookings", {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ id: booking._id, status: "confirmed" }),
                                      })
                                      if (res.ok) {
                                        setBookings((prev) => prev.map((b) => b._id === booking._id ? { ...b, status: "confirmed" } : b))
                                        toast({ title: "Booking confirmed!", variant: "default" })
                                      }
                                    } catch {
                                      toast({ title: "Failed to confirm booking", variant: "destructive" })
                                    } finally {
                                      setLoadingId(null)
                                    }
                                  }}
                                >
                                  {loadingId === booking._id ? "Accepting..." : "Accept"}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  disabled={loadingId === booking._id}
                                  onClick={async () => {
                                    setLoadingId(booking._id)
                                    try {
                                      const res = await fetch("/api/bookings", {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ id: booking._id, status: "rejected" }),
                                      })
                                      if (res.ok) {
                                        setBookings((prev) => prev.map((b) => b._id === booking._id ? { ...b, status: "rejected" } : b))
                                        toast({ title: "Booking rejected.", variant: "destructive" })
                                      }
                                    } catch {
                                      toast({ title: "Failed to reject booking", variant: "destructive" })
                                    } finally {
                                      setLoadingId(null)
                                    }
                                  }}
                                >
                                  {loadingId === booking._id ? "Rejecting..." : "Reject"}
                                </Button>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">
                                {booking.status === "confirmed" ? "✅ Confirmed" : "❌ Rejected"}
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.totalBookings}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">LKR {analyticsData.totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Avg Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.avgReview}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analyticsData.reviewCount}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="services">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Services</CardTitle>
              <Dialog open={isAddServiceOpen} onOpenChange={setIsAddServiceOpen}>
                <DialogTrigger asChild>
                  <Button>Add Service</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Service</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Service Name</label>
                      <input
                        type="text"
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Price (LKR)</label>
                      <input
                        type="number"
                        value={serviceForm.price}
                        onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        value={serviceForm.description}
                        onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddService}>Add Service</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {servicesLoading ? (
                <div className="flex justify-center items-center py-12"><LoadingSpinner /></div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service._id}>
                        <TableCell>{service.name}</TableCell>
                        <TableCell>{service.price.toLocaleString()}</TableCell>
                        <TableCell>{service.description}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setEditService(service)
                                    setServiceForm({ name: service.name, price: String(service.price), description: service.description })
                                  }}
                                >
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Service</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Service Name</label>
                                    <input
                                      type="text"
                                      value={serviceForm.name}
                                      onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                                      className="w-full p-2 border rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Price (LKR)</label>
                                    <input
                                      type="number"
                                      value={serviceForm.price}
                                      onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                                      className="w-full p-2 border rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Description</label>
                                    <textarea
                                      value={serviceForm.description}
                                      onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                                      className="w-full p-2 border rounded"
                                      rows={3}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                  </DialogClose>
                                  <Button onClick={handleEditService}>Update Service</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service._id)}>Delete</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{review.client}</h4>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < review.rating ? "text-yellow-500" : "text-gray-300"}>★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{review.comment}</p>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
