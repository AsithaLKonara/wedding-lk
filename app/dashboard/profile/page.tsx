"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from "lucide-react"
import { formatDate } from "@/lib/utils/format"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  role: string
  location: {
    country: string
    state: string
    city: string
    zipCode?: string
  }
  preferences: {
    language: string
    currency: string
    timezone: string
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
    marketing: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
  isVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    // Mock user profile data
    const mockProfile: UserProfile = {
      id: "user-1",
      name: "Sarah & John",
      email: "user1@example.com",
      phone: "+94 77 111 1111",
      role: "user",
      location: {
        country: "Sri Lanka",
        state: "Western Province",
        city: "Colombo",
        zipCode: "00300"
      },
      preferences: {
        language: "en",
        currency: "LKR",
        timezone: "Asia/Colombo",
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        marketing: {
          email: false,
          sms: false,
          push: false
        }
      },
      isVerified: true,
      isActive: true,
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-09-04T00:00:00.000Z"
    }

    setTimeout(() => {
      setProfile(mockProfile)
      setLoading(false)
    }, 1000)
  }, [])

  const handleEdit = () => {
    setEditForm(profile || {})
    setEditing(true)
  }

  const handleSave = () => {
    if (profile) {
      setProfile({ ...profile, ...editForm })
      setEditing(false)
      setEditForm({})
    }
  }

  const handleCancel = () => {
    setEditing(false)
    setEditForm({})
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin": return "Administrator"
      case "vendor": return "Vendor"
      case "wedding_planner": return "Wedding Planner"
      case "user": return "User"
      default: return "User"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Profile not found</h3>
            <p className="text-gray-600">Unable to load your profile information.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src="/images/user-1-avatar.jpg" />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">{profile.name}</CardTitle>
              <CardDescription>
                <Badge variant={profile.isVerified ? "default" : "secondary"}>
                  {profile.isVerified ? "Verified" : "Unverified"}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {profile.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {profile.phone}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {profile.location.city}, {profile.location.state}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  {getRoleDisplayName(profile.role)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Joined {formatDate(profile.createdAt)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                {!editing && (
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={editForm.phone || ""}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editForm.location?.city || ""}
                      onChange={(e) => setEditForm({ 
                        ...editForm, 
                        location: { ...editForm.location, city: e.target.value }
                      })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                    <p className="text-lg">{profile.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                    <p className="text-lg">{profile.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Location</Label>
                    <p className="text-lg">{profile.location.city}, {profile.location.state}, {profile.location.country}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Language</Label>
                    <p className="text-lg">{profile.preferences.language.toUpperCase()}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Currency</Label>
                    <p className="text-lg">{profile.preferences.currency}</p>
                  </div>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium text-gray-500 mb-2 block">Notifications</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <Badge variant={profile.preferences.notifications.email ? "default" : "secondary"}>
                        {profile.preferences.notifications.email ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SMS Notifications</span>
                      <Badge variant={profile.preferences.notifications.sms ? "default" : "secondary"}>
                        {profile.preferences.notifications.sms ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Push Notifications</span>
                      <Badge variant={profile.preferences.notifications.push ? "default" : "secondary"}>
                        {profile.preferences.notifications.push ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle>Account Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Account Status</span>
                  <Badge variant={profile.isActive ? "default" : "destructive"}>
                    {profile.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Verification Status</span>
                  <Badge variant={profile.isVerified ? "default" : "secondary"}>
                    {profile.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Updated</span>
                  <span className="text-sm text-gray-600">{formatDate(profile.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
