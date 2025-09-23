"use client"

import { MainLayout } from "@/components/templates/main-layout"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, AlertCircle } from "lucide-react"

// Import UI components directly since they have named exports
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Import organism components directly since they have named exports
import { DashboardHeader } from "@/components/organisms/dashboard-header"
import { WeddingProgress } from "@/components/organisms/wedding-progress"
import { QuickActions } from "@/components/organisms/quick-actions"
import { UpcomingTasks } from "@/components/organisms/upcoming-tasks"
import { SavedVenues } from "@/components/organisms/saved-venues"
import { RecentActivity } from "@/components/organisms/recent-activity"

export default function DashboardPage() {
  const router = useRouter()
  
  // Onboarding/email verification state
  const [onboardingIncomplete, setOnboardingIncomplete] = useState(false)
  const [emailUnverified, setEmailUnverified] = useState(false)
  
  // Profile completion (mocked for now)
  const profileCompletion = 70
  const profileSuggestions = [
    "Add a profile photo",
    "Verify your email address",
    "Complete your onboarding steps",
    "Fill in your wedding date",
  ]
  
  useEffect(() => {
    // Check user type and redirect accordingly
    const userType = typeof window !== 'undefined' ? localStorage.getItem('userType') : null
    if (userType === 'vendor') {
      const vendorId = typeof window !== 'undefined' ? localStorage.getItem('vendorId') : null
      if (vendorId) {
        fetch(`/api/vendors?vendorId=${vendorId}`)
          .then(res => res.json())
          .then(data => {
            if (!data.vendor || !data.vendor.onboardingComplete) {
              setOnboardingIncomplete(true)
              router.replace('/dashboard/vendor/onboarding')
            }
            // Example: check email verification
            if (data.vendor && data.vendor.user && data.vendor.user.isVerified === false) {
              setEmailUnverified(true)
            }
          })
          .catch(err => {
            console.error('Error fetching vendor data:', err)
          })
      }
    } else {
      // For couples/planners, check email verification (mocked)
      const isVerified = typeof window !== 'undefined' ? localStorage.getItem('isVerified') : null
      if (isVerified === 'false') setEmailUnverified(true)
    }
  }, [router])

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Onboarding/Email Status Banner */}
          {onboardingIncomplete && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-5 w-5 text-rose-600 mr-2" />
              <AlertTitle>Finish your onboarding</AlertTitle>
              <AlertDescription>
                Please complete your onboarding steps to unlock all dashboard features.
              </AlertDescription>
            </Alert>
          )}
          {emailUnverified && (
            <Alert variant="default" className="mb-4 border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <AlertTitle>Verify your email</AlertTitle>
              <AlertDescription>
                Please verify your email address to access all features. <a href="#" className="underline">Resend verification email</a>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Profile Completion Widget */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold">Profile Completion</span>
                <span className="ml-auto text-sm text-gray-500">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              <ul className="list-disc pl-6 text-sm text-gray-600 dark:text-gray-300">
                {profileSuggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <WeddingProgress />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <QuickActions />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <SavedVenues />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <UpcomingTasks />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <RecentActivity />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
