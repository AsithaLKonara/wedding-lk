"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { InputOTP, InputOTPSlot } from "@/components/ui/input-otp"
import { signIn } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [step, setStep] = useState<"login" | "2fa">("login")
  const [otp, setOtp] = useState("")
  const [otpStatus, setOtpStatus] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const { toast } = useToast()
  const [errors, setErrors] = useState<any>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setOtpStatus(null)
    // Inline validation
    let err: any = {}
    if (!formData.email) err.email = "Email is required"
    if (!formData.password) err.password = "Password is required"
    if (Object.keys(err).length > 0) {
      setErrors(err)
      setIsLoading(false)
      toast({ title: "Please fix the errors above.", variant: "destructive" })
      return
    }
    try {
      // 1. Check credentials
      const res = await fetch("/api/auth/2fa-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStep("2fa")
        setUserEmail(formData.email)
        setIsLoading(false)
        return
      }
      window.location.href = "/dashboard"
    } catch (error) {
      toast({ title: "Login failed. Please try again.", variant: "destructive" })
      setIsLoading(false)
    }
  }

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setOtpStatus(null)
    if (!otp || otp.length !== 6) {
      setOtpStatus("Please enter the 6-digit code.")
      setIsLoading(false)
      return
    }
    try {
      const res = await fetch("/api/auth/2fa-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, code: otp }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        toast({ title: "2FA verified!", variant: "default" })
        window.location.href = "/dashboard"
      } else {
        setOtpStatus(data.error || "Invalid code. Please try again.")
        toast({ title: data.error || "Invalid code. Please try again.", variant: "destructive" })
      }
    } catch (error) {
      setOtpStatus("Verification failed. Please try again.")
      toast({ title: "Verification failed. Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your account to continue planning your dream wedding
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Social Login Buttons */}
        <div className="flex justify-center mb-6">
          <Button variant="outline" className="w-full max-w-xs" onClick={() => signIn("google")}>Google</Button>
        </div>
        {step === "login" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input id="remember" type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <Link href="/forgot-password" className="text-sm text-rose-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-600" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            {otpStatus && <div className="text-center text-rose-600 text-sm">{otpStatus}</div>}
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-rose-600 hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handle2FASubmit} className="space-y-4">
            <Label htmlFor="otp">Enter 2FA Code</Label>
            <div className="flex gap-2 mb-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Input
                  key={i}
                  value={otp[i] || ''}
                  onChange={(e) => {
                    const newOtp = otp.split('')
                    newOtp[i] = e.target.value
                    setOtp(newOtp.join(''))
                  }}
                  maxLength={1}
                  className="w-10 h-10 text-center"
                />
              ))}
            </div>
            <Button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-pink-600" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify & Sign In"}
            </Button>
            {otpStatus && <div className="text-center text-rose-600 text-sm">{otpStatus}</div>}
          </form>
        )}
      </CardContent>
    </Card>
  )
}


export default LoginForm;
