"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Mail, ArrowRight, Heart } from "lucide-react"
import { toast } from "sonner"

import { Suspense } from "react"

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Welcome back!")
        router.push(callbackUrl)
        router.refresh()
      } else {
        toast.error(data.error || "Invalid credentials")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0918] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-white mb-4">
            <Heart className="h-8 w-8 text-rose-500 fill-current" />
            <span className="text-2xl font-bold">Wedding.lk</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-gray-400 mt-2">Sign in to your account to continue</p>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 text-white shadow-2xl">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-white/5 border-white/10 focus:border-rose-500 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs text-rose-500 hover:text-rose-400 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 bg-white/5 border-white/10 focus:border-rose-500 text-white placeholder:text-gray-600"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white h-12 font-bold shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </Button>
              <div className="text-center text-sm text-gray-400">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-rose-500 hover:text-rose-400 font-bold">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Demo credentials info */}
        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Demo Credentials</p>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
            <div>
              <p className="font-bold text-white">Admin</p>
              <p>admin@weddinglk.com</p>
            </div>
            <div>
              <p className="font-bold text-white">Vendor</p>
              <p>vendor@example.com</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-600 mt-2">Password: password123</p>
        </div>
      </motion.div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0e0918] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  )
}
