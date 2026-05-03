"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Eye, Edit, Trash2, Shield, UserCheck, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/hooks/use-auth'

interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'vendor' | 'wedding_planner' | 'admin'
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  isVerified: boolean
  createdAt: string
  lastLogin?: string
  bookings: number
  reviews: number
}

export default function AdminUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'vendor' | 'wedding_planner' | 'admin'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'suspended' | 'pending'>('all')

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/admin/users');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.users.map((u: any) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: u.status,
            isVerified: u.isVerified,
            createdAt: u.createdAt,
            lastLogin: u.lastLogin,
            bookings: 0,
            reviews: 0
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return
    if (!user) { router.push('/auth/signin'); return; }
    if (user.role !== 'admin') { router.push('/unauthorized'); return; }
    fetchUsers();
  }, [user, authLoading, router])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'inactive': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      case 'suspended': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'vendor': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'wedding_planner': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'user': return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <Shield className="h-8 w-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">User Directory</h1>
            <p className="text-gray-400 font-medium">Manage platform access and roles</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="Total Base" value={users.length} icon={Shield} color="purple" />
        <StatCard label="Active Now" value={users.filter(u => u.status === 'active').length} icon={UserCheck} color="emerald" />
        <StatCard label="Suspended" value={users.filter(u => u.status === 'suspended').length} icon={UserX} color="red" />
        <StatCard label="Pending" value={users.filter(u => u.status === 'pending').length} icon={Filter} color="yellow" />
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-red-500/50"
              />
            </div>
            <div className="flex gap-2">
              <SelectFilter value={roleFilter} onChange={setRoleFilter} options={['all', 'user', 'vendor', 'wedding_planner', 'admin']} label="All Roles" />
              <SelectFilter value={statusFilter} onChange={setStatusFilter} options={['all', 'active', 'inactive', 'suspended', 'pending']} label="All Status" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">User Identity</th>
                <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Platform Role</th>
                <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Activity</th>
                <th className="py-4 px-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-bold text-white group-hover:text-red-400 transition-colors">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge className={`${getRoleColor(user.role)} uppercase text-[9px] font-black tracking-widest`}>{user.role.replace('_', ' ')}</Badge>
                  </td>
                  <td className="py-4 px-6">
                    <Badge className={`${getStatusColor(user.status)} uppercase text-[9px] font-black tracking-widest`}>{user.status}</Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-[10px] font-black text-gray-500 uppercase">Joined {new Date(user.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1">
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
        {filteredUsers.length === 0 && <EmptyState />}
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
          <p className="text-2xl font-black text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function SelectFilter({ value, onChange, options, label }: any) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white/5 border border-white/10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-red-500/50 h-10"
    >
      <option value="all">{label}</option>
      {options.filter((o: any) => o !== 'all').map((opt: any) => (
        <option key={opt} value={opt} className="bg-[#0e0918]">{opt.toUpperCase().replace('_', ' ')}</option>
      ))}
    </select>
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

function EmptyState() {
  return (
    <div className="text-center py-20 bg-white/5">
      <Shield className="w-12 h-12 text-gray-700 mx-auto mb-4 opacity-20" />
      <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Zero results found</h3>
    </div>
  )
}