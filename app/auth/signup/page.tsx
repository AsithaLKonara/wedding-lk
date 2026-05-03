"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Heart, Mail, Lock, Eye, EyeOff, User, Phone, MapPin, ArrowRight, XCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
    location: {
      city: "",
      province: ""
    }
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent as keyof typeof prev] as object, [child]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Registration failed. Please try again.")
        setIsLoading(false)
        return
      }

      router.push("/auth/signin?message=Registration successful! Please sign in.")
    } catch (err) {
      setError("Network error. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0918] flex items-center justify-center p-4 relative overflow-hidden py-12">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">
              Wedding<span className="text-rose-500">.lk</span>
            </span>
          </Link>
        </div>

        <Card className="bg-card/50 backdrop-blur-xl border-border shadow-2xl rounded-[2.5rem]">
          <CardHeader className="text-center pt-10">
            <CardTitle className="text-3xl font-black text-white mb-2">Create Account</CardTitle>
            <CardDescription className="text-muted-foreground">Join Sri Lanka's largest wedding community</CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {error && (
              <Alert variant="destructive" className="mb-6 bg-rose-500/10 border-rose-500/50 text-rose-200 rounded-2xl">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold ml-1 text-white">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input name="name" placeholder="John Doe" onChange={handleInputChange} required className="pl-12 h-14 bg-background/50 rounded-2xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold ml-1 text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input name="email" type="email" placeholder="john@example.com" onChange={handleInputChange} required className="pl-12 h-14 bg-background/50 rounded-2xl" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-bold ml-1 text-white">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input name="phone" placeholder="+94 7X XXX XXXX" onChange={handleInputChange} required className="pl-12 h-14 bg-background/50 rounded-2xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold ml-1 text-white">City</Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input name="location.city" placeholder="Colombo" onChange={handleInputChange} required className="pl-12 h-14 bg-background/50 rounded-2xl" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold ml-1 text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onChange={handleInputChange}
                    required
                    className="pl-12 pr-12 h-14 bg-background/50 rounded-2xl"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full h-14 bg-gradient-to-r from-rose-500 to-purple-600 rounded-2xl font-bold text-lg shadow-xl shadow-rose-500/20">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <p className="mt-8 text-center text-muted-foreground font-medium">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-white font-black hover:text-rose-500 transition-colors underline underline-offset-4 decoration-rose-500/30">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
