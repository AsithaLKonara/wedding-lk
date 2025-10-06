"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar } from "lucide-react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

export function RegisterForm() {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    userType: "",
    weddingDate: "",
    businessName: "",
    category: "",
    businessAddress: "",
    businessCity: "",
    businessProvince: "",
    businessPhone: "",
    businessEmail: "",
    website: "",
    businessDescription: "",
  })
  const [errors, setErrors] = useState<any>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    try {
      // Inline validation
      let err: any = {}
      if (!formData.firstName) err.firstName = "First name is required"
      if (!formData.lastName) err.lastName = "Last name is required"
      if (!formData.email) err.email = "Email is required"
      if (!formData.phone) err.phone = "Phone is required"
      if (!formData.password) err.password = "Password is required"
      if (formData.password !== formData.confirmPassword) err.confirmPassword = "Passwords don't match!"
      if (!formData.userType) err.userType = "Please select your role"
      if (Object.keys(err).length > 0) {
        setErrors(err)
        setIsLoading(false)
        toast({ title: "Please fix the errors above.", variant: "destructive" })
        return
      }
      // Prepare payload
      let payload: any = { ...formData }
      if (formData.userType !== "vendor") {
        // Remove vendor fields for non-vendors
        delete payload.businessName
        delete payload.category
        delete payload.businessAddress
        delete payload.businessCity
        delete payload.businessProvince
        delete payload.businessPhone
        delete payload.businessEmail
        delete payload.website
        delete payload.businessDescription
      }
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) {
        if (formData.userType === "vendor" && data.vendor && data.vendor._id) {
          localStorage.setItem('vendorId', data.vendor._id)
        }
        toast({ title: "Registration successful! Please check your email to verify your account.", variant: "default" })
        window.location.href = "/dashboard"
      } else {
        toast({ title: data.error || "Registration failed", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Registration failed. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Create Account</h1>
        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
        <CardDescription className="text-center">
          Join thousands of couples planning their perfect wedding
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Social Sign Up Buttons */}
        <div className="flex justify-center mb-6">
          <Button variant="outline" className="w-full max-w-xs" onClick={() => signIn("google")}>Sign up with Google</Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="pl-10"
                  required
                  aria-invalid={!!errors.firstName}
                  aria-describedby="firstName-error"
                />
              </div>
              {errors.firstName && <div id="firstName-error" className="text-xs text-destructive">{errors.firstName}</div>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                aria-invalid={!!errors.lastName}
                aria-describedby="lastName-error"
              />
              {errors.lastName && <div id="lastName-error" className="text-xs text-destructive">{errors.lastName}</div>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10"
                required
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
            </div>
            {errors.email && <div id="email-error" className="text-xs text-destructive">{errors.email}</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="phone"
                type="tel"
                placeholder="+94 77 123 4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10"
                required
                aria-invalid={!!errors.phone}
                aria-describedby="phone-error"
              />
            </div>
            {errors.phone && <div id="phone-error" className="text-xs text-destructive">{errors.phone}</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">I am a</Label>
            <Select value={formData.userType} onValueChange={(value) => setFormData({ ...formData, userType: value })}>
              <SelectTrigger aria-invalid={!!errors.userType} aria-describedby="userType-error">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="couple">Couple planning a wedding</SelectItem>
                <SelectItem value="vendor">Wedding vendor/service provider</SelectItem>
                <SelectItem value="planner">Wedding planner</SelectItem>
              </SelectContent>
            </Select>
            {errors.userType && <div id="userType-error" className="text-xs text-destructive">{errors.userType}</div>}
          </div>

          {formData.userType === "couple" && (
            <div className="space-y-2">
              <Label htmlFor="weddingDate">Expected Wedding Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="weddingDate"
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>
          )}

          {formData.userType === "vendor" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  placeholder="Business name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                  aria-invalid={!!errors.businessName}
                  aria-describedby="businessName-error"
                />
                {errors.businessName && <div id="businessName-error" className="text-xs text-destructive">{errors.businessName}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger aria-invalid={!!errors.category} aria-describedby="category-error">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photographer">Photographer</SelectItem>
                    <SelectItem value="decorator">Decorator</SelectItem>
                    <SelectItem value="caterer">Caterer</SelectItem>
                    <SelectItem value="music">Music/Band/DJ</SelectItem>
                    <SelectItem value="planner">Planner</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <div id="category-error" className="text-xs text-destructive">{errors.category}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessAddress">Business Address</Label>
                <Input
                  id="businessAddress"
                  placeholder="Business address"
                  value={formData.businessAddress}
                  onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                  required
                  aria-invalid={!!errors.businessAddress}
                  aria-describedby="businessAddress-error"
                />
                {errors.businessAddress && <div id="businessAddress-error" className="text-xs text-destructive">{errors.businessAddress}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessCity">Business City</Label>
                <Input
                  id="businessCity"
                  placeholder="Business city"
                  value={formData.businessCity}
                  onChange={(e) => setFormData({ ...formData, businessCity: e.target.value })}
                  required
                  aria-invalid={!!errors.businessCity}
                  aria-describedby="businessCity-error"
                />
                {errors.businessCity && <div id="businessCity-error" className="text-xs text-destructive">{errors.businessCity}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessProvince">Business Province</Label>
                <Input
                  id="businessProvince"
                  placeholder="Business province"
                  value={formData.businessProvince}
                  onChange={(e) => setFormData({ ...formData, businessProvince: e.target.value })}
                  required
                  aria-invalid={!!errors.businessProvince}
                  aria-describedby="businessProvince-error"
                />
                {errors.businessProvince && <div id="businessProvince-error" className="text-xs text-destructive">{errors.businessProvince}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessPhone">Business Phone</Label>
                <Input
                  id="businessPhone"
                  placeholder="Business phone"
                  value={formData.businessPhone}
                  onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                  required
                  aria-invalid={!!errors.businessPhone}
                  aria-describedby="businessPhone-error"
                />
                {errors.businessPhone && <div id="businessPhone-error" className="text-xs text-destructive">{errors.businessPhone}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  placeholder="Business email"
                  value={formData.businessEmail}
                  onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                  required
                  aria-invalid={!!errors.businessEmail}
                  aria-describedby="businessEmail-error"
                />
                {errors.businessEmail && <div id="businessEmail-error" className="text-xs text-destructive">{errors.businessEmail}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="Website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  aria-invalid={!!errors.website}
                  aria-describedby="website-error"
                />
                {errors.website && <div id="website-error" className="text-xs text-destructive">{errors.website}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessDescription">Business Description</Label>
                <Input
                  id="businessDescription"
                  placeholder="Business description"
                  value={formData.businessDescription}
                  onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                  aria-invalid={!!errors.businessDescription}
                  aria-describedby="businessDescription-error"
                />
                {errors.businessDescription && <div id="businessDescription-error" className="text-xs text-destructive">{errors.businessDescription}</div>}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 pr-10"
                required
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && <div id="password-error" className="text-xs text-destructive">{errors.password}</div>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="pl-10 pr-10"
                required
                aria-invalid={!!errors.confirmPassword}
                aria-describedby="confirmPassword-error"
              />
            </div>
            {errors.confirmPassword && <div id="confirmPassword-error" className="text-xs text-destructive">{errors.confirmPassword}</div>}
          </div>

          <div className="flex items-center space-x-2">
            <input id="terms" type="checkbox" className="h-4 w-4 rounded border-gray-300" required />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-rose-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-rose-600 hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-600" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-rose-600 hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
