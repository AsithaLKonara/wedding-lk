"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Heart, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  MapPin, 
  ArrowRight, 
  XCircle,
  Briefcase,
  Sparkles,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user", // 'user' is Couples role
    location: {
      city: "",
      province: ""
    }
  })
  const router = useRouter()

  const roles = [
    {
      id: "user",
      title: "Couple",
      description: "Planning your dream wedding? Book premium venues, find top-rated vendors, and manage your budget with absolute ease.",
      icon: <Heart className="w-8 h-8 text-rose-500 fill-rose-500/10" />,
      color: "border-rose-500/20 hover:border-rose-500 bg-rose-500/5",
      selectedColor: "border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/50"
    },
    {
      id: "vendor",
      title: "Vendor",
      description: "Are you a wedding professional? Showcase your services, receive high-quality leads, and manage bookings seamlessly.",
      icon: <Briefcase className="w-8 h-8 text-pink-500" />,
      color: "border-pink-500/20 hover:border-pink-500 bg-pink-500/5",
      selectedColor: "border-pink-500 bg-pink-500/10 ring-2 ring-pink-500/50"
    },
    {
      id: "wedding_planner",
      title: "Wedding Planner",
      description: "Collaborating or coordinating events? Manage client wedding timelines, coordinate vendors, and build a brilliant catalog.",
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      color: "border-purple-500/20 hover:border-purple-500 bg-purple-500/5",
      selectedColor: "border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/50"
    }
  ]

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

  const handleRoleSelect = (roleId: string) => {
    setFormData(prev => ({ ...prev, role: roleId }))
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

        <Card className="bg-card/50 backdrop-blur-xl border-border shadow-2xl rounded-[2.5rem] overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader className="text-center pt-10 pb-6">
                  <span className="text-xs font-black tracking-widest uppercase text-rose-500 mb-2 block">Step 1 of 2</span>
                  <CardTitle className="text-3xl font-black text-white mb-2">Who are you?</CardTitle>
                  <CardDescription className="text-muted-foreground">Select your account type to begin registration</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    {roles.map((role) => {
                      const isSelected = formData.role === role.id
                      return (
                        <div
                          key={role.id}
                          onClick={() => handleRoleSelect(role.id)}
                          className={`flex items-start space-x-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                            isSelected ? role.selectedColor : role.color
                          }`}
                        >
                          <div className="p-3 bg-white/5 rounded-xl">
                            {role.icon}
                          </div>
                          <div className="flex-1 space-y-1">
                            <h3 className="font-bold text-lg text-white">{role.title}</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">{role.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <Button 
                    onClick={() => setStep(2)} 
                    className="w-full h-14 bg-gradient-to-r from-rose-500 to-purple-600 rounded-2xl font-bold text-lg shadow-xl shadow-rose-500/20 mt-6 flex items-center justify-center gap-2"
                  >
                    <span>Continue Registration</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </CardContent>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CardHeader className="text-center pt-10 pb-6 relative">
                  <button 
                    onClick={() => setStep(1)} 
                    className="absolute left-8 top-10 text-muted-foreground hover:text-white transition-colors flex items-center gap-1 text-sm font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <span className="text-xs font-black tracking-widest uppercase text-rose-500 mb-2 block">Step 2 of 2</span>
                  <CardTitle className="text-3xl font-black text-white mb-2">Create Account</CardTitle>
                  <CardDescription className="text-muted-foreground">Registering as a {roles.find(r => r.id === formData.role)?.title}</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
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
                          <Input name="name" placeholder="John Doe" onChange={handleInputChange} required className="pl-12 h-14 bg-background/50 rounded-2xl border-border/50 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold ml-1 text-white">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input name="email" type="email" placeholder="john@example.com" onChange={handleInputChange} required className="pl-12 h-14 bg-background/50 rounded-2xl border-border/50 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-sm font-bold ml-1 text-white">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input name="phone" placeholder="+94 7X XXX XXXX" onChange={handleInputChange} required className="pl-12 h-14 bg-background/50 rounded-2xl border-border/50 text-white" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-bold ml-1 text-white">City</Label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input name="location.city" placeholder="Colombo" onChange={handleInputChange} required className="pl-12 h-14 bg-background/50 rounded-2xl border-border/50 text-white" />
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
                          className="pl-12 pr-12 h-14 bg-background/50 rounded-2xl border-border/50 text-white"
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
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        <p className="mt-8 text-center text-muted-foreground font-medium">
          Already have an account?{" "}
          <Link href="/auth/signin" className="text-white font-black hover:text-rose-500 transition-colors underline underline-offset-4 decoration-rose-500/30">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
