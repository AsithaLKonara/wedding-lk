"use client"

import { motion } from "framer-motion"
import { Heart, Mail, Lock, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/templates/main-layout"

// Import UI components directly since they have named exports
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔐 LOGIN FORM SUBMITTED (Hardcoded Auth)');
    console.log('📧 Form data:', {
      email: formData.email,
      passwordLength: formData.password.length,
      rememberMe: formData.rememberMe
    });
    
    setIsLoading(true)
    setError('') // Clear previous errors

    try {
      // TEMPORARY: Use hardcoded authentication instead of NextAuth
      console.log('🚀 Using hardcoded authentication system...');
      
      const response = await fetch('/api/simple-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });

      const data = await response.json();
      console.log('📋 Auth response:', data);

      if (response.ok && data.success) {
        console.log('✅ Login successful, redirecting...');
        // Redirect based on user role
        switch (data.user.role) {
          case 'admin':
            router.push('/dashboard/admin');
            break;
          case 'user':
            router.push('/dashboard/user');
            break;
          case 'vendor':
            router.push('/dashboard/vendor');
            break;
          case 'wedding_planner':
            router.push('/dashboard/planner');
            break;
          default:
            router.push('/dashboard');
        }
      } else {
        console.error('❌ Login error:', data.error || data.message);
        setError(data.message || data.error || 'Login failed');
      }

      /* TEMPORARILY DISABLED: NextAuth Database Authentication
      console.log('🚀 Calling signIn with credentials...');
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      console.log('📋 SignIn result:', {
        ok: result?.ok,
        error: result?.error,
        status: result?.status,
        url: result?.url
      });

      if (result?.error) {
        console.error('❌ Login error:', result.error);
        console.error('📊 Error details:', {
          error: result.error,
          status: result.status,
          url: result.url
        });
        setError(`Login failed: ${result.error}`);
      } else if (result?.ok) {
        console.log('✅ Login successful, redirecting...');
        router.push('/dashboard')
      } else {
        console.log('⚠️ Unexpected result:', result);
        setError('Login failed: Unexpected response');
      }
      */

    } catch (error) {
      console.error('💥 CRITICAL LOGIN ERROR:', error);
      console.error('📊 Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setError(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)
    try {
      // TEMPORARILY DISABLED: Social login requires NextAuth
      console.log(`🚫 Social login (${provider}) temporarily disabled - using hardcoded auth`);
      setError(`Social login (${provider}) is temporarily disabled. Please use email/password login.`);
      
      /* TEMPORARILY DISABLED: NextAuth Social Authentication
      await signIn(provider, { callbackUrl: '/dashboard' })
      */
    } catch (error) {
      console.error('Social login error:', error)
      setError(`Social login failed: ${error.message}`);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-purple-600">
                <Heart className="h-6 w-6 text-white fill-current" />
              </div>
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>Sign in to your Wedding.lk account</CardDescription>
              
              
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="Enter your email" 
                      className="pl-10"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember"
                      name="rememberMe"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <Label htmlFor="remember" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-rose-600 hover:text-rose-500">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="w-full opacity-50" 
                  onClick={() => handleSocialLogin('google')}
                  disabled={true}
                  title="Temporarily disabled - use email/password login"
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full opacity-50"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={true}
                  title="Temporarily disabled - use email/password login"
                >
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link href="/register" className="text-rose-600 hover:text-rose-500 font-medium">
                  Sign up
                </Link>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  )
}