"use client"
import { MainLayout } from "@/components/templates/main-layout"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"

// Lazy load components for better performance
const AboutHero = dynamic(() => import("@/components/organisms/about-hero"))
const AboutStory = dynamic(() => import("@/components/organisms/about-story"))
const TeamSection = dynamic(() => import("@/components/organisms/team-section"))
const StatsSection = dynamic(() => import("@/components/organisms/stats-section"))

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <AboutHero />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AboutStory />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <StatsSection />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <TeamSection />
        </motion.div>
      </div>
    </MainLayout>
  )
}
