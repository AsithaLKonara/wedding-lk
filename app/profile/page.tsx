"use client"

import React from "react"
import { MainLayout } from "@/components/templates/main-layout"
import { ProfileHeader } from "@/components/organisms/profile-header"
import { ProfileTabs } from "@/components/organisms/profile-tabs"
import { motion } from "framer-motion"

export default function ProfilePage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ProfileHeader />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProfileTabs />
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'
