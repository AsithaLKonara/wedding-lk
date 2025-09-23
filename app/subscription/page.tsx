"use client"

import dynamic from "next/dynamic"

import { MainLayout } from "@/components/templates/main-layout"

import { motion } from "framer-motion"

const SubscriptionPlans = dynamic(() => import("@/components/organisms/subscription-plans"), { ssr: false })

const CommissionTracker = dynamic(() => import("@/components/organisms/commission-tracker"), { ssr: false })

export default function SubscriptionPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Vendor Subscription Plans
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Choose the perfect plan to grow your wedding business in Sri Lanka with our comprehensive platform
              </p>
            </motion.div>
          </div>
        </div>

        <SubscriptionPlans />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <CommissionTracker />
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}
