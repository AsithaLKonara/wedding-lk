"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Store, 
  Calendar, 
  TrendingUp, 
  MessageCircle, 
  Settings, 
  Star, 
  DollarSign, 
  Plus,
  Zap,
  Target,
  ExternalLink,
  Eye,
  Activity,
  Edit
} from "lucide-react"

import { formatCurrency, formatNumber, getRelativeTime } from "@/lib/utils/format"

interface VendorStats {
  totalBookings: number
  totalRevenue: number
  averageRating: number
  activeServices: number
  pendingBookings: number
  completedBookings: number
  monthlyRevenue: number
  revenueGrowth: number
}

interface Booking {
  id: string
  clientName: string
  service: string
  date: string
  time: string
  status: "pending" | "confirmed" | "completed" | "cancelled"
  amount: number
  guestCount: number
}

interface Service {
  id: string
  name: string
  category: string
  price: number
  isActive: boolean
  bookings: number
  rating: number
}

interface Message {
  id: string
  clientName: string
  subject: string
  content: string
  timestamp: string
  isRead: boolean
  priority: "high" | "medium" | "low"
}

export default function VendorDashboard() {
  const [stats, setStats] = useState<VendorStats>({
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    activeServices: 0,
    pendingBookings: 0,
    completedBookings: 0,
    monthlyRevenue: 0,
    revenueGrowth: 0,
  })
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVendorData()
  }, [])

  const fetchVendorData = async () => {
    try {
      setLoading(true)
      const statsRes = await fetch("/api/dashboard/vendor/stats")
      if (statsRes.ok) setStats((await statsRes.json()).stats)
      
      const bookingsRes = await fetch("/api/dashboard/vendor/bookings")
      if (bookingsRes.ok) setBookings((await bookingsRes.json()).bookings)
      
      const servicesRes = await fetch("/api/dashboard/vendor/services")
      if (servicesRes.ok) setServices((await servicesRes.json()).services)
      
      const messagesRes = await fetch("/api/dashboard/vendor/messages")
      if (messagesRes.ok) setMessages((await messagesRes.json()).messages)
    } catch (error) {
      console.error("Error fetching vendor data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookingAction = async (bookingId: string, action: string) => {
    try {
      const response = await fetch("/api/dashboard/vendor/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action }),
      })
      if (response.ok) fetchVendorData()
    } catch (error) {
      console.error("Error processing booking:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "completed": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20"
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading vendor ecosystem...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl shadow-lg shadow-blue-500/5">
            <Store className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Vendor Hub</h1>
            <p className="text-gray-400 font-medium">Scale your services and revenue</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-10 px-4">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white border-none rounded-xl h-10 px-6 font-black shadow-lg shadow-blue-500/20">
            <Plus className="h-4 w-4 mr-2" />
            ADD SERVICE
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} trend={`+${stats.revenueGrowth}% growth`} icon={DollarSign} color="emerald" />
        <MetricCard label="Bookings" value={stats.totalBookings} trend={`${stats.pendingBookings} Pending`} icon={Calendar} color="blue" />
        <MetricCard label="Avg Rating" value={stats.averageRating.toFixed(1)} trend="Verified" icon={Star} color="yellow" />
        <MetricCard label="Live Services" value={stats.activeServices} trend="Active" icon={Store} color="indigo" />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl h-12">
          <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white/10 font-black px-6 text-[10px] uppercase tracking-widest">Overview</TabsTrigger>
          <TabsTrigger value="bookings" className="rounded-lg data-[state=active]:bg-white/10 font-black px-6 text-[10px] uppercase tracking-widest">Bookings</TabsTrigger>
          <TabsTrigger value="services" className="rounded-lg data-[state=active]:bg-white/10 font-black px-6 text-[10px] uppercase tracking-widest">Services</TabsTrigger>
          <TabsTrigger value="promotions" className="rounded-lg data-[state=active]:bg-white/10 font-black px-6 text-[10px] uppercase tracking-widest">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader><CardTitle className="text-xs font-black text-white uppercase tracking-widest">Recent Activity</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <ActivityRow label="New booking from Sarah" time="1h ago" color="blue" />
                <ActivityRow label="Payment verified" time="3h ago" color="emerald" />
                <ActivityRow label="5-star review received" time="1d ago" color="yellow" />
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardHeader><CardTitle className="text-xs font-black text-white uppercase tracking-widest">Quick Actions</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <ActionBtn icon={Calendar} label="Calendar" color="blue" />
                <ActionBtn icon={MessageCircle} label="Messages" color="pink" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader><CardTitle className="text-xs font-black text-white uppercase tracking-widest">Incoming Requests</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {bookings.map(booking => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-blue-400"><Calendar className="h-6 w-6" /></div>
                    <div>
                      <p className="font-bold text-white">{booking.clientName}</p>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-tighter">{booking.service} • {booking.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-lg font-black text-emerald-400">{formatCurrency(booking.amount)}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">{booking.guestCount} Guests</p>
                    </div>
                    <Badge className={`${getStatusColor(booking.status)} uppercase text-[9px] font-black tracking-widest`}>{booking.status}</Badge>
                    {booking.status === 'pending' && (
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-black rounded-xl" onClick={() => handleBookingAction(booking.id, 'confirm')}>Confirm</Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <Card className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border-blue-500/20 group relative overflow-hidden">
            <CardContent className="pt-12 pb-10 px-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl flex items-center justify-center shadow-2xl">
                <Target className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Boost Your Business</h3>
                <p className="text-blue-100/70 font-medium">Create Meta Ads in minutes and reach thousands of Sri Lankan couples.</p>
              </div>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 font-black rounded-xl h-12 px-8 shadow-xl">
                <ExternalLink className="w-4 h-4 mr-2" />
                START PROMOTING
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ label, value, trend, icon: Icon, color }: any) {
  return (
    <Card className="bg-white/5 border-white/10 group overflow-hidden relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</CardTitle>
        <Icon className={`h-4 w-4 text-${color}-400 opacity-50 group-hover:opacity-100 transition-opacity`} />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-black text-white tracking-tighter">{value}</div>
        <p className={`text-[10px] text-${color === 'emerald' ? 'emerald' : 'gray'}-400 font-bold uppercase mt-1 tracking-tight`}>{trend}</p>
      </CardContent>
    </Card>
  )
}

function ActivityRow({ label, time, color }: any) {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/5">
      <div className={`w-2 h-2 bg-${color}-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,0,0,0.5)]`} />
      <div className="flex-1">
        <p className="text-sm font-bold text-white">{label}</p>
        <p className="text-[10px] text-gray-600 font-black uppercase mt-0.5">{time}</p>
      </div>
    </div>
  )
}

function ActionBtn({ icon: Icon, label, color }: any) {
  return (
    <Button variant="outline" className="h-24 flex flex-col justify-center items-center bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-2xl group transition-all">
      <Icon className={`h-6 w-6 mb-2 text-${color}-400 group-hover:scale-110 transition-transform`} />
      <span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
    </Button>
  )
}