"use client"

import dynamic from "next/dynamic"

import { useState } from "react"
import { MainLayout } from "@/components/templates/main-layout"

import { motion } from "framer-motion"

const PlanningTabs = dynamic(() => import("@/components/organisms/planning-tabs"), { ssr: false })

const WeddingChecklist = dynamic(() => import("@/components/organisms/wedding-checklist"), { ssr: false })

const WeddingTimeline = dynamic(() => import("@/components/organisms/wedding-timeline"), { ssr: false })

const BudgetTracker = dynamic(() => import("@/components/organisms/budget-tracker"), { ssr: false })

const GuestList = dynamic(() => import("@/components/organisms/guest-list"), { ssr: false })

export default function PlanningPage() {
  const [activeTab, setActiveTab] = useState("checklist")

  const renderTabContent = () => {
    switch (activeTab) {
      case "checklist":
        return <WeddingChecklist />
      case "timeline":
        return <WeddingTimeline />
      case "budget":
        return <BudgetTracker />
      case "guests":
        return <GuestList />
      default:
        return <WeddingChecklist />
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Wedding Planning Tools
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Stay organized and on track for your perfect day
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <PlanningTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </MainLayout>
  )
}
