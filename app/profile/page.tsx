"use client"

import dynamic from "next/dynamic"

import { MainLayout } from "@/components/templates/main-layout"

import { motion } from "framer-motion"

const ProfileHeader = dynamic(() => import("@/components/organisms/profile-header"), { ssr: false })

const ProfileTabs = dynamic(() => import("@/components/organisms/profile-tabs"), { ssr: false })

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
