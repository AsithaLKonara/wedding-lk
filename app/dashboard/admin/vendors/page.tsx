"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Eye, Edit, Trash2, CheckCircle, XCircle, Building2, Star, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/hooks/use-auth'

interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  category: string
  location: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  isVerified: boolean
  rating: number
  totalBookings: number
  totalRevenue: number
  joinedDate: string
}

export default function AdminVendorsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter()
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'suspended'>('all')

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/admin/vendors');
        if (response.ok) {
          const data = await response.json();
          if (data.success) setVendors(data.vendors);
        }
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, [user, authLoading, router])

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl shadow-lg shadow-purple-500/5">
            <Building2 className="h-8 w-8 text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Vendor Ecosystem</h1>
            <p className="text-gray-400 font-medium">Verify and manage platform partners</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Partners" value={vendors.length} icon={Building2} color="purple" />
        <StatCard label="Live Now" value={vendors.filter(v => v.status === 'approved').length} icon={CheckCircle} color="emerald" />
        <StatCard label="In Queue" value={vendors.filter(v => v.status === 'pending').length} icon={Star} color="yellow" />
        <StatCard label="Ecosystem Rev" value={`LKR ${formatNumber(vendors.reduce((s, v) => s + v.totalRevenue, 0))}`} icon={DollarSign} color="blue" />
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <Input
              placeholder="Search by vendor name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-purple-500/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-purple-500/50 h-10"
          >
            <option value="all">All Status</option>
            <option value="pending" className="bg-[#0e0918]">PENDING</option>
            <option value="approved" className="bg-[#0e0918]">APPROVED</option>
            <option value="rejected" className="bg-[#0e0918]">REJECTED</option>
          </select>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Partner Details</th>
                <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Niche</th>
                <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Performance</th>
                <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredVendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-bold text-white group-hover:text-purple-400 transition-colors">{vendor.name}</div>
                      <div className="text-xs text-gray-500">{vendor.location}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6"><Badge variant="outline" className="border-white/10 text-gray-400 uppercase text-[9px] font-black tracking-widest">{vendor.category}</Badge></td>
                  <td className="py-4 px-6"><Badge className={`${getStatusColor(vendor.status)} uppercase text-[9px] font-black tracking-widest`}>{vendor.status}</Badge></td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-black text-white">{vendor.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-gray-600 font-bold ml-1 uppercase">{vendor.totalBookings} BOOKINGS</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <ActionBtn icon={Eye} color="blue" />
                      <ActionBtn icon={Edit} color="purple" />
                      <ActionBtn icon={Trash2} color="red" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-500`}><Icon className="w-6 h-6" /></div>
        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-black text-white tracking-tighter">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ActionBtn({ icon: Icon, color }: any) {
  const colors: any = { blue: 'text-blue-400 hover:bg-blue-400/10', purple: 'text-purple-400 hover:bg-purple-400/10', red: 'text-red-400 hover:bg-red-400/10' }
  return (
    <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-lg ${colors[color]}`}>
      <Icon className="w-4 h-4" />
    </Button>
  )
}

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}