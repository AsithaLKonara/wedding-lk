"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"

import { User, Bell, Shield, CreditCard } from "lucide-react"

import { useToast } from "@/hooks/use-toast"

// Card will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// CardTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Button will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Input will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// Label will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp"







// Dialog will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogContent will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogHeader will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogTitle will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogFooter will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogTrigger will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

// DialogClose will be imported above => <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-32 rounded-lg" /> })

export default function SettingsPage() {
  const { toast } = useToast()
  const [profile, setProfile] = useState({
    firstName: "Arjun",
    lastName: "Mendis",
    email: "arjun@example.com",
    phone: "+94 77 123 4567",
    weddingDate: "2024-06-15",
    budget: "500000",
    location: "Colombo",
  })

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailPromotions: false,
    smsReminders: true,
    pushNotifications: true,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showWeddingDate: false,
    allowMessages: true,
  })

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [show2FASetup, setShow2FASetup] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpStatus, setOtpStatus] = useState<string | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [profileErrors, setProfileErrors] = useState<any>({})
  const [is2FALoading, setIs2FALoading] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setProfileErrors({})
    // Inline validation
    let err: any = {}
    if (!profile.firstName) err.firstName = "First name is required"
    if (!profile.lastName) err.lastName = "Last name is required"
    if (!profile.email) err.email = "Email is required"
    if (!profile.phone) err.phone = "Phone is required"
    if (Object.keys(err).length > 0) {
      setProfileErrors(err)
      setIsSaving(false)
      toast({ title: "Please fix the errors above.", variant: "destructive" })
      return
    }
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      toast({ title: "Profile updated!", variant: "default" })
    }, 1000)
  }

  const handleSaveNotifications = () => {
    toast({ title: "Notification preferences saved!", variant: "default" })
  }

  const handleSavePrivacy = () => {
    toast({ title: "Privacy settings saved!", variant: "default" })
  }

  const handleEnable2FA = async () => {
    setIs2FALoading(true)
    setOtpError(null)
    try {
      const res = await fetch("/api/auth/2fa-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setOtpSent(true)
        setShow2FASetup(true)
        toast({ title: "OTP sent to your email.", variant: "default" })
      } else {
        toast({ title: data.error || "Failed to send OTP", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Failed to send OTP. Please try again.", variant: "destructive" })
    } finally {
      setIs2FALoading(false)
    }
  }

  const handleVerify2FA = async () => {
    setIs2FALoading(true)
    setOtpError(null)
    if (!otp || otp.length !== 6) {
      setOtpError("Please enter the 6-digit code.")
      setIs2FALoading(false)
      return
    }
    try {
      const res = await fetch("/api/auth/2fa-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, code: otp }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setTwoFactorEnabled(true)
        setShow2FASetup(false)
        setOtp("")
        toast({ title: "2FA enabled!", variant: "default" })
      } else {
        setOtpError(data.error || "Invalid code. Please try again.")
        toast({ title: data.error || "Invalid code. Please try again.", variant: "destructive" })
      }
    } catch (error) {
      setOtpError("Verification failed. Please try again.")
      toast({ title: "Verification failed. Please try again.", variant: "destructive" })
    } finally {
      setIs2FALoading(false)
    }
  }

  const handleDisable2FA = async () => {
    setIs2FALoading(true)
    setOtpError(null)
    try {
      // Simulate API call
      setTimeout(() => {
        setTwoFactorEnabled(false)
        setShow2FASetup(false)
        setOtp("")
        toast({ title: "2FA disabled.", variant: "default" })
        setIs2FALoading(false)
      }, 1000)
    } catch (error) {
      toast({ title: "Failed to disable 2FA.", variant: "destructive" })
      setIs2FALoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and settings</p>
      </div>

      <div className="space-y-8">
        {/* Profile Settings */}
        <Card tabIndex={0} aria-label="Profile Information" className="focus:outline-none focus:ring-2 focus:ring-rose-400">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <div className="w-16 h-16 rounded-full overflow-hidden border">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Photo</div>
                )}
              </div>
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100" />
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  aria-invalid={!!profileErrors.firstName}
                  aria-describedby="firstName-error"
                />
                {profileErrors.firstName && <div id="firstName-error" className="text-xs text-destructive">{profileErrors.firstName}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  aria-invalid={!!profileErrors.lastName}
                  aria-describedby="lastName-error"
                />
                {profileErrors.lastName && <div id="lastName-error" className="text-xs text-destructive">{profileErrors.lastName}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  aria-invalid={!!profileErrors.email}
                  aria-describedby="email-error"
                />
                {profileErrors.email && <div id="email-error" className="text-xs text-destructive">{profileErrors.email}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  aria-invalid={!!profileErrors.phone}
                  aria-describedby="phone-error"
                />
                {profileErrors.phone && <div id="phone-error" className="text-xs text-destructive">{profileErrors.phone}</div>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weddingDate">Wedding Date</Label>
                <Input
                  id="weddingDate"
                  type="date"
                  value={profile.weddingDate}
                  onChange={(e) => setProfile({ ...profile, weddingDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (LKR)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={profile.budget}
                  onChange={(e) => setProfile({ ...profile, budget: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={profile.location} onValueChange={(value) => setProfile({ ...profile, location: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Colombo">Colombo</SelectItem>
                    <SelectItem value="Kandy">Kandy</SelectItem>
                    <SelectItem value="Galle">Galle</SelectItem>
                    <SelectItem value="Negombo">Negombo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-rose-500 to-pink-600" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card tabIndex={0} aria-label="Notification Preferences" className="focus:outline-none focus:ring-2 focus:ring-rose-400">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notification Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailBookings">Email Booking Updates</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive email notifications about your bookings
                </p>
              </div>
              <Switch
                id="emailBookings"
                checked={notifications.emailBookings}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailBookings: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailPromotions">Promotional Emails</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive emails about special offers and promotions
                </p>
              </div>
              <Switch
                id="emailPromotions"
                checked={notifications.emailPromotions}
                onCheckedChange={(checked) => setNotifications({ ...notifications, emailPromotions: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="smsReminders">SMS Reminders</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive SMS reminders for important dates</p>
              </div>
              <Switch
                id="smsReminders"
                checked={notifications.smsReminders}
                onCheckedChange={(checked) => setNotifications({ ...notifications, smsReminders: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pushNotifications">Push Notifications</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications in your browser</p>
              </div>
              <Switch
                id="pushNotifications"
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
              />
            </div>

            <Button onClick={handleSaveNotifications} className="bg-gradient-to-r from-rose-500 to-pink-600">
              Save Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card tabIndex={0} aria-label="Privacy Settings" className="focus:outline-none focus:ring-2 focus:ring-rose-400">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Privacy Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="profileVisible">Public Profile</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Make your profile visible to vendors</p>
              </div>
              <Switch
                id="profileVisible"
                checked={privacy.profileVisible}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisible: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showWeddingDate">Show Wedding Date</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Display your wedding date on your profile</p>
              </div>
              <Switch
                id="showWeddingDate"
                checked={privacy.showWeddingDate}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, showWeddingDate: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowMessages">Allow Messages</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Allow vendors to send you direct messages</p>
              </div>
              <Switch
                id="allowMessages"
                checked={privacy.allowMessages}
                onCheckedChange={(checked) => setPrivacy({ ...privacy, allowMessages: checked })}
              />
            </div>

            <Button onClick={handleSavePrivacy} className="bg-gradient-to-r from-rose-500 to-pink-600">
              Save Privacy Settings
            </Button>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication */}
        <Card tabIndex={0} aria-label="Two-Factor Authentication (2FA)" className="focus:outline-none focus:ring-2 focus:ring-rose-400">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Two-Factor Authentication (2FA)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="2fa-switch">Enable 2FA</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
              </div>
              <Switch
                id="2fa-switch"
                checked={twoFactorEnabled}
                onCheckedChange={(checked) => {
                  if (checked) handleEnable2FA()
                  else handleDisable2FA()
                }}
                disabled={is2FALoading}
              />
            </div>
            {show2FASetup && (
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <InputOTP
                  value={otp}
                  onChange={setOtp}
                  maxLength={6}
                  className="mb-2"
                  aria-invalid={!!otpError}
                  aria-describedby="otp-error"
                >
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTP>
                {otpError && <div id="otp-error" className="text-xs text-destructive">{otpError}</div>}
                <Button onClick={handleVerify2FA} disabled={is2FALoading}>
                  {is2FALoading ? "Verifying..." : "Verify & Enable 2FA"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card tabIndex={0} aria-label="Account Actions" className="focus:outline-none focus:ring-2 focus:ring-rose-400">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Account Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" onClick={() => toast({ title: "Change Password coming soon!", variant: "default" })}>Change Password</Button>
              <Button variant="outline" onClick={() => toast({ title: "Download Data coming soon!", variant: "default" })}>Download Data</Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Account</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                  </DialogHeader>
                  <div>Are you sure you want to delete your account? This action cannot be undone.</div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={() => { toast({ title: "Account deleted.", variant: "destructive" }); }}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
